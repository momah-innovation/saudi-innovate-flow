-- Add remaining missing translation keys for settings
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('settings.system_idea_evaluation_scale_max.label', 'Maximum Evaluation Scale', 'أقصى مقياس تقييم', 'settings'),
('settings.system_idea_evaluation_scale_max.description', 'Maximum value for idea evaluation scale', 'القيمة القصوى لمقياس تقييم الأفكار', 'settings'),
('settings.system_idea_items_per_page.label', 'Ideas Per Page', 'الأفكار لكل صفحة', 'settings'),
('settings.system_idea_items_per_page.description', 'Number of ideas to display per page', 'عدد الأفكار المعروضة في كل صفحة', 'settings');