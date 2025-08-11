-- Add final missing color schemes and communication methods translation keys
INSERT INTO public.system_translations (translation_key, text_en, text_ar, category) VALUES
  ('settings.color_schemes.description', 'Choose predefined color schemes for the user interface', 'اختر مخططات الألوان المحددة مسبقاً لواجهة المستخدم', 'settings'),
  ('settings.communication_methods.label', 'Communication Methods', 'طرق التواصل', 'settings'),
  ('settings.communication_methods.description', 'Configure available communication methods for user interactions', 'تكوين طرق التواصل المتاحة لتفاعلات المستخدمين', 'settings')
ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();