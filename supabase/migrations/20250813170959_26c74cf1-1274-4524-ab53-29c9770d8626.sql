-- Add missing translation keys for system functionality
INSERT INTO translation_keys (key_name, category, description) VALUES
('system_title', 'system', 'Main system title/name'),
('notifications.title', 'notifications', 'Notifications panel title'),
('notifications.mark_all_read', 'notifications', 'Mark all notifications as read action');

-- Add translations for the missing keys
INSERT INTO translations (language_code, key_name, translation_text) VALUES
-- System title
('en', 'system_title', 'Ruwād Innovation Platform'),
('ar', 'system_title', 'منصة رُوّاد للابتكار'),

-- Notifications
('en', 'notifications.title', 'Notifications'),
('ar', 'notifications.title', 'الإشعارات'),
('en', 'notifications.mark_all_read', 'Mark all read'),
('ar', 'notifications.mark_all_read', 'تحديد الكل كمقروء');