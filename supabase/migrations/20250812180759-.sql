-- FINAL SECURITY HARDENING: Complete with policy fixes
-- Progress: Completing security hardening without conflicts

-- 1. Fix org_subscriptions table with correct columns
DROP POLICY IF EXISTS "Organizations can view their own subscriptions" ON public.org_subscriptions;
CREATE POLICY "Admin users can view their org subscriptions" ON public.org_subscriptions
FOR SELECT USING (
  admin_user_id = auth.uid() OR
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- 2. Fix idea_notifications table with correct column
DROP POLICY IF EXISTS "Users can view their own idea notifications" ON public.idea_notifications;
CREATE POLICY "Users can view their own idea notifications" ON public.idea_notifications
FOR SELECT USING (recipient_id = auth.uid());

-- 3. Secure deputies table properly (it has sensitive contact emails)
DROP POLICY IF EXISTS "Authenticated users can view deputies" ON public.deputies;
CREATE POLICY "Team members and admins can view deputies" ON public.deputies
FOR SELECT USING (
  public.is_team_member(auth.uid()) OR
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- 4. Fix stakeholders policies (drop and recreate to avoid conflicts)
DROP POLICY IF EXISTS "Team members can manage stakeholders" ON public.stakeholders;
DROP POLICY IF EXISTS "Public can view basic stakeholder info" ON public.stakeholders;

CREATE POLICY "Team members can view stakeholders" ON public.stakeholders
FOR SELECT USING (
  public.is_team_member(auth.uid()) OR
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Team members can modify stakeholders" ON public.stakeholders
FOR INSERT, UPDATE, DELETE USING (
  public.is_team_member(auth.uid()) OR
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- 5. Create additional profiles security (restrict to own profile + admins)
DROP POLICY IF EXISTS "Team members can view member profiles" ON public.profiles;
CREATE POLICY "Basic profile info viewable" ON public.profiles
FOR SELECT USING (
  id = auth.uid() OR
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- 6. Ensure innovation_team_members is properly secured
DROP POLICY IF EXISTS "User can view own team membership" ON public.innovation_team_members;
CREATE POLICY "Team members can view team info" ON public.innovation_team_members
FOR SELECT USING (
  user_id = auth.uid() OR
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);