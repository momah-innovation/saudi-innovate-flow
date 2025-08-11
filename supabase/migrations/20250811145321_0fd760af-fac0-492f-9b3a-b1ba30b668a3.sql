-- Add the specific missing translation keys found in console logs
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('settings.supported_languages.description', 'Configure the languages available in the system', 'تكوين اللغات المتاحة في النظام', 'settings'),
('settings.system_org_max_hierarchy_levels.label', 'Maximum Organization Hierarchy Levels', 'الحد الأقصى لمستويات التسلسل الهرمي للمؤسسة', 'settings'),
('settings.system_org_max_hierarchy_levels.description', 'Maximum number of levels in organizational hierarchy', 'الحد الأقصى لعدد المستويات في التسلسل الهرمي للمؤسسة', 'settings');