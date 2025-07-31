-- Drop ALL foreign key constraints from analytics tables
ALTER TABLE public.opportunity_analytics DROP CONSTRAINT IF EXISTS fk_opportunity_analytics_opportunity_id;
ALTER TABLE public.opportunity_analytics DROP CONSTRAINT IF EXISTS opportunity_analytics_opportunity_id_fkey;

ALTER TABLE public.opportunity_geographic_analytics DROP CONSTRAINT IF EXISTS fk_opportunity_geographic_analytics_opportunity_id;
ALTER TABLE public.opportunity_geographic_analytics DROP CONSTRAINT IF EXISTS opportunity_geographic_analytics_opportunity_id_fkey;

ALTER TABLE public.opportunity_view_sessions DROP CONSTRAINT IF EXISTS fk_opportunity_view_sessions_opportunity_id;
ALTER TABLE public.opportunity_view_sessions DROP CONSTRAINT IF EXISTS opportunity_view_sessions_opportunity_id_fkey;

ALTER TABLE public.opportunity_applications DROP CONSTRAINT IF EXISTS fk_opportunity_applications_opportunity_id;
ALTER TABLE public.opportunity_applications DROP CONSTRAINT IF EXISTS opportunity_applications_opportunity_id_fkey;

ALTER TABLE public.opportunity_likes DROP CONSTRAINT IF EXISTS fk_opportunity_likes_opportunity_id;
ALTER TABLE public.opportunity_likes DROP CONSTRAINT IF EXISTS opportunity_likes_opportunity_id_fkey;

ALTER TABLE public.opportunity_shares DROP CONSTRAINT IF EXISTS fk_opportunity_shares_opportunity_id;
ALTER TABLE public.opportunity_shares DROP CONSTRAINT IF EXISTS opportunity_shares_opportunity_id_fkey;

ALTER TABLE public.opportunity_comments DROP CONSTRAINT IF EXISTS fk_opportunity_comments_opportunity_id;
ALTER TABLE public.opportunity_comments DROP CONSTRAINT IF EXISTS opportunity_comments_opportunity_id_fkey;

ALTER TABLE public.opportunity_bookmarks DROP CONSTRAINT IF EXISTS fk_opportunity_bookmarks_opportunity_id;
ALTER TABLE public.opportunity_bookmarks DROP CONSTRAINT IF EXISTS opportunity_bookmarks_opportunity_id_fkey;

ALTER TABLE public.opportunity_notifications DROP CONSTRAINT IF EXISTS fk_opportunity_notifications_opportunity_id;
ALTER TABLE public.opportunity_notifications DROP CONSTRAINT IF EXISTS opportunity_notifications_opportunity_id_fkey;

ALTER TABLE public.opportunity_user_journeys DROP CONSTRAINT IF EXISTS fk_opportunity_user_journeys_opportunity_id;
ALTER TABLE public.opportunity_user_journeys DROP CONSTRAINT IF EXISTS opportunity_user_journeys_opportunity_id_fkey;

ALTER TABLE public.opportunity_live_presence DROP CONSTRAINT IF EXISTS fk_opportunity_live_presence_opportunity_id;
ALTER TABLE public.opportunity_live_presence DROP CONSTRAINT IF EXISTS opportunity_live_presence_opportunity_id_fkey;

-- Clean existing analytics data
DELETE FROM public.opportunity_analytics;
DELETE FROM public.opportunity_geographic_analytics;
DELETE FROM public.opportunity_view_sessions;

-- Add correct foreign key constraints pointing to opportunities table
ALTER TABLE public.opportunity_analytics 
ADD CONSTRAINT opportunity_analytics_opportunity_id_fkey 
FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE;

ALTER TABLE public.opportunity_geographic_analytics 
ADD CONSTRAINT opportunity_geographic_analytics_opportunity_id_fkey 
FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE;

ALTER TABLE public.opportunity_view_sessions 
ADD CONSTRAINT opportunity_view_sessions_opportunity_id_fkey 
FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE;

-- Seed analytics tables with realistic data
DO $$
DECLARE
    opp_record RECORD;
    session_id TEXT;
    i INTEGER;
BEGIN
    FOR opp_record IN (SELECT id FROM public.opportunities WHERE status = 'open') LOOP
        
        -- Seed opportunity_analytics
        INSERT INTO public.opportunity_analytics (
            opportunity_id, view_count, like_count, application_count, share_count, last_updated
        ) VALUES (
            opp_record.id,
            FLOOR(RANDOM() * 500 + 50)::INTEGER,
            FLOOR(RANDOM() * 50 + 5)::INTEGER,
            FLOOR(RANDOM() * 20 + 2)::INTEGER,
            FLOOR(RANDOM() * 15 + 1)::INTEGER,
            NOW() - INTERVAL '1 day' * RANDOM() * 30
        );
        
        -- Seed opportunity_geographic_analytics
        INSERT INTO public.opportunity_geographic_analytics (
            opportunity_id, country_code, country_name, region, city, view_count, application_count, last_updated
        ) VALUES 
            (opp_record.id, 'SA', 'Saudi Arabia', 'Riyadh Province', 'Riyadh', FLOOR(RANDOM() * 200 + 20), FLOOR(RANDOM() * 8 + 1), NOW()),
            (opp_record.id, 'SA', 'Saudi Arabia', 'Makkah Province', 'Jeddah', FLOOR(RANDOM() * 150 + 15), FLOOR(RANDOM() * 6 + 1), NOW()),
            (opp_record.id, 'SA', 'Saudi Arabia', 'Eastern Province', 'Dammam', FLOOR(RANDOM() * 100 + 10), FLOOR(RANDOM() * 4 + 1), NOW()),
            (opp_record.id, 'AE', 'United Arab Emirates', 'Dubai', 'Dubai', FLOOR(RANDOM() * 80 + 8), FLOOR(RANDOM() * 3 + 1), NOW()),
            (opp_record.id, 'KW', 'Kuwait', 'Al Asimah', 'Kuwait City', FLOOR(RANDOM() * 60 + 6), FLOOR(RANDOM() * 2 + 1), NOW());
        
        -- Seed opportunity_view_sessions
        FOR i IN 1..FLOOR(RANDOM() * 30 + 20) LOOP
            session_id := 'session_' || opp_record.id || '_' || i;
            
            INSERT INTO public.opportunity_view_sessions (
                opportunity_id, session_id, user_agent, referrer_url, 
                start_time, end_time, page_views, time_spent_seconds, 
                is_bounce, country_code, city, created_at
            ) VALUES (
                opp_record.id,
                session_id,
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'https://google.com',
                NOW() - INTERVAL '1 hour' * RANDOM() * 720,
                NOW() - INTERVAL '1 hour' * RANDOM() * 720 + INTERVAL '1 minute' * (RANDOM() * 45 + 5),
                FLOOR(RANDOM() * 8 + 1)::INTEGER,
                FLOOR(RANDOM() * 600 + 30)::INTEGER,
                RANDOM() < 0.3,
                'SA',
                'Riyadh',
                NOW() - INTERVAL '1 hour' * RANDOM() * 720
            );
        END LOOP;
        
    END LOOP;
    
    RAISE NOTICE 'Seeded analytics data for all opportunities';
END $$;