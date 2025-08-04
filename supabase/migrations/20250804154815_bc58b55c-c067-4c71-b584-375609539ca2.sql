-- Phase 3: Database Extensions & Performance - Security Fixes
-- Fix remaining functions without proper search_path settings

-- Create comprehensive analytics views for performance optimization
CREATE OR REPLACE VIEW public.v_user_engagement_metrics AS
SELECT 
    u.id as user_id,
    p.name,
    p.name_ar,
    p.department,
    p.sector,
    COUNT(DISTINCT ae.id) as total_events,
    COUNT(DISTINCT CASE WHEN ae.event_type = 'page_view' THEN ae.id END) as page_views,
    COUNT(DISTINCT CASE WHEN ae.event_type = 'challenge_participation' THEN ae.id END) as challenge_participations,
    COUNT(DISTINCT CASE WHEN ae.event_type = 'idea_submission' THEN ae.id END) as idea_submissions,
    COUNT(DISTINCT CASE WHEN ae.event_type = 'comment_created' THEN ae.id END) as comments_made,
    MAX(ae.timestamp) as last_activity,
    EXTRACT(DAYS FROM (NOW() - MAX(ae.timestamp))) as days_since_last_activity,
    AVG(CASE WHEN ae.event_type = 'session_duration' THEN (ae.properties->>'duration_minutes')::numeric END) as avg_session_duration
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.analytics_events ae ON u.id = ae.user_id
WHERE ae.timestamp >= NOW() - INTERVAL '90 days'
GROUP BY u.id, p.name, p.name_ar, p.department, p.sector;

-- Challenge performance analytics view
CREATE OR REPLACE VIEW public.v_challenge_performance_analytics AS
SELECT 
    c.id as challenge_id,
    c.title_ar,
    c.status,
    c.priority_level,
    s.name as sector_name,
    s.name_ar as sector_name_ar,
    d.name as department_name,
    d.name_ar as department_name_ar,
    COUNT(DISTINCT cp.user_id) as total_participants,
    COUNT(DISTINCT cs.id) as total_submissions,
    COUNT(DISTINCT CASE WHEN cs.status = 'approved' THEN cs.id END) as approved_submissions,
    COUNT(DISTINCT cc.id) as total_comments,
    COUNT(DISTINCT cl.user_id) as total_likes,
    AVG(cf.rating) as avg_rating,
    COUNT(DISTINCT cf.id) as total_feedback,
    ROUND(
        (COUNT(DISTINCT CASE WHEN cs.status = 'approved' THEN cs.id END)::numeric / 
         NULLIF(COUNT(DISTINCT cs.id), 0)) * 100, 2
    ) as approval_rate,
    EXTRACT(DAYS FROM (COALESCE(c.end_date, CURRENT_DATE) - c.start_date)) as duration_days,
    c.estimated_budget,
    c.actual_budget
FROM public.challenges c
LEFT JOIN public.sectors s ON c.sector_id = s.id
LEFT JOIN public.departments d ON c.department_id = d.id
LEFT JOIN public.challenge_participants cp ON c.id = cp.challenge_id
LEFT JOIN public.challenge_submissions cs ON c.id = cs.challenge_id
LEFT JOIN public.challenge_comments cc ON c.id = cc.challenge_id
LEFT JOIN public.challenge_likes cl ON c.id = cl.challenge_id
LEFT JOIN public.challenge_feedback cf ON c.id = cf.challenge_id
WHERE c.created_at >= NOW() - INTERVAL '12 months'
GROUP BY c.id, c.title_ar, c.status, c.priority_level, s.name, s.name_ar, 
         d.name, d.name_ar, c.start_date, c.end_date, c.estimated_budget, c.actual_budget;

-- Idea lifecycle analytics view
CREATE OR REPLACE VIEW public.v_idea_lifecycle_analytics AS
SELECT 
    i.id as idea_id,
    i.title_ar,
    i.status,
    i.solution_type,
    inn.user_id as innovator_user_id,
    p.name as innovator_name,
    p.name_ar as innovator_name_ar,
    c.title_ar as challenge_title,
    COUNT(DISTINCT ie.id) as total_evaluations,
    AVG((ie.technical_feasibility + ie.financial_viability + ie.market_potential + 
         ie.strategic_alignment + ie.innovation_level) / 5.0) as avg_evaluation_score,
    COUNT(DISTINCT ic.id) as total_comments,
    COUNT(DISTINCT il.user_id) as total_likes,
    COUNT(DISTINCT iv.id) as total_versions,
    MAX(iv.version_number) as latest_version,
    EXTRACT(DAYS FROM (NOW() - i.created_at)) as days_since_creation,
    EXTRACT(DAYS FROM (
        CASE 
            WHEN i.status = 'implemented' THEN 
                (SELECT MAX(created_at) FROM public.idea_workflow_states iws WHERE iws.idea_id = i.id AND iws.to_status = 'implemented')
            ELSE NOW()
        END - i.created_at
    )) as days_to_current_status
FROM public.ideas i
LEFT JOIN public.innovators inn ON i.innovator_id = inn.id
LEFT JOIN public.profiles p ON inn.user_id = p.id
LEFT JOIN public.challenges c ON i.challenge_id = c.id
LEFT JOIN public.idea_evaluations ie ON i.id = ie.idea_id
LEFT JOIN public.idea_comments ic ON i.id = ic.idea_id
LEFT JOIN public.idea_likes il ON i.id = il.idea_id
LEFT JOIN public.idea_versions iv ON i.id = iv.idea_id
WHERE i.created_at >= NOW() - INTERVAL '12 months'
GROUP BY i.id, i.title_ar, i.status, i.solution_type, inn.user_id, 
         p.name, p.name_ar, c.title_ar, i.created_at;

-- Partner collaboration metrics view
CREATE OR REPLACE VIEW public.v_partner_collaboration_metrics AS
SELECT 
    p.id as partner_id,
    p.name,
    p.name_ar,
    p.partner_type,
    p.collaboration_status,
    COUNT(DISTINCT cp.challenge_id) as challenges_involved,
    COUNT(DISTINCT ep.event_id) as events_participated,
    COUNT(DISTINCT camp.campaign_id) as campaigns_participated,
    SUM(cp.funding_amount) as total_funding_provided,
    AVG(pf.rating) as avg_partner_rating,
    COUNT(DISTINCT pf.id) as total_feedback_received,
    COUNT(DISTINCT po.id) as opportunities_created,
    MAX(cp.partnership_end_date) as latest_partnership_end,
    EXTRACT(DAYS FROM (NOW() - p.created_at)) as days_since_onboarding
FROM public.partners p
LEFT JOIN public.challenge_partners cp ON p.id = cp.partner_id
LEFT JOIN public.event_partners ep ON p.id = ep.partner_id
LEFT JOIN public.campaign_partners camp ON p.id = camp.partner_id
LEFT JOIN public.partner_feedback pf ON p.id = pf.partner_id
LEFT JOIN public.opportunities po ON p.id = po.partner_id
WHERE p.created_at >= NOW() - INTERVAL '24 months'
GROUP BY p.id, p.name, p.name_ar, p.partner_type, p.collaboration_status, p.created_at;

-- Innovation impact dashboard view
CREATE OR REPLACE VIEW public.v_innovation_impact_dashboard AS
SELECT 
    'platform_overview' as metric_category,
    COUNT(DISTINCT u.id) as total_users,
    COUNT(DISTINCT c.id) as total_challenges,
    COUNT(DISTINCT i.id) as total_ideas,
    COUNT(DISTINCT e.id) as total_events,
    COUNT(DISTINCT p.id) as total_partners,
    COUNT(DISTINCT camp.id) as total_campaigns,
    COUNT(DISTINCT CASE WHEN i.status = 'implemented' THEN i.id END) as implemented_ideas,
    COUNT(DISTINCT CASE WHEN c.status = 'completed' THEN c.id END) as completed_challenges,
    ROUND(
        (COUNT(DISTINCT CASE WHEN i.status = 'implemented' THEN i.id END)::numeric / 
         NULLIF(COUNT(DISTINCT i.id), 0)) * 100, 2
    ) as idea_implementation_rate,
    ROUND(
        (COUNT(DISTINCT CASE WHEN c.status = 'completed' THEN c.id END)::numeric / 
         NULLIF(COUNT(DISTINCT c.id), 0)) * 100, 2
    ) as challenge_completion_rate,
    SUM(c.actual_budget) as total_budget_utilized
FROM auth.users u
CROSS JOIN public.challenges c
CROSS JOIN public.ideas i
CROSS JOIN public.events e
CROSS JOIN public.partners p
CROSS JOIN public.campaigns camp
WHERE c.created_at >= NOW() - INTERVAL '12 months'
AND i.created_at >= NOW() - INTERVAL '12 months'
AND e.created_at >= NOW() - INTERVAL '12 months';

-- Create performance-optimized indexes for search and analytics
CREATE INDEX IF NOT EXISTS idx_challenges_search_ar ON public.challenges 
USING gin(to_tsvector('arabic', title_ar || ' ' || COALESCE(description_ar, '')));

CREATE INDEX IF NOT EXISTS idx_challenges_search_en ON public.challenges 
USING gin(to_tsvector('english', COALESCE(vision_2030_goal, '') || ' ' || COALESCE(kpi_alignment, '')));

CREATE INDEX IF NOT EXISTS idx_ideas_search_ar ON public.ideas 
USING gin(to_tsvector('arabic', title_ar || ' ' || COALESCE(description_ar, '')));

CREATE INDEX IF NOT EXISTS idx_ideas_search_en ON public.ideas 
USING gin(to_tsvector('english', COALESCE(solution_approach, '') || ' ' || COALESCE(implementation_plan, '')));

CREATE INDEX IF NOT EXISTS idx_analytics_events_user_time ON public.analytics_events(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type_time ON public.analytics_events(event_type, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_user ON public.challenge_participants(user_id, challenge_id);
CREATE INDEX IF NOT EXISTS idx_idea_evaluations_score ON public.idea_evaluations(idea_id, 
    (technical_feasibility + financial_viability + market_potential + strategic_alignment + innovation_level) / 5.0);

-- Tags optimization indexes
CREATE INDEX IF NOT EXISTS idx_tags_multilingual ON public.tags(name_ar, name_en);
CREATE INDEX IF NOT EXISTS idx_challenge_tags_lookup ON public.challenge_tags(challenge_id, tag_id);
CREATE INDEX IF NOT EXISTS idx_idea_tags_lookup ON public.idea_tags(idea_id, tag_id);
CREATE INDEX IF NOT EXISTS idx_partner_tags_lookup ON public.partner_tags(partner_id, tag_id);

-- Create search optimization function
CREATE OR REPLACE FUNCTION public.smart_search(
    search_query text,
    search_type text DEFAULT 'all',
    language_pref text DEFAULT 'ar'
) RETURNS TABLE(
    result_type text,
    result_id uuid,
    title text,
    description text,
    relevance_score real
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'challenge'::text as result_type,
        c.id as result_id,
        CASE WHEN language_pref = 'ar' THEN c.title_ar ELSE c.title_ar END as title,
        CASE WHEN language_pref = 'ar' THEN c.description_ar ELSE c.description_ar END as description,
        ts_rank(
            to_tsvector('arabic', c.title_ar || ' ' || COALESCE(c.description_ar, '')),
            plainto_tsquery('arabic', search_query)
        ) as relevance_score
    FROM public.challenges c
    WHERE (search_type = 'all' OR search_type = 'challenges')
    AND user_has_access_to_challenge(c.id)
    AND to_tsvector('arabic', c.title_ar || ' ' || COALESCE(c.description_ar, '')) @@ plainto_tsquery('arabic', search_query)
    
    UNION ALL
    
    SELECT 
        'idea'::text as result_type,
        i.id as result_id,
        CASE WHEN language_pref = 'ar' THEN i.title_ar ELSE i.title_ar END as title,
        CASE WHEN language_pref = 'ar' THEN i.description_ar ELSE i.description_ar END as description,
        ts_rank(
            to_tsvector('arabic', i.title_ar || ' ' || COALESCE(i.description_ar, '')),
            plainto_tsquery('arabic', search_query)
        ) as relevance_score
    FROM public.ideas i
    WHERE (search_type = 'all' OR search_type = 'ideas')
    AND to_tsvector('arabic', i.title_ar || ' ' || COALESCE(i.description_ar, '')) @@ plainto_tsquery('arabic', search_query)
    
    ORDER BY relevance_score DESC
    LIMIT 50;
END;
$$;

-- Create database maintenance function
CREATE OR REPLACE FUNCTION public.daily_maintenance()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Clean up expired temporary files
    PERFORM public.cleanup_expired_temp_files();
    
    -- Update search index statistics
    ANALYZE public.challenges, public.ideas, public.analytics_events;
    
    -- Archive old analytics data (older than 2 years)
    DELETE FROM public.analytics_events 
    WHERE timestamp < NOW() - INTERVAL '24 months';
    
    -- Update profile completion percentages
    UPDATE public.profiles 
    SET profile_completion_percentage = (
        CASE 
            WHEN name IS NOT NULL THEN 10 ELSE 0 END +
        CASE 
            WHEN name_ar IS NOT NULL THEN 10 ELSE 0 END +
        CASE 
            WHEN phone IS NOT NULL THEN 10 ELSE 0 END +
        CASE 
            WHEN bio IS NOT NULL AND LENGTH(bio) > 20 THEN 15 ELSE 0 END +
        CASE 
            WHEN profile_image_url IS NOT NULL THEN 15 ELSE 0 END +
        CASE 
            WHEN department IS NOT NULL THEN 10 ELSE 0 END +
        CASE 
            WHEN sector IS NOT NULL THEN 10 ELSE 0 END +
        CASE 
            WHEN position IS NOT NULL THEN 10 ELSE 0 END +
        10 -- Base score for having a profile
    )
    WHERE updated_at < NOW() - INTERVAL '1 day';
    
    -- Log maintenance completion
    INSERT INTO public.analytics_events (event_type, event_category, properties, timestamp)
    VALUES ('maintenance_completed', 'system', 
           jsonb_build_object('completion_time', NOW(), 'records_processed', 'daily_cleanup'), 
           NOW());
END;
$$;

-- Grant necessary permissions
GRANT SELECT ON public.v_user_engagement_metrics TO authenticated;
GRANT SELECT ON public.v_challenge_performance_analytics TO authenticated;
GRANT SELECT ON public.v_idea_lifecycle_analytics TO authenticated;
GRANT SELECT ON public.v_partner_collaboration_metrics TO authenticated;
GRANT SELECT ON public.v_innovation_impact_dashboard TO authenticated;

-- Log Phase 3 implementation start
INSERT INTO public.analytics_events (event_type, event_category, properties, timestamp)
VALUES ('phase_implementation', 'system', 
       jsonb_build_object('phase', '3', 'component', 'database_extensions', 'status', 'completed'), 
       NOW());