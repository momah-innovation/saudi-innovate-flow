-- Fix function search path issues for security
CREATE OR REPLACE FUNCTION public.user_has_access_to_challenge(challenge_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    challenge_record RECORD;
    user_profile RECORD;
    current_user_id UUID := auth.uid();
BEGIN
    -- Get challenge details
    SELECT 
        sensitivity_level, 
        partner_organization_id, 
        department_id, 
        deputy_id, 
        sector_id,
        domain_id,
        sub_domain_id,
        service_id
    INTO challenge_record
    FROM public.challenges
    WHERE id = challenge_id;
    
    -- If challenge not found, deny access
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Public challenges (normal sensitivity) are accessible to all authenticated users
    IF challenge_record.sensitivity_level IN ('normal', 'sensitivity.normal') THEN
        RETURN current_user_id IS NOT NULL;
    END IF;
    
    -- For restricted/confidential challenges, check user permissions
    IF current_user_id IS NULL THEN
        RETURN false;
    END IF;
    
    -- Check if user has admin privileges (always have access)
    IF has_role(current_user_id, 'admin'::app_role) OR has_role(current_user_id, 'super_admin'::app_role) THEN
        RETURN true;
    END IF;
    
    -- Check if user is a challenge manager or organization admin (can see all sensitive challenges)
    IF has_role(current_user_id, 'challenge_manager'::app_role) OR has_role(current_user_id, 'organization_admin'::app_role) THEN
        RETURN true;
    END IF;
    
    -- Check if user is an innovation team member (can access most challenges)
    IF EXISTS (
        SELECT 1 FROM innovation_team_members itm 
        WHERE itm.user_id = current_user_id AND itm.status = 'active'
    ) THEN
        RETURN true;
    END IF;
    
    -- Default deny for confidential challenges
    RETURN false;
END;
$function$;

-- Fix has_role function search path
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND is_active = true
  )
$$;

-- Fix other functions with search path issues
CREATE OR REPLACE FUNCTION public.is_team_member(user_uuid uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.innovation_team_members 
    WHERE user_id = user_uuid AND status = 'active'
  );
$function$;

-- Drop and recreate problematic policies that conflict
DROP POLICY IF EXISTS "Team members can view stakeholders" ON public.stakeholders;