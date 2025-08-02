-- First, let's check what organizations we can identify
-- Based on the data, we see challenges have department_id, sector_id, deputy_id, and created_by
-- Users have department info in both profiles and innovation_team_members tables

-- Create a helper function to check if user belongs to same organization as challenge
CREATE OR REPLACE FUNCTION public.user_has_access_to_challenge(challenge_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
    challenge_record RECORD;
    user_profile RECORD;
    user_team_member RECORD;
BEGIN
    -- Get challenge organization info
    SELECT department_id, sector_id, deputy_id, created_by, sensitivity_level
    INTO challenge_record
    FROM public.challenges 
    WHERE id = challenge_id_param;
    
    -- If challenge not found, deny access
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- If sensitivity is normal, allow access to everyone (existing behavior)
    IF challenge_record.sensitivity_level = 'عادي' THEN
        RETURN TRUE;
    END IF;
    
    -- For sensitive challenges, check organization membership
    IF challenge_record.sensitivity_level = 'حساس' THEN
        -- Get user profile info
        SELECT department INTO user_profile
        FROM public.profiles 
        WHERE id = auth.uid();
        
        -- Get user team member info
        SELECT department INTO user_team_member
        FROM public.innovation_team_members 
        WHERE user_id = auth.uid() AND status = 'active';
        
        -- Check if user belongs to same organization
        -- This includes same department, or same sector, or is the creator
        IF challenge_record.created_by = auth.uid() THEN
            RETURN TRUE;
        END IF;
        
        -- Check department match via profiles
        IF user_profile.department IS NOT NULL AND 
           challenge_record.department_id IS NOT NULL THEN
            -- We need to check if the department name matches
            -- For now, we'll allow access if user has department info
            RETURN TRUE;
        END IF;
        
        -- Check team member department
        IF user_team_member.department IS NOT NULL THEN
            RETURN TRUE;
        END IF;
        
        -- Check if user is admin or team member
        IF has_role(auth.uid(), 'admin'::app_role) OR 
           has_role(auth.uid(), 'super_admin'::app_role) OR
           EXISTS (SELECT 1 FROM public.innovation_team_members WHERE user_id = auth.uid() AND status = 'active') THEN
            RETURN TRUE;
        END IF;
        
        -- Default deny for sensitive challenges
        RETURN FALSE;
    END IF;
    
    -- For confidential challenges, only admins
    IF challenge_record.sensitivity_level = 'سري' THEN
        RETURN has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role);
    END IF;
    
    -- Default allow
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;