-- Add missing settings translation keys
INSERT INTO public.system_translations (translation_key, text_en, text_ar, category) VALUES
  ('settings.form_max_description_length.label', 'Maximum Description Length', 'الحد الأقصى لطول الوصف', 'settings'),
  ('settings.form_max_description_length.description', 'Set the maximum allowed character length for descriptions', 'تحديد الحد الأقصى للأحرف المسموحة في الأوصاف', 'settings'),
  ('settings.form_min_budget.label', 'Minimum Budget', 'الحد الأدنى للميزانية', 'settings'),
  ('settings.form_min_budget.description', 'Set the minimum budget amount required for projects', 'تحديد الحد الأدنى للميزانية المطلوبة للمشاريع', 'settings')
ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();