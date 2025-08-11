-- Add missing translation key for direction toggle
INSERT INTO system_translations (translation_key, text_en, text_ar, category, created_at, updated_at) VALUES
('header.toggle_direction', 'Toggle Text Direction', 'تبديل اتجاه النص', 'header', now(), now())

ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = now();