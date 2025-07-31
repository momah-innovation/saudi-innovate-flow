-- Use existing valid values for seeding
INSERT INTO public.challenges (
  title_ar,
  description_ar,
  status,
  priority_level,
  challenge_type,
  start_date,
  end_date,
  estimated_budget,
  image_url
) VALUES 
(
  'تطوير نظام ذكي لإدارة النفايات',
  'تحدي لتطوير حلول مبتكرة لإدارة النفايات في المدن الذكية باستخدام التقنيات الحديثة مثل الذكاء الاصطناعي وإنترنت الأشياء. الهدف هو تحسين كفاءة جمع النفايات وتقليل التأثير البيئي.',
  'active',
  'medium',
  'technical',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '60 days',
  150000,
  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop'
),
(
  'منصة التعليم التفاعلي الرقمي',
  'تطوير منصة تعليمية تفاعلية تستخدم تقنيات الواقع المعزز والذكاء الاصطناعي لتحسين تجربة التعلم للطلاب في جميع المراحل التعليمية.',
  'active',
  'medium',
  'educational',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '45 days',
  200000,
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop'
),
(
  'نظام مراقبة صحي ذكي',
  'تطوير نظام مراقبة صحي متقدم يستخدم أجهزة الاستشعار الذكية والذكاء الاصطناعي لمراقبة الحالة الصحية للمرضى عن بُعد وتقديم تنبيهات مبكرة.',
  'draft',
  'medium',
  'health',
  CURRENT_DATE + INTERVAL '7 days',
  CURRENT_DATE + INTERVAL '90 days',
  300000,
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop'
),
(
  'حلول الطاقة المتجددة الذكية',
  'تحدي لتطوير حلول مبتكرة للطاقة المتجددة تتضمن أنظمة ذكية لإدارة وتوزيع الطاقة الشمسية وطاقة الرياح في المباني السكنية والتجارية.',
  'active',
  'medium',
  'environmental',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '75 days',
  500000,
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop'
),
(
  'منصة التجارة الإلكترونية المتطورة',
  'تطوير منصة تجارة إلكترونية متطورة تدعم التقنيات الحديثة مثل الذكاء الاصطناعي لتخصيص تجربة التسوق والواقع المعزز لعرض المنتجات.',
  'draft',
  'medium',
  'business',
  CURRENT_DATE + INTERVAL '14 days',
  CURRENT_DATE + INTERVAL '120 days',
  250000,
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop'
) ON CONFLICT DO NOTHING;