-- Add missing validation and step translations
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('error.question_text_required', 'Question text is required', 'نص السؤال مطلوب', 'validation'),
('error.question_text_min_length', 'Question text must be more than 10 characters', 'يجب أن يكون نص السؤال أكثر من 10 أحرف', 'validation'),
('error.question_type_required', 'Question type is required', 'نوع السؤال مطلوب', 'validation'),
('error.order_sequence_min', 'Question order must be zero or greater', 'ترتيب السؤال يجب أن يكون صفر أو أكثر', 'validation'),
('step.question_content', 'Question Content', 'محتوى السؤال', 'form'),
('step.question_details', 'Question Details', 'تفاصيل السؤال', 'form'),
('step.link_question', 'Link Question', 'ربط السؤال', 'form'),
('step.question_settings', 'Question Settings', 'إعدادات السؤال', 'form');