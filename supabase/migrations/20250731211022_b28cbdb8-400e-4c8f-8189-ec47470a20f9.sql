-- Security Fix 1: Enhanced Role Management with Hierarchy Validation
-- Create role hierarchy table with correct column names

CREATE TABLE IF NOT EXISTS public.role_hierarchy (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role public.app_role NOT NULL,
  can_assign_roles public.app_role[] DEFAULT '{}',
  requires_approval_for public.app_role[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(role)
);

-- Now insert the hierarchy rules
INSERT INTO public.role_hierarchy (role, can_assign_roles, requires_approval_for) VALUES
  ('super_admin', ARRAY['super_admin', 'admin', 'moderator', 'team_member', 'partner', 'expert', 'innovator']::public.app_role[], ARRAY['super_admin']::public.app_role[]),
  ('admin', ARRAY['moderator', 'team_member', 'partner', 'expert', 'innovator']::public.app_role[], ARRAY['admin']::public.app_role[]),
  ('moderator', ARRAY['team_member', 'expert', 'innovator']::public.app_role[], ARRAY[]::public.app_role[])
ON CONFLICT (role) DO UPDATE SET
  can_assign_roles = EXCLUDED.can_assign_roles,
  requires_approval_for = EXCLUDED.requires_approval_for;

-- Create role approval requests table for sensitive role assignments
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

-- Enhanced audit logging with more details
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
ALTER TABLE public.role_hierarchy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;