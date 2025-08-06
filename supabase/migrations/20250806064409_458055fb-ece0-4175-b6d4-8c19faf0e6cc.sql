-- Migration to standardize system settings for i18n and RTL/LTR compliance

-- First, let's add necessary columns for i18n support
ALTER TABLE public.system_settings 
ADD COLUMN IF NOT EXISTS data_type VARCHAR(50) DEFAULT 'string',
ADD COLUMN IF NOT EXISTS is_localizable BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS default_value JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS validation_rules JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Create a function to standardize settings format
CREATE OR REPLACE FUNCTION standardize_setting_value(
    p_setting_key VARCHAR,
    p_current_value JSONB,
    p_data_type VARCHAR DEFAULT 'string'
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
BEGIN
    -- For array/list settings, ensure they are properly structured for i18n
    IF p_data_type = 'array' OR p_setting_key LIKE '%_options' OR p_setting_key LIKE '%_levels' OR p_setting_key LIKE '%_types' THEN
        -- If it's already an array, convert to i18n structure
        IF jsonb_typeof(p_current_value) = 'array' THEN
            RETURN jsonb_build_object(
                'en', p_current_value,
                'ar', p_current_value
            );
        -- If it's already an object, assume it's correctly structured
        ELSIF jsonb_typeof(p_current_value) = 'object' THEN
            RETURN p_current_value;
        -- If it's a string, try to parse as array
        ELSE
            RETURN jsonb_build_object(
                'en', jsonb_build_array(p_current_value),
                'ar', jsonb_build_array(p_current_value)
            );
        END IF;
    END IF;
    
    -- For boolean settings
    IF p_data_type = 'boolean' THEN
        IF jsonb_typeof(p_current_value) = 'boolean' THEN
            RETURN p_current_value;
        ELSIF p_current_value::text = 'true' OR p_current_value::text = '"true"' THEN
            RETURN to_jsonb(true);
        ELSE
            RETURN to_jsonb(false);
        END IF;
    END IF;
    
    -- For number settings
    IF p_data_type = 'number' THEN
        IF jsonb_typeof(p_current_value) = 'number' THEN
            RETURN p_current_value;
        ELSE
            RETURN to_jsonb(COALESCE((p_current_value::text)::numeric, 0));
        END IF;
    END IF;
    
    -- For object settings (keep as is)
    IF p_data_type = 'object' THEN
        IF jsonb_typeof(p_current_value) = 'object' THEN
            RETURN p_current_value;
        ELSE
            RETURN jsonb_build_object('value', p_current_value);
        END IF;
    END IF;
    
    -- For string settings, create i18n structure if localizable
    IF p_setting_key LIKE '%_title%' OR p_setting_key LIKE '%_description%' OR p_setting_key LIKE '%_name%' THEN
        IF jsonb_typeof(p_current_value) = 'object' AND p_current_value ? 'en' THEN
            RETURN p_current_value;
        ELSE
            RETURN jsonb_build_object(
                'en', COALESCE(p_current_value::text, ''),
                'ar', COALESCE(p_current_value::text, '')
            );
        END IF;
    END IF;
    
    -- Default: return as string
    RETURN p_current_value;
END;
$$;

-- Update existing settings to standardized format
UPDATE public.system_settings SET
    setting_value = standardize_setting_value(setting_key, setting_value, 
        CASE 
            WHEN setting_key LIKE '%_options' OR setting_key LIKE '%_levels' OR setting_key LIKE '%_types' OR setting_key LIKE '%color%' THEN 'array'
            WHEN setting_key LIKE '%_enabled' OR setting_key LIKE '%_require%' OR setting_key LIKE '%_allow%' OR setting_key LIKE '%_auto%' THEN 'boolean'
            WHEN setting_key LIKE '%_max%' OR setting_key LIKE '%_min%' OR setting_key LIKE '%_limit%' OR setting_key LIKE '%_days%' OR setting_key LIKE '%_hours%' OR setting_key LIKE '%_timeout%' THEN 'number'
            WHEN setting_key LIKE '%_title%' OR setting_key LIKE '%_description%' OR setting_key LIKE '%_name%' THEN 'string'
            ELSE 'string'
        END
    ),
    data_type = CASE 
        WHEN setting_key LIKE '%_options' OR setting_key LIKE '%_levels' OR setting_key LIKE '%_types' OR setting_key LIKE '%color%' THEN 'array'
        WHEN setting_key LIKE '%_enabled' OR setting_key LIKE '%_require%' OR setting_key LIKE '%_allow%' OR setting_key LIKE '%_auto%' THEN 'boolean'
        WHEN setting_key LIKE '%_max%' OR setting_key LIKE '%_min%' OR setting_key LIKE '%_limit%' OR setting_key LIKE '%_days%' OR setting_key LIKE '%_hours%' OR setting_key LIKE '%_timeout%' THEN 'number'
        WHEN setting_key LIKE '%_title%' OR setting_key LIKE '%_description%' OR setting_key LIKE '%_name%' THEN 'string'
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

-- Create standardized default settings for missing global lists
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, data_type, is_localizable, is_public) VALUES
    ('supported_languages', '{"en": ["en", "ar", "he", "fa"], "ar": ["en", "ar", "he", "fa"]}', 'global_lists', 'array', true, true),
    ('ui_themes', '{"en": ["light", "dark", "auto"], "ar": ["فاتح", "داكن", "تلقائي"]}', 'global_lists', 'array', true, true),
    ('currency_codes', '{"en": ["SAR", "USD", "EUR", "GBP"], "ar": ["ريال سعودي", "دولار أمريكي", "يورو", "جنيه إسترليني"]}', 'global_lists', 'array', true, true),
    ('time_zones', '{"en": ["Asia/Riyadh", "UTC", "Asia/Dubai", "Europe/London"], "ar": ["آسيا/الرياض", "توقيت جرينتش", "آسيا/دبي", "أوروبا/لندن"]}', 'global_lists', 'array', true, true),
    ('frequency_options', '{"en": ["daily", "weekly", "monthly", "yearly"], "ar": ["يومي", "أسبوعي", "شهري", "سنوي"]}', 'global_lists', 'array', true, true),
    ('file_formats', '{"en": ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "jpg", "png"], "ar": ["بي دي اف", "وورد", "وورد حديث", "إكسل", "إكسل حديث", "باوربوينت", "باوربوينت حديث", "صورة", "صورة"]}', 'global_lists', 'array', true, true),
    ('export_formats', '{"en": ["csv", "excel", "pdf", "json", "xml"], "ar": ["ملف مفصول بفواصل", "إكسل", "بي دي اف", "جيسون", "إكس إم إل"]}', 'global_lists', 'array', true, true),
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

-- Clean up the standardization function
DROP FUNCTION standardize_setting_value(VARCHAR, JSONB, VARCHAR);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_system_settings_category_localizable 
ON public.system_settings(setting_category, is_localizable);

-- Log the migration
INSERT INTO public.security_audit_log (
    user_id, action_type, resource_type, details, risk_level
) VALUES (
    auth.uid(), 'SETTINGS_MIGRATION', 'system_settings', 
    jsonb_build_object(
        'action', 'standardized_settings_format',
        'changes', 'Added i18n support, data types, and localization flags'
    ), 'medium'
);