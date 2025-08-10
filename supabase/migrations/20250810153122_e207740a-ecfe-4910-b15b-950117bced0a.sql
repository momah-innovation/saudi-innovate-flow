-- Add comprehensive translation keys for admin interface
INSERT INTO public.system_translations (translation_key, text_en, text_ar, category) VALUES

-- Challenge Management
('admin.challenges.title', 'Challenge Management', 'إدارة التحديات', 'admin'),
('admin.challenges.description', 'Create and manage innovation challenges', 'إنشاء وإدارة التحديات الابتكارية', 'admin'),
('admin.challenges.new_challenge', 'New Challenge', 'تحدي جديد', 'admin'),
('admin.challenges.no_challenges', 'No challenges found', 'لا توجد تحديات', 'admin'),
('admin.challenges.no_challenges_description', 'Start by creating a new innovation challenge to attract creative ideas', 'ابدأ بإنشاء تحدي ابتكاري جديد لجذب الأفكار المبدعة', 'admin'),
('admin.challenges.create_new', 'Create New Challenge', 'إنشاء تحدي جديد', 'admin'),
('admin.challenges.start_date', 'Start Date', 'تاريخ البداية', 'admin'),
('admin.challenges.end_date', 'End Date', 'تاريخ النهاية', 'admin'),
('admin.challenges.estimated_budget', 'Estimated Budget', 'الميزانية المقدرة', 'admin'),
('admin.challenges.sensitivity_level', 'Sensitivity Level', 'مستوى الحساسية', 'admin'),
('admin.challenges.currency', 'SAR', 'ريال', 'admin'),
('admin.challenges.delete_confirm', 'Are you sure you want to delete "{title}"?', 'هل أنت متأكد من حذف "{title}"؟', 'admin'),

-- Focus Questions
('admin.focus_questions.question_text_required', 'Question text is required', 'نص السؤال مطلوب', 'validation'),
('admin.focus_questions.question_text_min_length', 'Question text must be more than 10 characters', 'يجب أن يكون نص السؤال أكثر من 10 أحرف', 'validation'),
('admin.focus_questions.question_type_required', 'Question type is required', 'نوع السؤال مطلوب', 'validation'),
('admin.focus_questions.order_sequence_positive', 'Question order must be zero or positive', 'ترتيب السؤال يجب أن يكون صفر أو أكثر', 'validation'),
('admin.focus_questions.content_step_title', 'Question Content', 'محتوى السؤال', 'wizard'),
('admin.focus_questions.question_text_label', 'Focus Question Text *', 'نص السؤال المحوري *', 'form'),
('admin.focus_questions.question_text_help', 'The question should be clear and understandable, not less than 10 characters', 'يجب أن يكون السؤال واضحاً ومفهوماً ولا يقل عن 10 أحرف', 'form'),
('admin.focus_questions.details_step_title', 'Question Details', 'تفاصيل السؤال', 'wizard'),
('admin.focus_questions.details_step_description', 'Set question type and order', 'حدد نوع السؤال وترتيبه', 'wizard'),
('admin.focus_questions.question_type_label', 'Question Type *', 'نوع السؤال *', 'form'),
('admin.focus_questions.order_sequence_label', 'Question Order', 'ترتيب السؤال', 'form'),
('admin.focus_questions.link_step_title', 'Link Question', 'ربط السؤال', 'wizard'),
('admin.focus_questions.link_step_description', 'Link question to specific challenge (optional)', 'ربط السؤال بتحدي محدد (اختياري)', 'wizard'),
('admin.focus_questions.challenge_link_label', 'Linked Challenge (optional)', 'التحدي المرتبط (اختياري)', 'form'),
('admin.focus_questions.no_challenge_link', 'No specific challenge link', 'بدون ربط بتحدي محدد', 'form'),
('admin.focus_questions.link_help', 'You can link the question to a specific challenge or keep it general for all challenges', 'يمكن ربط السؤال بتحدي محدد أو تركه عاماً لجميع التحديات', 'form'),
('admin.focus_questions.settings_step_title', 'Question Settings', 'إعدادات السؤال', 'wizard'),
('admin.focus_questions.settings_step_description', 'Privacy and security settings', 'إعدادات الخصوصية والأمان', 'wizard'),
('admin.focus_questions.edit_title', 'Edit Focus Question', 'تعديل السؤال المحوري', 'wizard'),
('admin.focus_questions.add_title', 'Add New Focus Question', 'إضافة سؤال محوري جديد', 'wizard'),

-- Campaign Management
('admin.campaigns.success_metrics_placeholder', 'Enter success metrics and required indicators', 'أدخل مقاييس النجاح والمؤشرات المطلوب تحقيقها', 'form'),
('admin.campaigns.manager_label', 'Campaign Manager', 'مدير الحملة', 'form'),
('admin.campaigns.choose_manager', 'Choose Campaign Manager', 'اختر مدير الحملة', 'form'),
('admin.campaigns.search_manager', 'Search for manager...', 'ابحث عن مدير...', 'form'),
('admin.campaigns.no_results', 'No results found', 'لا توجد نتائج', 'form'),
('admin.campaigns.start_date_label', 'Start Date *', 'تاريخ البداية *', 'form'),
('admin.campaigns.end_date_label', 'End Date *', 'تاريخ النهاية *', 'form'),

-- Common UI Elements
('ui.status_label', 'Status', 'الحالة', 'ui'),
('ui.all', 'All', 'الكل', 'ui'),
('ui.view', 'View', 'عرض', 'action'),
('ui.edit', 'Edit', 'تعديل', 'action'),
('ui.settings', 'Settings', 'إعدادات', 'action'),
('ui.delete', 'Delete', 'حذف', 'action')

ON CONFLICT (translation_key) DO UPDATE SET
text_en = EXCLUDED.text_en,
text_ar = EXCLUDED.text_ar,
category = EXCLUDED.category;