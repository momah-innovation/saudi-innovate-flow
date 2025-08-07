-- Add only the missing settings that don't already exist

INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) 
SELECT * FROM (VALUES 
  ('access_control_levels', '["none", "read", "write", "admin"]', 'access_control', 'array'),
  ('access_control_resource_types', '["page", "feature", "action"]', 'access_control', 'array'),
  ('feedback_rating_labels', '["Poor", "Fair", "Good", "Very Good", "Excellent"]', 'ui', 'array'),
  ('role_priority_hierarchy', '["super_admin", "admin", "team_member", "expert", "partner", "stakeholder", "innovator"]', 'roles', 'array'),
  ('navigation_group_order', '["main", "discover", "personal", "workflow", "subscription", "analytics", "admin", "system", "settings"]', 'navigation', 'array'),
  ('supported_layout_types', '["cards", "list", "grid"]', 'ui', 'array'),
  ('professional_experience_levels', '["junior", "mid", "senior", "expert"]', 'profiles', 'array'),
  ('animation_shapes', '["circle", "square", "triangle"]', 'ui', 'array')
) AS t(setting_key, setting_value, setting_category, data_type)
WHERE NOT EXISTS (
  SELECT 1 FROM system_settings WHERE setting_key = t.setting_key
);

-- Add translations only for new settings
INSERT INTO system_translations (translation_key, text_ar, text_en, category) 
SELECT * FROM (VALUES
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
  ('supported_layout_types.grid', 'شبكة', 'Grid', 'ui'),

  -- Animation shapes
  ('animation_shapes.circle', 'دائرة', 'Circle', 'ui'),
  ('animation_shapes.square', 'مربع', 'Square', 'ui'),
  ('animation_shapes.triangle', 'مثلث', 'Triangle', 'ui')
) AS t(translation_key, text_ar, text_en, category)
WHERE NOT EXISTS (
  SELECT 1 FROM system_translations WHERE translation_key = t.translation_key
);