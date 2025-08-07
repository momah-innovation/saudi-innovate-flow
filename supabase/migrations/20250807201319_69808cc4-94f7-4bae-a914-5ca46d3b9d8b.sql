-- Add missing array settings found in the remaining components
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
  -- Opportunity settings
  ('opportunity_type_options', '["وظيفة", "تدريب", "تطوع", "شراكة", "منحة", "مسابقة"]', 'opportunities', 'array'),
  ('opportunity_status_options', '["مفتوح", "مغلق", "معلق", "ملغي"]', 'opportunities', 'array'),
  ('currency_options', '["ريال سعودي (SAR)", "دولار أمريكي (USD)", "يورو (EUR)"]', 'general', 'array'),
  
  -- Focus question settings
  ('question_sensitivity_options', '["حساس", "عادي"]', 'focus_questions', 'array'),
  ('question_sort_options', '["الأحدث أولاً", "الأقدم أولاً", "الترتيب (تصاعدي)", "الترتيب (تنازلي)", "أبجدي", "حسب النوع"]', 'focus_questions', 'array'),
  
  -- Enhanced challenge form settings (if different from regular challenge settings)
  ('enhanced_priority_levels', '["منخفض", "متوسط", "عالي", "حرج"]', 'challenges', 'array'),
  ('enhanced_status_options', '["مسودة", "قيد التخطيط", "نشط", "متوقف", "مكتمل"]', 'challenges', 'array'),
  ('enhanced_sensitivity_levels', '["عادي", "داخلي", "عالي", "سري"]', 'challenges', 'array'),
  
  -- Event advanced filter settings
  ('event_price_ranges', '["مجاني", "1 - 500 ر.س", "501 - 1000 ر.س", "أكثر من 1000 ر.س"]', 'events', 'array'),
  ('event_capacity_options', '["1 - 25 شخص", "26 - 50 شخص", "51 - 100 شخص", "أكثر من 100 شخص"]', 'events', 'array'),
  
  -- Profile setup settings  
  ('experience_levels', '["مبتدئ (1-3 سنوات)", "متوسط (3-7 سنوات)", "كبير (7-15 سنة)", "خبير (+15 سنة)"]', 'profile', 'array')
ON CONFLICT (setting_key) DO NOTHING;

-- Add translations for the new settings
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
  -- Opportunity translations
  ('settings.opportunity_type_options.label', 'Opportunity Types', 'أنواع الفرص', 'settings'),
  ('settings.opportunity_type_options.description', 'Available opportunity type categories', 'فئات أنواع الفرص المتاحة', 'settings'),
  ('settings.currency_options.label', 'Currency Options', 'خيارات العملة', 'settings'),
  ('settings.currency_options.description', 'Available currency types', 'أنواع العملات المتاحة', 'settings'),
  
  -- Focus question translations
  ('settings.question_sensitivity_options.label', 'Question Sensitivity Levels', 'مستويات حساسية الأسئلة', 'settings'),
  ('settings.question_sensitivity_options.description', 'Sensitivity classification for questions', 'تصنيف الحساسية للأسئلة', 'settings'),
  ('settings.question_sort_options.label', 'Question Sort Options', 'خيارات ترتيب الأسئلة', 'settings'),
  ('settings.question_sort_options.description', 'Available sorting criteria for questions', 'معايير الترتيب المتاحة للأسئلة', 'settings'),
  
  -- Enhanced challenge translations
  ('settings.enhanced_priority_levels.label', 'Enhanced Priority Levels', 'مستويات الأولوية المحسنة', 'settings'),
  ('settings.enhanced_priority_levels.description', 'Enhanced priority classification options', 'خيارات تصنيف الأولوية المحسنة', 'settings'),
  ('settings.enhanced_status_options.label', 'Enhanced Status Options', 'خيارات الحالة المحسنة', 'settings'),
  ('settings.enhanced_status_options.description', 'Enhanced status classification options', 'خيارات تصنيف الحالة المحسنة', 'settings'),
  ('settings.enhanced_sensitivity_levels.label', 'Enhanced Sensitivity Levels', 'مستويات الحساسية المحسنة', 'settings'),
  ('settings.enhanced_sensitivity_levels.description', 'Enhanced sensitivity classification', 'تصنيف الحساسية المحسن', 'settings'),
  
  -- Event advanced filter translations
  ('settings.event_price_ranges.label', 'Event Price Ranges', 'نطاقات أسعار الفعاليات', 'settings'),
  ('settings.event_price_ranges.description', 'Price range categories for events', 'فئات النطاق السعري للفعاليات', 'settings'),
  ('settings.event_capacity_options.label', 'Event Capacity Options', 'خيارات سعة الفعاليات', 'settings'),
  ('settings.event_capacity_options.description', 'Capacity range options for events', 'خيارات النطاق الاستيعابي للفعاليات', 'settings'),
  
  -- Profile setup translations
  ('settings.experience_levels.label', 'Experience Levels', 'مستويات الخبرة', 'settings'),
  ('settings.experience_levels.description', 'Professional experience level categories', 'فئات مستويات الخبرة المهنية', 'settings')
ON CONFLICT (translation_key) DO NOTHING;