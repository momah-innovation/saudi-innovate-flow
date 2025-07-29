-- Seed user profiles and roles for the 20 users (fixed version)
-- Skip creating profiles table and policies since they already exist

-- Insert profiles for all users
WITH user_data AS (
  SELECT id, email, raw_user_meta_data->>'name' as name_ar
  FROM auth.users 
  WHERE email LIKE '%@gov.sa'
)
INSERT INTO public.profiles (id, name_ar, name, email, phone, job_title, department, bio, location)
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
  'الرياض'
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
    WHEN u.email LIKE 'ahmed.alotaibi%' THEN 'admin'::app_role
    WHEN u.email LIKE 'fatima.alsaeed%' THEN 'admin'::app_role
    WHEN u.email LIKE 'mohammed.alharbi%' THEN 'team_member'::app_role
    WHEN u.email LIKE 'sara.alzahrani%' THEN 'expert'::app_role
    WHEN u.email LIKE 'khalid.almutairi%' THEN 'team_member'::app_role
    WHEN u.email LIKE 'noura.alqahtani%' THEN 'expert'::app_role
    WHEN u.email LIKE 'abdullah.alshamrani%' THEN 'expert'::app_role
    WHEN u.email LIKE 'aisha.aldosari%' THEN 'team_member'::app_role
    WHEN u.email LIKE 'omar.alghamdi%' THEN 'partner_representative'::app_role
    WHEN u.email LIKE 'maryam.alrashid%' THEN 'innovator'::app_role
    WHEN u.email LIKE 'youssef.albarak%' THEN 'innovator'::app_role
    WHEN u.email LIKE 'layla.almousa%' THEN 'innovator'::app_role
    WHEN u.email LIKE 'mansour.alahmed%' THEN 'expert'::app_role
    WHEN u.email LIKE 'hind.alassaf%' THEN 'team_member'::app_role
    WHEN u.email LIKE 'fahad.alsubaie%' THEN 'team_member'::app_role
    WHEN u.email LIKE 'reem.alkhalil%' THEN 'innovator'::app_role
    WHEN u.email LIKE 'sultan.alkhaldi%' THEN 'team_member'::app_role
    WHEN u.email LIKE 'amira.alnajjar%' THEN 'expert'::app_role
    WHEN u.email LIKE 'hassan.almasoud%' THEN 'team_leader'::app_role
    ELSE 'innovator'::app_role
  END,
  true,
  now()
FROM user_data u
ON CONFLICT (user_id, role) DO NOTHING;

-- Create expert profiles for users with expert role
WITH expert_users AS (
  SELECT u.id, u.email, ur.role 
  FROM auth.users u
  JOIN user_roles ur ON u.id = ur.user_id
  WHERE ur.role = 'expert' AND u.email LIKE '%@gov.sa'
)
INSERT INTO public.experts (user_id, expertise_areas, experience_years, expert_level, education_background, certifications, availability_status, consultation_rate)
SELECT 
  eu.id,
  CASE 
    WHEN eu.email LIKE 'sara.alzahrani%' THEN ARRAY['تحليل البيانات', 'ذكاء الأعمال', 'التحليل الإحصائي']
    WHEN eu.email LIKE 'noura.alqahtani%' THEN ARRAY['تصميم تجربة المستخدم', 'التفاعل الإنساني', 'التصميم الرقمي']
    WHEN eu.email LIKE 'abdullah.alshamrani%' THEN ARRAY['الاستشارات التقنية', 'هندسة البرمجيات', 'الأمن السيبراني']
    WHEN eu.email LIKE 'mansour.alahmed%' THEN ARRAY['الذكاء الاصطناعي', 'تعلم الآلة', 'معالجة اللغات الطبيعية']
    WHEN eu.email LIKE 'amira.alnajjar%' THEN ARRAY['الاستدامة', 'البيئة', 'الطاقة المتجددة']
    ELSE ARRAY['الابتكار', 'التطوير', 'الاستشارات']
  END,
  CASE 
    WHEN eu.email LIKE 'sara.alzahrani%' THEN 8
    WHEN eu.email LIKE 'noura.alqahtani%' THEN 6
    WHEN eu.email LIKE 'abdullah.alshamrani%' THEN 12
    WHEN eu.email LIKE 'mansour.alahmed%' THEN 10
    WHEN eu.email LIKE 'amira.alnajjar%' THEN 7
    ELSE 5
  END,
  'senior',
  'ماجستير في التخصص المطلوب من جامعة معترف بها',
  ARRAY['شهادة مهنية معتمدة', 'شهادة إدارة مشاريع'],
  'available',
  500.00
FROM expert_users eu
ON CONFLICT (user_id) DO NOTHING;

-- Create innovator profiles for users with innovator role
WITH innovator_users AS (
  SELECT u.id, u.email, ur.role 
  FROM auth.users u
  JOIN user_roles ur ON u.id = ur.user_id
  WHERE ur.role = 'innovator' AND u.email LIKE '%@gov.sa'
)
INSERT INTO public.innovators (user_id, innovation_focus_areas, career_stage, education_level, previous_innovations_count, preferred_collaboration_style, availability_for_projects, skills_and_expertise)
SELECT 
  iu.id,
  CASE 
    WHEN iu.email LIKE 'maryam.alrashid%' THEN ARRAY['التمويل الرقمي', 'التقنية المالية']
    WHEN iu.email LIKE 'youssef.albarak%' THEN ARRAY['تطوير التطبيقات', 'التقنيات الناشئة']
    WHEN iu.email LIKE 'layla.almousa%' THEN ARRAY['التسويق الرقمي', 'وسائل التواصل الاجتماعي']
    WHEN iu.email LIKE 'reem.alkhalil%' THEN ARRAY['هندسة البرمجيات', 'التطوير المتقدم']
    ELSE ARRAY['التطوير', 'الابتكار التقني']
  END,
  'mid_career',
  'bachelor',
  CASE 
    WHEN iu.email LIKE 'maryam.alrashid%' THEN 3
    WHEN iu.email LIKE 'youssef.albarak%' THEN 5
    WHEN iu.email LIKE 'layla.almousa%' THEN 2
    WHEN iu.email LIKE 'reem.alkhalil%' THEN 4
    ELSE 1
  END,
  'collaborative',
  'full_time',
  ARRAY['البرمجة', 'التحليل', 'إدارة المشاريع']
FROM innovator_users iu
ON CONFLICT (user_id) DO NOTHING;

-- Create innovation team members for team-related roles
WITH team_users AS (
  SELECT u.id, u.email, ur.role 
  FROM auth.users u
  JOIN user_roles ur ON u.id = ur.user_id
  WHERE ur.role IN ('team_member', 'team_leader', 'admin') AND u.email LIKE '%@gov.sa'
)
INSERT INTO public.innovation_team_members (user_id, specialization, role_in_team, max_concurrent_projects, skills, availability_status, performance_rating, current_workload)
SELECT 
  tu.id,
  CASE 
    WHEN tu.email LIKE 'mohammed.alharbi%' THEN 'تطوير النظم'
    WHEN tu.email LIKE 'khalid.almutairi%' THEN 'إدارة المشاريع'
    WHEN tu.email LIKE 'aisha.aldosari%' THEN 'أمن المعلومات'
    WHEN tu.email LIKE 'hind.alassaf%' THEN 'تحليل الأعمال'
    WHEN tu.email LIKE 'fahad.alsubaie%' THEN 'إدارة الموارد'
    WHEN tu.email LIKE 'sultan.alkhaldi%' THEN 'ضمان الجودة'
    WHEN tu.email LIKE 'ahmed.alotaibi%' THEN 'إدارة الابتكار'
    WHEN tu.email LIKE 'fatima.alsaeed%' THEN 'تطوير الأعمال'
    WHEN tu.email LIKE 'hassan.almasoud%' THEN 'القيادة التقنية'
    ELSE 'عضو فريق'
  END,
  CASE 
    WHEN tu.role = 'admin' THEN 'manager'
    WHEN tu.role = 'team_leader' THEN 'lead'
    ELSE 'member'
  END,
  CASE 
    WHEN tu.role = 'admin' THEN 5
    WHEN tu.role = 'team_leader' THEN 4
    ELSE 3
  END,
  ARRAY['البرمجة', 'التحليل', 'إدارة المشاريع', 'التطوير'],
  'available',
  4.5,
  CASE 
    WHEN tu.role = 'admin' THEN 80
    WHEN tu.role = 'team_leader' THEN 70
    ELSE 60
  END
FROM team_users tu
ON CONFLICT (user_id) DO NOTHING;