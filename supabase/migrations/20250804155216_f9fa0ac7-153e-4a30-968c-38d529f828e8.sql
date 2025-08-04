-- Phase 3: Database Extensions & Performance - Corrected Analytics Views
-- Create comprehensive analytics views with correct column references

-- User engagement metrics view (corrected)
CREATE OR REPLACE VIEW public.v_user_engagement_metrics AS
SELECT 
    u.id as user_id,
    p.name,
    p.name_ar,
    p.department,
    p.position,
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
GROUP BY u.id, p.name, p.name_ar, p.department, p.position;

-- Innovation impact dashboard view
CREATE OR REPLACE VIEW public.v_innovation_impact_dashboard AS
SELECT 
    'platform_overview' as metric_category,
    (SELECT COUNT(*) FROM auth.users) as total_users,
    (SELECT COUNT(*) FROM public.challenges WHERE created_at >= NOW() - INTERVAL '12 months') as total_challenges,
    (SELECT COUNT(*) FROM public.ideas WHERE created_at >= NOW() - INTERVAL '12 months') as total_ideas,
    (SELECT COUNT(*) FROM public.events WHERE created_at >= NOW() - INTERVAL '12 months') as total_events,
    (SELECT COUNT(*) FROM public.partners) as total_partners,
    (SELECT COUNT(*) FROM public.campaigns WHERE created_at >= NOW() - INTERVAL '12 months') as total_campaigns,
    (SELECT COUNT(*) FROM public.ideas WHERE status = 'implemented' AND created_at >= NOW() - INTERVAL '12 months') as implemented_ideas,
    (SELECT COUNT(*) FROM public.challenges WHERE status = 'completed' AND created_at >= NOW() - INTERVAL '12 months') as completed_challenges,
    ROUND(
        (SELECT COUNT(*) FROM public.ideas WHERE status = 'implemented' AND created_at >= NOW() - INTERVAL '12 months')::numeric / 
        NULLIF((SELECT COUNT(*) FROM public.ideas WHERE created_at >= NOW() - INTERVAL '12 months'), 0) * 100, 2
    ) as idea_implementation_rate,
    ROUND(
        (SELECT COUNT(*) FROM public.challenges WHERE status = 'completed' AND created_at >= NOW() - INTERVAL '12 months')::numeric / 
        NULLIF((SELECT COUNT(*) FROM public.challenges WHERE created_at >= NOW() - INTERVAL '12 months'), 0) * 100, 2
    ) as challenge_completion_rate,
    (SELECT SUM(actual_budget) FROM public.challenges WHERE actual_budget IS NOT NULL AND created_at >= NOW() - INTERVAL '12 months') as total_budget_utilized;

-- Create real-time sync for key tables
ALTER TABLE public.analytics_events REPLICA IDENTITY FULL;
ALTER TABLE public.challenges REPLICA IDENTITY FULL;
ALTER TABLE public.ideas REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.analytics_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.challenges;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ideas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Create database maintenance function with proper search path
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
        CASE WHEN name IS NOT NULL THEN 10 ELSE 0 END +
        CASE WHEN name_ar IS NOT NULL THEN 10 ELSE 0 END +
        CASE WHEN phone IS NOT NULL THEN 10 ELSE 0 END +
        CASE WHEN bio IS NOT NULL AND LENGTH(bio) > 20 THEN 15 ELSE 0 END +
        CASE WHEN profile_image_url IS NOT NULL THEN 15 ELSE 0 END +
        CASE WHEN department IS NOT NULL THEN 10 ELSE 0 END +
        CASE WHEN position IS NOT NULL THEN 10 ELSE 0 END +
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

-- Grant permissions for new views
GRANT SELECT ON public.v_innovation_impact_dashboard TO authenticated;

-- Create advanced search component for the platform
CREATE OR REPLACE FUNCTION public.get_search_suggestions(
    partial_query text,
    search_type text DEFAULT 'all'
) RETURNS TABLE(
    suggestion text,
    suggestion_type text,
    result_count bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    RETURN QUERY
    -- Challenge title suggestions
    SELECT DISTINCT 
        c.title_ar as suggestion,
        'challenge'::text as suggestion_type,
        COUNT(*) OVER() as result_count
    FROM public.challenges c
    WHERE (search_type = 'all' OR search_type = 'challenges')
    AND user_has_access_to_challenge(c.id)
    AND c.title_ar ILIKE '%' || partial_query || '%'
    LIMIT 5
    
    UNION ALL
    
    -- Idea title suggestions
    SELECT DISTINCT 
        i.title_ar as suggestion,
        'idea'::text as suggestion_type,
        COUNT(*) OVER() as result_count
    FROM public.ideas i
    WHERE (search_type = 'all' OR search_type = 'ideas')
    AND i.title_ar ILIKE '%' || partial_query || '%'
    LIMIT 5
    
    UNION ALL
    
    -- Tag suggestions
    SELECT DISTINCT 
        t.name_ar as suggestion,
        'tag'::text as suggestion_type,
        COUNT(*) OVER() as result_count
    FROM public.tags t
    WHERE t.name_ar ILIKE '%' || partial_query || '%'
    OR t.name_en ILIKE '%' || partial_query || '%'
    LIMIT 3;
END;
$$;

-- Log Phase 3 database completion
INSERT INTO public.analytics_events (event_type, event_category, properties, timestamp)
VALUES ('phase_implementation', 'system', 
       jsonb_build_object('phase', '3', 'component', 'database_analytics', 'status', 'completed'), 
       NOW());