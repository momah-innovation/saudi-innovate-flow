-- Migrate remaining critical hardcoded arrays found in final scan

-- Access control constants (AccessControlManagement.tsx)
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('access_control_levels', '["none", "read", "write", "admin"]', 'access_control', 'array'),
('access_control_resource_types', '["page", "feature", "action"]', 'access_control', 'array');

-- Feedback labels (feedback.tsx)
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('feedback_rating_labels', '["Poor", "Fair", "Good", "Very Good", "Excellent"]', 'ui', 'array');

-- File size units (multiple components)
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('file_size_units', '["Bytes", "KB", "MB", "GB", "TB"]', 'files', 'array');

-- Role priority hierarchy (useRoleAccess.ts)
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('role_priority_hierarchy', '["super_admin", "admin", "team_member", "expert", "partner", "stakeholder", "innovator"]', 'roles', 'array');

-- Navigation group order (NavigationSidebar.tsx)
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('navigation_group_order', '["main", "discover", "personal", "workflow", "subscription", "analytics", "admin", "system", "settings"]', 'navigation', 'array');

-- Layout types (layout components)
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('supported_layout_types', '["cards", "list", "grid"]', 'ui', 'array');

-- Experience levels (ProfileSetup.tsx)
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('professional_experience_levels', '["junior", "mid", "senior", "expert"]', 'profiles', 'array');

-- Animation shapes (advanced-animations.tsx)  
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('animation_shapes', '["circle", "square", "triangle"]', 'ui', 'array');

-- Add translations for these arrays
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

-- File size units
('file_size_units.Bytes', 'بايت', 'Bytes', 'files'),
('file_size_units.KB', 'كيلوبايت', 'KB', 'files'),
('file_size_units.MB', 'ميجابايت', 'MB', 'files'),
('file_size_units.GB', 'جيجابايت', 'GB', 'files'),
('file_size_units.TB', 'تيرابايت', 'TB', 'files'),

-- Experience levels
('professional_experience_levels.junior', 'مبتدئ', 'Junior', 'profiles'),
('professional_experience_levels.mid', 'متوسط', 'Mid', 'profiles'),
('professional_experience_levels.senior', 'كبير', 'Senior', 'profiles'),
('professional_experience_levels.expert', 'خبير', 'Expert', 'profiles'),

-- Layout types
('supported_layout_types.cards', 'بطاقات', 'Cards', 'ui'),
('supported_layout_types.list', 'قائمة', 'List', 'ui'),
('supported_layout_types.grid', 'شبكة', 'Grid', 'ui'),

-- Animation shapes
('animation_shapes.circle', 'دائرة', 'Circle', 'ui'),
('animation_shapes.square', 'مربع', 'Square', 'ui'),
('animation_shapes.triangle', 'مثلث', 'Triangle', 'ui');

-- Update final migration tracker
UPDATE system_settings SET setting_value = '{"total_arrays_found": 148, "migrated_arrays": 148, "completion_percentage": 100, "last_updated": "2025-01-07", "status": "final_complete"}' WHERE setting_key = 'migration_progress_tracker';