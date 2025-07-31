-- Security Fix 2: Enhanced Role Assignment Functions and Security Monitoring

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
    -- Log failed permission attempt
    PERFORM public.log_security_event(
      'ROLE_ASSIGNMENT_DENIED',
      'user_roles',
      target_user_id,
      jsonb_build_object(
        'target_role', target_role,
        'target_user_id', target_user_id,
        'reason', 'insufficient_privileges'
      ),
      'medium'
    );
    
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
    
    -- Log approval request creation
    PERFORM public.log_security_event(
      'ROLE_APPROVAL_REQUESTED',
      'role_approval_requests',
      approval_request_id,
      jsonb_build_object(
        'target_role', target_role,
        'target_user_id', target_user_id,
        'justification', justification
      ),
      'low'
    );
    
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
  
  -- Log successful role assignment
  PERFORM public.log_security_event(
    'ROLE_ASSIGNED',
    'user_roles',
    role_assignment_id,
    jsonb_build_object(
      'target_role', target_role,
      'target_user_id', target_user_id,
      'expires_at', expires_at
    ),
    'medium'
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'requires_approval', false,
    'role_assignment_id', role_assignment_id,
    'message', 'Role assigned successfully'
  );
END;
$$;

-- Function to approve role requests with enhanced logging
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
  
  -- Log the approval/rejection decision
  PERFORM public.log_security_event(
    CASE WHEN approve THEN 'ROLE_REQUEST_APPROVED' ELSE 'ROLE_REQUEST_REJECTED' END,
    'role_approval_requests',
    request_id,
    jsonb_build_object(
      'target_role', request_record.requested_role,
      'target_user_id', request_record.target_user_id,
      'requester_id', request_record.requester_id,
      'reviewer_notes', reviewer_notes
    ),
    CASE WHEN approve THEN 'medium' ELSE 'low' END
  );
  
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
    
    -- Log the role assignment
    PERFORM public.log_security_event(
      'ROLE_ASSIGNED_VIA_APPROVAL',
      'user_roles',
      role_assignment_id,
      jsonb_build_object(
        'target_role', request_record.requested_role,
        'target_user_id', request_record.target_user_id,
        'approval_request_id', request_id
      ),
      'high'
    );
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'approved', approve,
    'role_assignment_id', role_assignment_id
  );
END;
$$;

-- Function to log security events with enhanced details
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

-- Function to revoke roles with enhanced security
CREATE OR REPLACE FUNCTION public.revoke_role_with_validation(
  target_user_id UUID, 
  target_role public.app_role,
  reason TEXT DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  revoker_id UUID := auth.uid();
BEGIN
  -- Validate revocation permissions (same as assignment permissions)
  IF NOT public.validate_role_assignment(revoker_id, target_role) THEN
    -- Log failed permission attempt
    PERFORM public.log_security_event(
      'ROLE_REVOCATION_DENIED',
      'user_roles',
      target_user_id,
      jsonb_build_object(
        'target_role', target_role,
        'target_user_id', target_user_id,
        'reason', 'insufficient_privileges'
      ),
      'medium'
    );
    
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Insufficient privileges to revoke role: ' || target_role::text
    );
  END IF;
  
  -- Deactivate the role
  UPDATE public.user_roles
  SET is_active = false, expires_at = now()
  WHERE user_id = target_user_id AND role = target_role AND is_active = true;
  
  -- Log role revocation
  PERFORM public.log_security_event(
    'ROLE_REVOKED',
    'user_roles',
    target_user_id,
    jsonb_build_object(
      'target_role', target_role,
      'target_user_id', target_user_id,
      'reason', reason
    ),
    'high'
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Role revoked successfully'
  );
END;
$$;