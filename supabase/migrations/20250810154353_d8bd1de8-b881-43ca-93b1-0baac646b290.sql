-- Add missing translation keys for shared components
INSERT INTO public.system_translations (translation_key, text_en, text_ar, category) VALUES

-- Challenge Wizard Steps
('challenge_wizard.basic_info', 'Basic Information', 'المعلومات الأساسية', 'wizard'),
('challenge_wizard.organizational_info', 'Organizational Setup', 'الإعداد التنظيمي', 'wizard'),
('challenge_wizard.technical_details', 'Technical Details', 'التفاصيل التقنية', 'wizard'),
('challenge_wizard.partnerships', 'Partnerships', 'الشراكات', 'wizard'),
('challenge_wizard.review', 'Review & Submit', 'مراجعة وإرسال', 'wizard'),

-- Remaining Campaign Wizard organizational structure
('admin.campaigns.organizational_structure_step', 'Organizational Structure', 'الهيكل التنظيمي', 'wizard'),
('admin.campaigns.partnerships_step', 'Partnerships & Collaboration', 'الشراكات والتعاون', 'wizard'),

-- More missing placeholders and forms
('placeholder.search_items', 'Search items...', 'ابحث عن العناصر...', 'form'),
('placeholder.no_items_found', 'No items found', 'لا توجد عناصر', 'form'),
('placeholder.loading', 'Loading...', 'جاري التحميل...', 'ui'),

-- Table and list headers
('table.name', 'Name', 'الاسم', 'table'),
('table.description', 'Description', 'الوصف', 'table'),
('table.created_at', 'Created At', 'تاريخ الإنشاء', 'table'),
('table.updated_at', 'Updated At', 'تاريخ التحديث', 'table'),
('table.actions', 'Actions', 'الإجراءات', 'table'),

-- Missing validation messages
('validation.required_field', 'This field is required', 'هذا الحقل مطلوب', 'validation'),
('validation.min_length', 'Minimum {count} characters required', 'الحد الأدنى {count} أحرف مطلوب', 'validation'),
('validation.max_length', 'Maximum {count} characters allowed', 'الحد الأقصى {count} أحرف مسموح', 'validation'),
('validation.invalid_email', 'Invalid email format', 'تنسيق البريد الإلكتروني غير صحيح', 'validation'),
('validation.passwords_not_match', 'Passwords do not match', 'كلمات المرور غير متطابقة', 'validation'),

-- Success messages
('success.created_successfully', 'Created successfully', 'تم الإنشاء بنجاح', 'message'),
('success.updated_successfully', 'Updated successfully', 'تم التحديث بنجاح', 'message'),
('success.deleted_successfully', 'Deleted successfully', 'تم الحذف بنجاح', 'message'),
('success.saved_successfully', 'Saved successfully', 'تم الحفظ بنجاح', 'message'),

-- Error messages
('error.something_went_wrong', 'Something went wrong', 'حدث خطأ ما', 'message'),
('error.failed_to_load', 'Failed to load data', 'فشل في تحميل البيانات', 'message'),
('error.failed_to_save', 'Failed to save', 'فشل في الحفظ', 'message'),
('error.failed_to_delete', 'Failed to delete', 'فشل في الحذف', 'message'),
('error.network_error', 'Network error', 'خطأ في الشبكة', 'message'),
('error.unauthorized', 'Unauthorized access', 'وصول غير مصرح', 'message'),

-- Confirmation dialogs
('confirm.are_you_sure', 'Are you sure?', 'هل أنت متأكد؟', 'dialog'),
('confirm.delete_item', 'Are you sure you want to delete this item?', 'هل أنت متأكد من حذف هذا العنصر؟', 'dialog'),
('confirm.unsaved_changes', 'You have unsaved changes. Are you sure you want to leave?', 'لديك تغييرات غير محفوظة. هل أنت متأكد من المغادرة؟', 'dialog'),

-- Loading states
('loading.please_wait', 'Please wait...', 'يرجى الانتظار...', 'ui'),
('loading.processing', 'Processing...', 'جاري المعالجة...', 'ui'),
('loading.uploading', 'Uploading...', 'جاري الرفع...', 'ui'),
('loading.downloading', 'Downloading...', 'جاري التحميل...', 'ui')

ON CONFLICT (translation_key) DO UPDATE SET
text_en = EXCLUDED.text_en,
text_ar = EXCLUDED.text_ar,
category = EXCLUDED.category;