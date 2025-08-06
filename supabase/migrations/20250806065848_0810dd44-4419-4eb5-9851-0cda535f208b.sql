-- Fix data type inconsistencies in system_settings

-- Fix array-type settings that are stored as non-arrays
UPDATE public.system_settings 
SET setting_value = 
    CASE 
        WHEN setting_key = 'org_max_hierarchy_levels' THEN '5'
        ELSE setting_value
    END,
    data_type = 
    CASE 
        WHEN setting_key = 'org_max_hierarchy_levels' THEN 'number'
        ELSE data_type
    END
WHERE setting_key = 'org_max_hierarchy_levels';

-- Fix number-type settings that are stored as strings
UPDATE public.system_settings 
SET setting_value = 
    CASE 
        WHEN setting_key = 'system_idea_evaluation_scale_max' THEN '10'::jsonb
        WHEN setting_key = 'evaluation_required_fields' THEN '5'::jsonb
        ELSE setting_value
    END,
    data_type = 
    CASE 
        WHEN setting_key = 'evaluation_required_fields' THEN 'number'
        ELSE data_type
    END
WHERE setting_key IN ('system_idea_evaluation_scale_max', 'evaluation_required_fields');

-- Ensure all numeric settings are properly stored as numbers
UPDATE public.system_settings 
SET setting_value = (setting_value::text)::jsonb
WHERE data_type = 'number' 
  AND jsonb_typeof(setting_value) = 'string'
  AND setting_value::text ~ '^[0-9]+(\.[0-9]+)?$';

-- Ensure all boolean settings are properly stored as booleans
UPDATE public.system_settings 
SET setting_value = 
    CASE 
        WHEN setting_value::text = 'true' THEN 'true'::jsonb
        WHEN setting_value::text = 'false' THEN 'false'::jsonb
        ELSE setting_value
    END
WHERE data_type = 'boolean' 
  AND jsonb_typeof(setting_value) != 'boolean';

-- Verify all array settings are properly stored as arrays
-- (Most should already be correct, but let's make sure)
UPDATE public.system_settings 
SET setting_value = 
    CASE 
        WHEN jsonb_typeof(setting_value) = 'string' AND setting_value::text LIKE '[%]' THEN
            setting_value::text::jsonb
        WHEN jsonb_typeof(setting_value) != 'array' THEN
            jsonb_build_array(setting_value)
        ELSE setting_value
    END
WHERE data_type = 'array' 
  AND jsonb_typeof(setting_value) != 'array';

-- Log the cleanup
INSERT INTO public.security_audit_log (
    user_id, action_type, resource_type, details, risk_level
) VALUES (
    auth.uid(), 'SETTINGS_DATA_TYPE_CLEANUP', 'system_settings', 
    jsonb_build_object(
        'action', 'fixed_data_type_inconsistencies',
        'description', 'Ensured all settings match their declared data types'
    ), 'low'
);