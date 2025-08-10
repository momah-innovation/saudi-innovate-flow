-- Insert comprehensive translation keys for the application

-- Navigation translations
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('navigation.home', 'Home', 'الرئيسية', 'navigation'),
('navigation.challenges', 'Challenges', 'التحديات', 'navigation'),
('navigation.ideas', 'Ideas', 'الأفكار', 'navigation'),
('navigation.events', 'Events', 'الفعاليات', 'navigation'),
('navigation.opportunities', 'Opportunities', 'الفرص', 'navigation'),
('navigation.dashboard', 'Dashboard', 'لوحة التحكم', 'navigation'),
('navigation.workspace', 'Workspace', 'مساحة العمل', 'navigation'),
('navigation.profile', 'Profile', 'الملف الشخصي', 'navigation'),
('navigation.settings', 'Settings', 'الإعدادات', 'navigation')
ON CONFLICT (translation_key) DO NOTHING;