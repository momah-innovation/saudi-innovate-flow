-- Fix RLS policies for challenges to include all relevant roles and correct column references

-- Drop the previous policy
DROP POLICY IF EXISTS "Users can view challenges with proper access" ON public.challenges;

-- Create comprehensive policy that includes all roles that should have access
CREATE POLICY "Users can view challenges with proper access"
ON public.challenges
FOR SELECT
TO public
USING (
  -- Anyone can view normal sensitivity challenges
  (sensitivity_level IN ('normal', 'sensitivity.normal'))
  OR
  -- Authenticated users can view challenges they have access to
  (
    auth.uid() IS NOT NULL 
    AND (
      -- User has specific access to this challenge via the access function
      user_has_access_to_challenge(id)
      OR
      -- User has any of these administrative or expert roles
      has_role(auth.uid(), 'admin'::app_role) 
      OR has_role(auth.uid(), 'super_admin'::app_role)
      OR has_role(auth.uid(), 'evaluator'::app_role)
      OR has_role(auth.uid(), 'challenge_manager'::app_role)
      OR has_role(auth.uid(), 'content_manager'::app_role)
      OR has_role(auth.uid(), 'partnership_manager'::app_role)
      OR has_role(auth.uid(), 'domain_expert'::app_role)
      OR has_role(auth.uid(), 'data_analyst'::app_role)
      OR
      -- User is part of innovation team
      EXISTS (
        SELECT 1 FROM innovation_team_members itm 
        WHERE itm.user_id = auth.uid() AND itm.status = 'active'
      )
      OR
      -- For restricted challenges, check if user is an innovator (basic user role)
      (sensitivity_level NOT IN ('confidential', 'restricted') AND has_role(auth.uid(), 'innovator'::app_role))
    )
  )
);