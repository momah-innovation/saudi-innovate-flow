-- Add new system settings for hardcoded values across the application

-- Challenge management settings
INSERT INTO public.system_settings (setting_key, setting_value, description, setting_category, updated_by) VALUES
('challenge_max_budget', '1000000', 'Maximum allowed budget for challenges', 'challenge_management', NULL),
('challenge_textarea_rows', '4', 'Default number of rows for challenge description text areas', 'ui_defaults', NULL),
('challenge_notes_rows', '2', 'Default number of rows for challenge notes text areas', 'ui_defaults', NULL),
('challenge_max_submissions_per_challenge', '20', 'Maximum submissions allowed per challenge', 'challenge_management', NULL);

-- Expert management settings  
INSERT INTO public.system_settings (setting_key, setting_value, description, setting_category, updated_by) VALUES
('expert_workload_warning_threshold', '60', 'Percentage threshold for showing expert workload warnings', 'expert_management', NULL),
('expert_profile_textarea_rows', '3', 'Default number of rows for expert profile text areas', 'ui_defaults', NULL);

-- Role request settings
INSERT INTO public.system_settings (setting_key, setting_value, description, setting_category, updated_by) VALUES
('role_justification_max_preview_length', '50', 'Maximum characters to show in role justification previews', 'role_management', NULL);

-- UI and form defaults
INSERT INTO public.system_settings (setting_key, setting_value, description, setting_category, updated_by) VALUES
('ui_default_textarea_rows', '4', 'Default number of rows for text areas across the application', 'ui_defaults', NULL),
('ui_description_max_preview_length', '100', 'Maximum characters to show in description previews', 'ui_defaults', NULL),
('ui_table_page_size', '10', 'Default number of items per page in tables', 'ui_defaults', NULL),
('ui_animation_duration_ms', '200', 'Default animation duration in milliseconds', 'ui_defaults', NULL),
('form_min_budget', '1000', 'Minimum budget allowed for challenges and projects', 'form_validation', NULL),
('form_max_idea_title_length', '200', 'Maximum length for idea titles', 'form_validation', NULL),
('form_max_description_length', '5000', 'Maximum length for descriptions', 'form_validation', NULL);