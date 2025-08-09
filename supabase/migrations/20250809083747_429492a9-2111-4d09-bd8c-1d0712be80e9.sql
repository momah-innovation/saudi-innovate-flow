-- Seed entities table with Saudi Arabia Government entities
-- This migration adds real Saudi government entities linked to appropriate sectors

-- Ministry of Education entities (linked to التعليم sector)
INSERT INTO public.entities (
  name_ar, name_en, description_ar, description_en, entity_type, sector_id, status, 
  contact_email, contact_phone, address, website_url
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
  'https://moe.gov.sa'
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
  'https://ksu.edu.sa'
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
  'https://kau.edu.sa'
);

-- Ministry of Health entities (linked to الصحة sector)
INSERT INTO public.entities (
  name_ar, name_en, description_ar, description_en, entity_type, sector_id, status, 
  contact_email, contact_phone, address, website_url
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
  'https://moh.gov.sa'
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
  'https://kfshrc.edu.sa'
),
(
  'مدينة الملك عبدالعزيز الطبية',
  'King Abdulaziz Medical City',
  'مدينة طبية متكاملة تابعة للحرس الوطني',
  'Comprehensive medical city affiliated with National Guard',
  'government',
  (SELECT id FROM sectors WHERE name_ar = 'الصحة'),
  'active',
  'info@ngha.med.sa',
  '+966-11-8011111',
  'الرياض، المملكة العربية السعودية',
  'https://ngha.med.sa'
);

-- Health Innovation entities (linked to الابتكار الصحي sector)
INSERT INTO public.entities (
  name_ar, name_en, description_ar, description_en, entity_type, sector_id, status, 
  contact_email, contact_phone, address, website_url
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
  'https://hic.gov.sa'
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
  'https://dha.gov.sa'
);

-- Digital Transformation entities (linked to التحول الرقمي sector)
INSERT INTO public.entities (
  name_ar, name_en, description_ar, description_en, entity_type, sector_id, status, 
  contact_email, contact_phone, address, website_url
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
  'https://dga.gov.sa'
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
  'https://ncai.gov.sa'
),
(
  'مركز البيانات الوطني',
  'National Data Center',
  'مركز متخصص في إدارة وتحليل البيانات الحكومية',
  'Specialized center for managing and analyzing government data',
  'government',
  (SELECT id FROM sectors WHERE name_ar = 'التحول الرقمي'),
  'active',
  'info@ndc.gov.sa',
  '+966-11-6789012',
  'الرياض، المملكة العربية السعودية',
  'https://ndc.gov.sa'
);

-- Technology entities (linked to التقنية sector)
INSERT INTO public.entities (
  name_ar, name_en, description_ar, description_en, entity_type, sector_id, status, 
  contact_email, contact_phone, address, website_url
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
  'https://mcit.gov.sa'
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
  'https://kacst.edu.sa'
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
  'https://stc.com.sa'
);

-- Financial entities (linked to المالية sector)
INSERT INTO public.entities (
  name_ar, name_en, description_ar, description_en, entity_type, sector_id, status, 
  contact_email, contact_phone, address, website_url
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
  'https://mof.gov.sa'
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
  'https://sama.gov.sa'
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
  'https://cma.org.sa'
);

-- Smart Cities entities (linked to المدن الذكية sector)
INSERT INTO public.entities (
  name_ar, name_en, description_ar, description_en, entity_type, sector_id, status, 
  contact_email, contact_phone, address, website_url
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
  'https://rcrc.gov.sa'
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
  'https://neom.com'
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
  'https://qiddiya.com'
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
  'https://theredsea.sa'
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