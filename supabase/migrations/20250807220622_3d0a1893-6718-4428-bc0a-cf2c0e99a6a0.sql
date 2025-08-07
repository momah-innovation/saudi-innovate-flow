-- Add missing translation keys for Challenge settings

INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- Challenge form types
('settings.challenge_form_types.label', 'Challenge Form Types', 'أنواع نماذج التحديات', 'settings'),
('settings.challenge_form_types.description', 'Available form types for challenge submissions', 'أنواع النماذج المتاحة لإرسال التحديات', 'settings'),

-- Enhanced priority levels
('settings.enhanced_priority_levels.label', 'Enhanced Priority Levels', 'مستويات الأولوية المحسنة', 'settings'),
('settings.enhanced_priority_levels.description', 'Enhanced priority levels for better challenge categorization', 'مستويات الأولوية المحسنة لتصنيف أفضل للتحديات', 'settings'),

-- Enhanced sensitivity levels
('settings.enhanced_sensitivity_levels.label', 'Enhanced Sensitivity Levels', 'مستويات الحساسية المحسنة', 'settings'),
('settings.enhanced_sensitivity_levels.description', 'Enhanced sensitivity levels for challenge classification', 'مستويات الحساسية المحسنة لتصنيف التحديات', 'settings'),

-- Enhanced status options
('settings.enhanced_status_options.label', 'Enhanced Status Options', 'خيارات الحالة المحسنة', 'settings'),
('settings.enhanced_status_options.description', 'Enhanced status options for challenge workflow management', 'خيارات الحالة المحسنة لإدارة سير عمل التحديات', 'settings')

ON CONFLICT (translation_key) DO UPDATE SET
    text_en = EXCLUDED.text_en,
    text_ar = EXCLUDED.text_ar,
    updated_at = NOW();