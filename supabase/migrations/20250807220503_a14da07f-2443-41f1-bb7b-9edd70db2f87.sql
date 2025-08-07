-- Add remaining missing translation keys for system settings

INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- General settings labels and descriptions
('settings.available_themes.label', 'Available Themes', 'المواضيع المتاحة', 'settings'),
('settings.available_themes.description', 'Available themes for the user interface', 'المواضيع المتاحة لواجهة المستخدم', 'settings'),
('settings.currency_options.label', 'Currency Options', 'خيارات العملة', 'settings'),
('settings.currency_options.description', 'Available currency options for the system', 'خيارات العملة المتاحة للنظام', 'settings'),
('settings.date_range_options.label', 'Date Range Options', 'خيارات النطاق الزمني', 'settings'),
('settings.date_range_options.description', 'Available date range options for filters and reports', 'خيارات النطاق الزمني المتاحة للمرشحات والتقارير', 'settings'),
('settings.maintenance_mode.label', 'Maintenance Mode', 'وضع الصيانة', 'settings'),
('settings.system_description.label', 'System Description', 'وصف النظام', 'settings'),
('settings.system_name.label', 'System Name', 'اسم النظام', 'settings'),

-- Shared Settings section
('shared_settings', 'Shared Settings', 'الإعدادات المشتركة', 'settings'),
('shared_settings_description', 'Settings that are shared across multiple system components', 'الإعدادات المشتركة عبر مكونات النظام المتعددة', 'settings')

ON CONFLICT (translation_key) DO UPDATE SET
    text_en = EXCLUDED.text_en,
    text_ar = EXCLUDED.text_ar,
    updated_at = NOW();