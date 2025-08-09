-- Clean up invalid data before adding foreign key constraints

-- Clean campaign_challenge_links for invalid campaigns
DELETE FROM public.campaign_challenge_links 
WHERE campaign_id NOT IN (SELECT id FROM public.campaigns);

-- Clean campaign_challenge_links for invalid challenges  
DELETE FROM public.campaign_challenge_links 
WHERE challenge_id NOT IN (SELECT id FROM public.challenges);

-- Clean campaign_department_links for invalid data
DELETE FROM public.campaign_department_links 
WHERE campaign_id NOT IN (SELECT id FROM public.campaigns);

DELETE FROM public.campaign_department_links 
WHERE department_id NOT IN (SELECT id FROM public.departments);

-- Clean campaign_partner_links for invalid data
DELETE FROM public.campaign_partner_links 
WHERE campaign_id NOT IN (SELECT id FROM public.campaigns);

DELETE FROM public.campaign_partner_links 
WHERE partner_id NOT IN (SELECT id FROM public.partners);

-- Clean campaign_sector_links for invalid data
DELETE FROM public.campaign_sector_links 
WHERE campaign_id NOT IN (SELECT id FROM public.campaigns);

DELETE FROM public.campaign_sector_links 
WHERE sector_id NOT IN (SELECT id FROM public.sectors);

-- Clean event link tables for invalid data
DELETE FROM public.event_challenge_links 
WHERE event_id NOT IN (SELECT id FROM public.events);

DELETE FROM public.event_challenge_links 
WHERE challenge_id NOT IN (SELECT id FROM public.challenges);

DELETE FROM public.event_partner_links 
WHERE event_id NOT IN (SELECT id FROM public.events);

DELETE FROM public.event_partner_links 
WHERE partner_id NOT IN (SELECT id FROM public.partners);

-- Clean tag relationship tables for invalid data
DELETE FROM public.challenge_tags 
WHERE challenge_id NOT IN (SELECT id FROM public.challenges);

DELETE FROM public.challenge_tags 
WHERE tag_id NOT IN (SELECT id FROM public.tags);

DELETE FROM public.campaign_tags 
WHERE campaign_id NOT IN (SELECT id FROM public.campaigns);

DELETE FROM public.campaign_tags 
WHERE tag_id NOT IN (SELECT id FROM public.tags);

DELETE FROM public.event_tags 
WHERE event_id NOT IN (SELECT id FROM public.events);

DELETE FROM public.event_tags 
WHERE tag_id NOT IN (SELECT id FROM public.tags);

-- Clean new entity tables for invalid data
DELETE FROM public.opportunity_participants 
WHERE opportunity_id NOT IN (SELECT id FROM public.opportunities);

DELETE FROM public.opportunity_experts 
WHERE opportunity_id NOT IN (SELECT id FROM public.opportunities);

DELETE FROM public.opportunity_experts 
WHERE expert_id NOT IN (SELECT id FROM public.experts);

DELETE FROM public.opportunity_feedback 
WHERE opportunity_id NOT IN (SELECT id FROM public.opportunities);

DELETE FROM public.opportunity_comments 
WHERE opportunity_id NOT IN (SELECT id FROM public.opportunities);

DELETE FROM public.opportunity_notifications 
WHERE opportunity_id NOT IN (SELECT id FROM public.opportunities);

DELETE FROM public.campaign_analytics 
WHERE campaign_id NOT IN (SELECT id FROM public.campaigns);

DELETE FROM public.campaign_comments 
WHERE campaign_id NOT IN (SELECT id FROM public.campaigns);

DELETE FROM public.campaign_feedback 
WHERE campaign_id NOT IN (SELECT id FROM public.campaigns);

DELETE FROM public.campaign_notifications 
WHERE campaign_id NOT IN (SELECT id FROM public.campaigns);

DELETE FROM public.campaign_participants 
WHERE campaign_id NOT IN (SELECT id FROM public.campaigns);

DELETE FROM public.partner_comments 
WHERE partner_id NOT IN (SELECT id FROM public.partners);

DELETE FROM public.partner_feedback 
WHERE partner_id NOT IN (SELECT id FROM public.partners);

DELETE FROM public.partner_notifications 
WHERE partner_id NOT IN (SELECT id FROM public.partners);

DELETE FROM public.partner_analytics 
WHERE partner_id NOT IN (SELECT id FROM public.partners);

DELETE FROM public.expert_comments 
WHERE expert_id NOT IN (SELECT id FROM public.experts);

DELETE FROM public.expert_feedback 
WHERE expert_id NOT IN (SELECT id FROM public.experts);

DELETE FROM public.expert_notifications 
WHERE expert_id NOT IN (SELECT id FROM public.experts);

DELETE FROM public.expert_analytics 
WHERE expert_id NOT IN (SELECT id FROM public.experts);

DELETE FROM public.expert_tags 
WHERE expert_id NOT IN (SELECT id FROM public.experts);

DELETE FROM public.expert_tags 
WHERE tag_id NOT IN (SELECT id FROM public.tags);