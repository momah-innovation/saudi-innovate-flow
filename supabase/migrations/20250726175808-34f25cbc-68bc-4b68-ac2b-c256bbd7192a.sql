-- Security Fix 1: Role Hierarchy and Audit System
-- Create enum for role hierarchy levels
CREATE TYPE public.role_hierarchy_level AS ENUM ('1', '2', '3', '4', '5');

-- Create role hierarchy mapping table
CREATE TABLE public.role_hierarchy (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role app_role NOT NULL UNIQUE,
  hierarchy_level role_hierarchy_level NOT NULL,
  can_assign_roles app_role[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert role hierarchy data with correct role values
INSERT INTO public.role_hierarchy (role, hierarchy_level, can_assign_roles) VALUES
('super_admin', '5', ARRAY['admin', 'role_manager', 'user_manager', 'domain_expert', 'evaluator', 'innovator', 'viewer', 'sector_lead', 'department_head', 'challenge_manager', 'expert_coordinator', 'content_manager', 'system_auditor', 'data_analyst', 'campaign_manager', 'event_manager', 'stakeholder_manager', 'partnership_manager']::app_role[]),
('admin', '4', ARRAY['role_manager', 'user_manager', 'domain_expert', 'evaluator', 'innovator', 'viewer', 'sector_lead', 'department_head', 'challenge_manager', 'expert_coordinator', 'content_manager', 'data_analyst', 'campaign_manager', 'event_manager', 'stakeholder_manager', 'partnership_manager']::app_role[]),
('role_manager', '3', ARRAY['domain_expert', 'evaluator', 'innovator', 'viewer']::app_role[]),
('user_manager', '3', ARRAY['domain_expert', 'evaluator', 'innovator', 'viewer']::app_role[]),
('sector_lead', '3', ARRAY['department_head', 'domain_expert', 'evaluator', 'innovator', 'viewer']::app_role[]),
('challenge_manager', '2', ARRAY['evaluator', 'innovator', 'viewer']::app_role[]),
('campaign_manager', '2', ARRAY['innovator', 'viewer']::app_role[]),
('event_manager', '2', ARRAY['innovator', 'viewer']::app_role[]),
('stakeholder_manager', '2', ARRAY['innovator', 'viewer']::app_role[]),
('partnership_manager', '2', ARRAY['innovator', 'viewer']::app_role[]),
('expert_coordinator', '2', ARRAY['domain_expert', 'evaluator', 'viewer']::app_role[]),
('content_manager', '2', ARRAY['viewer']::app_role[]),
('system_auditor', '2', ARRAY[]::app_role[]),
('data_analyst', '2', ARRAY[]::app_role[]),
('department_head', '2', ARRAY['domain_expert', 'evaluator', 'innovator', 'viewer']::app_role[]),
('domain_expert', '1', ARRAY[]::app_role[]),
('evaluator', '1', ARRAY[]::app_role[]),
('innovator', '1', ARRAY[]::app_role[]),
('viewer', '1', ARRAY[]::app_role[]);

-- Create audit table for role changes
CREATE TABLE public.role_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action_type VARCHAR(50) NOT NULL,
  target_user_id UUID NOT NULL,
  target_role app_role NOT NULL,
  performed_by UUID NOT NULL,
  justification TEXT,
  old_expires_at TIMESTAMP WITH TIME ZONE,
  new_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB
);

-- Enable RLS on new tables
ALTER TABLE public.role_hierarchy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_audit_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for role hierarchy (read-only for all authenticated users)
CREATE POLICY "All authenticated users can view role hierarchy"
ON public.role_hierarchy
FOR SELECT
TO authenticated
USING (true);

-- Create RLS policies for audit log (admins and role managers can view)
CREATE POLICY "Admins can view role audit log"
ON public.role_audit_log
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'role_manager'::app_role)
);

-- Create security function to validate role assignments
CREATE OR REPLACE FUNCTION public.validate_role_assignment(
  assigner_user_id UUID,
  target_role app_role
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  assigner_roles app_role[];
  can_assign BOOLEAN := false;
  assignable_roles app_role[];
BEGIN
  -- Get all active roles of the assigner
  SELECT ARRAY_AGG(role) INTO assigner_roles
  FROM public.user_roles
  WHERE user_id = assigner_user_id AND is_active = true;
  
  -- Check if any of the assigner's roles can assign the target role
  FOR i IN 1..array_length(assigner_roles, 1) LOOP
    SELECT can_assign_roles INTO assignable_roles
    FROM public.role_hierarchy
    WHERE role = assigner_roles[i];
    
    IF target_role = ANY(assignable_roles) THEN
      can_assign := true;
      EXIT;
    END IF;
  END LOOP;
  
  RETURN can_assign;
END;
$$;

-- Create trigger function for role assignment validation
CREATE OR REPLACE FUNCTION public.validate_role_assignment_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Skip validation for system operations (when performed by postgres/system)
  IF session_user = 'postgres' OR session_user = 'supabase_admin' THEN
    RETURN NEW;
  END IF;
  
  -- Validate role assignment permissions
  IF NOT public.validate_role_assignment(auth.uid(), NEW.role) THEN
    RAISE EXCEPTION 'Insufficient privileges to assign role: %', NEW.role;
  END IF;
  
  -- Log the role assignment
  INSERT INTO public.role_audit_log (
    action_type,
    target_user_id,
    target_role,
    performed_by,
    new_expires_at,
    metadata
  ) VALUES (
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'ASSIGN'
      WHEN TG_OP = 'UPDATE' AND OLD.is_active = true AND NEW.is_active = false THEN 'REVOKE'
      WHEN TG_OP = 'UPDATE' THEN 'MODIFY'
      ELSE 'UNKNOWN'
    END,
    NEW.user_id,
    NEW.role,
    auth.uid(),
    NEW.expires_at,
    jsonb_build_object(
      'is_active', NEW.is_active,
      'granted_at', NEW.granted_at
    )
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for role assignment validation
CREATE TRIGGER validate_role_assignment_before_insert_update
  BEFORE INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_role_assignment_trigger();

-- Create function to safely assign roles with justification
CREATE OR REPLACE FUNCTION public.assign_role_with_justification(
  target_user_id UUID,
  target_role app_role,
  justification TEXT DEFAULT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  role_assignment_id UUID;
BEGIN
  -- Validate assignment permissions
  IF NOT public.validate_role_assignment(auth.uid(), target_role) THEN
    RAISE EXCEPTION 'Insufficient privileges to assign role: %', target_role;
  END IF;
  
  -- Insert or update role assignment
  INSERT INTO public.user_roles (user_id, role, is_active, expires_at, granted_at)
  VALUES (target_user_id, target_role, true, expires_at, now())
  ON CONFLICT (user_id, role)
  DO UPDATE SET 
    is_active = true,
    expires_at = EXCLUDED.expires_at,
    granted_at = now()
  RETURNING id INTO role_assignment_id;
  
  -- Log with justification
  UPDATE public.role_audit_log 
  SET justification = assign_role_with_justification.justification
  WHERE target_user_id = assign_role_with_justification.target_user_id 
    AND target_role = assign_role_with_justification.target_role
    AND performed_by = auth.uid()
    AND created_at >= now() - INTERVAL '1 minute';
  
  RETURN role_assignment_id;
END;
$$;