-- Add comprehensive translations for all system settings
INSERT INTO system_translations (translation_key, language_code, translation_text, category)
VALUES 
  -- General settings - Arabic
  ('settings.max_items_per_user.label', 'ar', 'الحد الأقصى للعناصر لكل مستخدم', 'settings'),
  ('settings.max_items_per_user.description', 'ar', 'الحد الأقصى لعدد العناصر التي يمكن للمستخدم إنشاؤها عبر جميع الأنظمة', 'settings'),
  ('settings.items_per_page.label', 'ar', 'عدد العناصر في الصفحة', 'settings'),
  ('settings.items_per_page.description', 'ar', 'عدد العناصر المعروضة في كل صفحة', 'settings'),
  ('settings.enable_collaboration.label', 'ar', 'تفعيل التعاون', 'settings'),
  ('settings.enable_collaboration.description', 'ar', 'تفعيل ميزات التعاون والمشاركة عبر جميع الأنظمة', 'settings'),
  ('settings.enable_notifications.label', 'ar', 'تفعيل الإشعارات', 'settings'),
  ('settings.enable_notifications.description', 'ar', 'تفعيل الإشعارات عبر جميع الأنظمة', 'settings'),
  ('settings.enable_analytics.label', 'ar', 'تفعيل التحليلات', 'settings'),
  ('settings.enable_analytics.description', 'ar', 'تفعيل تتبع التحليلات عبر جميع الأنظمة', 'settings'),
  ('settings.default_status.label', 'ar', 'الحالة الافتراضية', 'settings'),
  ('settings.default_status.description', 'ar', 'الحالة الافتراضية للعناصر الجديدة', 'settings'),
  ('settings.default_priority.label', 'ar', 'الأولوية الافتراضية', 'settings'),
  ('settings.default_priority.description', 'ar', 'مستوى الأولوية الافتراضي', 'settings'),
  ('settings.max_budget_limit.label', 'ar', 'الحد الأقصى للميزانية', 'settings'),
  ('settings.max_budget_limit.description', 'ar', 'الحد الأقصى للميزانية عبر جميع الأنظمة', 'settings'),
  ('settings.default_language.label', 'ar', 'اللغة الافتراضية', 'settings'),
  ('settings.default_language.description', 'ar', 'لغة النظام الافتراضية', 'settings'),
  ('settings.session_timeout_minutes.label', 'ar', 'انتهاء صلاحية الجلسة (دقائق)', 'settings'),
  ('settings.session_timeout_minutes.description', 'ar', 'مدة انتهاء صلاحية الجلسة بالدقائق', 'settings'),
  
  -- General settings - English
  ('settings.max_items_per_user.label', 'en', 'Max Items Per User', 'settings'),
  ('settings.max_items_per_user.description', 'en', 'Maximum number of items a user can create across all systems', 'settings'),
  ('settings.items_per_page.label', 'en', 'Items Per Page', 'settings'),
  ('settings.items_per_page.description', 'en', 'Number of items displayed per page', 'settings'),
  ('settings.enable_collaboration.label', 'en', 'Enable Collaboration', 'settings'),
  ('settings.enable_collaboration.description', 'en', 'Enable collaboration and sharing features across all systems', 'settings'),
  ('settings.enable_notifications.label', 'en', 'Enable Notifications', 'settings'),
  ('settings.enable_notifications.description', 'en', 'Enable notifications across all systems', 'settings'),
  ('settings.enable_analytics.label', 'en', 'Enable Analytics', 'settings'),
  ('settings.enable_analytics.description', 'en', 'Enable analytics tracking across all systems', 'settings'),
  ('settings.default_status.label', 'en', 'Default Status', 'settings'),
  ('settings.default_status.description', 'en', 'Default status for new items', 'settings'),
  ('settings.default_priority.label', 'en', 'Default Priority', 'settings'),
  ('settings.default_priority.description', 'en', 'Default priority level', 'settings'),
  ('settings.max_budget_limit.label', 'en', 'Max Budget Limit', 'settings'),
  ('settings.max_budget_limit.description', 'en', 'Maximum budget limit across all systems', 'settings'),
  ('settings.default_language.label', 'en', 'Default Language', 'settings'),
  ('settings.default_language.description', 'en', 'Default system language', 'settings'),
  ('settings.session_timeout_minutes.label', 'en', 'Session Timeout (minutes)', 'settings'),
  ('settings.session_timeout_minutes.description', 'en', 'Session timeout duration in minutes', 'settings'),
  
  -- Array settings labels - Arabic
  ('settings.challenge_types.label', 'ar', 'أنواع التحديات', 'settings'),
  ('settings.challenge_types.description', 'ar', 'قائمة بأنواع التحديات المتاحة', 'settings'),
  ('settings.idea_types.label', 'ar', 'أنواع الأفكار', 'settings'),
  ('settings.idea_types.description', 'ar', 'قائمة بأنواع الأفكار المتاحة', 'settings'),
  ('settings.event_types.label', 'ar', 'أنواع الفعاليات', 'settings'),
  ('settings.event_types.description', 'ar', 'قائمة بأنواع الفعاليات المتاحة', 'settings'),
  ('settings.partner_types.label', 'ar', 'أنواع الشركاء', 'settings'),
  ('settings.partner_types.description', 'ar', 'قائمة بأنواع الشركاء المتاحة', 'settings'),
  
  -- Array settings labels - English
  ('settings.challenge_types.label', 'en', 'Challenge Types', 'settings'),
  ('settings.challenge_types.description', 'en', 'List of available challenge types', 'settings'),
  ('settings.idea_types.label', 'en', 'Idea Types', 'settings'),
  ('settings.idea_types.description', 'en', 'List of available idea types', 'settings'),
  ('settings.event_types.label', 'en', 'Event Types', 'settings'),
  ('settings.event_types.description', 'en', 'List of available event types', 'settings'),
  ('settings.partner_types.label', 'en', 'Partner Types', 'settings'),
  ('settings.partner_types.description', 'en', 'List of available partner types', 'settings'),
  
  -- Shared settings info - Arabic
  ('settings.shared_setting', 'ar', 'إعداد مشترك', 'settings'),
  ('settings.affects_systems', 'ar', 'يؤثر على الأنظمة', 'settings'),
  ('settings.unified_setting', 'ar', 'إعداد موحد', 'settings'),
  ('settings.shared_across_systems', 'ar', 'مشترك عبر الأنظمة', 'settings'),
  
  -- Shared settings info - English  
  ('settings.shared_setting', 'en', 'Shared Setting', 'settings'),
  ('settings.affects_systems', 'en', 'Affects Systems', 'settings'),
  ('settings.unified_setting', 'en', 'Unified Setting', 'settings'),
  ('settings.shared_across_systems', 'en', 'Shared Across Systems', 'settings'),
  
  -- Action labels - Arabic
  ('settings.save_setting', 'ar', 'حفظ الإعداد', 'settings'),
  ('settings.delete_setting', 'ar', 'حذف الإعداد', 'settings'),
  ('settings.add_item', 'ar', 'إضافة عنصر', 'settings'),
  ('settings.remove_item', 'ar', 'إزالة عنصر', 'settings'),
  
  -- Action labels - English
  ('settings.save_setting', 'en', 'Save Setting', 'settings'),
  ('settings.delete_setting', 'en', 'Delete Setting', 'settings'),
  ('settings.add_item', 'en', 'Add Item', 'settings'),
  ('settings.remove_item', 'en', 'Remove Item', 'settings')

ON CONFLICT (translation_key, language_code) DO UPDATE SET
  translation_text = EXCLUDED.translation_text;