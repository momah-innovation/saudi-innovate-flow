-- Add missing partner-related settings that UI components expect (with required columns)

-- Partner settings with correct naming convention
INSERT INTO system_settings (setting_key, setting_value, data_type, setting_category) VALUES
('max_partners_per_project', '5'::jsonb, 'number', 'partners'),
('partnership_default_duration', '12'::jsonb, 'number', 'partners'),
('min_partnership_value', '10000'::jsonb, 'number', 'partners'),
('partnership_renewal_period', '30'::jsonb, 'number', 'partners'),
('require_partnership_approval', 'true'::jsonb, 'boolean', 'partners'),
('enable_periodic_partner_evaluation', 'false'::jsonb, 'boolean', 'partners'),
('enable_partnership_expiry_notifications', 'true'::jsonb, 'boolean', 'partners')
ON CONFLICT (setting_key) DO NOTHING;

-- AI settings that UI expects
INSERT INTO system_settings (setting_key, setting_value, data_type, setting_category) VALUES
('ai_request_limit', '1000'::jsonb, 'number', 'ai'),
('ai_response_timeout', '30'::jsonb, 'number', 'ai'),
('default_ai_model', '"gpt-4"'::jsonb, 'string', 'ai'),
('creativity_level', '"balanced"'::jsonb, 'string', 'ai'),
('enable_ai', 'true'::jsonb, 'boolean', 'ai'),
('enable_idea_generation', 'true'::jsonb, 'boolean', 'ai'),
('enable_content_moderation', 'true'::jsonb, 'boolean', 'ai'),
('enable_trend_analysis', 'false'::jsonb, 'boolean', 'ai')
ON CONFLICT (setting_key) DO NOTHING;

-- Analytics settings
INSERT INTO system_settings (setting_key, setting_value, data_type, setting_category) VALUES
('data_retention_days', '365'::jsonb, 'number', 'analytics'),
('report_generation_frequency', '24'::jsonb, 'number', 'analytics'),
('max_dashboard_widgets', '12'::jsonb, 'number', 'analytics'),
('chart_refresh_interval', '300'::jsonb, 'number', 'analytics'),
('enable_user_behavior_tracking', 'true'::jsonb, 'boolean', 'analytics'),
('enable_real_time_analytics', 'true'::jsonb, 'boolean', 'analytics'),
('enable_automatic_reports', 'false'::jsonb, 'boolean', 'analytics'),
('enable_data_export', 'true'::jsonb, 'boolean', 'analytics'),
('enable_data_anonymization', 'false'::jsonb, 'boolean', 'analytics')
ON CONFLICT (setting_key) DO NOTHING;

-- Campaign settings
INSERT INTO system_settings (setting_key, setting_value, data_type, setting_category) VALUES
('max_campaigns_per_user', '5'::jsonb, 'number', 'campaigns'),
('campaign_min_duration', '7'::jsonb, 'number', 'campaigns'),
('campaign_max_duration', '365'::jsonb, 'number', 'campaigns'),
('max_participants_per_campaign', '1000'::jsonb, 'number', 'campaigns'),
('campaign_budget_limit', '1000000'::jsonb, 'number', 'campaigns'),
('registration_deadline_buffer', '3'::jsonb, 'number', 'campaigns'),
('allow_open_campaign_registration', 'true'::jsonb, 'boolean', 'campaigns'),
('require_campaign_review', 'false'::jsonb, 'boolean', 'campaigns'),
('enable_campaign_analytics', 'true'::jsonb, 'boolean', 'campaigns'),
('enable_automatic_notifications', 'true'::jsonb, 'boolean', 'campaigns')
ON CONFLICT (setting_key) DO NOTHING;