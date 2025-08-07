-- Add remaining hardcoded arrays to database settings

-- Currency codes for OpportunityWizard  
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('currency_codes', '["SAR", "USD", "EUR"]', 'financial', 'array')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- Chart colors for analytics
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES
('chart_colors', '["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]', 'ui_theme', 'array'),
('idea_colors', '["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1"]', 'ui_theme', 'array')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- File size units
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type) VALUES  
('file_size_units', '["Bytes", "KB", "MB", "GB", "TB"]', 'storage', 'array')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- Add translations for new settings
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('settings.currency_codes.label', 'Currency Codes', 'رموز العملات', 'settings'),
('settings.currency_codes.description', 'Available currency codes for opportunities and projects', 'رموز العملات المتاحة للفرص والمشاريع', 'settings'),
('settings.chart_colors.label', 'Chart Colors', 'ألوان الرسوم البيانية', 'settings'),
('settings.chart_colors.description', 'Color palette used in charts and analytics', 'لوحة الألوان المستخدمة في الرسوم البيانية والتحليلات', 'settings'),
('settings.idea_colors.label', 'Idea Colors', 'ألوان الأفكار', 'settings'),
('settings.idea_colors.description', 'Color palette used for idea visualization', 'لوحة الألوان المستخدمة لتصور الأفكار', 'settings'),
('settings.file_size_units.label', 'File Size Units', 'وحدات حجم الملف', 'settings'),
('settings.file_size_units.description', 'Units used for displaying file sizes', 'الوحدات المستخدمة لعرض أحجام الملفات', 'settings');

-- Currency translations
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('currency.sar', 'Saudi Riyal', 'الريال السعودي', 'currency'),
('currency.usd', 'US Dollar', 'الدولار الأمريكي', 'currency'),
('currency.eur', 'Euro', 'اليورو', 'currency');

-- File size unit translations  
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('storage.bytes', 'Bytes', 'بايت', 'storage'),
('storage.kb', 'KB', 'كيلوبايت', 'storage'),
('storage.mb', 'MB', 'ميجابايت', 'storage'),
('storage.gb', 'GB', 'جيجابايت', 'storage'), 
('storage.tb', 'TB', 'تيرابايت', 'storage');