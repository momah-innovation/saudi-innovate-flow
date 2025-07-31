-- Fix the security definer view issue by recreating the view without security definer
DROP VIEW IF EXISTS public.partnership_opportunities;

-- Create the view without security definer (default is security invoker which is safe)
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