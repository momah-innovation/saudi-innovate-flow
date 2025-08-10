-- Add missing translation keys for OpportunityWizard component
INSERT INTO public.system_translations (translation_key, text_ar, text_en, category) VALUES
-- OpportunityWizard form labels and validation messages
('opportunity_wizard.title_required', 'عنوان الفرصة مطلوب', 'Opportunity title is required', 'validation'),
('opportunity_wizard.title_min_length', 'يجب أن يكون عنوان الفرصة أكثر من 5 أحرف', 'Opportunity title must be more than 5 characters', 'validation'),
('opportunity_wizard.description_required', 'وصف الفرصة مطلوب', 'Opportunity description is required', 'validation'),
('opportunity_wizard.description_min_length', 'يجب أن يكون وصف الفرصة أكثر من 30 حرف', 'Opportunity description must be more than 30 characters', 'validation'),
('opportunity_wizard.type_required', 'نوع الفرصة مطلوب', 'Opportunity type is required', 'validation'),
('opportunity_wizard.title_label', 'عنوان الفرصة', 'Opportunity Title', 'opportunity_wizard'),
('opportunity_wizard.description_label', 'وصف الفرصة', 'Opportunity Description', 'opportunity_wizard'),
('opportunity_wizard.type_label', 'نوع الفرصة', 'Opportunity Type', 'opportunity_wizard'),
('opportunity_wizard.status_label', 'حالة الفرصة', 'Opportunity Status', 'opportunity_wizard'),
('opportunity_wizard.basic_info_title', 'المعلومات الأساسية', 'Basic Information', 'opportunity_wizard'),
('opportunity_wizard.basic_info_description', 'أدخل المعلومات الأساسية للفرصة', 'Enter basic opportunity information', 'opportunity_wizard'),
('opportunity_wizard.details_title', 'التفاصيل والمتطلبات', 'Details & Requirements', 'opportunity_wizard'),
('opportunity_wizard.details_description', 'حدد متطلبات وتفاصيل الفرصة', 'Set opportunity requirements and details', 'opportunity_wizard'),
('opportunity_wizard.edit_title', 'تعديل الفرصة', 'Edit Opportunity', 'opportunity_wizard'),
('opportunity_wizard.create_title', 'فرصة جديدة', 'New Opportunity', 'opportunity_wizard'),

-- Remaining hardcoded strings in the component
('opportunity_wizard.title_placeholder', 'أدخل عنوان الفرصة', 'Enter opportunity title', 'opportunity_wizard'),
('opportunity_wizard.title_help', 'عنوان واضح وجذاب للفرصة', 'Clear and attractive title for the opportunity', 'opportunity_wizard'),
('opportunity_wizard.description_placeholder', 'اكتب وصفاً مفصلاً للفرصة', 'Write a detailed description of the opportunity', 'opportunity_wizard'),
('opportunity_wizard.description_help', 'وصف شامل يوضح تفاصيل الفرصة', 'Comprehensive description explaining the opportunity details', 'opportunity_wizard'),
('opportunity_wizard.type_placeholder', 'اختر نوع الفرصة', 'Select opportunity type', 'opportunity_wizard'),
('opportunity_wizard.requirements_label', 'المتطلبات', 'Requirements', 'opportunity_wizard'),
('opportunity_wizard.requirements_placeholder', 'أدخل متطلبات الفرصة', 'Enter opportunity requirements', 'opportunity_wizard'),
('opportunity_wizard.benefits_label', 'المزايا', 'Benefits', 'opportunity_wizard'),
('opportunity_wizard.benefits_placeholder', 'أدخل مزايا الفرصة', 'Enter opportunity benefits', 'opportunity_wizard'),
('opportunity_wizard.deadline_label', 'موعد انتهاء التقديم', 'Application Deadline', 'opportunity_wizard'),
('opportunity_wizard.deadline_required', 'موعد انتهاء التقديم مطلوب', 'Application deadline is required', 'validation'),
('opportunity_wizard.email_invalid', 'البريد الإلكتروني غير صحيح', 'Invalid email address', 'validation'),
('opportunity_wizard.salary_max_error', 'الحد الأقصى للراتب يجب أن يكون أكبر من الحد الأدنى', 'Maximum salary must be greater than minimum salary', 'validation'),
('opportunity_wizard.save_error_title', 'خطأ', 'Error', 'error'),
('opportunity_wizard.save_error_description', 'فشل في حفظ الفرصة', 'Failed to save opportunity', 'error')

ON CONFLICT (translation_key) DO UPDATE SET
text_ar = EXCLUDED.text_ar,
text_en = EXCLUDED.text_en,
category = EXCLUDED.category;