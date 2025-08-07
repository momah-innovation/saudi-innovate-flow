-- Add missing UI settings translation keys
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- UI Category
('settings.category.ui.description', 'User interface settings and customization options', 'إعدادات واجهة المستخدم وخيارات التخصيص', 'settings'),

-- UI Settings
('settings.enable_animations.label', 'Enable Animations', 'تفعيل الرسوم المتحركة', 'settings'),
('settings.enable_animations.description', 'Enable smooth animations and transitions in the UI', 'تفعيل الرسوم المتحركة والتحولات السلسة في واجهة المستخدم', 'settings'),

('settings.enable_dark_mode.label', 'Enable Dark Mode', 'تفعيل الوضع المظلم', 'settings'),
('settings.enable_dark_mode.description', 'Enable dark mode theme for the application', 'تفعيل سمة الوضع المظلم للتطبيق', 'settings'),

('settings.theme_border_radius_options.label', 'Theme Border Radius Options', 'خيارات تدوير حواف السمة', 'settings'),
('settings.theme_border_radius_options.description', 'Available border radius options for UI elements', 'خيارات تدوير الحواف المتاحة لعناصر واجهة المستخدم', 'settings'),

('settings.theme_color_schemes.label', 'Theme Color Schemes', 'أنظمة ألوان السمة', 'settings'),
('settings.theme_color_schemes.description', 'Available color schemes for the application theme', 'أنظمة الألوان المتاحة لسمة التطبيق', 'settings'),

('settings.theme_variants.label', 'Theme Variants', 'متغيرات السمة', 'settings'),
('settings.theme_variants.description', 'Available theme variants and styles', 'متغيرات السمة والأنماط المتاحة', 'settings'),

('settings.ui_sidebar_cookie_max_age_days.label', 'UI Sidebar Cookie Max Age Days', 'أيام انتهاء ملف تعريف الارتباط للشريط الجانبي', 'settings'),
('settings.ui_sidebar_cookie_max_age_days.description', 'Maximum age in days for UI sidebar preferences cookie', 'الحد الأقصى بالأيام لملف تعريف ارتباط تفضيلات الشريط الجانبي', 'settings')

ON CONFLICT (translation_key) 
DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();