-- Add missing Analytics settings translation keys (additional ones)
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- Additional Analytics Settings
('analytics_data_retention.label', 'Analytics Data Retention', 'الاحتفاظ ببيانات التحليلات', 'settings'),
('analytics_data_retention.description', 'Duration to retain analytics data', 'مدة الاحتفاظ ببيانات التحليلات', 'settings'),

('analytics_realtime_updates.label', 'Real-time Analytics Updates', 'تحديثات التحليلات في الوقت الفعلي', 'settings'),
('analytics_realtime_updates.description', 'Enable real-time analytics updates', 'تفعيل تحديثات التحليلات في الوقت الفعلي', 'settings'),

('analytics_report_frequency.label', 'Analytics Report Frequency', 'تكرار تقارير التحليلات', 'settings'),
('analytics_report_frequency.description', 'Frequency of analytics report generation', 'معدل إنتاج تقارير التحليلات', 'settings'),

('analytics_update_frequency.label', 'Analytics Update Frequency', 'تكرار تحديث التحليلات', 'settings'),
('analytics_update_frequency.description', 'Rate of analytics data updates', 'معدل تحديث بيانات التحليلات', 'settings'),

('chart_color_palette.label', 'Chart Color Palette', 'لوحة ألوان المخططات', 'settings'),
('chart_color_palette.description', 'Color palette for charts and graphs', 'لوحة الألوان للمخططات والرسوم البيانية', 'settings'),

('chart_refresh_interval.label', 'Chart Refresh Interval', 'فترة تحديث المخططات', 'settings'),
('chart_refresh_interval.description', 'Rate of chart data refresh', 'معدل تحديث بيانات المخططات', 'settings'),

('chart_visualization_colors.label', 'Chart Visualization Colors', 'ألوان تمثيل المخططات', 'settings'),
('chart_visualization_colors.description', 'Colors used in chart visualization', 'الألوان المستخدمة في تمثيل المخططات', 'settings'),

('data_retention_days.label', 'Data Retention Days', 'أيام الاحتفاظ بالبيانات', 'settings'),
('data_retention_days.description', 'Number of days to retain data', 'عدد الأيام للاحتفاظ بالبيانات', 'settings'),

('enable_automatic_reports.label', 'Enable Automatic Reports', 'تفعيل التقارير التلقائية', 'settings'),
('enable_automatic_reports.description', 'Automatically generate reports', 'إنتاج التقارير تلقائياً', 'settings'),

('enable_data_anonymization.label', 'Enable Data Anonymization', 'تفعيل إخفاء هوية البيانات', 'settings'),
('enable_data_anonymization.description', 'Anonymize sensitive data in reports', 'إخفاء هوية البيانات الحساسة في التقارير', 'settings')

ON CONFLICT (translation_key) 
DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();