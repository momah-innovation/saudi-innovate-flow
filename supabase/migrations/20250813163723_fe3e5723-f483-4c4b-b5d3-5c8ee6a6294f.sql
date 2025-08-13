-- Add all navigation menu item translations
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('nav.dashboard', 'Dashboard', 'لوحة التحكم', 'navigation'),
('nav.challenges', 'Challenges', 'التحديات', 'navigation'),
('nav.opportunities', 'Opportunities', 'الفرص', 'navigation'),
('nav.campaigns', 'Campaigns', 'الحملات', 'navigation'),
('nav.ideas', 'My Ideas', 'أفكاري', 'navigation'),
('nav.bookmarks', 'Bookmarks', 'المرجعيات', 'navigation'),
('nav.profile', 'Profile', 'الملف الشخصي', 'navigation'),
('nav.teams', 'Teams', 'الفرق', 'navigation'),
('nav.projects', 'Projects', 'المشاريع', 'navigation'),
('nav.analytics', 'Analytics', 'التحليلات', 'navigation'),
('nav.admin', 'Admin Dashboard', 'لوحة الإدارة', 'navigation'),
('nav.settings', 'Settings', 'الإعدادات', 'navigation'),
('nav.help', 'Help', 'المساعدة', 'navigation')
ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category;