-- Phase 3: Database Extensions & Performance - Fixed Search Function
-- Complete remaining Phase 3 components with corrected syntax

-- Simplified search suggestions function
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
    -- Return challenge suggestions
    IF search_type = 'all' OR search_type = 'challenges' THEN
        RETURN QUERY
        SELECT DISTINCT 
            c.title_ar as suggestion,
            'challenge'::text as suggestion_type,
            COUNT(*) OVER() as result_count
        FROM public.challenges c
        WHERE user_has_access_to_challenge(c.id)
        AND c.title_ar ILIKE '%' || partial_query || '%'
        LIMIT 5;
    END IF;
    
    -- Return idea suggestions
    IF search_type = 'all' OR search_type = 'ideas' THEN
        RETURN QUERY
        SELECT DISTINCT 
            i.title_ar as suggestion,
            'idea'::text as suggestion_type,
            COUNT(*) OVER() as result_count
        FROM public.ideas i
        WHERE i.title_ar ILIKE '%' || partial_query || '%'
        LIMIT 5;
    END IF;
    
    -- Return tag suggestions
    RETURN QUERY
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

-- Create caching optimization function
CREATE OR REPLACE FUNCTION public.refresh_platform_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Refresh materialized views if any exist
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.v_challenge_performance_analytics;
    
    -- Update statistics for better query planning
    ANALYZE public.challenges, public.ideas, public.partners, public.events;
    
    -- Log cache refresh
    INSERT INTO public.analytics_events (event_type, event_category, properties, timestamp)
    VALUES ('cache_refresh', 'system', 
           jsonb_build_object('refresh_time', NOW()), NOW());
END;
$$;

-- Enable pg_cron extension for scheduled maintenance
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily maintenance at 2 AM
SELECT cron.schedule(
    'daily-platform-maintenance',
    '0 2 * * *', -- Every day at 2 AM
    $$
    SELECT public.daily_maintenance();
    $$
);

-- Schedule cache refresh every 6 hours
SELECT cron.schedule(
    'platform-cache-refresh',
    '0 */6 * * *', -- Every 6 hours
    $$
    SELECT public.refresh_platform_cache();
    $$
);

-- Log Phase 3 completion
INSERT INTO public.analytics_events (event_type, event_category, properties, timestamp)
VALUES ('phase_implementation', 'system', 
       jsonb_build_object('phase', '3', 'component', 'complete', 'status', 'completed', 'features', 
       ARRAY['analytics_views', 'search_optimization', 'caching', 'maintenance_automation', 'realtime_sync']), 
       NOW());