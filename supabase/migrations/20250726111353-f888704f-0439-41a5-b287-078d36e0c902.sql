-- Insert new system settings with default values
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description) VALUES
('team_max_expert_workload', '5', 'team_management', 'Maximum concurrent challenges an expert can handle'),
('role_rejection_wait_days', '30', 'role_management', 'Days to wait after rejection before re-requesting same role'),
('role_max_requests_per_week', '3', 'role_management', 'Maximum role requests a user can make per week'),
('notification_fetch_limit', '50', 'notifications', 'Maximum notifications to fetch per request'),
('notification_toast_timeout_ms', '1000000', 'notifications', 'How long toast notifications stay visible (milliseconds)'),
('ui_sidebar_cookie_max_age_days', '7', 'ui', 'How long to remember sidebar state (days)')
ON CONFLICT (setting_key) DO NOTHING;