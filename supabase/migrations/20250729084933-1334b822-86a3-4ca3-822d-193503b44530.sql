-- Create comprehensive idea management system tables and functions

-- 1. Idea Comments Table
CREATE TABLE IF NOT EXISTS public.idea_comments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
    author_id UUID NOT NULL,
    parent_comment_id UUID REFERENCES public.idea_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    comment_type VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Idea Attachments Table
CREATE TABLE IF NOT EXISTS public.idea_attachments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(100),
    description TEXT,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Idea Workflow States Table
CREATE TABLE IF NOT EXISTS public.idea_workflow_states (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
    from_status VARCHAR(50),
    to_status VARCHAR(50) NOT NULL,
    triggered_by UUID NOT NULL,
    reason TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Idea Assignments Table
CREATE TABLE IF NOT EXISTS public.idea_assignments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
    assigned_to UUID NOT NULL,
    assigned_by UUID NOT NULL,
    assignment_type VARCHAR(50) NOT NULL, -- reviewer, evaluator, implementer, etc.
    due_date DATE,
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Idea Notifications Table
CREATE TABLE IF NOT EXISTS public.idea_notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL,
    sender_id UUID,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Idea Version History Table
CREATE TABLE IF NOT EXISTS public.idea_versions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    changes_summary TEXT,
    changed_by UUID NOT NULL,
    field_changes JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. Idea Tags Table
CREATE TABLE IF NOT EXISTS public.idea_tags (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7), -- hex color
    category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. Idea Tag Links Table
CREATE TABLE IF NOT EXISTS public.idea_tag_links (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.idea_tags(id) ON DELETE CASCADE,
    added_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(idea_id, tag_id)
);

-- 9. Idea Collaboration Teams Table
CREATE TABLE IF NOT EXISTS public.idea_collaboration_teams (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
    member_id UUID NOT NULL,
    role VARCHAR(50) NOT NULL, -- lead, contributor, reviewer, observer
    permissions JSONB, -- specific permissions for this member
    added_by UUID NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, removed
    UNIQUE(idea_id, member_id)
);

-- 10. Idea Lifecycle Milestones Table
CREATE TABLE IF NOT EXISTS public.idea_lifecycle_milestones (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
    milestone_type VARCHAR(50) NOT NULL, -- submission, review_start, evaluation_complete, etc.
    title VARCHAR(255) NOT NULL,
    description TEXT,
    achieved_date TIMESTAMP WITH TIME ZONE,
    target_date DATE,
    is_required BOOLEAN DEFAULT true,
    order_sequence INTEGER,
    status VARCHAR(20) DEFAULT 'pending', -- pending, achieved, missed, cancelled
    achieved_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 11. Idea Approval Workflow Table
CREATE TABLE IF NOT EXISTS public.idea_approval_workflows (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
    approver_id UUID NOT NULL,
    approval_level INTEGER NOT NULL, -- 1, 2, 3 for multiple approval levels
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, delegated
    decision_date TIMESTAMP WITH TIME ZONE,
    decision_reason TEXT,
    delegation_to UUID, -- if delegated to someone else
    is_required BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 12. Idea Analytics Table
CREATE TABLE IF NOT EXISTS public.idea_analytics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL,
    metric_data JSONB,
    recorded_date DATE DEFAULT CURRENT_DATE,
    recorded_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.idea_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_workflow_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_tag_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_collaboration_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_lifecycle_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_approval_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Idea Comments Policies
CREATE POLICY "Users can view comments on ideas they have access to"
ON public.idea_comments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.ideas i 
        WHERE i.id = idea_comments.idea_id 
        AND (
            -- Users can see their own ideas' comments
            EXISTS (SELECT 1 FROM public.innovators inn WHERE inn.id = i.innovator_id AND inn.user_id = auth.uid())
            -- Team members can see all comments
            OR EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid())
            -- Admins can see all
            OR has_role(auth.uid(), 'admin'::app_role)
        )
    )
);

CREATE POLICY "Users can create comments on accessible ideas"
ON public.idea_comments FOR INSERT
WITH CHECK (
    author_id = auth.uid() AND
    EXISTS (
        SELECT 1 FROM public.ideas i 
        WHERE i.id = idea_comments.idea_id 
        AND (
            EXISTS (SELECT 1 FROM public.innovators inn WHERE inn.id = i.innovator_id AND inn.user_id = auth.uid())
            OR EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid())
            OR has_role(auth.uid(), 'admin'::app_role)
        )
    )
);

-- Idea Attachments Policies
CREATE POLICY "Users can view attachments on accessible ideas"
ON public.idea_attachments FOR SELECT
USING (
    is_public = true OR
    uploaded_by = auth.uid() OR
    EXISTS (
        SELECT 1 FROM public.ideas i 
        WHERE i.id = idea_attachments.idea_id 
        AND (
            EXISTS (SELECT 1 FROM public.innovators inn WHERE inn.id = i.innovator_id AND inn.user_id = auth.uid())
            OR EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid())
            OR has_role(auth.uid(), 'admin'::app_role)
        )
    )
);

CREATE POLICY "Users can upload attachments to accessible ideas"
ON public.idea_attachments FOR INSERT
WITH CHECK (
    uploaded_by = auth.uid() AND
    EXISTS (
        SELECT 1 FROM public.ideas i 
        WHERE i.id = idea_attachments.idea_id 
        AND (
            EXISTS (SELECT 1 FROM public.innovators inn WHERE inn.id = i.innovator_id AND inn.user_id = auth.uid())
            OR EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid())
            OR has_role(auth.uid(), 'admin'::app_role)
        )
    )
);

-- Workflow States Policies
CREATE POLICY "Users can view workflow states for accessible ideas"
ON public.idea_workflow_states FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.ideas i 
        WHERE i.id = idea_workflow_states.idea_id 
        AND (
            EXISTS (SELECT 1 FROM public.innovators inn WHERE inn.id = i.innovator_id AND inn.user_id = auth.uid())
            OR EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid())
            OR has_role(auth.uid(), 'admin'::app_role)
        )
    )
);

-- Team members can create workflow state changes
CREATE POLICY "Team members can create workflow state changes"
ON public.idea_workflow_states FOR INSERT
WITH CHECK (
    triggered_by = auth.uid() AND (
        EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid())
        OR has_role(auth.uid(), 'admin'::app_role)
    )
);

-- General policies for remaining tables (team members and admins can manage)
CREATE POLICY "Team members can manage idea assignments" ON public.idea_assignments FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can view their notifications" ON public.idea_notifications FOR SELECT
USING (recipient_id = auth.uid());

CREATE POLICY "Team members can send notifications" ON public.idea_notifications FOR INSERT
WITH CHECK (
    sender_id = auth.uid() AND (
        EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid())
        OR has_role(auth.uid(), 'admin'::app_role)
    )
);

CREATE POLICY "Users can view idea versions for accessible ideas" ON public.idea_versions FOR SELECT
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

CREATE POLICY "All users can view tags" ON public.idea_tags FOR SELECT USING (true);

CREATE POLICY "Team members can manage tags" ON public.idea_tags FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can view tag links for accessible ideas" ON public.idea_tag_links FOR SELECT
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

CREATE POLICY "Team members can manage collaboration teams" ON public.idea_collaboration_teams FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Team members can manage lifecycle milestones" ON public.idea_lifecycle_milestones FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Team members can manage approval workflows" ON public.idea_approval_workflows FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Team members can manage analytics" ON public.idea_analytics FOR ALL
USING (
    EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
);

-- Create Workflow Management Functions

-- Function to trigger workflow state change
CREATE OR REPLACE FUNCTION public.trigger_idea_workflow_change(
    p_idea_id UUID,
    p_to_status VARCHAR(50),
    p_reason TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    current_status VARCHAR(50);
    workflow_result BOOLEAN := false;
BEGIN
    -- Get current status
    SELECT status INTO current_status FROM public.ideas WHERE id = p_idea_id;
    
    IF current_status IS NULL THEN
        RAISE EXCEPTION 'Idea not found';
    END IF;
    
    -- Log workflow state change
    INSERT INTO public.idea_workflow_states (
        idea_id, from_status, to_status, triggered_by, reason
    ) VALUES (
        p_idea_id, current_status, p_to_status, auth.uid(), p_reason
    );
    
    -- Update idea status
    UPDATE public.ideas 
    SET status = p_to_status, updated_at = now() 
    WHERE id = p_idea_id;
    
    -- Trigger notifications based on status change
    PERFORM public.send_idea_workflow_notifications(p_idea_id, current_status, p_to_status);
    
    workflow_result := true;
    RETURN workflow_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to send workflow notifications
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
    -- Get idea details
    SELECT i.title_ar, inn.user_id INTO idea_title, innovator_user_id
    FROM public.ideas i
    JOIN public.innovators inn ON i.innovator_id = inn.id
    WHERE i.id = p_idea_id;
    
    -- Create notification title and message based on status change
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
            RETURN; -- No notification for other status changes
    END CASE;
    
    -- Send notification to innovator
    INSERT INTO public.idea_notifications (
        idea_id, recipient_id, sender_id, notification_type, title, message
    ) VALUES (
        p_idea_id, innovator_user_id, auth.uid(), 'status_change', notification_title, notification_message
    );
    
    -- Also add to general notifications table if it exists
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create idea version snapshot
CREATE OR REPLACE FUNCTION public.create_idea_version_snapshot() RETURNS TRIGGER AS $$
BEGIN
    -- Only create snapshot if significant fields changed
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for version tracking
CREATE TRIGGER idea_version_tracking_trigger
    AFTER UPDATE ON public.ideas
    FOR EACH ROW
    EXECUTE FUNCTION public.create_idea_version_snapshot();

-- Function to calculate idea analytics
CREATE OR REPLACE FUNCTION public.calculate_idea_analytics(p_idea_id UUID) RETURNS VOID AS $$
DECLARE
    evaluation_count INTEGER;
    avg_score DECIMAL;
    comment_count INTEGER;
    view_count INTEGER;
BEGIN
    -- Count evaluations
    SELECT COUNT(*) INTO evaluation_count
    FROM public.idea_evaluations
    WHERE idea_id = p_idea_id;
    
    -- Calculate average score
    SELECT AVG((technical_feasibility + financial_viability + market_potential + strategic_alignment + innovation_level) / 5.0)
    INTO avg_score
    FROM public.idea_evaluations
    WHERE idea_id = p_idea_id;
    
    -- Count comments
    SELECT COUNT(*) INTO comment_count
    FROM public.idea_comments
    WHERE idea_id = p_idea_id;
    
    -- Record analytics
    INSERT INTO public.idea_analytics (idea_id, metric_name, metric_value, recorded_by) VALUES
        (p_idea_id, 'evaluation_count', evaluation_count, auth.uid()),
        (p_idea_id, 'average_evaluation_score', COALESCE(avg_score, 0), auth.uid()),
        (p_idea_id, 'comment_count', comment_count, auth.uid())
    ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create updated_at triggers for all new tables
CREATE TRIGGER update_idea_comments_updated_at
    BEFORE UPDATE ON public.idea_comments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_idea_assignments_updated_at
    BEFORE UPDATE ON public.idea_assignments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_idea_approval_workflows_updated_at
    BEFORE UPDATE ON public.idea_approval_workflows
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default idea tags
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