-- Fix remaining critical security issues by implementing proper RLS policies

-- 1. Challenge participants - restrict to team members and participants themselves
CREATE POLICY "Team members can view all challenge participants" 
ON public.challenge_participants 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) 
  OR has_role(auth.uid(), 'admin'::app_role)
  OR user_id = auth.uid()
);

-- 2. Challenges - implement sensitivity-based access control
CREATE POLICY "Users can view challenges based on sensitivity level" 
ON public.challenges 
FOR SELECT 
USING (
  CASE 
    WHEN sensitivity_level = 'normal' THEN auth.uid() IS NOT NULL
    WHEN sensitivity_level IN ('restricted', 'confidential') THEN 
      user_has_access_to_challenge(id)
    ELSE false
  END
);

-- 3. Campaigns - restrict to team members only
CREATE POLICY "Team members can view campaigns" 
ON public.campaigns 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- 4. Stakeholders - restrict to team members only  
CREATE POLICY "Team members can view stakeholders" 
ON public.stakeholders 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- 5. Opportunities - implement role-based access
CREATE POLICY "Users can view opportunities based on sensitivity" 
ON public.opportunities 
FOR SELECT 
USING (
  CASE 
    WHEN sensitivity_level = 'public' THEN true
    WHEN sensitivity_level IN ('internal', 'confidential') THEN 
      EXISTS (
        SELECT 1 FROM innovation_team_members itm 
        WHERE itm.user_id = auth.uid() AND itm.status = 'active'
      ) 
      OR has_role(auth.uid(), 'admin'::app_role)
    ELSE false
  END
);

-- 6. Innovation team members - restrict to team members and admins
CREATE POLICY "Team members can view team structure" 
ON public.innovation_team_members 
FOR SELECT 
USING (
  user_id = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- 7. Events - implement role-based access control
CREATE POLICY "Users can view events based on visibility" 
ON public.events 
FOR SELECT 
USING (
  CASE 
    WHEN visibility_level = 'public' THEN true
    WHEN visibility_level IN ('internal', 'restricted') THEN 
      EXISTS (
        SELECT 1 FROM innovation_team_members itm 
        WHERE itm.user_id = auth.uid() AND itm.status = 'active'
      ) 
      OR has_role(auth.uid(), 'admin'::app_role)
      OR auth.uid() = event_manager_id
    ELSE false
  END
);

-- Remove overly permissive policies that allow public access to sensitive data
DROP POLICY IF EXISTS "All users can view campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can view challenge participants" ON public.challenge_participants;
DROP POLICY IF EXISTS "Anyone can view stakeholders" ON public.stakeholders;
DROP POLICY IF EXISTS "All authenticated users can view opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Team members can view team members" ON public.innovation_team_members;
DROP POLICY IF EXISTS "All users can view events" ON public.events;
DROP POLICY IF EXISTS "All users can view challenges" ON public.challenges;