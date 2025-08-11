-- Add final missing translation keys from console logs
INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.stakeholder_interest_levels.label', 'Stakeholder Interest Levels', 'مستويات اهتمام أصحاب المصلحة', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.stakeholder_interest_levels.label');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.stakeholder_interest_levels.description', 'Levels to classify stakeholder interest and engagement', 'مستويات لتصنيف اهتمام ومشاركة أصحاب المصلحة', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.stakeholder_interest_levels.description');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.supported_languages.label', 'Supported Languages', 'اللغات المدعومة', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.supported_languages.label');