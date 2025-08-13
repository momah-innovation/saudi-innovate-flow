-- Add missing translations to system_translations table
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('system_title', 'Ruwād Innovation Platform', 'منصة رُوّاد للابتكار', 'system'),
('notifications.title', 'Notifications', 'الإشعارات', 'notifications'),
('notifications.mark_all_read', 'Mark all read', 'تحديد الكل كمقروء', 'notifications'),
('search_placeholder', 'Search...', 'بحث...', 'ui'),
('nav.navigation_menu', 'Navigation Menu', 'قائمة التنقل', 'navigation'),
('nav.dashboard', 'Dashboard', 'لوحة التحكم', 'navigation'),
('nav.challenges', 'Challenges', 'التحديات', 'navigation'),
('nav.ideas', 'Ideas', 'الأفكار', 'navigation'),
('nav.events', 'Events', 'الفعاليات', 'navigation'),
('nav.opportunities', 'Opportunities', 'الفرص', 'navigation'),
('nav.collaboration', 'Collaboration', 'التعاون', 'navigation'),
('nav.admin_dashboard', 'Admin Dashboard', 'لوحة التحكم الإدارية', 'navigation'),
('nav.settings', 'Settings', 'الإعدادات', 'navigation')
ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category;