-- Add missing translation keys for TranslationSystemStatus and other components
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- Translation system info
('translation.system.info.unified', 'Using unified translation system with database-first loading', 'استخدام نظام ترجمة موحد مع تحميل قاعدة البيانات أولاً', 'translations'),
('translation.system.info.fallback', 'Automatic fallback to static translations when database is unavailable', 'العودة التلقائية للترجمات الثابتة عند عدم توفر قاعدة البيانات', 'translations'),
('translation.system.info.cache', 'Intelligent caching with 10-minute expiry and error recovery', 'ذاكرة تخزين مؤقت ذكية مع انتهاء صلاحية 10 دقائق واستعادة الأخطاء', 'translations'),

-- Header translations
('header.open_navigation', 'Open Navigation', 'فتح التنقل', 'navigation'),
('header.switch_language', 'Switch Language', 'تبديل اللغة', 'navigation'),
('header.toggle_theme', 'Toggle Theme', 'تبديل السمة', 'navigation'),
('header.admin_badge', 'Admin', 'مشرف', 'navigation'),

-- Profile related
('it_department', 'IT Department', 'قسم تقنية المعلومات', 'profile'),
('it_manager', 'IT Manager', 'مدير تقنية المعلومات', 'profile')

ON CONFLICT (translation_key) DO NOTHING;