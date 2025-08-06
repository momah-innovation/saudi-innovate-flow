-- Add comprehensive i18n entries for settings management
INSERT INTO system_translations (translation_key, language_code, translation_text, category) VALUES

-- Settings Management UI
('settings.save.success', 'ar', 'تم حفظ الإعدادات بنجاح', 'settings'),
('settings.save.success', 'en', 'Settings saved successfully', 'settings'),
('settings.save.success.description', 'ar', 'تم حفظ التغييرات الخاصة بك', 'settings'),
('settings.save.success.description', 'en', 'Your changes have been saved', 'settings'),
('settings.save.error', 'ar', 'خطأ في حفظ الإعدادات', 'settings'),
('settings.save.error', 'en', 'Error saving settings', 'settings'),
('settings.delete.success', 'ar', 'تم حذف الإعداد', 'settings'),
('settings.delete.success', 'en', 'Setting deleted', 'settings'),
('settings.delete.success.description', 'ar', 'تم إزالة الإعداد', 'settings'),
('settings.delete.success.description', 'en', 'The setting has been removed', 'settings'),
('settings.delete.error', 'ar', 'خطأ في حذف الإعداد', 'settings'),
('settings.delete.error', 'en', 'Error deleting setting', 'settings'),
('settings.delete.confirm', 'ar', 'هل أنت متأكد من حذف هذا الإعداد؟', 'settings'),
('settings.delete.confirm', 'en', 'Are you sure you want to delete this setting?', 'settings'),
('settings.bulk.success', 'ar', 'تم حفظ الإعدادات', 'settings'),
('settings.bulk.success', 'en', 'Settings saved', 'settings'),
('settings.bulk.success.description', 'ar', 'تم حفظ جميع التغييرات', 'settings'),
('settings.bulk.success.description', 'en', 'All changes have been saved', 'settings'),
('settings.bulk.error', 'ar', 'خطأ في حفظ الإعدادات', 'settings'),
('settings.bulk.error', 'en', 'Error saving settings', 'settings'),
('settings.shared', 'ar', 'مشترك', 'settings'),
('settings.shared', 'en', 'Shared', 'settings'),
('settings.affects', 'ar', 'يؤثر على', 'settings'),
('settings.affects', 'en', 'Affects', 'settings'),
('settings.enabled', 'ar', 'مفعل', 'settings'),
('settings.enabled', 'en', 'Enabled', 'settings'),
('settings.array.placeholder', 'ar', 'أدخل مصفوفة JSON...', 'settings'),
('settings.array.placeholder', 'en', 'Enter JSON array...', 'settings'),
('settings.no_settings', 'ar', 'لم يتم العثور على إعدادات للمعايير المحددة', 'settings'),
('settings.no_settings', 'en', 'No settings found for the selected criteria', 'settings'),

-- Category translations
('settings.category.general', 'ar', 'عام', 'settings'),
('settings.category.general', 'en', 'General', 'settings'),
('settings.category.security', 'ar', 'الأمان', 'settings'),
('settings.category.security', 'en', 'Security', 'settings'),
('settings.category.ai', 'ar', 'الذكاء الاصطناعي', 'settings'),
('settings.category.ai', 'en', 'Artificial Intelligence', 'settings'),
('settings.category.analytics', 'ar', 'التحليلات', 'settings'),
('settings.category.analytics', 'en', 'Analytics', 'settings'),
('settings.category.challenges', 'ar', 'التحديات', 'settings'),
('settings.category.challenges', 'en', 'Challenges', 'settings'),
('settings.category.campaigns', 'ar', 'الحملات', 'settings'),
('settings.category.campaigns', 'en', 'Campaigns', 'settings'),
('settings.category.partners', 'ar', 'الشركاء', 'settings'),
('settings.category.partners', 'en', 'Partners', 'settings')

ON CONFLICT (translation_key, language_code) DO UPDATE SET
translation_text = EXCLUDED.translation_text,
updated_at = NOW();