-- Ensure critical navigation translation keys exist
-- These keys are frequently used and need to be immediately available

-- Insert or update the welcome key
INSERT INTO system_translations (translation_key, text_en, text_ar, category)
VALUES ('welcome', 'Welcome', 'مرحباً', 'common')
ON CONFLICT (translation_key) 
DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = now();

-- Insert or update the nav.dashboard key  
INSERT INTO system_translations (translation_key, text_en, text_ar, category)
VALUES ('nav.dashboard', 'Dashboard', 'لوحة التحكم', 'navigation')
ON CONFLICT (translation_key)
DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = now();

-- Add some other commonly used navigation keys to prevent future issues
INSERT INTO system_translations (translation_key, text_en, text_ar, category)
VALUES 
  ('nav.home', 'Home', 'الرئيسية', 'navigation'),
  ('nav.profile', 'Profile', 'الملف الشخصي', 'navigation'),
  ('nav.settings', 'Settings', 'الإعدادات', 'navigation'),
  ('common.loading', 'Loading...', 'جارٍ التحميل...', 'common'),
  ('common.error', 'Error', 'خطأ', 'common'),
  ('common.success', 'Success', 'نجح', 'common')
ON CONFLICT (translation_key)
DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = now();