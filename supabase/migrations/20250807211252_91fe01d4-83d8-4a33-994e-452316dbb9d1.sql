-- Add remaining hardcoded arrays to database
-- Color palettes for analytics components
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('analytics_chart_colors', '["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1"]'::jsonb, 'analytics', 'array'),
('primary_chart_colors', '["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"]'::jsonb, 'analytics', 'array'),
('engagement_colors', '["#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#8B5CF6"]'::jsonb, 'analytics', 'array'),
('statistics_theme_colors', '["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--muted))"]'::jsonb, 'analytics', 'array')
ON CONFLICT (setting_key) DO NOTHING;

-- Navigation and UI structure
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('navigation_group_order', '["main", "discover", "personal", "workflow", "subscription", "analytics", "admin", "system", "settings"]'::jsonb, 'ui', 'array'),
('event_dialog_visible_tabs', '["details", "registration", "feedback"]'::jsonb, 'events', 'array'),
('rtl_languages', '["ar"]'::jsonb, 'i18n', 'array'),
('role_priority_order', '["super_admin", "admin", "team_member", "expert", "partner", "stakeholder", "innovator"]'::jsonb, 'auth', 'array')
ON CONFLICT (setting_key) DO NOTHING;

-- File size utilities in all uploader components  
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('file_size_units_standard', '["Bytes", "KB", "MB", "GB"]'::jsonb, 'files', 'array'),
('file_size_units_extended', '["Bytes", "KB", "MB", "GB", "TB"]'::jsonb, 'files', 'array')
ON CONFLICT (setting_key) DO NOTHING;

-- Test and development arrays
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('test_component_list', '["Component1", "Component2", "Component3"]'::jsonb, 'testing', 'array'),
('supported_price_ranges', '["free", "1-500", "501-1000", "1001+"]'::jsonb, 'events', 'array'),
('supported_capacity_ranges', '["1-25", "26-50", "51-100", "101+"]'::jsonb, 'events', 'array')
ON CONFLICT (setting_key) DO NOTHING;

-- Add translations for the remaining arrays
INSERT INTO system_translations (translation_key, text_ar, text_en, category) VALUES
('analytics_chart_colors.0', 'اللون الأساسي', 'Primary Color', 'analytics'),
('analytics_chart_colors.1', 'اللون الثانوي', 'Secondary Color', 'analytics'),
('analytics_chart_colors.2', 'لون التمييز', 'Accent Color', 'analytics'),
('analytics_chart_colors.3', 'لون التنبيه', 'Warning Color', 'analytics'),
('analytics_chart_colors.4', 'لون المعلومات', 'Info Color', 'analytics'),

('navigation_group_order.main', 'الرئيسية', 'Main', 'ui'),
('navigation_group_order.discover', 'استكشاف', 'Discover', 'ui'),
('navigation_group_order.personal', 'شخصي', 'Personal', 'ui'),
('navigation_group_order.workflow', 'سير العمل', 'Workflow', 'ui'),
('navigation_group_order.subscription', 'الاشتراك', 'Subscription', 'ui'),
('navigation_group_order.analytics', 'التحليلات', 'Analytics', 'ui'),
('navigation_group_order.admin', 'الإدارة', 'Admin', 'ui'),
('navigation_group_order.system', 'النظام', 'System', 'ui'),
('navigation_group_order.settings', 'الإعدادات', 'Settings', 'ui'),

('role_priority_order.super_admin', 'مدير عام', 'Super Admin', 'auth'),
('role_priority_order.admin', 'مدير', 'Admin', 'auth'),
('role_priority_order.team_member', 'عضو فريق', 'Team Member', 'auth'),
('role_priority_order.expert', 'خبير', 'Expert', 'auth'),
('role_priority_order.partner', 'شريك', 'Partner', 'auth'),
('role_priority_order.stakeholder', 'صاحب مصلحة', 'Stakeholder', 'auth'),
('role_priority_order.innovator', 'مبتكر', 'Innovator', 'auth'),

('file_size_units_standard.Bytes', 'بايت', 'Bytes', 'files'),
('file_size_units_standard.KB', 'كيلوبايت', 'KB', 'files'),
('file_size_units_standard.MB', 'ميجابايت', 'MB', 'files'),
('file_size_units_standard.GB', 'جيجابايت', 'GB', 'files'),
('file_size_units_extended.TB', 'تيرابايت', 'TB', 'files')
ON CONFLICT (translation_key) DO NOTHING;