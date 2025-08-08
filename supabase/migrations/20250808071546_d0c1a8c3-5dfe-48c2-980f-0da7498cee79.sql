-- Add missing translation keys for remaining hardcoded text

-- AdminChallengeManagement translations
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('filter.all_status', 'All', 'الكل', 'ui'),
('label.status_filter', 'Status', 'الحالة', 'ui'), 
('title.challenge_management', 'Challenge Management', 'إدارة التحديات', 'admin'),
('description.challenge_management', 'Create and manage innovation challenges', 'إنشاء وإدارة التحديات الابتكارية', 'admin'),
('button.new_challenge', 'New Challenge', 'تحدي جديد', 'admin'),
('empty.no_challenges_title', 'No challenges found', 'لا توجد تحديات', 'admin'),
('empty.no_challenges_description', 'Start by creating a new innovation challenge to attract creative ideas', 'ابدأ بإنشاء تحدي ابتكاري جديد لجذب الأفكار المبدعة', 'admin'),
('button.create_new_challenge', 'Create New Challenge', 'إنشاء تحدي جديد', 'admin'),
('label.start_date', 'Start Date', 'تاريخ البداية', 'form'),
('label.end_date', 'End Date', 'تاريخ النهاية', 'form'),
('label.estimated_budget', 'Estimated Budget', 'الميزانية المقدرة', 'form'),
('currency.sar', 'SAR', 'ريال', 'ui'),
('label.sensitivity_level', 'Sensitivity Level', 'مستوى الحساسية', 'form'),
('action.view', 'View', 'عرض', 'ui'),
('action.edit', 'Edit', 'تعديل', 'ui'),
('action.settings', 'Settings', 'إعدادات', 'ui'),
('action.delete', 'Delete', 'حذف', 'ui'),
('confirm.delete_challenge', 'Are you sure you want to delete "{title}"?', 'هل أنت متأكد من حذف "{title}"؟', 'ui'),

-- AdminFocusQuestionWizard translations
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('error.question_text_required', 'Question text is required', 'نص السؤال مطلوب', 'validation'),
('error.question_text_min_length', 'Question text must be more than 10 characters', 'يجب أن يكون نص السؤال أكثر من 10 أحرف', 'validation'),
('error.question_type_required', 'Question type is required', 'نوع السؤال مطلوب', 'validation'),
('error.order_sequence_min', 'Question order must be zero or greater', 'ترتيب السؤال يجب أن يكون صفر أو أكثر', 'validation'),
('step.question_content', 'Question Content', 'محتوى السؤال', 'form'),
('label.focus_question_text', 'Focus Question Text', 'نص السؤال المحوري', 'form'),
('help.question_clarity', 'The question should be clear and understandable and not less than 10 characters', 'يجب أن يكون السؤال واضحاً ومفهوماً ولا يقل عن 10 أحرف', 'form'),
('step.question_details', 'Question Details', 'تفاصيل السؤال', 'form'),
('step.question_details_description', 'Set question type and order', 'حدد نوع السؤال وترتيبه', 'form'),
('label.question_type', 'Question Type', 'نوع السؤال', 'form'),
('label.question_order', 'Question Order', 'ترتيب السؤال', 'form'),
('step.link_question', 'Link Question', 'ربط السؤال', 'form'),
('step.link_question_description', 'Link question to a specific challenge (optional)', 'ربط السؤال بتحدي محدد (اختياري)', 'form'),
('label.linked_challenge', 'Linked Challenge (Optional)', 'التحدي المرتبط (اختياري)', 'form'),
('option.no_challenge_link', 'No link to specific challenge', 'بدون ربط بتحدي محدد', 'form'),
('help.challenge_link', 'You can link the question to a specific challenge or leave it general for all challenges', 'يمكن ربط السؤال بتحدي محدد أو تركه عاماً لجميع التحديات', 'form'),
('step.question_settings', 'Question Settings', 'إعدادات السؤال', 'form'),
('step.question_settings_description', 'Privacy and security settings', 'إعدادات الخصوصية والأمان', 'form'),
('title.edit_focus_question', 'Edit Focus Question', 'تعديل السؤال المحوري', 'admin'),
('title.add_focus_question', 'Add New Focus Question', 'إضافة سؤال محوري جديد', 'admin'),

-- CampaignWizard remaining translations
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('label.target_participants', 'Target Participants', 'عدد المشاركين المستهدف', 'form'),
('placeholder.enter_participants_count', 'Enter participants count', 'أدخل عدد المشاركين', 'form'),
('label.target_ideas', 'Target Ideas', 'عدد الأفكار المستهدف', 'form'),
('placeholder.enter_ideas_count', 'Enter ideas count', 'أدخل عدد الأفكار', 'form'),
('label.success_metrics', 'Success Metrics', 'مقاييس النجاح', 'form'),

-- CampaignsManagement translations  
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('title.campaigns_management', 'Campaign Management', 'إدارة الحملات', 'admin'),
('description.campaigns_management', 'Create and manage innovation campaigns', 'إنشاء وإدارة حملات الابتكار', 'admin'),
('button.new_campaign', 'New Campaign', 'حملة جديدة', 'admin'),
('empty.no_campaigns_title', 'No campaigns found', 'لا توجد حملات', 'admin'),
('empty.no_campaigns_description', 'Start by creating a new innovation campaign to attract creative ideas', 'ابدأ بإنشاء حملة ابتكار جديدة لجذب الأفكار المبدعة', 'admin'),
('button.create_new_campaign', 'Create New Campaign', 'إنشاء حملة جديدة', 'admin'),
('confirm.delete_campaign', 'Are you sure you want to delete "{title}"?', 'هل أنت متأكد من حذف "{title}"؟', 'ui'),

-- EventsManagement translations
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('title.events_management', 'Events Management', 'إدارة الفعاليات', 'admin'),
('description.events_management', 'Create and manage innovation events', 'إنشاء وإدارة فعاليات الابتكار', 'admin'),
('button.new_event', 'New Event', 'فعالية جديدة', 'admin'),
('empty.no_events_title', 'No events found', 'لا توجد فعاليات', 'admin'),
('empty.no_events_description', 'Start by creating a new innovation event to engage participants', 'ابدأ بإنشاء فعالية ابتكار جديدة لإشراك المشاركين', 'admin'),
('button.create_new_event', 'إنشاء فعالية جديدة', 'إنشاء فعالية جديدة', 'admin'),
('label.event_date', 'Event Date', 'تاريخ الفعالية', 'form'),
('label.location', 'Location', 'الموقع', 'form'),
('label.max_participants', 'Max Participants', 'الحد الأقصى للمشاركين', 'form'),
('confirm.delete_event', 'Are you sure you want to delete "{title}"?', 'هل أنت متأكد من حذف "{title}"؟', 'ui');