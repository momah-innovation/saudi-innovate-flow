-- Fix security issues from the linter

-- Fix the views to not use SECURITY DEFINER and set proper access
CREATE OR REPLACE VIEW public.challenges_with_details AS
SELECT 
  c.*,
  COUNT(DISTINCT cp.id) as participant_count,
  COUNT(DISTINCT cs.id) as submission_count,
  COUNT(DISTINCT cc.id) as comment_count,
  COUNT(DISTINCT ct.id) as tag_count,
  ARRAY_AGG(DISTINCT t.name_en) FILTER (WHERE t.name_en IS NOT NULL) as tag_names,
  ARRAY_AGG(DISTINCT t.name_ar) FILTER (WHERE t.name_ar IS NOT NULL) as tag_names_ar,
  ARRAY_AGG(DISTINCT t.color) FILTER (WHERE t.color IS NOT NULL) as tag_colors,
  s.name as sector_name,
  s.name_ar as sector_name_ar,
  d.name as department_name,
  d.name_ar as department_name_ar,
  dep.name as deputy_name,
  dep.name_ar as deputy_name_ar
FROM public.challenges c
LEFT JOIN public.challenge_participants cp ON c.id = cp.challenge_id AND cp.status = 'active'
LEFT JOIN public.challenge_submissions cs ON c.id = cs.challenge_id
LEFT JOIN public.challenge_comments cc ON c.id = cc.challenge_id
LEFT JOIN public.challenge_tags ct ON c.id = ct.challenge_id
LEFT JOIN public.tags t ON ct.tag_id = t.id
LEFT JOIN public.sectors s ON c.sector_id = s.id
LEFT JOIN public.departments d ON c.department_id = d.id
LEFT JOIN public.deputies dep ON c.deputy_id = dep.id
GROUP BY c.id, s.id, s.name, s.name_ar, d.id, d.name, d.name_ar, dep.id, dep.name, dep.name_ar;

-- Ensure proper RLS on the views by granting select to authenticated users
GRANT SELECT ON public.challenges_with_details TO authenticated;
GRANT SELECT ON public.events_with_details TO authenticated;
GRANT SELECT ON public.campaigns_with_details TO authenticated;
GRANT SELECT ON public.opportunities_with_details TO authenticated;

-- Update functions to have proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$;