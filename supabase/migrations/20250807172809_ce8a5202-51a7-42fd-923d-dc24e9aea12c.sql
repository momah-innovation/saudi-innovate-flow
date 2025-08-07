-- Add missing Analytics settings translation keys
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- Analytics Settings
('settings.enable_data_export.label', 'Enable Data Export', 'تفعيل تصدير البيانات', 'settings'),
('settings.enable_data_export.description', 'Allow users to export analytics data', 'السماح للمستخدمين بتصدير بيانات التحليلات', 'settings'),

('settings.enable_real_time_analytics.label', 'Enable Real-time Analytics', 'تفعيل التحليلات في الوقت الفعلي', 'settings'),
('settings.enable_real_time_analytics.description', 'Enable real-time analytics updates', 'تفعيل تحديثات التحليلات في الوقت الفعلي', 'settings'),

('settings.enable_user_behavior_tracking.label', 'Enable User Behavior Tracking', 'تفعيل تتبع سلوك المستخدمين', 'settings'),
('settings.enable_user_behavior_tracking.description', 'Track user behavior and interactions', 'تتبع سلوك المستخدمين وتفاعلاتهم', 'settings'),

('settings.max_dashboard_widgets.label', 'Maximum Dashboard Widgets', 'الحد الأقصى لودجات لوحة التحكم', 'settings'),
('settings.max_dashboard_widgets.description', 'Maximum number of widgets on dashboard', 'الحد الأقصى لعدد الودجات في لوحة التحكم', 'settings'),

('settings.report_frequency_options.label', 'Report Frequency Options', 'خيارات تكرار التقارير', 'settings'),
('settings.report_frequency_options.description', 'Available frequency options for report generation', 'خيارات التكرار المتاحة لإنتاج التقارير', 'settings'),

('settings.report_generation_frequency.label', 'Report Generation Frequency', 'تكرار إنتاج التقارير', 'settings'),
('settings.report_generation_frequency.description', 'How often reports are automatically generated (in hours)', 'معدل إنتاج التقارير تلقائياً (بالساعات)', 'settings'),

('settings.time_range_options.label', 'Time Range Options', 'خيارات النطاق الزمني', 'settings'),
('settings.time_range_options.description', 'Available time range options for analytics', 'خيارات النطاق الزمني المتاحة للتحليلات', 'settings')

ON CONFLICT (translation_key) 
DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();