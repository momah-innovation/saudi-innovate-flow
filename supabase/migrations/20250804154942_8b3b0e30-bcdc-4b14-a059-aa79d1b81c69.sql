-- Phase 3: Database Extensions & Performance - Fixed SQL Syntax
-- Create comprehensive analytics views for performance optimization

-- User engagement metrics view
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

-- Create performance-optimized indexes for search and analytics
CREATE INDEX IF NOT EXISTS idx_challenges_search_ar ON public.challenges 
USING gin(to_tsvector('arabic', title_ar || ' ' || COALESCE(description_ar, '')));

CREATE INDEX IF NOT EXISTS idx_challenges_search_en ON public.challenges 
USING gin(to_tsvector('english', COALESCE(vision_2030_goal, '') || ' ' || COALESCE(kpi_alignment, '')));

CREATE INDEX IF NOT EXISTS idx_ideas_search_ar ON public.ideas 
USING gin(to_tsvector('arabic', title_ar || ' ' || COALESCE(description_ar, '')));

CREATE INDEX IF NOT EXISTS idx_analytics_events_user_time ON public.analytics_events(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type_time ON public.analytics_events(event_type, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_user ON public.challenge_participants(user_id, challenge_id);

-- Tags optimization indexes
CREATE INDEX IF NOT EXISTS idx_tags_multilingual ON public.tags(name_ar, name_en);
CREATE INDEX IF NOT EXISTS idx_challenge_tags_lookup ON public.challenge_tags(challenge_id, tag_id);
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

-- Grant necessary permissions
GRANT SELECT ON public.v_user_engagement_metrics TO authenticated;
GRANT SELECT ON public.v_challenge_performance_analytics TO authenticated;