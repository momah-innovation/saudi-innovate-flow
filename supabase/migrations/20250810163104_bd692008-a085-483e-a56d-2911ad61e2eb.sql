-- Migration for Shared Components and Dialog translation keys
-- Adding translation keys for DataTable and common dialog components

INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- DataTable translations
('table.no_data', 'No data available', 'لا توجد بيانات متاحة', 'ui'),
('table.no_data_description', 'There are no items to display at the moment.', 'لا توجد عناصر للعرض في الوقت الحالي.', 'ui'),
('table.select_all', 'Select all', 'تحديد الكل', 'ui'),
('table.select_item', 'Select item', 'تحديد العنصر', 'ui'),

-- Dialog translations
('dialog.validation_error', 'Validation Error', 'خطأ في التحقق', 'ui'),
('dialog.fill_required_fields', 'Please fill in all required fields', 'يرجى ملء جميع الحقول المطلوبة', 'ui'),
('dialog.save_success', 'Save Successful', 'تم الحفظ بنجاح', 'ui'),
('dialog.save_failed', 'Save Failed', 'فشل في الحفظ', 'ui'),
('dialog.create_success', 'Created successfully', 'تم الإنشاء بنجاح', 'ui'),
('dialog.update_success', 'Updated successfully', 'تم التحديث بنجاح', 'ui'),
('dialog.delete_success', 'Deleted successfully', 'تم الحذف بنجاح', 'ui'),
('dialog.try_again', 'Please try again', 'يرجى المحاولة مرة أخرى', 'ui'),
('dialog.confirm_delete', 'Are you sure you want to delete this item?', 'هل أنت متأكد من أنك تريد حذف هذا العنصر؟', 'ui'),
('dialog.cancel', 'Cancel', 'إلغاء', 'ui'),
('dialog.confirm', 'Confirm', 'تأكيد', 'ui'),
('dialog.close', 'Close', 'إغلاق', 'ui'),

-- Common form labels
('form.required_field', 'This field is required', 'هذا الحقل مطلوب', 'form'),
('form.invalid_email', 'Please enter a valid email address', 'يرجى إدخال عنوان بريد إلكتروني صحيح', 'form'),
('form.password_too_short', 'Password must be at least 8 characters', 'يجب أن تكون كلمة المرور 8 أحرف على الأقل', 'form'),
('form.passwords_not_match', 'Passwords do not match', 'كلمات المرور غير متطابقة', 'form'),
('form.invalid_url', 'Please enter a valid URL', 'يرجى إدخال رابط صحيح', 'form'),
('form.invalid_phone', 'Please enter a valid phone number', 'يرجى إدخال رقم هاتف صحيح', 'form'),

-- Loading and error states
('loading.please_wait', 'Please wait...', 'يرجى الانتظار...', 'ui'),
('loading.loading_data', 'Loading data...', 'جاري تحميل البيانات...', 'ui'),
('error.something_went_wrong', 'Something went wrong', 'حدث خطأ ما', 'ui'),
('error.try_again_later', 'Please try again later', 'يرجى المحاولة مرة أخرى لاحقاً', 'ui'),
('error.network_error', 'Network error occurred', 'حدث خطأ في الشبكة', 'ui'),

-- Common actions
('actions.edit', 'Edit', 'تعديل', 'ui'),
('actions.delete', 'Delete', 'حذف', 'ui'),
('actions.view', 'View', 'عرض', 'ui'),
('actions.save', 'Save', 'حفظ', 'ui'),
('actions.cancel', 'Cancel', 'إلغاء', 'ui'),
('actions.add', 'Add', 'إضافة', 'ui'),
('actions.remove', 'Remove', 'إزالة', 'ui'),
('actions.update', 'Update', 'تحديث', 'ui'),
('actions.create', 'Create', 'إنشاء', 'ui'),
('actions.search', 'Search', 'بحث', 'ui'),
('actions.filter', 'Filter', 'تصفية', 'ui'),
('actions.export', 'Export', 'تصدير', 'ui'),
('actions.import', 'Import', 'استيراد', 'ui'),
('actions.print', 'Print', 'طباعة', 'ui'),
('actions.download', 'Download', 'تحميل', 'ui'),
('actions.upload', 'Upload', 'رفع', 'ui'),
('actions.submit', 'Submit', 'إرسال', 'ui'),
('actions.back', 'Back', 'رجوع', 'ui'),
('actions.next', 'Next', 'التالي', 'ui'),
('actions.previous', 'Previous', 'السابق', 'ui'),
('actions.refresh', 'Refresh', 'تحديث', 'ui'),

-- Common status
('status.draft', 'Draft', 'مسودة', 'ui'),
('status.published', 'Published', 'منشور', 'ui'),
('status.archived', 'Archived', 'مؤرشف', 'ui'),
('status.completed', 'Completed', 'مكتمل', 'ui'),
('status.in_progress', 'In Progress', 'قيد التنفيذ', 'ui'),
('status.cancelled', 'Cancelled', 'ملغي', 'ui'),
('status.approved', 'Approved', 'موافق عليه', 'ui'),
('status.rejected', 'Rejected', 'مرفوض', 'ui'),
('status.under_review', 'Under Review', 'قيد المراجعة', 'ui');