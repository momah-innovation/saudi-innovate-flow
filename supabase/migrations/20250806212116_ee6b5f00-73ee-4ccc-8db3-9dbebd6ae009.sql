-- Clean up corrupted translation keys that end with numeric indices (character arrays)
-- These keys like 'security.0', 'security.1', etc. are causing character array problems

-- First, let's see what we're dealing with
-- DELETE FROM system_translations WHERE translation_key ~ '\.\d+$';

-- More specific cleanup - remove translation keys that end with a dot followed by digits
DELETE FROM system_translations 
WHERE translation_key SIMILAR TO '%\.[0-9]+$';

-- Log this cleanup action
INSERT INTO cleanup_logs (
  cleanup_type,
  details
) VALUES (
  'translation_keys_cleanup',
  jsonb_build_object(
    'action', 'removed_character_array_translation_keys',
    'pattern', 'keys ending with dot and digits (e.g., security.0, security.1)',
    'cleaned_at', NOW()
  )
);