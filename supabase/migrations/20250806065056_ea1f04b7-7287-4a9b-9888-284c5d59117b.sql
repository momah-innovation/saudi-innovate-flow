-- Migration to use unified values with i18n translation keys instead of storing multiple languages

-- Update existing settings to use unified values (translation keys)
UPDATE public.system_settings SET
    setting_value = CASE setting_key
        WHEN 'supported_languages' THEN '["en", "ar", "he", "fa"]'
        WHEN 'ui_themes' THEN '["light", "dark", "auto"]'
        WHEN 'currency_codes' THEN '["SAR", "USD", "EUR", "GBP"]'
        WHEN 'time_zones' THEN '["Asia/Riyadh", "UTC", "Asia/Dubai", "Europe/London"]'
        WHEN 'frequency_options' THEN '["daily", "weekly", "monthly", "yearly"]'
        WHEN 'file_formats' THEN '["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "jpg", "png"]'
        WHEN 'export_formats' THEN '["csv", "excel", "pdf", "json", "xml"]'
        WHEN 'color_schemes' THEN '["blue", "green", "purple", "orange", "red"]'
        WHEN 'font_sizes' THEN '["small", "medium", "large", "extra-large"]'
        WHEN 'notification_channels' THEN '["email", "sms", "push", "in_app"]'
        WHEN 'communication_methods' THEN '["email", "phone", "video_call", "in_person"]'
        WHEN 'log_levels' THEN '["debug", "info", "warning", "error", "critical"]'
        WHEN 'backup_types' THEN '["full", "incremental", "differential"]'
        WHEN 'status_types' THEN '["active", "inactive", "pending", "completed", "cancelled"]'
        WHEN 'rating_scales' THEN '["1-5", "1-10", "percentage", "letter_grade"]'
        ELSE setting_value
    END
WHERE setting_key IN (
    'supported_languages', 'ui_themes', 'currency_codes', 'time_zones', 
    'frequency_options', 'file_formats', 'export_formats', 'color_schemes',
    'font_sizes', 'notification_channels', 'communication_methods', 
    'log_levels', 'backup_types', 'status_types', 'rating_scales'
);

-- Update existing settings with unified values for better i18n support
UPDATE public.system_settings SET 
    setting_value = '["draft", "published", "active", "closed", "archived", "completed"]'
WHERE setting_key = 'challenge_status_options';

UPDATE public.system_settings SET 
    setting_value = '["low", "medium", "high", "urgent", "critical"]'
WHERE setting_key = 'challenge_priority_levels';

UPDATE public.system_settings SET 
    setting_value = '["normal", "sensitive", "confidential", "top_secret"]'
WHERE setting_key = 'challenge_sensitivity_levels';

UPDATE public.system_settings SET 
    setting_value = '["technical", "sustainability", "health", "education", "governance", "innovation", "digital_transformation", "smart_cities"]'
WHERE setting_key = 'challenge_types';

UPDATE public.system_settings SET 
    setting_value = '["active", "inactive", "pending", "completed", "cancelled"]'
WHERE setting_key = 'assignment_status_options';

-- Update report frequency with unified values
UPDATE public.system_settings SET 
    setting_value = '["daily", "weekly", "monthly", "quarterly", "annually"]'
WHERE setting_key = 'report_frequency_options';

-- Update time range options
UPDATE public.system_settings SET 
    setting_value = '["last_7_days", "last_30_days", "last_90_days", "last_year", "all_time"]'
WHERE setting_key = 'time_range_options';

-- Log the migration
INSERT INTO public.security_audit_log (
    user_id, action_type, resource_type, details, risk_level
) VALUES (
    auth.uid(), 'SETTINGS_I18N_MIGRATION', 'system_settings', 
    jsonb_build_object(
        'action', 'converted_to_unified_values',
        'description', 'Replaced multilingual storage with unified values for i18n translation'
    ), 'low'
);