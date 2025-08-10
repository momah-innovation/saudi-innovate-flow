-- Insert comprehensive translation keys for the application

-- Navigation translations
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('navigation.home', 'Home', 'الرئيسية', 'navigation'),
('navigation.challenges', 'Challenges', 'التحديات', 'navigation'),
('navigation.ideas', 'Ideas', 'الأفكار', 'navigation'),
('navigation.events', 'Events', 'الفعاليات', 'navigation'),
('navigation.opportunities', 'Opportunities', 'الفرص', 'navigation'),
('navigation.dashboard', 'Dashboard', 'لوحة التحكم', 'navigation'),
('navigation.workspace', 'Workspace', 'مساحة العمل', 'navigation'),
('navigation.profile', 'Profile', 'الملف الشخصي', 'navigation'),
('navigation.settings', 'Settings', 'الإعدادات', 'navigation'),

-- Common translations
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('common.save', 'Save', 'حفظ', 'common'),
('common.cancel', 'Cancel', 'إلغاء', 'common'),
('common.submit', 'Submit', 'إرسال', 'common'),
('common.delete', 'Delete', 'حذف', 'common'),
('common.edit', 'Edit', 'تعديل', 'common'),
('common.view', 'View', 'عرض', 'common'),
('common.manage', 'Manage', 'إدارة', 'common'),
('common.actions', 'Actions', 'الإجراءات', 'common'),
('common.status', 'Status', 'الحالة', 'common'),
('common.loading', 'Loading...', 'جاري التحميل...', 'common'),
('common.error', 'Error', 'خطأ', 'common'),
('common.success', 'Success', 'نجح', 'common'),
('common.refresh', 'Refresh', 'تحديث', 'common'),
('common.yes', 'Yes', 'نعم', 'common'),
('common.no', 'No', 'لا', 'common'),
('common.enabled', 'Enabled', 'مفعل', 'common'),
('common.disabled', 'Disabled', 'معطل', 'common'),
('common.days', 'Days', 'أيام', 'common'),
('common.more', 'More', 'المزيد', 'common'),
('common.completed', 'Completed', 'مكتمل', 'common'),
('common.pending', 'Pending', 'معلق', 'common'),
('common.apply', 'Apply', 'تقديم', 'common'),
('common.review', 'Review', 'مراجعة', 'common'),
('common.no_deadline', 'No Deadline', 'بلا موعد نهائي', 'common'),

-- Frequency options
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('common.frequency.daily', 'Daily', 'يومي', 'common'),
('common.frequency.weekly', 'Weekly', 'أسبوعي', 'common'),
('common.frequency.monthly', 'Monthly', 'شهري', 'common'),

-- Challenge form translations
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('challenge_form.create_challenge', 'Create Challenge', 'إنشاء تحدي', 'challenge_form'),
('challenge_form.edit_challenge', 'Edit Challenge', 'تعديل التحدي', 'challenge_form'),
('challenge_form.create_challenge_description', 'Create a new innovation challenge to engage participants', 'قم بإنشاء تحدي ابتكار جديد لإشراك المشاركين', 'challenge_form'),
('challenge_form.edit_challenge_description', 'Modify the challenge details and settings', 'تعديل تفاصيل التحدي والإعدادات', 'challenge_form'),
('challenge_form.challenge_title', 'Challenge Title', 'عنوان التحدي', 'challenge_form'),
('challenge_form.challenge_title_placeholder', 'Enter the challenge title in Arabic', 'أدخل عنوان التحدي باللغة العربية', 'challenge_form'),
('challenge_form.challenge_title_en', 'Challenge Title (English)', 'عنوان التحدي (إنجليزي)', 'challenge_form'),
('challenge_form.challenge_title_en_placeholder', 'Enter the challenge title in English', 'أدخل عنوان التحدي باللغة الإنجليزية', 'challenge_form'),
('challenge_form.challenge_description', 'Challenge Description', 'وصف التحدي', 'challenge_form'),
('challenge_form.challenge_description_placeholder', 'Describe the challenge objectives and requirements', 'اوصف أهداف التحدي ومتطلباته', 'challenge_form'),
('challenge_form.challenge_description_en', 'Challenge Description (English)', 'وصف التحدي (إنجليزي)', 'challenge_form'),
('challenge_form.challenge_description_en_placeholder', 'Describe the challenge in English', 'اوصف التحدي باللغة الإنجليزية', 'challenge_form'),
('challenge_form.challenge_type', 'Challenge Type', 'نوع التحدي', 'challenge_form'),
('challenge_form.select_challenge_type', 'Select challenge type', 'اختر نوع التحدي', 'challenge_form'),
('challenge_form.priority_level', 'Priority Level', 'مستوى الأولوية', 'challenge_form'),
('challenge_form.select_priority', 'Select priority level', 'اختر مستوى الأولوية', 'challenge_form'),
('challenge_form.estimated_budget', 'Estimated Budget', 'الميزانية المقدرة', 'challenge_form'),
('challenge_form.budget_placeholder', 'Enter estimated budget in SAR', 'أدخل الميزانية المقدرة بالريال السعودي', 'challenge_form'),
('challenge_form.start_date', 'Start Date', 'تاريخ البداية', 'challenge_form'),
('challenge_form.end_date', 'End Date', 'تاريخ النهاية', 'challenge_form'),
('challenge_form.max_participants', 'Maximum Participants', 'الحد الأقصى للمشاركين', 'challenge_form'),
('challenge_form.max_participants_placeholder', 'Enter maximum number of participants', 'أدخل الحد الأقصى لعدد المشاركين', 'challenge_form'),
('challenge_form.tags', 'Tags', 'العلامات', 'challenge_form'),
('challenge_form.challenge_image', 'Challenge Image', 'صورة التحدي', 'challenge_form'),
('challenge_form.saving', 'Saving...', 'جاري الحفظ...', 'challenge_form'),
('challenge_form.save_changes', 'Save Changes', 'حفظ التغييرات', 'challenge_form'),

-- Advanced search translations
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('advanced_search.title', 'Advanced Search', 'البحث المتقدم', 'advanced_search'),
('advanced_search.filters_active', 'Filters Active', 'مرشحات نشطة', 'advanced_search'),
('advanced_search.search_query', 'Search Query', 'استعلام البحث', 'advanced_search'),
('advanced_search.search_placeholder', 'Enter keywords to search...', 'أدخل الكلمات المفتاحية للبحث...', 'advanced_search'),
('advanced_search.status', 'Status', 'الحالة', 'advanced_search'),
('advanced_search.select_status', 'Select status', 'اختر الحالة', 'advanced_search'),
('advanced_search.all_statuses', 'All Statuses', 'جميع الحالات', 'advanced_search'),
('advanced_search.priority', 'Priority', 'الأولوية', 'advanced_search'),
('advanced_search.select_priority', 'Select priority', 'اختر الأولوية', 'advanced_search'),
('advanced_search.all_priorities', 'All Priorities', 'جميع الأولويات', 'advanced_search'),
('advanced_search.date_range', 'Date Range', 'نطاق التاريخ', 'advanced_search'),
('advanced_search.start_date', 'Start Date', 'تاريخ البداية', 'advanced_search'),
('advanced_search.end_date', 'End Date', 'تاريخ النهاية', 'advanced_search'),
('advanced_search.budget_range', 'Budget Range', 'نطاق الميزانية', 'advanced_search'),
('advanced_search.minimum_budget', 'Minimum Budget', 'الحد الأدنى للميزانية', 'advanced_search'),
('advanced_search.maximum_budget', 'Maximum Budget', 'الحد الأقصى للميزانية', 'advanced_search'),
('advanced_search.tag_selector_coming_soon', 'Tag selector coming soon', 'منتقي العلامات قريباً', 'advanced_search'),
('advanced_search.search', 'Search', 'بحث', 'advanced_search'),
('advanced_search.clear_filters', 'Clear Filters', 'مسح المرشحات', 'advanced_search'),

-- Error and success messages
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('error.validation_error', 'Validation Error', 'خطأ في التحقق', 'error'),
('error.load_failed', 'Failed to load data', 'فشل في تحميل البيانات', 'error'),
('error.delete_failed', 'Failed to delete item', 'فشل في حذف العنصر', 'error'),
('success.delete_success', 'Successfully Deleted', 'تم الحذف بنجاح', 'success'),
('success.challenge_deleted', 'Challenge has been deleted successfully', 'تم حذف التحدي بنجاح', 'success'),

-- Status values
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('status.draft', 'Draft', 'مسودة', 'status'),
('status.active', 'Active', 'نشط', 'status'),
('status.completed', 'Completed', 'مكتمل', 'status'),
('status.cancelled', 'Cancelled', 'ملغي', 'status'),
('status.on_hold', 'On Hold', 'معلق', 'status'),

-- General descriptions
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('description', 'Description', 'الوصف', 'general'),
('vision_2030_goal', 'Vision 2030 Goal', 'هدف رؤية 2030', 'general'),
('collaboration_details', 'Collaboration Details', 'تفاصيل التعاون', 'general'),

-- Dashboard and admin
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('total_users', 'Total Users', 'إجمالي المستخدمين', 'dashboard'),

-- Storage related
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('storage.auto_cleanup', 'Auto Cleanup', 'التنظيف التلقائي', 'storage'),
('storage.cleanup_days', 'Cleanup Days', 'أيام التنظيف', 'storage'),
('storage.compression', 'Compression', 'الضغط', 'storage'),

-- Workspace related
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('workspace.partner.deadline', 'Deadline', 'الموعد النهائي', 'workspace')

ON CONFLICT (translation_key) DO NOTHING;