-- Comprehensive fix for all data type inconsistencies

-- Fix all number fields that are stored as strings
UPDATE public.system_settings 
SET setting_value = (setting_value::text)::numeric::jsonb,
    data_type = 'number'
WHERE data_type = 'string' 
  AND jsonb_typeof(setting_value) = 'number';

-- Fix declared numbers that are stored as strings but contain numeric values
UPDATE public.system_settings 
SET setting_value = (setting_value::text::numeric)::jsonb
WHERE data_type = 'number' 
  AND jsonb_typeof(setting_value) = 'string'
  AND setting_value::text ~ '^[0-9]+(\.[0-9]+)?$';

-- Fix all boolean fields that are stored as strings
UPDATE public.system_settings 
SET setting_value = 
    CASE 
        WHEN setting_value::text = 'true' THEN 'true'::jsonb
        WHEN setting_value::text = 'false' THEN 'false'::jsonb
        ELSE setting_value
    END,
    data_type = 'boolean'
WHERE data_type = 'string' 
  AND jsonb_typeof(setting_value) = 'boolean';

-- Fix declared booleans that are stored as strings
UPDATE public.system_settings 
SET setting_value = 
    CASE 
        WHEN setting_value::text = '"true"' OR setting_value::text = 'true' THEN 'true'::jsonb
        WHEN setting_value::text = '"false"' OR setting_value::text = 'false' THEN 'false'::jsonb
        ELSE setting_value
    END
WHERE data_type = 'boolean' 
  AND jsonb_typeof(setting_value) = 'string';

-- Fix all array fields that are stored as strings but contain arrays
UPDATE public.system_settings 
SET setting_value = setting_value,
    data_type = 'array'
WHERE data_type = 'string' 
  AND jsonb_typeof(setting_value) = 'array';

-- Fix object fields
UPDATE public.system_settings 
SET data_type = 'object'
WHERE data_type = 'string' 
  AND jsonb_typeof(setting_value) = 'object';

-- Final cleanup: Update data_type to match actual stored type for any remaining mismatches
UPDATE public.system_settings 
SET data_type = jsonb_typeof(setting_value)
WHERE jsonb_typeof(setting_value) != data_type
  AND jsonb_typeof(setting_value) IN ('string', 'number', 'boolean', 'array', 'object');

-- Log the comprehensive cleanup
INSERT INTO public.security_audit_log (
    user_id, action_type, resource_type, details, risk_level
) VALUES (
    auth.uid(), 'SETTINGS_COMPREHENSIVE_CLEANUP', 'system_settings', 
    jsonb_build_object(
        'action', 'fixed_all_data_type_mismatches',
        'description', 'Comprehensive cleanup to ensure all settings have correct data types'
    ), 'low'
);