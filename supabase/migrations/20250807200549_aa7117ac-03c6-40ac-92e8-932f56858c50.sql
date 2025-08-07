-- Insert missing settings and their translations for the remaining components
-- Insert additional array settings if not already present
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
  -- Storage/File Management Settings
  ('file_type_options', '["صورة", "مستند", "فيديو", "صوت", "أخرى"]', 'storage', 'array'),
  ('file_size_categories', '["صغير (< 1 ميجابايت)", "متوسط (1-10 ميجابايت)", "كبير (> 10 ميجابايت)"]', 'storage', 'array'),
  ('sort_options', '["الاسم", "التاريخ", "الحجم", "نوع الملف"]', 'storage', 'array'),
  
  -- Date range options
  ('date_range_options', '["اليوم", "هذا الأسبوع", "هذا الشهر", "هذا العام", "كل الأوقات"]', 'general', 'array'),
  
  -- Idea maturity levels 
  ('idea_maturity_levels', '["فكرة", "نموذج أولي", "منتج أدنى قابل للتطبيق", "تجريبي"]', 'ideas', 'array'),
  
  -- Idea status options
  ('idea_status_options', '["في الانتظار", "قيد المراجعة", "موافق عليها", "مرفوضة", "قيد التطوير", "منفذة"]', 'ideas', 'array'),

  -- Additional event settings
  ('event_format_options', '["افتراضي", "حضوري", "مختلط"]', 'events', 'array'),
  ('event_status_options', '["مجدول", "جاري", "مكتمل", "ملغي"]', 'events', 'array')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert translations for the new settings
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
  -- File management translations
  ('settings.file_type_options.label', 'File Type Options', 'خيارات أنواع الملفات', 'settings'),
  ('settings.file_type_options.description', 'Available file type categories', 'فئات أنواع الملفات المتاحة', 'settings'),
  ('settings.file_size_categories.label', 'File Size Categories', 'فئات أحجام الملفات', 'settings'),
  ('settings.file_size_categories.description', 'File size classification options', 'خيارات تصنيف أحجام الملفات', 'settings'),
  ('settings.sort_options.label', 'Sort Options', 'خيارات الترتيب', 'settings'),
  ('settings.sort_options.description', 'Available sorting criteria', 'معايير الترتيب المتاحة', 'settings'),
  
  -- Date range translations
  ('settings.date_range_options.label', 'Date Range Options', 'خيارات النطاق الزمني', 'settings'),
  ('settings.date_range_options.description', 'Available time period filters', 'فلاتر الفترات الزمنية المتاحة', 'settings'),
  
  -- Idea management translations  
  ('settings.idea_maturity_levels.label', 'Idea Maturity Levels', 'مستويات نضج الأفكار', 'settings'),
  ('settings.idea_maturity_levels.description', 'Development stages for ideas', 'مراحل تطوير الأفكار', 'settings'),
  ('settings.idea_status_options.label', 'Idea Status Options', 'خيارات حالة الأفكار', 'settings'),
  ('settings.idea_status_options.description', 'Available idea statuses', 'حالات الأفكار المتاحة', 'settings'),
  
  -- Event management translations
  ('settings.event_format_options.label', 'Event Format Options', 'خيارات أشكال الفعاليات', 'settings'),
  ('settings.event_format_options.description', 'Available event delivery formats', 'أشكال تقديم الفعاليات المتاحة', 'settings'),
  ('settings.event_status_options.label', 'Event Status Options', 'خيارات حالة الفعاليات', 'settings'),
  ('settings.event_status_options.description', 'Available event statuses', 'حالات الفعاليات المتاحة', 'settings')
ON CONFLICT (translation_key) DO NOTHING;