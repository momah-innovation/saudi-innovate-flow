-- Add missing translation keys for IdeaWizard component
INSERT INTO public.system_translations (translation_key, text_ar, text_en, category) VALUES
-- IdeaWizard form labels and messages
('idea_wizard.edit_title', 'تعديل الفكرة', 'Edit Idea', 'idea_wizard'),
('idea_wizard.create_title', 'إضافة فكرة جديدة', 'Add New Idea', 'idea_wizard'),
('idea_wizard.basic_info_title', 'المعلومات الأساسية', 'Basic Information', 'idea_wizard'),
('idea_wizard.basic_info_description', 'أدخل المعلومات الأساسية للفكرة', 'Enter basic idea information', 'idea_wizard'),
('idea_wizard.title_label', 'عنوان الفكرة', 'Idea Title', 'idea_wizard'),
('idea_wizard.title_placeholder', 'أدخل عنوان الفكرة', 'Enter idea title', 'idea_wizard'),
('idea_wizard.title_help', 'عنوان واضح ومختصر للفكرة', 'Clear and concise title for the idea', 'idea_wizard'),
('idea_wizard.description_label', 'وصف الفكرة', 'Idea Description', 'idea_wizard'),
('idea_wizard.description_placeholder', 'اكتب وصفاً مفصلاً للفكرة', 'Write a detailed description of the idea', 'idea_wizard'),
('idea_wizard.description_help', 'وصف شامل يوضح الفكرة والمشكلة التي تحلها', 'Comprehensive description explaining the idea and problem it solves', 'idea_wizard'),
('idea_wizard.innovator_label', 'المبتكر', 'Innovator', 'idea_wizard'),
('idea_wizard.innovator_placeholder', 'اختر المبتكر', 'Select innovator', 'idea_wizard'),
('idea_wizard.points_label', 'النقاط', 'Points', 'idea_wizard'),
('idea_wizard.innovator_prefix', 'مبتكر', 'Innovator', 'idea_wizard'),
('idea_wizard.not_specified', 'غير محدد', 'Not specified', 'idea_wizard'),

-- Validation messages
('idea_wizard.title_required', 'عنوان الفكرة مطلوب', 'Idea title is required', 'validation'),
('idea_wizard.title_min_length', 'عنوان الفكرة يجب أن يكون 10 أحرف على الأقل', 'Idea title must be at least 10 characters', 'validation'),
('idea_wizard.description_required', 'وصف الفكرة مطلوب', 'Idea description is required', 'validation'),
('idea_wizard.description_min_length', 'وصف الفكرة يجب أن يكون 50 حرف على الأقل', 'Idea description must be at least 50 characters', 'validation'),
('idea_wizard.innovator_required', 'المبتكر مطلوب', 'Innovator is required', 'validation'),
('idea_wizard.status_required', 'حالة الفكرة مطلوبة', 'Idea status is required', 'validation'),
('idea_wizard.maturity_required', 'مستوى النضج مطلوب', 'Maturity level is required', 'validation'),
('idea_wizard.challenge_required_when_submitted', 'التحدي مطلوب عند تقديم الفكرة', 'Challenge is required when submitting idea', 'validation'),
('idea_wizard.focus_question_required_when_submitted', 'السؤال المحوري مطلوب عند تقديم الفكرة', 'Focus question is required when submitting idea', 'validation'),

-- Success messages
('idea_wizard.update_success_title', 'تم التحديث بنجاح', 'Updated Successfully', 'success'),
('idea_wizard.update_success_description', 'تم تحديث الفكرة بنجاح', 'Idea updated successfully', 'success'),
('idea_wizard.create_success_title', 'تم الإنشاء بنجاح', 'Created Successfully', 'success'),
('idea_wizard.create_success_description', 'تم إنشاء الفكرة بنجاح', 'Idea created successfully', 'success'),

-- Error messages
('idea_wizard.save_error_title', 'خطأ في الحفظ', 'Save Error', 'error'),
('idea_wizard.save_error_description', 'فشل في حفظ الفكرة', 'Failed to save idea', 'error'),
('idea_wizard.duplicate_title_error', 'عنوان الفكرة موجود مسبقاً', 'Idea title already exists', 'error'),
('idea_wizard.constraint_error', 'خطأ في البيانات المدخلة', 'Data constraint error', 'error')

ON CONFLICT (translation_key) DO UPDATE SET
text_ar = EXCLUDED.text_ar,
text_en = EXCLUDED.text_en,
category = EXCLUDED.category;