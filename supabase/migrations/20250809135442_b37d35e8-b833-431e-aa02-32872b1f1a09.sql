-- First, add the permissions column to role_hierarchy table
ALTER TABLE public.role_hierarchy 
ADD COLUMN IF NOT EXISTS permissions TEXT[] DEFAULT '{}';

-- Add collaboration permissions to existing roles
UPDATE role_hierarchy 
SET permissions = permissions || ARRAY['collaboration.moderate', 'collaboration.manage_spaces', 'collaboration.view_all', 'collaboration.admin_controls']
WHERE role = 'admin';

UPDATE role_hierarchy 
SET permissions = permissions || ARRAY['collaboration.moderate', 'collaboration.manage_spaces', 'collaboration.view_all', 'collaboration.admin_controls']
WHERE role = 'super_admin';

UPDATE role_hierarchy 
SET permissions = permissions || ARRAY['collaboration.participate', 'collaboration.create_spaces', 'collaboration.invite_users', 'collaboration.view_team']
WHERE role = 'team_lead';

UPDATE role_hierarchy 
SET permissions = permissions || ARRAY['collaboration.participate', 'collaboration.create_spaces', 'collaboration.invite_users', 'collaboration.view_team']
WHERE role = 'project_manager';

UPDATE role_hierarchy 
SET permissions = permissions || ARRAY['collaboration.participate', 'collaboration.view_public']
WHERE role = 'innovator';

UPDATE role_hierarchy 
SET permissions = permissions || ARRAY['collaboration.participate', 'collaboration.view_public']
WHERE role = 'viewer';

UPDATE role_hierarchy 
SET permissions = permissions || ARRAY['collaboration.participate', 'collaboration.view_public']
WHERE role = 'evaluator';

-- Create collaboration permission checking function
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
  RETURN permission = ANY(COALESCE(user_permissions, ARRAY[]::TEXT[]));
END;
$$;