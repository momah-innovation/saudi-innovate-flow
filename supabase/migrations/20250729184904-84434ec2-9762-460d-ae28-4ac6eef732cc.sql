-- Drop the problematic function and recreate it properly
DROP FUNCTION IF EXISTS public.assign_default_innovator_role() CASCADE;

-- Create the function with correct syntax
CREATE OR REPLACE FUNCTION public.assign_default_innovator_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role, is_active)
  VALUES (NEW.id, 'innovator', true);
  
  RETURN NEW;
END;
$$;

-- Now seed the data
WITH user_data AS (
  SELECT id, email, raw_user_meta_data->>'name' as name_ar
  FROM auth.users 
  WHERE email LIKE '%@gov.sa'
)
INSERT INTO public.profiles (id, name_ar, name, email, phone, position, department, bio, status, preferred_language)
SELECT 
  u.id,
  u.name_ar,
  u.name_ar,
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
FROM user_data u
ON CONFLICT (id) DO NOTHING;

-- Assign roles to users
WITH user_data AS (
  SELECT id, email FROM auth.users WHERE email LIKE '%@gov.sa'
)
INSERT INTO public.user_roles (user_id, role, is_active, granted_at) 
SELECT 
  u.id,
  CASE 
    WHEN u.email LIKE 'ahmed.alotaibi%' THEN 'admin'
    WHEN u.email LIKE 'fatima.alsaeed%' THEN 'admin'
    WHEN u.email LIKE 'mohammed.alharbi%' THEN 'content_manager'
    WHEN u.email LIKE 'sara.alzahrani%' THEN 'data_analyst'
    WHEN u.email LIKE 'khalid.almutairi%' THEN 'challenge_manager'
    WHEN u.email LIKE 'noura.alqahtani%' THEN 'domain_expert'
    WHEN u.email LIKE 'abdullah.alshamrani%' THEN 'domain_expert'
    WHEN u.email LIKE 'aisha.aldosari%' THEN 'content_manager'
    WHEN u.email LIKE 'omar.alghamdi%' THEN 'partnership_manager'
    WHEN u.email LIKE 'maryam.alrashid%' THEN 'innovator'
    WHEN u.email LIKE 'youssef.albarak%' THEN 'innovator'
    WHEN u.email LIKE 'layla.almousa%' THEN 'innovator'
    WHEN u.email LIKE 'mansour.alahmed%' THEN 'domain_expert'
    WHEN u.email LIKE 'hind.alassaf%' THEN 'data_analyst'
    WHEN u.email LIKE 'fahad.alsubaie%' THEN 'user_manager'
    WHEN u.email LIKE 'reem.alkhalil%' THEN 'innovator'
    WHEN u.email LIKE 'sultan.alkhaldi%' THEN 'content_manager'
    WHEN u.email LIKE 'amira.alnajjar%' THEN 'domain_expert'
    WHEN u.email LIKE 'hassan.almasoud%' THEN 'challenge_manager'
    ELSE 'innovator'
  END,
  true,
  now()
FROM user_data u
ON CONFLICT (user_id, role) DO NOTHING;