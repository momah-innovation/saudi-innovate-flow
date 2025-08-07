-- Add missing Opportunities settings translation keys
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- Opportunities Category
('settings.category.opportunities.description', 'Settings for managing and configuring opportunities', 'إعدادات إدارة وتكوين الفرص', 'settings'),

-- Opportunities Settings
('settings.opportunity_status_options.label', 'Opportunity Status Options', 'خيارات حالة الفرص', 'settings'),
('settings.opportunity_status_options.description', 'Available status options for opportunities', 'خيارات الحالة المتاحة للفرص', 'settings'),

('settings.opportunity_types.label', 'Opportunity Types', 'أنواع الفرص', 'settings'),
('settings.opportunity_types.description', 'Available types of opportunities in the system', 'أنواع الفرص المتاحة في النظام', 'settings')

ON CONFLICT (translation_key) 
DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();