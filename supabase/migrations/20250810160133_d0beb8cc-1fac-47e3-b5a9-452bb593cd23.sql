-- ChallengeManagement Translation Keys
INSERT INTO public.system_translations (translation_key, text_en, text_ar, category) VALUES

-- Challenge Management main titles
('challenge_management.title', 'Innovation Challenges Management', 'إدارة التحديات الابتكارية', 'challenge_management'),
('challenge_management.description', 'Comprehensive system for managing and analyzing innovation challenges', 'نظام شامل لإدارة وتحليل التحديات الابتكارية', 'challenge_management'),

-- Tab labels  
('challenge_management.challenges_tab', 'Challenges', 'التحديات', 'challenge_management'),
('challenge_management.analytics_tab', 'Analytics', 'التحليلات', 'challenge_management'),

-- ChallengeManagementList messages
('challenge_management.load_error_title', 'Error', 'خطأ', 'challenge_management'),
('challenge_management.load_error_description', 'Failed to load challenges', 'فشل في تحميل التحديات', 'challenge_management'),
('challenge_management.delete_success_title', 'Success', 'تم بنجاح', 'challenge_management'),
('challenge_management.delete_success_description', 'Challenge deleted successfully', 'تم حذف التحدي بنجاح', 'challenge_management'),
('challenge_management.delete_error_title', 'Error', 'خطأ', 'challenge_management'),
('challenge_management.delete_error_description', 'Failed to delete challenge', 'فشل في حذف التحدي', 'challenge_management')

ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = now();