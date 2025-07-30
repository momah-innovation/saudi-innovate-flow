-- Fix the predefined tags JSON format
UPDATE public.system_settings 
SET setting_value = '["الذكاء الاصطناعي", "البيانات الضخمة", "إنترنت الأشياء", "البلوك تشين", "الأمن السيبراني", "التحول الرقمي", "التطبيقات المحمولة", "الحوسبة السحابية", "الواقع المعزز", "الواقع الافتراضي", "الطاقة المتجددة", "الاستدامة", "التعليم الإلكتروني", "الصحة الرقمية", "التجارة الإلكترونية", "المدن الذكية", "النقل الذكي", "الزراعة الذكية", "الصناعة 4.0", "الروبوتات"]'
WHERE setting_key = 'idea_predefined_tags';

-- Create function to ensure innovator record exists
CREATE OR REPLACE FUNCTION public.ensure_innovator_exists(user_uuid UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    innovator_id UUID;
BEGIN
    -- Check if innovator already exists
    SELECT id INTO innovator_id
    FROM public.innovators
    WHERE user_id = user_uuid;
    
    -- If not exists, create one
    IF innovator_id IS NULL THEN
        INSERT INTO public.innovators (user_id, status, specialization)
        VALUES (user_uuid, 'active', 'general')
        RETURNING id INTO innovator_id;
    END IF;
    
    RETURN innovator_id;
END;
$$;