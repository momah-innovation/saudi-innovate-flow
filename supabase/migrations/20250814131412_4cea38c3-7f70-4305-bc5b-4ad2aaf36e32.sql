-- Add missing navigation and common translation keys
INSERT INTO system_translations (translation_key, text_en, text_ar, category, subcategory, is_active, created_at, updated_at) VALUES
-- Navigation groups
('nav.group.main_navigation', 'Main Navigation', 'التنقل الرئيسي', 'navigation', 'groups', true, now(), now()),
('nav.group.innovation_hub', 'Innovation Hub', 'مركز الابتكار', 'navigation', 'groups', true, now(), now()),
('nav.group.system', 'System', 'النظام', 'navigation', 'groups', true, now(), now()),
('nav.group.help__support', 'Help & Support', 'المساعدة والدعم', 'navigation', 'groups', true, now(), now()),

-- Common elements
('common.search_placeholder', 'Search...', 'البحث...', 'common', 'ui', true, now(), now()),
('system.title', 'Innovation System', 'نظام الابتكار', 'system', 'general', true, now(), now()),

-- Additional navigation groups that might be missing
('nav.group.challenges', 'Challenges', 'التحديات', 'navigation', 'groups', true, now(), now()),
('nav.group.ideas', 'Ideas', 'الأفكار', 'navigation', 'groups', true, now(), now()),
('nav.group.opportunities', 'Opportunities', 'الفرص', 'navigation', 'groups', true, now(), now()),
('nav.group.events', 'Events', 'الفعاليات', 'navigation', 'groups', true, now(), now()),
('nav.group.analytics', 'Analytics', 'التحليلات', 'navigation', 'groups', true, now(), now()),
('nav.group.admin', 'Administration', 'الإدارة', 'navigation', 'groups', true, now(), now()),

-- Translation system status
('translation.system.title', 'Translation System Status', 'حالة نظام الترجمة', 'translation', 'system', true, now(), now()),
('translation.system.description', 'Monitor and manage the translation system', 'مراقبة وإدارة نظام الترجمة', 'translation', 'system', true, now(), now()),
('translation.status.ready', 'Translation system ready', 'نظام الترجمة جاهز', 'translation', 'status', true, now(), now()),
('translation.status.initializing', 'Initializing...', 'جاري التهيئة...', 'translation', 'status', true, now(), now())

ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  updated_at = now();