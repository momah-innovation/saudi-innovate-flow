-- Add missing tag-related translations
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES 
('tags.no_tags_found', 'No tags found', 'لم يتم العثور على علامات', 'ui'),
('tags.search_or_create', 'Search or create tags...', 'البحث أو إنشاء علامات...', 'ui'),
('tags.add_tag', 'Add tag', 'إضافة علامة', 'ui'),
('tags.remove_tag', 'Remove tag', 'إزالة علامة', 'ui'),
('tags.popular_tags', 'Popular tags', 'العلامات الشائعة', 'ui'),
('tags.recent_tags', 'Recent tags', 'العلامات الحديثة', 'ui')
ON CONFLICT (translation_key) DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  updated_at = now();