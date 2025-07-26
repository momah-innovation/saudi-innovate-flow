-- Add more system settings for hardcoded values found in pages and components

-- Profile Management Settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description) VALUES 
('profile_bio_textarea_rows', '3'::jsonb, 'User Profile', 'Number of rows for bio textarea field'),
('profile_innovation_background_rows', '2'::jsonb, 'User Profile', 'Number of rows for innovation background textarea'),
('profile_max_experience_years', '50'::jsonb, 'User Profile', 'Maximum years of experience allowed'),
('profile_min_experience_years', '0'::jsonb, 'User Profile', 'Minimum years of experience allowed');

-- Team Management Settings  
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description) VALUES 
('team_max_concurrent_projects_per_member', '5'::jsonb, 'Team Management', 'Maximum concurrent projects per team member'),
('team_max_performance_rating', '5'::jsonb, 'Team Management', 'Maximum performance rating scale'),
('team_min_performance_rating', '0'::jsonb, 'Team Management', 'Minimum performance rating scale'),
('team_insights_display_limit', '10'::jsonb, 'Team Management', 'Number of insights to display in team dashboard'),
('team_insight_title_preview_length', '50'::jsonb, 'Team Management', 'Character limit for insight title preview');

-- Challenge Details Settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description) VALUES 
('challenge_details_description_rows', '4'::jsonb, 'Challenge Management', 'Number of rows for challenge description edit'),
('challenge_details_vision_rows', '3'::jsonb, 'Challenge Management', 'Number of rows for vision 2030 goal edit');

-- Focus Questions Settings  
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description) VALUES 
('focus_question_textarea_rows', '3'::jsonb, 'Challenge Management', 'Number of rows for focus question textarea');

-- Expert Assignment Settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description) VALUES 
('expert_assignment_notes_rows', '3'::jsonb, 'Expert Management', 'Number of rows for expert assignment notes'),
('expert_assignment_bulk_notes_rows', '2'::jsonb, 'Expert Management', 'Number of rows for bulk assignment notes'),
('expert_expertise_preview_limit', '2'::jsonb, 'Expert Management', 'Number of expertise areas to show in preview');

-- UI Display Settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description) VALUES 
('ui_initials_max_length', '2'::jsonb, 'UI & Form', 'Maximum characters for user initials display');