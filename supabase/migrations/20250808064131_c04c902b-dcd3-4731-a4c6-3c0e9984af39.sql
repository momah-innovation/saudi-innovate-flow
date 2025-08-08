-- Add missing translation keys for SystemSettings page
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('translations_refreshed', 'Translations Refreshed', 'تم تحديث الترجمات', 'ui'),
('translations_refreshed_description', 'Translation cache has been cleared and reloaded.', 'تم مسح ذاكرة التخزين المؤقت للترجمات وإعادة تحميلها.', 'ui'),
('refresh_failed', 'Refresh Failed', 'فشل التحديث', 'ui'),
('refresh_failed_description', 'Failed to refresh translations. Please try again.', 'فشل في تحديث الترجمات. يرجى المحاولة مرة أخرى.', 'ui'),
('refreshing', 'Refreshing...', 'جاري التحديث...', 'ui'),
('refresh_translations', 'Refresh Translations', 'تحديث الترجمات', 'ui')
ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = now();