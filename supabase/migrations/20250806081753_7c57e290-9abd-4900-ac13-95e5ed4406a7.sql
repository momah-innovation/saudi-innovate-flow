-- First, let's identify and resolve duplicate/inconsistent settings
-- Remove duplicate and inconsistent settings, keeping only the most appropriate ones

-- Delete redundant max_* settings that should be unified
DELETE FROM system_settings WHERE setting_key IN (
  'max_challenges_per_user', 'max_campaigns_per_user', 'max_events_per_user', 'max_ideas_per_user'
) AND setting_category != 'general';

-- Delete redundant enable_* settings that should be unified  
DELETE FROM system_settings WHERE setting_key = 'enable_collaboration' AND setting_category != 'general';
DELETE FROM system_settings WHERE setting_key = 'enable_analytics' AND setting_category != 'general';
DELETE FROM system_settings WHERE setting_key = 'enable_notifications' AND setting_category != 'general';

-- Delete redundant default_* settings
DELETE FROM system_settings WHERE setting_key LIKE '%default_status%' AND setting_category != 'general';
DELETE FROM system_settings WHERE setting_key LIKE '%default_priority%' AND setting_category != 'general';

-- Update shared setting concepts to reflect the unified approach
UPDATE shared_setting_concepts SET
  applies_to_systems = ARRAY['challenges', 'ideas', 'events', 'campaigns', 'opportunities', 'users']
WHERE unified_key = 'global_max_items_per_user';

UPDATE shared_setting_concepts SET
  applies_to_systems = ARRAY['challenges', 'ideas', 'events', 'campaigns', 'partners', 'analytics']
WHERE unified_key = 'global_enable_collaboration';

UPDATE shared_setting_concepts SET
  applies_to_systems = ARRAY['challenges', 'ideas', 'events', 'campaigns', 'opportunities', 'partners']
WHERE unified_key = 'global_enable_notifications';

UPDATE shared_setting_concepts SET
  applies_to_systems = ARRAY['challenges', 'ideas', 'events', 'campaigns', 'opportunities', 'analytics']
WHERE unified_key = 'global_enable_analytics';

-- Insert unified settings if they don't exist
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type, description, is_public)
VALUES 
  ('max_items_per_user', '10', 'general', 'number', 'Maximum items any user can create across all systems', true),
  ('items_per_page', '12', 'general', 'number', 'Default pagination size across all systems', true),
  ('enable_collaboration', 'true', 'general', 'boolean', 'Enable collaboration features globally', true),
  ('enable_notifications', 'true', 'general', 'boolean', 'Enable notifications globally', true),
  ('enable_analytics', 'true', 'general', 'boolean', 'Enable analytics tracking globally', true),
  ('default_status', '"draft"', 'general', 'string', 'Default status for new items', true),
  ('default_priority', '"medium"', 'general', 'string', 'Default priority level', true),
  ('session_timeout_minutes', '60', 'security', 'number', 'Session timeout in minutes', true),
  ('max_budget_limit', '1000000', 'general', 'number', 'Maximum budget limit across all systems', true),
  ('default_language', '"ar"', 'general', 'string', 'Default system language', true)
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  setting_category = EXCLUDED.setting_category,
  description = EXCLUDED.description,
  updated_at = now();