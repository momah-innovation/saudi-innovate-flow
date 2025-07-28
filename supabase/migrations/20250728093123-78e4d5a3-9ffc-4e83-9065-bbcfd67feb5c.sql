-- Update system settings with Arabic values
UPDATE system_settings 
SET setting_value = '["تقنية", "استدامة", "صحة", "تعليم", "حوكمة"]'
WHERE setting_key = 'challenge_types';

UPDATE system_settings 
SET setting_value = '["مسودة", "منشور", "نشط", "مغلق", "مؤرشف", "مكتمل"]'
WHERE setting_key = 'challenge_status_options';

UPDATE system_settings 
SET setting_value = '["نشط", "غير نشط", "معلق", "محظور"]'
WHERE setting_key = 'partner_status_options';

UPDATE system_settings 
SET setting_value = '["حكومي", "خاص", "أكاديمي", "غير ربحي", "دولي"]'
WHERE setting_key = 'partner_type_options';

UPDATE system_settings 
SET setting_value = '["متعاون", "راعي", "شريك تقني", "شريك استراتيجي", "شريك تنفيذ"]'
WHERE setting_key = 'partnership_type_options';

UPDATE system_settings 
SET setting_value = '["نشط", "غير نشط", "متاح", "مشغول", "غير متاح"]'
WHERE setting_key = 'expert_status_options';

UPDATE system_settings 
SET setting_value = '["نشط", "غير نشط", "معلق", "مكتمل", "ملغي"]'
WHERE setting_key = 'assignment_status_options';

UPDATE system_settings 
SET setting_value = '["معلق", "موافق عليه", "مرفوض", "مسحوب"]'
WHERE setting_key = 'role_request_status_options';

UPDATE system_settings 
SET setting_value = '["نشط", "غير نشط", "محظور", "معلق", "ملغي"]'
WHERE setting_key = 'user_status_options';

UPDATE system_settings 
SET setting_value = '["نشط", "غير نشط", "معلق", "مكتمل", "ملغي", "مسودة", "منشور", "مؤرشف"]'
WHERE setting_key = 'general_status_options';

UPDATE system_settings 
SET setting_value = '["عام", "تقني", "تجاري", "تأثير", "تنفيذ", "اجتماعي", "أخلاقي", "طبي", "تنظيمي"]'
WHERE setting_key = 'focus_question_types';

UPDATE system_settings 
SET setting_value = '["خبير رئيسي", "مقيم", "مراجع", "خبير موضوع", "مستشار خارجي"]'
WHERE setting_key = 'expert_role_types';