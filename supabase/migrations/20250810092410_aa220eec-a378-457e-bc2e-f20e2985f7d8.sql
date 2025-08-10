-- Insert common UI translation keys with Arabic and English values
INSERT INTO public.system_translations (translation_key, text_ar, text_en, category) VALUES
-- Navigation
('nav.home', 'الرئيسية', 'Home', 'navigation'),
('nav.dashboard', 'لوحة التحكم', 'Dashboard', 'navigation'),
('nav.challenges', 'التحديات', 'Challenges', 'navigation'),
('nav.ideas', 'الأفكار', 'Ideas', 'navigation'),
('nav.events', 'الفعاليات', 'Events', 'navigation'),
('nav.opportunities', 'الفرص', 'Opportunities', 'navigation'),
('nav.profile', 'الملف الشخصي', 'Profile', 'navigation'),
('nav.settings', 'الإعدادات', 'Settings', 'navigation'),
('nav.logout', 'تسجيل الخروج', 'Logout', 'navigation'),

-- Common Actions
('action.save', 'حفظ', 'Save', 'actions'),
('action.cancel', 'إلغاء', 'Cancel', 'actions'),
('action.edit', 'تعديل', 'Edit', 'actions'),
('action.delete', 'حذف', 'Delete', 'actions'),
('action.submit', 'إرسال', 'Submit', 'actions'),
('action.create', 'إنشاء', 'Create', 'actions'),
('action.update', 'تحديث', 'Update', 'actions'),
('action.view', 'عرض', 'View', 'actions'),
('action.back', 'رجوع', 'Back', 'actions'),
('action.next', 'التالي', 'Next', 'actions'),
('action.previous', 'السابق', 'Previous', 'actions'),
('action.search', 'بحث', 'Search', 'actions'),
('action.filter', 'تصفية', 'Filter', 'actions'),
('action.export', 'تصدير', 'Export', 'actions'),
('action.import', 'استيراد', 'Import', 'actions'),
('action.download', 'تحميل', 'Download', 'actions'),
('action.upload', 'رفع', 'Upload', 'actions'),

-- Form Labels
('form.title', 'العنوان', 'Title', 'forms'),
('form.description', 'الوصف', 'Description', 'forms'),
('form.name', 'الاسم', 'Name', 'forms'),
('form.email', 'البريد الإلكتروني', 'Email', 'forms'),
('form.password', 'كلمة المرور', 'Password', 'forms'),
('form.confirmPassword', 'تأكيد كلمة المرور', 'Confirm Password', 'forms'),
('form.phone', 'الهاتف', 'Phone', 'forms'),
('form.date', 'التاريخ', 'Date', 'forms'),
('form.time', 'الوقت', 'Time', 'forms'),
('form.status', 'الحالة', 'Status', 'forms'),
('form.category', 'الفئة', 'Category', 'forms'),
('form.type', 'النوع', 'Type', 'forms'),
('form.priority', 'الأولوية', 'Priority', 'forms'),

-- Status Values
('status.active', 'نشط', 'Active', 'status'),
('status.inactive', 'غير نشط', 'Inactive', 'status'),
('status.pending', 'قيد الانتظار', 'Pending', 'status'),
('status.approved', 'مقبول', 'Approved', 'status'),
('status.rejected', 'مرفوض', 'Rejected', 'status'),
('status.draft', 'مسودة', 'Draft', 'status'),
('status.published', 'منشور', 'Published', 'status'),
('status.completed', 'مكتمل', 'Completed', 'status'),
('status.inProgress', 'قيد التقدم', 'In Progress', 'status'),

-- Messages
('message.success', 'تم بنجاح', 'Success', 'messages'),
('message.error', 'حدث خطأ', 'Error occurred', 'messages'),
('message.warning', 'تحذير', 'Warning', 'messages'),
('message.info', 'معلومات', 'Information', 'messages'),
('message.loading', 'جاري التحميل...', 'Loading...', 'messages'),
('message.noData', 'لا توجد بيانات', 'No data available', 'messages'),
('message.confirmDelete', 'هل أنت متأكد من الحذف؟', 'Are you sure you want to delete?', 'messages'),

-- Validation
('validation.required', 'هذا الحقل مطلوب', 'This field is required', 'validation'),
('validation.email', 'البريد الإلكتروني غير صحيح', 'Invalid email format', 'validation'),
('validation.password', 'كلمة المرور ضعيفة', 'Password is too weak', 'validation'),
('validation.minLength', 'الحد الأدنى للأحرف', 'Minimum characters required', 'validation'),
('validation.maxLength', 'تجاوز الحد الأقصى للأحرف', 'Maximum characters exceeded', 'validation'),

-- Common UI Elements
('ui.table.noResults', 'لا توجد نتائج', 'No results found', 'ui'),
('ui.pagination.page', 'صفحة', 'Page', 'ui'),
('ui.pagination.of', 'من', 'of', 'ui'),
('ui.pagination.first', 'الأولى', 'First', 'ui'),
('ui.pagination.last', 'الأخيرة', 'Last', 'ui'),
('ui.sort.ascending', 'تصاعدي', 'Ascending', 'ui'),
('ui.sort.descending', 'تنازلي', 'Descending', 'ui'),
('ui.menu.more', 'المزيد', 'More', 'ui'),
('ui.menu.options', 'خيارات', 'Options', 'ui')

ON CONFLICT (translation_key) DO UPDATE SET
  text_ar = EXCLUDED.text_ar,
  text_en = EXCLUDED.text_en,
  category = EXCLUDED.category,
  updated_at = NOW();