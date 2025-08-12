-- FINAL SECURITY HARDENING: Complete with correct syntax
-- Progress: Completing security hardening with proper policy syntax

-- 1. Fix org_subscriptions table
CREATE POLICY "Admin users can view their org subscriptions" ON public.org_subscriptions
FOR SELECT USING (
  admin_user_id = auth.uid() OR
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- 2. Fix idea_notifications table
CREATE POLICY "Users can view their own idea notifications" ON public.idea_notifications
FOR SELECT USING (recipient_id = auth.uid());

-- 3. Secure deputies table properly
CREATE POLICY "Team members and admins can view deputies" ON public.deputies
FOR SELECT USING (
  public.is_team_member(auth.uid()) OR
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- 4. Fix stakeholders policies with proper syntax
CREATE POLICY "Team members can view stakeholders" ON public.stakeholders
FOR SELECT USING (
  public.is_team_member(auth.uid()) OR
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Team members can insert stakeholders" ON public.stakeholders
FOR INSERT WITH CHECK (
  public.is_team_member(auth.uid()) OR
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Team members can update stakeholders" ON public.stakeholders
FOR UPDATE USING (
  public.is_team_member(auth.uid()) OR
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Team members can delete stakeholders" ON public.stakeholders
FOR DELETE USING (
  public.is_team_member(auth.uid()) OR
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- 5. Create profiles security
CREATE POLICY "Basic profile info viewable" ON public.profiles
FOR SELECT USING (
  id = auth.uid() OR
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- 6. Ensure innovation_team_members is properly secured
CREATE POLICY "Team members can view team info" ON public.innovation_team_members
FOR SELECT USING (
  user_id = auth.uid() OR
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);