-- Update system_settings to use key-based translation system keys

-- Status options
UPDATE system_settings 
SET setting_value = ARRAY['status.draft', 'status.active', 'status.published', 'status.completed', 'status.cancelled', 'status.archived', 'status.closed']
WHERE setting_key = 'challenge_status_options';

UPDATE system_settings 
SET setting_value = ARRAY['status.draft', 'status.active', 'status.published', 'status.completed', 'status.cancelled', 'status.archived', 'status.closed']
WHERE setting_key = 'general_status_options';

UPDATE system_settings 
SET setting_value = ARRAY['status.active', 'status.inactive', 'status.pending', 'status.completed', 'status.cancelled']
WHERE setting_key = 'assignment_status_options';

UPDATE system_settings 
SET setting_value = ARRAY['status.registered', 'status.attended', 'status.absent', 'status.cancelled', 'status.confirmed']
WHERE setting_key = 'attendance_status_options';

UPDATE system_settings 
SET setting_value = ARRAY['status.all', 'status.draft', 'status.published', 'status.active', 'status.closed', 'status.archived']
WHERE setting_key = 'challenge_filter_status_options';

UPDATE system_settings 
SET setting_value = ARRAY['status.planning', 'status.active', 'status.completed', 'status.on_hold', 'status.cancelled']
WHERE setting_key = 'campaign_status_options';

-- Priority levels
UPDATE system_settings 
SET setting_value = ARRAY['priority.low', 'priority.medium', 'priority.high', 'priority.critical']
WHERE setting_key = 'challenge_priority_levels';

UPDATE system_settings 
SET setting_value = ARRAY['priority.low', 'priority.medium', 'priority.high', 'priority.critical']
WHERE setting_key = 'general_priority_levels';

-- Challenge types
UPDATE system_settings 
SET setting_value = ARRAY['challenge_type.innovation', 'challenge_type.research', 'challenge_type.design', 'challenge_type.development', 'challenge_type.improvement']
WHERE setting_key = 'challenge_types';

-- Event types
UPDATE system_settings 
SET setting_value = ARRAY['event_type.workshop', 'event_type.seminar', 'event_type.conference', 'event_type.training', 'event_type.networking', 'event_type.hackathon']
WHERE setting_key = 'event_types';

-- Assignment types
UPDATE system_settings 
SET setting_value = ARRAY['assignment_type.campaign', 'assignment_type.event', 'assignment_type.project', 'assignment_type.content', 'assignment_type.analysis']
WHERE setting_key = 'assignment_types';

-- Role types
UPDATE system_settings 
SET setting_value = ARRAY['role_type.evaluator', 'role_type.mentor', 'role_type.supervisor', 'role_type.consultant', 'role_type.judge']
WHERE setting_key = 'expert_role_types';

-- Sensitivity levels
UPDATE system_settings 
SET setting_value = ARRAY['sensitivity.normal', 'sensitivity.confidential', 'sensitivity.restricted']
WHERE setting_key = 'challenge_sensitivity_levels';

-- Add sensitivity levels as general setting if not exists
INSERT INTO system_settings (setting_key, setting_value, data_type, setting_category, description, is_localizable, is_public)
VALUES ('sensitivity_levels', ARRAY['sensitivity.normal', 'sensitivity.confidential', 'sensitivity.restricted'], 'array', 'system', 'General sensitivity levels', true, true)
ON CONFLICT (setting_key) DO UPDATE SET
setting_value = ARRAY['sensitivity.normal', 'sensitivity.confidential', 'sensitivity.restricted'];

-- Participation types
INSERT INTO system_settings (setting_key, setting_value, data_type, setting_category, description, is_localizable, is_public)
VALUES ('participation_types', ARRAY['participation_type.individual', 'participation_type.team', 'participation_type.organization'], 'array', 'system', 'Participation types', true, true)
ON CONFLICT (setting_key) DO UPDATE SET
setting_value = ARRAY['participation_type.individual', 'participation_type.team', 'participation_type.organization'];

-- Registration types
INSERT INTO system_settings (setting_key, setting_value, data_type, setting_category, description, is_localizable, is_public)
VALUES ('registration_types', ARRAY['registration_type.open', 'registration_type.invite_only', 'registration_type.application'], 'array', 'system', 'Registration types', true, true)
ON CONFLICT (setting_key) DO UPDATE SET
setting_value = ARRAY['registration_type.open', 'registration_type.invite_only', 'registration_type.application'];

-- Opportunity types
INSERT INTO system_settings (setting_key, setting_value, data_type, setting_category, description, is_localizable, is_public)
VALUES ('opportunity_types', ARRAY['opportunity_type.job', 'opportunity_type.partnership', 'opportunity_type.investment', 'opportunity_type.collaboration', 'opportunity_type.mentorship'], 'array', 'system', 'Opportunity types', true, true)
ON CONFLICT (setting_key) DO UPDATE SET
setting_value = ARRAY['opportunity_type.job', 'opportunity_type.partnership', 'opportunity_type.investment', 'opportunity_type.collaboration', 'opportunity_type.mentorship'];