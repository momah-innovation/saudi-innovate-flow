-- Add missing UI translation keys for common hardcoded strings
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- Common UI actions that might be hardcoded
('ui.more', 'More', 'المزيد', 'ui'),
('ui.loading_data', 'Loading...', 'جاري التحميل...', 'ui'),
('ui.no_data_available', 'No data available', 'لا توجد بيانات متاحة', 'ui'),
('ui.try_again', 'Try again', 'حاول مرة أخرى', 'ui'),
('ui.refresh_page', 'Refresh page', 'تحديث الصفحة', 'ui'),
('breadcrumb.navigation', 'Breadcrumb navigation', 'التنقل بين الصفحات', 'navigation'),
('system.switch_language', 'Switch Language', 'تغيير اللغة', 'system'),
('system.system_health', 'System Health', 'صحة النظام', 'system'),
('error.something_went_wrong', 'Something went wrong', 'حدث خطأ ما', 'error'),
('error.failed_to_load', 'Failed to load', 'فشل في التحميل', 'error'),
('placeholder.select_image', 'Select Image', 'اختيار صورة', 'placeholder'),
('chart.placeholder_title', 'Chart Placeholder', 'مخطط بياني', 'ui'),
('form.example_management', 'Example Management', 'إدارة الأمثلة', 'form')
ON CONFLICT (translation_key) DO NOTHING;