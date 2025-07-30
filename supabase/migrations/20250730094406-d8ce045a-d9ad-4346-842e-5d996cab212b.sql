-- Check existing challenge types and fix seeding data

-- First check what challenge types are allowed
-- Then insert valid challenge data

INSERT INTO challenges (
  id,
  title_ar,
  description_ar,
  status,
  priority_level,
  start_date,
  end_date,
  estimated_budget,
  image_url,
  vision_2030_goal,
  sensitivity_level,
  created_at
) VALUES 
(
  gen_random_uuid(),
  'تطوير منصة ذكية لإدارة النفايات',
  'تحدي لتطوير منصة ذكية تستخدم الذكاء الاصطناعي وإنترنت الأشياء لإدارة النفايات بكفاءة أكبر في المدن السعودية، مما يساهم في تحقيق أهداف رؤية 2030 للاستدامة البيئية.',
  'active',
  'high',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '60 days',
  500000,
  'https://images.unsplash.com/photo-1518770660439-4636190af475',
  'مدن مستدامة وذكية',
  'normal',
  NOW()
),
(
  gen_random_uuid(),
  'نظام دفع رقمي موحد للخدمات الحكومية',
  'تطوير نظام دفع رقمي موحد وآمن يربط جميع الخدمات الحكومية السعودية، مما يسهل على المواطنين والمقيمين الوصول للخدمات ودفع الرسوم بطريقة سلسة.',
  'active',
  'high',
  CURRENT_DATE - INTERVAL '10 days',
  CURRENT_DATE + INTERVAL '45 days',
  1200000,
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
  'الحكومة الرقمية',
  'normal',
  NOW()
),
(
  gen_random_uuid(),
  'منصة تعليمية تفاعلية للمهارات التقنية',
  'إنشاء منصة تعليمية تفاعلية تعتمد على الواقع المعزز والافتراضي لتعليم المهارات التقنية المطلوبة في سوق العمل السعودي، خاصة في مجالات البرمجة والذكاء الاصطناعي.',
  'upcoming',
  'medium',
  CURRENT_DATE + INTERVAL '15 days',
  CURRENT_DATE + INTERVAL '90 days',
  800000,
  'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
  'التعليم والتدريب',
  'normal',
  NOW()
),
(
  gen_random_uuid(),
  'حلول طاقة متجددة للمناطق النائية',
  'تطوير حلول مبتكرة للطاقة المتجددة تناسب المناطق النائية في المملكة، باستخدام تقنيات الطاقة الشمسية وطاقة الرياح مع أنظمة تخزين ذكية.',
  'active',
  'high',
  CURRENT_DATE - INTERVAL '5 days',
  CURRENT_DATE + INTERVAL '75 days',
  2000000,
  'https://images.unsplash.com/photo-1500673922987-e212871fec22',
  'الطاقة المتجددة',
  'normal',
  NOW()
),
(
  gen_random_uuid(),
  'نظام ذكي لمراقبة الصحة العامة',
  'تطوير نظام ذكي يستخدم البيانات الضخمة والذكاء الاصطناعي لمراقبة ومتابعة الصحة العامة، مع القدرة على التنبؤ المبكر بالأوبئة والأمراض.',
  'active',
  'high',
  CURRENT_DATE - INTERVAL '3 days',
  CURRENT_DATE + INTERVAL '55 days',
  1500000,
  'https://images.unsplash.com/photo-1483058712412-4245e9b90334',
  'الرعاية الصحية',
  'normal',
  NOW()
);