-- Add missing Performance settings translation keys
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- Performance Category
('settings.category.performance', 'Performance', 'الأداء', 'settings'),
('settings.category.performance.description', 'Performance optimization settings and configurations', 'إعدادات وتكوينات تحسين الأداء', 'settings'),

-- Performance Settings
('settings.cache_duration_minutes.label', 'Cache Duration Minutes', 'مدة التخزين المؤقت بالدقائق', 'settings'),
('settings.cache_duration_minutes.description', 'Duration in minutes for cache storage', 'المدة بالدقائق للتخزين المؤقت', 'settings'),

('settings.lazy_loading_enabled.label', 'Lazy Loading Enabled', 'تفعيل التحميل البطيء', 'settings'),
('settings.lazy_loading_enabled.description', 'Enable lazy loading for improved performance', 'تفعيل التحميل البطيء لتحسين الأداء', 'settings')

ON CONFLICT (translation_key) 
DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();