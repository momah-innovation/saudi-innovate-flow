-- ADDITIONAL SECURITY HARDENING: Address remaining security issues (corrected)
-- Progress: Securing notification, analytics, audit, and file tables

-- 1. Fix analytics_events table (User Behavior Data)
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all analytics" ON public.analytics_events;
CREATE POLICY "Super admins and analysts can view analytics" ON public.analytics_events
FOR SELECT USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- 2. Fix notifications tables (Private Communications)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" ON public.notifications
FOR SELECT USING (recipient_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage their own notifications" ON public.notifications;
CREATE POLICY "Users can manage their own notifications" ON public.notifications
FOR UPDATE USING (recipient_id = auth.uid());

-- 3. Fix security_audit_log table (Security Information)
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admins can view audit logs" ON public.security_audit_log;
CREATE POLICY "Super admins only can view security audit logs" ON public.security_audit_log
FOR SELECT USING (has_role(auth.uid(), 'super_admin'::app_role));

-- 4. Fix file_records table (File Information)
ALTER TABLE public.file_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own files" ON public.file_records;
CREATE POLICY "Users can view their own files" ON public.file_records
FOR SELECT USING (uploader_id = auth.uid());

DROP POLICY IF EXISTS "Team members can view organization files" ON public.file_records;
CREATE POLICY "Team members can view organization files" ON public.file_records
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) OR 
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

DROP POLICY IF EXISTS "Users can manage their own files" ON public.file_records;
CREATE POLICY "Users can manage their own files" ON public.file_records
FOR ALL USING (uploader_id = auth.uid());

-- 5. Fix user_roles table (Role Management Security)
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles" ON public.user_roles
FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- 6. Additional security for subscription tables
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.user_subscriptions;
CREATE POLICY "Users can view their own subscriptions" ON public.user_subscriptions
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.user_subscriptions;
CREATE POLICY "Billing admins can view subscriptions" ON public.user_subscriptions
FOR SELECT USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR
  has_role(auth.uid(), 'admin'::app_role)
);

-- 7. Secure realtime_notifications table
ALTER TABLE public.realtime_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own realtime notifications" ON public.realtime_notifications;
CREATE POLICY "Users can view their own realtime notifications" ON public.realtime_notifications
FOR SELECT USING (recipient_id = auth.uid());

-- 8. Secure idea_notifications table
ALTER TABLE public.idea_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own idea notifications" ON public.idea_notifications;
CREATE POLICY "Users can view their own idea notifications" ON public.idea_notifications
FOR SELECT USING (recipient_id = auth.uid());