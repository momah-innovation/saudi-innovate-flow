-- Add translation keys for UnifiedHeader and NavigationSidebar components
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- Header component translations
('system_title', 'Ruwād Innovation System', 'نظام رواد للابتكار', 'system'),
('search_placeholder', 'Search...', 'البحث...', 'ui'),
('header.open_navigation', 'Open Navigation', 'فتح القائمة', 'ui'),
('header.switch_language', 'Switch Language', 'تبديل اللغة', 'ui'),
('header.toggle_theme', 'Toggle Theme', 'تبديل النمط', 'ui'),
('header.admin_badge', 'Admin', 'إدارة', 'ui'),

-- Navigation component translations
('nav.dashboard', 'Dashboard', 'لوحة التحكم', 'navigation'),
('nav.browse_challenges', 'Browse Challenges', 'استكشاف التحديات', 'navigation'),
('nav.browse_events', 'Browse Events', 'استكشاف الفعاليات', 'navigation'),
('nav.partnership_opportunities', 'Partnership Opportunities', 'فرص الشراكة', 'navigation'),
('nav.smart_search', 'Smart Search', 'البحث الذكي', 'navigation'),
('nav.navigation_menu', 'Navigation Menu', 'القائمة الرئيسية', 'navigation'),

-- Navigation groups
('nav.group.dashboard', 'Dashboard', 'لوحة التحكم', 'navigation'),
('nav.group.discover', 'Discover', 'استكشاف', 'navigation'),
('nav.group.personal', 'Personal', 'شخصي', 'navigation'),
('nav.group.workflow', 'Workflow', 'سير العمل', 'navigation'),
('nav.group.workspaces', 'Workspaces', 'مساحات العمل', 'navigation'),
('nav.group.subscription_ai', 'Subscription & AI', 'الاشتراك والذكاء الاصطناعي', 'navigation'),
('nav.group.analytics_reports', 'Analytics & Reports', 'التحليلات والتقارير', 'navigation'),
('nav.group.administration', 'Administration', 'الإدارة العامة', 'navigation'),
('nav.group.system_management', 'System Management', 'إدارة النظام', 'navigation'),
('nav.group.settings_help', 'Settings & Help', 'الإعدادات والمساعدة', 'navigation');