-- Add missing translation keys for opportunities and ui categories
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('settings.category.opportunities', 'Opportunities', 'الفرص', 'system_settings'),
('settings.category.ui', 'User Interface', 'واجهة المستخدم', 'system_settings')
ON CONFLICT (translation_key) 
DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();