-- Add missing translation keys for completed components
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- Translation Manager errors and loading
('translations.loadError', 'Failed to load translations', 'فشل في تحميل الترجمات', 'translations'),
('translations.deleteError', 'Failed to delete translation', 'فشل في حذف الترجمة', 'translations'),

-- Focus Question specific keys
('focus_questions.sensitivity', 'Sensitivity', 'الحساسية', 'focus_questions'),
('focus_questions.empty_title', 'No Focus Questions', 'لا توجد أسئلة تركيز', 'focus_questions'),
('focus_questions.empty_description', 'Start by creating a new focus question to guide innovators', 'ابدأ بإنشاء سؤال تركيز جديد لتوجيه المبتكرين', 'focus_questions'),
('focus_questions.create_new', 'Create New Focus Question', 'إنشاء سؤال تركيز جديد', 'focus_questions'),
('focus_questions.delete_success', 'Question deleted successfully', 'تم حذف السؤال بنجاح', 'focus_questions'),
('focus_questions.delete_success_description', 'The focus question has been removed', 'تمت إزالة سؤال التركيز', 'focus_questions'),
('focus_questions.delete_error', 'Delete failed', 'فشل في الحذف', 'focus_questions'),
('focus_questions.delete_error_description', 'Unable to delete the question', 'تعذر حذف السؤال', 'focus_questions'),

-- Button labels (additional to existing)
('button.view', 'View', 'عرض', 'ui'),
('button.edit', 'Edit', 'تحرير', 'ui'),
('button.delete', 'Delete', 'حذف', 'ui'),

-- Question types
('question_type.open_ended', 'Open Ended', 'مفتوح', 'focus_questions'),
('question_type.multiple_choice', 'Multiple Choice', 'متعدد الخيارات', 'focus_questions'),
('question_type.yes_no', 'Yes/No', 'نعم/لا', 'focus_questions'),
('question_type.rating', 'Rating', 'تقييم', 'focus_questions'),
('question_type.ranking', 'Ranking', 'ترتيب', 'focus_questions'),

-- Sensitivity levels
('sensitivity.normal', 'Normal', 'عادي', 'system'),
('sensitivity.sensitive', 'Sensitive', 'حساس', 'system'),

-- Settings categories
('systemLists.evaluatorTypes', 'Evaluator Types', 'أنواع المقيمين', 'settings'),
('systemLists.expertRoleTypes', 'Expert Role Types', 'أنواع أدوار الخبراء', 'settings')

ON CONFLICT (translation_key) DO NOTHING;