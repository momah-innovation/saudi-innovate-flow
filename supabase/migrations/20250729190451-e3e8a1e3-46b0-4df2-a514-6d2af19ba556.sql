-- Comprehensive seeding using profile IDs instead of auth user IDs since the foreign key likely references profiles

-- First, let's create a few innovators using existing profile IDs
INSERT INTO public.innovators (user_id, areas_of_interest, innovation_background, experience_level) 
SELECT id, ARRAY['تكنولوجيا المعلومات', 'الذكاء الاصطناعي'], 'مطور تطبيقات ذكية مع خبرة في التعلم الآلي', 'intermediate'
FROM public.profiles LIMIT 1;

INSERT INTO public.innovators (user_id, areas_of_interest, innovation_background, experience_level) 
SELECT id, ARRAY['الطاقة المتجددة', 'الاستدامة'], 'مهندس طاقة متخصص في الحلول البيئية المستدامة', 'advanced'
FROM public.profiles OFFSET 1 LIMIT 1;

INSERT INTO public.innovators (user_id, areas_of_interest, innovation_background, experience_level) 
SELECT id, ARRAY['الصحة الرقمية', 'التطبيقات الطبية'], 'مطور تطبيقات صحية ومتخصص في المعلوماتية الصحية', 'intermediate'
FROM public.profiles OFFSET 2 LIMIT 1;

INSERT INTO public.innovators (user_id, areas_of_interest, innovation_background, experience_level) 
SELECT id, ARRAY['التعليم التقني', 'التدريب المهني'], 'خبير في تطوير المناهج التعليمية والمنصات التفاعلية', 'advanced'
FROM public.profiles OFFSET 3 LIMIT 1;

INSERT INTO public.innovators (user_id, areas_of_interest, innovation_background, experience_level) 
SELECT id, ARRAY['الأمن السيبراني', 'حماية البيانات'], 'متخصص أمن معلومات مع خبرة في حماية الأنظمة', 'expert'
FROM public.profiles OFFSET 4 LIMIT 1;

INSERT INTO public.innovators (user_id, areas_of_interest, innovation_background, experience_level) 
SELECT id, ARRAY['التجارة الإلكترونية', 'التسويق الرقمي'], 'خبير في تطوير منصات التجارة الإلكترونية والتسويق', 'intermediate'
FROM public.profiles OFFSET 5 LIMIT 1;

INSERT INTO public.innovators (user_id, areas_of_interest, innovation_background, experience_level) 
SELECT id, ARRAY['الزراعة الذكية', 'التكنولوجيا الزراعية'], 'مهندس زراعي متخصص في تطبيق التقنيات الحديثة', 'advanced'
FROM public.profiles OFFSET 6 LIMIT 1;

INSERT INTO public.innovators (user_id, areas_of_interest, innovation_background, experience_level) 
SELECT id, ARRAY['النقل الذكي', 'اللوجستيات'], 'خبير في أنظمة النقل الذكي وحلول اللوجستيات', 'intermediate'
FROM public.profiles OFFSET 7 LIMIT 1;

-- Create experts using profile IDs
INSERT INTO public.experts (user_id, expertise_areas, experience_years, expert_level, certifications, education_background, consultation_rate) 
SELECT id, ARRAY['إدارة التكنولوجيا', 'التحول الرقمي'], 15, 'senior', ARRAY['PMP', 'ITIL'], 'ماجستير في إدارة التكنولوجيا', 500.00
FROM public.profiles OFFSET 2 LIMIT 1;

INSERT INTO public.experts (user_id, expertise_areas, experience_years, expert_level, certifications, education_background, consultation_rate) 
SELECT id, ARRAY['تحليل البيانات', 'الذكاء التجاري'], 12, 'senior', ARRAY['Certified Analytics Professional'], 'ماجستير في علوم البيانات', 450.00
FROM public.profiles OFFSET 3 LIMIT 1;

INSERT INTO public.experts (user_id, expertise_areas, experience_years, expert_level, certifications, education_background, consultation_rate) 
SELECT id, ARRAY['الطاقة المتجددة', 'الهندسة البيئية'], 18, 'expert', ARRAY['Professional Engineer'], 'دكتوراه في الهندسة البيئية', 600.00
FROM public.profiles OFFSET 4 LIMIT 1;

INSERT INTO public.experts (user_id, expertise_areas, experience_years, expert_level, certifications, education_background, consultation_rate) 
SELECT id, ARRAY['الصحة العامة', 'المعلوماتية الصحية'], 20, 'expert', ARRAY['Board Certified'], 'دكتوراه في الصحة العامة', 700.00
FROM public.profiles OFFSET 5 LIMIT 1;

INSERT INTO public.experts (user_id, expertise_areas, experience_years, expert_level, certifications, education_background, consultation_rate) 
SELECT id, ARRAY['التعليم والتدريب', 'التطوير المهني'], 14, 'senior', ARRAY['Training Certification'], 'ماجستير في التربية', 400.00
FROM public.profiles OFFSET 6 LIMIT 1;

INSERT INTO public.experts (user_id, expertise_areas, experience_years, expert_level, certifications, education_background, consultation_rate) 
SELECT id, ARRAY['إدارة التحديات', 'الابتكار المؤسسي'], 16, 'senior', ARRAY['Innovation Management'], 'ماجستير في إدارة الأعمال', 550.00
FROM public.profiles OFFSET 7 LIMIT 1;

INSERT INTO public.experts (user_id, expertise_areas, experience_years, expert_level, certifications, education_background, consultation_rate) 
SELECT id, ARRAY['إدارة التحديات', 'التخطيط الاستراتيجي'], 13, 'senior', ARRAY['Strategic Planning'], 'ماجستير في الإدارة الاستراتيجية', 500.00
FROM public.profiles OFFSET 8 LIMIT 1;

-- Create innovation team members using profile IDs
INSERT INTO public.innovation_team_members (user_id, role, status, max_concurrent_projects, skills, current_workload) 
SELECT id, 'admin', 'active', 10, ARRAY['إدارة النظام', 'إدارة المستخدمين'], 0
FROM public.profiles LIMIT 1;

INSERT INTO public.innovation_team_members (user_id, role, status, max_concurrent_projects, skills, current_workload) 
SELECT id, 'admin', 'active', 8, ARRAY['الإشراف العام', 'إدارة التحديات'], 0
FROM public.profiles OFFSET 1 LIMIT 1;

INSERT INTO public.innovation_team_members (user_id, role, status, max_concurrent_projects, skills, current_workload) 
SELECT id, 'expert', 'active', 5, ARRAY['إدارة التكنولوجيا', 'التحول الرقمي'], 0
FROM public.profiles OFFSET 2 LIMIT 1;

INSERT INTO public.innovation_team_members (user_id, role, status, max_concurrent_projects, skills, current_workload) 
SELECT id, 'analyst', 'active', 6, ARRAY['تحليل البيانات', 'إعداد التقارير'], 0
FROM public.profiles OFFSET 3 LIMIT 1;

INSERT INTO public.innovation_team_members (user_id, role, status, max_concurrent_projects, skills, current_workload) 
SELECT id, 'expert', 'active', 4, ARRAY['الطاقة المتجددة', 'الاستشارات البيئية'], 0
FROM public.profiles OFFSET 4 LIMIT 1;

INSERT INTO public.innovation_team_members (user_id, role, status, max_concurrent_projects, skills, current_workload) 
SELECT id, 'expert', 'active', 4, ARRAY['الصحة العامة', 'البحث الطبي'], 0
FROM public.profiles OFFSET 5 LIMIT 1;

INSERT INTO public.innovation_team_members (user_id, role, status, max_concurrent_projects, skills, current_workload) 
SELECT id, 'expert', 'active', 5, ARRAY['التدريب والتطوير', 'المناهج'], 0
FROM public.profiles OFFSET 6 LIMIT 1;

INSERT INTO public.innovation_team_members (user_id, role, status, max_concurrent_projects, skills, current_workload) 
SELECT id, 'manager', 'active', 6, ARRAY['إدارة التحديات', 'التخطيط'], 0
FROM public.profiles OFFSET 7 LIMIT 1;

INSERT INTO public.innovation_team_members (user_id, role, status, max_concurrent_projects, skills, current_workload) 
SELECT id, 'manager', 'active', 6, ARRAY['إدارة المشاريع', 'التنسيق'], 0
FROM public.profiles OFFSET 8 LIMIT 1;

INSERT INTO public.innovation_team_members (user_id, role, status, max_concurrent_projects, skills, current_workload) 
SELECT id, 'analyst', 'active', 7, ARRAY['تحليل الأداء', 'المتابعة'], 0
FROM public.profiles OFFSET 9 LIMIT 1;

INSERT INTO public.innovation_team_members (user_id, role, status, max_concurrent_projects, skills, current_workload) 
SELECT id, 'content_manager', 'active', 8, ARRAY['إدارة المحتوى', 'التحرير'], 0
FROM public.profiles OFFSET 18 LIMIT 1;

INSERT INTO public.innovation_team_members (user_id, role, status, max_concurrent_projects, skills, current_workload) 
SELECT id, 'content_manager', 'active', 8, ARRAY['المراجعة', 'النشر'], 0
FROM public.profiles OFFSET 19 LIMIT 1;

-- Create stakeholders using profile IDs
INSERT INTO public.stakeholders (user_id, stakeholder_type, influence_level, engagement_status, contact_preferences) 
SELECT id, 'internal', 'high', 'active', 'email'
FROM public.profiles LIMIT 1;

INSERT INTO public.stakeholders (user_id, stakeholder_type, influence_level, engagement_status, contact_preferences) 
SELECT id, 'external', 'medium', 'active', 'phone'
FROM public.profiles OFFSET 1 LIMIT 1;

INSERT INTO public.stakeholders (user_id, stakeholder_type, influence_level, engagement_status, contact_preferences) 
SELECT id, 'internal', 'high', 'active', 'email'
FROM public.profiles OFFSET 2 LIMIT 1;

INSERT INTO public.stakeholders (user_id, stakeholder_type, influence_level, engagement_status, contact_preferences) 
SELECT id, 'partner', 'high', 'active', 'email'
FROM public.profiles OFFSET 3 LIMIT 1;

INSERT INTO public.stakeholders (user_id, stakeholder_type, influence_level, engagement_status, contact_preferences) 
SELECT id, 'internal', 'medium', 'active', 'phone'
FROM public.profiles OFFSET 4 LIMIT 1;

INSERT INTO public.stakeholders (user_id, stakeholder_type, influence_level, engagement_status, contact_preferences) 
SELECT id, 'external', 'medium', 'active', 'email'
FROM public.profiles OFFSET 5 LIMIT 1;

INSERT INTO public.stakeholders (user_id, stakeholder_type, influence_level, engagement_status, contact_preferences) 
SELECT id, 'partner', 'high', 'active', 'email'
FROM public.profiles OFFSET 6 LIMIT 1;

INSERT INTO public.stakeholders (user_id, stakeholder_type, influence_level, engagement_status, contact_preferences) 
SELECT id, 'internal', 'medium', 'active', 'phone'
FROM public.profiles OFFSET 7 LIMIT 1;

-- Create partner organizations
INSERT INTO public.partners (name_ar, name_en, partner_type, contact_email, contact_phone, status, collaboration_areas, partnership_level) VALUES
('شركة التقنيات المتقدمة', 'Advanced Technologies Company', 'private_sector', 'info@advtech.sa', '+966501234567', 'active', ARRAY['التكنولوجيا', 'الابتكار'], 'strategic'),
('معهد البحوث التطبيقية', 'Applied Research Institute', 'research_institute', 'research@ari.sa', '+966501234568', 'active', ARRAY['البحث والتطوير', 'الدراسات'], 'operational'),
('جامعة الملك عبدالعزيز', 'King Abdulaziz University', 'academic', 'innovation@kau.edu.sa', '+966501234569', 'active', ARRAY['التعليم', 'البحث العلمي'], 'strategic'),
('مؤسسة الطاقة المستدامة', 'Sustainable Energy Foundation', 'non_profit', 'contact@sef.org.sa', '+966501234570', 'active', ARRAY['الطاقة المتجددة', 'البيئة'], 'operational'),
('شركة الصحة الرقمية', 'Digital Health Solutions', 'private_sector', 'hello@dighealth.sa', '+966501234571', 'active', ARRAY['الصحة', 'التطبيقات الطبية'], 'strategic');

-- Create challenges with proper relationships using profile IDs for created_by and challenge_owner_id
INSERT INTO public.challenges (
    title_ar, description_ar, status, priority_level, challenge_type, 
    department_id, sector_id, deputy_id, domain_id, service_id,
    sensitivity_level, estimated_budget, start_date, end_date,
    vision_2030_goal, kpi_alignment, created_by, challenge_owner_id
) VALUES
(
    'تطوير منصة الخدمات الحكومية الذكية',
    'تطوير منصة متقدمة لتقديم الخدمات الحكومية بطريقة ذكية ومتكاملة تخدم المواطنين والمقيمين',
    'active', 'high', 'digital_transformation',
    (SELECT id FROM departments LIMIT 1),
    (SELECT id FROM sectors LIMIT 1),
    (SELECT id FROM deputies LIMIT 1),
    (SELECT id FROM domains LIMIT 1),
    (SELECT id FROM services LIMIT 1),
    'normal', 5000000.00, '2024-01-01', '2024-12-31',
    'تحسين جودة الحياة من خلال الخدمات الرقمية المتطورة',
    'نسبة رضا المستفيدين من الخدمات الحكومية',
    (SELECT id FROM profiles LIMIT 1),
    (SELECT id FROM profiles OFFSET 7 LIMIT 1)
),
(
    'مبادرة الطاقة المتجددة للمباني الحكومية',
    'تطوير حلول مبتكرة لاستخدام الطاقة المتجددة في المباني الحكومية لتحقيق الاستدامة البيئية',
    'active', 'high', 'sustainability',
    (SELECT id FROM departments OFFSET 1 LIMIT 1),
    (SELECT id FROM sectors OFFSET 1 LIMIT 1),
    (SELECT id FROM deputies OFFSET 1 LIMIT 1),
    (SELECT id FROM domains OFFSET 1 LIMIT 1),
    (SELECT id FROM services OFFSET 1 LIMIT 1),
    'normal', 8000000.00, '2024-02-01', '2024-11-30',
    'تحقيق أهداف الاستدامة البيئية ضمن رؤية 2030',
    'نسبة تخفيض استهلاك الطاقة التقليدية',
    (SELECT id FROM profiles OFFSET 1 LIMIT 1),
    (SELECT id FROM profiles OFFSET 4 LIMIT 1)
),
(
    'نظام المعلومات الصحية المتكامل',
    'تطوير نظام معلومات صحي شامل يربط جميع المؤسسات الصحية ويحسن جودة الرعاية الصحية',
    'planning', 'medium', 'healthcare',
    (SELECT id FROM departments OFFSET 2 LIMIT 1),
    (SELECT id FROM sectors OFFSET 2 LIMIT 1),
    (SELECT id FROM deputies OFFSET 2 LIMIT 1),
    (SELECT id FROM domains OFFSET 2 LIMIT 1),
    (SELECT id FROM services OFFSET 2 LIMIT 1),
    'sensitive', 12000000.00, '2024-03-01', '2025-02-28',
    'تطوير القطاع الصحي وتحسين جودة الخدمات الطبية',
    'مؤشر رضا المرضى وكفاءة الخدمات الصحية',
    (SELECT id FROM profiles OFFSET 2 LIMIT 1),
    (SELECT id FROM profiles OFFSET 5 LIMIT 1)
),
(
    'منصة التعليم التقني المتطور',
    'إنشاء منصة تعليمية تقنية متقدمة لتطوير مهارات الشباب السعودي في مجالات التقنية والابتكار',
    'active', 'high', 'education',
    (SELECT id FROM departments OFFSET 3 LIMIT 1),
    (SELECT id FROM sectors OFFSET 3 LIMIT 1),
    (SELECT id FROM deputies OFFSET 3 LIMIT 1),
    (SELECT id FROM domains OFFSET 3 LIMIT 1),
    (SELECT id FROM services OFFSET 3 LIMIT 1),
    'normal', 6000000.00, '2024-01-15', '2024-12-15',
    'إعداد الكوادر الوطنية للوظائف المستقبلية',
    'عدد المتدربين والمعدل النجاح في البرامج التقنية',
    (SELECT id FROM profiles OFFSET 3 LIMIT 1),
    (SELECT id FROM profiles OFFSET 6 LIMIT 1)
),
(
    'مشروع الأمن السيبراني الوطني',
    'تطوير حلول متقدمة لحماية البنية التحتية الرقمية والمعلومات الحساسة للمؤسسات الحكومية',
    'active', 'critical', 'cybersecurity',
    (SELECT id FROM departments OFFSET 4 LIMIT 1),
    (SELECT id FROM sectors OFFSET 4 LIMIT 1),
    (SELECT id FROM deputies OFFSET 4 LIMIT 1),
    (SELECT id FROM domains OFFSET 4 LIMIT 1),
    (SELECT id FROM services OFFSET 4 LIMIT 1),
    'confidential', 15000000.00, '2024-01-01', '2025-06-30',
    'تعزيز الأمن السيبراني وحماية المعلومات الوطنية',
    'مستوى الحماية السيبرانية ومعدل الحوادث الأمنية',
    (SELECT id FROM profiles LIMIT 1),
    (SELECT id FROM profiles OFFSET 2 LIMIT 1)
);

-- Create campaigns linked to challenges using profile IDs for campaign_manager_id
INSERT INTO public.campaigns (
    title_ar, description_ar, status, start_date, end_date, 
    target_participants, target_ideas, budget, theme,
    campaign_manager_id, department_id, sector_id, deputy_id,
    success_metrics, registration_deadline
) VALUES
(
    'حملة الابتكار في الخدمات الحكومية الذكية',
    'حملة لجمع الأفكار المبتكرة لتطوير الخدمات الحكومية الذكية وتحسين تجربة المستفيدين',
    'active', '2024-01-01', '2024-06-30',
    500, 100, 500000.00, 'التحول الرقمي',
    (SELECT id FROM profiles OFFSET 7 LIMIT 1),
    (SELECT id FROM departments LIMIT 1),
    (SELECT id FROM sectors LIMIT 1),
    (SELECT id FROM deputies LIMIT 1),
    'عدد الأفكار المقدمة وجودة الحلول المطروحة',
    '2024-05-31'
),
(
    'مبادرة الابتكار في الطاقة المستدامة',
    'حملة لتشجيع الابتكار في مجال الطاقة المتجددة والاستدامة البيئية في المباني الحكومية',
    'active', '2024-02-01', '2024-08-31',
    300, 60, 750000.00, 'الاستدامة البيئية',
    (SELECT id FROM profiles OFFSET 8 LIMIT 1),
    (SELECT id FROM departments OFFSET 1 LIMIT 1),
    (SELECT id FROM sectors OFFSET 1 LIMIT 1),
    (SELECT id FROM deputies OFFSET 1 LIMIT 1),
    'عدد المشاريع المنفذة ونسبة توفير الطاقة',
    '2024-07-31'
),
(
    'حملة الابتكار في التقنيات الصحية',
    'مبادرة لتطوير حلول تقنية مبتكرة في القطاع الصحي وتحسين جودة الرعاية الطبية',
    'planning', '2024-03-01', '2024-09-30',
    400, 80, 1000000.00, 'التقنيات الصحية',
    (SELECT id FROM profiles OFFSET 7 LIMIT 1),
    (SELECT id FROM departments OFFSET 2 LIMIT 1),
    (SELECT id FROM sectors OFFSET 2 LIMIT 1),
    (SELECT id FROM deputies OFFSET 2 LIMIT 1),
    'عدد التطبيقات الصحية المطورة ومعدل استخدامها',
    '2024-08-31'
);

-- Success! Initial seeding completed with proper profile ID references