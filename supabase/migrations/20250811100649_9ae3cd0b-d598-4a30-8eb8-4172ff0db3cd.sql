-- Add missing translation keys for continued systematic migration
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- Toast and UI elements 
('toast.assign_expert_failed', 'Failed to assign expert. Please try again.', 'فشل في تعيين الخبير. يرجى المحاولة مرة أخرى.', 'admin'),
('placeholder.assignment_notes', 'Additional notes about this assignment...', 'ملاحظات إضافية حول هذا التعيين...', 'admin'),

-- Sensitivity levels
('sensitivity.normal', 'Normal', 'عادي', 'system'),
('sensitivity.sensitive', 'Sensitive', 'حساس', 'system'),

-- Question types
('question_type.open_ended', 'Open Ended', 'سؤال مفتوح', 'questions'),
('question_type.multiple_choice', 'Multiple Choice', 'اختيار متعدد', 'questions'),
('question_type.yes_no', 'Yes/No', 'نعم/لا', 'questions'),
('question_type.rating', 'Rating', 'تقييم', 'questions'),
('question_type.ranking', 'Ranking', 'ترتيب', 'questions'),

-- Focus questions
('focus_questions.empty_title', 'No Focus Questions', 'لا توجد أسئلة تركيز', 'focus_questions'),
('focus_questions.empty_description', 'Start by creating a new focus question to guide innovators', 'ابدأ بإنشاء سؤال تركيز جديد لتوجيه المبتكرين', 'focus_questions'),
('focus_questions.create_new', 'Create New Focus Question', 'إنشاء سؤال تركيز جديد', 'focus_questions'),
('focus_questions.sensitivity', 'الحساسية', 'الحساسية', 'focus_questions'),

-- Button labels
('button.view', 'View', 'عرض', 'buttons'),
('button.edit', 'Edit', 'تعديل', 'buttons'),
('button.delete', 'Delete', 'حذف', 'buttons'),

-- Ideas Management
('ideas_management.title', 'إدارة الأفكار الابتكارية', 'إدارة الأفكار الابتكارية', 'ideas'),
('ideas_management.description', 'نظام شامل لإدارة وتحليل الأفكار الابتكارية', 'نظام شامل لإدارة وتحليل الأفكار الابتكارية', 'ideas'),

-- Innovation Teams
('common.error', 'خطأ', 'خطأ', 'common'),
('common.success', 'نجح', 'نجح', 'common'),
('errors.failed_to_load_core_team_data', 'فشل في تحميل بيانات فريق الابتكار الأساسي.', 'فشل في تحميل بيانات فريق الابتكار الأساسي.', 'errors'),
('innovation_teams.member_removed_success', 'تم إزالة عضو الفريق بنجاح.', 'تم إزالة عضو الفريق بنجاح.', 'innovation_teams'),
('innovation_teams.member_removal_failed', 'فشل في إزالة عضو الفريق.', 'فشل في إزالة عضو الفريق.', 'innovation_teams'),

-- Opportunity Management
('opportunity.select_department', 'اختر القسم', 'اختر القسم', 'opportunities'),
('department.no_department_specified', 'بدون قسم محدد', 'بدون قسم محدد', 'departments'),
('opportunity.responsible_person_name', 'اسم الشخص المسؤول', 'اسم الشخص المسؤول', 'opportunities'),
('opportunity.enter_work_location', 'أدخل موقع العمل', 'أدخل موقع العمل', 'opportunities'),

-- Admin Organizational
('admin.select_deputy', 'Select deputy', 'اختر النائب', 'admin'),
('admin.edit_domain', 'Edit Domain', 'تعديل المجال', 'admin'),
('admin.add_new_domain', 'Add New Domain', 'إضافة مجال جديد', 'admin'),
('admin.select_department', 'Select department', 'اختر القسم', 'admin'),

-- Partners Management
('admin.edit_partner', 'Edit Partner', 'تعديل الشريك', 'admin'),
('admin.add_new_partner', 'Add New Partner', 'إضافة شريك جديد', 'admin'),

-- Role Requests
('admin.request_reviewed', 'Request Reviewed', 'تم مراجعة الطلب', 'admin'),

-- General UI
('challenge', 'التحدي', 'التحدي', 'common'),
('general_question', 'سؤال عام', 'سؤال عام', 'common'),
('linked_to_challenge', 'مرتبط بتحدي', 'مرتبط بتحدي', 'common'),
('order', 'الترتيب', 'الترتيب', 'common'),
('creation_date', 'تاريخ الإنشاء', 'تاريخ الإنشاء', 'common')

ON CONFLICT (translation_key) DO UPDATE SET 
text_en = EXCLUDED.text_en,
text_ar = EXCLUDED.text_ar,
category = EXCLUDED.category,
updated_at = now();