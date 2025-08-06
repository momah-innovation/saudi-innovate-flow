-- Fix remaining Arabic values that were missed

-- Fix idea predefined tags to use English keys
UPDATE system_settings 
SET setting_value = '["artificial_intelligence", "big_data", "internet_of_things", "blockchain", "cybersecurity", "digital_transformation", "mobile_applications", "cloud_computing", "augmented_reality", "virtual_reality", "renewable_energy", "sustainability", "elearning", "digital_health", "ecommerce", "smart_cities", "smart_transportation", "smart_agriculture", "industry_4_0", "robotics"]'::jsonb
WHERE setting_key = 'idea_predefined_tags';

-- Fix influence level options  
UPDATE system_settings 
SET setting_value = '["high", "medium", "low"]'::jsonb
WHERE setting_key = 'influence_level_options';

-- Fix role request status options
UPDATE system_settings 
SET setting_value = '["pending", "approved", "rejected", "withdrawn"]'::jsonb
WHERE setting_key = 'role_request_status_options';

-- Fix stakeholder influence levels
UPDATE system_settings 
SET setting_value = '["high", "medium", "low"]'::jsonb
WHERE setting_key = 'stakeholder_influence_levels';

-- Fix stakeholder interest levels  
UPDATE system_settings 
SET setting_value = '["high", "medium", "low"]'::jsonb
WHERE setting_key = 'stakeholder_interest_levels';

-- Fix stakeholder role options
UPDATE system_settings 
SET setting_value = '["strategic_partner", "developer", "service_provider", "consultant", "implementer"]'::jsonb
WHERE setting_key = 'stakeholder_role_options';

-- Verify no Arabic text remains
SELECT COUNT(*) as remaining_arabic_values 
FROM system_settings 
WHERE data_type = 'array' 
AND (setting_value::text ~ '[أ-ي]' OR setting_value::text LIKE '%تقني%' OR setting_value::text LIKE '%حكومي%');

-- Log the final cleanup
INSERT INTO security_audit_log (
  user_id, action_type, resource_type, details, risk_level
) VALUES (
  auth.uid(), 'FINAL_ARABIC_CLEANUP', 'system_settings',
  jsonb_build_object(
    'action', 'removed_last_remaining_arabic_values',
    'settings_fixed', 6,
    'total_english_standardization', true
  ), 'low'
);