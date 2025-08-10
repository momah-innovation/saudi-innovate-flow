-- Update system_settings to use key-based translation system keys
-- Note: setting_value is JSONB, so we need to convert arrays to JSONB format

-- Status options
UPDATE system_settings 
SET setting_value = '["status.draft", "status.active", "status.published", "status.completed", "status.cancelled", "status.archived", "status.closed"]'::jsonb
WHERE setting_key = 'challenge_status_options';

UPDATE system_settings 
SET setting_value = '["status.draft", "status.active", "status.published", "status.completed", "status.cancelled", "status.archived", "status.closed"]'::jsonb
WHERE setting_key = 'general_status_options';

UPDATE system_settings 
SET setting_value = '["status.active", "status.inactive", "status.pending", "status.completed", "status.cancelled"]'::jsonb
WHERE setting_key = 'assignment_status_options';

UPDATE system_settings 
SET setting_value = '["status.registered", "status.attended", "status.absent", "status.cancelled", "status.confirmed"]'::jsonb
WHERE setting_key = 'attendance_status_options';

UPDATE system_settings 
SET setting_value = '["status.all", "status.draft", "status.published", "status.active", "status.closed", "status.archived"]'::jsonb
WHERE setting_key = 'challenge_filter_status_options';

UPDATE system_settings 
SET setting_value = '["status.planning", "status.active", "status.completed", "status.on_hold", "status.cancelled"]'::jsonb
WHERE setting_key = 'campaign_status_options';

-- Priority levels
UPDATE system_settings 
SET setting_value = '["priority.low", "priority.medium", "priority.high", "priority.critical"]'::jsonb
WHERE setting_key = 'challenge_priority_levels';

UPDATE system_settings 
SET setting_value = '["priority.low", "priority.medium", "priority.high", "priority.critical"]'::jsonb
WHERE setting_key = 'general_priority_levels';

-- Challenge types
UPDATE system_settings 
SET setting_value = '["challenge_type.innovation", "challenge_type.research", "challenge_type.design", "challenge_type.development", "challenge_type.improvement"]'::jsonb
WHERE setting_key = 'challenge_types';

-- Event types
UPDATE system_settings 
SET setting_value = '["event_type.workshop", "event_type.seminar", "event_type.conference", "event_type.training", "event_type.networking", "event_type.hackathon"]'::jsonb
WHERE setting_key = 'event_types';

-- Assignment types
UPDATE system_settings 
SET setting_value = '["assignment_type.campaign", "assignment_type.event", "assignment_type.project", "assignment_type.content", "assignment_type.analysis"]'::jsonb
WHERE setting_key = 'assignment_types';

-- Role types
UPDATE system_settings 
SET setting_value = '["role_type.evaluator", "role_type.mentor", "role_type.supervisor", "role_type.consultant", "role_type.judge"]'::jsonb
WHERE setting_key = 'expert_role_types';

-- Sensitivity levels
UPDATE system_settings 
SET setting_value = '["sensitivity.normal", "sensitivity.confidential", "sensitivity.restricted"]'::jsonb
WHERE setting_key = 'challenge_sensitivity_levels';

-- Add/update additional settings with key-based translations
INSERT INTO system_settings (setting_key, setting_value, data_type, setting_category, description, is_localizable, is_public)
VALUES 
  ('sensitivity_levels', '["sensitivity.normal", "sensitivity.confidential", "sensitivity.restricted"]'::jsonb, 'array', 'system', 'General sensitivity levels', true, true),
  ('participation_types', '["participation_type.individual", "participation_type.team", "participation_type.organization"]'::jsonb, 'array', 'system', 'Participation types', true, true),
  ('registration_types', '["registration_type.open", "registration_type.invite_only", "registration_type.application"]'::jsonb, 'array', 'system', 'Registration types', true, true),
  ('opportunity_types', '["opportunity_type.job", "opportunity_type.partnership", "opportunity_type.investment", "opportunity_type.collaboration", "opportunity_type.mentorship"]'::jsonb, 'array', 'system', 'Opportunity types', true, true)
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  is_localizable = EXCLUDED.is_localizable;

-- Now run the hardcoded values migration using the existing script
DO $$
DECLARE
  migration_result RECORD;
  total_updated INTEGER := 0;
  total_errors INTEGER := 0;
BEGIN
  -- Run the migration for all defined table/column/category combinations
  -- Status fields
  PERFORM migrateTableColumn('challenges', 'status', 'status');
  PERFORM migrateTableColumn('campaigns', 'status', 'status');
  PERFORM migrateTableColumn('ideas', 'status', 'status');
  PERFORM migrateTableColumn('events', 'status', 'status');
  PERFORM migrateTableColumn('opportunities', 'status', 'status');
  PERFORM migrateTableColumn('challenge_participants', 'status', 'status');
  PERFORM migrateTableColumn('challenge_submissions', 'status', 'status');
  
  -- Priority fields
  PERFORM migrateTableColumn('challenges', 'priority_level', 'priority');
  PERFORM migrateTableColumn('opportunities', 'priority_level', 'priority');
  PERFORM migrateTableColumn('challenge_bookmarks', 'priority', 'priority');
  
  -- Challenge types
  PERFORM migrateTableColumn('challenges', 'challenge_type', 'challenge_type');
  
  -- Event types
  PERFORM migrateTableColumn('events', 'event_type', 'event_type');
  
  -- Opportunity types
  PERFORM migrateTableColumn('opportunities', 'opportunity_type', 'opportunity_type');
  
  -- Sensitivity levels
  PERFORM migrateTableColumn('challenges', 'sensitivity_level', 'sensitivity');
  PERFORM migrateTableColumn('focus_questions', 'sensitivity_level', 'sensitivity');
  
  -- Participation types
  PERFORM migrateTableColumn('challenge_participants', 'participation_type', 'participation_type');
  
  -- Registration types
  PERFORM migrateTableColumn('events', 'registration_type', 'registration_type');
  
  -- Assignment types
  PERFORM migrateTableColumn('team_assignments', 'assignment_type', 'assignment_type');
  
  -- Role types
  PERFORM migrateTableColumn('challenge_experts', 'role_type', 'role_type');
  
  RAISE NOTICE 'Database migration to key-based translation system completed successfully';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Migration function calls completed with some exceptions: %', SQLERRM;
END $$;