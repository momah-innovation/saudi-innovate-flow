-- Fix the foreign key constraint in opportunity_bookmarks table
-- Drop the old constraint that references partnership_opportunities
ALTER TABLE public.opportunity_bookmarks 
DROP CONSTRAINT IF EXISTS opportunity_bookmarks_opportunity_id_fkey;

-- Add the correct foreign key constraint that references opportunities table
ALTER TABLE public.opportunity_bookmarks 
ADD CONSTRAINT opportunity_bookmarks_opportunity_id_fkey 
FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE;