-- Fix the function and then seed the profiles and roles
DROP FUNCTION IF EXISTS public.assign_default_innovator_role() CASCADE;

CREATE OR REPLACE FUNCTION public.assign_default_innovator_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role, is_active)
  VALUES (NEW.id, 'innovator'::public.app_role, true);
  
  RETURN NEW;
END;
$$;

-- Seed profiles for all users
INSERT INTO public.profiles (id, name_ar, name, email, phone, position, department, bio, status, preferred_language)
SELECT 
  u.id,
  (u.raw_user_meta_data->>'name_ar'),
  (u.raw_user_meta_data->>'name_ar'),
  u.email,
  CASE 
    WHEN u.email LIKE 'ahmed.alotaibi%' THEN '+966501234567'
    WHEN u.email LIKE 'fatima.alsaeed%' THEN '+966501234568'
    WHEN u.email LIKE 'mohammed.alharbi%' THEN '+966501234569'
    WHEN u.email LIKE 'sara.alzahrani%' THEN '+966501234570'
    WHEN u.email LIKE 'khalid.almutairi%' THEN '+966501234571'
    WHEN u.email LIKE 'noura.alqahtani%' THEN '+966501234572'
    WHEN u.email LIKE 'abdullah.alshamrani%' THEN '+966501234573'
    WHEN u.email LIKE 'aisha.aldosari%' THEN '+966501234574'
    WHEN u.email LIKE 'omar.alghamdi%' THEN '+966501234575'
    WHEN u.email LIKE 'maryam.alrashid%' THEN '+966501234576'
    WHEN u.email LIKE 'youssef.albarak%' THEN '+966501234577'
    WHEN u.email LIKE 'layla.almousa%' THEN '+966501234578'
    WHEN u.email LIKE 'mansour.alahmed%' THEN '+966501234579'
    WHEN u.email LIKE 'hind.alassaf%' THEN '+966501234580'
    WHEN u.email LIKE 'fahad.alsubaie%' THEN '+966501234581'
    WHEN u.email LIKE 'reem.alkhalil%' THEN '+966501234582'
    WHEN u.email LIKE 'sultan.alkhaldi%' THEN '+966501234583'
    WHEN u.email LIKE 'amira.alnajjar%' THEN '+966501234584'
    WHEN u.email LIKE 'hassan.almasoud%' THEN '+966501234585'
    ELSE '+966501234586'
  END,
  CASE 
    WHEN u.email LIKE 'ahmed.alotaibi%' THEN 'مدير إدارة الابتكار'
    WHEN u.email LIKE 'fatima.alsaeed%' THEN 'خبيرة تطوير الأعمال'
    WHEN u.email LIKE 'mohammed.alharbi%' THEN 'مطور نظم معلومات'
    WHEN u.email LIKE 'sara.alzahrani%' THEN 'محللة بيانات'
    WHEN u.email LIKE 'khalid.almutairi%' THEN 'مدير مشاريع'
    WHEN u.email LIKE 'noura.alqahtani%' THEN 'مصممة تجربة المستخدم'
    WHEN u.email LIKE 'abdullah.alshamrani%' THEN 'مستشار تقني'
    WHEN u.email LIKE 'aisha.aldosari%' THEN 'خبيرة أمن المعلومات'
    WHEN u.email LIKE 'omar.alghamdi%' THEN 'مدير علاقات الشراكات'
    WHEN u.email LIKE 'maryam.alrashid%' THEN 'محاسبة مالية'
    WHEN u.email LIKE 'youssef.albarak%' THEN 'مطور تطبيقات'
    WHEN u.email LIKE 'layla.almousa%' THEN 'مديرة التسويق الرقمي'
    WHEN u.email LIKE 'mansour.alahmed%' THEN 'خبير ذكاء اصطناعي'
    WHEN u.email LIKE 'hind.alassaf%' THEN 'محللة أعمال'
    WHEN u.email LIKE 'fahad.alsubaie%' THEN 'مدير الموارد البشرية'
    WHEN u.email LIKE 'reem.alkhalil%' THEN 'مهندسة برمجيات'
    WHEN u.email LIKE 'sultan.alkhaldi%' THEN 'مدير الجودة'
    WHEN u.email LIKE 'amira.alnajjar%' THEN 'خبيرة الاستدامة'
    WHEN u.email LIKE 'hassan.almasoud%' THEN 'مدير الابتكار التقني'
    ELSE 'موظف حكومي'
  END,
  CASE 
    WHEN u.email LIKE '%ahmed%' OR u.email LIKE '%khalid%' OR u.email LIKE '%abdullah%' THEN 'إدارة التقنية والابتكار'
    WHEN u.email LIKE '%fatima%' OR u.email LIKE '%sara%' OR u.email LIKE '%noura%' THEN 'إدارة تطوير الأعمال'
    WHEN u.email LIKE '%mohammed%' OR u.email LIKE '%omar%' OR u.email LIKE '%youssef%' THEN 'إدارة نظم المعلومات'
    WHEN u.email LIKE '%aisha%' OR u.email LIKE '%maryam%' OR u.email LIKE '%layla%' THEN 'إدارة الجودة والمتابعة'
    ELSE 'إدارة الشراكات والتطوير'
  END,
  CASE 
    WHEN u.email LIKE 'ahmed.alotaibi%' THEN 'خبير في إدارة الابتكار وتطوير المنتجات الرقمية مع أكثر من 10 سنوات من الخبرة في القطاع الحكومي'
    WHEN u.email LIKE 'fatima.alsaeed%' THEN 'متخصصة في تطوير الأعمال والاستراتيجيات مع خبرة في إدارة المشاريع الحكومية'
    WHEN u.email LIKE 'mohammed.alharbi%' THEN 'مطور نظم معلومات متخصص في التقنيات الحديثة والذكاء الاصطناعي'
    WHEN u.email LIKE 'sara.alzahrani%' THEN 'خبيرة في تحليل البيانات وذكاء الأعمال مع تركيز على القطاع الحكومي'
    ELSE 'موظف حكومي ملتزم بتحقيق رؤية المملكة 2030'
  END,
  'active',
  'ar'
FROM auth.users u
WHERE u.email LIKE '%@gov.sa'
ON CONFLICT (id) DO NOTHING;

-- Create individual role assignments using individual INSERT statements
INSERT INTO public.user_roles (user_id, role, is_active, granted_at) 
SELECT id, 'admin'::public.app_role, true, now() FROM auth.users WHERE email LIKE 'ahmed.alotaibi%'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.user_roles (user_id, role, is_active, granted_at) 
SELECT id, 'admin'::public.app_role, true, now() FROM auth.users WHERE email LIKE 'fatima.alsaeed%'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.user_roles (user_id, role, is_active, granted_at) 
SELECT id, 'content_manager'::public.app_role, true, now() FROM auth.users WHERE email LIKE 'mohammed.alharbi%'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.user_roles (user_id, role, is_active, granted_at) 
SELECT id, 'data_analyst'::public.app_role, true, now() FROM auth.users WHERE email LIKE 'sara.alzahrani%'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.user_roles (user_id, role, is_active, granted_at) 
SELECT id, 'challenge_manager'::public.app_role, true, now() FROM auth.users WHERE email LIKE 'khalid.almutairi%'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.user_roles (user_id, role, is_active, granted_at) 
SELECT id, 'domain_expert'::public.app_role, true, now() FROM auth.users WHERE email LIKE 'noura.alqahtani%'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.user_roles (user_id, role, is_active, granted_at) 
SELECT id, 'domain_expert'::public.app_role, true, now() FROM auth.users WHERE email LIKE 'abdullah.alshamrani%'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.user_roles (user_id, role, is_active, granted_at) 
SELECT id, 'partnership_manager'::public.app_role, true, now() FROM auth.users WHERE email LIKE 'omar.alghamdi%'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.user_roles (user_id, role, is_active, granted_at) 
SELECT id, 'innovator'::public.app_role, true, now() FROM auth.users WHERE email LIKE 'maryam.alrashid%'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.user_roles (user_id, role, is_active, granted_at) 
SELECT id, 'innovator'::public.app_role, true, now() FROM auth.users WHERE email LIKE 'youssef.albarak%'
ON CONFLICT (user_id, role) DO NOTHING;