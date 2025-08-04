-- Fix security linter issues by adding proper search_path to functions
CREATE OR REPLACE FUNCTION public.calculate_profile_completion()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path TO 'public'
AS $$
DECLARE
  completion_score INTEGER := 0;
  total_fields INTEGER := 10;
BEGIN
  -- Base fields (always present)
  completion_score := 2; -- email and created_at
  
  -- Use existing profile table structure
  IF NEW.name IS NOT NULL AND LENGTH(NEW.name) > 0 THEN
    completion_score := completion_score + 1;
  END IF;
  
  IF NEW.name_ar IS NOT NULL AND LENGTH(NEW.name_ar) > 0 THEN
    completion_score := completion_score + 1;
  END IF;
  
  IF NEW.profile_image_url IS NOT NULL THEN
    completion_score := completion_score + 1;
  END IF;
  
  IF NEW.bio IS NOT NULL AND LENGTH(NEW.bio) > 20 THEN
    completion_score := completion_score + 1;
  END IF;
  
  IF NEW.phone IS NOT NULL AND LENGTH(NEW.phone) > 0 THEN
    completion_score := completion_score + 1;
  END IF;
  
  IF NEW.department IS NOT NULL AND LENGTH(NEW.department) > 0 THEN
    completion_score := completion_score + 1;
  END IF;
  
  IF NEW.position IS NOT NULL AND LENGTH(NEW.position) > 0 THEN
    completion_score := completion_score + 1;
  END IF;
  
  -- Calculate percentage based on available fields
  NEW.profile_completion_percentage := ROUND((completion_score::FLOAT / total_fields::FLOAT) * 100);
  
  RETURN NEW;
END;
$$;

-- Add profile completion percentage column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profile_completion_percentage INTEGER DEFAULT 20;

-- Update trigger to be more specific about the operation
DROP TRIGGER IF EXISTS trigger_calculate_profile_completion ON public.profiles;
CREATE TRIGGER trigger_calculate_profile_completion
  BEFORE INSERT OR UPDATE OF name, name_ar, profile_image_url, bio, phone, department, position 
  ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_profile_completion();

-- Fix other functions search paths
CREATE OR REPLACE FUNCTION public.validate_role_assignment(assigner_user_id uuid, target_role app_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  assigner_roles public.app_role[];
  can_assign BOOLEAN := false;
  assignable_roles public.app_role[];
BEGIN
  -- Get all active roles of the assigner
  SELECT ARRAY_AGG(role) INTO assigner_roles
  FROM public.user_roles
  WHERE user_id = assigner_user_id AND is_active = true;
  
  -- Check if any of the assigner's roles can assign the target role
  FOR i IN 1..array_length(assigner_roles, 1) LOOP
    SELECT can_assign_roles INTO assignable_roles
    FROM public.role_hierarchy
    WHERE role = assigner_roles[i];
    
    IF target_role = ANY(assignable_roles) THEN
      can_assign := true;
      EXIT;
    END IF;
  END LOOP;
  
  RETURN can_assign;
END;
$$;

-- Update assign_role_with_justification function
CREATE OR REPLACE FUNCTION public.assign_role_with_justification(target_user_id uuid, target_role app_role, justification text DEFAULT NULL::text, expires_at timestamp with time zone DEFAULT NULL::timestamp with time zone)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  role_assignment_id UUID;
BEGIN
  -- Validate assignment permissions
  IF NOT public.validate_role_assignment(auth.uid(), target_role) THEN
    RAISE EXCEPTION 'Insufficient privileges to assign role: %', target_role;
  END IF;
  
  -- Insert or update role assignment
  INSERT INTO public.user_roles (user_id, role, is_active, expires_at, granted_at)
  VALUES (target_user_id, target_role, true, expires_at, now())
  ON CONFLICT (user_id, role)
  DO UPDATE SET 
    is_active = true,
    expires_at = EXCLUDED.expires_at,
    granted_at = now()
  RETURNING id INTO role_assignment_id;
  
  -- Log with justification
  UPDATE public.role_audit_log 
  SET justification = assign_role_with_justification.justification
  WHERE target_user_id = assign_role_with_justification.target_user_id 
    AND target_role = assign_role_with_justification.target_role
    AND performed_by = auth.uid()
    AND created_at >= now() - INTERVAL '1 minute';
  
  RETURN role_assignment_id;
END;
$$;