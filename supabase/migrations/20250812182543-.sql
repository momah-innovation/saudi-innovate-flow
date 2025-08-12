-- Fix remaining critical security vulnerabilities with correct column names

-- 1. Profiles table - restrict to user's own data (using id column)
CREATE POLICY "Users can view and update their own profile" 
ON public.profiles 
FOR ALL 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

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

-- Drop overly permissive existing policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Everyone can view departments" ON public.departments;
DROP POLICY IF EXISTS "Everyone can view deputies" ON public.deputies;
DROP POLICY IF EXISTS "Everyone can view experts" ON public.experts;