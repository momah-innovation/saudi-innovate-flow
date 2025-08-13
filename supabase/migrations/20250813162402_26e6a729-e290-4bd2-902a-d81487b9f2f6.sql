-- Add missing system title and remaining notification translations
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('system_title', 'Innovation Platform', 'منصة الابتكار', 'system'),
('notifications.no_new_notifications', 'No new notifications', 'لا توجد إشعارات جديدة', 'ui'),
('notifications.view_all', 'View all', 'عرض الكل', 'ui'),
('notifications.settings', 'Notification Settings', 'إعدادات الإشعارات', 'ui'),
('notifications.loading', 'Loading notifications...', 'جاري تحميل الإشعارات...', 'ui'),
('notifications.error', 'Failed to load notifications', 'فشل في تحميل الإشعارات', 'ui'),
('notifications.clear_all', 'Clear all', 'مسح الكل', 'ui'),
('system.name', 'Innovation Platform', 'منصة الابتكار', 'system'),
('system.tagline', 'Driving Innovation Forward', 'قيادة الابتكار إلى الأمام', 'system')
ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category;