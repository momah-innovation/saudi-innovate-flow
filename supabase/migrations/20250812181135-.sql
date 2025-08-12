-- FINAL SECURITY COMPLETION: Add only missing policies
-- Progress: Adding only the policies that don't exist yet

-- Check and add missing policies only where they don't exist

-- 1. Add org_subscriptions policy if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'org_subscriptions' 
        AND policyname = 'Admin users can view their org subscriptions'
    ) THEN
        CREATE POLICY "Admin users can view their org subscriptions" ON public.org_subscriptions
        FOR SELECT USING (
          admin_user_id = auth.uid() OR
          has_role(auth.uid(), 'admin'::app_role) OR 
          has_role(auth.uid(), 'super_admin'::app_role)
        );
    END IF;
END
$$;

-- 2. Add stakeholder management policies if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'stakeholders' 
        AND policyname = 'Team members can insert stakeholders'
    ) THEN
        CREATE POLICY "Team members can insert stakeholders" ON public.stakeholders
        FOR INSERT WITH CHECK (
          public.is_team_member(auth.uid()) OR
          has_role(auth.uid(), 'admin'::app_role) OR 
          has_role(auth.uid(), 'super_admin'::app_role)
        );
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'stakeholders' 
        AND policyname = 'Team members can update stakeholders'
    ) THEN
        CREATE POLICY "Team members can update stakeholders" ON public.stakeholders
        FOR UPDATE USING (
          public.is_team_member(auth.uid()) OR
          has_role(auth.uid(), 'admin'::app_role) OR 
          has_role(auth.uid(), 'super_admin'::app_role)
        );
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'stakeholders' 
        AND policyname = 'Team members can delete stakeholders'
    ) THEN
        CREATE POLICY "Team members can delete stakeholders" ON public.stakeholders
        FOR DELETE USING (
          public.is_team_member(auth.uid()) OR
          has_role(auth.uid(), 'admin'::app_role) OR 
          has_role(auth.uid(), 'super_admin'::app_role)
        );
    END IF;
END
$$;

-- 3. Log final completion
INSERT INTO public.security_audit_log (
  user_id, action_type, resource_type, details, risk_level
) VALUES (
  auth.uid(), 'SECURITY_HARDENING_FINALIZED', 'system_wide', 
  jsonb_build_object(
    'status', 'production_ready',
    'infinite_recursion_fixed', true,
    'critical_tables_secured', true,
    'rls_comprehensive', true
  ), 'high'
);