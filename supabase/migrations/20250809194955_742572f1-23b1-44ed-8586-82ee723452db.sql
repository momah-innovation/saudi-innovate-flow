-- Add foreign key constraints for existing tables only

-- Challenges table relationships (only for existing referenced tables)
DO $$
BEGIN
    -- Check if sectors table exists before adding constraint
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sectors' AND table_schema = 'public') THEN
        ALTER TABLE public.challenges 
        ADD CONSTRAINT fk_challenges_sector 
        FOREIGN KEY (sector_id) REFERENCES public.sectors(id);
    END IF;
    
    -- Check if deputies table exists before adding constraint
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'deputies' AND table_schema = 'public') THEN
        ALTER TABLE public.challenges 
        ADD CONSTRAINT fk_challenges_deputy 
        FOREIGN KEY (deputy_id) REFERENCES public.deputies(id);
    END IF;
    
    -- Check if departments table exists before adding constraint
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'departments' AND table_schema = 'public') THEN
        ALTER TABLE public.challenges 
        ADD CONSTRAINT fk_challenges_department 
        FOREIGN KEY (department_id) REFERENCES public.departments(id);
    END IF;
    
    -- Check if domains table exists before adding constraint
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'domains' AND table_schema = 'public') THEN
        ALTER TABLE public.challenges 
        ADD CONSTRAINT fk_challenges_domain 
        FOREIGN KEY (domain_id) REFERENCES public.domains(id);
    END IF;
    
    -- Check if services table exists before adding constraint
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'services' AND table_schema = 'public') THEN
        ALTER TABLE public.challenges 
        ADD CONSTRAINT fk_challenges_service 
        FOREIGN KEY (service_id) REFERENCES public.services(id);
    END IF;
    
    -- Check if experts table exists before adding constraint
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'experts' AND table_schema = 'public') THEN
        ALTER TABLE public.challenges 
        ADD CONSTRAINT fk_challenges_expert 
        FOREIGN KEY (assigned_expert_id) REFERENCES public.experts(id);
    END IF;
    
    -- Check if partners table exists before adding constraint
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'partners' AND table_schema = 'public') THEN
        ALTER TABLE public.challenges 
        ADD CONSTRAINT fk_challenges_partner 
        FOREIGN KEY (partner_organization_id) REFERENCES public.partners(id);
    END IF;
END $$;

-- Campaigns table relationships
DO $$
BEGIN
    -- Check if challenges table exists before adding constraint
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'challenges' AND table_schema = 'public') THEN
        ALTER TABLE public.campaigns 
        ADD CONSTRAINT fk_campaigns_challenge 
        FOREIGN KEY (challenge_id) REFERENCES public.challenges(id);
    END IF;
    
    -- Check if sectors table exists before adding constraint
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sectors' AND table_schema = 'public') THEN
        ALTER TABLE public.campaigns 
        ADD CONSTRAINT fk_campaigns_sector 
        FOREIGN KEY (sector_id) REFERENCES public.sectors(id);
    END IF;
    
    -- Check if deputies table exists before adding constraint
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'deputies' AND table_schema = 'public') THEN
        ALTER TABLE public.campaigns 
        ADD CONSTRAINT fk_campaigns_deputy 
        FOREIGN KEY (deputy_id) REFERENCES public.deputies(id);
    END IF;
    
    -- Check if departments table exists before adding constraint
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'departments' AND table_schema = 'public') THEN
        ALTER TABLE public.campaigns 
        ADD CONSTRAINT fk_campaigns_department 
        FOREIGN KEY (department_id) REFERENCES public.departments(id);
    END IF;
END $$;

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