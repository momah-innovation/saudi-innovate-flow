-- Simpler migration to add i18n support to system settings

-- Add necessary columns for i18n support
ALTER TABLE public.system_settings 
ADD COLUMN IF NOT EXISTS data_type VARCHAR(50) DEFAULT 'string',
ADD COLUMN IF NOT EXISTS is_localizable BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- Update metadata for existing settings
UPDATE public.system_settings SET
    data_type = CASE 
        WHEN setting_key LIKE '%_options' OR setting_key LIKE '%_levels' OR setting_key LIKE '%_types' OR setting_key LIKE '%color%' THEN 'array'
        WHEN setting_key LIKE '%_enabled' OR setting_key LIKE '%_require%' OR setting_key LIKE '%_allow%' OR setting_key LIKE '%_auto%' THEN 'boolean'
        WHEN setting_key LIKE '%_max%' OR setting_key LIKE '%_min%' OR setting_key LIKE '%_limit%' OR setting_key LIKE '%_days%' OR setting_key LIKE '%_hours%' OR setting_key LIKE '%_timeout%' THEN 'number'
        ELSE 'string'
    END,
    is_localizable = CASE 
        WHEN setting_key LIKE '%_options' OR setting_key LIKE '%_levels' OR setting_key LIKE '%_types' 
             OR setting_key LIKE '%_title%' OR setting_key LIKE '%_description%' OR setting_key LIKE '%_name%' THEN true
        ELSE false
    END,
    is_public = CASE 
        WHEN setting_key LIKE '%_password%' OR setting_key LIKE '%_secret%' OR setting_key LIKE '%_token%' THEN false
        ELSE true
    END;

-- Create standardized global list settings with proper i18n structure
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, data_type, is_localizable, is_public) VALUES
    ('supported_languages', '{"en": ["en", "ar", "he", "fa"], "ar": ["en", "ar", "he", "fa"]}', 'global_lists', 'array', true, true),
    ('ui_themes', '{"en": ["light", "dark", "auto"], "ar": ["فاتح", "داكن", "تلقائي"]}', 'global_lists', 'array', true, true),
    ('currency_codes', '{"en": ["SAR", "USD", "EUR", "GBP"], "ar": ["ريال سعودي", "دولار أمريكي", "يورو", "جنيه إسترليني"]}', 'global_lists', 'array', true, true),
    ('time_zones', '{"en": ["Asia/Riyadh", "UTC", "Asia/Dubai", "Europe/London"], "ar": ["آسيا/الرياض", "توقيت جرينتش", "آسيا/دبي", "أوروبا/لندن"]}', 'global_lists', 'array', true, true),
    ('frequency_options', '{"en": ["daily", "weekly", "monthly", "yearly"], "ar": ["يومي", "أسبوعي", "شهري", "سنوي"]}', 'global_lists', 'array', true, true),
    ('file_formats', '{"en": ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "jpg", "png"], "ar": ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "jpg", "png"]}', 'global_lists', 'array', true, true),
    ('export_formats', '{"en": ["csv", "excel", "pdf", "json", "xml"], "ar": ["csv", "excel", "pdf", "json", "xml"]}', 'global_lists', 'array', true, true),
    ('color_schemes', '{"en": ["blue", "green", "purple", "orange", "red"], "ar": ["أزرق", "أخضر", "بنفسجي", "برتقالي", "أحمر"]}', 'global_lists', 'array', true, true),
    ('font_sizes', '{"en": ["small", "medium", "large", "extra-large"], "ar": ["صغير", "متوسط", "كبير", "كبير جداً"]}', 'global_lists', 'array', true, true),
    ('notification_channels', '{"en": ["email", "sms", "push", "in_app"], "ar": ["بريد إلكتروني", "رسالة نصية", "إشعار", "داخل التطبيق"]}', 'global_lists', 'array', true, true),
    ('communication_methods', '{"en": ["email", "phone", "video_call", "in_person"], "ar": ["بريد إلكتروني", "هاتف", "مكالمة فيديو", "شخصياً"]}', 'global_lists', 'array', true, true),
    ('log_levels', '{"en": ["debug", "info", "warning", "error", "critical"], "ar": ["تصحيح", "معلومات", "تحذير", "خطأ", "حرج"]}', 'global_lists', 'array', true, true),
    ('backup_types', '{"en": ["full", "incremental", "differential"], "ar": ["كامل", "تزايدي", "تفاضلي"]}', 'global_lists', 'array', true, true),
    ('status_types', '{"en": ["active", "inactive", "pending", "completed", "cancelled"], "ar": ["نشط", "غير نشط", "معلق", "مكتمل", "ملغي"]}', 'global_lists', 'array', true, true),
    ('rating_scales', '{"en": ["1-5", "1-10", "percentage", "letter_grade"], "ar": ["1-5", "1-10", "نسبة مئوية", "درجة حرفية"]}', 'global_lists', 'array', true, true)
ON CONFLICT (setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    data_type = EXCLUDED.data_type,
    is_localizable = EXCLUDED.is_localizable,
    is_public = EXCLUDED.is_public,
    updated_at = NOW();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_system_settings_category_localizable 
ON public.system_settings(setting_category, is_localizable);