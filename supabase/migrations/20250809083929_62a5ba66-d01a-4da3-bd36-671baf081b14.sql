-- Seed entities table with Saudi Arabia Government entities
-- This migration adds real Saudi government entities linked to appropriate sectors

-- Ministry of Education entities (linked to التعليم sector)
INSERT INTO public.entities (
  name_ar, name_en, description_ar, description_en, entity_type, sector_id, status, 
  contact_email, contact_phone, headquarters_location, website_url, employee_count,
  vision_ar, vision_en, mission_ar, mission_en
) VALUES 
(
  'وزارة التعليم',
  'Ministry of Education',
  'الوزارة المسؤولة عن التعليم العام والعالي في المملكة العربية السعودية',
  'Ministry responsible for general and higher education in Saudi Arabia',
  'government',
  (SELECT id FROM sectors WHERE name_ar = 'التعليم'),
  'active',
  'info@moe.gov.sa',
  '+966-11-4780000',
  'الرياض، المملكة العربية السعودية',
  'https://moe.gov.sa',
  15000,
  'تعليم يسهم في بناء الاقتصاد المعرفي',
  'Education that contributes to building the knowledge economy',
  'تهيئة بيئة تعليمية محفزة للإبداع والابتكار',
  'Creating an educational environment that stimulates creativity and innovation'
),
(
  'جامعة الملك سعود',
  'King Saud University',
  'جامعة حكومية رائدة في التعليم العالي والبحث العلمي',
  'Leading government university in higher education and scientific research',
  'government',
  (SELECT id FROM sectors WHERE name_ar = 'التعليم'),
  'active',
  'info@ksu.edu.sa',
  '+966-11-4670000',
  'الرياض، المملكة العربية السعودية',
  'https://ksu.edu.sa',
  8000,
  'جامعة رائدة عالمياً في التعليم والبحث',
  'Globally leading university in education and research',
  'إعداد كوادر مؤهلة ومبدعة',
  'Preparing qualified and creative professionals'
),
(
  'جامعة الملك عبدالعزيز',
  'King Abdulaziz University',
  'جامعة حكومية متميزة في جدة',
  'Distinguished government university in Jeddah',
  'government',
  (SELECT id FROM sectors WHERE name_ar = 'التعليم'),
  'active',
  'info@kau.edu.sa',
  '+966-12-6400000',
  'جدة، المملكة العربية السعودية',
  'https://kau.edu.sa',
  7500,
  'التميز في التعليم والبحث والخدمة المجتمعية',
  'Excellence in education, research and community service',
  'إعداد خريجين مؤهلين لسوق العمل',
  'Preparing qualified graduates for the job market'
);

-- Ministry of Health entities (linked to الصحة sector)
INSERT INTO public.entities (
  name_ar, name_en, description_ar, description_en, entity_type, sector_id, status, 
  contact_email, contact_phone, headquarters_location, website_url, employee_count,
  vision_ar, vision_en, mission_ar, mission_en
) VALUES 
(
  'وزارة الصحة',
  'Ministry of Health',
  'الوزارة المسؤولة عن الخدمات الصحية في المملكة العربية السعودية',
  'Ministry responsible for healthcare services in Saudi Arabia',
  'government',
  (SELECT id FROM sectors WHERE name_ar = 'الصحة'),
  'active',
  'info@moh.gov.sa',
  '+966-11-4040000',
  'الرياض، المملكة العربية السعودية',
  'https://moh.gov.sa',
  200000,
  'صحة شاملة ومتميزة للجميع',
  'Comprehensive and excellent health for all',
  'تقديم رعاية صحية شاملة وعالية الجودة',
  'Providing comprehensive and high-quality healthcare'
),
(
  'مستشفى الملك فيصل التخصصي',
  'King Faisal Specialist Hospital',
  'مستشفى متخصص رائد في الرعاية الصحية المتقدمة',
  'Leading specialized hospital in advanced healthcare',
  'government',
  (SELECT id FROM sectors WHERE name_ar = 'الصحة'),
  'active',
  'info@kfshrc.edu.sa',
  '+966-11-4647272',
  'الرياض، المملكة العربية السعودية',
  'https://kfshrc.edu.sa',
  12000,
  'الريادة في الرعاية الصحية التخصصية',
  'Leadership in specialized healthcare',
  'تقديم رعاية صحية متطورة ومبتكرة',
  'Providing advanced and innovative healthcare'
);

-- Health Innovation entities (linked to الابتكار الصحي sector)
INSERT INTO public.entities (
  name_ar, name_en, description_ar, description_en, entity_type, sector_id, status, 
  contact_email, contact_phone, headquarters_location, website_url, employee_count,
  vision_ar, vision_en, mission_ar, mission_en
) VALUES 
(
  'مركز الابتكار الصحي',
  'Health Innovation Center',
  'مركز متخصص في تطوير الحلول الصحية المبتكرة',
  'Specialized center for developing innovative health solutions',
  'government',
  (SELECT id FROM sectors WHERE name_ar = 'الابتكار الصحي'),
  'active',
  'info@hic.gov.sa',
  '+966-11-2345678',
  'الرياض، المملكة العربية السعودية',
  'https://hic.gov.sa',
  500,
  'قيادة الابتكار في القطاع الصحي',
  'Leading innovation in the health sector',
  'تطوير حلول صحية مبتكرة ومستدامة',
  'Developing innovative and sustainable health solutions'
),
(
  'هيئة الصحة الرقمية',
  'Digital Health Authority',
  'هيئة متخصصة في تطوير الحلول الصحية الرقمية',
  'Authority specialized in developing digital health solutions',
  'government',
  (SELECT id FROM sectors WHERE name_ar = 'الابتكار الصحي'),
  'active',
  'info@dha.gov.sa',
  '+966-11-3456789',
  'الرياض، المملكة العربية السعودية',
  'https://dha.gov.sa',
  800,
  'تحول رقمي شامل في القطاع الصحي',
  'Comprehensive digital transformation in health sector',
  'تمكين التقنيات الرقمية في الرعاية الصحية',
  'Enabling digital technologies in healthcare'
);

-- Digital Transformation entities (linked to التحول الرقمي sector)
INSERT INTO public.entities (
  name_ar, name_en, description_ar, description_en, entity_type, sector_id, status, 
  contact_email, contact_phone, headquarters_location, website_url, employee_count,
  vision_ar, vision_en, mission_ar, mission_en
) VALUES 
(
  'هيئة الحكومة الرقمية',
  'Digital Government Authority',
  'الهيئة المسؤولة عن التحول الرقمي الحكومي في المملكة',
  'Authority responsible for government digital transformation in the Kingdom',
  'government',
  (SELECT id FROM sectors WHERE name_ar = 'التحول الرقمي'),
  'active',
  'info@dga.gov.sa',
  '+966-11-8001234',
  'الرياض، المملكة العربية السعودية',
  'https://dga.gov.sa',
  2000,
  'حكومة رقمية رائدة عالمياً',
  'Globally leading digital government',
  'تمكين التحول الرقمي الحكومي',
  'Enabling government digital transformation'
),
(
  'المركز الوطني للذكاء الاصطناعي',
  'National Center for Artificial Intelligence',
  'مركز متخصص في تطوير تقنيات الذكاء الاصطناعي',
  'Specialized center for developing artificial intelligence technologies',
  'government',
  (SELECT id FROM sectors WHERE name_ar = 'التحول الرقمي'),
  'active',
  'info@ncai.gov.sa',
  '+966-11-7890123',
  'الرياض، المملكة العربية السعودية',
  'https://ncai.gov.sa',
  300,
  'قيادة الابتكار في الذكاء الاصطناعي',
  'Leading innovation in artificial intelligence',
  'تطوير وتطبيق حلول الذكاء الاصطناعي',
  'Developing and implementing AI solutions'
);

-- Technology entities (linked to التقنية sector)
INSERT INTO public.entities (
  name_ar, name_en, description_ar, description_en, entity_type, sector_id, status, 
  contact_email, contact_phone, headquarters_location, website_url, employee_count,
  vision_ar, vision_en, mission_ar, mission_en
) VALUES 
(
  'وزارة الاتصالات وتقنية المعلومات',
  'Ministry of Communications and Information Technology',
  'الوزارة المسؤولة عن قطاع الاتصالات وتقنية المعلومات',
  'Ministry responsible for communications and information technology sector',
  'government',
  (SELECT id FROM sectors WHERE name_ar = 'التقنية'),
  'active',
  'info@mcit.gov.sa',
  '+966-11-4653333',
  'الرياض، المملكة العربية السعودية',
  'https://mcit.gov.sa',
  5000,
  'مجتمع رقمي متقدم',
  'Advanced digital society',
  'بناء مجتمع رقمي ومعرفي متطور',
  'Building an advanced digital and knowledge society'
),
(
  'مدينة الملك عبدالعزيز للعلوم والتقنية',
  'King Abdulaziz City for Science and Technology',
  'مدينة متخصصة في البحث العلمي والتطوير التقني',
  'Specialized city for scientific research and technological development',
  'government',
  (SELECT id FROM sectors WHERE name_ar = 'التقنية'),
  'active',
  'info@kacst.edu.sa',
  '+966-11-4813333',
  'الرياض، المملكة العربية السعودية',
  'https://kacst.edu.sa',
  3000,
  'الريادة في العلوم والتقنية',
  'Leadership in science and technology',
  'دعم التطوير التقني والابتكار',
  'Supporting technological development and innovation'
),
(
  'شركة الاتصالات السعودية',
  'Saudi Telecom Company',
  'شركة الاتصالات الرائدة في المملكة العربية السعودية',
  'Leading telecommunications company in Saudi Arabia',
  'semi_government',
  (SELECT id FROM sectors WHERE name_ar = 'التقنية'),
  'active',
  'info@stc.com.sa',
  '+966-11-4555555',
  'الرياض، المملكة العربية السعودية',
  'https://stc.com.sa',
  15000,
  'الريادة في التقنيات الرقمية',
  'Leadership in digital technologies',
  'تقديم حلول اتصالات متطورة',
  'Providing advanced communication solutions'
);

-- Financial entities (linked to المالية sector)
INSERT INTO public.entities (
  name_ar, name_en, description_ar, description_en, entity_type, sector_id, status, 
  contact_email, contact_phone, headquarters_location, website_url, employee_count,
  vision_ar, vision_en, mission_ar, mission_en
) VALUES 
(
  'وزارة المالية',
  'Ministry of Finance',
  'الوزارة المسؤولة عن السياسات المالية والميزانية العامة',
  'Ministry responsible for financial policies and public budget',
  'government',
  (SELECT id FROM sectors WHERE name_ar = 'المالية'),
  'active',
  'info@mof.gov.sa',
  '+966-11-4059999',
  'الرياض، المملكة العربية السعودية',
  'https://mof.gov.sa',
  8000,
  'نظام مالي متطور ومستدام',
  'Advanced and sustainable financial system',
  'إدارة الموارد المالية بكفاءة',
  'Efficiently managing financial resources'
),
(
  'مؤسسة النقد العربي السعودي',
  'Saudi Central Bank (SAMA)',
  'البنك المركزي للمملكة العربية السعودية',
  'Central Bank of Saudi Arabia',
  'government',
  (SELECT id FROM sectors WHERE name_ar = 'المالية'),
  'active',
  'info@sama.gov.sa',
  '+966-11-4633000',
  'الرياض، المملكة العربية السعودية',
  'https://sama.gov.sa',
  3000,
  'نظام مصرفي قوي ومستقر',
  'Strong and stable banking system',
  'تنظيم ومراقبة القطاع المصرفي',
  'Regulating and supervising the banking sector'
),
(
  'هيئة السوق المالية',
  'Capital Market Authority',
  'الهيئة التنظيمية للسوق المالية في المملكة',
  'Regulatory authority for the capital market in the Kingdom',
  'government',
  (SELECT id FROM sectors WHERE name_ar = 'المالية'),
  'active',
  'info@cma.org.sa',
  '+966-11-2053000',
  'الرياض، المملكة العربية السعودية',
  'https://cma.org.sa',
  800,
  'سوق مالية متطورة وشفافة',
  'Advanced and transparent capital market',
  'تنظيم وتطوير السوق المالية',
  'Regulating and developing the capital market'
);

-- Smart Cities entities (linked to المدن الذكية sector)
INSERT INTO public.entities (
  name_ar, name_en, description_ar, description_en, entity_type, sector_id, status, 
  contact_email, contact_phone, headquarters_location, website_url, employee_count,
  vision_ar, vision_en, mission_ar, mission_en
) VALUES 
(
  'الهيئة الملكية لمدينة الرياض',
  'Royal Commission for Riyadh City',
  'الهيئة المسؤولة عن تطوير مدينة الرياض وتحويلها لمدينة ذكية',
  'Authority responsible for developing Riyadh city and transforming it into a smart city',
  'government',
  (SELECT id FROM sectors WHERE name_ar = 'المدن الذكية'),
  'active',
  'info@rcrc.gov.sa',
  '+966-11-4560000',
  'الرياض، المملكة العربية السعودية',
  'https://rcrc.gov.sa',
  2500,
  'الرياض مدينة ذكية ومستدامة',
  'Riyadh as a smart and sustainable city',
  'تطوير الرياض لتكون مدينة عالمية',
  'Developing Riyadh to be a global city'
),
(
  'مشروع نيوم',
  'NEOM Project',
  'مشروع مدينة مستقبلية ذكية في شمال غرب المملكة',
  'Futuristic smart city project in northwest Saudi Arabia',
  'government',
  (SELECT id FROM sectors WHERE name_ar = 'المدن الذكية'),
  'active',
  'info@neom.com',
  '+966-11-8001000',
  'تبوك، المملكة العربية السعودية',
  'https://neom.com',
  5000,
  'مدينة المستقبل المدعومة بالذكاء الاصطناعي',
  'Future city powered by artificial intelligence',
  'إنشاء مدينة مستقبلية مبتكرة',
  'Creating an innovative futuristic city'
),
(
  'مشروع القدية',
  'Qiddiya Project',
  'مشروع مدينة ترفيهية ورياضية ذكية',
  'Smart entertainment and sports city project',
  'government',
  (SELECT id FROM sectors WHERE name_ar = 'المدن الذكية'),
  'active',
  'info@qiddiya.com',
  '+966-11-9001000',
  'الرياض، المملكة العربية السعودية',
  'https://qiddiya.com',
  1500,
  'عاصمة الترفيه والرياضة والثقافة',
  'Capital of entertainment, sports and culture',
  'إنشاء وجهة ترفيهية عالمية',
  'Creating a global entertainment destination'
),
(
  'مشروع البحر الأحمر',
  'Red Sea Project',
  'مشروع وجهة سياحية فاخرة ومستدامة',
  'Luxury and sustainable tourism destination project',
  'government',
  (SELECT id FROM sectors WHERE name_ar = 'المدن الذكية'),
  'active',
  'info@theredsea.sa',
  '+966-11-7001000',
  'تبوك، المملكة العربية السعودية',
  'https://theredsea.sa',
  2000,
  'وجهة سياحية عالمية مستدامة',
  'Sustainable global tourism destination',
  'تطوير السياحة المستدامة والترف البيئي',
  'Developing sustainable tourism and environmental luxury'
);

-- Log the seeding operation
INSERT INTO public.security_audit_log (
  user_id, action_type, resource_type, details, risk_level
) VALUES (
  auth.uid(), 'ENTITY_SEEDING', 'entities', 
  jsonb_build_object(
    'action', 'seeded_saudi_government_entities',
    'total_entities', 19,
    'sectors_covered', 7,
    'entity_types', ARRAY['government', 'semi_government']
  ), 'low'
);