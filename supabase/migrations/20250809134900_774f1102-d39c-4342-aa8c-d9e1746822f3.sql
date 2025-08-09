-- Add collaboration permissions to role hierarchy
INSERT INTO role_hierarchy (role, can_assign_roles, permissions) VALUES
('admin', ARRAY['team_member', 'expert', 'innovator']::app_role[], 
 ARRAY['collaboration.moderate', 'collaboration.manage_spaces', 'collaboration.view_all', 'collaboration.admin_controls']::text[])
ON CONFLICT (role) DO UPDATE SET 
  permissions = EXCLUDED.permissions || role_hierarchy.permissions;

INSERT INTO role_hierarchy (role, can_assign_roles, permissions) VALUES
('team_member', ARRAY['innovator']::app_role[], 
 ARRAY['collaboration.participate', 'collaboration.create_spaces', 'collaboration.invite_users', 'collaboration.view_team']::text[])
ON CONFLICT (role) DO UPDATE SET 
  permissions = EXCLUDED.permissions || role_hierarchy.permissions;

INSERT INTO role_hierarchy (role, can_assign_roles, permissions) VALUES
('innovator', ARRAY[]::app_role[], 
 ARRAY['collaboration.participate', 'collaboration.view_public']::text[])
ON CONFLICT (role) DO UPDATE SET 
  permissions = EXCLUDED.permissions || role_hierarchy.permissions;

-- Create collaboration admin controls function
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
  FROM user_roles ur
  JOIN role_hierarchy rh ON ur.role = rh.role
  CROSS JOIN UNNEST(rh.permissions) AS perm
  WHERE ur.user_id = has_collaboration_permission.user_id
    AND ur.is_active = true;
  
  -- Check if user has the requested permission
  RETURN permission = ANY(user_permissions);
END;
$$;