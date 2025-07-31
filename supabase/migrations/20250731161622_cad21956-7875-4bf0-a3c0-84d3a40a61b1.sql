-- Add the missing foreign key constraint if it doesn't exist
DO $$
BEGIN
    -- Check if the foreign key constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_opportunity_analytics_opportunity_id' 
        AND table_name = 'opportunity_analytics'
    ) THEN
        -- Add the foreign key constraint
        ALTER TABLE public.opportunity_analytics 
        ADD CONSTRAINT fk_opportunity_analytics_opportunity_id 
        FOREIGN KEY (opportunity_id) 
        REFERENCES public.partnership_opportunities(id) 
        ON DELETE CASCADE;
    END IF;
END
$$;