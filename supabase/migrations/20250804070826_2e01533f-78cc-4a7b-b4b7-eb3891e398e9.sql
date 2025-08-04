-- Insert the new roles into role_hierarchy
INSERT INTO public.role_hierarchy (role, hierarchy_level, can_assign_roles, requires_approval_for) VALUES
('team_lead', 3, ARRAY['innovator', 'viewer']::app_role[], ARRAY[]::app_role[]),
('project_manager', 3, ARRAY['team_lead', 'innovator', 'viewer']::app_role[], ARRAY[]::app_role[]),
('research_lead', 3, ARRAY['domain_expert', 'evaluator', 'innovator', 'viewer']::app_role[], ARRAY[]::app_role[]),
('innovation_manager', 2, ARRAY['project_manager', 'team_lead', 'research_lead', 'domain_expert', 'evaluator', 'innovator', 'viewer']::app_role[], ARRAY[]::app_role[]),
('external_expert', 4, ARRAY[]::app_role[], ARRAY[]::app_role[]),
('mentor', 4, ARRAY[]::app_role[], ARRAY[]::app_role[]),
('judge', 4, ARRAY[]::app_role[], ARRAY[]::app_role[]),
('facilitator', 4, ARRAY['innovator', 'viewer']::app_role[], ARRAY[]::app_role[])
ON CONFLICT (role) DO NOTHING;

-- Update existing role hierarchy to include new roles in assignment capabilities
UPDATE public.role_hierarchy 
SET can_assign_roles = can_assign_roles || ARRAY['team_lead', 'project_manager', 'research_lead', 'innovation_manager', 'external_expert', 'mentor', 'judge', 'facilitator']::app_role[]
WHERE role IN ('super_admin');

UPDATE public.role_hierarchy 
SET can_assign_roles = can_assign_roles || ARRAY['team_lead', 'project_manager', 'research_lead', 'innovation_manager', 'external_expert', 'mentor', 'judge', 'facilitator']::app_role[]
WHERE role IN ('admin');