-- Add missing navigation and common translation keys
INSERT INTO system_translations (translation_key, text_en, text_ar, category, created_at, updated_at) VALUES
-- Navigation groups
('nav.group.main_navigation', 'Main Navigation', 'التنقل الرئيسي', 'navigation', now(), now()),
('nav.group.innovation_hub', 'Innovation Hub', 'مركز الابتكار', 'navigation', now(), now()),
('nav.group.system', 'System', 'النظام', 'navigation', now(), now()),
('nav.group.help__support', 'Help & Support', 'المساعدة والدعم', 'navigation', now(), now()),

-- Common elements
('common.search_placeholder', 'Search...', 'البحث...', 'common', now(), now()),
('system.title', 'Innovation System', 'نظام الابتكار', 'system', now(), now()),

-- Additional navigation groups that might be missing
('nav.group.challenges', 'Challenges', 'التحديات', 'navigation', now(), now()),
('nav.group.ideas', 'Ideas', 'الأفكار', 'navigation', now(), now()),
('nav.group.opportunities', 'Opportunities', 'الفرص', 'navigation', now(), now()),
('nav.group.events', 'Events', 'الفعاليات', 'navigation', now(), now()),
('nav.group.analytics', 'Analytics', 'التحليلات', 'navigation', now(), now()),
('nav.group.admin', 'Administration', 'الإدارة', 'navigation', now(), now()),

-- Translation system status
('translation.system.title', 'Translation System Status', 'حالة نظام الترجمة', 'translation', now(), now()),
('translation.system.description', 'Monitor and manage the translation system', 'مراقبة وإدارة نظام الترجمة', 'translation', now(), now()),
('translation.status.ready', 'Translation system ready', 'نظام الترجمة جاهز', 'translation', now(), now()),
('translation.status.initializing', 'Initializing...', 'جاري التهيئة...', 'translation', now(), now())

ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  updated_at = now();