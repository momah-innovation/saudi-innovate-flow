-- Insert missing system settings that are currently hardcoded
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type, description, is_public)
VALUES 
  -- General settings missing from database
  ('system_name', 'منصة الابتكار الحكومي', 'general', 'string', 'اسم النظام', true),
  ('system_description', 'منصة شاملة لإدارة التحديات والأفكار الابتكارية', 'general', 'string', 'وصف النظام', true),
  ('system_language', 'ar', 'general', 'string', 'لغة النظام الافتراضية', true),
  ('allow_public_registration', 'true', 'general', 'boolean', 'السماح بالتسجيل العام', true),
  ('max_file_upload_size', '10', 'general', 'number', 'الحد الأقصى لحجم الملف بالميجابايت', true),
  ('auto_archive_after_days', '365', 'general', 'number', 'الأرشفة التلقائية بعد أيام', true),
  
  -- Challenge settings missing from database
  ('challenge_types', '["تقنية", "استدامة", "صحة", "تعليم", "حوكمة", "بيئة", "اقتصاد", "خدمات عامة"]', 'challenges', 'array', 'أنواع التحديات المتاحة', true),
  ('priority_levels', '["منخفض", "متوسط", "عالي", "عاجل"]', 'challenges', 'array', 'مستويات الأولوية', true),
  ('challenge_status_options', '["مسودة", "منشور", "نشط", "مغلق", "مؤرشف", "معلق"]', 'challenges', 'array', 'خيارات حالة التحديات', true),
  ('max_challenges_per_user', '10', 'challenges', 'number', 'الحد الأقصى للتحديات لكل مستخدم', true),
  ('require_approval_for_publish', 'true', 'challenges', 'boolean', 'مطالبة الموافقة للنشر', true),
  ('allow_anonymous_submissions', 'false', 'challenges', 'boolean', 'السماح بالمشاركات المجهولة', true),
  ('enable_collaboration', 'true', 'challenges', 'boolean', 'تفعيل التعاون', true),
  
  -- Ideas settings
  ('idea_types', '["تحسين عملية", "منتج جديد", "خدمة جديدة", "تطوير تقني", "حل مبتكر"]', 'ideas', 'array', 'أنواع الأفكار', true),
  ('idea_status_options', '["مسودة", "مقدمة", "قيد المراجعة", "مقبولة", "مرفوضة", "قيد التطوير", "منفذة"]', 'ideas', 'array', 'خيارات حالة الأفكار', true),
  ('max_ideas_per_user', '20', 'ideas', 'number', 'الحد الأقصى للأفكار لكل مستخدم', true),
  ('idea_evaluation_criteria', '["الجدوى التقنية", "القابلية المالية", "إمكانات السوق", "التوافق الاستراتيجي", "مستوى الابتكار"]', 'ideas', 'array', 'معايير تقييم الأفكار', true),
  
  -- Events settings
  ('event_types', '["ورشة عمل", "مؤتمر", "ندوة", "تدريب", "جلسة عصف ذهني", "عرض تقديمي"]', 'events', 'array', 'أنواع الفعاليات', true),
  ('event_status_options', '["مجدولة", "جارية", "منتهية", "ملغاة", "مؤجلة"]', 'events', 'array', 'خيارات حالة الفعاليات', true),
  ('max_events_per_user', '15', 'events', 'number', 'الحد الأقصى للفعاليات لكل مستخدم', true),
  
  -- Partners settings
  ('partner_types', '["حكومي", "خاص", "غير ربحي", "أكاديمي", "دولي", "محلي"]', 'partners', 'array', 'أنواع الشركاء', true),
  ('partner_status_options', '["نشط", "غير نشط", "معلق", "تحت المراجعة"]', 'partners', 'array', 'خيارات حالة الشركاء', true),
  
  -- User management settings
  ('user_roles', '["مستخدم", "خبير", "مقيم", "مدير مشروع", "مدير فريق", "مدير نظام", "مدير عام"]', 'user_management', 'array', 'أدوار المستخدمين', true),
  ('user_status_options', '["نشط", "غير نشط", "معلق", "محظور"]', 'user_management', 'array', 'خيارات حالة المستخدمين', true),
  ('max_login_attempts', '5', 'security', 'number', 'الحد الأقصى لمحاولات تسجيل الدخول', true),
  ('password_min_length', '8', 'security', 'number', 'الحد الأدنى لطول كلمة المرور', true),
  
  -- Campaigns settings
  ('campaign_types', '["توعوية", "تحفيزية", "تنافسية", "تعليمية", "ترويجية"]', 'campaigns', 'array', 'أنواع الحملات', true),
  ('campaign_status_options', '["تخطيط", "نشطة", "منتهية", "معلقة", "ملغاة"]', 'campaigns', 'array', 'خيارات حالة الحملات', true),
  
  -- Opportunities settings  
  ('opportunity_types', '["عمل", "تدريب", "شراكة", "تمويل", "استشارة", "تطوع"]', 'opportunities', 'array', 'أنواع الفرص', true),
  ('opportunity_status_options', '["مفتوحة", "مغلقة", "معلقة", "ملغاة"]', 'opportunities', 'array', 'خيارات حالة الفرص', true),
  
  -- Analytics settings
  ('enable_real_time_analytics', 'true', 'analytics', 'boolean', 'تفعيل التحليلات اللحظية', true),
  ('analytics_update_frequency', '300', 'analytics', 'number', 'تكرار تحديث التحليلات بالثواني', true),
  
  -- UI/Performance settings
  ('items_per_page', '12', 'ui', 'number', 'عدد العناصر في الصفحة', true),
  ('enable_dark_mode', 'false', 'ui', 'boolean', 'تفعيل الوضع المظلم', true),
  ('enable_animations', 'true', 'ui', 'boolean', 'تفعيل الحركات', true),
  ('cache_duration_minutes', '60', 'performance', 'number', 'مدة التخزين المؤقت بالدقائق', true),
  ('lazy_loading_enabled', 'true', 'performance', 'boolean', 'تفعيل التحميل التدريجي', true)

ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- Update shared setting concepts with more comprehensive mappings
INSERT INTO shared_setting_concepts (unified_key, concept_name, concept_description, data_type, default_value, applies_to_systems, validation_rules)
VALUES 
  ('global_max_items_per_user', 'max_items_per_user', 'Maximum items any user can create/own', 'number', 10, ARRAY['challenges', 'ideas', 'events', 'campaigns', 'opportunities'], '{"min": 1, "max": 100}'),
  ('global_items_per_page', 'items_per_page', 'Default number of items per page', 'number', 12, ARRAY['ui', 'pagination', 'lists'], '{"min": 6, "max": 48}'),
  ('global_enable_collaboration', 'enable_collaboration', 'Enable collaboration features', 'boolean', true, ARRAY['challenges', 'ideas', 'teams', 'projects'], '{}'),
  ('global_enable_notifications', 'enable_notifications', 'Enable notifications across all systems', 'boolean', true, ARRAY['challenges', 'ideas', 'campaigns', 'events', 'opportunities'], '{}'),
  ('global_enable_analytics', 'enable_analytics', 'Enable analytics tracking globally', 'boolean', true, ARRAY['challenges', 'ideas', 'campaigns', 'events', 'users'], '{}'),
  ('global_default_status', 'default_status', 'Default status for new items', 'string', 'draft', ARRAY['challenges', 'ideas', 'campaigns', 'events', 'opportunities'], '{}'),
  ('global_default_priority', 'default_priority', 'Default priority level', 'string', 'medium', ARRAY['challenges', 'ideas', 'tasks', 'issues'], '{}'),
  ('global_max_budget_limit', 'max_budget_limit', 'Maximum budget limit across all systems', 'number', 1000000, ARRAY['challenges', 'campaigns', 'opportunities', 'projects'], '{"min": 1000, "max": 10000000}'),
  ('global_session_timeout', 'session_timeout_minutes', 'Session timeout in minutes for all systems', 'number', 60, ARRAY['security', 'authentication'], '{"min": 15, "max": 480}'),
  ('global_default_language', 'default_language', 'Default system language', 'string', 'ar', ARRAY['system', 'ui', 'content'], '{}')
ON CONFLICT (unified_key) DO UPDATE SET
  concept_description = EXCLUDED.concept_description,
  applies_to_systems = EXCLUDED.applies_to_systems,
  validation_rules = EXCLUDED.validation_rules;

-- Add comprehensive system translations for settings
INSERT INTO system_translations (translation_key, language_code, translation_text, category)
VALUES 
  -- Setting labels in Arabic
  ('settings.system_name.label', 'ar', 'اسم النظام', 'settings'),
  ('settings.system_name.description', 'ar', 'الاسم الذي يظهر في واجهة النظام', 'settings'),
  ('settings.system_description.label', 'ar', 'وصف النظام', 'settings'),
  ('settings.system_description.description', 'ar', 'وصف مختصر لوظائف وأهداف النظام', 'settings'),
  ('settings.challenge_types.label', 'ar', 'أنواع التحديات', 'settings'),
  ('settings.challenge_types.description', 'ar', 'قائمة بأنواع التحديات المتاحة في النظام', 'settings'),
  ('settings.idea_types.label', 'ar', 'أنواع الأفكار', 'settings'),
  ('settings.idea_types.description', 'ar', 'قائمة بأنواع الأفكار المتاحة في النظام', 'settings'),
  ('settings.event_types.label', 'ar', 'أنواع الفعاليات', 'settings'),
  ('settings.event_types.description', 'ar', 'قائمة بأنواع الفعاليات المتاحة في النظام', 'settings'),
  ('settings.partner_types.label', 'ar', 'أنواع الشركاء', 'settings'),
  ('settings.partner_types.description', 'ar', 'قائمة بأنواع الشركاء المتاحة في النظام', 'settings'),
  ('settings.enable_collaboration.label', 'ar', 'تفعيل التعاون', 'settings'),
  ('settings.enable_collaboration.description', 'ar', 'السماح بالعمل التعاوني والمشاركة في المحتوى', 'settings'),
  ('settings.items_per_page.label', 'ar', 'عدد العناصر في الصفحة', 'settings'),
  ('settings.items_per_page.description', 'ar', 'عدد العناصر المعروضة في كل صفحة', 'settings'),
  
  -- Setting labels in English
  ('settings.system_name.label', 'en', 'System Name', 'settings'),
  ('settings.system_name.description', 'en', 'The name displayed in the system interface', 'settings'),
  ('settings.system_description.label', 'en', 'System Description', 'settings'),
  ('settings.system_description.description', 'en', 'Brief description of system functions and objectives', 'settings'),
  ('settings.challenge_types.label', 'en', 'Challenge Types', 'settings'),
  ('settings.challenge_types.description', 'en', 'List of available challenge types in the system', 'settings'),
  ('settings.idea_types.label', 'en', 'Idea Types', 'settings'),
  ('settings.idea_types.description', 'en', 'List of available idea types in the system', 'settings'),
  ('settings.event_types.label', 'en', 'Event Types', 'settings'),
  ('settings.event_types.description', 'en', 'List of available event types in the system', 'settings'),
  ('settings.partner_types.label', 'en', 'Partner Types', 'settings'),
  ('settings.partner_types.description', 'en', 'List of available partner types in the system', 'settings'),
  ('settings.enable_collaboration.label', 'en', 'Enable Collaboration', 'settings'),
  ('settings.enable_collaboration.description', 'en', 'Allow collaborative work and content sharing', 'settings'),
  ('settings.items_per_page.label', 'en', 'Items Per Page', 'settings'),
  ('settings.items_per_page.description', 'en', 'Number of items displayed per page', 'settings')

ON CONFLICT (translation_key, language_code) DO UPDATE SET
  translation_text = EXCLUDED.translation_text;