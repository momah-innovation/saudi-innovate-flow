-- Add missing settings without category column
INSERT INTO public.system_settings (setting_key, setting_value, description) VALUES
-- Evaluation settings
('evaluation_scale', '"10"', 'Scale for evaluation ratings (5, 10, or 100)'),
('evaluation_required_fields', '5', 'Number of required evaluation criteria'),
('evaluation_require_comments', 'true', 'Force evaluators to write comments'),

-- Campaign settings  
('campaign_default_duration', '30', 'Default campaign duration in days'),
('campaign_max_budget', '1000000', 'Maximum budget for campaigns'),
('campaign_require_approval', 'true', 'Require approval for campaign publication'),

-- Focus Question settings
('focus_question_max_per_challenge', '10', 'Maximum focus questions per challenge'),
('focus_question_require_description', 'true', 'Require description for focus questions'),
('focus_question_auto_sequence', 'true', 'Auto sequence focus questions'),

-- Event settings
('event_max_participants', '500', 'Default maximum participants for events'),
('event_require_registration', 'true', 'Require registration for events'),
('event_allow_waitlist', 'true', 'Allow waitlist when event is full'),

-- Stakeholder settings
('stakeholder_max_per_organization', '100', 'Maximum stakeholders per organization'),
('stakeholder_require_verification', 'true', 'Require verification for stakeholders'),
('stakeholder_auto_categorize', 'false', 'Auto categorize stakeholders'),

-- Team settings
('team_max_members', '20', 'Maximum members per innovation team'),
('team_require_lead', 'true', 'Require team lead assignment'),
('team_auto_workload_balance', 'true', 'Auto balance team workload'),

-- Analytics settings
('analytics_data_retention', '365', 'Data retention period in days'),
('analytics_report_frequency', '"weekly"', 'Frequency for analytics reports'),
('analytics_realtime_updates', 'true', 'Enable real-time analytics updates'),

-- Partner settings
('partner_max_per_project', '5', 'Maximum partners per project'),
('partner_require_contract', 'true', 'Require contract for partnerships'),
('partner_auto_onboarding', 'false', 'Enable auto onboarding for partners'),

-- Organizational settings
('org_max_hierarchy_levels', '5', 'Maximum hierarchy levels'),
('org_max_sectors', '20', 'Maximum number of sectors'),
('org_auto_update_structure', 'true', 'Auto update organizational structure'),

-- User Management settings
('user_max_roles_per_user', '3', 'Maximum roles per user'),
('user_require_approval', 'true', 'Require approval for new users'),
('user_auto_deactivate_inactive', 'false', 'Auto deactivate inactive users')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description;