-- Update the user_has_access_to_challenge function to include organizational access
CREATE OR REPLACE FUNCTION public.user_has_access_to_challenge(challenge_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    challenge_record RECORD;
    user_profile RECORD;
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
    IF challenge_record.sensitivity_level IN ('normal', 'sensitivity.normal') THEN
        RETURN auth.uid() IS NOT NULL;
    END IF;
    
    -- For restricted/confidential challenges, check user permissions
    IF auth.uid() IS NULL THEN
        RETURN false;
    END IF;
    
    -- Check if user has admin privileges (always have access)
    IF has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role) THEN
        RETURN true;
    END IF;
    
    -- Check if user is a challenge manager or organization admin (can see all sensitive challenges)
    IF has_role(auth.uid(), 'challenge_manager'::app_role) OR has_role(auth.uid(), 'organization_admin'::app_role) THEN
        RETURN true;
    END IF;
    
    -- Get user profile for organizational checks
    SELECT department, deputy, sector INTO user_profile
    FROM public.profiles 
    WHERE id = auth.uid();
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Check organizational access based on user profile
    -- Users from the same department, deputy, or sector can access sensitive challenges
    IF (
        (challenge_record.department_id IS NOT NULL AND user_profile.department IS NOT NULL 
         AND EXISTS (SELECT 1 FROM departments WHERE id = challenge_record.department_id AND name = user_profile.department))
        OR 
        (challenge_record.deputy_id IS NOT NULL AND user_profile.deputy IS NOT NULL
         AND EXISTS (SELECT 1 FROM deputies WHERE id = challenge_record.deputy_id AND name = user_profile.deputy))
        OR
        (challenge_record.sector_id IS NOT NULL AND user_profile.sector IS NOT NULL
         AND EXISTS (SELECT 1 FROM sectors WHERE id = challenge_record.sector_id AND name = user_profile.sector))
    ) THEN
        RETURN true;
    END IF;
    
    -- Check if user is an innovation team member (can access most challenges)
    IF EXISTS (
        SELECT 1 FROM innovation_team_members itm 
        WHERE itm.user_id = auth.uid() AND itm.status = 'active'
    ) THEN
        RETURN true;
    END IF;
    
    -- Check if user has evaluator or domain expert role (can access restricted challenges for evaluation)
    IF challenge_record.sensitivity_level = 'restricted' AND (
        has_role(auth.uid(), 'evaluator'::app_role) 
        OR has_role(auth.uid(), 'domain_expert'::app_role)
    ) THEN
        RETURN true;
    END IF;
    
    -- Default deny for confidential challenges
    RETURN false;
END;
$function$