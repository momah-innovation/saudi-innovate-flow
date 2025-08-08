-- Add missing wizard and dialog translation keys
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- Challenge Wizard Keys
('challenge_wizard.basic_info', 'Basic Information', 'المعلومات الأساسية', 'wizard'),
('challenge_wizard.organizational', 'Organizational Structure', 'الهيكل التنظيمي', 'wizard'),
('challenge_wizard.technical', 'Technical Details', 'التفاصيل التقنية', 'wizard'),
('challenge_wizard.relationships', 'Relationships & Partnerships', 'العلاقات والشراكات', 'wizard'),
('challenge_wizard.review', 'Review & Submit', 'المراجعة والإرسال', 'wizard'),

-- Event Wizard Keys
('event_wizard.basic_info', 'Event Information', 'معلومات الحدث', 'wizard'),
('event_wizard.details', 'Event Details', 'تفاصيل الحدث', 'wizard'),
('event_wizard.registration', 'Registration Settings', 'إعدادات التسجيل', 'wizard'),
('event_wizard.resources', 'Resources & Materials', 'الموارد والمواد', 'wizard'),

-- Team Wizard Keys
('team_wizard.basic_info', 'Team Information', 'معلومات الفريق', 'wizard'),
('team_wizard.structure', 'Team Structure', 'هيكل الفريق', 'wizard'),
('team_wizard.permissions', 'Permissions & Access', 'الصلاحيات والوصول', 'wizard'),

-- Dialog Common Keys
('dialog.validation_error', 'Validation Error', 'خطأ في التحقق', 'dialog'),
('dialog.save_success', 'Saved Successfully', 'تم الحفظ بنجاح', 'dialog'),
('dialog.update_success', 'Updated Successfully', 'تم التحديث بنجاح', 'dialog'),
('dialog.create_success', 'Created Successfully', 'تم الإنشاء بنجاح', 'dialog'),
('dialog.save_failed', 'Failed to Save', 'فشل في الحفظ', 'dialog'),
('dialog.try_again', 'Please try again', 'يرجى المحاولة مرة أخرى', 'dialog'),
('dialog.fill_required_fields', 'Please fill in all required fields', 'يرجى ملء جميع الحقول المطلوبة', 'dialog'),

-- Form Field Labels
('form.title_ar', 'Title (Arabic)', 'العنوان', 'form'),
('form.description_ar', 'Description (Arabic)', 'الوصف', 'form'),
('form.status', 'Status', 'الحالة', 'form'),
('form.priority_level', 'Priority Level', 'مستوى الأولوية', 'form'),
('form.sensitivity_level', 'Sensitivity Level', 'مستوى السرية', 'form'),
('form.challenge_type', 'Challenge Type', 'نوع التحدي', 'form'),
('form.start_date', 'Start Date', 'تاريخ البداية', 'form'),
('form.end_date', 'End Date', 'تاريخ النهاية', 'form'),
('form.budget', 'Budget', 'الميزانية', 'form'),
('form.theme', 'Theme', 'الموضوع', 'form'),

-- Status Options
('status.draft', 'Draft', 'مسودة', 'status'),
('status.published', 'Published', 'منشور', 'status'),
('status.active', 'Active', 'نشط', 'status'),
('status.closed', 'Closed', 'مغلق', 'status'),
('status.archived', 'Archived', 'مؤرشف', 'status'),
('status.completed', 'Completed', 'مكتمل', 'status'),
('status.planning', 'Planning', 'تخطيط', 'status'),
('status.cancelled', 'Cancelled', 'ملغى', 'status'),

-- Priority Levels
('priority.low', 'Low', 'منخفض', 'priority'),
('priority.medium', 'Medium', 'متوسط', 'priority'),
('priority.high', 'High', 'عالي', 'priority'),
('priority.urgent', 'Urgent', 'عاجل', 'priority'),

-- Sensitivity Levels
('sensitivity.normal', 'Normal - Public Access', 'عادي - وصول عام', 'sensitivity'),
('sensitivity.sensitive', 'Sensitive - Team Members Only', 'حساس - أعضاء الفريق فقط', 'sensitivity'),
('sensitivity.confidential', 'Confidential - Managers Only', 'سري - المدراء فقط', 'sensitivity'),

-- Organizational Structure
('form.sector', 'Sector', 'القطاع', 'form'),
('form.deputy', 'Deputy', 'الوكالة', 'form'),
('form.department', 'Department', 'الإدارة', 'form'),
('form.domain', 'Domain', 'المجال', 'form'),
('form.sub_domain', 'Sub Domain', 'المجال الفرعي', 'form'),
('form.service', 'Service', 'الخدمة', 'form'),

-- Placeholders
('placeholder.select_sector', 'Select Sector', 'اختر القطاع', 'placeholder'),
('placeholder.select_deputy', 'Select Deputy', 'اختر الوكالة', 'placeholder'),
('placeholder.select_department', 'Select Department', 'اختر الإدارة', 'placeholder'),
('placeholder.select_domain', 'Select Domain', 'اختر المجال', 'placeholder'),
('placeholder.select_status', 'Select Status', 'اختر الحالة', 'placeholder'),
('placeholder.select_priority', 'Select Priority', 'اختر مستوى الأولوية', 'placeholder'),
('placeholder.select_sensitivity', 'Select Sensitivity', 'اختر مستوى السرية', 'placeholder'),
('placeholder.enter_title', 'Enter title', 'أدخل العنوان', 'placeholder'),
('placeholder.enter_description', 'Enter description', 'أدخل الوصف', 'placeholder'),

-- Buttons
('button.next', 'Next', 'التالي', 'button'),
('button.previous', 'Previous', 'السابق', 'button'),
('button.save', 'Save', 'حفظ', 'button'),
('button.cancel', 'Cancel', 'إلغاء', 'button'),
('button.submit', 'Submit', 'إرسال', 'button'),
('button.close', 'Close', 'إغلاق', 'button')

ON CONFLICT (translation_key) DO NOTHING;