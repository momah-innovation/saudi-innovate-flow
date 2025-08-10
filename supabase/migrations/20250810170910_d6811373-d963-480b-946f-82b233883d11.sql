-- Add missing translation key for description_english_label
INSERT INTO public.system_translations (translation_key, text_ar, text_en, category) VALUES
('form.description_english_label', 'الوصف (بالإنجليزية)', 'Description (English)', 'form')
ON CONFLICT (translation_key) DO UPDATE SET
text_ar = EXCLUDED.text_ar,
text_en = EXCLUDED.text_en,
category = EXCLUDED.category;