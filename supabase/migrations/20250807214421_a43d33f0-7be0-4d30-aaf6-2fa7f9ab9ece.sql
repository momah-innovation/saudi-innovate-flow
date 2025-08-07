-- Fix security issues: Add missing search_path to functions
-- This addresses the Supabase linter warnings about function search_path mutability

-- 1. Fix has_role() function - CRITICAL SECURITY FIX
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = 'public'  -- 🔒 Security fix: prevents search path injection
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > NOW())
  )
$$;

-- 2. Fix update_updated_at_column() function - SECURITY FIX
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'  -- 🔒 Security fix: prevents search path injection
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 3. Fix generate_invitation_token() function - SECURITY FIX
CREATE OR REPLACE FUNCTION public.generate_invitation_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'  -- 🔒 Security fix: prevents search path injection
AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64');
END;
$$;

-- 4. IMPROVE: Create enhanced role checking function with better performance
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id UUID, _roles public.app_role[])
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = ANY(_roles)
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > NOW())
  )
$$;

-- 5. IMPROVE: Create role hierarchy checking function
CREATE OR REPLACE FUNCTION public.has_role_or_higher(_user_id UUID, _minimum_role public.app_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_roles public.app_role[];
  role_hierarchy public.app_role[] := ARRAY['super_admin', 'admin', 'team_member', 'expert', 'partner', 'stakeholder', 'innovator'];
  min_level INTEGER;
  user_level INTEGER;
  role public.app_role;
BEGIN
  -- Get user's active roles
  SELECT ARRAY_AGG(role) INTO user_roles
  FROM public.user_roles
  WHERE user_id = _user_id 
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > NOW());
  
  IF user_roles IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Find minimum required level
  FOR i IN 1..array_length(role_hierarchy, 1) LOOP
    IF role_hierarchy[i] = _minimum_role THEN
      min_level := i;
      EXIT;
    END IF;
  END LOOP;
  
  -- Check if user has role at or above minimum level
  FOREACH role IN ARRAY user_roles LOOP
    FOR i IN 1..array_length(role_hierarchy, 1) LOOP
      IF role_hierarchy[i] = role THEN
        user_level := i;
        IF user_level <= min_level THEN
          RETURN TRUE;
        END IF;
        EXIT;
      END IF;
    END LOOP;
  END LOOP;
  
  RETURN FALSE;
END;
$$;

-- 6. IMPROVE: Create efficient role permissions checker
CREATE OR REPLACE FUNCTION public.user_can_perform_action(_user_id UUID, _action TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  CASE _action
    WHEN 'manage_users' THEN
      RETURN public.has_any_role(_user_id, ARRAY['admin', 'super_admin']::public.app_role[]);
    WHEN 'manage_system' THEN
      RETURN public.has_role(_user_id, 'super_admin'::public.app_role);
    WHEN 'manage_challenges' THEN
      RETURN public.has_any_role(_user_id, ARRAY['admin', 'super_admin', 'team_member']::public.app_role[]);
    WHEN 'evaluate_ideas' THEN
      RETURN public.has_any_role(_user_id, ARRAY['expert', 'admin', 'super_admin']::public.app_role[]);
    WHEN 'manage_opportunities' THEN
      RETURN public.has_any_role(_user_id, ARRAY['partner', 'admin', 'super_admin']::public.app_role[]);
    WHEN 'view_analytics' THEN
      RETURN public.has_any_role(_user_id, ARRAY['admin', 'super_admin', 'team_member']::public.app_role[]);
    WHEN 'manage_partners' THEN
      RETURN public.has_any_role(_user_id, ARRAY['admin', 'super_admin']::public.app_role[]);
    ELSE
      RETURN FALSE;
  END CASE;
END;
$$;

-- 7. IMPROVE: Add function to get user's effective permissions
CREATE OR REPLACE FUNCTION public.get_user_permissions(_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  permissions JSONB := '{}';
BEGIN
  SELECT jsonb_build_object(
    'canManageUsers', public.user_can_perform_action(_user_id, 'manage_users'),
    'canManageSystem', public.user_can_perform_action(_user_id, 'manage_system'),
    'canManageChallenges', public.user_can_perform_action(_user_id, 'manage_challenges'),
    'canEvaluateIdeas', public.user_can_perform_action(_user_id, 'evaluate_ideas'),
    'canManageOpportunities', public.user_can_perform_action(_user_id, 'manage_opportunities'),
    'canViewAnalytics', public.user_can_perform_action(_user_id, 'view_analytics'),
    'canManagePartners', public.user_can_perform_action(_user_id, 'manage_partners'),
    'roles', COALESCE(
      (SELECT jsonb_agg(role) 
       FROM public.user_roles 
       WHERE user_id = _user_id 
         AND is_active = true 
         AND (expires_at IS NULL OR expires_at > NOW())), 
      '[]'::jsonb
    )
  ) INTO permissions;
  
  RETURN permissions;
END;
$$;

-- 8. SECURITY IMPROVEMENT: Update RLS policies to use new optimized functions
-- Example: Update a commonly used policy for better performance
DROP POLICY IF EXISTS "Team members can manage campaigns" ON public.campaigns;
CREATE POLICY "Team members can manage campaigns" 
ON public.campaigns 
FOR ALL
USING (
  public.has_any_role(auth.uid(), ARRAY['admin', 'super_admin', 'team_member']::public.app_role[])
);

-- 9. PERFORMANCE IMPROVEMENT: Add indexes for role checking
CREATE INDEX IF NOT EXISTS idx_user_roles_active_lookup 
ON public.user_roles (user_id, role, is_active) 
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_user_roles_expiry 
ON public.user_roles (user_id, expires_at) 
WHERE is_active = true AND expires_at IS NOT NULL;

-- 10. AUDIT: Log the security improvements
INSERT INTO public.security_audit_log (
  user_id, action_type, resource_type, details, risk_level
) VALUES (
  auth.uid(), 'SECURITY_ENHANCEMENT', 'database_functions',
  jsonb_build_object(
    'action', 'fixed_search_path_vulnerabilities',
    'functions_fixed', ARRAY['has_role', 'update_updated_at_column', 'generate_invitation_token'],
    'new_functions_added', ARRAY['has_any_role', 'has_role_or_higher', 'user_can_perform_action', 'get_user_permissions'],
    'performance_indexes_added', 2,
    'policies_optimized', 1
  ), 'high'
);

-- 11. Add comments for documentation
COMMENT ON FUNCTION public.has_role(UUID, public.app_role) IS 'Secure role checking function with search_path protection. Checks if user has specific active role.';
COMMENT ON FUNCTION public.has_any_role(UUID, public.app_role[]) IS 'Performance-optimized function to check if user has any of the specified roles.';
COMMENT ON FUNCTION public.has_role_or_higher(UUID, public.app_role) IS 'Hierarchical role checking - returns true if user has specified role or higher in hierarchy.';
COMMENT ON FUNCTION public.user_can_perform_action(UUID, TEXT) IS 'Action-based permission checking for common operations.';
COMMENT ON FUNCTION public.get_user_permissions(UUID) IS 'Returns comprehensive permissions object for a user.';