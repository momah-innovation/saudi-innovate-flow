-- First check the existing structure of system_settings
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'system_settings' 
AND table_schema = 'public';