-- Add missing navigation translation keys
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- Navigation items
('nav.partnership_opportunities', 'Partnership Opportunities', 'فرص الشراكة', 'navigation'),
('nav.smart_search', 'Smart Search', 'البحث الذكي', 'navigation')

ON CONFLICT (translation_key) DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();