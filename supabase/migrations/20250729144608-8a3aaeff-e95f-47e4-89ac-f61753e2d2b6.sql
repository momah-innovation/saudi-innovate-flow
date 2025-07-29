-- Add remaining system lists without the setting_type column
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('theme_variants', '["modern", "minimal", "vibrant"]', 'Available theme variants for the UI'),
('theme_color_schemes', '["light", "dark", "auto"]', 'Available color scheme options'),
('theme_border_radius_options', '["none", "sm", "md", "lg", "xl"]', 'Border radius options for theme customization'),
('challenge_filter_status_options', '["all", "draft", "published", "active", "closed", "archived"]', 'Status filter options for challenge management'),
('navigation_menu_visibility_roles', '["admin", "super_admin", "team_member", "evaluator", "domain_expert"]', 'Roles that determine navigation menu visibility'),
('data_export_formats', '["csv", "excel", "pdf", "json"]', 'Available data export formats'),
('chart_visualization_colors', '["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#84cc16"]', 'Color palette for charts and data visualizations')
ON CONFLICT (setting_key) DO NOTHING;