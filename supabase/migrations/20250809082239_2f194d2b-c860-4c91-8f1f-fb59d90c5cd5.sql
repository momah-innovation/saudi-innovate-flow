-- Fix security issues identified by the linter
-- Fix function search path issues by setting explicit search_path

-- Update the update_entity_analytics function with explicit search_path
CREATE OR REPLACE FUNCTION public.update_entity_analytics()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Update analytics for the affected entity
  INSERT INTO public.entity_analytics (
    entity_id, 
    total_deputies, 
    total_departments, 
    total_domains, 
    total_sub_domains, 
    total_services
  )
  SELECT 
    COALESCE(NEW.entity_id, OLD.entity_id),
    (SELECT COUNT(*) FROM public.deputies WHERE entity_id = COALESCE(NEW.entity_id, OLD.entity_id)),
    (SELECT COUNT(*) FROM public.departments WHERE entity_id = COALESCE(NEW.entity_id, OLD.entity_id)),
    (SELECT COUNT(*) FROM public.domains WHERE entity_id = COALESCE(NEW.entity_id, OLD.entity_id)),
    (SELECT COUNT(*) FROM public.sub_domains WHERE entity_id = COALESCE(NEW.entity_id, OLD.entity_id)),
    (SELECT COUNT(*) FROM public.services WHERE entity_id = COALESCE(NEW.entity_id, OLD.entity_id))
  ON CONFLICT (entity_id) DO UPDATE SET
    total_deputies = EXCLUDED.total_deputies,
    total_departments = EXCLUDED.total_departments,
    total_domains = EXCLUDED.total_domains,
    total_sub_domains = EXCLUDED.total_sub_domains,
    total_services = EXCLUDED.total_services,
    last_updated = now();
    
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Update the assign_entity_manager function with explicit search_path
CREATE OR REPLACE FUNCTION public.assign_entity_manager(
  p_entity_id UUID,
  p_manager_id UUID,
  p_assignment_notes TEXT DEFAULT NULL
)
RETURNS UUID 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  assignment_id UUID;
BEGIN
  -- Only super admins can assign entity managers
  IF NOT public.has_role(auth.uid(), 'super_admin'::public.app_role) THEN
    RAISE EXCEPTION 'Only super admins can assign entity managers';
  END IF;
  
  -- Revoke any existing active assignments
  UPDATE public.entity_manager_assignments 
  SET is_active = false, revoked_at = now(), revoked_by = auth.uid()
  WHERE entity_id = p_entity_id AND is_active = true;
  
  -- Update entity table
  UPDATE public.entities 
  SET entity_manager_id = p_manager_id, updated_at = now()
  WHERE id = p_entity_id;
  
  -- Create new assignment record
  INSERT INTO public.entity_manager_assignments (
    entity_id, manager_id, assigned_by, assignment_notes
  ) VALUES (
    p_entity_id, p_manager_id, auth.uid(), p_assignment_notes
  ) RETURNING id INTO assignment_id;
  
  RETURN assignment_id;
END;
$$;