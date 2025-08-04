-- Fix security issues: Update functions with proper search_path
-- Fix function search path for existing functions

-- Update get_basic_storage_info function
CREATE OR REPLACE FUNCTION public.get_basic_storage_info()
 RETURNS TABLE(bucket_id text, bucket_name text, public boolean, created_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'storage'
AS $function$
BEGIN
  -- Basic bucket info accessible to authenticated users
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  RETURN QUERY
  SELECT 
    b.id as bucket_id,
    b.name as bucket_name,
    b.public,
    b.created_at
  FROM storage.buckets b
  ORDER BY b.name;
END;
$function$;

-- Update user_has_access_to_challenge function
CREATE OR REPLACE FUNCTION public.user_has_access_to_challenge(challenge_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    challenge_record RECORD;
    user_org_access BOOLEAN := false;
BEGIN
    -- Get challenge details
    SELECT sensitivity_level, partner_organization_id, department_id, deputy_id, sector_id
    INTO challenge_record
    FROM public.challenges
    WHERE id = challenge_id;
    
    -- If challenge not found, deny access
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Public challenges (normal sensitivity) are accessible to all authenticated users
    IF challenge_record.sensitivity_level = 'normal' THEN
        RETURN auth.uid() IS NOT NULL;
    END IF;
    
    -- For restricted/confidential challenges, check user permissions
    IF auth.uid() IS NULL THEN
        RETURN false;
    END IF;
    
    -- Check if user has admin privileges
    IF has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role) THEN
        RETURN true;
    END IF;
    
    -- Check organizational access based on user profile
    SELECT EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.user_id = auth.uid()
        AND (
            (challenge_record.department_id IS NOT NULL AND p.department = (SELECT name FROM departments WHERE id = challenge_record.department_id))
            OR (challenge_record.deputy_id IS NOT NULL AND p.deputy = (SELECT name FROM deputies WHERE id = challenge_record.deputy_id))
            OR (challenge_record.sector_id IS NOT NULL AND p.sector = (SELECT name FROM sectors WHERE id = challenge_record.sector_id))
        )
    ) INTO user_org_access;
    
    RETURN user_org_access;
END;
$function$;

-- Create auth context hook and provider components
-- This will be handled in React components

-- Enable leaked password protection at the auth level
-- This needs to be done through Supabase dashboard, but we'll document it

-- Log security improvements
INSERT INTO public.security_audit_log (
  user_id, action_type, resource_type, details, risk_level
) VALUES (
  auth.uid(), 'SECURITY_HARDENING', 'database_functions', 
  jsonb_build_object(
    'action', 'updated_function_search_paths',
    'functions_updated', ARRAY['get_basic_storage_info', 'user_has_access_to_challenge'],
    'security_improvements', ARRAY['search_path_hardening', 'access_control_verification']
  ), 'low'
);