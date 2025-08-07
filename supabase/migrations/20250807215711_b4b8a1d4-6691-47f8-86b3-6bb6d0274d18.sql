-- Insert missing translation keys for system settings
INSERT INTO public.system_translations (translation_key, text_en, text_ar, category) VALUES

-- General Settings
('settings.system_name.label', 'System Name', 'اسم النظام', 'settings'),
('settings.system_description.label', 'System Description', 'وصف النظام', 'settings'),
('settings.maintenance_mode.label', 'Maintenance Mode', 'وضع الصيانة', 'settings'),

-- Challenge Settings
('settings.max_challenges_per_user.label', 'Maximum Challenges per User', 'أقصى عدد تحديات لكل مستخدم', 'settings'),

-- Security Settings
('settings.session_timeout.label', 'Session Timeout', 'مهلة انتهاء الجلسة', 'settings'),

-- System Settings Page
('system_settings_page.challenges', 'Challenges', 'التحديات', 'settings'),
('system_settings_page.ideas', 'Ideas', 'الأفكار', 'settings'),
('system_settings_page.campaigns', 'Campaigns', 'الحملات', 'settings'),
('system_settings_page.partners', 'Partners', 'الشركاء', 'settings'),
('system_settings_page.opportunities', 'Opportunities', 'الفرص', 'settings'),
('system_settings_page.analytics', 'Analytics', 'التحليلات', 'settings'),
('system_settings_page.ai', 'AI', 'الذكاء الاصطناعي', 'settings'),
('system_settings_page.ui', 'UI', 'واجهة المستخدم', 'settings'),
('system_settings_page.performance', 'Performance', 'الأداء', 'settings'),
('system_settings_page.translation_management', 'Translation Management', 'إدارة الترجمات', 'settings'),
('system_settings_page.shared_settings', 'Shared Settings', 'الإعدادات المشتركة', 'settings'),
('system_settings_page.title', 'System Configuration', 'تكوين النظام', 'settings'),

-- Settings Categories
('settings.category.events', 'Events', 'الفعاليات', 'settings'),

-- Global List Settings
('settings.supported_languages', 'Supported Languages', 'اللغات المدعومة', 'settings'),
('settings.ui_themes', 'UI Themes', 'مظاهر واجهة المستخدم', 'settings'),
('settings.currency_codes', 'Currency Codes', 'رموز العملات', 'settings'),
('settings.time_zones', 'Time Zones', 'المناطق الزمنية', 'settings'),
('settings.frequency_options', 'Frequency Options', 'خيارات التكرار', 'settings'),
('settings.file_formats', 'File Formats', 'تنسيقات الملفات', 'settings'),
('settings.export_formats', 'Export Formats', 'تنسيقات التصدير', 'settings'),
('settings.sensitivity_levels', 'Sensitivity Levels', 'مستويات الحساسية', 'settings'),
('settings.priority_levels', 'Priority Levels', 'مستويات الأولوية', 'settings'),
('settings.color_schemes', 'Color Schemes', 'أنظمة الألوان', 'settings'),
('settings.font_sizes', 'Font Sizes', 'أحجام الخطوط', 'settings'),
('settings.notification_channels', 'Notification Channels', 'قنوات الإشعارات', 'settings'),
('settings.communication_methods', 'Communication Methods', 'طرق التواصل', 'settings'),
('settings.log_levels', 'Log Levels', 'مستويات السجلات', 'settings'),
('settings.backup_types', 'Backup Types', 'أنواع النسخ الاحتياطية', 'settings'),
('settings.status_types', 'Status Types', 'أنواع الحالات', 'settings'),
('settings.rating_scales', 'Rating Scales', 'مقاييس التقييم', 'settings'),

-- Unified Settings Manager
('settings.delete.confirm', 'Are you sure you want to delete this setting?', 'هل أنت متأكد من أنك تريد حذف هذا الإعداد؟', 'settings'),
('settings.modified', 'Modified', 'تم التعديل', 'settings'),
('settings.shared', 'Shared', 'مشترك', 'settings'),
('settings.affects', 'Affects', 'يؤثر على', 'settings'),
('settings.revert', 'Revert', 'استرجع', 'settings'),
('settings.save', 'Save', 'احفظ', 'settings'),
('settings.enabled', 'Enabled', 'مُفعّل', 'settings'),
('settings.array_editor', 'Array Editor', 'محرر المصفوفات', 'settings'),
('settings.close_editor', 'Close Editor', 'إغلاق المحرر', 'settings'),
('settings.open_editor', 'Open Editor', 'فتح المحرر', 'settings'),
('settings.items', 'items', 'عناصر', 'settings'),
('settings.object_editor', 'Object Editor', 'محرر الكائنات', 'settings'),
('settings.properties', 'properties', 'خصائص', 'settings'),
('settings.no_settings', 'No settings found matching the current filters', 'لم يتم العثور على إعدادات مطابقة للمرشحات الحالية', 'settings'),

-- Common settings
('all', 'All', 'الكل', 'common'),
('general', 'General', 'عام', 'common'),
('security', 'Security', 'الأمن', 'common'),
('systemSettings', 'System Settings', 'إعدادات النظام', 'common'),
('systemSettingsDescription', 'Manage and configure system-wide settings and preferences', 'إدارة وتكوين إعدادات النظام والتفضيلات', 'common'),
('accessDenied', 'Access Denied', 'الوصول مرفوض', 'common'),
('adminPermissionRequired', 'System administrator permissions required', 'يتطلب صلاحيات مدير النظام', 'common'),
('sharedSettingsDescription', 'Settings that are shared across multiple system components', 'الإعدادات التي تُشارك عبر مكونات النظام المتعددة', 'common'),

-- Time-related translations
('just_now', 'Just now', 'الآن', 'time'),
('minutes_ago', '{{count}} minute ago', 'منذ {{count}} دقيقة', 'time'),
('minutes_ago_plural', '{{count}} minutes ago', 'منذ {{count}} دقائق', 'time'),
('hours_ago', '{{count}} hour ago', 'منذ {{count}} ساعة', 'time'),
('hours_ago_plural', '{{count}} hours ago', 'منذ {{count}} ساعات', 'time'),
('days_ago', '{{count}} day ago', 'منذ {{count}} يوم', 'time'),
('days_ago_plural', '{{count}} days ago', 'منذ {{count}} أيام', 'time')

ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category;