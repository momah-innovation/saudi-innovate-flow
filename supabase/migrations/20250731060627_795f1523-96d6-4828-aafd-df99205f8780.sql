-- Create storage bucket for challenge images and attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('challenge-images', 'challenge-images', true, 10485760, ARRAY['image/png', 'image/jpg', 'image/jpeg', 'image/webp']);

-- Create challenge images table for metadata
CREATE TABLE public.challenge_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_type VARCHAR(50) DEFAULT 'hero',
  caption_ar TEXT,
  caption_en TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.challenge_images ENABLE ROW LEVEL SECURITY;

-- RLS policies for challenge images
CREATE POLICY "Anyone can view challenge images" ON public.challenge_images FOR SELECT USING (true);
CREATE POLICY "Team members can manage challenge images" ON public.challenge_images 
  FOR ALL USING (EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) OR has_role(auth.uid(), 'admin'::app_role));

-- Create storage policies for challenge images
CREATE POLICY "Anyone can view challenge images" ON storage.objects 
  FOR SELECT USING (bucket_id = 'challenge-images');

CREATE POLICY "Team members can upload challenge images" ON storage.objects 
  FOR INSERT WITH CHECK (
    bucket_id = 'challenge-images' AND 
    (EXISTS (
      SELECT 1 FROM innovation_team_members itm 
      WHERE itm.user_id = auth.uid() AND itm.status = 'active'
    ) OR has_role(auth.uid(), 'admin'::app_role))
  );

-- Seed some challenge data with images
INSERT INTO public.challenges (
  id,
  title_ar,
  description_ar,
  challenge_type,
  status,
  priority_level,
  start_date,
  end_date,
  estimated_budget,
  image_url,
  sector_id,
  deputy_id,
  department_id
) VALUES 
(
  gen_random_uuid(),
  'تطوير نظام ذكي لإدارة النفايات',
  'تحدي لتطوير حلول مبتكرة لإدارة النفايات في المدن الذكية باستخدام التقنيات الحديثة مثل الذكاء الاصطناعي وإنترنت الأشياء. الهدف هو تحسين كفاءة جمع النفايات وتقليل التأثير البيئي.',
  'technology',
  'active',
  'high',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '60 days',
  150000,
  '/challenge-images/smart-waste-management.jpg',
  (SELECT id FROM sectors LIMIT 1),
  (SELECT id FROM deputies LIMIT 1),
  (SELECT id FROM departments LIMIT 1)
),
(
  gen_random_uuid(),
  'منصة التعليم التفاعلي الرقمي',
  'تطوير منصة تعليمية تفاعلية تستخدم تقنيات الواقع المعزز والذكاء الاصطناعي لتحسين تجربة التعلم للطلاب في جميع المراحل التعليمية.',
  'education',
  'active',
  'medium',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '45 days',
  200000,
  '/challenge-images/interactive-education.jpg',
  (SELECT id FROM sectors LIMIT 1),
  (SELECT id FROM deputies LIMIT 1),
  (SELECT id FROM departments LIMIT 1)
),
(
  gen_random_uuid(),
  'نظام مراقبة صحي ذكي',
  'تطوير نظام مراقبة صحي متقدم يستخدم أجهزة الاستشعار الذكية والذكاء الاصطناعي لمراقبة الحالة الصحية للمرضى عن بُعد وتقديم تنبيهات مبكرة.',
  'healthcare',
  'planning',
  'high',
  CURRENT_DATE + INTERVAL '7 days',
  CURRENT_DATE + INTERVAL '90 days',
  300000,
  '/challenge-images/health-monitoring.jpg',
  (SELECT id FROM sectors LIMIT 1),
  (SELECT id FROM deputies LIMIT 1),
  (SELECT id FROM departments LIMIT 1)
),
(
  gen_random_uuid(),
  'حلول الطاقة المتجددة الذكية',
  'تحدي لتطوير حلول مبتكرة للطاقة المتجددة تتضمن أنظمة ذكية لإدارة وتوزيع الطاقة الشمسية وطاقة الرياح في المباني السكنية والتجارية.',
  'energy',
  'active',
  'high',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '75 days',
  500000,
  '/challenge-images/renewable-energy.jpg',
  (SELECT id FROM sectors LIMIT 1),
  (SELECT id FROM deputies LIMIT 1),
  (SELECT id FROM departments LIMIT 1)
),
(
  gen_random_uuid(),
  'منصة التجارة الإلكترونية المتطورة',
  'تطوير منصة تجارة إلكترونية متطورة تدعم التقنيات الحديثة مثل الذكاء الاصطناعي لتخصيص تجربة التسوق والواقع المعزز لعرض المنتجات.',
  'technology',
  'draft',
  'medium',
  CURRENT_DATE + INTERVAL '14 days',
  CURRENT_DATE + INTERVAL '120 days',
  250000,
  '/challenge-images/ecommerce-platform.jpg',
  (SELECT id FROM sectors LIMIT 1),
  (SELECT id FROM deputies LIMIT 1),
  (SELECT id FROM departments LIMIT 1)
);

-- Add some challenge requirements
INSERT INTO public.challenge_requirements (
  challenge_id,
  title,
  description,
  requirement_type,
  is_mandatory,
  weight_percentage,
  order_sequence
)
SELECT 
  c.id,
  'المتطلبات التقنية',
  'يجب أن يكون الحل قابلاً للتطبيق تقنياً ويستخدم أحدث التقنيات المتاحة',
  'technical',
  true,
  30,
  1
FROM challenges c WHERE c.title_ar LIKE '%نظام ذكي%'
UNION ALL
SELECT 
  c.id,
  'الجدوى الاقتصادية',
  'يجب أن يكون للحل جدوى اقتصادية واضحة ونموذج عمل مستدام',
  'business',
  true,
  25,
  2
FROM challenges c WHERE c.title_ar LIKE '%منصة%'
UNION ALL
SELECT 
  c.id,
  'الأثر البيئي',
  'يجب أن يساهم الحل في تحسين البيئة وتقليل التأثير السلبي',
  'environmental',
  false,
  20,
  3
FROM challenges c WHERE c.title_ar LIKE '%طاقة%';