-- Final standardization: Convert ALL remaining Arabic values to English keys with proper JSON arrays

-- Fix stakeholder status options
UPDATE system_settings 
SET setting_value = '["active", "inactive", "pending", "blocked"]'::jsonb
WHERE setting_key = 'stakeholder_status_options';

-- Fix stakeholder type options  
UPDATE system_settings 
SET setting_value = '["government", "private", "academic", "nonprofit", "international"]'::jsonb
WHERE setting_key = 'stakeholder_type_options';

-- Fix available_user_roles to be simple string array instead of objects
UPDATE system_settings 
SET setting_value = '["innovator", "evaluator", "domain_expert", "sector_lead", "challenge_manager", "expert_coordinator", "content_manager", "data_analyst", "user_manager", "role_manager", "admin"]'::jsonb
WHERE setting_key = 'available_user_roles';

-- Fix organization status options (ensure it's English)
UPDATE system_settings 
SET setting_value = '["active", "inactive", "pending", "suspended"]'::jsonb
WHERE setting_key = 'organization_status_options';

-- Fix role hierarchy settings to be simple arrays
UPDATE system_settings 
SET setting_value = '["admin", "manager", "coordinator", "specialist", "member"]'::jsonb
WHERE setting_key = 'role_hierarchy_levels';

-- Fix skill levels to be consistent
UPDATE system_settings 
SET setting_value = '["beginner", "intermediate", "advanced", "expert", "master"]'::jsonb
WHERE setting_key = 'skill_levels';

-- Fix team assignment status options
UPDATE system_settings 
SET setting_value = '["active", "inactive", "pending", "completed", "cancelled"]'::jsonb
WHERE setting_key = 'team_assignment_status_options';

-- Fix team member status options  
UPDATE system_settings 
SET setting_value = '["active", "inactive", "available", "busy", "on_leave"]'::jsonb
WHERE setting_key = 'team_member_status_options';

-- Fix user engagement status
UPDATE system_settings 
SET setting_value = '["active", "inactive", "engaged", "disengaged", "new"]'::jsonb
WHERE setting_key = 'user_engagement_status';

-- Fix workflow status options
UPDATE system_settings 
SET setting_value = '["draft", "in_progress", "under_review", "approved", "rejected", "completed"]'::jsonb
WHERE setting_key = 'workflow_status_options';

-- Ensure all boolean settings are properly typed
UPDATE system_settings 
SET data_type = 'boolean', setting_value = 'true'::jsonb
WHERE setting_key IN ('enable_notifications', 'enable_analytics', 'enable_ai_features', 'enable_file_versioning')
AND data_type != 'boolean';

-- Ensure all numeric settings are properly typed
UPDATE system_settings 
SET data_type = 'number'
WHERE setting_key LIKE '%_limit' OR setting_key LIKE '%_max' OR setting_key LIKE '%_min' OR setting_key LIKE '%_count'
AND data_type != 'number';

-- Log the final standardization
INSERT INTO security_audit_log (
  user_id, action_type, resource_type, details, risk_level
) VALUES (
  auth.uid(), 'FINAL_SETTINGS_STANDARDIZATION', 'system_settings',
  jsonb_build_object(
    'action', 'converted_all_remaining_arabic_to_english',
    'fixed_arrays', true,
    'standardized_data_types', true,
    'purpose', 'complete_i18n_consistency'
  ), 'low'
);