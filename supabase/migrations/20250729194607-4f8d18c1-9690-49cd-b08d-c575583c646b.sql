-- Create teams table for organizing innovation team members
CREATE TABLE IF NOT EXISTS public.innovation_teams (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name character varying NOT NULL,
  name_ar character varying,
  description text,
  team_lead_id uuid REFERENCES public.innovation_team_members(id),
  department character varying,
  focus_area character varying,
  max_members integer DEFAULT 8,
  status character varying DEFAULT 'active',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on teams table
ALTER TABLE public.innovation_teams ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for teams
CREATE POLICY "Team members can view teams" ON public.innovation_teams
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm
    WHERE itm.user_id = auth.uid()
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can manage teams" ON public.innovation_teams
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Add team_id column to innovation_team_members
ALTER TABLE public.innovation_team_members 
ADD COLUMN IF NOT EXISTS team_id uuid REFERENCES public.innovation_teams(id);

-- Create small focused teams based on existing members
INSERT INTO public.innovation_teams (name, name_ar, description, focus_area, department, status) VALUES
('Innovation Strategy Team', 'فريق الاستراتيجية والابتكار', 'Core team responsible for innovation strategy and planning', 'Strategy & Planning', 'Innovation Department', 'active'),
('Technology & Digital Team', 'فريق التكنولوجيا والرقمنة', 'Experts in technology solutions and digital transformation', 'Technology & Digital', 'Technology Department', 'active'),
('Content & Communication Team', 'فريق المحتوى والتواصل', 'Managing content creation and communication strategies', 'Content & Communication', 'Communications Department', 'active'),
('Analytics & Research Team', 'فريق التحليل والبحوث', 'Data analysis, research, and performance monitoring', 'Analytics & Research', 'Research Department', 'active'),
('Campaign Management Team', 'فريق إدارة الحملات', 'Managing innovation campaigns and projects', 'Campaign Management', 'Campaign Department', 'active');

-- Assign team leads (pick members with manager/admin/expert roles)
UPDATE public.innovation_teams 
SET team_lead_id = (
  SELECT id FROM innovation_team_members 
  WHERE cic_role IN ('admin', 'Innovation Director') 
  LIMIT 1
)
WHERE name = 'Innovation Strategy Team';

UPDATE public.innovation_teams 
SET team_lead_id = (
  SELECT id FROM innovation_team_members 
  WHERE cic_role = 'expert' 
  AND 'التكنولوجيا' = ANY(specialization)
  LIMIT 1
)
WHERE name = 'Technology & Digital Team';

UPDATE public.innovation_teams 
SET team_lead_id = (
  SELECT id FROM innovation_team_members 
  WHERE cic_role = 'content_manager' 
  LIMIT 1
)
WHERE name = 'Content & Communication Team';

UPDATE public.innovation_teams 
SET team_lead_id = (
  SELECT id FROM innovation_team_members 
  WHERE cic_role = 'analyst' 
  LIMIT 1
)
WHERE name = 'Analytics & Research Team';

UPDATE public.innovation_teams 
SET team_lead_id = (
  SELECT id FROM innovation_team_members 
  WHERE cic_role IN ('manager', 'Senior Campaign Manager') 
  LIMIT 1
)
WHERE name = 'Campaign Management Team';

-- Assign team members to teams based on their specializations
UPDATE public.innovation_team_members 
SET team_id = (SELECT id FROM innovation_teams WHERE name = 'Innovation Strategy Team')
WHERE cic_role IN ('admin', 'Innovation Director', 'manager') 
  AND ('استراتيجية' = ANY(specialization) OR 'إدارة' = ANY(specialization) OR 'Innovation' = ANY(specialization));

UPDATE public.innovation_team_members 
SET team_id = (SELECT id FROM innovation_teams WHERE name = 'Technology & Digital Team')
WHERE cic_role = 'expert' 
  AND ('التكنولوجيا' = ANY(specialization) OR 'الرقمي' = ANY(specialization) OR 'Technology' = ANY(specialization));

UPDATE public.innovation_team_members 
SET team_id = (SELECT id FROM innovation_teams WHERE name = 'Content & Communication Team')
WHERE cic_role = 'content_manager' 
  OR ('المحتوى' = ANY(specialization) OR 'التحرير' = ANY(specialization));

UPDATE public.innovation_team_members 
SET team_id = (SELECT id FROM innovation_teams WHERE name = 'Analytics & Research Team')
WHERE cic_role = 'analyst' 
  OR ('تحليل' = ANY(specialization) OR 'البحث' = ANY(specialization));

UPDATE public.innovation_team_members 
SET team_id = (SELECT id FROM innovation_teams WHERE name = 'Campaign Management Team')
WHERE cic_role IN ('manager', 'Senior Campaign Manager') 
  AND ('Campaign' = ANY(specialization) OR 'الحملات' = ANY(specialization) OR 'المشاريع' = ANY(specialization));

-- Assign remaining members to appropriate teams
UPDATE public.innovation_team_members 
SET team_id = (SELECT id FROM innovation_teams WHERE name = 'Innovation Strategy Team')
WHERE team_id IS NULL AND cic_role IN ('admin', 'manager');

UPDATE public.innovation_team_members 
SET team_id = (SELECT id FROM innovation_teams WHERE name = 'Technology & Digital Team')
WHERE team_id IS NULL AND cic_role = 'expert';

UPDATE public.innovation_team_members 
SET team_id = (SELECT id FROM innovation_teams WHERE name = 'Analytics & Research Team')
WHERE team_id IS NULL;