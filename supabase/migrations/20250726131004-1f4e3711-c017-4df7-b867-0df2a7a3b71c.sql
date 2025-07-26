-- Add performance rating step setting
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description) VALUES
('team_performance_rating_step', '0.1', 'team', 'Step increment for performance rating inputs')
ON CONFLICT (setting_key) DO NOTHING;