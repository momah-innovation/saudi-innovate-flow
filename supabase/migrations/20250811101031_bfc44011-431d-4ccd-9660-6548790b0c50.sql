-- Add missing translation keys found in console logs
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- Settings file size units
('settings.file_size_units_extended.description', 'Advanced file size units for technical users', 'وحدات حجم الملف المتقدمة للمستخدمين التقنيين', 'settings'),
('settings.file_size_units_standard.label', 'Standard File Size Units', 'وحدات حجم الملف القياسية', 'settings'),
('settings.file_size_units_standard.description', 'Standard file size units for general users', 'وحدات حجم الملف القياسية للمستخدمين العامين', 'settings'),
('settings.question_type_options.label', 'Question Type Options', 'خيارات أنواع الأسئلة', 'settings'),
('settings.question_type_options.description', 'Available question types for forms and evaluations', 'أنواع الأسئلة المتاحة للنماذج والتقييمات', 'settings'),

-- Settings categories that might be missing
('settings.file_size_units_extended.label', 'Extended File Size Units', 'وحدات حجم الملف الموسعة', 'settings'),
('settings.category.file_management', 'File Management', 'إدارة الملفات', 'settings'),
('settings.category.question_management', 'Question Management', 'إدارة الأسئلة', 'settings'),
('settings.category.system_configuration', 'System Configuration', 'تكوين النظام', 'settings'),

-- Common settings labels
('settings.enabled', 'Enabled', 'مفعل', 'settings'),
('settings.disabled', 'Disabled', 'معطل', 'settings'),
('settings.default_value', 'Default Value', 'القيمة الافتراضية', 'settings'),
('settings.options', 'Options', 'الخيارات', 'settings'),
('settings.configuration', 'Configuration', 'التكوين', 'settings')

ON CONFLICT (translation_key) DO UPDATE SET 
text_en = EXCLUDED.text_en,
text_ar = EXCLUDED.text_ar,
category = EXCLUDED.category,
updated_at = now();