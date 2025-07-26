-- Add additional system settings for comprehensive configuration management

-- Team Management Additional Settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description) VALUES
('team_performance_rating_min', '0', 'team_management', 'Minimum performance rating value for team members'),
('team_performance_rating_max', '5', 'team_management', 'Maximum performance rating value for team members'),
('team_capacity_warning_threshold', '90', 'team_management', 'Capacity warning threshold percentage for team workload');

-- Challenge Management Additional Settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description) VALUES
('challenge_digital_maturity_score_min', '0', 'challenge_management', 'Minimum digital maturity score for challenges'),
('challenge_digital_maturity_score_max', '10', 'challenge_management', 'Maximum digital maturity score for challenges');

-- User Profile Settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description) VALUES
('user_min_experience_years', '0', 'user_profile', 'Minimum experience years allowed in user profiles'),
('user_max_experience_years', '50', 'user_profile', 'Maximum experience years allowed in user profiles'),
('auth_password_min_length', '6', 'authentication', 'Minimum password length for user authentication');

-- Notification Additional Settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description) VALUES
('notification_toast_limit', '1', 'notifications', 'Maximum number of toast notifications shown at once');

-- UI Additional Settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description) VALUES
('ui_navigation_delay_ms', '100', 'ui_settings', 'Delay in milliseconds before navigation transitions'),
('ui_css_transition_duration_ms', '300', 'ui_settings', 'Default CSS transition duration in milliseconds'),
('ui_avatar_size_px', '20', 'ui_settings', 'Default avatar size in pixels');

-- API Settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description) VALUES
('api_rate_limit_per_hour', '1000', 'api_settings', 'Maximum API requests per hour per user');