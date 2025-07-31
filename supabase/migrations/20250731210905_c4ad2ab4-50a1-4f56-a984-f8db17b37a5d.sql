-- Security Fix 1: Enhanced Role Management with Hierarchy Validation
-- Add role hierarchy and validation system

-- Create role hierarchy table to define which roles can assign other roles
CREATE TABLE IF NOT EXISTS public.role_hierarchy (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role public.app_role NOT NULL,
  can_assign_roles public.app_role[] DEFAULT '{}',
  requires_approval_for public.app_role[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(role)
);

-- Insert role hierarchy rules
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

-- Enable RLS
ALTER TABLE public.role_hierarchy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_approval_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for role hierarchy (read-only for authenticated users)
CREATE POLICY "Anyone can view role hierarchy" ON public.role_hierarchy
  FOR SELECT TO authenticated USING (true);

-- RLS Policies for role approval requests
CREATE POLICY "Users can view their own requests" ON public.role_approval_requests
  FOR SELECT TO authenticated 
  USING (requester_id = auth.uid() OR target_user_id = auth.uid());

CREATE POLICY "Admins can view all requests" ON public.role_approval_requests
  FOR SELECT TO authenticated 
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can create role requests" ON public.role_approval_requests
  FOR INSERT TO authenticated 
  WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Admins can update requests" ON public.role_approval_requests
  FOR UPDATE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Enhanced role assignment function with hierarchy validation
CREATE OR REPLACE FUNCTION public.assign_role_with_validation(
  target_user_id UUID, 
  target_role public.app_role, 
  justification TEXT DEFAULT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  assigner_id UUID := auth.uid();
  role_assignment_id UUID;
  requires_approval BOOLEAN := false;
  approval_request_id UUID;
  result jsonb;
BEGIN
  -- Validate assignment permissions using enhanced function
  IF NOT public.validate_role_assignment(assigner_id, target_role) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Insufficient privileges to assign role: ' || target_role::text
    );
  END IF;
  
  -- Check if this role requires approval
  SELECT target_role = ANY(requires_approval_for) INTO requires_approval
  FROM public.role_hierarchy rh
  JOIN public.user_roles ur ON ur.role = rh.role
  WHERE ur.user_id = assigner_id AND ur.is_active = true
  LIMIT 1;
  
  -- If requires approval, create approval request instead
  IF requires_approval THEN
    INSERT INTO public.role_approval_requests (
      requester_id, target_user_id, requested_role, justification, expires_at
    ) VALUES (
      assigner_id, target_user_id, target_role, justification, expires_at
    ) RETURNING id INTO approval_request_id;
    
    RETURN jsonb_build_object(
      'success', true,
      'requires_approval', true,
      'approval_request_id', approval_request_id,
      'message', 'Role assignment requires approval and has been submitted for review'
    );
  END IF;
  
  -- Direct assignment for roles that don't require approval
  INSERT INTO public.user_roles (user_id, role, is_active, expires_at, granted_at)
  VALUES (target_user_id, target_role, true, expires_at, now())
  ON CONFLICT (user_id, role)
  DO UPDATE SET 
    is_active = true,
    expires_at = EXCLUDED.expires_at,
    granted_at = now()
  RETURNING id INTO role_assignment_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'requires_approval', false,
    'role_assignment_id', role_assignment_id,
    'message', 'Role assigned successfully'
  );
END;
$$;

-- Function to approve role requests
CREATE OR REPLACE FUNCTION public.approve_role_request(
  request_id UUID,
  approve BOOLEAN,
  reviewer_notes TEXT DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  request_record RECORD;
  role_assignment_id UUID;
BEGIN
  -- Get the request details
  SELECT * INTO request_record
  FROM public.role_approval_requests
  WHERE id = request_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Request not found or already processed'
    );
  END IF;
  
  -- Update the request status
  UPDATE public.role_approval_requests
  SET 
    status = CASE WHEN approve THEN 'approved' ELSE 'rejected' END,
    approver_id = auth.uid(),
    reviewer_notes = approve_role_request.reviewer_notes,
    reviewed_at = now()
  WHERE id = request_id;
  
  -- If approved, assign the role
  IF approve THEN
    INSERT INTO public.user_roles (user_id, role, is_active, expires_at, granted_at)
    VALUES (request_record.target_user_id, request_record.requested_role, true, request_record.expires_at, now())
    ON CONFLICT (user_id, role)
    DO UPDATE SET 
      is_active = true,
      expires_at = EXCLUDED.expires_at,
      granted_at = now()
    RETURNING id INTO role_assignment_id;
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'approved', approve,
    'role_assignment_id', role_assignment_id
  );
END;
$$;

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

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON public.security_audit_log
  FOR SELECT TO authenticated 
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  action_type VARCHAR(50),
  resource_type VARCHAR(50) DEFAULT NULL,
  resource_id UUID DEFAULT NULL,
  details jsonb DEFAULT '{}',
  risk_level VARCHAR(20) DEFAULT 'low'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.security_audit_log (
    user_id, action_type, resource_type, resource_id, details, risk_level
  ) VALUES (
    auth.uid(), action_type, resource_type, resource_id, details, risk_level
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;