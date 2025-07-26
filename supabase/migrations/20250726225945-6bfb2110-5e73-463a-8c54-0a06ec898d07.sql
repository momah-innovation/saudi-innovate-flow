-- Create linking tables for multi-select campaign relationships

-- Campaign-Sector linking table
CREATE TABLE IF NOT EXISTS public.campaign_sector_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL,
  sector_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, sector_id)
);

-- Campaign-Deputy linking table  
CREATE TABLE IF NOT EXISTS public.campaign_deputy_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL,
  deputy_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, deputy_id)
);

-- Campaign-Department linking table
CREATE TABLE IF NOT EXISTS public.campaign_department_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL,
  department_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, department_id)
);

-- Campaign-Challenge linking table
CREATE TABLE IF NOT EXISTS public.campaign_challenge_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL,
  challenge_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, challenge_id)
);

-- Enable RLS on all linking tables
ALTER TABLE public.campaign_sector_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_deputy_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_department_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_challenge_links ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for team members to manage campaign links
CREATE POLICY "Team members can manage campaign sector links" 
ON public.campaign_sector_links 
FOR ALL 
USING ((EXISTS ( SELECT 1
   FROM innovation_team_members itm
  WHERE (itm.user_id = auth.uid()))) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Team members can manage campaign deputy links" 
ON public.campaign_deputy_links 
FOR ALL 
USING ((EXISTS ( SELECT 1
   FROM innovation_team_members itm
  WHERE (itm.user_id = auth.uid()))) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Team members can manage campaign department links" 
ON public.campaign_department_links 
FOR ALL 
USING ((EXISTS ( SELECT 1
   FROM innovation_team_members itm
  WHERE (itm.user_id = auth.uid()))) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Team members can manage campaign challenge links" 
ON public.campaign_challenge_links 
FOR ALL 
USING ((EXISTS ( SELECT 1
   FROM innovation_team_members itm
  WHERE (itm.user_id = auth.uid()))) OR has_role(auth.uid(), 'admin'::app_role));