-- Add only the missing translation keys for admin components

INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- AdminChallengeManagement missing keys (add only if not exists)
('admin.challenges.no_challenges', 'No challenges found', 'لم يتم العثور على تحديات', 'admin'),
('admin.challenges.no_challenges_description', 'Start by creating a new innovation challenge to attract creative ideas', 'ابدأ بإنشاء تحدي ابتكار جديد لجذب الأفكار الإبداعية', 'admin'),
('admin.challenges.create_new', 'Create New Challenge', 'إنشاء تحدي جديد', 'admin'),
('admin.challenges.start_date', 'Start Date', 'تاريخ البداية', 'admin'),
('admin.challenges.end_date', 'End Date', 'تاريخ النهاية', 'admin'),
('admin.challenges.estimated_budget', 'Estimated Budget', 'الميزانية المقدرة', 'admin'),
('admin.challenges.currency', 'SAR', 'ريال سعودي', 'admin'),
('admin.challenges.sensitivity_level', 'Sensitivity Level', 'مستوى الحساسية', 'admin'),
('admin.challenges.delete_confirm', 'Are you sure you want to delete this challenge?', 'هل أنت متأكد من رغبتك في حذف هذا التحدي؟', 'admin'),

-- AdminFocusQuestionWizard missing keys  
('admin.focus_questions.question_text_required', 'Question text is required', 'نص السؤال مطلوب', 'admin'),
('admin.focus_questions.question_text_min_length', 'Question text must be more than 10 characters', 'نص السؤال يجب أن يكون أكثر من 10 أحرف', 'admin'),
('admin.focus_questions.question_type_required', 'Question type is required', 'نوع السؤال مطلوب', 'admin'),
('admin.focus_questions.order_sequence_positive', 'Question order must be zero or positive', 'ترتيب السؤال يجب أن يكون صفر أو موجب', 'admin'),
('admin.focus_questions.content_step_title', 'Question Content', 'محتوى السؤال', 'admin'),
('admin.focus_questions.question_text_label', 'Focus Question Text *', 'نص السؤال المحوري *', 'admin'),
('admin.focus_questions.question_text_help', 'The question should be clear and understandable, not less than 10 characters', 'يجب أن يكون السؤال واضحًا ومفهومًا، لا يقل عن 10 أحرف', 'admin'),
('admin.focus_questions.details_step_title', 'Question Details', 'تفاصيل السؤال', 'admin'),
('admin.focus_questions.details_step_description', 'Set question type and order', 'تحديد نوع السؤال والترتيب', 'admin'),
('admin.focus_questions.question_type_label', 'Question Type *', 'نوع السؤال *', 'admin'),
('admin.focus_questions.order_sequence_label', 'Question Order', 'ترتيب السؤال', 'admin'),
('admin.focus_questions.link_step_title', 'Link Question', 'ربط السؤال', 'admin'),
('admin.focus_questions.link_step_description', 'Link question to specific challenge (optional)', 'ربط السؤال بتحدي معين (اختياري)', 'admin'),
('admin.focus_questions.challenge_link_label', 'Linked Challenge (optional)', 'التحدي المرتبط (اختياري)', 'admin'),
('admin.focus_questions.no_challenge_link', 'No specific challenge link', 'لا يوجد ربط بتحدي معين', 'admin'),
('admin.focus_questions.link_help', 'You can link the question to a specific challenge or keep it general for all challenges', 'يمكنك ربط السؤال بتحدي معين أو الاحتفاظ به عامًا لجميع التحديات', 'admin'),
('admin.focus_questions.settings_step_title', 'Question Settings', 'إعدادات السؤال', 'admin'),
('admin.focus_questions.settings_step_description', 'Privacy and security settings', 'إعدادات الخصوصية والأمان', 'admin'),
('admin.focus_questions.edit_title', 'Edit Focus Question', 'تحرير السؤال المحوري', 'admin'),
('admin.focus_questions.add_title', 'Add New Focus Question', 'إضافة سؤال محوري جديد', 'admin'),

-- Common terms and placeholders
('vision_2030_goal', 'Vision 2030 Goal', 'هدف رؤية 2030', 'admin'),
('collaboration_details', 'Collaboration Details', 'تفاصيل التعاون', 'admin'),
('description.enter_question_details', 'Enter question details', 'أدخل تفاصيل السؤال', 'description'),
('placeholder.enter_question_text', 'Enter the focus question text...', 'أدخل نص السؤال المحوري...', 'placeholder'),
('placeholder.select_challenge', 'Select a challenge', 'اختر تحديًا', 'placeholder'),
('form.sensitive_question', 'Sensitive Question', 'سؤال حساس', 'form'),
('description.sensitive_questions', 'Mark this question as sensitive if it contains confidential information', 'ضع علامة على هذا السؤال كحساس إذا كان يحتوي على معلومات سرية', 'description')

ON CONFLICT (translation_key) DO NOTHING;