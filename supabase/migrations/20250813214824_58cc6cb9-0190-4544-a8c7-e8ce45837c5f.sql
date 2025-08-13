-- Insert missing navigation keys that are used in the sidebar but not in the database
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- Core navigation items that were missing exact keys
('nav.user_management', 'User Management', 'إدارة المستخدمين', 'navigation'),
('nav.content_management', 'Content Management', 'إدارة المحتوى', 'navigation'),
('nav.security', 'Security', 'الأمان', 'navigation'),
('nav.database', 'Database', 'قاعدة البيانات', 'navigation'),
('nav.notifications', 'Notifications', 'الإشعارات', 'navigation'),
('nav.workspace', 'Workspace', 'مساحة العمل', 'navigation'),

-- UI elements used in the sidebar
('no_results_found', 'No results found', 'لا توجد نتائج', 'ui'),
('welcome', 'Welcome', 'مرحباً', 'ui'),

-- System status text
('online', 'Online', 'متصل', 'system'),
('offline', 'Offline', 'غير متصل', 'system')

-- Only insert if they don't already exist
ON CONFLICT (translation_key) DO NOTHING;