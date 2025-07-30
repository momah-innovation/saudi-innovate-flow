-- Add missing foreign key constraints to bookmark tables

-- Add foreign key constraints for challenge_bookmarks
ALTER TABLE public.challenge_bookmarks 
ADD CONSTRAINT fk_challenge_bookmarks_challenge_id 
FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE;

-- Add foreign key constraints for idea_bookmarks
ALTER TABLE public.idea_bookmarks 
ADD CONSTRAINT fk_idea_bookmarks_idea_id 
FOREIGN KEY (idea_id) REFERENCES public.ideas(id) ON DELETE CASCADE;

-- Add foreign key constraints for focus_question_bookmarks
ALTER TABLE public.focus_question_bookmarks 
ADD CONSTRAINT fk_focus_question_bookmarks_focus_question_id 
FOREIGN KEY (focus_question_id) REFERENCES public.focus_questions(id) ON DELETE CASCADE;

-- Add foreign key constraints for event_bookmarks
ALTER TABLE public.event_bookmarks 
ADD CONSTRAINT fk_event_bookmarks_event_id 
FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;

-- Add foreign key constraints for campaign_bookmarks
ALTER TABLE public.campaign_bookmarks 
ADD CONSTRAINT fk_campaign_bookmarks_campaign_id 
FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;

-- Add foreign key constraints for sector_bookmarks
ALTER TABLE public.sector_bookmarks 
ADD CONSTRAINT fk_sector_bookmarks_sector_id 
FOREIGN KEY (sector_id) REFERENCES public.sectors(id) ON DELETE CASCADE;

-- Add foreign key constraints for stakeholder_bookmarks
ALTER TABLE public.stakeholder_bookmarks 
ADD CONSTRAINT fk_stakeholder_bookmarks_stakeholder_id 
FOREIGN KEY (stakeholder_id) REFERENCES public.stakeholders(id) ON DELETE CASCADE;

-- Add foreign key constraints for expert_bookmarks (assuming experts table exists)
-- We'll need to check if this table exists or create proper relationship

-- Add foreign key constraints for partner_bookmarks
ALTER TABLE public.partner_bookmarks 
ADD CONSTRAINT fk_partner_bookmarks_partner_id 
FOREIGN KEY (partner_id) REFERENCES public.partners(id) ON DELETE CASCADE;