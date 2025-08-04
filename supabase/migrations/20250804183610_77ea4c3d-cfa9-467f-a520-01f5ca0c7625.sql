-- Create role_access_controls table to define what each role can access
CREATE TABLE public.role_access_controls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role app_role NOT NULL,
  resource_type VARCHAR(50) NOT NULL, -- 'page', 'feature', 'action'
  resource_name VARCHAR(100) NOT NULL, -- specific identifier
  access_level VARCHAR(20) NOT NULL DEFAULT 'read', -- 'none', 'read', 'write', 'admin'
  conditions JSONB DEFAULT '{}', -- additional conditions
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(role, resource_type, resource_name)
);

-- Enable RLS
ALTER TABLE public.role_access_controls ENABLE ROW LEVEL SECURITY;

-- Only super_admin can manage access controls
CREATE POLICY "Super admins can manage access controls" 
ON public.role_access_controls 
FOR ALL 
USING (has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

-- Admins can view access controls
CREATE POLICY "Admins can view access controls" 
ON public.role_access_controls 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Create audit log for access control changes
CREATE TABLE public.access_control_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  access_control_id UUID REFERENCES public.role_access_controls(id),
  action_type VARCHAR(20) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE'
  old_values JSONB,
  new_values JSONB,
  changed_by UUID REFERENCES auth.users(id),
  change_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.access_control_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can view access control audit log" 
ON public.access_control_audit_log 
FOR SELECT 
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Function to check role access
CREATE OR REPLACE FUNCTION public.check_role_access(
  user_role app_role,
  resource_type VARCHAR(50),
  resource_name VARCHAR(100)
) RETURNS VARCHAR(20)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  access_level VARCHAR(20) := 'none';
BEGIN
  SELECT rac.access_level INTO access_level
  FROM public.role_access_controls rac
  WHERE rac.role = user_role
    AND rac.resource_type = resource_type
    AND rac.resource_name = resource_name
    AND rac.is_active = true;
    
  RETURN COALESCE(access_level, 'none');
END;
$$;

-- Function to get user's highest access level for a resource
CREATE OR REPLACE FUNCTION public.get_user_access_level(
  user_id UUID,
  resource_type VARCHAR(50),
  resource_name VARCHAR(100)
) RETURNS VARCHAR(20)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  max_access VARCHAR(20) := 'none';
  user_role_record RECORD;
  role_access VARCHAR(20);
BEGIN
  -- Get all active roles for the user
  FOR user_role_record IN 
    SELECT ur.role 
    FROM public.user_roles ur 
    WHERE ur.user_id = get_user_access_level.user_id 
      AND ur.is_active = true
  LOOP
    -- Check access level for each role
    SELECT public.check_role_access(
      user_role_record.role::app_role, 
      resource_type, 
      resource_name
    ) INTO role_access;
    
    -- Determine highest access level
    IF role_access = 'admin' THEN
      max_access := 'admin';
    ELSIF role_access = 'write' AND max_access != 'admin' THEN
      max_access := 'write';
    ELSIF role_access = 'read' AND max_access NOT IN ('admin', 'write') THEN
      max_access := 'read';
    END IF;
  END LOOP;
  
  RETURN max_access;
END;
$$;

-- Trigger to audit access control changes
CREATE OR REPLACE FUNCTION public.audit_access_control_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.access_control_audit_log (
    access_control_id,
    action_type,
    old_values,
    new_values,
    changed_by,
    change_reason
  ) VALUES (
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'CREATE'
      WHEN TG_OP = 'UPDATE' THEN 'UPDATE'
      WHEN TG_OP = 'DELETE' THEN 'DELETE'
    END,
    CASE WHEN TG_OP != 'INSERT' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) ELSE NULL END,
    auth.uid(),
    'Access control change via admin interface'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER audit_access_control_changes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.role_access_controls
  FOR EACH ROW EXECUTE FUNCTION public.audit_access_control_changes();

-- Insert default access controls for core admin pages
INSERT INTO public.role_access_controls (role, resource_type, resource_name, access_level, created_by) VALUES
-- Super admin has admin access to everything
('super_admin', 'page', '/dashboard', 'admin', NULL),
('super_admin', 'page', '/dashboard/users', 'admin', NULL),
('super_admin', 'page', '/dashboard/roles', 'admin', NULL),
('super_admin', 'page', '/dashboard/access-control', 'admin', NULL),
('super_admin', 'page', '/dashboard/challenges', 'admin', NULL),
('super_admin', 'page', '/dashboard/ideas', 'admin', NULL),
('super_admin', 'page', '/dashboard/analytics', 'admin', NULL),
('super_admin', 'page', '/dashboard/system', 'admin', NULL),

-- Admin has admin access to most pages except access control
('admin', 'page', '/dashboard', 'admin', NULL),
('admin', 'page', '/dashboard/users', 'admin', NULL),
('admin', 'page', '/dashboard/roles', 'read', NULL),
('admin', 'page', '/dashboard/challenges', 'admin', NULL),
('admin', 'page', '/dashboard/ideas', 'admin', NULL),
('admin', 'page', '/dashboard/analytics', 'read', NULL),

-- Role manager specific access
('role_manager', 'page', '/dashboard', 'read', NULL),
('role_manager', 'page', '/dashboard/roles', 'admin', NULL),
('role_manager', 'page', '/dashboard/users', 'write', NULL),

-- User manager specific access
('user_manager', 'page', '/dashboard', 'read', NULL),
('user_manager', 'page', '/dashboard/users', 'admin', NULL),

-- Challenge manager access
('challenge_manager', 'page', '/dashboard', 'read', NULL),
('challenge_manager', 'page', '/dashboard/challenges', 'admin', NULL),
('challenge_manager', 'page', '/dashboard/ideas', 'write', NULL),

-- Content manager access
('content_manager', 'page', '/dashboard', 'read', NULL),
('content_manager', 'page', '/dashboard/challenges', 'write', NULL),
('content_manager', 'page', '/dashboard/ideas', 'write', NULL),

-- Data analyst access
('data_analyst', 'page', '/dashboard', 'read', NULL),
('data_analyst', 'page', '/dashboard/analytics', 'admin', NULL),

-- System auditor access
('system_auditor', 'page', '/dashboard', 'read', NULL),
('system_auditor', 'page', '/dashboard/users', 'read', NULL),
('system_auditor', 'page', '/dashboard/roles', 'read', NULL),
('system_auditor', 'page', '/dashboard/analytics', 'read', NULL),

-- Innovator basic access
('innovator', 'page', '/dashboard', 'read', NULL),
('innovator', 'page', '/dashboard/ideas', 'write', NULL),

-- Other roles get basic read access to dashboard
('evaluator', 'page', '/dashboard', 'read', NULL),
('domain_expert', 'page', '/dashboard', 'read', NULL),
('mentor', 'page', '/dashboard', 'read', NULL),
('judge', 'page', '/dashboard', 'read', NULL);