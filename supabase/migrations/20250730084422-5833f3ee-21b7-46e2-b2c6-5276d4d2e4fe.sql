-- First, update existing challenge_type values to match constraint
UPDATE public.challenges 
SET challenge_type = CASE 
    WHEN challenge_type = 'تقني' THEN 'technical'
    WHEN challenge_type = 'أعمال' THEN 'business'
    WHEN challenge_type = 'بيئي' THEN 'environmental'
    WHEN challenge_type = 'صحي' THEN 'health'
    WHEN challenge_type = 'تعليمي' THEN 'educational'
    ELSE challenge_type
END
WHERE challenge_type IN ('تقني', 'أعمال', 'بيئي', 'صحي', 'تعليمي');

-- Add new constraint with proper values
ALTER TABLE public.challenges DROP CONSTRAINT IF EXISTS challenges_challenge_type_check;
ALTER TABLE public.challenges ADD CONSTRAINT challenges_challenge_type_check 
CHECK (challenge_type IN ('technical', 'business', 'environmental', 'health', 'educational'));

-- Add image_url to existing challenges if they don't have one
UPDATE public.challenges 
SET image_url = CASE 
    WHEN challenge_type = 'technical' THEN '/challenge-images/circuit-board-tech.jpg'
    WHEN challenge_type = 'business' THEN '/challenge-images/digital-transformation.jpg'
    WHEN challenge_type = 'environmental' THEN '/challenge-images/innovation-lightbulb-blue.jpg'
    WHEN challenge_type = 'health' THEN '/challenge-images/ai-technology.jpg'
    WHEN challenge_type = 'educational' THEN '/challenge-images/programming-challenge.jpg'
    ELSE '/challenge-images/innovation-lightbulb.jpg'
END
WHERE image_url IS NULL;

-- Seed additional challenge data if needed
INSERT INTO public.challenges (
    title_ar,
    description_ar,
    status,
    priority_level,
    challenge_type,
    start_date,
    end_date,
    estimated_budget,
    sensitivity_level,
    image_url
) 
SELECT * FROM (VALUES 
    (
        'تطوير حلول ذكية للنقل المستدام',
        'ابتكار حلول تقنية متطورة لتحسين وسائل النقل العام وتقليل الانبعاثات الكربونية باستخدام تقنيات الذكاء الاصطناعي وإنترنت الأشياء',
        'active',
        'عالي',
        'technical',
        '2024-01-15'::date,
        '2024-12-31'::date,
        50000::numeric,
        'normal',
        '/challenge-images/smart-city.jpg'
    ),
    (
        'تطبيق الواقع المعزز في التعليم',
        'تطوير تطبيقات الواقع المعزز والافتراضي لتحسين التجربة التعليمية وجعل التعلم أكثر تفاعلية وإثارة',
        'active',
        'متوسط',
        'educational',
        '2024-02-01'::date,
        '2024-11-30'::date,
        35000::numeric,
        'normal',
        '/challenge-images/programming-challenge.jpg'
    )
) AS new_challenges(title_ar, description_ar, status, priority_level, challenge_type, start_date, end_date, estimated_budget, sensitivity_level, image_url)
WHERE NOT EXISTS (
    SELECT 1 FROM public.challenges WHERE title_ar = new_challenges.title_ar
);