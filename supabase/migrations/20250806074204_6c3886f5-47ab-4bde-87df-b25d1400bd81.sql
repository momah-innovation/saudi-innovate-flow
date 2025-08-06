-- Fix remaining camelCase keys to snake_case for consistency

-- Update challenge_defaultStatus to challenge_default_status
UPDATE system_settings 
SET setting_key = 'challenge_default_status'
WHERE setting_key = 'challenge_defaultStatus';

-- Update security_sessionTimeout to security_session_timeout
UPDATE system_settings 
SET setting_key = 'security_session_timeout'
WHERE setting_key = 'security_sessionTimeout';

-- Update system_orgMaxHierarchyLevels to system_org_max_hierarchy_levels
UPDATE system_settings 
SET setting_key = 'system_org_max_hierarchy_levels'
WHERE setting_key = 'system_orgMaxHierarchyLevels';

-- Update system_sortListsAlphabetically to system_sort_lists_alphabetically
UPDATE system_settings 
SET setting_key = 'system_sort_lists_alphabetically'
WHERE setting_key = 'system_sortListsAlphabetically';

-- Verify no camelCase keys remain
SELECT setting_key FROM system_settings WHERE setting_key ~ '[A-Z]' ORDER BY setting_key;