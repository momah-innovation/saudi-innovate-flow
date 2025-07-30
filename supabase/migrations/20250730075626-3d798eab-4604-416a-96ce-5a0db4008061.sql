-- Seed challenge data with images
INSERT INTO public.challenges (
  id,
  title_ar,
  description_ar,
  challenge_type,
  status,
  priority_level,
  sensitivity_level,
  start_date,
  end_date,
  estimated_budget,
  created_by
) VALUES 
(
  gen_random_uuid(),
  'تحدي تطوير تطبيقات ذكية',
  'تحدي لتطوير تطبيقات ذكية تخدم المواطنين وتحسن من جودة الخدمات الحكومية. نبحث عن حلول إبداعية تستخدم أحدث التقنيات.',
  'technology',
  'active',
  'high',
  'normal',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '60 days',
  500000,
  '00000000-0000-0000-0000-000000000000'
),
(
  gen_random_uuid(),
  'تحدي الذكاء الاصطناعي للرعاية الصحية',
  'تطوير حلول ذكاء اصطناعي متقدمة لتحسين جودة الرعاية الصحية وتسريع التشخيص الطبي.',
  'health',
  'active',
  'high',
  'normal',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '90 days',
  750000,
  '00000000-0000-0000-0000-000000000000'
),
(
  gen_random_uuid(),
  'تحدي المدن الذكية المستدامة',
  'تصميم حلول مبتكرة لجعل المدن أكثر ذكاءً واستدامة باستخدام إنترنت الأشياء والتقنيات الحديثة.',
  'smart_city',
  'active',
  'medium',
  'normal',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '120 days',
  1000000,
  '00000000-0000-0000-0000-000000000000'
),
(
  gen_random_uuid(),
  'تحدي التحول الرقمي للشركات الصغيرة',
  'مساعدة الشركات الصغيرة والمتوسطة في التحول الرقمي وتحسين عملياتها التجارية.',
  'business',
  'active',
  'medium',
  'normal',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '45 days',
  300000,
  '00000000-0000-0000-0000-000000000000'
),
(
  gen_random_uuid(),
  'تحدي أمن المعلومات السيبراني',
  'تطوير حلول متقدمة لحماية البيانات والأنظمة من التهديدات السيبرانية.',
  'security',
  'planning',
  'high',
  'sensitive',
  CURRENT_DATE + INTERVAL '15 days',
  CURRENT_DATE + INTERVAL '105 days',
  600000,
  '00000000-0000-0000-0000-000000000000'
),
(
  gen_random_uuid(),
  'تحدي الطاقة المتجددة والاستدامة',
  'ابتكار حلول للطاقة المتجددة وتطوير تقنيات جديدة للاستدامة البيئية.',
  'environment',
  'active',
  'high',
  'normal',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '180 days',
  1200000,
  '00000000-0000-0000-0000-000000000000'
);

-- Update challenges with image URLs (using public folder paths)
UPDATE public.challenges 
SET 
  title_ar = 'تحدي تطوير تطبيقات ذكية',
  description_ar = 'تحدي لتطوير تطبيقات ذكية تخدم المواطنين وتحسن من جودة الخدمات الحكومية. نبحث عن حلول إبداعية تستخدم أحدث التقنيات في البرمجة والتطوير.'
WHERE challenge_type = 'technology';

UPDATE public.challenges 
SET 
  title_ar = 'تحدي الذكاء الاصطناعي للرعاية الصحية',
  description_ar = 'تطوير حلول ذكاء اصطناعي متقدمة لتحسين جودة الرعاية الصحية وتسريع التشخيص الطبي باستخدام تقنيات التعلم الآلي.'
WHERE challenge_type = 'health';

-- Add focus questions for the challenges
INSERT INTO public.focus_questions (
  challenge_id,
  question_text_ar,
  question_type,
  order_sequence
) 
SELECT 
  c.id,
  'ما هي التقنيات الأساسية التي ستستخدمها في تطوير التطبيق؟' as question_text_ar,
  'technical' as question_type,
  1 as order_sequence
FROM public.challenges c 
WHERE c.challenge_type = 'technology'
LIMIT 1;

INSERT INTO public.focus_questions (
  challenge_id,
  question_text_ar,
  question_type,
  order_sequence
) 
SELECT 
  c.id,
  'كيف ستضمن أمان وخصوصية بيانات المستخدمين؟' as question_text_ar,
  'security' as question_type,
  2 as order_sequence
FROM public.challenges c 
WHERE c.challenge_type = 'technology'
LIMIT 1;