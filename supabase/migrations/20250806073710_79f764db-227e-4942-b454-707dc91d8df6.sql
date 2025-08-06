-- Add missing partner-related settings that UI components expect (fixed structure)

-- Partner settings with correct naming convention
INSERT INTO system_settings (setting_key, setting_value, data_type) VALUES
('max_partners_per_project', '5'::jsonb, 'number'),
('partnership_default_duration', '12'::jsonb, 'number'),
('min_partnership_value', '10000'::jsonb, 'number'),
('partnership_renewal_period', '30'::jsonb, 'number'),
('require_partnership_approval', 'true'::jsonb, 'boolean'),
('enable_periodic_partner_evaluation', 'false'::jsonb, 'boolean'),
('enable_partnership_expiry_notifications', 'true'::jsonb, 'boolean')
ON CONFLICT (setting_key) DO NOTHING;

-- AI settings that UI expects
INSERT INTO system_settings (setting_key, setting_value, data_type) VALUES
('ai_request_limit', '1000'::jsonb, 'number'),
('ai_response_timeout', '30'::jsonb, 'number'),
('default_ai_model', '"gpt-4"'::jsonb, 'string'),
('creativity_level', '"balanced"'::jsonb, 'string'),
('enable_ai', 'true'::jsonb, 'boolean'),
('enable_idea_generation', 'true'::jsonb, 'boolean'),
('enable_content_moderation', 'true'::jsonb, 'boolean'),
('enable_trend_analysis', 'false'::jsonb, 'boolean')
ON CONFLICT (setting_key) DO NOTHING;

-- Analytics settings
INSERT INTO system_settings (setting_key, setting_value, data_type) VALUES
('data_retention_days', '365'::jsonb, 'number'),
('report_generation_frequency', '24'::jsonb, 'number'),
('max_dashboard_widgets', '12'::jsonb, 'number'),
('chart_refresh_interval', '300'::jsonb, 'number'),
('enable_user_behavior_tracking', 'true'::jsonb, 'boolean'),
('enable_real_time_analytics', 'true'::jsonb, 'boolean'),
('enable_automatic_reports', 'false'::jsonb, 'boolean'),
('enable_data_export', 'true'::jsonb, 'boolean'),
('enable_data_anonymization', 'false'::jsonb, 'boolean')
ON CONFLICT (setting_key) DO NOTHING;

-- Campaign settings
INSERT INTO system_settings (setting_key, setting_value, data_type) VALUES
('max_campaigns_per_user', '5'::jsonb, 'number'),
('campaign_min_duration', '7'::jsonb, 'number'),
('campaign_max_duration', '365'::jsonb, 'number'),
('max_participants_per_campaign', '1000'::jsonb, 'number'),
('campaign_budget_limit', '1000000'::jsonb, 'number'),
('registration_deadline_buffer', '3'::jsonb, 'number'),
('allow_open_campaign_registration', 'true'::jsonb, 'boolean'),
('require_campaign_review', 'false'::jsonb, 'boolean'),
('enable_campaign_analytics', 'true'::jsonb, 'boolean'),
('enable_automatic_notifications', 'true'::jsonb, 'boolean')
ON CONFLICT (setting_key) DO NOTHING;