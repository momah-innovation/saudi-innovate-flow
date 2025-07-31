-- Fix foreign key constraints to point to opportunities instead of partnership_opportunities
-- Drop existing foreign key constraints that point to partnership_opportunities
ALTER TABLE public.opportunity_analytics 
DROP CONSTRAINT IF EXISTS fk_opportunity_analytics_opportunity_id;

ALTER TABLE public.opportunity_geographic_analytics 
DROP CONSTRAINT IF EXISTS fk_opportunity_geographic_analytics_opportunity_id;

ALTER TABLE public.opportunity_view_sessions 
DROP CONSTRAINT IF EXISTS fk_opportunity_view_sessions_opportunity_id;

ALTER TABLE public.opportunity_applications 
DROP CONSTRAINT IF EXISTS fk_opportunity_applications_opportunity_id;

ALTER TABLE public.opportunity_likes 
DROP CONSTRAINT IF EXISTS fk_opportunity_likes_opportunity_id;

ALTER TABLE public.opportunity_shares 
DROP CONSTRAINT IF EXISTS fk_opportunity_shares_opportunity_id;

ALTER TABLE public.opportunity_comments 
DROP CONSTRAINT IF EXISTS fk_opportunity_comments_opportunity_id;

ALTER TABLE public.opportunity_bookmarks 
DROP CONSTRAINT IF EXISTS fk_opportunity_bookmarks_opportunity_id;

ALTER TABLE public.opportunity_notifications 
DROP CONSTRAINT IF EXISTS fk_opportunity_notifications_opportunity_id;

ALTER TABLE public.opportunity_user_journeys 
DROP CONSTRAINT IF EXISTS fk_opportunity_user_journeys_opportunity_id;

ALTER TABLE public.opportunity_live_presence 
DROP CONSTRAINT IF EXISTS fk_opportunity_live_presence_opportunity_id;

-- Add correct foreign key constraints pointing to opportunities table
ALTER TABLE public.opportunity_analytics 
ADD CONSTRAINT fk_opportunity_analytics_opportunity_id 
FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE;

ALTER TABLE public.opportunity_geographic_analytics 
ADD CONSTRAINT fk_opportunity_geographic_analytics_opportunity_id 
FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE;

ALTER TABLE public.opportunity_view_sessions 
ADD CONSTRAINT fk_opportunity_view_sessions_opportunity_id 
FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE;

ALTER TABLE public.opportunity_applications 
ADD CONSTRAINT fk_opportunity_applications_opportunity_id 
FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE;

ALTER TABLE public.opportunity_likes 
ADD CONSTRAINT fk_opportunity_likes_opportunity_id 
FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE;

ALTER TABLE public.opportunity_shares 
ADD CONSTRAINT fk_opportunity_shares_opportunity_id 
FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE;

ALTER TABLE public.opportunity_comments 
ADD CONSTRAINT fk_opportunity_comments_opportunity_id 
FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE;

ALTER TABLE public.opportunity_bookmarks 
ADD CONSTRAINT fk_opportunity_bookmarks_opportunity_id 
FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE;

ALTER TABLE public.opportunity_notifications 
ADD CONSTRAINT fk_opportunity_notifications_opportunity_id 
FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE;

ALTER TABLE public.opportunity_user_journeys 
ADD CONSTRAINT fk_opportunity_user_journeys_opportunity_id 
FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE;

ALTER TABLE public.opportunity_live_presence 
ADD CONSTRAINT fk_opportunity_live_presence_opportunity_id 
FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE;