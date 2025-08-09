-- Add missing foreign key constraints for proper table relationships

-- Challenges table relationships
ALTER TABLE public.challenges 
ADD CONSTRAINT fk_challenges_sector 
FOREIGN KEY (sector_id) REFERENCES public.sectors(id);

ALTER TABLE public.challenges 
ADD CONSTRAINT fk_challenges_deputy 
FOREIGN KEY (deputy_id) REFERENCES public.deputies(id);

ALTER TABLE public.challenges 
ADD CONSTRAINT fk_challenges_department 
FOREIGN KEY (department_id) REFERENCES public.departments(id);

ALTER TABLE public.challenges 
ADD CONSTRAINT fk_challenges_domain 
FOREIGN KEY (domain_id) REFERENCES public.domains(id);

ALTER TABLE public.challenges 
ADD CONSTRAINT fk_challenges_service 
FOREIGN KEY (service_id) REFERENCES public.services(id);

ALTER TABLE public.challenges 
ADD CONSTRAINT fk_challenges_expert 
FOREIGN KEY (assigned_expert_id) REFERENCES public.experts(id);

ALTER TABLE public.challenges 
ADD CONSTRAINT fk_challenges_partner 
FOREIGN KEY (partner_organization_id) REFERENCES public.partners(id);

-- Campaigns table relationships
ALTER TABLE public.campaigns 
ADD CONSTRAINT fk_campaigns_challenge 
FOREIGN KEY (challenge_id) REFERENCES public.challenges(id);

ALTER TABLE public.campaigns 
ADD CONSTRAINT fk_campaigns_sector 
FOREIGN KEY (sector_id) REFERENCES public.sectors(id);

ALTER TABLE public.campaigns 
ADD CONSTRAINT fk_campaigns_deputy 
FOREIGN KEY (deputy_id) REFERENCES public.deputies(id);

ALTER TABLE public.campaigns 
ADD CONSTRAINT fk_campaigns_department 
FOREIGN KEY (department_id) REFERENCES public.departments(id);

-- Opportunities table relationships
ALTER TABLE public.opportunities 
ADD CONSTRAINT fk_opportunities_sector 
FOREIGN KEY (sector_id) REFERENCES public.sectors(id);

ALTER TABLE public.opportunities 
ADD CONSTRAINT fk_opportunities_department 
FOREIGN KEY (department_id) REFERENCES public.departments(id);

-- Departments table relationships
ALTER TABLE public.departments 
ADD CONSTRAINT fk_departments_deputy 
FOREIGN KEY (deputy_id) REFERENCES public.deputies(id);

-- Link tables relationships
ALTER TABLE public.campaign_challenge_links 
ADD CONSTRAINT fk_campaign_challenge_links_campaign 
FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;

ALTER TABLE public.campaign_challenge_links 
ADD CONSTRAINT fk_campaign_challenge_links_challenge 
FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE;

ALTER TABLE public.campaign_department_links 
ADD CONSTRAINT fk_campaign_department_links_campaign 
FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;

ALTER TABLE public.campaign_department_links 
ADD CONSTRAINT fk_campaign_department_links_department 
FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE CASCADE;

ALTER TABLE public.campaign_partner_links 
ADD CONSTRAINT fk_campaign_partner_links_campaign 
FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;

ALTER TABLE public.campaign_partner_links 
ADD CONSTRAINT fk_campaign_partner_links_partner 
FOREIGN KEY (partner_id) REFERENCES public.partners(id) ON DELETE CASCADE;

ALTER TABLE public.campaign_sector_links 
ADD CONSTRAINT fk_campaign_sector_links_campaign 
FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;

ALTER TABLE public.campaign_sector_links 
ADD CONSTRAINT fk_campaign_sector_links_sector 
FOREIGN KEY (sector_id) REFERENCES public.sectors(id) ON DELETE CASCADE;

-- Event link tables relationships
ALTER TABLE public.event_challenge_links 
ADD CONSTRAINT fk_event_challenge_links_event 
FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;

ALTER TABLE public.event_challenge_links 
ADD CONSTRAINT fk_event_challenge_links_challenge 
FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE;

ALTER TABLE public.event_partner_links 
ADD CONSTRAINT fk_event_partner_links_event 
FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;

ALTER TABLE public.event_partner_links 
ADD CONSTRAINT fk_event_partner_links_partner 
FOREIGN KEY (partner_id) REFERENCES public.partners(id) ON DELETE CASCADE;

-- Tag relationship tables
ALTER TABLE public.challenge_tags 
ADD CONSTRAINT fk_challenge_tags_challenge 
FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE;

ALTER TABLE public.challenge_tags 
ADD CONSTRAINT fk_challenge_tags_tag 
FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;

ALTER TABLE public.campaign_tags 
ADD CONSTRAINT fk_campaign_tags_campaign 
FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;

ALTER TABLE public.campaign_tags 
ADD CONSTRAINT fk_campaign_tags_tag 
FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;

ALTER TABLE public.event_tags 
ADD CONSTRAINT fk_event_tags_event 
FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;

ALTER TABLE public.event_tags 
ADD CONSTRAINT fk_event_tags_tag 
FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;

-- New entity tables relationships
ALTER TABLE public.opportunity_participants 
ADD CONSTRAINT fk_opportunity_participants_opportunity 
FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE;

ALTER TABLE public.opportunity_experts 
ADD CONSTRAINT fk_opportunity_experts_opportunity 
FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE;

ALTER TABLE public.opportunity_experts 
ADD CONSTRAINT fk_opportunity_experts_expert 
FOREIGN KEY (expert_id) REFERENCES public.experts(id) ON DELETE CASCADE;

ALTER TABLE public.opportunity_feedback 
ADD CONSTRAINT fk_opportunity_feedback_opportunity 
FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE;

ALTER TABLE public.opportunity_comments 
ADD CONSTRAINT fk_opportunity_comments_opportunity 
FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE;

ALTER TABLE public.opportunity_notifications 
ADD CONSTRAINT fk_opportunity_notifications_opportunity 
FOREIGN KEY (opportunity_id) REFERENCES public.opportunities(id) ON DELETE CASCADE;

ALTER TABLE public.campaign_analytics 
ADD CONSTRAINT fk_campaign_analytics_campaign 
FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;

ALTER TABLE public.campaign_comments 
ADD CONSTRAINT fk_campaign_comments_campaign 
FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;

ALTER TABLE public.campaign_feedback 
ADD CONSTRAINT fk_campaign_feedback_campaign 
FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;

ALTER TABLE public.campaign_notifications 
ADD CONSTRAINT fk_campaign_notifications_campaign 
FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;

ALTER TABLE public.campaign_participants 
ADD CONSTRAINT fk_campaign_participants_campaign 
FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;

ALTER TABLE public.partner_comments 
ADD CONSTRAINT fk_partner_comments_partner 
FOREIGN KEY (partner_id) REFERENCES public.partners(id) ON DELETE CASCADE;

ALTER TABLE public.partner_feedback 
ADD CONSTRAINT fk_partner_feedback_partner 
FOREIGN KEY (partner_id) REFERENCES public.partners(id) ON DELETE CASCADE;

ALTER TABLE public.partner_notifications 
ADD CONSTRAINT fk_partner_notifications_partner 
FOREIGN KEY (partner_id) REFERENCES public.partners(id) ON DELETE CASCADE;

ALTER TABLE public.partner_analytics 
ADD CONSTRAINT fk_partner_analytics_partner 
FOREIGN KEY (partner_id) REFERENCES public.partners(id) ON DELETE CASCADE;

ALTER TABLE public.expert_comments 
ADD CONSTRAINT fk_expert_comments_expert 
FOREIGN KEY (expert_id) REFERENCES public.experts(id) ON DELETE CASCADE;

ALTER TABLE public.expert_feedback 
ADD CONSTRAINT fk_expert_feedback_expert 
FOREIGN KEY (expert_id) REFERENCES public.experts(id) ON DELETE CASCADE;

ALTER TABLE public.expert_notifications 
ADD CONSTRAINT fk_expert_notifications_expert 
FOREIGN KEY (expert_id) REFERENCES public.experts(id) ON DELETE CASCADE;

ALTER TABLE public.expert_analytics 
ADD CONSTRAINT fk_expert_analytics_expert 
FOREIGN KEY (expert_id) REFERENCES public.experts(id) ON DELETE CASCADE;

ALTER TABLE public.expert_tags 
ADD CONSTRAINT fk_expert_tags_expert 
FOREIGN KEY (expert_id) REFERENCES public.experts(id) ON DELETE CASCADE;

ALTER TABLE public.expert_tags 
ADD CONSTRAINT fk_expert_tags_tag 
FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;