-- Add final missing hardcoded arrays to database

-- File size utilities used across multiple components
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('file_size_display_units', '["Bytes", "KB", "MB", "GB", "TB"]'::jsonb, 'files', 'array')
ON CONFLICT (setting_key) DO NOTHING;

-- Event visible tabs configuration
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('event_dialog_tabs', '["details", "registration", "feedback", "attendees"]'::jsonb, 'events', 'array')
ON CONFLICT (setting_key) DO NOTHING;

-- Price and capacity range mappings
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('event_price_range_values', '["free", "1-500", "501-1000", "1001+"]'::jsonb, 'events', 'array'),
('event_capacity_range_values', '["1-25", "26-50", "51-100", "101+"]'::jsonb, 'events', 'array')
ON CONFLICT (setting_key) DO NOTHING;

-- Test component names (for testing purposes)
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('test_component_names', '["Component1", "Component2", "Component3"]'::jsonb, 'testing', 'array')
ON CONFLICT (setting_key) DO NOTHING;

-- Add translations for new settings
INSERT INTO system_translations (translation_key, text_ar, text_en, category) VALUES
('file_size_display_units.Bytes', 'بايت', 'Bytes', 'files'),
('file_size_display_units.KB', 'كيلوبايت', 'KB', 'files'),
('file_size_display_units.MB', 'ميجابايت', 'MB', 'files'),
('file_size_display_units.GB', 'جيجابايت', 'GB', 'files'),
('file_size_display_units.TB', 'تيرابايت', 'TB', 'files'),

('event_dialog_tabs.details', 'التفاصيل', 'Details', 'events'),
('event_dialog_tabs.registration', 'التسجيل', 'Registration', 'events'),
('event_dialog_tabs.feedback', 'التقييم', 'Feedback', 'events'),
('event_dialog_tabs.attendees', 'الحضور', 'Attendees', 'events'),

('event_price_range_values.free', 'مجاني', 'Free', 'events'),
('event_price_range_values.1-500', '١ - ٥٠٠ ريال', '1-500 SAR', 'events'),
('event_price_range_values.501-1000', '٥٠١ - ١٠٠٠ ريال', '501-1000 SAR', 'events'),
('event_price_range_values.1001+', 'أكثر من ١٠٠٠ ريال', '1001+ SAR', 'events'),

('event_capacity_range_values.1-25', '١ - ٢٥ شخص', '1-25 People', 'events'),
('event_capacity_range_values.26-50', '٢٦ - ٥٠ شخص', '26-50 People', 'events'),
('event_capacity_range_values.51-100', '٥١ - ١٠٠ شخص', '51-100 People', 'events'),
('event_capacity_range_values.101+', 'أكثر من ١٠٠ شخص', '101+ People', 'events')
ON CONFLICT (translation_key) DO NOTHING;