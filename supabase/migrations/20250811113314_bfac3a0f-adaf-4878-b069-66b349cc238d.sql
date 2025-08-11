-- Add missing backup and auto-sequence settings translation keys  
INSERT INTO public.system_translations (translation_key, text_en, text_ar, category) VALUES
  ('settings.focus_question_auto_sequence.label', 'Focus Question Auto Sequence', 'التسلسل التلقائي لأسئلة التركيز', 'settings'),
  ('settings.focus_question_auto_sequence.description', 'Enable automatic sequencing of focus questions based on responses', 'تمكين التسلسل التلقائي لأسئلة التركيز بناءً على الإجابات', 'settings'),
  ('settings.backup_types.label', 'Backup Types', 'أنواع النسخ الاحتياطية', 'settings'),
  ('settings.backup_types.description', 'Configure different types of backup mechanisms for data protection', 'تكوين أنواع مختلفة من آليات النسخ الاحتياطي لحماية البيانات', 'settings'),
  ('settings.file_size_display_units.description', 'Choose the display units for file sizes (bytes, KB, MB, GB)', 'اختر وحدات العرض لأحجام الملفات (بايت، كيلوبايت، ميجابايت، جيجابايت)', 'settings')
ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();