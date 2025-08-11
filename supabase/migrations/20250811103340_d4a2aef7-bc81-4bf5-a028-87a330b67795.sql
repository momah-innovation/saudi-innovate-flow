-- Add missing focus question translation keys
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- Focus Question Settings
('settings.focus_question_auto_sequence.description', 'Automatically sequence focus questions based on challenge complexity and innovation requirements', 'ترتيب أسئلة التركيز تلقائياً بناءً على تعقيد التحدي ومتطلبات الابتكار', 'settings'),
('settings.focus_question_max_per_challenge.label', 'Maximum Focus Questions per Challenge', 'الحد الأقصى لأسئلة التركيز لكل تحدي', 'settings'),
('settings.focus_question_max_per_challenge.description', 'Set the maximum number of focus questions that can be assigned to a single challenge', 'تحديد الحد الأقصى لعدد أسئلة التركيز التي يمكن تعيينها لتحدي واحد', 'settings'),
('settings.focus_question_require_description.label', 'Require Focus Question Description', 'إجبارية وصف سؤال التركيز', 'settings'),
('settings.focus_question_require_description.description', 'Require innovators to provide detailed descriptions for their focus question responses', 'إجبار المبتكرين على تقديم أوصاف مفصلة لإجاباتهم على أسئلة التركيز', 'settings')

ON CONFLICT (translation_key) DO UPDATE SET 
text_en = EXCLUDED.text_en,
text_ar = EXCLUDED.text_ar,
category = EXCLUDED.category,
updated_at = now();