-- Add remaining missing translation keys for OpportunityWizard and other components
INSERT INTO public.system_translations (translation_key, text_ar, text_en, category) VALUES
-- OpportunityWizard remaining labels
('form.contact_person_label', 'الشخص المسؤول', 'Contact Person', 'form'),
('form.contact_person_placeholder', 'اسم الشخص المسؤول', 'Contact person name', 'form'),
('form.select_department', 'اختر القسم', 'Select department', 'form'),
('form.no_department', 'بدون قسم محدد', 'No specific department', 'form'),
('form.remote_work', 'عمل عن بُعد', 'Remote work', 'form'),
('form.location_label', 'الموقع', 'Location', 'form'),
('form.location_placeholder', 'أدخل موقع العمل', 'Enter work location', 'form'),
('form.salary_range', 'نطاق الراتب', 'Salary Range', 'form'),
('form.salary_min_label', 'الحد الأدنى', 'Minimum', 'form'),
('form.salary_max_label', 'الحد الأقصى', 'Maximum', 'form'),
('form.currency_label', 'العملة', 'Currency', 'form'),

-- OrganizationalStructureManagement labels
('form.department_head_label', 'رئيس القسم', 'Department Head', 'form'),
('form.budget_allocation_label', 'الميزانية المخصصة', 'Budget Allocation', 'form'),
('form.deputy_minister_label', 'نائب الوزير', 'Deputy Minister', 'form'),
('form.domain_lead_label', 'قائد النطاق', 'Domain Lead', 'form'),
('form.specialization_label', 'التخصص', 'Specialization', 'form'),
('form.technical_focus_label', 'التركيز التقني', 'Technical Focus', 'form'),
('form.service_type_label', 'نوع الخدمة', 'Service Type', 'form'),
('form.citizen_facing_label', 'خدمة للمواطنين', 'Citizen Facing', 'form'),
('form.digital_maturity_score_label', 'نقاط النضج الرقمي', 'Digital Maturity Score', 'form'),

-- Team management labels
('team_wizard.description_required', 'وصف الفريق مطلوب', 'Team description is required', 'validation'),
('team_wizard.description_min_length', 'يجب أن يكون وصف الفريق أكثر من 20 حرف', 'Team description must be more than 20 characters', 'validation'),
('team_wizard.description_label', 'وصف الفريق', 'Team Description', 'team_wizard'),
('team_wizard.description_placeholder', 'اكتب وصفاً مفصلاً للفريق وأهدافه', 'Write a detailed description of the team and its goals', 'team_wizard'),
('team_wizard.description_help', 'وصف شامل يوضح مهام الفريق وأهدافه (لا يقل عن 20 حرف)', 'Comprehensive description explaining team tasks and goals (minimum 20 characters)', 'team_wizard'),
('team_wizard.update_success_title', 'تم التحديث بنجاح', 'Updated Successfully', 'success'),
('team_wizard.update_success_description', 'تم تحديث بيانات عضو الفريق', 'Team member data updated successfully', 'success'),
('team_wizard.member_update_button', 'تحديث العضو', 'Update Member', 'team_wizard'),
('team_wizard.member_add_button', 'إضافة العضو', 'Add Member', 'team_wizard'),

-- TeamMemberWizard labels
('team_member_wizard.role_assignment_title', 'تحديد دور العضو وتخصصاته في فريق الابتكار', 'Assign member role and specializations in innovation team', 'team_member_wizard'),
('team_member_wizard.capacity_evaluation_title', 'تحديد قدرة العمل وتقييم الأداء', 'Determine work capacity and performance evaluation', 'team_member_wizard'),
('team_member_wizard.task_title_placeholder', 'عنوان المهمة', 'Task title', 'team_member_wizard'),

-- General success and error messages
('success.update_successful', 'تم التحديث بنجاح', 'Update successful', 'success'),
('success.member_updated', 'تم تحديث بيانات العضو', 'Member data updated', 'success'),
('success.data_saved', 'تم حفظ البيانات بنجاح', 'Data saved successfully', 'success'),

-- General form actions
('form.update', 'تحديث', 'Update', 'form'),
('form.add', 'إضافة', 'Add', 'form'),
('form.save', 'حفظ', 'Save', 'form'),
('form.cancel', 'إلغاء', 'Cancel', 'form'),
('form.edit', 'تعديل', 'Edit', 'form'),
('form.delete', 'حذف', 'Delete', 'form'),
('form.submit', 'إرسال', 'Submit', 'form'),
('form.create', 'إنشاء', 'Create', 'form')

ON CONFLICT (translation_key) DO UPDATE SET
text_ar = EXCLUDED.text_ar,
text_en = EXCLUDED.text_en,
category = EXCLUDED.category;