-- Add final missing settings translation keys to complete 100% coverage
INSERT INTO public.system_translations (translation_key, text_en, text_ar, category) VALUES
  ('settings.time_zones.label', 'Time Zones', 'المناطق الزمنية', 'settings'),
  ('settings.time_zones.description', 'Configure time zone settings and regional preferences', 'تكوين إعدادات المنطقة الزمنية والتفضيلات الإقليمية', 'settings'),
  ('settings.ui_themes.label', 'UI Themes', 'واجهة المستخدم والمظاهر', 'settings'),
  ('settings.ui_themes.description', 'Customize user interface themes and visual appearance', 'تخصيص مظاهر واجهة المستخدم والمظهر البصري', 'settings')
ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();