-- Security Fix 1: Enhanced Role Management with Hierarchy Validation
-- Check if role_hierarchy table exists and add missing column
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'role_hierarchy') THEN
    -- Add missing column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'role_hierarchy' AND column_name = 'requires_approval_for') THEN
      ALTER TABLE public.role_hierarchy ADD COLUMN requires_approval_for public.app_role[] DEFAULT '{}';
    END IF;
  ELSE
    -- Create table if it doesn't exist
    CREATE TABLE public.role_hierarchy (
      id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      role public.app_role NOT NULL,
      can_assign_roles public.app_role[] DEFAULT '{}',
      requires_approval_for public.app_role[] DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      UNIQUE(role)
    );
  END IF;
END
$$;

-- Insert role hierarchy rules using valid enum values
INSERT INTO public.role_hierarchy (role, can_assign_roles, requires_approval_for) VALUES
  ('super_admin', ARRAY['super_admin', 'admin', 'sector_lead', 'department_head', 'domain_expert', 'evaluator', 'innovator', 'user_manager', 'role_manager', 'challenge_manager', 'expert_coordinator', 'content_manager', 'system_auditor', 'data_analyst', 'campaign_manager', 'event_manager', 'stakeholder_manager', 'partnership_manager', 'viewer']::public.app_role[], ARRAY['super_admin']::public.app_role[]),
  ('admin', ARRAY['sector_lead', 'department_head', 'domain_expert', 'evaluator', 'innovator', 'user_manager', 'challenge_manager', 'expert_coordinator', 'content_manager', 'data_analyst', 'campaign_manager', 'event_manager', 'stakeholder_manager', 'partnership_manager', 'viewer']::public.app_role[], ARRAY['admin']::public.app_role[]),
  ('user_manager', ARRAY['innovator', 'viewer']::public.app_role[], ARRAY[]::public.app_role[]),
  ('role_manager', ARRAY['domain_expert', 'evaluator', 'innovator', 'viewer']::public.app_role[], ARRAY[]::public.app_role[])
ON CONFLICT (role) DO UPDATE SET
  can_assign_roles = EXCLUDED.can_assign_roles,
  requires_approval_for = EXCLUDED.requires_approval_for;

-- Enable RLS on role_hierarchy if not already enabled
ALTER TABLE public.role_hierarchy ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for role hierarchy if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'role_hierarchy' AND policyname = 'Anyone can view role hierarchy') THEN
    CREATE POLICY "Anyone can view role hierarchy" ON public.role_hierarchy
      FOR SELECT TO authenticated USING (true);
  END IF;
END
$$;

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