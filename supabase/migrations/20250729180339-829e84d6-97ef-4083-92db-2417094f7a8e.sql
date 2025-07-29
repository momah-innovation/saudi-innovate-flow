-- Comprehensive seed data across all services with real data

-- Update profiles for existing users with complete information
UPDATE profiles SET 
  name = 'أحمد العثمان',
  name_ar = 'أحمد العثمان', 
  email = 'ahmed.alothman@momah.gov.sa',
  phone = '+966501234567',
  department = 'Innovation Department',
  position = 'Innovation Director',
  bio = 'مدير الابتكار ذو خبرة واسعة في التطوير التنظيمي والتحول الرقمي وإدارة المشاريع الاستراتيجية',
  profile_image_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  preferred_language = 'ar',
  status = 'active'
WHERE id = '8066cfaf-4a91-4985-922b-74f6a286c441';

UPDATE profiles SET 
  name = 'فاطمة الزهراني',
  name_ar = 'فاطمة الزهراني',
  email = 'fatima.alzahrani@momah.gov.sa', 
  phone = '+966501234568',
  department = 'Campaign Department',
  position = 'Senior Campaign Manager',
  bio = 'مديرة حملات متخصصة في إدارة المشاريع والتنسيق بين الفرق متعددة التخصصات',
  profile_image_url = 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150&h=150&fit=crop&crop=face',
  preferred_language = 'ar',
  status = 'active'
WHERE id = 'fa80bed2-ed61-4c27-8941-f713cf050944';

-- Create additional diverse departments  
INSERT INTO departments (id, name, name_ar, department_head, budget_allocation, deputy_id) VALUES 
(gen_random_uuid(), 'Digital Innovation', 'الابتكار الرقمي', 'محمد السعود', 2500000, (SELECT id FROM deputies LIMIT 1)),
(gen_random_uuid(), 'Research & Development', 'البحث والتطوير', 'نورا القحطاني', 1800000, (SELECT id FROM deputies LIMIT 1)),
(gen_random_uuid(), 'Strategic Partnerships', 'الشراكات الاستراتيجية', 'خالد الرشيد', 1200000, (SELECT id FROM deputies LIMIT 1)),
(gen_random_uuid(), 'Data Analytics', 'تحليل البيانات', 'مريم الدوسري', 900000, (SELECT id FROM deputies LIMIT 1)),
(gen_random_uuid(), 'Change Management', 'إدارة التغيير', 'سعد المطيري', 750000, (SELECT id FROM deputies LIMIT 1))
ON CONFLICT (name) DO NOTHING;

-- Create comprehensive sectors
INSERT INTO sectors (id, name, name_ar, sector_lead, focus_areas) VALUES 
(gen_random_uuid(), 'Healthcare Innovation', 'ابتكار الرعاية الصحية', 'د. علي الشمري', ARRAY['التطبيب عن بُعد', 'الذكاء الاصطناعي الطبي', 'إدارة السجلات الصحية']),
(gen_random_uuid(), 'Education Technology', 'تقنيات التعليم', 'د. هند العتيبي', ARRAY['التعلم الإلكتروني', 'الواقع الافتراضي', 'المناهج التفاعلية']),
(gen_random_uuid(), 'Smart Cities', 'المدن الذكية', 'م. عبدالله الحربي', ARRAY['إنترنت الأشياء', 'النقل الذكي', 'إدارة الطاقة']),
(gen_random_uuid(), 'Financial Technology', 'التقنيات المالية', 'أ. سارة النعيمي', ARRAY['المدفوعات الرقمية', 'البلوك تشين', 'التمويل الشامل']),
(gen_random_uuid(), 'Environmental Solutions', 'الحلول البيئية', 'د. ماجد الغامدي', ARRAY['الطاقة المتجددة', 'إدارة النفايات', 'حماية البيئة'])
ON CONFLICT (name) DO NOTHING;

-- Create realistic partners
INSERT INTO partners (id, organization_name, organization_name_ar, partner_type, contact_person, contact_email, phone, partnership_status, specialization_areas, established_date) VALUES 
(gen_random_uuid(), 'Saudi Aramco', 'أرامكو السعودية', 'strategic', 'أحمد المنصور', 'ahmed.almansour@aramco.com', '+966501234567', 'active', ARRAY['Energy Innovation', 'Digital Transformation'], '2024-01-15'),
(gen_random_uuid(), 'King Abdullah University', 'جامعة الملك عبدالله', 'academic', 'د. فهد العمري', 'fahd.alomari@kaust.edu.sa', '+966501234568', 'active', ARRAY['Research', 'Technology Transfer'], '2024-02-01'),
(gen_random_uuid(), 'STC Group', 'مجموعة STC', 'technology', 'نايف الشهري', 'naif.alshehri@stc.com.sa', '+966501234569', 'active', ARRAY['Telecommunications', '5G Technology'], '2024-01-20'),
(gen_random_uuid(), 'NEOM', 'نيوم', 'strategic', 'لينا الحارثي', 'lina.alharthi@neom.com', '+966501234570', 'active', ARRAY['Future Cities', 'Sustainability'], '2024-03-01'),
(gen_random_uuid(), 'SABIC', 'سابك', 'strategic', 'محمد العتيبي', 'mohammed.alotaibi@sabic.com', '+966501234571', 'active', ARRAY['Chemical Innovation', 'Sustainability'], '2024-02-10');