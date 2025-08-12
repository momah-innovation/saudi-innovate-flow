-- CRITICAL SECURITY HARDENING: Fix all remaining exposed tables (corrected)
-- Progress: Securing 5 critical tables with proper RLS policies

-- 2. Fix stakeholders table (Contact Information Protection)
ALTER TABLE public.stakeholders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Stakeholders view for team members only" ON public.stakeholders;
CREATE POLICY "Stakeholders view for team members only" ON public.stakeholders
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) OR 
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

DROP POLICY IF EXISTS "Team members can manage stakeholders" ON public.stakeholders;
CREATE POLICY "Team members can manage stakeholders" ON public.stakeholders
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) OR 
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- 3. Fix innovation_team_members table (Internal Team Data)
DROP POLICY IF EXISTS "Everyone can view team members" ON public.innovation_team_members;

DROP POLICY IF EXISTS "Team members can view team info" ON public.innovation_team_members;
CREATE POLICY "Team members can view team info" ON public.innovation_team_members
FOR SELECT USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) OR 
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

DROP POLICY IF EXISTS "Admins can manage team members" ON public.innovation_team_members;
CREATE POLICY "Admins can manage team members" ON public.innovation_team_members
FOR ALL USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- 4. Fix experts table (Professional Information Protection)
ALTER TABLE public.experts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Experts can view their own profile" ON public.experts;
CREATE POLICY "Experts can view their own profile" ON public.experts
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Team members can view expert profiles" ON public.experts;
CREATE POLICY "Team members can view expert profiles" ON public.experts
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) OR 
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

DROP POLICY IF EXISTS "Team members can manage experts" ON public.experts;
CREATE POLICY "Team members can manage experts" ON public.experts
FOR ALL USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) OR 
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- 5. Fix innovators table (Performance Data Protection)
DROP POLICY IF EXISTS "Users can view innovator profiles" ON public.innovators;
DROP POLICY IF EXISTS "Innovators can view their own profile" ON public.innovators;

CREATE POLICY "Innovators can view their own profile" ON public.innovators
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Team members can view innovator profiles" ON public.innovators;
CREATE POLICY "Team members can view innovator profiles" ON public.innovators
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) OR 
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

DROP POLICY IF EXISTS "Users can manage their own innovator profile" ON public.innovators;
CREATE POLICY "Users can manage their own innovator profile" ON public.innovators
FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Team members can manage innovator profiles" ON public.innovators;
CREATE POLICY "Team members can manage innovator profiles" ON public.innovators
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) OR 
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);