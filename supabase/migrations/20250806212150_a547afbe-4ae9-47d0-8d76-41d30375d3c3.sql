-- Clean up corrupted translation keys that end with numeric indices (character arrays)
-- These keys like 'security.0', 'security.1', etc. are causing character array problems

DELETE FROM system_translations 
WHERE translation_key SIMILAR TO '%\.[0-9]+$';