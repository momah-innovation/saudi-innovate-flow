-- Fix translation keys: remove spaces and shorten long keys
-- This migration updates keys with spaces and keys longer than 50 characters

-- Create temporary mapping table for the fixes
CREATE TEMP TABLE key_mappings AS 
WITH fixes AS (
  -- Fix keys with spaces: replace spaces with underscores
  SELECT 
    translation_key as old_key,
    REPLACE(translation_key, ' ', '_') as new_key,
    'space_fix' as fix_type
  FROM system_translations 
  WHERE translation_key LIKE '% %'
  
  UNION ALL
  
  -- Fix long keys: shorten them while keeping meaning
  SELECT 
    translation_key as old_key,
    CASE 
      -- Settings descriptions - shorten by removing redundant words
      WHEN translation_key LIKE 'settings.%.description' AND LENGTH(translation_key) > 50 THEN
        REPLACE(
          REPLACE(
            REPLACE(translation_key, '.description', '.desc'),
            'notification_', 'notif_'
          ),
          'challenge_', 'ch_'
        )
      
      -- Workspace organization features - shorten path
      WHEN translation_key LIKE 'workspace.organization.features.%' THEN
        REPLACE(translation_key, 'workspace.organization.features.', 'workspace.org.feat.')
      
      -- Translation management - shorten prefix
      WHEN translation_key LIKE 'translation_management.%' THEN
        REPLACE(translation_key, 'translation_management.', 'trans_mgmt.')
      
      -- Team specializations - shorten prefix
      WHEN translation_key LIKE 'team_specializations.%' THEN
        REPLACE(translation_key, 'team_specializations.', 'team_spec.')
      
      -- Settings with multiple long parts - general shortening
      ELSE 
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(translation_key, 'settings.', 's.'),
              'notifications_', 'notif_'
            ),
            'challenge_', 'ch_'
          ),
          '_enabled', '_en'
        )
    END as new_key,
    'length_fix' as fix_type
  FROM system_translations 
  WHERE LENGTH(translation_key) > 50
)
SELECT DISTINCT old_key, new_key, fix_type 
FROM fixes 
WHERE new_key != old_key AND LENGTH(new_key) <= 50;

-- Show what will be changed (for logging)
DO $$
DECLARE
  mapping_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO mapping_count FROM key_mappings;
  RAISE NOTICE 'Will update % translation keys', mapping_count;
END $$;

-- Update the translations with new keys
INSERT INTO system_translations (translation_key, text_en, text_ar, category, created_at, updated_at)
SELECT 
  km.new_key,
  st.text_en,
  st.text_ar,
  st.category,
  st.created_at,
  NOW()
FROM key_mappings km
JOIN system_translations st ON km.old_key = st.translation_key
ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();

-- Remove the old keys
DELETE FROM system_translations 
WHERE translation_key IN (SELECT old_key FROM key_mappings);

-- Create a summary log of changes made
DO $$
DECLARE
  space_fixes INTEGER;
  length_fixes INTEGER;
  total_fixes INTEGER;
BEGIN
  SELECT 
    COUNT(*) FILTER (WHERE fix_type = 'space_fix'),
    COUNT(*) FILTER (WHERE fix_type = 'length_fix'),
    COUNT(*)
  INTO space_fixes, length_fixes, total_fixes
  FROM key_mappings;
  
  RAISE NOTICE 'Translation key cleanup completed:';
  RAISE NOTICE '- Fixed % keys with spaces', space_fixes;
  RAISE NOTICE '- Fixed % keys that were too long', length_fixes;
  RAISE NOTICE '- Total fixes: %', total_fixes;
END $$;