-- Add missing navigation translation keys
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- Navigation Groups
('nav.group.dashboard', 'Dashboard', 'لوحة التحكم', 'navigation'),
('nav.group.discover', 'Discover', 'استكشاف', 'navigation'),
('nav.group.personal', 'Personal', 'شخصي', 'navigation'),
('nav.group.workflow', 'Workflow', 'سير العمل', 'navigation'),
('nav.group.workspaces', 'Workspaces', 'مساحات العمل', 'navigation'),
('nav.group.subscription_ai', 'Subscription & AI', 'الاشتراك والذكاء الاصطناعي', 'navigation'),
('nav.group.analytics_reports', 'Analytics & Reports', 'التحليلات والتقارير', 'navigation'),
('nav.group.administration', 'Administration', 'الإدارة العامة', 'navigation'),
('nav.group.system_management', 'System Management', 'إدارة النظام', 'navigation'),
('nav.group.settings_help', 'Settings & Help', 'الإعدادات والمساعدة', 'navigation'),

-- Navigation UI
('nav.navigation_menu', 'Navigation Menu', 'قائمة التنقل', 'navigation'),
('header.open_navigation', 'Open Navigation', 'فتح التنقل', 'navigation'),

-- Common navigation actions
('nav.menu', 'Menu', 'القائمة', 'navigation'),
('nav.close', 'Close', 'إغلاق', 'navigation'),
('nav.expand', 'Expand', 'توسيع', 'navigation'),
('nav.collapse', 'Collapse', 'طي', 'navigation'),
('nav.home', 'Home', 'الرئيسية', 'navigation'),
('nav.back', 'Back', 'العودة', 'navigation')

ON CONFLICT (translation_key) DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();