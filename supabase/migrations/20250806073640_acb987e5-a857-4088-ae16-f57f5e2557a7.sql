-- Add missing partner-related settings that UI components expect

-- Partner settings with correct naming convention
INSERT INTO system_settings (setting_key, setting_value, data_type, category, description) VALUES
('max_partners_per_project', '5'::jsonb, 'number', 'partners', 'Maximum number of partners allowed per project'),
('partnership_default_duration', '12'::jsonb, 'number', 'partners', 'Default partnership duration in months'),
('min_partnership_value', '10000'::jsonb, 'number', 'partners', 'Minimum value for a partnership'),
('partnership_renewal_period', '30'::jsonb, 'number', 'partners', 'Partnership renewal period in days'),
('require_partnership_approval', 'true'::jsonb, 'boolean', 'partners', 'Require administrative approval for new partnerships'),
('enable_periodic_partner_evaluation', 'false'::jsonb, 'boolean', 'partners', 'Enable periodic partner evaluations'),
('enable_partnership_expiry_notifications', 'true'::jsonb, 'boolean', 'partners', 'Send notifications before partnership expiry')
ON CONFLICT (setting_key) DO NOTHING;

-- AI settings that UI expects
INSERT INTO system_settings (setting_key, setting_value, data_type, category, description) VALUES
('ai_request_limit', '1000'::jsonb, 'number', 'ai', 'AI request limit per day'),
('ai_response_timeout', '30'::jsonb, 'number', 'ai', 'AI response timeout in seconds'),
('default_ai_model', '"gpt-4"'::jsonb, 'string', 'ai', 'Default AI model to use'),
('creativity_level', '"balanced"'::jsonb, 'string', 'ai', 'AI creativity level'),
('enable_ai', 'true'::jsonb, 'boolean', 'ai', 'Enable AI features'),
('enable_idea_generation', 'true'::jsonb, 'boolean', 'ai', 'Enable AI idea generation'),
('enable_content_moderation', 'true'::jsonb, 'boolean', 'ai', 'Enable AI content moderation'),
('enable_trend_analysis', 'false'::jsonb, 'boolean', 'ai', 'Enable AI trend analysis')
ON CONFLICT (setting_key) DO NOTHING;

-- Analytics settings
INSERT INTO system_settings (setting_key, setting_value, data_type, category, description) VALUES
('data_retention_days', '365'::jsonb, 'number', 'analytics', 'Data retention period in days'),
('report_generation_frequency', '24'::jsonb, 'number', 'analytics', 'Report generation frequency in hours'),
('max_dashboard_widgets', '12'::jsonb, 'number', 'analytics', 'Maximum dashboard widgets'),
('chart_refresh_interval', '300'::jsonb, 'number', 'analytics', 'Chart refresh interval in seconds'),
('enable_user_behavior_tracking', 'true'::jsonb, 'boolean', 'analytics', 'Enable user behavior tracking'),
('enable_real_time_analytics', 'true'::jsonb, 'boolean', 'analytics', 'Enable real-time analytics'),
('enable_automatic_reports', 'false'::jsonb, 'boolean', 'analytics', 'Enable automatic report generation'),
('enable_data_export', 'true'::jsonb, 'boolean', 'analytics', 'Enable data export functionality'),
('enable_data_anonymization', 'false'::jsonb, 'boolean', 'analytics', 'Enable data anonymization')
ON CONFLICT (setting_key) DO NOTHING;

-- Campaign settings
INSERT INTO system_settings (setting_key, setting_value, data_type, category, description) VALUES
('max_campaigns_per_user', '5'::jsonb, 'number', 'campaigns', 'Maximum campaigns per user'),
('campaign_min_duration', '7'::jsonb, 'number', 'campaigns', 'Minimum campaign duration in days'),
('campaign_max_duration', '365'::jsonb, 'number', 'campaigns', 'Maximum campaign duration in days'),
('max_participants_per_campaign', '1000'::jsonb, 'number', 'campaigns', 'Maximum participants per campaign'),
('campaign_budget_limit', '1000000'::jsonb, 'number', 'campaigns', 'Campaign budget limit'),
('registration_deadline_buffer', '3'::jsonb, 'number', 'campaigns', 'Registration deadline buffer in days'),
('allow_open_campaign_registration', 'true'::jsonb, 'boolean', 'campaigns', 'Allow open campaign registration'),
('require_campaign_review', 'false'::jsonb, 'boolean', 'campaigns', 'Require campaign review before publishing'),
('enable_campaign_analytics', 'true'::jsonb, 'boolean', 'campaigns', 'Enable campaign analytics'),
('enable_automatic_notifications', 'true'::jsonb, 'boolean', 'campaigns', 'Enable automatic campaign notifications')
ON CONFLICT (setting_key) DO NOTHING;

-- Log the settings addition
INSERT INTO security_audit_log (
  user_id, action_type, resource_type, details, risk_level
) VALUES (
  auth.uid(), 'MISSING_SETTINGS_ADDED', 'system_settings',
  jsonb_build_object(
    'action', 'added_missing_ui_settings',
    'categories', ARRAY['partners', 'ai', 'analytics', 'campaigns'],
    'total_added', 28
  ), 'low'
);