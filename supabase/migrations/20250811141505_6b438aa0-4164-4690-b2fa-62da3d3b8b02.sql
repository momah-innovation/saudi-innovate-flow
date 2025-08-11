-- Add remaining missing translation keys from console logs
INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.sensitivity_levels.label', 'Sensitivity Levels', 'مستويات الحساسية', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.sensitivity_levels.label');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.sensitivity_levels.description', 'Configurable sensitivity levels for information classification', 'مستويات الحساسية القابلة للتكوين لتصنيف المعلومات', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.sensitivity_levels.description');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.stakeholder_influence_levels.label', 'Stakeholder Influence Levels', 'مستويات تأثير أصحاب المصلحة', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.stakeholder_influence_levels.label');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.stakeholder_influence_levels.description', 'Levels to measure stakeholder influence in decision making', 'مستويات لقياس تأثير أصحاب المصلحة في صنع القرار', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.stakeholder_influence_levels.description');