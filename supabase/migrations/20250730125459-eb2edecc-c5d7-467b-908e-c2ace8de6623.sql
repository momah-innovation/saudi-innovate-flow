-- Add idea tags settings to system_settings
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description) VALUES
('idea_predefined_tags', '["الذكاء الاصطناعي", "البيانات الضخمة", "إنترنت الأشياء", "البلوك تشين", "الأمن السيبراني", "التحول الرقمي", "التطبيقات المحمولة", "الحوسبة السحابية", "الواقع المعزز", "الواقع الافتراضي", "الطاقة المتجددة", "الاستدامة", "التعليم الإلكتروني", "الصحة الرقمية", "التجارة الإلكترونية", "المدن الذكية", "النقل الذكي", "الزراعة الذكية", "الصناعة 4.0", "الروبوتات"]', 'ideas', 'Predefined tags available for ideas in Arabic')
ON CONFLICT (setting_key) DO UPDATE SET
setting_value = EXCLUDED.setting_value,
updated_at = now();