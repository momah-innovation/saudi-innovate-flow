-- Add comprehensive translation keys for TeamWizard and StakeholderWizard components
INSERT INTO public.system_translations (translation_key, text_ar, text_en, category) VALUES
-- Team Wizard translations
('team_wizard.status_active', 'نشط', 'Active', 'team_wizard'),
('team_wizard.status_inactive', 'غير نشط', 'Inactive', 'team_wizard'),
('team_wizard.status_disbanded', 'منحل', 'Disbanded', 'team_wizard'),
('team_wizard.name_required', 'اسم الفريق مطلوب', 'Team name is required', 'team_wizard'),
('team_wizard.name_min_length', 'يجب أن يكون اسم الفريق أكثر من 3 أحرف', 'Team name must be more than 3 characters', 'team_wizard'),
('team_wizard.description_required', 'وصف الفريق مطلوب', 'Team description is required', 'team_wizard'),
('team_wizard.description_min_length', 'يجب أن يكون وصف الفريق أكثر من 20 حرف', 'Team description must be more than 20 characters', 'team_wizard'),
('team_wizard.type_required', 'نوع الفريق مطلوب', 'Team type is required', 'team_wizard'),
('team_wizard.status_required', 'حالة الفريق مطلوبة', 'Team status is required', 'team_wizard'),
('team_wizard.manager_required', 'يجب اختيار مدير الفريق', 'Team manager must be selected', 'team_wizard'),
('team_wizard.max_members_min', 'يجب أن يكون الحد الأقصى للأعضاء أكثر من 1', 'Maximum members must be more than 1', 'team_wizard'),
('team_wizard.create_success', 'نجح الإنشاء', 'Creation Successful', 'team_wizard'),
('team_wizard.create_success_description', 'تم إنشاء الفريق بنجاح', 'Team created successfully', 'team_wizard'),
('team_wizard.duplicate_name_error', 'يوجد فريق بنفس الاسم بالفعل', 'A team with the same name already exists', 'team_wizard'),
('team_wizard.constraint_error', 'خطأ في القيود المدخلة', 'Input constraint error', 'team_wizard'),
('team_wizard.error', 'خطأ', 'Error', 'team_wizard'),
('team_wizard.save_failed', 'فشل في حفظ الفريق', 'Failed to save team', 'team_wizard'),
('team_wizard.basic_info', 'المعلومات الأساسية', 'Basic Information', 'team_wizard'),
('team_wizard.basic_info_description', 'أدخل المعلومات الأساسية للفريق', 'Enter basic team information', 'team_wizard'),
('team_wizard.team_name', 'اسم الفريق', 'Team Name', 'team_wizard'),
('team_wizard.team_name_placeholder', 'أدخل اسم الفريق', 'Enter team name', 'team_wizard'),
('team_wizard.name_hint', 'يجب أن يكون الاسم وصفياً وواضحاً', 'Name should be descriptive and clear', 'team_wizard'),

-- Stakeholder Wizard translations (additional keys)
('stakeholder_wizard.contact_info', 'معلومات الاتصال', 'Contact Information', 'stakeholder_wizard'),
('stakeholder_wizard.contact_info_description', 'أضف تفاصيل الاتصال', 'Add contact details', 'stakeholder_wizard'),
('stakeholder_wizard.email', 'البريد الإلكتروني', 'Email', 'stakeholder_wizard'),
('stakeholder_wizard.email_placeholder', 'أدخل البريد الإلكتروني', 'Enter email address', 'stakeholder_wizard'),
('stakeholder_wizard.phone', 'رقم الهاتف', 'Phone Number', 'stakeholder_wizard'),
('stakeholder_wizard.phone_placeholder', 'أدخل رقم الهاتف (اختياري)', 'Enter phone number (optional)', 'stakeholder_wizard'),
('stakeholder_wizard.engagement_details', 'تفاصيل المشاركة', 'Engagement Details', 'stakeholder_wizard'),
('stakeholder_wizard.engagement_details_description', 'حدد مستويات التأثير والمشاركة', 'Define influence and engagement levels', 'stakeholder_wizard'),
('stakeholder_wizard.influence_level', 'مستوى التأثير', 'Influence Level', 'stakeholder_wizard'),
('stakeholder_wizard.select_influence_level', 'اختر مستوى التأثير', 'Select influence level', 'stakeholder_wizard'),
('stakeholder_wizard.additional_notes', 'ملاحظات إضافية', 'Additional Notes', 'stakeholder_wizard'),
('stakeholder_wizard.additional_notes_description', 'أضف أي معلومات أو ملاحظات إضافية', 'Add any additional information or notes', 'stakeholder_wizard'),
('stakeholder_wizard.notes', 'ملاحظات', 'Notes', 'stakeholder_wizard'),
('stakeholder_wizard.notes_placeholder', 'أدخل أي ملاحظات إضافية حول صاحب المصلحة هذا...', 'Enter any additional notes about this stakeholder...', 'stakeholder_wizard')

ON CONFLICT (translation_key) DO UPDATE SET
text_ar = EXCLUDED.text_ar,
text_en = EXCLUDED.text_en,
category = EXCLUDED.category;