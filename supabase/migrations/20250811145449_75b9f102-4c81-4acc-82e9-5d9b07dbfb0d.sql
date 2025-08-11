-- Add comprehensive settings translation keys to prevent missing key issues
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- System core settings
('settings.system_name.label', 'System Name', 'اسم النظام', 'settings'),
('settings.system_name.description', 'Display name for the system', 'الاسم المعروض للنظام', 'settings'),
('settings.system_description.label', 'System Description', 'وصف النظام', 'settings'),
('settings.system_description.description', 'Brief description of the system', 'وصف موجز للنظام', 'settings'),
('settings.system_timezone.label', 'System Timezone', 'المنطقة الزمنية للنظام', 'settings'),
('settings.system_timezone.description', 'Default timezone for the system', 'المنطقة الزمنية الافتراضية للنظام', 'settings'),
('settings.system_currency.label', 'System Currency', 'عملة النظام', 'settings'),
('settings.system_currency.description', 'Default currency for financial calculations', 'العملة الافتراضية للحسابات المالية', 'settings'),
('settings.system_date_format.label', 'Date Format', 'تنسيق التاريخ', 'settings'),
('settings.system_date_format.description', 'Default date display format', 'تنسيق عرض التاريخ الافتراضي', 'settings'),
('settings.system_time_format.label', 'Time Format', 'تنسيق الوقت', 'settings'),
('settings.system_time_format.description', 'Default time display format', 'تنسيق عرض الوقت الافتراضي', 'settings'),

-- Pagination settings
('settings.system_default_page_size.label', 'Default Page Size', 'حجم الصفحة الافتراضي', 'settings'),
('settings.system_default_page_size.description', 'Default number of items per page', 'العدد الافتراضي للعناصر في كل صفحة', 'settings'),
('settings.system_max_page_size.label', 'Maximum Page Size', 'الحد الأقصى لحجم الصفحة', 'settings'),
('settings.system_max_page_size.description', 'Maximum allowed items per page', 'الحد الأقصى المسموح للعناصر في كل صفحة', 'settings'),

-- File upload settings
('settings.system_max_file_size.label', 'Maximum File Size', 'الحد الأقصى لحجم الملف', 'settings'),
('settings.system_max_file_size.description', 'Maximum allowed file size for uploads', 'الحد الأقصى المسموح لحجم الملفات المرفوعة', 'settings'),
('settings.system_allowed_file_types.label', 'Allowed File Types', 'أنواع الملفات المسموحة', 'settings'),
('settings.system_allowed_file_types.description', 'List of allowed file extensions', 'قائمة امتدادات الملفات المسموحة', 'settings'),

-- Security settings
('settings.system_session_timeout.label', 'Session Timeout', 'انتهاء مهلة الجلسة', 'settings'),
('settings.system_session_timeout.description', 'Session timeout duration in minutes', 'مدة انتهاء الجلسة بالدقائق', 'settings'),
('settings.system_max_login_attempts.label', 'Maximum Login Attempts', 'الحد الأقصى لمحاولات تسجيل الدخول', 'settings'),
('settings.system_max_login_attempts.description', 'Maximum failed login attempts before lockout', 'الحد الأقصى لمحاولات تسجيل الدخول الفاشلة قبل الحظر', 'settings'),
('settings.system_password_min_length.label', 'Minimum Password Length', 'الحد الأدنى لطول كلمة المرور', 'settings'),
('settings.system_password_min_length.description', 'Minimum required password length', 'الحد الأدنى المطلوب لطول كلمة المرور', 'settings'),

-- Notification settings
('settings.system_email_notifications.label', 'Email Notifications', 'إشعارات البريد الإلكتروني', 'settings'),
('settings.system_email_notifications.description', 'Enable system email notifications', 'تفعيل إشعارات النظام بالبريد الإلكتروني', 'settings'),
('settings.system_sms_notifications.label', 'SMS Notifications', 'إشعارات الرسائل النصية', 'settings'),
('settings.system_sms_notifications.description', 'Enable system SMS notifications', 'تفعيل إشعارات النظام بالرسائل النصية', 'settings'),

-- Content limits
('settings.system_max_content_length.label', 'Maximum Content Length', 'الحد الأقصى لطول المحتوى', 'settings'),
('settings.system_max_content_length.description', 'Maximum allowed content length', 'الحد الأقصى المسموح لطول المحتوى', 'settings'),
('settings.system_max_attachments.label', 'Maximum Attachments', 'الحد الأقصى للمرفقات', 'settings'),
('settings.system_max_attachments.description', 'Maximum number of attachments per item', 'الحد الأقصى لعدد المرفقات لكل عنصر', 'settings')

ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = now();