-- Seed challenge data with correct Arabic values
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
  'تحدي لتطوير تطبيقات ذكية تخدم المواطنين وتحسن من جودة الخدمات الحكومية. نبحث عن حلول إبداعية تستخدم أحدث التقنيات في البرمجة والتطوير.',
  'تقنية',
  'active',
  'عالي',
  'عادي',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '60 days',
  500000,
  '00000000-0000-0000-0000-000000000000'
),
(
  gen_random_uuid(),
  'تحدي الذكاء الاصطناعي للرعاية الصحية',
  'تطوير حلول ذكاء اصطناعي متقدمة لتحسين جودة الرعاية الصحية وتسريع التشخيص الطبي باستخدام تقنيات التعلم الآلي والبيانات الطبية.',
  'ابتكار صحي',
  'active',
  'عالي',
  'عادي',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '90 days',
  750000,
  '00000000-0000-0000-0000-000000000000'
),
(
  gen_random_uuid(),
  'تحدي المدن الذكية المستدامة',
  'تصميم حلول مبتكرة لجعل المدن أكثر ذكاءً واستدامة باستخدام إنترنت الأشياء والتقنيات الحديثة لتحسين جودة الحياة.',
  'بنية تحتية ذكية',
  'active',
  'متوسط',
  'عادي',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '120 days',
  1000000,
  '00000000-0000-0000-0000-000000000000'
),
(
  gen_random_uuid(),
  'تحدي التحول الرقمي للشركات الصغيرة',
  'مساعدة الشركات الصغيرة والمتوسطة في التحول الرقمي وتحسين عملياتها التجارية باستخدام الحلول التقنية المبتكرة.',
  'تحول رقمي',
  'active',
  'متوسط',
  'عادي',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '45 days',
  300000,
  '00000000-0000-0000-0000-000000000000'
),
(
  gen_random_uuid(),
  'تحدي أمن المعلومات السيبراني',
  'تطوير حلول متقدمة لحماية البيانات والأنظمة من التهديدات السيبرانية وضمان الأمان الرقمي.',
  'تقنية',
  'planning',
  'عالي',
  'حساس',
  CURRENT_DATE + INTERVAL '15 days',
  CURRENT_DATE + INTERVAL '105 days',
  600000,
  '00000000-0000-0000-0000-000000000000'
),
(
  gen_random_uuid(),
  'تحدي الطاقة المتجددة والاستدامة',
  'ابتكار حلول للطاقة المتجددة وتطوير تقنيات جديدة للاستدامة البيئية ومكافحة تغير المناخ.',
  'استدامة',
  'active',
  'عالي',
  'عادي',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '180 days',
  1200000,
  '00000000-0000-0000-0000-000000000000'
),
(
  gen_random_uuid(),
  'تحدي التعليم الرقمي التفاعلي',
  'تطوير منصات تعليمية رقمية تفاعلية تحسن من جودة التعليم وتجعله أكثر إتاحة وفعالية.',
  'تعليم',
  'active',
  'متوسط',
  'عادي',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '75 days',
  400000,
  '00000000-0000-0000-0000-000000000000'
),
(
  gen_random_uuid(),
  'تحدي تحسين الخدمات الحكومية',
  'تطوير حلول لتحسين كفاءة وجودة الخدمات الحكومية المقدمة للمواطنين باستخدام التقنيات الحديثة.',
  'حوكمة',
  'planning',
  'عالي',
  'حساس',
  CURRENT_DATE + INTERVAL '30 days',
  CURRENT_DATE + INTERVAL '150 days',
  800000,
  '00000000-0000-0000-0000-000000000000'
);

-- Add focus questions for the challenges
INSERT INTO public.focus_questions (
  challenge_id,
  question_text_ar,
  question_type,
  order_sequence
) 
SELECT 
  c.id,
  CASE 
    WHEN c.challenge_type = 'تقنية' THEN 'ما هي التقنيات الأساسية التي ستستخدمها في تطوير الحل؟'
    WHEN c.challenge_type = 'ابتكار صحي' THEN 'كيف ستضمن دقة وموثوقية الذكاء الاصطناعي في التشخيص الطبي؟'
    WHEN c.challenge_type = 'بنية تحتية ذكية' THEN 'ما هي المعايير التي ستتبعها لضمان استدامة الحل؟'
    WHEN c.challenge_type = 'تحول رقمي' THEN 'كيف ستساعد الشركات الصغيرة في التكيف مع التحول الرقمي؟'
    WHEN c.challenge_type = 'استدامة' THEN 'ما هو التأثير البيئي المتوقع من الحل المقترح؟'
    WHEN c.challenge_type = 'تعليم' THEN 'كيف ستقيس فعالية الحل التعليمي المقترح؟'
    WHEN c.challenge_type = 'حوكمة' THEN 'كيف ستضمن شفافية وكفاءة الخدمات الحكومية؟'
    ELSE 'ما هي الفوائد الرئيسية للحل المقترح؟'
  END as question_text_ar,
  'strategic' as question_type,
  1 as order_sequence
FROM public.challenges c;

INSERT INTO public.focus_questions (
  challenge_id,
  question_text_ar,
  question_type,
  order_sequence
) 
SELECT 
  c.id,
  'كيف ستضمن أمان وخصوصية البيانات في الحل المقترح؟' as question_text_ar,
  'security' as question_type,
  2 as order_sequence
FROM public.challenges c;