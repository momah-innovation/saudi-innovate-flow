-- Insert missing section header and system translation keys
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- Section headers used in sidebar groups
('Main Navigation', 'Main Navigation', 'التنقل الرئيسي', 'navigation'),
('Innovation Hub', 'Innovation Hub', 'مركز الابتكار', 'navigation'), 
('Administration', 'Administration', 'الإدارة', 'navigation'),
('System', 'System', 'النظام', 'navigation'),
('Help & Support', 'Help & Support', 'المساعدة والدعم', 'navigation'),

-- System UI keys
('system_title', 'Innovation System', 'نظام الابتكار', 'ui'),
('search_placeholder', 'Search...', 'بحث...', 'ui')

-- Only insert if they don't already exist
ON CONFLICT (translation_key) DO NOTHING;