-- Simpler approach to fix data type inconsistencies

-- Fix declared numbers that are stored as strings
UPDATE public.system_settings 
SET setting_value = to_jsonb((setting_value::text)::numeric)
WHERE data_type = 'number' 
  AND jsonb_typeof(setting_value) = 'string'
  AND setting_value::text ~ '^[0-9]+(\.[0-9]+)?$';

-- Fix declared booleans that are stored as strings  
UPDATE public.system_settings 
SET setting_value = 
    CASE 
        WHEN setting_value::text IN ('"true"', 'true') THEN to_jsonb(true)
        WHEN setting_value::text IN ('"false"', 'false') THEN to_jsonb(false)
        ELSE setting_value
    END
WHERE data_type = 'boolean' 
  AND jsonb_typeof(setting_value) = 'string';

-- Update data_type to match actual stored type for remaining mismatches
UPDATE public.system_settings 
SET data_type = jsonb_typeof(setting_value)
WHERE jsonb_typeof(setting_value) != data_type;

-- Verify the results
SELECT COUNT(*) as mismatched_count 
FROM public.system_settings 
WHERE jsonb_typeof(setting_value) != data_type;