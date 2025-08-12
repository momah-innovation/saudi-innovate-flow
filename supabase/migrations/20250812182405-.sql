-- Fix remaining critical security vulnerabilities

-- 1. Profiles table - restrict to user's own data
CREATE POLICY "Users can view and update their own profile" 
ON public.profiles 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 2. Departments - restrict to team members only
CREATE POLICY "Team members can view departments" 
ON public.departments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- 3. Deputies - restrict to team members only
CREATE POLICY "Team members can view deputies" 
ON public.deputies 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- 4. Recreate stakeholders policy (after it was dropped)
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

-- 5. Experts - restrict to team members only
CREATE POLICY "Team members can view experts" 
ON public.experts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- 6. Analytics and tracking tables - restrict to team members
CREATE POLICY "Team members can view analytics events" 
ON public.analytics_events 
FOR SELECT 
USING (
  user_id = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- 7. User journey tracking - restrict to user's own data and team members
CREATE POLICY "Users can view their own opportunity journeys" 
ON public.opportunity_user_journeys 
FOR SELECT 
USING (
  user_id = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- 8. View sessions - restrict to team members for analytics
CREATE POLICY "Team members can view session analytics" 
ON public.opportunity_view_sessions 
FOR SELECT 
USING (
  user_id = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Drop overly permissive existing policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Everyone can view departments" ON public.departments;
DROP POLICY IF EXISTS "Everyone can view deputies" ON public.deputies;
DROP POLICY IF EXISTS "Everyone can view experts" ON public.experts;