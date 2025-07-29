-- Complete RLS policies for all new tables
CREATE POLICY "team_members_manage_attachments" ON public.idea_attachments FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "team_members_manage_workflow_states" ON public.idea_workflow_states FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "team_members_manage_assignments" ON public.idea_assignments FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "users_view_notifications" ON public.idea_notifications FOR SELECT
USING (recipient_id = auth.uid());

CREATE POLICY "team_members_send_notifications" ON public.idea_notifications FOR INSERT
WITH CHECK (
    sender_id = auth.uid() AND (
        EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid())
        OR has_role(auth.uid(), 'admin'::app_role)
    )
);

CREATE POLICY "users_view_versions" ON public.idea_versions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.ideas i 
        WHERE i.id = idea_versions.idea_id 
        AND (
            EXISTS (SELECT 1 FROM public.innovators inn WHERE inn.id = i.innovator_id AND inn.user_id = auth.uid())
            OR EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid())
            OR has_role(auth.uid(), 'admin'::app_role)
        )
    )
);

CREATE POLICY "all_users_view_tags" ON public.idea_tags FOR SELECT USING (true);

CREATE POLICY "team_members_manage_tags" ON public.idea_tags FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "users_view_tag_links" ON public.idea_tag_links FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.ideas i 
        WHERE i.id = idea_tag_links.idea_id 
        AND (
            EXISTS (SELECT 1 FROM public.innovators inn WHERE inn.id = i.innovator_id AND inn.user_id = auth.uid())
            OR EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid())
            OR has_role(auth.uid(), 'admin'::app_role)
        )
    )
);

CREATE POLICY "team_members_manage_tag_links" ON public.idea_tag_links FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "team_members_manage_collaboration_teams" ON public.idea_collaboration_teams FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "team_members_manage_milestones" ON public.idea_lifecycle_milestones FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "team_members_manage_approvals" ON public.idea_approval_workflows FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "team_members_manage_analytics" ON public.idea_analytics FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
);

-- Create workflow functions with secure search path
CREATE OR REPLACE FUNCTION public.trigger_idea_workflow_change(
    p_idea_id UUID,
    p_to_status VARCHAR(50),
    p_reason TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    current_status VARCHAR(50);
    workflow_result BOOLEAN := false;
BEGIN
    SELECT status INTO current_status FROM public.ideas WHERE id = p_idea_id;
    
    IF current_status IS NULL THEN
        RAISE EXCEPTION 'Idea not found';
    END IF;
    
    INSERT INTO public.idea_workflow_states (
        idea_id, from_status, to_status, triggered_by, reason
    ) VALUES (
        p_idea_id, current_status, p_to_status, auth.uid(), p_reason
    );
    
    UPDATE public.ideas 
    SET status = p_to_status, updated_at = now() 
    WHERE id = p_idea_id;
    
    PERFORM public.send_idea_workflow_notifications(p_idea_id, current_status, p_to_status);
    
    workflow_result := true;
    RETURN workflow_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Create notification function with secure search path
CREATE OR REPLACE FUNCTION public.send_idea_workflow_notifications(
    p_idea_id UUID,
    p_from_status VARCHAR(50),
    p_to_status VARCHAR(50)
) RETURNS VOID AS $$
DECLARE
    idea_title VARCHAR(255);
    innovator_user_id UUID;
    notification_title VARCHAR(255);
    notification_message TEXT;
BEGIN
    SELECT i.title_ar, inn.user_id INTO idea_title, innovator_user_id
    FROM public.ideas i
    JOIN public.innovators inn ON i.innovator_id = inn.id
    WHERE i.id = p_idea_id;
    
    CASE p_to_status
        WHEN 'under_review' THEN
            notification_title := 'فكرتك قيد المراجعة';
            notification_message := 'تم قبول فكرة "' || idea_title || '" وهي الآن قيد المراجعة من قبل فريق الخبراء.';
        WHEN 'approved' THEN
            notification_title := 'تم قبول فكرتك!';
            notification_message := 'تهانينا! تم قبول فكرة "' || idea_title || '" وستنتقل إلى مرحلة التطوير.';
        WHEN 'rejected' THEN
            notification_title := 'تحديث حالة الفكرة';
            notification_message := 'للأسف، لم يتم قبول فكرة "' || idea_title || '" في هذا الوقت. يمكنك مراجعة التعليقات وإعادة التقديم.';
        WHEN 'in_development' THEN
            notification_title := 'فكرتك قيد التطوير';
            notification_message := 'فكرة "' || idea_title || '" انتقلت إلى مرحلة التطوير. سيتم التواصل معك قريباً.';
        WHEN 'implemented' THEN
            notification_title := 'تم تنفيذ فكرتك!';
            notification_message := 'تهانينا! تم تنفيذ فكرة "' || idea_title || '" بنجاح.';
        ELSE
            RETURN;
    END CASE;
    
    INSERT INTO public.idea_notifications (
        idea_id, recipient_id, sender_id, notification_type, title, message
    ) VALUES (
        p_idea_id, innovator_user_id, auth.uid(), 'status_change', notification_title, notification_message
    );
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications') THEN
        PERFORM public.send_notification(
            innovator_user_id,
            notification_title,
            notification_message,
            'info',
            jsonb_build_object('idea_id', p_idea_id, 'status_change', p_from_status || ' -> ' || p_to_status)
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Version tracking function with secure search path
CREATE OR REPLACE FUNCTION public.create_idea_version_snapshot() RETURNS TRIGGER AS $$
BEGIN
    IF OLD.title_ar IS DISTINCT FROM NEW.title_ar OR 
       OLD.description_ar IS DISTINCT FROM NEW.description_ar OR
       OLD.status IS DISTINCT FROM NEW.status OR
       OLD.solution_approach IS DISTINCT FROM NEW.solution_approach OR
       OLD.implementation_plan IS DISTINCT FROM NEW.implementation_plan THEN
       
        INSERT INTO public.idea_versions (
            idea_id,
            version_number,
            changes_summary,
            changed_by,
            field_changes
        ) VALUES (
            NEW.id,
            COALESCE((SELECT MAX(version_number) FROM public.idea_versions WHERE idea_id = NEW.id), 0) + 1,
            CASE 
                WHEN OLD.status IS DISTINCT FROM NEW.status THEN 'تغيير الحالة من ' || OLD.status || ' إلى ' || NEW.status
                ELSE 'تحديث محتوى الفكرة'
            END,
            auth.uid(),
            jsonb_build_object(
                'title_ar', jsonb_build_object('old', OLD.title_ar, 'new', NEW.title_ar),
                'description_ar', jsonb_build_object('old', OLD.description_ar, 'new', NEW.description_ar),
                'status', jsonb_build_object('old', OLD.status, 'new', NEW.status)
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Create triggers
DROP TRIGGER IF EXISTS idea_version_tracking_trigger ON public.ideas;
CREATE TRIGGER idea_version_tracking_trigger
    AFTER UPDATE ON public.ideas
    FOR EACH ROW
    EXECUTE FUNCTION public.create_idea_version_snapshot();

-- Analytics function with secure search path
CREATE OR REPLACE FUNCTION public.calculate_idea_analytics(p_idea_id UUID) RETURNS VOID AS $$
DECLARE
    evaluation_count INTEGER;
    avg_score DECIMAL;
    comment_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO evaluation_count
    FROM public.idea_evaluations
    WHERE idea_id = p_idea_id;
    
    SELECT AVG((technical_feasibility + financial_viability + market_potential + strategic_alignment + innovation_level) / 5.0)
    INTO avg_score
    FROM public.idea_evaluations
    WHERE idea_id = p_idea_id;
    
    SELECT COUNT(*) INTO comment_count
    FROM public.idea_comments
    WHERE idea_id = p_idea_id;
    
    INSERT INTO public.idea_analytics (idea_id, metric_name, metric_value, recorded_by) VALUES
        (p_idea_id, 'evaluation_count', evaluation_count, auth.uid()),
        (p_idea_id, 'average_evaluation_score', COALESCE(avg_score, 0), auth.uid()),
        (p_idea_id, 'comment_count', comment_count, auth.uid())
    ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Insert default tags
INSERT INTO public.idea_tags (name, description, color, category) VALUES
    ('مبتكرة', 'فكرة مبتكرة ومميزة', '#10B981', 'innovation'),
    ('سريعة التنفيذ', 'يمكن تنفيذها بسرعة', '#3B82F6', 'implementation'),
    ('عالية التأثير', 'لها تأثير كبير', '#EF4444', 'impact'),
    ('منخفضة التكلفة', 'تكلفة تنفيذ منخفضة', '#8B5CF6', 'cost'),
    ('تقنية', 'تتطلب حلول تقنية', '#F59E0B', 'technical'),
    ('اجتماعية', 'تركز على الجانب الاجتماعي', '#06B6D4', 'social'),
    ('اقتصادية', 'لها جدوى اقتصادية', '#84CC16', 'economic'),
    ('بيئية', 'صديقة للبيئة', '#22C55E', 'environmental')
ON CONFLICT (name) DO NOTHING;