-- Fix foreign key constraints to reference opportunities table instead of partnership_opportunities
ALTER TABLE opportunity_user_journeys 
DROP CONSTRAINT IF EXISTS opportunity_user_journeys_opportunity_id_fkey;

ALTER TABLE opportunity_user_journeys 
ADD CONSTRAINT opportunity_user_journeys_opportunity_id_fkey 
FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE;

ALTER TABLE opportunity_live_presence 
DROP CONSTRAINT IF EXISTS opportunity_live_presence_opportunity_id_fkey;

ALTER TABLE opportunity_live_presence 
ADD CONSTRAINT opportunity_live_presence_opportunity_id_fkey 
FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE;

-- Add missing application_source column to opportunity_applications
ALTER TABLE opportunity_applications 
ADD COLUMN IF NOT EXISTS application_source VARCHAR(50) DEFAULT 'direct';