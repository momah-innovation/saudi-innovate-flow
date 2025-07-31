-- Check constraint name and drop it specifically
DO $$
DECLARE
    constraint_name TEXT;
BEGIN
    -- Get the actual constraint name
    SELECT tc.constraint_name INTO constraint_name
    FROM information_schema.table_constraints AS tc 
    WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'opportunity_analytics'
    LIMIT 1;
    
    -- Drop the constraint if it exists
    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.opportunity_analytics DROP CONSTRAINT ' || constraint_name;
        RAISE NOTICE 'Dropped constraint: %', constraint_name;
    END IF;
END $$;

-- Clean existing data and seed with correct opportunities
DELETE FROM public.opportunity_analytics;

-- Seed opportunity_analytics table only (start simple)
DO $$
DECLARE
    opp_record RECORD;
BEGIN
    FOR opp_record IN (SELECT id FROM public.opportunities WHERE status = 'open') LOOP
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
    END LOOP;
    
    RAISE NOTICE 'Seeded opportunity_analytics data for all opportunities';
END $$;