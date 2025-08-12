-- Add missing organization_admin role to the app_role enum if it doesn't exist
DO $$ 
BEGIN
    BEGIN
        ALTER TYPE app_role ADD VALUE 'organization_admin';
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
END $$;

-- Update the user_has_access_to_challenge function with comprehensive access control
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
    
    -- Check if user is an entity manager for any relevant entities
    IF EXISTS (
        SELECT 1 FROM entity_manager_assignments ema
        WHERE ema.manager_id = current_user_id 
        AND ema.is_active = true
        AND (
            -- Check if they manage entities related to the challenge
            challenge_record.department_id IS NOT NULL OR
            challenge_record.deputy_id IS NOT NULL OR
            challenge_record.sector_id IS NOT NULL OR
            challenge_record.domain_id IS NOT NULL OR
            challenge_record.sub_domain_id IS NOT NULL OR
            challenge_record.service_id IS NOT NULL
        )
    ) THEN
        RETURN true;
    END IF;
    
    -- Check if user was invited to access challenges (via user_invitations)
    IF EXISTS (
        SELECT 1 FROM user_invitations ui
        JOIN auth.users au ON au.email = ui.email
        WHERE au.id = current_user_id
        AND ui.status = 'accepted'
        AND ui.accepted_by = current_user_id
        AND (ui.initial_roles && ARRAY['expert', 'evaluator', 'domain_expert', 'challenge_manager']::text[])
    ) THEN
        RETURN true;
    END IF;
    
    -- Get user profile for organizational checks
    SELECT department, position INTO user_profile
    FROM public.profiles 
    WHERE id = current_user_id;
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Check organizational access based on user profile
    -- Users from the same department, deputy, or sector can access sensitive challenges
    IF (
        (challenge_record.department_id IS NOT NULL AND user_profile.department IS NOT NULL 
         AND EXISTS (SELECT 1 FROM departments WHERE id = challenge_record.department_id AND name = user_profile.department))
        OR 
        (challenge_record.deputy_id IS NOT NULL AND user_profile.department IS NOT NULL
         AND EXISTS (SELECT 1 FROM deputies d WHERE d.id = challenge_record.deputy_id))
        OR
        (challenge_record.sector_id IS NOT NULL AND user_profile.department IS NOT NULL
         AND EXISTS (SELECT 1 FROM sectors s WHERE s.id = challenge_record.sector_id))
    ) THEN
        RETURN true;
    END IF;
    
    -- Check if user is an innovation team member (can access most challenges)
    IF EXISTS (
        SELECT 1 FROM innovation_team_members itm 
        WHERE itm.user_id = current_user_id AND itm.status = 'active'
    ) THEN
        RETURN true;
    END IF;
    
    -- Check if user has evaluator or domain expert role (can access restricted challenges for evaluation)
    IF challenge_record.sensitivity_level = 'restricted' AND (
        has_role(current_user_id, 'evaluator'::app_role) 
        OR has_role(current_user_id, 'domain_expert'::app_role)
        OR has_role(current_user_id, 'expert_coordinator'::app_role)
        OR has_role(current_user_id, 'external_expert'::app_role)
    ) THEN
        RETURN true;
    END IF;
    
    -- Check role-based access controls for specific challenge access
    IF EXISTS (
        SELECT 1 FROM role_access_controls rac
        JOIN user_roles ur ON ur.role = rac.role
        WHERE ur.user_id = current_user_id
        AND ur.is_active = true
        AND rac.is_active = true
        AND rac.resource_type = 'challenge'
        AND (rac.resource_name = challenge_id::text OR rac.resource_name = 'all')
        AND rac.access_level IN ('read', 'admin')
    ) THEN
        RETURN true;
    END IF;
    
    -- Default deny for confidential challenges
    RETURN false;
END;
$function$;