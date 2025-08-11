-- Add final export and file format settings translation keys
INSERT INTO public.system_translations (translation_key, text_en, text_ar, category) VALUES
  ('settings.export_formats.label', 'Export Formats', 'تنسيقات التصدير', 'settings'),
  ('settings.export_formats.description', 'Configure available formats for data export functionality', 'تكوين التنسيقات المتاحة لوظيفة تصدير البيانات', 'settings'),
  ('settings.file_formats.label', 'File Formats', 'تنسيقات الملفات', 'settings'),
  ('settings.file_formats.description', 'Define supported file formats for uploads and processing', 'تحديد تنسيقات الملفات المدعومة للرفع والمعالجة', 'settings')
ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();