-- Add specializations setting
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('specializations', '["تقنية المعلومات", "الذكاء الاصطناعي", "البيانات والتحليلات", "الأمن السيبراني", "التحول الرقمي", "إدارة المشاريع", "التطوير المؤسسي", "الخدمات الحكومية", "الابتكار والإبداع", "القيادة والإدارة"]', 'array_lists', 'array')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- Add translations for specializations setting
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('settings.specializations.label', 'Specializations', 'التخصصات', 'settings'),
('settings.specializations.description', 'Areas of expertise and professional specializations', 'مجالات الخبرة والتخصصات المهنية', 'settings');

-- Add individual specialization translations
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('specializations.it', 'Information Technology', 'تقنية المعلومات', 'specializations'),
('specializations.ai', 'Artificial Intelligence', 'الذكاء الاصطناعي', 'specializations'),
('specializations.data', 'Data and Analytics', 'البيانات والتحليلات', 'specializations'),
('specializations.cybersecurity', 'Cybersecurity', 'الأمن السيبراني', 'specializations'),
('specializations.digital_transformation', 'Digital Transformation', 'التحول الرقمي', 'specializations'),
('specializations.project_management', 'Project Management', 'إدارة المشاريع', 'specializations'),
('specializations.institutional_development', 'Institutional Development', 'التطوير المؤسسي', 'specializations'),
('specializations.government_services', 'Government Services', 'الخدمات الحكومية', 'specializations'),
('specializations.innovation', 'Innovation and Creativity', 'الابتكار والإبداع', 'specializations'),
('specializations.leadership', 'Leadership and Management', 'القيادة والإدارة', 'specializations');