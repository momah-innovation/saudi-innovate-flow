-- Fix RLS policies for challenges to allow regular users to view normal sensitivity challenges

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can view accessible challenges" ON public.challenges;
DROP POLICY IF EXISTS "Public can view normal sensitivity challenges" ON public.challenges;
DROP POLICY IF EXISTS "Users can view challenges based on sensitivity and organization" ON public.challenges;

-- Create new comprehensive policy for viewing challenges
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
      -- User has specific access to this challenge
      user_has_access_to_challenge(id)
      OR
      -- User has admin/evaluator roles
      has_role(auth.uid(), 'admin'::app_role) 
      OR has_role(auth.uid(), 'super_admin'::app_role)
      OR has_role(auth.uid(), 'evaluator'::app_role)
      OR
      -- User is part of innovation team
      EXISTS (
        SELECT 1 FROM innovation_team_members itm 
        WHERE itm.user_id = auth.uid() AND itm.status = 'active'
      )
    )
  )
);

-- Ensure challenge_participants table has proper RLS
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;

-- Create policy for challenge_participants to allow viewing participant counts
CREATE POLICY IF NOT EXISTS "Anyone can view challenge participant counts"
ON public.challenge_participants
FOR SELECT
TO public
USING (true);