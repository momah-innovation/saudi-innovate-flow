-- Add proper foreign key constraints to existing tables
ALTER TABLE public.campaigns 
ADD CONSTRAINT fk_campaigns_challenge_id 
FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE SET NULL;

ALTER TABLE public.campaigns 
ADD CONSTRAINT fk_campaigns_sector_id 
FOREIGN KEY (sector_id) REFERENCES public.sectors(id) ON DELETE SET NULL;

ALTER TABLE public.campaigns 
ADD CONSTRAINT fk_campaigns_department_id 
FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;

ALTER TABLE public.campaigns 
ADD CONSTRAINT fk_campaigns_deputy_id 
FOREIGN KEY (deputy_id) REFERENCES public.deputies(id) ON DELETE SET NULL;

-- Events foreign keys
ALTER TABLE public.events 
ADD CONSTRAINT fk_events_campaign_id 
FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE SET NULL;

ALTER TABLE public.events 
ADD CONSTRAINT fk_events_challenge_id 
FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE SET NULL;

ALTER TABLE public.events 
ADD CONSTRAINT fk_events_sector_id 
FOREIGN KEY (sector_id) REFERENCES public.sectors(id) ON DELETE SET NULL;

-- Challenges foreign keys
ALTER TABLE public.challenges 
ADD CONSTRAINT fk_challenges_sector_id 
FOREIGN KEY (sector_id) REFERENCES public.sectors(id) ON DELETE SET NULL;

ALTER TABLE public.challenges 
ADD CONSTRAINT fk_challenges_department_id 
FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;

ALTER TABLE public.challenges 
ADD CONSTRAINT fk_challenges_deputy_id 
FOREIGN KEY (deputy_id) REFERENCES public.deputies(id) ON DELETE SET NULL;

ALTER TABLE public.challenges 
ADD CONSTRAINT fk_challenges_domain_id 
FOREIGN KEY (domain_id) REFERENCES public.domains(id) ON DELETE SET NULL;

ALTER TABLE public.challenges 
ADD CONSTRAINT fk_challenges_sub_domain_id 
FOREIGN KEY (sub_domain_id) REFERENCES public.domains(id) ON DELETE SET NULL;

ALTER TABLE public.challenges 
ADD CONSTRAINT fk_challenges_service_id 
FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE SET NULL;

-- Create proper junction tables for many-to-many relationships

-- Campaign Partners junction table
CREATE TABLE public.campaign_partner_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL,
  partner_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, partner_id)
);

ALTER TABLE public.campaign_partner_links 
ADD CONSTRAINT fk_campaign_partner_links_campaign_id 
FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;

ALTER TABLE public.campaign_partner_links 
ADD CONSTRAINT fk_campaign_partner_links_partner_id 
FOREIGN KEY (partner_id) REFERENCES public.partners(id) ON DELETE CASCADE;

-- Campaign Stakeholder Groups junction table
CREATE TABLE public.campaign_stakeholder_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL,
  stakeholder_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, stakeholder_id)
);

ALTER TABLE public.campaign_stakeholder_links 
ADD CONSTRAINT fk_campaign_stakeholder_links_campaign_id 
FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE;

ALTER TABLE public.campaign_stakeholder_links 
ADD CONSTRAINT fk_campaign_stakeholder_links_stakeholder_id 
FOREIGN KEY (stakeholder_id) REFERENCES public.stakeholders(id) ON DELETE CASCADE;

-- Event Partners junction table
CREATE TABLE public.event_partner_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL,
  partner_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, partner_id)
);

ALTER TABLE public.event_partner_links 
ADD CONSTRAINT fk_event_partner_links_event_id 
FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;

ALTER TABLE public.event_partner_links 
ADD CONSTRAINT fk_event_partner_links_partner_id 
FOREIGN KEY (partner_id) REFERENCES public.partners(id) ON DELETE CASCADE;

-- Event Stakeholder Groups junction table
CREATE TABLE public.event_stakeholder_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL,
  stakeholder_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, stakeholder_id)
);

ALTER TABLE public.event_stakeholder_links 
ADD CONSTRAINT fk_event_stakeholder_links_event_id 
FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;

ALTER TABLE public.event_stakeholder_links 
ADD CONSTRAINT fk_event_stakeholder_links_stakeholder_id 
FOREIGN KEY (stakeholder_id) REFERENCES public.stakeholders(id) ON DELETE CASCADE;

-- Focus Questions Links junction table
CREATE TABLE public.event_focus_question_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL,
  focus_question_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, focus_question_id)
);

ALTER TABLE public.event_focus_question_links 
ADD CONSTRAINT fk_event_focus_question_links_event_id 
FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;

ALTER TABLE public.event_focus_question_links 
ADD CONSTRAINT fk_event_focus_question_links_focus_question_id 
FOREIGN KEY (focus_question_id) REFERENCES public.focus_questions(id) ON DELETE CASCADE;

-- Enable RLS on junction tables
ALTER TABLE public.campaign_partner_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_stakeholder_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_partner_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_stakeholder_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_focus_question_links ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for junction tables
CREATE POLICY "Team members can manage campaign partner links" 
ON public.campaign_partner_links 
FOR ALL 
USING ((EXISTS ( SELECT 1
   FROM public.innovation_team_members itm
  WHERE (itm.user_id = auth.uid()))) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Team members can manage campaign stakeholder links" 
ON public.campaign_stakeholder_links 
FOR ALL 
USING ((EXISTS ( SELECT 1
   FROM public.innovation_team_members itm
  WHERE (itm.user_id = auth.uid()))) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Team members can manage event partner links" 
ON public.event_partner_links 
FOR ALL 
USING ((EXISTS ( SELECT 1
   FROM public.innovation_team_members itm
  WHERE (itm.user_id = auth.uid()))) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Team members can manage event stakeholder links" 
ON public.event_stakeholder_links 
FOR ALL 
USING ((EXISTS ( SELECT 1
   FROM public.innovation_team_members itm
  WHERE (itm.user_id = auth.uid()))) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Team members can manage event focus question links" 
ON public.event_focus_question_links 
FOR ALL 
USING ((EXISTS ( SELECT 1
   FROM public.innovation_team_members itm
  WHERE (itm.user_id = auth.uid()))) OR has_role(auth.uid(), 'admin'::app_role));