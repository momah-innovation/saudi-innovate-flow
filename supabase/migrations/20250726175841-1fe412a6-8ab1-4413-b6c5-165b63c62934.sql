-- Fix search path security issues
CREATE OR REPLACE FUNCTION public.validate_role_assignment(
  assigner_user_id UUID,
  target_role app_role
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  assigner_roles app_role[];
  can_assign BOOLEAN := false;
  assignable_roles app_role[];
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

CREATE OR REPLACE FUNCTION public.validate_role_assignment_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Skip validation for system operations (when performed by postgres/system)
  IF session_user = 'postgres' OR session_user = 'supabase_admin' THEN
    RETURN NEW;
  END IF;
  
  -- Validate role assignment permissions
  IF NOT public.validate_role_assignment(auth.uid(), NEW.role) THEN
    RAISE EXCEPTION 'Insufficient privileges to assign role: %', NEW.role;
  END IF;
  
  -- Log the role assignment
  INSERT INTO public.role_audit_log (
    action_type,
    target_user_id,
    target_role,
    performed_by,
    new_expires_at,
    metadata
  ) VALUES (
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'ASSIGN'
      WHEN TG_OP = 'UPDATE' AND OLD.is_active = true AND NEW.is_active = false THEN 'REVOKE'
      WHEN TG_OP = 'UPDATE' THEN 'MODIFY'
      ELSE 'UNKNOWN'
    END,
    NEW.user_id,
    NEW.role,
    auth.uid(),
    NEW.expires_at,
    jsonb_build_object(
      'is_active', NEW.is_active,
      'granted_at', NEW.granted_at
    )
  );
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.assign_role_with_justification(
  target_user_id UUID,
  target_role app_role,
  justification TEXT DEFAULT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
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