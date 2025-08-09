-- Fix security warnings by ensuring all functions have proper search paths
CREATE OR REPLACE FUNCTION public.has_collaboration_permission(
  user_id UUID, 
  permission TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_permissions TEXT[];
BEGIN
  -- Get user permissions from role hierarchy
  SELECT ARRAY_AGG(DISTINCT perm)
  INTO user_permissions
  FROM public.user_roles ur
  JOIN public.role_hierarchy rh ON ur.role = rh.role
  CROSS JOIN UNNEST(rh.permissions) AS perm
  WHERE ur.user_id = has_collaboration_permission.user_id
    AND ur.is_active = true;
  
  -- Check if user has the requested permission
  RETURN permission = ANY(COALESCE(user_permissions, ARRAY[]::TEXT[]));
END;
$$;