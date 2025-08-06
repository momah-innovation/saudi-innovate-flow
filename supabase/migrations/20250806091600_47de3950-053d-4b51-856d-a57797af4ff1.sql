-- Add missing settings translations for AI and Analytics categories
INSERT INTO system_translations (translation_key, language_code, translation_text, category) VALUES
-- AI Category
('settings.category.ai.description', 'en', 'Configure artificial intelligence features and settings', 'settings'),
('settings.category.ai.description', 'ar', 'تكوين ميزات وإعدادات الذكاء الاصطناعي', 'settings'),

-- AI Settings Labels
('settings.ai_features.label', 'en', 'AI Features', 'settings'),
('settings.ai_features.label', 'ar', 'ميزات الذكاء الاصطناعي', 'settings'),
('settings.ai_features.description', 'en', 'Available AI-powered features', 'settings'),
('settings.ai_features.description', 'ar', 'الميزات المدعومة بالذكاء الاصطناعي المتاحة', 'settings'),

('settings.ai_models.label', 'en', 'AI Models', 'settings'),
('settings.ai_models.label', 'ar', 'نماذج الذكاء الاصطناعي', 'settings'),
('settings.ai_models.description', 'en', 'Available AI models for processing', 'settings'),
('settings.ai_models.description', 'ar', 'نماذج الذكاء الاصطناعي المتاحة للمعالجة', 'settings'),

('settings.ai_request_limit.label', 'en', 'AI Request Limit', 'settings'),
('settings.ai_request_limit.label', 'ar', 'حد طلبات الذكاء الاصطناعي', 'settings'),
('settings.ai_request_limit.description', 'en', 'Maximum number of AI requests per user', 'settings'),
('settings.ai_request_limit.description', 'ar', 'الحد الأقصى لعدد طلبات الذكاء الاصطناعي لكل مستخدم', 'settings'),

('settings.ai_response_timeout.label', 'en', 'AI Response Timeout', 'settings'),
('settings.ai_response_timeout.label', 'ar', 'مهلة استجابة الذكاء الاصطناعي', 'settings'),
('settings.ai_response_timeout.description', 'en', 'Timeout for AI responses in seconds', 'settings'),
('settings.ai_response_timeout.description', 'ar', 'مهلة انتظار استجابات الذكاء الاصطناعي بالثواني', 'settings'),

('settings.creativity_level.label', 'en', 'Creativity Level', 'settings'),
('settings.creativity_level.label', 'ar', 'مستوى الإبداع', 'settings'),
('settings.creativity_level.description', 'en', 'AI creativity and randomness level', 'settings'),
('settings.creativity_level.description', 'ar', 'مستوى الإبداع والعشوائية للذكاء الاصطناعي', 'settings'),

('settings.default_ai_model.label', 'en', 'Default AI Model', 'settings'),
('settings.default_ai_model.label', 'ar', 'نموذج الذكاء الاصطناعي الافتراضي', 'settings'),
('settings.default_ai_model.description', 'en', 'Default AI model to use', 'settings'),
('settings.default_ai_model.description', 'ar', 'نموذج الذكاء الاصطناعي الافتراضي للاستخدام', 'settings'),

('settings.enable_ai.label', 'en', 'Enable AI', 'settings'),
('settings.enable_ai.label', 'ar', 'تفعيل الذكاء الاصطناعي', 'settings'),
('settings.enable_ai.description', 'en', 'Enable or disable AI features', 'settings'),
('settings.enable_ai.description', 'ar', 'تفعيل أو إلغاء تفعيل ميزات الذكاء الاصطناعي', 'settings'),

('settings.enable_content_moderation.label', 'en', 'Enable Content Moderation', 'settings'),
('settings.enable_content_moderation.label', 'ar', 'تفعيل الإشراف على المحتوى', 'settings'),
('settings.enable_content_moderation.description', 'en', 'Automatically moderate user content', 'settings'),
('settings.enable_content_moderation.description', 'ar', 'الإشراف التلقائي على محتوى المستخدمين', 'settings'),

('settings.enable_idea_generation.label', 'en', 'Enable Idea Generation', 'settings'),
('settings.enable_idea_generation.label', 'ar', 'تفعيل توليد الأفكار', 'settings'),
('settings.enable_idea_generation.description', 'en', 'Allow AI to generate new ideas', 'settings'),
('settings.enable_idea_generation.description', 'ar', 'السماح للذكاء الاصطناعي بتوليد أفكار جديدة', 'settings'),

('settings.enable_trend_analysis.label', 'en', 'Enable Trend Analysis', 'settings'),
('settings.enable_trend_analysis.label', 'ar', 'تفعيل تحليل الاتجاهات', 'settings'),
('settings.enable_trend_analysis.description', 'en', 'Analyze trends using AI', 'settings'),
('settings.enable_trend_analysis.description', 'ar', 'تحليل الاتجاهات باستخدام الذكاء الاصطناعي', 'settings'),

-- Analytics Category
('settings.category.analytics.description', 'en', 'Configure analytics and reporting settings', 'settings'),
('settings.category.analytics.description', 'ar', 'تكوين إعدادات التحليلات والتقارير', 'settings'),

-- Analytics Settings Labels
('settings.analytics_data_retention.label', 'en', 'Analytics Data Retention', 'settings'),
('settings.analytics_data_retention.label', 'ar', 'الاحتفاظ ببيانات التحليلات', 'settings'),
('settings.analytics_data_retention.description', 'en', 'How long to keep analytics data', 'settings'),
('settings.analytics_data_retention.description', 'ar', 'مدة الاحتفاظ ببيانات التحليلات', 'settings'),

('settings.analytics_realtime_updates.label', 'en', 'Real-time Analytics Updates', 'settings'),
('settings.analytics_realtime_updates.label', 'ar', 'تحديثات التحليلات في الوقت الفعلي', 'settings'),
('settings.analytics_realtime_updates.description', 'en', 'Enable real-time analytics updates', 'settings'),
('settings.analytics_realtime_updates.description', 'ar', 'تفعيل تحديثات التحليلات في الوقت الفعلي', 'settings'),

('settings.analytics_report_frequency.label', 'en', 'Analytics Report Frequency', 'settings'),
('settings.analytics_report_frequency.label', 'ar', 'تكرار تقارير التحليلات', 'settings'),
('settings.analytics_report_frequency.description', 'en', 'How often to generate analytics reports', 'settings'),
('settings.analytics_report_frequency.description', 'ar', 'معدل إنتاج تقارير التحليلات', 'settings'),

('settings.analytics_update_frequency.label', 'en', 'Analytics Update Frequency', 'settings'),
('settings.analytics_update_frequency.label', 'ar', 'تكرار تحديث التحليلات', 'settings'),
('settings.analytics_update_frequency.description', 'en', 'How often to update analytics data', 'settings'),
('settings.analytics_update_frequency.description', 'ar', 'معدل تحديث بيانات التحليلات', 'settings'),

('settings.chart_color_palette.label', 'en', 'Chart Color Palette', 'settings'),
('settings.chart_color_palette.label', 'ar', 'لوحة ألوان المخططات', 'settings'),
('settings.chart_color_palette.description', 'en', 'Color palette for charts and graphs', 'settings'),
('settings.chart_color_palette.description', 'ar', 'لوحة الألوان للمخططات والرسوم البيانية', 'settings'),

('settings.chart_refresh_interval.label', 'en', 'Chart Refresh Interval', 'settings'),
('settings.chart_refresh_interval.label', 'ar', 'فترة تحديث المخططات', 'settings'),
('settings.chart_refresh_interval.description', 'en', 'How often charts refresh their data', 'settings'),
('settings.chart_refresh_interval.description', 'ar', 'معدل تحديث بيانات المخططات', 'settings'),

('settings.chart_visualization_colors.label', 'en', 'Chart Visualization Colors', 'settings'),
('settings.chart_visualization_colors.label', 'ar', 'ألوان تمثيل المخططات', 'settings'),
('settings.chart_visualization_colors.description', 'en', 'Colors used in chart visualizations', 'settings'),
('settings.chart_visualization_colors.description', 'ar', 'الألوان المستخدمة في تمثيل المخططات', 'settings'),

('settings.data_retention_days.label', 'en', 'Data Retention Days', 'settings'),
('settings.data_retention_days.label', 'ar', 'أيام الاحتفاظ بالبيانات', 'settings'),
('settings.data_retention_days.description', 'en', 'Number of days to retain data', 'settings'),
('settings.data_retention_days.description', 'ar', 'عدد الأيام للاحتفاظ بالبيانات', 'settings'),

('settings.enable_automatic_reports.label', 'en', 'Enable Automatic Reports', 'settings'),
('settings.enable_automatic_reports.label', 'ar', 'تفعيل التقارير التلقائية', 'settings'),
('settings.enable_automatic_reports.description', 'en', 'Generate reports automatically', 'settings'),
('settings.enable_automatic_reports.description', 'ar', 'إنتاج التقارير تلقائياً', 'settings'),

('settings.enable_data_anonymization.label', 'en', 'Enable Data Anonymization', 'settings'),
('settings.enable_data_anonymization.label', 'ar', 'تفعيل إخفاء هوية البيانات', 'settings'),
('settings.enable_data_anonymization.description', 'en', 'Anonymize sensitive data in reports', 'settings'),
('settings.enable_data_anonymization.description', 'ar', 'إخفاء هوية البيانات الحساسة في التقارير', 'settings')

ON CONFLICT (translation_key, language_code) DO UPDATE SET
translation_text = EXCLUDED.translation_text,
updated_at = now();