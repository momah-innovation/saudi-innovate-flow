-- Security Fix 1: Enhanced Role Management with Hierarchy Validation

-- Add missing column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'role_hierarchy' AND column_name = 'requires_approval_for') THEN
    ALTER TABLE public.role_hierarchy ADD COLUMN requires_approval_for public.app_role[] DEFAULT '{}';
  END IF;
END
$$;

-- Insert role hierarchy rules using valid enum values and hierarchy levels
INSERT INTO public.role_hierarchy (role, hierarchy_level, can_assign_roles, requires_approval_for) VALUES
  ('super_admin', '1', ARRAY['super_admin', 'admin', 'sector_lead', 'department_head', 'domain_expert', 'evaluator', 'innovator', 'user_manager', 'role_manager', 'challenge_manager', 'expert_coordinator', 'content_manager', 'system_auditor', 'data_analyst', 'campaign_manager', 'event_manager', 'stakeholder_manager', 'partnership_manager', 'viewer']::public.app_role[], ARRAY['super_admin']::public.app_role[]),
  ('admin', '2', ARRAY['sector_lead', 'department_head', 'domain_expert', 'evaluator', 'innovator', 'user_manager', 'challenge_manager', 'expert_coordinator', 'content_manager', 'data_analyst', 'campaign_manager', 'event_manager', 'stakeholder_manager', 'partnership_manager', 'viewer']::public.app_role[], ARRAY['admin']::public.app_role[]),
  ('user_manager', '3', ARRAY['innovator', 'viewer']::public.app_role[], ARRAY[]::public.app_role[]),
  ('role_manager', '3', ARRAY['domain_expert', 'evaluator', 'innovator', 'viewer']::public.app_role[], ARRAY[]::public.app_role[]),
  ('sector_lead', '3', ARRAY['innovator', 'viewer']::public.app_role[], ARRAY[]::public.app_role[]),
  ('department_head', '4', ARRAY['innovator', 'viewer']::public.app_role[], ARRAY[]::public.app_role[]),
  ('domain_expert', '4', ARRAY['innovator', 'viewer']::public.app_role[], ARRAY[]::public.app_role[])
ON CONFLICT (role) DO UPDATE SET
  hierarchy_level = EXCLUDED.hierarchy_level,
  can_assign_roles = EXCLUDED.can_assign_roles,
  requires_approval_for = EXCLUDED.requires_approval_for;

-- Create role approval requests table
CREATE TABLE IF NOT EXISTS public.role_approval_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  requested_role public.app_role NOT NULL,
  justification TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewer_notes TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Create security audit log table
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type VARCHAR(50) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  details jsonb DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  risk_level VARCHAR(20) DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.role_approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DO $$
BEGIN
  -- Role approval requests policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'role_approval_requests' AND policyname = 'Users can view their own requests') THEN
    CREATE POLICY "Users can view their own requests" ON public.role_approval_requests
      FOR SELECT TO authenticated 
      USING (requester_id = auth.uid() OR target_user_id = auth.uid());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'role_approval_requests' AND policyname = 'Admins can view all requests') THEN
    CREATE POLICY "Admins can view all requests" ON public.role_approval_requests
      FOR SELECT TO authenticated 
      USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'role_approval_requests' AND policyname = 'Users can create role requests') THEN
    CREATE POLICY "Users can create role requests" ON public.role_approval_requests
      FOR INSERT TO authenticated 
      WITH CHECK (requester_id = auth.uid());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'role_approval_requests' AND policyname = 'Admins can update requests') THEN
    CREATE POLICY "Admins can update requests" ON public.role_approval_requests
      FOR UPDATE TO authenticated 
      USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));
  END IF;

  -- Security audit log policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'security_audit_log' AND policyname = 'Admins can view audit logs') THEN
    CREATE POLICY "Admins can view audit logs" ON public.security_audit_log
      FOR SELECT TO authenticated 
      USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));
  END IF;
END
$$;