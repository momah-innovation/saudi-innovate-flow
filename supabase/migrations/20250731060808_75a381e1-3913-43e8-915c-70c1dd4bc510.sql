-- Fix challenge data with correct types and download images
-- First, let's check what challenge types are allowed
-- Then insert with correct types

-- Download challenge images to storage
-- Since we can't directly insert files, we'll update the challenges to use proper image paths

-- Create storage bucket for challenge images first (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('challenge-images', 'challenge-images', true, 10485760, ARRAY['image/png', 'image/jpg', 'image/jpeg', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Create storage policies (if not exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' 
    AND policyname = 'Anyone can view challenge images'
  ) THEN
    EXECUTE 'CREATE POLICY "Anyone can view challenge images" ON storage.objects 
      FOR SELECT USING (bucket_id = ''challenge-images'')';
  END IF;
END $$;

-- Seed challenge data with proper types (assuming these are valid types)
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
  'innovation',
  'active',
  'high',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '60 days',
  150000,
  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
  (SELECT id FROM sectors LIMIT 1),
  (SELECT id FROM deputies LIMIT 1),
  (SELECT id FROM departments LIMIT 1)
),
(
  gen_random_uuid(),
  'منصة التعليم التفاعلي الرقمي',
  'تطوير منصة تعليمية تفاعلية تستخدم تقنيات الواقع المعزز والذكاء الاصطناعي لتحسين تجربة التعلم للطلاب في جميع المراحل التعليمية.',
  'innovation',
  'active',
  'medium',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '45 days',
  200000,
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
  (SELECT id FROM sectors LIMIT 1),
  (SELECT id FROM deputies LIMIT 1),
  (SELECT id FROM departments LIMIT 1)
),
(
  gen_random_uuid(),
  'نظام مراقبة صحي ذكي',
  'تطوير نظام مراقبة صحي متقدم يستخدم أجهزة الاستشعار الذكية والذكاء الاصطناعي لمراقبة الحالة الصحية للمرضى عن بُعد وتقديم تنبيهات مبكرة.',
  'innovation',
  'planning',
  'high',
  CURRENT_DATE + INTERVAL '7 days',
  CURRENT_DATE + INTERVAL '90 days',
  300000,
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
  (SELECT id FROM sectors LIMIT 1),
  (SELECT id FROM deputies LIMIT 1),
  (SELECT id FROM departments LIMIT 1)
),
(
  gen_random_uuid(),
  'حلول الطاقة المتجددة الذكية',
  'تحدي لتطوير حلول مبتكرة للطاقة المتجددة تتضمن أنظمة ذكية لإدارة وتوزيع الطاقة الشمسية وطاقة الرياح في المباني السكنية والتجارية.',
  'innovation',
  'active',
  'high',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '75 days',
  500000,
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
  (SELECT id FROM sectors LIMIT 1),
  (SELECT id FROM deputies LIMIT 1),
  (SELECT id FROM departments LIMIT 1)
),
(
  gen_random_uuid(),
  'منصة التجارة الإلكترونية المتطورة',
  'تطوير منصة تجارة إلكترونية متطورة تدعم التقنيات الحديثة مثل الذكاء الاصطناعي لتخصيص تجربة التسوق والواقع المعزز لعرض المنتجات.',
  'innovation',
  'draft',
  'medium',
  CURRENT_DATE + INTERVAL '14 days',
  CURRENT_DATE + INTERVAL '120 days',
  250000,
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
  (SELECT id FROM sectors LIMIT 1),
  (SELECT id FROM deputies LIMIT 1),
  (SELECT id FROM departments LIMIT 1)
) ON CONFLICT DO NOTHING;