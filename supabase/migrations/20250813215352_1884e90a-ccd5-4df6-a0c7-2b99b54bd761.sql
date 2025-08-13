-- Force translation cache refresh by updating a timestamp
UPDATE system_translations 
SET updated_at = NOW() 
WHERE translation_key IN (
  'Main Navigation', 
  'Innovation Hub', 
  'Administration', 
  'System', 
  'Help & Support', 
  'system_title', 
  'search_placeholder'
);