-- Add missing columns from partnership_opportunities to opportunities table
ALTER TABLE public.opportunities 
ADD COLUMN IF NOT EXISTS opportunity_type character varying DEFAULT 'project'::character varying,
ADD COLUMN IF NOT EXISTS sector_id uuid,
ADD COLUMN IF NOT EXISTS department_id uuid,
ADD COLUMN IF NOT EXISTS contact_person character varying,
ADD COLUMN IF NOT EXISTS contact_email character varying,
ADD COLUMN IF NOT EXISTS category_id uuid,
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS priority_level character varying DEFAULT 'medium'::character varying,
ADD COLUMN IF NOT EXISTS visibility character varying DEFAULT 'public'::character varying,
ADD COLUMN IF NOT EXISTS target_audience jsonb,
ADD COLUMN IF NOT EXISTS success_metrics text,
ADD COLUMN IF NOT EXISTS manager_id uuid;

-- Update requirements and benefits columns to use jsonb format (if they're currently text)
ALTER TABLE public.opportunities 
ALTER COLUMN requirements TYPE jsonb USING 
  CASE 
    WHEN requirements IS NULL THEN '[]'::jsonb
    WHEN requirements = '' THEN '[]'::jsonb
    ELSE jsonb_build_array(requirements)
  END;

-- Add benefits column if it doesn't exist
ALTER TABLE public.opportunities 
ADD COLUMN IF NOT EXISTS benefits jsonb DEFAULT '[]'::jsonb;

-- Add qualifications as jsonb if needed
ALTER TABLE public.opportunities 
ALTER COLUMN qualifications TYPE text;

-- Update type column name to opportunity_type to match partnership_opportunities
-- But first check if we need to preserve data
DO $$
BEGIN
  -- Update existing opportunities to have proper opportunity_type
  UPDATE public.opportunities 
  SET opportunity_type = COALESCE(type, 'project');
  
  -- Drop the old type column
  ALTER TABLE public.opportunities DROP COLUMN IF EXISTS type;
END $$;

-- Migrate data from partnership_opportunities to opportunities
INSERT INTO public.opportunities (
  id, title_ar, title_en, description_ar, description_en, 
  opportunity_type, budget_min, budget_max, deadline, status,
  sector_id, department_id, contact_person, contact_email,
  requirements, benefits, created_at, updated_at, created_by,
  category_id, image_url, priority_level, visibility, location,
  target_audience, success_metrics, manager_id
)
SELECT 
  id, title_ar, title_en, description_ar, description_en,
  opportunity_type, budget_min, budget_max, deadline, status,
  sector_id, department_id, contact_person, contact_email,
  requirements, benefits, created_at, updated_at, created_by,
  category_id, image_url, priority_level, visibility, location,
  target_audience, success_metrics, manager_id
FROM public.partnership_opportunities
ON CONFLICT (id) DO UPDATE SET
  title_ar = EXCLUDED.title_ar,
  title_en = EXCLUDED.title_en,
  description_ar = EXCLUDED.description_ar,
  description_en = EXCLUDED.description_en,
  opportunity_type = EXCLUDED.opportunity_type,
  budget_min = EXCLUDED.budget_min,
  budget_max = EXCLUDED.budget_max,
  deadline = EXCLUDED.deadline,
  status = EXCLUDED.status,
  sector_id = EXCLUDED.sector_id,
  department_id = EXCLUDED.department_id,
  contact_person = EXCLUDED.contact_person,
  contact_email = EXCLUDED.contact_email,
  requirements = EXCLUDED.requirements,
  benefits = EXCLUDED.benefits,
  category_id = EXCLUDED.category_id,
  image_url = EXCLUDED.image_url,
  priority_level = EXCLUDED.priority_level,
  visibility = EXCLUDED.visibility,
  location = EXCLUDED.location,
  target_audience = EXCLUDED.target_audience,
  success_metrics = EXCLUDED.success_metrics,
  manager_id = EXCLUDED.manager_id;

-- Drop the old partnership_opportunities table
DROP TABLE IF EXISTS public.partnership_opportunities CASCADE;

-- Create a view for partnership_opportunities that filters public opportunities
CREATE VIEW public.partnership_opportunities AS 
SELECT 
  id, title_ar, title_en, description_ar, description_en,
  opportunity_type, budget_min, budget_max, deadline, status,
  sector_id, department_id, contact_person, contact_email,
  requirements, benefits, created_at, updated_at, created_by,
  category_id, image_url, priority_level, visibility, location,
  target_audience, success_metrics, manager_id
FROM public.opportunities 
WHERE visibility IN ('public', 'internal') 
  AND status IN ('open', 'active');

-- Update opportunity_analytics table to reference the main opportunities table
-- (This should already be correct as it uses opportunity_id)

-- Create RLS policies for the unified opportunities table
DROP POLICY IF EXISTS "Admins can manage all opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Team members can view opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Public can view public opportunities" ON public.opportunities;

CREATE POLICY "Admins can manage all opportunities" 
ON public.opportunities FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Team members can view all opportunities" 
ON public.opportunities FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) OR has_role(auth.uid(), 'admin'::app_role) 
    OR has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Public can view public opportunities" 
ON public.opportunities FOR SELECT 
USING (visibility = 'public' AND status IN ('open', 'active'));

-- Enable RLS on opportunities table
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;