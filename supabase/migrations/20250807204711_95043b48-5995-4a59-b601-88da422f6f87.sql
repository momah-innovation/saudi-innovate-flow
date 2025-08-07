-- Fix JSON casting issue for remaining arrays

-- Access control levels
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('access_control_levels', '["none", "read", "write", "admin"]'::jsonb, 'access_control', 'array')
ON CONFLICT (setting_key) DO NOTHING;

-- Access control resource types  
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('access_control_resource_types', '["page", "feature", "action"]'::jsonb, 'access_control', 'array')
ON CONFLICT (setting_key) DO NOTHING;

-- Feedback rating labels
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('feedback_rating_labels', '["Poor", "Fair", "Good", "Very Good", "Excellent"]'::jsonb, 'ui', 'array')
ON CONFLICT (setting_key) DO NOTHING;

-- Role priority hierarchy
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('role_priority_hierarchy', '["super_admin", "admin", "team_member", "expert", "partner", "stakeholder", "innovator"]'::jsonb, 'roles', 'array')
ON CONFLICT (setting_key) DO NOTHING;

-- Supported layout types
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('supported_layout_types', '["cards", "list", "grid"]'::jsonb, 'ui', 'array')
ON CONFLICT (setting_key) DO NOTHING;

-- Professional experience levels
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('professional_experience_levels', '["junior", "mid", "senior", "expert"]'::jsonb, 'profiles', 'array')
ON CONFLICT (setting_key) DO NOTHING;

-- Add corresponding translations
INSERT INTO system_translations (translation_key, text_ar, text_en, category) VALUES
-- Access levels
('access_control_levels.none', 'لا يوجد', 'None', 'access'),
('access_control_levels.read', 'قراءة', 'Read', 'access'),
('access_control_levels.write', 'كتابة', 'Write', 'access'),
('access_control_levels.admin', 'إدارة', 'Admin', 'access'),

-- Resource types
('access_control_resource_types.page', 'صفحة', 'Page', 'access'),
('access_control_resource_types.feature', 'ميزة', 'Feature', 'access'),
('access_control_resource_types.action', 'إجراء', 'Action', 'access'),

-- Feedback labels
('feedback_rating_labels.Poor', 'ضعيف', 'Poor', 'feedback'),
('feedback_rating_labels.Fair', 'مقبول', 'Fair', 'feedback'),
('feedback_rating_labels.Good', 'جيد', 'Good', 'feedback'),
('feedback_rating_labels.Very Good', 'جيد جداً', 'Very Good', 'feedback'),
('feedback_rating_labels.Excellent', 'ممتاز', 'Excellent', 'feedback'),

-- Experience levels
('professional_experience_levels.junior', 'مبتدئ', 'Junior', 'profiles'),
('professional_experience_levels.mid', 'متوسط', 'Mid', 'profiles'),
('professional_experience_levels.senior', 'كبير', 'Senior', 'profiles'),
('professional_experience_levels.expert', 'خبير', 'Expert', 'profiles'),

-- Layout types
('supported_layout_types.cards', 'بطاقات', 'Cards', 'ui'),
('supported_layout_types.list', 'قائمة', 'List', 'ui'),
('supported_layout_types.grid', 'شبكة', 'Grid', 'ui')
ON CONFLICT (translation_key) DO NOTHING;