-- Add missing notification translations
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('notifications.title', 'Notifications', 'الإشعارات', 'ui'),
('notifications.mark_all_read', 'Mark all read', 'تحديد الكل كمقروء', 'ui'),
('notifications.no_notifications', 'No notifications', 'لا توجد إشعارات', 'ui'),
('notifications.new_notification', 'New notification', 'إشعار جديد', 'ui')
ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category;