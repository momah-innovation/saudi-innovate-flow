-- IdeaWizard Translation Keys
INSERT INTO public.system_translations (translation_key, text_en, text_ar, category) VALUES

-- Status labels
('idea_status.draft', 'Draft', 'مسودة', 'idea_status'),
('idea_status.submitted', 'Submitted', 'مُرسلة', 'idea_status'),
('idea_status.under_review', 'Under Review', 'قيد المراجعة', 'idea_status'),
('idea_status.approved', 'Approved', 'موافق عليها', 'idea_status'),
('idea_status.rejected', 'Rejected', 'مرفوضة', 'idea_status'),
('idea_status.in_development', 'In Development', 'قيد التطوير', 'idea_status'),
('idea_status.implemented', 'Implemented', 'منفذة', 'idea_status'),

-- Maturity levels
('idea_maturity.concept', 'Concept', 'مفهوم', 'idea_maturity'),
('idea_maturity.prototype', 'Prototype', 'نموذج أولي', 'idea_maturity'),
('idea_maturity.pilot', 'Pilot', 'تجريبي', 'idea_maturity'),
('idea_maturity.scaling', 'Scalable', 'قابل للتوسع', 'idea_maturity'),

-- Innovator display
('idea_wizard.innovator_prefix', 'Innovator', 'مبتكر', 'idea_wizard'),
('idea_wizard.not_specified', 'Not specified', 'غير محدد', 'idea_wizard'),
('idea_wizard.points_label', 'points', 'نقاط', 'idea_wizard'),

-- Validation messages
('idea_wizard.title_required', 'Idea title is required', 'عنوان الفكرة مطلوب', 'idea_wizard'),
('idea_wizard.title_min_length', 'Idea title must be more than 10 characters', 'يجب أن يكون عنوان الفكرة أكثر من 10 أحرف', 'idea_wizard'),
('idea_wizard.description_required', 'Idea description is required', 'وصف الفكرة مطلوب', 'idea_wizard'),
('idea_wizard.description_min_length', 'Idea description must be more than 50 characters', 'يجب أن يكون وصف الفكرة أكثر من 50 حرف', 'idea_wizard'),
('idea_wizard.innovator_required', 'Must select an innovator', 'يجب اختيار المبتكر', 'idea_wizard'),
('idea_wizard.status_required', 'Idea status is required', 'حالة الفكرة مطلوبة', 'idea_wizard'),
('idea_wizard.maturity_required', 'Maturity level is required', 'مستوى النضج مطلوب', 'idea_wizard'),
('idea_wizard.challenge_required_when_submitted', 'Must select related challenge when submitting idea', 'يجب اختيار التحدي المرتبط عند تقديم الفكرة', 'idea_wizard'),
('idea_wizard.focus_question_required_when_submitted', 'Must select related focus question when submitting idea', 'يجب اختيار السؤال المحوري المرتبط عند تقديم الفكرة', 'idea_wizard'),

-- Success messages
('idea_wizard.update_success_title', 'Update Successful', 'نجح التحديث', 'idea_wizard'),
('idea_wizard.update_success_description', 'Idea updated successfully', 'تم تحديث الفكرة بنجاح', 'idea_wizard'),
('idea_wizard.create_success_title', 'Creation Successful', 'نجح الإنشاء', 'idea_wizard'),
('idea_wizard.create_success_description', 'Idea created successfully', 'تم إنشاء الفكرة بنجاح', 'idea_wizard'),

-- Error messages
('idea_wizard.duplicate_title_error', 'An idea with the same title already exists', 'يوجد فكرة بنفس العنوان بالفعل', 'idea_wizard'),
('idea_wizard.constraint_error', 'Error in input constraints', 'خطأ في القيود المدخلة', 'idea_wizard'),
('idea_wizard.save_error_title', 'Error', 'خطأ', 'idea_wizard'),
('idea_wizard.save_error_description', 'Failed to save idea', 'فشل في حفظ الفكرة', 'idea_wizard'),

-- Step titles and descriptions
('idea_wizard.basic_info_title', 'Basic Information', 'المعلومات الأساسية', 'idea_wizard'),
('idea_wizard.basic_info_description', 'Enter basic information for the idea', 'أدخل المعلومات الأساسية للفكرة', 'idea_wizard'),

-- Form labels
('idea_wizard.title_label', 'Idea Title *', 'عنوان الفكرة *', 'idea_wizard'),
('idea_wizard.description_label', 'Idea Description *', 'وصف الفكرة *', 'idea_wizard'),
('idea_wizard.innovator_label', 'Innovator *', 'المبتكر *', 'idea_wizard'),

-- Placeholders
('idea_wizard.title_placeholder', 'Enter idea title', 'أدخل عنوان الفكرة', 'idea_wizard'),
('idea_wizard.description_placeholder', 'Write a detailed description of the idea and its objectives', 'اكتب وصفاً مفصلاً للفكرة وأهدافها', 'idea_wizard'),
('idea_wizard.innovator_placeholder', 'Select innovator', 'اختر المبتكر', 'idea_wizard'),

-- Help text
('idea_wizard.title_help', 'Title should be descriptive and clear', 'يجب أن يكون العنوان وصفياً وواضحاً', 'idea_wizard'),
('idea_wizard.description_help', 'Comprehensive description explaining the idea and its objectives (at least 50 characters)', 'وصف شامل يوضح الفكرة وأهدافها (لا يقل عن 50 حرف)', 'idea_wizard'),

-- Comments
('idea_wizard.fetch_data_failed', 'Failed to fetch idea wizard data - using default options', 'فشل في تحميل بيانات معالج الفكرة - استخدام الخيارات الافتراضية', 'idea_wizard'),
('idea_wizard.update_existing', 'Update existing idea', 'تحديث الفكرة الموجودة', 'idea_wizard'),
('idea_wizard.create_new', 'Create new idea', 'إنشاء فكرة جديدة', 'idea_wizard')

ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = now();