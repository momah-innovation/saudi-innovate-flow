-- Add missing relationships to campaigns table
ALTER TABLE public.campaigns 
ADD COLUMN challenge_id uuid REFERENCES public.challenges(id),
ADD COLUMN sector_id uuid REFERENCES public.sectors(id),
ADD COLUMN deputy_id uuid REFERENCES public.deputies(id),
ADD COLUMN department_id uuid REFERENCES public.departments(id),
ADD COLUMN target_stakeholder_groups text[],
ADD COLUMN partner_organizations uuid[] DEFAULT '{}';

-- Add missing relationships to events table  
ALTER TABLE public.events
ADD COLUMN challenge_id uuid REFERENCES public.challenges(id),
ADD COLUMN sector_id uuid REFERENCES public.sectors(id),
ADD COLUMN target_stakeholder_groups text[],
ADD COLUMN partner_organizations uuid[] DEFAULT '{}',
ADD COLUMN related_focus_questions uuid[] DEFAULT '{}';

-- Create junction table for campaign-partner relationships
CREATE TABLE public.campaign_partners (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  partnership_role character varying DEFAULT 'sponsor',
  contribution_amount numeric,
  partnership_status character varying DEFAULT 'active',
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(campaign_id, partner_id)
);

-- Create junction table for event-stakeholder targeting
CREATE TABLE public.event_stakeholders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  stakeholder_id uuid NOT NULL REFERENCES public.stakeholders(id) ON DELETE CASCADE,
  invitation_status character varying DEFAULT 'pending',
  attendance_status character varying DEFAULT 'not_attended',
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(event_id, stakeholder_id)
);

-- Enable RLS on new tables
ALTER TABLE public.campaign_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_stakeholders ENABLE ROW LEVEL SECURITY;

-- Create policies for campaign_partners
CREATE POLICY "Team members can manage campaign partners" 
ON public.campaign_partners 
FOR ALL 
USING ((EXISTS ( SELECT 1 FROM innovation_team_members itm WHERE (itm.user_id = auth.uid()))) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Team members can view campaign partners" 
ON public.campaign_partners 
FOR SELECT 
USING ((EXISTS ( SELECT 1 FROM innovation_team_members itm WHERE (itm.user_id = auth.uid()))) OR has_role(auth.uid(), 'admin'::app_role));

-- Create policies for event_stakeholders  
CREATE POLICY "Team members can manage event stakeholders" 
ON public.event_stakeholders 
FOR ALL 
USING ((EXISTS ( SELECT 1 FROM innovation_team_members itm WHERE (itm.user_id = auth.uid()))) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Team members can view event stakeholders" 
ON public.event_stakeholders 
FOR SELECT 
USING ((EXISTS ( SELECT 1 FROM innovation_team_members itm WHERE (itm.user_id = auth.uid()))) OR has_role(auth.uid(), 'admin'::app_role));