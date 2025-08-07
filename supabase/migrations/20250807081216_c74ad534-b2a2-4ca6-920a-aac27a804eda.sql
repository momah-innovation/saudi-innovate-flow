-- Final batch of comprehensive translation keys (Progress: 548 + ~100 more = ~648 total)

-- Toast/notification message translations from TOAST_MESSAGES
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- CRUD Operations
('toast.created', 'Created successfully', 'تم الإنشاء بنجاح', 'toast'),
('toast.updated', 'Updated successfully', 'تم التحديث بنجاح', 'toast'),
('toast.deleted', 'Deleted successfully', 'تم الحذف بنجاح', 'toast'),
('toast.saved', 'Saved successfully', 'تم الحفظ بنجاح', 'toast'),

-- Error messages
('toast.create_error', 'Failed to create', 'فشل في الإنشاء', 'toast'),
('toast.update_error', 'Failed to update', 'فشل في التحديث', 'toast'),
('toast.delete_error', 'Failed to delete', 'فشل في الحذف', 'toast'),
('toast.load_error', 'Failed to load', 'فشل في التحميل', 'toast'),
('toast.network_error', 'Network error. Please check your connection.', 'خطأ في الشبكة. يرجى فحص الاتصال.', 'toast'),
('toast.permission_error', 'You don\'t have permission to perform this action', 'ليس لديك صلاحية لتنفيذ هذا الإجراء', 'toast'),

-- Loading states
('toast.creating', 'Creating...', 'جاري الإنشاء...', 'toast'),
('toast.updating', 'Updating...', 'جاري التحديث...', 'toast'),
('toast.deleting', 'Deleting...', 'جاري الحذف...', 'toast'),
('toast.loading', 'Loading...', 'جاري التحميل...', 'toast'),

-- Actions
('toast.copied', 'Copied to clipboard', 'تم النسخ إلى الحافظة', 'toast'),
('toast.exported', 'Data exported successfully', 'تم تصدير البيانات بنجاح', 'toast'),
('toast.imported', 'Data imported successfully', 'تم استيراد البيانات بنجاح', 'toast'),
('toast.email_sent', 'Email sent successfully', 'تم إرسال البريد الإلكتروني بنجاح', 'toast'),

-- Validation
('toast.required_fields', 'Please fill in all required fields', 'يرجى ملء جميع الحقول المطلوبة', 'toast'),
('toast.invalid_email', 'Please enter a valid email address', 'يرجى إدخال عنوان بريد إلكتروني صحيح', 'toast'),
('toast.invalid_phone', 'Please enter a valid phone number', 'يرجى إدخال رقم هاتف صحيح', 'toast'),
('toast.passwords_dont_match', 'Passwords don\'t match', 'كلمات المرور غير متطابقة', 'toast'),

-- File operations
('toast.file_uploaded', 'File uploaded successfully', 'تم رفع الملف بنجاح', 'toast'),
('toast.file_deleted', 'File deleted successfully', 'تم حذف الملف بنجاح', 'toast'),
('toast.invalid_file_type', 'Invalid file type', 'نوع ملف غير صالح', 'toast'),
('toast.file_too_large', 'File size too large', 'حجم الملف كبير جداً', 'toast'),

-- Component-specific missing keys found in searches
('just_now', 'Just now', 'الآن', 'time'),
('minutes_ago', 'minutes ago', 'منذ دقائق', 'time'),
('minutes_ago_plural', 'minutes ago', 'منذ دقائق', 'time'),
('hours_ago', 'hours ago', 'منذ ساعات', 'time'),
('hours_ago_plural', 'hours ago', 'منذ ساعات', 'time'),
('days_ago', 'days ago', 'منذ أيام', 'time'),
('days_ago_plural', 'days ago', 'منذ أيام', 'time'),

-- System-wide navigation and application
('security', 'Security', 'الأمان', 'system'),
('all', 'All', 'الكل', 'general'),
('general', 'General', 'عام', 'general'),
('name', 'Name', 'الاسم', 'general'),
('description', 'Description', 'الوصف', 'general'),
('title', 'Title', 'العنوان', 'general'),
('status', 'Status', 'الحالة', 'general'),
('priority', 'Priority', 'الأولوية', 'general'),
('sensitivity', 'Sensitivity', 'الحساسية', 'general'),

-- Additional form and UI translations
('close', 'Close', 'إغلاق', 'ui'),
('open', 'Open', 'فتح', 'ui'),
('show', 'Show', 'إظهار', 'ui'),
('hide', 'Hide', 'إخفاء', 'ui'),
('enable', 'Enable', 'تفعيل', 'ui'),
('disable', 'Disable', 'تعطيل', 'ui'),
('activate', 'Activate', 'تنشيط', 'ui'),
('deactivate', 'Deactivate', 'إلغاء التنشيط', 'ui'),
('connect', 'Connect', 'اتصال', 'ui'),
('disconnect', 'Disconnect', 'قطع الاتصال', 'ui'),
('upload', 'Upload', 'رفع', 'ui'),
('download', 'Download', 'تنزيل', 'ui'),
('sync', 'Sync', 'مزامنة', 'ui'),
('backup', 'Backup', 'نسخة احتياطية', 'ui'),

-- Admin and management
('manage', 'Manage', 'إدارة', 'admin'),
('configure', 'Configure', 'تكوين', 'admin'),
('customize', 'Customize', 'تخصيص', 'admin'),
('optimize', 'Optimize', 'تحسين', 'admin'),
('monitor', 'Monitor', 'مراقبة', 'admin'),
('maintain', 'Maintain', 'صيانة', 'admin'),
('upgrade', 'Upgrade', 'ترقية', 'admin'),
('migrate', 'Migrate', 'ترحيل', 'admin'),
('integrate', 'Integrate', 'دمج', 'admin'),
('deploy', 'Deploy', 'نشر', 'admin'),

-- Workflow and process
('workflow', 'Workflow', 'سير العمل', 'process'),
('process', 'Process', 'عملية', 'process'),
('step', 'Step', 'خطوة', 'process'),
('stage', 'Stage', 'مرحلة', 'process'),
('phase', 'Phase', 'مرحلة', 'process'),
('milestone', 'Milestone', 'معلم', 'process'),
('checkpoint', 'Checkpoint', 'نقطة فحص', 'process'),
('approval', 'Approval', 'موافقة', 'process'),
('review', 'Review', 'مراجعة', 'process'),
('validation', 'Validation', 'تحقق', 'process'),

-- Quality and performance
('quality', 'Quality', 'الجودة', 'quality'),
('performance', 'Performance', 'الأداء', 'quality'),
('efficiency', 'Efficiency', 'الكفاءة', 'quality'),
('reliability', 'Reliability', 'الموثوقية', 'quality'),
('availability', 'Availability', 'التوفر', 'quality'),
('scalability', 'Scalability', 'قابلية التوسع', 'quality'),
('security', 'Security', 'الأمان', 'quality'),
('compliance', 'Compliance', 'الامتثال', 'quality'),
('standard', 'Standard', 'معيار', 'quality'),
('benchmark', 'Benchmark', 'معيار مرجعي', 'quality'),

-- Innovation and creativity specific
('innovation', 'Innovation', 'الابتكار', 'innovation'),
('creativity', 'Creativity', 'الإبداع', 'innovation'),
('brainstorm', 'Brainstorm', 'عصف ذهني', 'innovation'),
('prototype', 'Prototype', 'نموذج أولي', 'innovation'),
('experiment', 'Experiment', 'تجربة', 'innovation'),
('research', 'Research', 'بحث', 'innovation'),
('development', 'Development', 'تطوير', 'innovation'),
('implementation', 'Implementation', 'تنفيذ', 'innovation'),
('solution', 'Solution', 'حل', 'innovation'),
('approach', 'Approach', 'نهج', 'innovation'),

-- Additional status and state
('new', 'New', 'جديد', 'status'),
('updated', 'Updated', 'محدث', 'status'),
('modified', 'Modified', 'معدل', 'status'),
('unchanged', 'Unchanged', 'غير متغير', 'status'),
('synchronized', 'Synchronized', 'متزامن', 'status'),
('outdated', 'Outdated', 'قديم', 'status'),
('current', 'Current', 'حالي', 'status'),
('latest', 'Latest', 'الأحدث', 'status'),
('previous', 'Previous', 'السابق', 'status'),
('historical', 'Historical', 'تاريخي', 'status')

ON CONFLICT (translation_key) DO NOTHING;