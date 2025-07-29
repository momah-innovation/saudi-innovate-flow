-- Add remaining hardcoded lists to system_settings table

-- Frequency options
INSERT INTO system_settings (setting_key, setting_value, setting_category, description) VALUES
('frequency_options', '["hourly", "daily", "weekly", "monthly", "yearly"]', 'system', 'Available frequency options for various settings')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description;

INSERT INTO system_settings (setting_key, setting_value, setting_category, description) VALUES
('backup_frequency_options', '["hourly", "daily", "weekly", "monthly"]', 'integration', 'Backup frequency options')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description;

INSERT INTO system_settings (setting_key, setting_value, setting_category, description) VALUES
('report_frequency_options', '["daily", "weekly", "monthly"]', 'analytics', 'Report frequency options')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description;

INSERT INTO system_settings (setting_key, setting_value, setting_category, description) VALUES
('reminder_frequency_options', '["daily", "weekly", "monthly"]', 'notification', 'Reminder frequency options')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description;

INSERT INTO system_settings (setting_key, setting_value, setting_category, description) VALUES
('recurrence_pattern_options', '["daily", "weekly", "monthly", "yearly"]', 'event', 'Event recurrence pattern options')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description;

-- Question type options for focus questions  
INSERT INTO system_settings (setting_key, setting_value, setting_category, description) VALUES
('question_type_options', '["open_ended", "multiple_choice", "yes_no", "rating", "ranking"]', 'focus_question', 'Question type options for focus questions')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description;

-- Time range options for analytics
INSERT INTO system_settings (setting_key, setting_value, setting_category, description) VALUES
('time_range_options', '["all", "last_30", "last_90", "last_year"]', 'analytics', 'Time range options for analytics and reports')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description;

-- Role request justification options
INSERT INTO system_settings (setting_key, setting_value, setting_category, description) VALUES
('role_request_justifications', '["domain_expertise", "evaluation_experience", "academic_background", "industry_experience", "certification", "volunteer_contribution"]', 'user', 'Justification options for role requests')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description;

-- Language options (limited for UI)
INSERT INTO system_settings (setting_key, setting_value, setting_category, description) VALUES
('ui_language_options', '["en", "ar"]', 'general', 'Available UI language options')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description;

-- Stakeholder categories and levels
INSERT INTO system_settings (setting_key, setting_value, setting_category, description) VALUES
('stakeholder_categories', '["government", "private_sector", "academic", "civil_society", "international", "media", "experts"]', 'stakeholder', 'Stakeholder category options')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description;

INSERT INTO system_settings (setting_key, setting_value, setting_category, description) VALUES
('engagement_levels', '["high", "medium", "low"]', 'general', 'Engagement level options for stakeholders and partnerships')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description;

-- Chart and visualization colors
INSERT INTO system_settings (setting_key, setting_value, setting_category, description) VALUES
('chart_color_palette', '["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1", "#ff7c7c", "#8dd9cc"]', 'analytics', 'Color palette for charts and visualizations')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description;