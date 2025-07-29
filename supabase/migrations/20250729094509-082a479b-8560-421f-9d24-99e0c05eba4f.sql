-- Add missing settings with proper category values
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description) VALUES
-- Evaluation settings
('evaluation_scale', '"10"', 'evaluations', 'Scale for evaluation ratings (5, 10, or 100)'),
('evaluation_required_fields', '5', 'evaluations', 'Number of required evaluation criteria'),
('evaluation_require_comments', 'true', 'evaluations', 'Force evaluators to write comments'),

-- Campaign settings  
('campaign_default_duration', '30', 'campaigns', 'Default campaign duration in days'),
('campaign_max_budget', '1000000', 'campaigns', 'Maximum budget for campaigns'),
('campaign_require_approval', 'true', 'campaigns', 'Require approval for campaign publication'),

-- Focus Question settings
('focus_question_max_per_challenge', '10', 'focus_questions', 'Maximum focus questions per challenge'),
('focus_question_require_description', 'true', 'focus_questions', 'Require description for focus questions'),
('focus_question_auto_sequence', 'true', 'focus_questions', 'Auto sequence focus questions'),

-- Event settings
('event_max_participants', '500', 'events', 'Default maximum participants for events'),
('event_require_registration', 'true', 'events', 'Require registration for events'),
('event_allow_waitlist', 'true', 'events', 'Allow waitlist when event is full'),

-- Stakeholder settings
('stakeholder_max_per_organization', '100', 'stakeholders', 'Maximum stakeholders per organization'),
('stakeholder_require_verification', 'true', 'stakeholders', 'Require verification for stakeholders'),
('stakeholder_auto_categorize', 'false', 'stakeholders', 'Auto categorize stakeholders'),

-- Team settings
('team_max_members', '20', 'teams', 'Maximum members per innovation team'),
('team_require_lead', 'true', 'teams', 'Require team lead assignment'),
('team_auto_workload_balance', 'true', 'teams', 'Auto balance team workload'),

-- Analytics settings
('analytics_data_retention', '365', 'analytics', 'Data retention period in days'),
('analytics_report_frequency', '"weekly"', 'analytics', 'Frequency for analytics reports'),
('analytics_realtime_updates', 'true', 'analytics', 'Enable real-time analytics updates'),

-- Partner settings
('partner_max_per_project', '5', 'partners', 'Maximum partners per project'),
('partner_require_contract', 'true', 'partners', 'Require contract for partnerships'),
('partner_auto_onboarding', 'false', 'partners', 'Enable auto onboarding for partners'),

-- Organizational settings
('org_max_hierarchy_levels', '5', 'organizational', 'Maximum hierarchy levels'),
('org_max_sectors', '20', 'organizational', 'Maximum number of sectors'),
('org_auto_update_structure', 'true', 'organizational', 'Auto update organizational structure'),

-- User Management settings
('user_max_roles_per_user', '3', 'user_management', 'Maximum roles per user'),
('user_require_approval', 'true', 'user_management', 'Require approval for new users'),
('user_auto_deactivate_inactive', 'false', 'user_management', 'Auto deactivate inactive users')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  setting_category = EXCLUDED.setting_category,
  description = EXCLUDED.description;