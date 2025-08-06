-- Standardize system settings to use English keys with i18n support
-- This ensures consistent translation support across the entire system

-- Update partner type options to use English keys
UPDATE system_settings 
SET setting_value = '["government", "private", "academic", "nonprofit", "international"]'::jsonb
WHERE setting_key = 'partner_type_options';

-- Update engagement level options to use English keys  
UPDATE system_settings 
SET setting_value = '["high", "medium", "low", "none"]'::jsonb
WHERE setting_key = 'engagement_level_options';

-- Update expert role types to use English keys
UPDATE system_settings 
SET setting_value = '["lead_expert", "evaluator", "reviewer", "subject_matter_expert", "external_consultant"]'::jsonb
WHERE setting_key = 'expert_role_types';

-- Update expert status options to use English keys
UPDATE system_settings 
SET setting_value = '["active", "inactive", "available", "busy", "unavailable"]'::jsonb
WHERE setting_key = 'expert_status_options';

-- Update focus question types to use English keys
UPDATE system_settings 
SET setting_value = '["general", "technical", "business", "impact", "implementation", "social", "ethical", "medical", "regulatory"]'::jsonb
WHERE setting_key = 'focus_question_types';

-- Update partnership type options to use English keys
UPDATE system_settings 
SET setting_value = '["collaborator", "sponsor", "technical_partner", "strategic_partner", "implementation_partner"]'::jsonb
WHERE setting_key = 'partnership_type_options';

-- Update partner status options to use English keys  
UPDATE system_settings 
SET setting_value = '["active", "inactive", "pending", "blocked"]'::jsonb
WHERE setting_key = 'partner_status_options';

-- Update general status options to use English keys
UPDATE system_settings 
SET setting_value = '["active", "inactive", "pending", "completed", "cancelled", "suspended"]'::jsonb
WHERE setting_key = 'general_status_options';

-- Update innovation readiness levels to use English keys
UPDATE system_settings 
SET setting_value = '["concept", "prototype", "pilot", "scale", "mature"]'::jsonb
WHERE setting_key = 'innovation_readiness_levels';

-- Update priority levels to use English keys
UPDATE system_settings 
SET setting_value = '["low", "medium", "high", "urgent", "critical"]'::jsonb
WHERE setting_key = 'priority_levels';

-- Update publication status options to use English keys
UPDATE system_settings 
SET setting_value = '["draft", "under_review", "published", "archived"]'::jsonb
WHERE setting_key = 'publication_status_options';

-- Update risk levels to use English keys
UPDATE system_settings 
SET setting_value = '["low", "medium", "high", "critical"]'::jsonb
WHERE setting_key = 'risk_levels';

-- Update stakeholder involvement levels to use English keys  
UPDATE system_settings 
SET setting_value = '["high", "medium", "low", "minimal"]'::jsonb
WHERE setting_key = 'stakeholder_involvement_levels';

-- Update stakeholder types to use English keys
UPDATE system_settings 
SET setting_value = '["government", "private_sector", "academic", "civil_society", "international", "citizen"]'::jsonb
WHERE setting_key = 'stakeholder_types';

-- Update submission status options to use English keys
UPDATE system_settings 
SET setting_value = '["draft", "submitted", "under_review", "approved", "rejected", "revision_required"]'::jsonb
WHERE setting_key = 'submission_status_options';

-- Update tag category options to use English keys
UPDATE system_settings 
SET setting_value = '["technology", "sector", "skill", "topic", "method", "outcome"]'::jsonb
WHERE setting_key = 'tag_category_options';

-- Update user status options to use English keys
UPDATE system_settings 
SET setting_value = '["active", "inactive", "pending", "suspended", "blocked"]'::jsonb
WHERE setting_key = 'user_status_options';

-- Update urgency levels to use English keys
UPDATE system_settings 
SET setting_value = '["low", "medium", "high", "urgent", "critical"]'::jsonb
WHERE setting_key = 'urgency_levels';

-- Update visibility levels to use English keys
UPDATE system_settings 
SET setting_value = '["public", "internal", "restricted", "private"]'::jsonb  
WHERE setting_key = 'visibility_levels';

-- Log the standardization
INSERT INTO security_audit_log (
  user_id, action_type, resource_type, details, risk_level
) VALUES (
  auth.uid(), 'SETTINGS_STANDARDIZATION', 'system_settings',
  jsonb_build_object(
    'action', 'converted_arabic_values_to_english_keys',
    'affected_settings', 18,
    'purpose', 'enable_consistent_i18n_translation'
  ), 'low'
);