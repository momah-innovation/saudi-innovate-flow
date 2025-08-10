-- FocusQuestionsManagement Translation Keys
INSERT INTO public.system_translations (translation_key, text_en, text_ar, category) VALUES

-- Page titles and descriptions
('focus_questions.management_title', 'Focus Questions Management', 'إدارة الأسئلة المحورية', 'focus_questions'),
('focus_questions.management_description', 'Manage focus questions for challenges', 'إدارة الأسئلة المحورية للتحديات', 'focus_questions'),

-- Actions and buttons
('focus_questions.add_question', 'Add Focus Question', 'إضافة سؤال محوري', 'focus_questions'),
('focus_questions.create_question', 'Create Focus Question', 'إنشاء سؤال محوري', 'focus_questions'),
('focus_questions.edit_action', 'Edit', 'تعديل', 'focus_questions'),
('focus_questions.delete_action', 'Delete', 'حذف', 'focus_questions'),

-- Search and placeholders
('focus_questions.search_placeholder', 'Search questions...', 'البحث في الأسئلة...', 'focus_questions'),

-- Messages and notifications
('focus_questions.load_error_title', 'Error', 'خطأ', 'focus_questions'),
('focus_questions.load_error_description', 'Failed to load data', 'فشل في تحميل البيانات', 'focus_questions'),
('focus_questions.delete_success_title', 'Success', 'نجح', 'focus_questions'),
('focus_questions.delete_success_description', 'Focus question deleted successfully', 'تم حذف السؤال المحوري بنجاح', 'focus_questions'),
('focus_questions.delete_error_title', 'Error', 'خطأ', 'focus_questions'),
('focus_questions.delete_error_description', 'Failed to delete focus question', 'فشل في حذف السؤال المحوري', 'focus_questions'),
('focus_questions.delete_confirm', 'Are you sure you want to delete this focus question?', 'هل أنت متأكد من حذف هذا السؤال المحوري؟', 'focus_questions'),

-- Empty state
('focus_questions.no_questions_title', 'No focus questions', 'لا توجد أسئلة محورية', 'focus_questions'),
('focus_questions.no_questions_description', 'Start by creating a new focus question to guide innovators', 'ابدأ بإنشاء سؤال محوري جديد لتوجيه المبتكرين', 'focus_questions'),

-- Labels and info
('focus_questions.sensitive_label', 'Sensitive', 'حساس', 'focus_questions'),
('focus_questions.challenge_prefix', 'Challenge:', 'التحدي:', 'focus_questions'),

-- Comments
('focus_questions.failed_fetch_data', 'Failed to fetch focus questions data', 'فشل في تحميل بيانات الأسئلة المحورية', 'focus_questions'),
('focus_questions.failed_delete', 'Failed to delete focus question', 'فشل في حذف السؤال المحوري', 'focus_questions')

ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = now();