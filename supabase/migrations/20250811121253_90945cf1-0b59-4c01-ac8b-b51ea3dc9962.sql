-- Add final font sizes and log levels translation keys
INSERT INTO public.system_translations (translation_key, text_en, text_ar, category) VALUES
  ('settings.font_sizes.label', 'Font Sizes', 'أحجام الخطوط', 'settings'),
  ('settings.font_sizes.description', 'Configure available font sizes for the user interface', 'تكوين أحجام الخطوط المتاحة لواجهة المستخدم', 'settings'),
  ('settings.log_levels.label', 'Log Levels', 'مستويات السجلات', 'settings'),
  ('settings.log_levels.description', 'Set logging verbosity and detail levels for system monitoring', 'تحديد مستوى التفصيل والمراقبة للسجلات في النظام', 'settings')
ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();