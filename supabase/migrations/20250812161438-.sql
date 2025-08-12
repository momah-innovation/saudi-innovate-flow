-- Add missing organizational hierarchy roles
INSERT INTO public.role_hierarchy (role, hierarchy_level, can_assign_roles, requires_approval_for) VALUES
('entity_manager', '3'::role_hierarchy_level, ARRAY['department_head', 'innovator', 'viewer']::app_role[], ARRAY[]::app_role[]),
('deputy_manager', '3'::role_hierarchy_level, ARRAY['department_head', 'innovator', 'viewer']::app_role[], ARRAY[]::app_role[]),
('domain_manager', '4'::role_hierarchy_level, ARRAY['innovator', 'viewer']::app_role[], ARRAY[]::app_role[]),
('sub_domain_manager', '4'::role_hierarchy_level, ARRAY['innovator', 'viewer']::app_role[], ARRAY[]::app_role[]),
('service_manager', '5'::role_hierarchy_level, ARRAY['innovator', 'viewer']::app_role[], ARRAY[]::app_role[])
ON CONFLICT (role) DO NOTHING;

-- Update organization_admin role to have better permissions
UPDATE public.role_hierarchy 
SET can_assign_roles = ARRAY['entity_manager', 'deputy_manager', 'department_head', 'domain_manager', 'organization_member', 'innovator', 'viewer']::app_role[]
WHERE role = 'organization_admin';