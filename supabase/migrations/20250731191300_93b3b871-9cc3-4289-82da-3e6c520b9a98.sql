-- Seed analytics tables with realistic data matching existing table structure
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
        
        -- Seed opportunity_geographic_analytics (only with columns that exist)
        INSERT INTO public.opportunity_geographic_analytics (
            opportunity_id, country_code, country_name, region, city, view_count, last_updated
        ) VALUES 
            (opp_record.id, 'SA', 'Saudi Arabia', 'Riyadh Province', 'Riyadh', FLOOR(RANDOM() * 200 + 20), NOW()),
            (opp_record.id, 'SA', 'Saudi Arabia', 'Makkah Province', 'Jeddah', FLOOR(RANDOM() * 150 + 15), NOW()),
            (opp_record.id, 'SA', 'Saudi Arabia', 'Eastern Province', 'Dammam', FLOOR(RANDOM() * 100 + 10), NOW()),
            (opp_record.id, 'AE', 'United Arab Emirates', 'Dubai', 'Dubai', FLOOR(RANDOM() * 80 + 8), NOW()),
            (opp_record.id, 'KW', 'Kuwait', 'Al Asimah', 'Kuwait City', FLOOR(RANDOM() * 60 + 6), NOW());
        
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
                CASE FLOOR(RANDOM() * 3)
                    WHEN 0 THEN 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    WHEN 1 THEN 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
                    ELSE 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15'
                END,
                CASE FLOOR(RANDOM() * 4)
                    WHEN 0 THEN 'https://google.com'
                    WHEN 1 THEN 'https://twitter.com'
                    WHEN 2 THEN 'direct'
                    ELSE 'https://linkedin.com'
                END,
                NOW() - INTERVAL '1 hour' * RANDOM() * 720,
                NOW() - INTERVAL '1 hour' * RANDOM() * 720 + INTERVAL '1 minute' * (RANDOM() * 45 + 5),
                FLOOR(RANDOM() * 8 + 1)::INTEGER,
                FLOOR(RANDOM() * 600 + 30)::INTEGER,
                RANDOM() < 0.3,
                CASE FLOOR(RANDOM() * 5)
                    WHEN 0 THEN 'SA'
                    WHEN 1 THEN 'AE' 
                    WHEN 2 THEN 'KW'
                    WHEN 3 THEN 'QA'
                    ELSE 'BH'
                END,
                CASE FLOOR(RANDOM() * 5)
                    WHEN 0 THEN 'Riyadh'
                    WHEN 1 THEN 'Dubai'
                    WHEN 2 THEN 'Kuwait City'
                    WHEN 3 THEN 'Doha'
                    ELSE 'Manama'
                END,
                NOW() - INTERVAL '1 hour' * RANDOM() * 720
            );
        END LOOP;
        
    END LOOP;
    
    RAISE NOTICE 'Seeded analytics data for all opportunities';
END $$;