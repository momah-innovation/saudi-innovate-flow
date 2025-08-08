-- Add missing analytics color translation keys
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('settings.analytics_chart_colors.label', 'Analytics Chart Colors', 'ألوان مخططات التحليلات', 'settings'),
('settings.analytics_chart_colors.description', 'Color palette for analytics charts', 'لوحة ألوان مخططات التحليلات', 'settings'),
('settings.engagement_colors.label', 'Engagement Colors', 'ألوان المشاركة', 'settings'),
('settings.engagement_colors.description', 'Color scheme for engagement metrics', 'نظام ألوان مقاييس المشاركة', 'settings'),
('settings.primary_chart_colors.label', 'Primary Chart Colors', 'ألوان المخططات الأساسية', 'settings'),
('settings.primary_chart_colors.description', 'Primary color palette for charts', 'لوحة الألوان الأساسية للمخططات', 'settings'),
('settings.statistics_theme_colors.label', 'Statistics Theme Colors', 'ألوان موضوع الإحصائيات', 'settings'),
('settings.statistics_theme_colors.description', 'Color theme for statistics displays', 'موضوع الألوان لعرض الإحصائيات', 'settings')
ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = now();