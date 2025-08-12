-- EMERGENCY FIX: Resolve infinite recursion and critical errors
-- Progress: Fixing policy recursion and missing columns

-- 1. Fix innovation_team_members infinite recursion by creating security definer function
CREATE OR REPLACE FUNCTION public.is_team_member(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.innovation_team_members 
    WHERE user_id = user_uuid AND status = 'active'
  );
$$;

-- 2. Recreate innovation_team_members policies without recursion
DROP POLICY IF EXISTS "Team members can view team info" ON public.innovation_team_members;
DROP POLICY IF EXISTS "Admins can manage team members" ON public.innovation_team_members;

CREATE POLICY "User can view own team membership" ON public.innovation_team_members
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all team members" ON public.innovation_team_members
FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Admins can manage team members" ON public.innovation_team_members
FOR ALL USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- 3. Fix file_records policy to use the new function
DROP POLICY IF EXISTS "Team members can view organization files" ON public.file_records;
CREATE POLICY "Team members can view organization files" ON public.file_records
FOR SELECT USING (
  public.is_team_member(auth.uid()) OR
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- 4. Fix stakeholders policy to use the new function
DROP POLICY IF EXISTS "Stakeholders view for team members only" ON public.stakeholders;
DROP POLICY IF EXISTS "Team members can manage stakeholders" ON public.stakeholders;

CREATE POLICY "Team members can view stakeholders" ON public.stakeholders
FOR SELECT USING (
  public.is_team_member(auth.uid()) OR
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Team members can manage stakeholders" ON public.stakeholders
FOR ALL USING (
  public.is_team_member(auth.uid()) OR
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- 5. Fix experts policies to use the new function
DROP POLICY IF EXISTS "Team members can view expert profiles" ON public.experts;
DROP POLICY IF EXISTS "Team members can manage experts" ON public.experts;

CREATE POLICY "Team members can view expert profiles" ON public.experts
FOR SELECT USING (
  public.is_team_member(auth.uid()) OR
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Team members can manage experts" ON public.experts
FOR ALL USING (
  user_id = auth.uid() OR
  public.is_team_member(auth.uid()) OR
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- 6. Fix innovators policies to use the new function
DROP POLICY IF EXISTS "Team members can view innovator profiles" ON public.innovators;
DROP POLICY IF EXISTS "Team members can manage innovator profiles" ON public.innovators;

CREATE POLICY "Team members can view innovator profiles" ON public.innovators
FOR SELECT USING (
  public.is_team_member(auth.uid()) OR
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);