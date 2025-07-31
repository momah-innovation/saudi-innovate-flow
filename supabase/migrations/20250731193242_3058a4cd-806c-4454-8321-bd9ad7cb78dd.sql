-- Drop all possible foreign key constraints that might exist
ALTER TABLE public.opportunity_bookmarks 
DROP CONSTRAINT IF EXISTS fk_opportunity_bookmarks_opportunity_id;

ALTER TABLE public.opportunity_bookmarks 
DROP CONSTRAINT IF EXISTS opportunity_bookmarks_opportunity_id_fkey;

-- Verify the opportunities table exists and has the right structure
SELECT id, title_en FROM public.opportunities LIMIT 2;