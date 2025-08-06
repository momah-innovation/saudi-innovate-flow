-- Migration to standardize all values to English for "setting_key.setting_value" translation pattern

-- Update all settings to use standardized English values
UPDATE public.system_settings SET
    setting_value = CASE setting_key
        -- Global lists with English values
        WHEN 'supported_languages' THEN '["english", "arabic", "hebrew", "persian"]'
        WHEN 'ui_themes' THEN '["light", "dark", "auto"]'
        WHEN 'currency_codes' THEN '["SAR", "USD", "EUR", "GBP"]'
        WHEN 'time_zones' THEN '["asia_riyadh", "utc", "asia_dubai", "europe_london"]'
        WHEN 'frequency_options' THEN '["daily", "weekly", "monthly", "yearly"]'
        WHEN 'file_formats' THEN '["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "jpg", "png"]'
        WHEN 'export_formats' THEN '["csv", "excel", "pdf", "json", "xml"]'
        WHEN 'color_schemes' THEN '["blue", "green", "purple", "orange", "red"]'
        WHEN 'font_sizes' THEN '["small", "medium", "large", "extra_large"]'
        WHEN 'notification_channels' THEN '["email", "sms", "push", "in_app"]'
        WHEN 'communication_methods' THEN '["email", "phone", "video_call", "in_person"]'
        WHEN 'log_levels' THEN '["debug", "info", "warning", "error", "critical"]'
        WHEN 'backup_types' THEN '["full", "incremental", "differential"]'
        WHEN 'status_types' THEN '["active", "inactive", "pending", "completed", "cancelled"]'
        WHEN 'rating_scales' THEN '["one_to_five", "one_to_ten", "percentage", "letter_grade"]'
        
        -- Challenge-specific settings
        WHEN 'challenge_status_options' THEN '["draft", "published", "active", "closed", "archived", "completed"]'
        WHEN 'challenge_priority_levels' THEN '["low", "medium", "high", "urgent", "critical"]'
        WHEN 'challenge_sensitivity_levels' THEN '["normal", "sensitive", "confidential", "top_secret"]'
        WHEN 'challenge_types' THEN '["technical", "sustainability", "health", "education", "governance", "innovation", "digital_transformation", "smart_cities"]'
        
        -- Assignment status
        WHEN 'assignment_status_options' THEN '["active", "inactive", "pending", "completed", "cancelled"]'
        
        -- Report and analytics
        WHEN 'report_frequency_options' THEN '["daily", "weekly", "monthly", "quarterly", "annually"]'
        WHEN 'time_range_options' THEN '["last_7_days", "last_30_days", "last_90_days", "last_year", "all_time"]'
        
        -- Chart colors (keep as-is since they're technical values)
        WHEN 'chart_color_palette' THEN setting_value
        WHEN 'chart_visualization_colors' THEN setting_value
        
        ELSE setting_value
    END
WHERE setting_key IN (
    'supported_languages', 'ui_themes', 'currency_codes', 'time_zones', 
    'frequency_options', 'file_formats', 'export_formats', 'color_schemes',
    'font_sizes', 'notification_channels', 'communication_methods', 
    'log_levels', 'backup_types', 'status_types', 'rating_scales',
    'challenge_status_options', 'challenge_priority_levels', 'challenge_sensitivity_levels',
    'challenge_types', 'assignment_status_options', 'report_frequency_options',
    'time_range_options'
);

-- Log the migration
INSERT INTO public.security_audit_log (
    user_id, action_type, resource_type, details, risk_level
) VALUES (
    auth.uid(), 'SETTINGS_ENGLISH_STANDARDIZATION', 'system_settings', 
    jsonb_build_object(
        'action', 'standardized_to_english_values',
        'description', 'All setting values now use English for setting_key.setting_value translation pattern'
    ), 'low'
);