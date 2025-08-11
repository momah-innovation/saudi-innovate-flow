-- Add all remaining missing translation keys for complete 100% coverage
INSERT INTO public.system_translations (translation_key, text_en, text_ar, category) VALUES
  -- Expert settings
  ('settings.expert_status_options.label', 'Expert Status Options', 'خيارات حالة الخبير', 'settings'),
  ('settings.expert_status_options.description', 'Configure available status options for expert profiles', 'تكوين خيارات الحالة المتاحة لملفات الخبراء', 'settings'),
  ('settings.expert_assignment_bulk_notes_rows.label', 'Expert Assignment Bulk Notes Rows', 'صفوف ملاحظات تعيين الخبراء المجمعة', 'settings'),
  ('settings.expert_assignment_bulk_notes_rows.description', 'Number of rows for bulk notes in expert assignment forms', 'عدد الصفوف للملاحظات المجمعة في نماذج تعيين الخبراء', 'settings'),
  ('settings.expert_assignment_notes_rows.label', 'Expert Assignment Notes Rows', 'صفوف ملاحظات تعيين الخبراء', 'settings'),
  ('settings.expert_assignment_notes_rows.description', 'Number of rows for notes in expert assignment forms', 'عدد الصفوف للملاحظات في نماذج تعيين الخبراء', 'settings'),
  ('settings.expert_expertise_preview_limit.label', 'Expert Expertise Preview Limit', 'حد معاينة خبرة الخبراء', 'settings'),
  ('settings.expert_expertise_preview_limit.description', 'Maximum number of expertise items to show in preview', 'الحد الأقصى لعناصر الخبرة المراد إظهارها في المعاينة', 'settings'),
  ('settings.expert_workload_warning_threshold.label', 'Expert Workload Warning Threshold', 'عتبة تحذير عبء عمل الخبير', 'settings'),
  ('settings.expert_workload_warning_threshold.description', 'Threshold for warning about expert workload levels', 'العتبة للتحذير من مستويات عبء عمل الخبير', 'settings'),
  
  -- File and media settings
  ('settings.mime_types_avatars.label', 'Avatar MIME Types', 'أنواع MIME للصور الرمزية', 'settings'),
  ('settings.mime_types_avatars.description', 'Allowed MIME types for avatar image uploads', 'أنواع MIME المسموحة لتحميل الصور الرمزية', 'settings'),
  ('settings.mime_types_mixed.label', 'Mixed MIME Types', 'أنواع MIME المختلطة', 'settings'),
  ('settings.mime_types_mixed.description', 'MIME types for mixed file uploads and attachments', 'أنواع MIME للملفات المختلطة والمرفقات', 'settings'),
  ('settings.attachment_types.label', 'Attachment Types', 'أنواع المرفقات', 'settings'),
  ('settings.attachment_types.description', 'Allowed file types for attachments and uploads', 'أنواع الملفات المسموحة للمرفقات والتحميلات', 'settings'),
  ('settings.file_categories.label', 'File Categories', 'فئات الملفات', 'settings'),
  ('settings.file_categories.description', 'Categories for organizing and classifying uploaded files', 'فئات لتنظيم وتصنيف الملفات المحملة', 'settings'),
  ('settings.file_size_display_units.label', 'File Size Display Units', 'وحدات عرض حجم الملف', 'settings'),
  ('settings.file_size_display_units.description', 'Units used for displaying file sizes (KB, MB, GB)', 'الوحدات المستخدمة لعرض أحجام الملفات (كيلوبايت، ميجابايت، جيجابايت)', 'settings'),
  
  -- UI and display settings
  ('settings.color_schemes.label', 'Color Schemes', 'أنظمة الألوان', 'settings'),
  ('settings.color_schemes.description', 'Available color schemes and theme configurations for the interface', 'أنظمة الألوان والمظاهر المتاحة لواجهة المستخدم', 'settings')
ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();