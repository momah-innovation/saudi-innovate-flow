-- Insert team_member role into role_hierarchy with correct hierarchy_level enum
INSERT INTO public.role_hierarchy (
  role, 
  hierarchy_level, 
  can_assign_roles, 
  requires_approval_for,
  permissions
) VALUES (
  'team_member',
  '2'::role_hierarchy_level, -- Use enum value
  ARRAY['innovator', 'viewer']::app_role[],
  ARRAY[]::app_role[],
  ARRAY['collaboration.participate', 'collaboration.create_spaces', 'collaboration.invite_users', 'collaboration.view_team']::text[]
)
ON CONFLICT (role) DO UPDATE SET
  permissions = EXCLUDED.permissions,
  can_assign_roles = EXCLUDED.can_assign_roles;