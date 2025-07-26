-- Add missing system settings for UI components
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description) VALUES
-- Challenge Details Settings
('challenge_details_description_rows', '4', 'ui', 'Number of rows for challenge description textarea in details view'),
('challenge_details_vision_rows', '3', 'ui', 'Number of rows for vision 2030 goal textarea in details view'),

-- Expert Expertise Display Settings  
('expert_expertise_preview_limit', '2', 'ui', 'Number of expertise areas to show in expert previews'),

-- User Initials Settings
('ui_initials_max_length', '2', 'ui', 'Maximum number of characters for user initials display'),

-- Additional Team Management Settings
('team_member_min_workload', '0', 'team', 'Minimum workload value for team members'),
('team_member_max_workload', '10', 'team', 'Maximum workload value for team members')

ON CONFLICT (setting_key) DO NOTHING;