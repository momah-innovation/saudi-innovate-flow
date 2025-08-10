-- Add missing translation keys that are currently hardcoded in components

INSERT INTO system_translations (translation_key, text_ar, text_en, category) VALUES
-- Button translations
('button.view', 'عرض', 'View', 'ui'),
('button.edit', 'تعديل', 'Edit', 'ui'),
('button.delete', 'حذف', 'Delete', 'ui'),
('button.settings', 'إعدادات', 'Settings', 'ui'),
('button.create', 'إنشاء', 'Create', 'ui'),
('button.add', 'إضافة', 'Add', 'ui'),
('button.search', 'ابحث', 'Search', 'ui'),

-- Status translations
('status.draft', 'مسودة', 'Draft', 'status'),
('status.active', 'نشط', 'Active', 'status'),
('status.completed', 'مكتمل', 'Completed', 'status'),
('status.cancelled', 'ملغي', 'Cancelled', 'status'),
('status.planning', 'قيد التخطيط', 'Planning', 'status'),
('status.paused', 'متوقف', 'Paused', 'status'),
('status.submitted', 'مرسل', 'Submitted', 'status'),
('status.under_review', 'قيد المراجعة', 'Under Review', 'status'),
('status.approved', 'مقبول', 'Approved', 'status'),
('status.rejected', 'مرفوض', 'Rejected', 'status'),
('status.in_development', 'قيد التطوير', 'In Development', 'status'),
('status.implemented', 'منفذ', 'Implemented', 'status'),

-- Priority translations  
('priority.low', 'منخفض', 'Low', 'priority'),
('priority.medium', 'متوسط', 'Medium', 'priority'),
('priority.high', 'عالي', 'High', 'priority'),
('priority.urgent', 'عاجل', 'Urgent', 'priority'),

-- Sensitivity translations
('sensitivity.normal', 'عادي', 'Normal', 'sensitivity'),
('sensitivity.sensitive', 'حساس', 'Sensitive', 'sensitivity'),
('sensitivity.classified', 'سري', 'Classified', 'sensitivity'),

-- Common UI terms
('loading', 'جاري التحميل...', 'Loading...', 'ui'),
('saving', 'جاري الحفظ...', 'Saving...', 'ui'),
('search_placeholder', 'البحث...', 'Search...', 'ui'),
('no_data', 'لا توجد بيانات', 'No data available', 'ui'),
('error_loading', 'خطأ في تحميل البيانات', 'Error loading data', 'ui'),
('success', 'نجح', 'Success', 'ui'),
('error', 'خطأ', 'Error', 'ui'),

-- Form labels
('label.title', 'العنوان', 'Title', 'form'),
('label.description', 'الوصف', 'Description', 'form'),
('label.start_date', 'تاريخ البداية', 'Start Date', 'form'),
('label.end_date', 'تاريخ النهاية', 'End Date', 'form'),
('label.budget', 'الميزانية', 'Budget', 'form'),
('label.status', 'الحالة', 'Status', 'form'),
('label.priority', 'الأولوية', 'Priority', 'form'),
('label.type', 'النوع', 'Type', 'form'),

-- Skip and validation
('skip', 'تخطي', 'Skip', 'ui'),
('validating', 'جاري التحقق...', 'Validating...', 'ui'),

-- Question types
('question_type.open_ended', 'سؤال مفتوح', 'Open Ended', 'question'),
('question_type.multiple_choice', 'متعدد الخيارات', 'Multiple Choice', 'question'),
('question_type.yes_no', 'نعم/لا', 'Yes/No', 'question'),
('question_type.rating', 'تقييم', 'Rating', 'question'),
('question_type.ranking', 'ترتيب', 'Ranking', 'question')

ON CONFLICT (translation_key) DO UPDATE SET
  text_ar = EXCLUDED.text_ar,
  text_en = EXCLUDED.text_en,
  updated_at = NOW();