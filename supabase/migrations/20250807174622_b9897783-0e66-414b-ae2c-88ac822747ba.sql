-- Add missing SystemSettings page translation keys
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- System Settings Page
('systemSettings', 'System Settings', 'إعدادات النظام', 'system_settings'),
('systemSettingsDescription', 'Manage and configure system-wide settings and preferences', 'إدارة وتكوين إعدادات النظام والتفضيلات', 'system_settings'),
('system_settings_page.title', 'System Configuration', 'تكوين النظام', 'system_settings'),
('system_settings_page.shared_settings', 'Shared Settings', 'الإعدادات المشتركة', 'system_settings'),
('sharedSettingsDescription', 'Settings that are shared across multiple system components', 'الإعدادات المشتركة عبر مكونات النظام المتعددة', 'system_settings'),

-- Navigation and Categories
('all', 'All', 'الكل', 'system_settings'),
('general', 'General', 'عام', 'system_settings'),
('security', 'Security', 'الأمان', 'system_settings'),

-- System Settings Page Categories
('system_settings_page.challenges', 'Challenges', 'التحديات', 'system_settings'),
('system_settings_page.ideas', 'Ideas', 'الأفكار', 'system_settings'),
('system_settings_page.events', 'Events', 'الأحداث', 'system_settings'),
('system_settings_page.campaigns', 'Campaigns', 'الحملات', 'system_settings'),
('system_settings_page.partners', 'Partners', 'الشركاء', 'system_settings'),
('system_settings_page.opportunities', 'Opportunities', 'الفرص', 'system_settings'),
('system_settings_page.analytics', 'Analytics', 'التحليلات', 'system_settings'),
('system_settings_page.ai', 'Artificial Intelligence', 'الذكاء الاصطناعي', 'system_settings'),
('system_settings_page.ui', 'User Interface', 'واجهة المستخدم', 'system_settings'),
('system_settings_page.performance', 'Performance', 'الأداء', 'system_settings'),
('system_settings_page.translation_management', 'Translation Management', 'إدارة الترجمة', 'system_settings'),

-- Access Control
('accessDenied', 'Access Denied', 'تم رفض الوصول', 'system_settings'),
('adminPermissionRequired', 'System administrator permissions required', 'صلاحيات مدير النظام مطلوبة', 'system_settings')

ON CONFLICT (translation_key) 
DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();