-- Fix security issues: Update functions with proper search_path
-- Drop policy, recreate function, then recreate policy

-- Drop the dependent policy first
DROP POLICY IF EXISTS "Users can view challenges based on sensitivity and organization" ON public.challenges;

-- Drop and recreate function with proper signature and search path
DROP FUNCTION IF EXISTS public.user_has_access_to_challenge(uuid);

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

-- Recreate the policy with the updated function
CREATE POLICY "Users can view challenges based on sensitivity and organization" 
ON public.challenges
FOR SELECT 
USING (user_has_access_to_challenge(id));