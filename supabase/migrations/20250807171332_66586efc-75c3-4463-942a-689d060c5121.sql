-- Add missing settings translation keys for labels and descriptions
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- General Settings Category
('settings.category.general.description', 'General system configuration settings', 'إعدادات التكوين العامة للنظام', 'settings'),

-- Registration Settings
('settings.allow_public_registration.label', 'Allow Public Registration', 'السماح بالتسجيل العام', 'settings'),
('settings.allow_public_registration.description', 'Allow users to register without invitation', 'السماح للمستخدمين بالتسجيل بدون دعوة', 'settings'),

-- Archive Settings
('settings.auto_archive_after_days.label', 'Auto Archive After Days', 'الأرشفة التلقائية بعد الأيام', 'settings'),
('settings.auto_archive_after_days.description', 'Number of days before content is automatically archived', 'عدد الأيام قبل أرشفة المحتوى تلقائياً', 'settings'),

-- Language Settings
('settings.default_language.label', 'Default Language', 'اللغة الافتراضية', 'settings'),
('settings.default_language.description', 'Default system language', 'لغة النظام الافتراضية', 'settings'),

-- Priority Settings  
('settings.default_priority.label', 'Default Priority', 'الأولوية الافتراضية', 'settings'),
('settings.default_priority.description', 'Default priority level', 'مستوى الأولوية الافتراضي', 'settings'),

-- Status Settings
('settings.default_status.label', 'Default Status', 'الحالة الافتراضية', 'settings'),
('settings.default_status.description', 'Default status for new items', 'الحالة الافتراضية للعناصر الجديدة', 'settings'),

-- Analytics Settings
('settings.enable_analytics.label', 'Enable Analytics', 'تفعيل التحليلات', 'settings'),
('settings.enable_analytics.description', 'Enable analytics tracking across all systems', 'تفعيل تتبع التحليلات عبر جميع الأنظمة', 'settings'),

-- Collaboration Settings
('settings.enable_collaboration.label', 'Enable Collaboration', 'تفعيل التعاون', 'settings'),
('settings.enable_collaboration.description', 'Enable collaboration and sharing features across all systems', 'تفعيل ميزات التعاون والمشاركة عبر جميع الأنظمة', 'settings'),

-- Notifications Settings
('settings.enable_notifications.label', 'Enable Notifications', 'تفعيل الإشعارات', 'settings'),
('settings.enable_notifications.description', 'Enable notifications across all systems', 'تفعيل الإشعارات عبر جميع الأنظمة', 'settings'),

-- Engagement Levels
('settings.engagement_levels.label', 'Engagement Levels', 'مستويات المشاركة', 'settings'),
('settings.engagement_levels.description', 'Available engagement levels for content', 'مستويات المشاركة المتاحة للمحتوى', 'settings'),

-- Status Options
('settings.general_status_options.label', 'General Status Options', 'خيارات الحالة العامة', 'settings'),
('settings.general_status_options.description', 'Available status options across the system', 'خيارات الحالة المتاحة عبر النظام', 'settings'),

-- Pagination Settings
('settings.items_per_page.label', 'Items Per Page', 'عدد العناصر في الصفحة', 'settings'),
('settings.items_per_page.description', 'Number of items displayed per page', 'عدد العناصر المعروضة في كل صفحة', 'settings'),

-- Maintenance Mode
('settings.maintenance_mode.label', 'Maintenance Mode', 'وضع الصيانة', 'settings'),
('settings.maintenance_mode.description', 'Enable or disable maintenance mode', 'تفعيل أو تعطيل وضع الصيانة', 'settings'),

-- Budget Settings
('settings.max_budget_limit.label', 'Maximum Budget Limit', 'الحد الأقصى للميزانية', 'settings'),
('settings.max_budget_limit.description', 'Maximum budget limit across all systems', 'الحد الأقصى للميزانية عبر جميع الأنظمة', 'settings'),

-- File Upload Settings
('settings.max_file_upload_size.label', 'Maximum File Upload Size (MB)', 'الحد الأقصى لحجم الملف المرفوع (ميجابايت)', 'settings'),
('settings.max_file_upload_size.description', 'Maximum file size allowed for uploads in megabytes', 'الحد الأقصى لحجم الملف المسموح برفعه بالميجابايت', 'settings'),

-- User Limits
('settings.max_items_per_user.label', 'Maximum Items Per User', 'الحد الأقصى للعناصر لكل مستخدم', 'settings'),
('settings.max_items_per_user.description', 'Maximum number of items a user can create across all systems', 'الحد الأقصى لعدد العناصر التي يمكن للمستخدم إنشاؤها عبر جميع الأنظمة', 'settings'),

-- System Info
('settings.system_description.label', 'System Description', 'وصف النظام', 'settings'),
('settings.system_description.description', 'Description of the system', 'وصف النظام', 'settings'),

('settings.system_language.label', 'System Language', 'لغة النظام', 'settings'),
('settings.system_language.description', 'Primary system language', 'لغة النظام الأساسية', 'settings'),

('settings.system_name.label', 'System Name', 'اسم النظام', 'settings'),
('settings.system_name.description', 'Name of the system', 'اسم النظام', 'settings'),

-- UI Language Options
('settings.ui_language_options.label', 'UI Language Options', 'خيارات لغة واجهة المستخدم', 'settings'),
('settings.ui_language_options.description', 'Available language options for the user interface', 'خيارات اللغة المتاحة لواجهة المستخدم', 'settings')

-- Handle conflicts by updating existing records
ON CONFLICT (translation_key) 
DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();