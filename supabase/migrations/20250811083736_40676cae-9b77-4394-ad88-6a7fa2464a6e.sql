-- Add missing translation keys for ChallengeCard and other components
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- ChallengeCard specific
('trending', 'Trending', 'شائع', 'ui'),
('new', 'New', 'جديد', 'ui'),
('urgent', 'Urgent', 'عاجل', 'ui'),
('prize', 'Prize', 'الجائزة', 'ui'),
('progress', 'Progress', 'التقدم', 'ui'),
('experts', 'Experts', 'الخبراء', 'ui'),
('days', 'days', 'أيام', 'ui'),
('join', 'Join', 'شارك', 'ui'),
('like', 'Like', 'أعجبني', 'ui'),
('bookmark', 'Bookmark', 'حفظ', 'ui'),
('share', 'Share', 'مشاركة', 'ui'),
('view_details', 'View Details', 'التفاصيل', 'ui'),

-- Common toasts and messages
('error', 'Error', 'خطأ', 'ui'),
('success', 'Success', 'نجح', 'ui'),
('loading', 'Loading', 'جاري التحميل', 'ui'),

-- Challenge management
('general_question', 'General Question', 'سؤال عام', 'challenge'),
('linked_to_challenge', 'Linked to Challenge', 'مرتبط بالتحدي', 'challenge'),
('order', 'Order', 'الترتيب', 'challenge'),
('creation_date', 'Creation Date', 'تاريخ الإنشاء', 'challenge'),

-- Settings
('settingUpdated', 'Setting updated successfully', 'تم تحديث الإعداد بنجاح', 'settings'),
('updateSettingError', 'Failed to update setting', 'فشل في تحديث الإعداد', 'settings'),

-- Translation management  
('translations.updateSuccess', 'Translation updated successfully', 'تم تحديث الترجمة بنجاح', 'translations'),
('translations.createSuccess', 'Translation created successfully', 'تم إنشاء الترجمة بنجاح', 'translations'),
('translations.deleteSuccess', 'Translation deleted successfully', 'تم حذف الترجمة بنجاح', 'translations'),

-- Search and system
('search_placeholder', 'Search...', 'بحث...', 'ui'),
('system_title', 'Ruwād Innovation System', 'نظام رواد الابتكار', 'system'),
('phone_placeholder', '+966 50 123 4567', '+966 50 123 4567', 'ui')

ON CONFLICT (translation_key) DO NOTHING;