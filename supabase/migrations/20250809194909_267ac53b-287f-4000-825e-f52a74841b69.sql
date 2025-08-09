-- Clean up invalid data for existing tables before adding foreign key constraints

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