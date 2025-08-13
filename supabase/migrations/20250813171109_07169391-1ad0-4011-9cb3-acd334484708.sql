-- Add missing translations to system_translations table
INSERT INTO system_translations (key_name, translation_en, translation_ar, category, description) VALUES
('system_title', 'Ruwād Innovation Platform', 'منصة رُوّاد للابتكار', 'system', 'Main system title/name'),
('notifications.title', 'Notifications', 'الإشعارات', 'notifications', 'Notifications panel title'),
('notifications.mark_all_read', 'Mark all read', 'تحديد الكل كمقروء', 'notifications', 'Mark all notifications as read action')
ON CONFLICT (key_name) DO UPDATE SET
  translation_en = EXCLUDED.translation_en,
  translation_ar = EXCLUDED.translation_ar,
  category = EXCLUDED.category,
  description = EXCLUDED.description;