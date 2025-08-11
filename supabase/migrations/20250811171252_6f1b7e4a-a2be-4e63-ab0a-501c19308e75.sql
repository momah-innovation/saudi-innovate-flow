-- Add missing UI translation keys from LandingNavigation
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- Basic UI elements
('dashboard', 'Dashboard', 'لوحة التحكم', 'ui'),
('welcome', 'Welcome', 'مرحباً', 'ui'),
('login', 'Login', 'تسجيل الدخول', 'auth'),
('signup', 'Get Started', 'البدء', 'auth')

ON CONFLICT (translation_key) DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();