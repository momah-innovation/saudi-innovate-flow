-- Add remaining missing translation keys for admin components
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- Error messages
('error.load_failed', 'Failed to load', 'فشل في تحميل', 'error'),
('error.delete_failed', 'Failed to delete', 'فشل في حذف', 'error'),
('error.save_failed', 'Failed to save', 'فشل في حفظ', 'error'),
('error.update_failed', 'Failed to update', 'فشل في تحديث', 'error'),
('error.create_failed', 'Failed to create', 'فشل في إنشاء', 'error'),
('error.validation_error', 'Validation Error', 'خطأ في التحقق', 'error'),
('error.constraint_error', 'Constraint error in input', 'خطأ في القيود المدخلة', 'error'),
('error.duplicate_error', 'Similar item already exists', 'يوجد عنصر مماثل بالفعل', 'error'),

-- Success messages
('success.load_success', 'Loaded successfully', 'تم التحميل بنجاح', 'success'),
('success.delete_success', 'Deleted successfully', 'تم الحذف بنجاح', 'success'),
('success.save_success', 'Saved successfully', 'تم الحفظ بنجاح', 'success'),
('success.update_success', 'Updated successfully', 'تم التحديث بنجاح', 'success'),
('success.create_success', 'Created successfully', 'تم الإنشاء بنجاح', 'success'),
('success.challenge_deleted', 'Challenge deleted successfully', 'تم حذف التحدي بنجاح', 'success'),
('success.challenge_updated', 'Challenge updated successfully', 'تم تحديث التحدي بنجاح', 'success'),
('success.question_updated', 'Focus question updated successfully', 'تم تحديث السؤال المحوري بنجاح', 'success'),
('success.question_created', 'Focus question created successfully', 'تم إنشاء السؤال المحوري بنجاح', 'success'),

-- Form labels 
('form.campaign_title', 'Campaign Title', 'عنوان الحملة', 'form'),
('form.campaign_description', 'Campaign Description', 'وصف الحملة', 'form'),
('form.campaign_status', 'Campaign Status', 'حالة الحملة', 'form'),
('form.target_participants', 'Target Participants', 'عدد المشاركين المستهدف', 'form'),
('form.target_ideas', 'Target Ideas', 'عدد الأفكار المستهدف', 'form'),
('form.campaign_budget', 'Campaign Budget', 'ميزانية الحملة', 'form'),
('form.question_text', 'Question Text', 'نص السؤال', 'form'),
('form.question_type', 'Question Type', 'نوع السؤال', 'form'),
('form.sensitive_question', 'Sensitive Question', 'سؤال حساس', 'form'),
('form.challenge_owner', 'Challenge Owner', 'مالك التحدي', 'form'),
('form.assigned_expert', 'Assigned Expert', 'الخبير المعين', 'form'),
('form.partner_organization', 'Partner Organization', 'الجهة الشريكة', 'form'),

-- Placeholders
('placeholder.enter_campaign_title', 'Enter campaign title', 'أدخل عنوان الحملة', 'placeholder'),
('placeholder.enter_campaign_description', 'Enter detailed campaign description', 'أدخل وصف تفصيلي للحملة', 'placeholder'),
('placeholder.select_campaign_status', 'Select campaign status', 'اختر حالة الحملة', 'placeholder'),
('placeholder.enter_participants_count', 'Enter participants count', 'أدخل عدد المشاركين', 'placeholder'),
('placeholder.enter_ideas_count', 'Enter ideas count', 'أدخل عدد الأفكار', 'placeholder'),
('placeholder.enter_campaign_budget', 'Enter campaign budget', 'أدخل ميزانية الحملة', 'placeholder'),
('placeholder.enter_question_text', 'Enter the focus question text', 'أدخل نص السؤال المحوري', 'placeholder'),
('placeholder.select_challenge', 'Select challenge (optional)', 'اختر التحدي (اختياري)', 'placeholder'),
('placeholder.select_campaign_manager', 'Select campaign manager', 'اختر مدير الحملة', 'placeholder'),

-- Status labels
('status.draft', 'Draft', 'مسودة', 'status'),
('status.planning', 'Planning', 'تخطيط', 'status'),
('status.active', 'Active', 'نشط', 'status'),
('status.completed', 'Completed', 'مكتمل', 'status'),
('status.cancelled', 'Cancelled', 'ملغي', 'status'),
('status.on_hold', 'On Hold', 'معلق', 'status'),
('status.archived', 'Archived', 'مؤرشف', 'status'),
('status.female_active', 'Active (Female)', 'نشطة', 'status'),
('status.female_completed', 'Completed (Female)', 'مكتملة', 'status'),
('status.female_cancelled', 'Cancelled (Female)', 'ملغية', 'status'),
('status.female_archived', 'Archived (Female)', 'مؤرشفة', 'status'),

-- Theme options
('theme.digital_transformation', 'Digital Transformation', 'التحول الرقمي', 'theme'),
('theme.sustainability', 'Sustainability', 'الاستدامة', 'theme'),
('theme.smart_cities', 'Smart Cities', 'المدن الذكية', 'theme'),
('theme.healthcare', 'Healthcare', 'الرعاية الصحية', 'theme'),
('theme.education', 'Education', 'التعليم', 'theme'),
('theme.fintech', 'FinTech', 'التكنولوجيا المالية', 'theme'),
('theme.energy', 'Energy', 'الطاقة', 'theme'),
('theme.transportation', 'Transportation', 'النقل', 'theme'),

-- Dialog descriptions
('description.sensitive_questions', 'Sensitive questions are visible to team members only', 'الأسئلة الحساسة تكون مرئية لأعضاء الفريق فقط', 'description'),
('description.enter_question_details', 'Enter the focus question details that will be asked to innovators', 'أدخل تفاصيل السؤال المحوري الذي سيطرح على المبتكرين', 'description'),
('description.enter_success_metrics', 'Enter success metrics and indicators to be achieved', 'أدخل مقاييس النجاح والمؤشرات المطلوب تحقيقها', 'description'),

-- Question types
('question_type.open_ended', 'Open Ended', 'مفتوح', 'question_type'),
('question_type.multiple_choice', 'Multiple Choice', 'اختيار متعدد', 'question_type'),
('question_type.rating_scale', 'Rating Scale', 'مقياس تقييم', 'question_type'),
('question_type.yes_no', 'Yes/No', 'نعم/لا', 'question_type')

ON CONFLICT (translation_key) DO NOTHING;