-- Add missing UI translations for sidebar and other components
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('ui.sidebar.toggle_sidebar', 'Toggle sidebar', 'تبديل الشريط الجانبي', 'ui'),
('ui.sidebar.open_sidebar', 'Open sidebar', 'فتح الشريط الجانبي', 'ui'),
('ui.sidebar.close_sidebar', 'Close sidebar', 'إغلاق الشريط الجانبي', 'ui'),
('ui.sidebar.navigation', 'Navigation', 'التنقل', 'ui'),
('header.open_navigation', 'Open Navigation', 'فتح التنقل', 'ui'),
('header.close_navigation', 'Close Navigation', 'إغلاق التنقل', 'ui')
ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category;