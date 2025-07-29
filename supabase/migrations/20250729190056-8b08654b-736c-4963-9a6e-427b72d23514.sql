-- Comprehensive seeding of all remaining tables with proper relationships

-- 1. Create innovators from users with innovator role
INSERT INTO public.innovators (user_id, areas_of_interest, innovation_background, experience_level) VALUES
('11111111-1111-1111-1111-111111111111', ARRAY['تكنولوجيا المعلومات', 'الذكاء الاصطناعي'], 'مطور تطبيقات ذكية مع خبرة في التعلم الآلي', 'intermediate'),
('11111111-1111-1111-1111-111111111112', ARRAY['الطاقة المتجددة', 'الاستدامة'], 'مهندس طاقة متخصص في الحلول البيئية المستدامة', 'advanced'),
('11111111-1111-1111-1111-111111111113', ARRAY['الصحة الرقمية', 'التطبيقات الطبية'], 'مطور تطبيقات صحية ومتخصص في المعلوماتية الصحية', 'intermediate'),
('11111111-1111-1111-1111-111111111114', ARRAY['التعليم التقني', 'التدريب المهني'], 'خبير في تطوير المناهج التعليمية والمنصات التفاعلية', 'advanced'),
('11111111-1111-1111-1111-111111111115', ARRAY['الأمن السيبراني', 'حماية البيانات'], 'متخصص أمن معلومات مع خبرة في حماية الأنظمة', 'expert'),
('11111111-1111-1111-1111-111111111116', ARRAY['التجارة الإلكترونية', 'التسويق الرقمي'], 'خبير في تطوير منصات التجارة الإلكترونية والتسويق', 'intermediate'),
('11111111-1111-1111-1111-111111111117', ARRAY['الزراعة الذكية', 'التكنولوجيا الزراعية'], 'مهندس زراعي متخصص في تطبيق التقنيات الحديثة', 'advanced'),
('11111111-1111-1111-1111-111111111118', ARRAY['النقل الذكي', 'اللوجستيات'], 'خبير في أنظمة النقل الذكي وحلول اللوجستيات', 'intermediate');

-- 2. Create experts from users with relevant expertise
INSERT INTO public.experts (user_id, expertise_areas, experience_years, expert_level, certifications, education_background, consultation_rate) VALUES
('11111111-1111-1111-1111-111111111103', ARRAY['إدارة التكنولوجيا', 'التحول الرقمي'], 15, 'senior', ARRAY['PMP', 'ITIL'], 'ماجستير في إدارة التكنولوجيا', 500.00),
('11111111-1111-1111-1111-111111111104', ARRAY['تحليل البيانات', 'الذكاء التجاري'], 12, 'senior', ARRAY['Certified Analytics Professional'], 'ماجستير في علوم البيانات', 450.00),
('11111111-1111-1111-1111-111111111105', ARRAY['الطاقة المتجددة', 'الهندسة البيئية'], 18, 'expert', ARRAY['Professional Engineer'], 'دكتوراه في الهندسة البيئية', 600.00),
('11111111-1111-1111-1111-111111111106', ARRAY['الصحة العامة', 'المعلوماتية الصحية'], 20, 'expert', ARRAY['Board Certified'], 'دكتوراه في الصحة العامة', 700.00),
('11111111-1111-1111-1111-111111111107', ARRAY['التعليم والتدريب', 'التطوير المهني'], 14, 'senior', ARRAY['Training Certification'], 'ماجستير في التربية', 400.00),
('11111111-1111-1111-1111-111111111108', ARRAY['إدارة التحديات', 'الابتكار المؤسسي'], 16, 'senior', ARRAY['Innovation Management'], 'ماجستير في إدارة الأعمال', 550.00),
('11111111-1111-1111-1111-111111111109', ARRAY['إدارة التحديات', 'التخطيط الاستراتيجي'], 13, 'senior', ARRAY['Strategic Planning'], 'ماجستير في الإدارة الاستراتيجية', 500.00);

-- 3. Create innovation team members
INSERT INTO public.innovation_team_members (user_id, role, status, max_concurrent_projects, skills, current_workload) VALUES
('11111111-1111-1111-1111-111111111101', 'admin', 'active', 10, ARRAY['إدارة النظام', 'إدارة المستخدمين'], 0),
('11111111-1111-1111-1111-111111111102', 'admin', 'active', 8, ARRAY['الإشراف العام', 'إدارة التحديات'], 0),
('11111111-1111-1111-1111-111111111103', 'expert', 'active', 5, ARRAY['إدارة التكنولوجيا', 'التحول الرقمي'], 0),
('11111111-1111-1111-1111-111111111104', 'analyst', 'active', 6, ARRAY['تحليل البيانات', 'إعداد التقارير'], 0),
('11111111-1111-1111-1111-111111111105', 'expert', 'active', 4, ARRAY['الطاقة المتجددة', 'الاستشارات البيئية'], 0),
('11111111-1111-1111-1111-111111111106', 'expert', 'active', 4, ARRAY['الصحة العامة', 'البحث الطبي'], 0),
('11111111-1111-1111-1111-111111111107', 'expert', 'active', 5, ARRAY['التدريب والتطوير', 'المناهج'], 0),
('11111111-1111-1111-1111-111111111108', 'manager', 'active', 6, ARRAY['إدارة التحديات', 'التخطيط'], 0),
('11111111-1111-1111-1111-111111111109', 'manager', 'active', 6, ARRAY['إدارة المشاريع', 'التنسيق'], 0),
('11111111-1111-1111-1111-111111111110', 'analyst', 'active', 7, ARRAY['تحليل الأداء', 'المتابعة'], 0),
('11111111-1111-1111-1111-111111111119', 'content_manager', 'active', 8, ARRAY['إدارة المحتوى', 'التحرير'], 0),
('11111111-1111-1111-1111-111111111120', 'content_manager', 'active', 8, ARRAY['المراجعة', 'النشر'], 0);

-- 4. Create stakeholders
INSERT INTO public.stakeholders (user_id, stakeholder_type, influence_level, engagement_status, contact_preferences) VALUES
('11111111-1111-1111-1111-111111111111', 'internal', 'high', 'active', 'email'),
('11111111-1111-1111-1111-111111111112', 'external', 'medium', 'active', 'phone'),
('11111111-1111-1111-1111-111111111113', 'internal', 'high', 'active', 'email'),
('11111111-1111-1111-1111-111111111114', 'partner', 'high', 'active', 'email'),
('11111111-1111-1111-1111-111111111115', 'internal', 'medium', 'active', 'phone'),
('11111111-1111-1111-1111-111111111116', 'external', 'medium', 'active', 'email'),
('11111111-1111-1111-1111-111111111117', 'partner', 'high', 'active', 'email'),
('11111111-1111-1111-1111-111111111118', 'internal', 'medium', 'active', 'phone');

-- 5. Create partner organizations
INSERT INTO public.partners (name_ar, name_en, partner_type, contact_email, contact_phone, status, collaboration_areas, partnership_level) VALUES
('شركة التقنيات المتقدمة', 'Advanced Technologies Company', 'private_sector', 'info@advtech.sa', '+966501234567', 'active', ARRAY['التكنولوجيا', 'الابتكار'], 'strategic'),
('معهد البحوث التطبيقية', 'Applied Research Institute', 'research_institute', 'research@ari.sa', '+966501234568', 'active', ARRAY['البحث والتطوير', 'الدراسات'], 'operational'),
('جامعة الملك عبدالعزيز', 'King Abdulaziz University', 'academic', 'innovation@kau.edu.sa', '+966501234569', 'active', ARRAY['التعليم', 'البحث العلمي'], 'strategic'),
('مؤسسة الطاقة المستدامة', 'Sustainable Energy Foundation', 'non_profit', 'contact@sef.org.sa', '+966501234570', 'active', ARRAY['الطاقة المتجددة', 'البيئة'], 'operational'),
('شركة الصحة الرقمية', 'Digital Health Solutions', 'private_sector', 'hello@dighealth.sa', '+966501234571', 'active', ARRAY['الصحة', 'التطبيقات الطبية'], 'strategic');

-- 6. Create challenges with proper relationships
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
    '11111111-1111-1111-1111-111111111101',
    '11111111-1111-1111-1111-111111111108'
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
    '11111111-1111-1111-1111-111111111102',
    '11111111-1111-1111-1111-111111111105'
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
    '11111111-1111-1111-1111-111111111103',
    '11111111-1111-1111-1111-111111111106'
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
    '11111111-1111-1111-1111-111111111104',
    '11111111-1111-1111-1111-111111111107'
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
    '11111111-1111-1111-1111-111111111101',
    '11111111-1111-1111-1111-111111111103'
);

-- 7. Create campaigns linked to challenges
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
    '11111111-1111-1111-1111-111111111108',
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
    '11111111-1111-1111-1111-111111111109',
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
    '11111111-1111-1111-1111-111111111108',
    (SELECT id FROM departments OFFSET 2 LIMIT 1),
    (SELECT id FROM sectors OFFSET 2 LIMIT 1),
    (SELECT id FROM deputies OFFSET 2 LIMIT 1),
    'عدد التطبيقات الصحية المطورة ومعدل استخدامها',
    '2024-08-31'
);

-- 8. Create events linked to campaigns
INSERT INTO public.events (
    title_ar, description_ar, event_type, format, status,
    event_date, start_time, end_time, location, virtual_link,
    max_participants, budget, event_manager_id,
    campaign_id, sector_id, challenge_id,
    event_category, event_visibility
) VALUES
(
    'ورشة عمل الابتكار في الخدمات الحكومية',
    'ورشة عمل تفاعلية لتطوير الأفكار المبتكرة في مجال الخدمات الحكومية الذكية',
    'workshop', 'hybrid', 'scheduled',
    '2024-03-15', '09:00', '17:00', 'مركز الملك عبدالعزيز الثقافي', 'https://teams.microsoft.com/workshop1',
    100, 50000.00, '11111111-1111-1111-1111-111111111108',
    (SELECT id FROM campaigns LIMIT 1),
    (SELECT id FROM sectors LIMIT 1),
    (SELECT id FROM challenges LIMIT 1),
    'campaign_event', 'public'
),
(
    'مؤتمر الطاقة المتجددة والاستدامة',
    'مؤتمر متخصص في مجال الطاقة المتجددة والحلول المستدامة للمباني الحكومية',
    'conference', 'physical', 'scheduled',
    '2024-04-20', '08:00', '18:00', 'مركز الرياض الدولي للمؤتمرات', null,
    200, 150000.00, '11111111-1111-1111-1111-111111111109',
    (SELECT id FROM campaigns OFFSET 1 LIMIT 1),
    (SELECT id FROM sectors OFFSET 1 LIMIT 1),
    (SELECT id FROM challenges OFFSET 1 LIMIT 1),
    'campaign_event', 'public'
),
(
    'هاكاثون التقنيات الصحية',
    'هاكاثون مكثف لتطوير حلول تقنية مبتكرة في القطاع الصحي خلال 48 ساعة',
    'hackathon', 'physical', 'scheduled',
    '2024-05-10', '09:00', '18:00', 'مدينة الملك عبدالعزيز للعلوم والتقنية', null,
    150, 200000.00, '11111111-1111-1111-1111-111111111108',
    (SELECT id FROM campaigns OFFSET 2 LIMIT 1),
    (SELECT id FROM sectors OFFSET 2 LIMIT 1),
    (SELECT id FROM challenges OFFSET 2 LIMIT 1),
    'standalone', 'public'
);

-- 9. Create focus questions for challenges
INSERT INTO public.focus_questions (challenge_id, question_text_ar, question_type, is_sensitive, order_sequence) VALUES
((SELECT id FROM challenges LIMIT 1), 'كيف يمكن تحسين تجربة المستخدم في الخدمات الحكومية الرقمية؟', 'open_ended', false, 1),
((SELECT id FROM challenges LIMIT 1), 'ما هي التقنيات المناسبة لتطوير منصة خدمات حكومية متكاملة؟', 'technical', false, 2),
((SELECT id FROM challenges LIMIT 1), 'كيف يمكن ضمان أمان وخصوصية بيانات المستفيدين؟', 'security', true, 3),

((SELECT id FROM challenges OFFSET 1 LIMIT 1), 'ما هي أفضل حلول الطاقة المتجددة للمباني الحكومية؟', 'technical', false, 1),
((SELECT id FROM challenges OFFSET 1 LIMIT 1), 'كيف يمكن تقليل التكلفة التشغيلية للطاقة في المباني؟', 'economic', false, 2),
((SELECT id FROM challenges OFFSET 1 LIMIT 1), 'ما هي المعايير البيئية المطلوبة لتحقيق الاستدامة؟', 'environmental', false, 3),

((SELECT id FROM challenges OFFSET 2 LIMIT 1), 'كيف يمكن ربط أنظمة المعلومات في المؤسسات الصحية المختلفة؟', 'integration', true, 1),
((SELECT id FROM challenges OFFSET 2 LIMIT 1), 'ما هي متطلبات حماية البيانات الصحية الحساسة؟', 'privacy', true, 2),
((SELECT id FROM challenges OFFSET 2 LIMIT 1), 'كيف يمكن تحسين كفاءة تقديم الخدمات الصحية؟', 'operational', false, 3),

((SELECT id FROM challenges OFFSET 3 LIMIT 1), 'ما هي التقنيات التعليمية الأكثر فعالية للتدريب المهني؟', 'educational', false, 1),
((SELECT id FROM challenges OFFSET 3 LIMIT 1), 'كيف يمكن قياس مخرجات التعلم في البرامج التقنية؟', 'assessment', false, 2),

((SELECT id FROM challenges OFFSET 4 LIMIT 1), 'ما هي أهم التهديدات السيبرانية التي تواجه المؤسسات الحكومية؟', 'risk_assessment', true, 1),
((SELECT id FROM challenges OFFSET 4 LIMIT 1), 'كيف يمكن تطوير نظام إنذار مبكر للتهديدات السيبرانية؟', 'technical', true, 2);

-- 10. Create ideas from innovators
INSERT INTO public.ideas (
    title_ar, description_ar, status, innovator_id, challenge_id, focus_question_id,
    solution_approach, implementation_plan, expected_impact, estimated_cost,
    timeline_months, maturity_level, submission_date
) VALUES
(
    'تطبيق ذكي للخدمات الحكومية بالذكاء الاصطناعي',
    'تطوير تطبيق ذكي يستخدم الذكاء الاصطناعي لتقديم الخدمات الحكومية بطريقة تفاعلية ومخصصة حسب احتياجات كل مستفيد. التطبيق سيتضمن مساعد ذكي يمكنه فهم استفسارات المواطنين وتوجيههم للخدمة المناسبة.',
    'under_review',
    (SELECT id FROM innovators LIMIT 1),
    (SELECT id FROM challenges LIMIT 1),
    (SELECT id FROM focus_questions WHERE challenge_id = (SELECT id FROM challenges LIMIT 1) LIMIT 1),
    'استخدام تقنيات معالجة اللغات الطبيعية والتعلم الآلي لتطوير مساعد ذكي يتفاعل مع المستفيدين',
    'المرحلة الأولى: تطوير النموذج الأولي (3 أشهر)\nالمرحلة الثانية: التجريب والتطوير (6 أشهر)\nالمرحلة الثالثة: النشر والتشغيل (3 أشهر)',
    'تحسين تجربة المستفيدين بنسبة 60% وتقليل وقت الحصول على الخدمات بنسبة 40%',
    2500000.00, 12, 'concept', '2024-01-15'
),
(
    'نظام إدارة الطاقة الذكي للمباني الحكومية',
    'تطوير نظام ذكي لإدارة استهلاك الطاقة في المباني الحكومية باستخدام أجهزة الاستشعار والتحليل الذكي للبيانات. النظام سيتمكن من تحسين استهلاك الطاقة تلقائياً وتقليل التكاليف التشغيلية.',
    'submitted',
    (SELECT id FROM innovators OFFSET 1 LIMIT 1),
    (SELECT id FROM challenges OFFSET 1 LIMIT 1),
    (SELECT id FROM focus_questions WHERE challenge_id = (SELECT id FROM challenges OFFSET 1 LIMIT 1) LIMIT 1),
    'تطبيق تقنيات إنترنت الأشياء والذكاء الاصطناعي لمراقبة وتحسين استهلاك الطاقة',
    'تركيب أجهزة الاستشعار وتطوير خوارزميات التحسين وربط النظام بمصادر الطاقة المتجددة',
    'توفير 30% من استهلاك الطاقة وتقليل الانبعاثات الكربونية بنسبة 25%',
    1800000.00, 9, 'prototype', '2024-02-10'
),
(
    'منصة التطبيب عن بُعد المتكاملة',
    'تطوير منصة شاملة للتطبيب عن بُعد تربط الأطباء بالمرضى وتوفر خدمات التشخيص والمتابعة الطبية الرقمية. المنصة ستتضمن أدوات للتشخيص المبدئي والتواصل المرئي والصوتي.',
    'draft',
    (SELECT id FROM innovators OFFSET 2 LIMIT 1),
    (SELECT id FROM challenges OFFSET 2 LIMIT 1),
    (SELECT id FROM focus_questions WHERE challenge_id = (SELECT id FROM challenges OFFSET 2 LIMIT 1) LIMIT 1),
    'استخدام تقنيات الاتصال المرئي المتقدمة وأدوات التشخيص الرقمي المبدئي',
    'تطوير واجهات المستخدم للأطباء والمرضى وتكامل أنظمة السجلات الطبية',
    'تحسين الوصول للخدمات الصحية بنسبة 50% وتقليل أوقات الانتظار',
    3200000.00, 15, 'idea', '2024-02-20'
),
(
    'منصة التعلم التفاعلي للمهارات التقنية',
    'تطوير منصة تعليمية تفاعلية تستخدم الواقع الافتراضي والمحاكاة لتعليم المهارات التقنية المتقدمة. المنصة ستوفر بيئة تعلم غامرة ومخصصة حسب مستوى كل متدرب.',
    'submitted',
    (SELECT id FROM innovators OFFSET 3 LIMIT 1),
    (SELECT id FROM challenges OFFSET 3 LIMIT 1),
    (SELECT id FROM focus_questions WHERE challenge_id = (SELECT id FROM challenges OFFSET 3 LIMIT 1) LIMIT 1),
    'استخدام تقنيات الواقع الافتراضي والمعزز مع نظم التعلم التكيفي',
    'تطوير المحتوى التعليمي التفاعلي وبناء بيئة المحاكاة والتجريب',
    'تحسين معدل اكتساب المهارات بنسبة 70% وزيادة معدل إكمال البرامج التدريبية',
    2800000.00, 12, 'prototype', '2024-01-25'
),
(
    'نظام الكشف المبكر للتهديدات السيبرانية',
    'تطوير نظام متقدم للكشف المبكر عن التهديدات السيبرانية باستخدام الذكاء الاصطناعي وتحليل السلوك الشاذ. النظام سيتمكن من التنبؤ بالهجمات قبل حدوثها واتخاذ إجراءات وقائية تلقائية.',
    'under_review',
    (SELECT id FROM innovators OFFSET 4 LIMIT 1),
    (SELECT id FROM challenges OFFSET 4 LIMIT 1),
    (SELECT id FROM focus_questions WHERE challenge_id = (SELECT id FROM challenges OFFSET 4 LIMIT 1) LIMIT 1),
    'تطبيق خوارزميات التعلم الآلي لتحليل أنماط الشبكة والكشف عن التهديدات',
    'تطوير نماذج الذكاء الاصطناعي وربطها بأنظمة المراقبة الأمنية الموجودة',
    'تحسين سرعة الكشف عن التهديدات بنسبة 80% وتقليل الحوادث الأمنية بنسبة 60%',
    4500000.00, 18, 'concept', '2024-02-05'
);

-- 11. Create linking tables for relationships

-- Campaign challenge links
INSERT INTO public.campaign_challenge_links (campaign_id, challenge_id) VALUES
((SELECT id FROM campaigns LIMIT 1), (SELECT id FROM challenges LIMIT 1)),
((SELECT id FROM campaigns OFFSET 1 LIMIT 1), (SELECT id FROM challenges OFFSET 1 LIMIT 1)),
((SELECT id FROM campaigns OFFSET 2 LIMIT 1), (SELECT id FROM challenges OFFSET 2 LIMIT 1));

-- Campaign partner links  
INSERT INTO public.campaign_partner_links (campaign_id, partner_id) VALUES
((SELECT id FROM campaigns LIMIT 1), (SELECT id FROM partners LIMIT 1)),
((SELECT id FROM campaigns LIMIT 1), (SELECT id FROM partners OFFSET 2 LIMIT 1)),
((SELECT id FROM campaigns OFFSET 1 LIMIT 1), (SELECT id FROM partners OFFSET 3 LIMIT 1)),
((SELECT id FROM campaigns OFFSET 2 LIMIT 1), (SELECT id FROM partners OFFSET 4 LIMIT 1));

-- Campaign stakeholder links
INSERT INTO public.campaign_stakeholder_links (campaign_id, stakeholder_id) VALUES
((SELECT id FROM campaigns LIMIT 1), (SELECT id FROM stakeholders LIMIT 1)),
((SELECT id FROM campaigns LIMIT 1), (SELECT id FROM stakeholders OFFSET 1 LIMIT 1)),
((SELECT id FROM campaigns OFFSET 1 LIMIT 1), (SELECT id FROM stakeholders OFFSET 2 LIMIT 1)),
((SELECT id FROM campaigns OFFSET 2 LIMIT 1), (SELECT id FROM stakeholders OFFSET 3 LIMIT 1));

-- Event partner links
INSERT INTO public.event_partner_links (event_id, partner_id) VALUES
((SELECT id FROM events LIMIT 1), (SELECT id FROM partners LIMIT 1)),
((SELECT id FROM events OFFSET 1 LIMIT 1), (SELECT id FROM partners OFFSET 3 LIMIT 1)),
((SELECT id FROM events OFFSET 2 LIMIT 1), (SELECT id FROM partners OFFSET 4 LIMIT 1));

-- Event stakeholder links
INSERT INTO public.event_stakeholder_links (event_id, stakeholder_id) VALUES
((SELECT id FROM events LIMIT 1), (SELECT id FROM stakeholders LIMIT 1)),
((SELECT id FROM events LIMIT 1), (SELECT id FROM stakeholders OFFSET 4 LIMIT 1)),
((SELECT id FROM events OFFSET 1 LIMIT 1), (SELECT id FROM stakeholders OFFSET 5 LIMIT 1)),
((SELECT id FROM events OFFSET 2 LIMIT 1), (SELECT id FROM stakeholders OFFSET 6 LIMIT 1));

-- Event focus question links
INSERT INTO public.event_focus_question_links (event_id, focus_question_id) VALUES
((SELECT id FROM events LIMIT 1), (SELECT id FROM focus_questions LIMIT 1)),
((SELECT id FROM events LIMIT 1), (SELECT id FROM focus_questions OFFSET 1 LIMIT 1)),
((SELECT id FROM events OFFSET 1 LIMIT 1), (SELECT id FROM focus_questions OFFSET 3 LIMIT 1)),
((SELECT id FROM events OFFSET 2 LIMIT 1), (SELECT id FROM focus_questions OFFSET 7 LIMIT 1));

-- Event challenge links
INSERT INTO public.event_challenge_links (event_id, challenge_id) VALUES
((SELECT id FROM events LIMIT 1), (SELECT id FROM challenges LIMIT 1)),
((SELECT id FROM events OFFSET 1 LIMIT 1), (SELECT id FROM challenges OFFSET 1 LIMIT 1)),
((SELECT id FROM events OFFSET 2 LIMIT 1), (SELECT id FROM challenges OFFSET 2 LIMIT 1));

-- Challenge experts assignments
INSERT INTO public.challenge_experts (challenge_id, expert_id, role_type, status, notes) VALUES
((SELECT id FROM challenges LIMIT 1), '11111111-1111-1111-1111-111111111103', 'lead_evaluator', 'active', 'خبير رئيسي في التحول الرقمي'),
((SELECT id FROM challenges LIMIT 1), '11111111-1111-1111-1111-111111111104', 'reviewer', 'active', 'مراجع لتحليل البيانات'),
((SELECT id FROM challenges OFFSET 1 LIMIT 1), '11111111-1111-1111-1111-111111111105', 'lead_evaluator', 'active', 'خبير الطاقة المتجددة'),
((SELECT id FROM challenges OFFSET 2 LIMIT 1), '11111111-1111-1111-1111-111111111106', 'lead_evaluator', 'active', 'خبير أنظمة المعلومات الصحية'),
((SELECT id FROM challenges OFFSET 3 LIMIT 1), '11111111-1111-1111-1111-111111111107', 'evaluator', 'active', 'خبير التعليم التقني'),
((SELECT id FROM challenges OFFSET 4 LIMIT 1), '11111111-1111-1111-1111-111111111103', 'evaluator', 'active', 'خبير الأمن السيبراني');

-- Challenge partners
INSERT INTO public.challenge_partners (challenge_id, partner_id, partnership_type, status, contribution_details) VALUES
((SELECT id FROM challenges LIMIT 1), (SELECT id FROM partners LIMIT 1), 'technology_provider', 'active', 'توفير الحلول التقنية والاستشارات'),
((SELECT id FROM challenges OFFSET 1 LIMIT 1), (SELECT id FROM partners OFFSET 3 LIMIT 1), 'funding_partner', 'active', 'المساهمة في التمويل والخبرات البيئية'),
((SELECT id FROM challenges OFFSET 2 LIMIT 1), (SELECT id FROM partners OFFSET 2 LIMIT 1), 'research_partner', 'active', 'إجراء البحوث والدراسات الصحية'),
((SELECT id FROM challenges OFFSET 3 LIMIT 1), (SELECT id FROM partners OFFSET 2 LIMIT 1), 'academic_partner', 'active', 'تطوير المناهج والبرامج التدريبية');

-- Event participants (register some users for events)
INSERT INTO public.event_participants (event_id, user_id, registration_type, attendance_status, notes) VALUES
((SELECT id FROM events LIMIT 1), '11111111-1111-1111-1111-111111111111', 'self_registered', 'registered', 'مهتم بالابتكار في الخدمات الحكومية'),
((SELECT id FROM events LIMIT 1), '11111111-1111-1111-1111-111111111112', 'invited', 'confirmed', 'خبير في مجال الطاقة المتجددة'),
((SELECT id FROM events LIMIT 1), '11111111-1111-1111-1111-111111111113', 'self_registered', 'registered', 'مطور تطبيقات صحية'),
((SELECT id FROM events OFFSET 1 LIMIT 1), '11111111-1111-1111-1111-111111111114', 'invited', 'confirmed', 'متخصص في التعليم التقني'),
((SELECT id FROM events OFFSET 1 LIMIT 1), '11111111-1111-1111-1111-111111111115', 'self_registered', 'registered', 'خبير أمن سيبراني'),
((SELECT id FROM events OFFSET 2 LIMIT 1), '11111111-1111-1111-1111-111111111116', 'self_registered', 'registered', 'مطور تطبيقات ويب'),
((SELECT id FROM events OFFSET 2 LIMIT 1), '11111111-1111-1111-1111-111111111117', 'invited', 'confirmed', 'خبير في التقنيات الزراعية');

-- Challenge requirements
INSERT INTO public.challenge_requirements (challenge_id, title, description, requirement_type, is_mandatory, order_sequence, weight_percentage) VALUES
((SELECT id FROM challenges LIMIT 1), 'متطلبات تقنية', 'استخدام تقنيات حديثة ومتوافقة مع المعايير الحكومية', 'technical', true, 1, 30.00),
((SELECT id FROM challenges LIMIT 1), 'متطلبات الأمان', 'تطبيق أعلى معايير الأمان وحماية البيانات', 'security', true, 2, 25.00),
((SELECT id FROM challenges LIMIT 1), 'متطلبات المستخدم', 'تجربة مستخدم سهلة ومناسبة لجميع الفئات', 'usability', true, 3, 20.00),
((SELECT id FROM challenges OFFSET 1 LIMIT 1), 'الكفاءة البيئية', 'تحقيق معايير الكفاءة في استخدام الطاقة', 'environmental', true, 1, 35.00),
((SELECT id FROM challenges OFFSET 1 LIMIT 1), 'التكلفة المعقولة', 'حلول اقتصادية ومجدية مالياً', 'economic', true, 2, 25.00);

-- Idea comments
INSERT INTO public.idea_comments (idea_id, author_id, content, comment_type, is_internal) VALUES
((SELECT id FROM ideas LIMIT 1), '11111111-1111-1111-1111-111111111103', 'فكرة ممتازة! أقترح التركيز على التكامل مع الأنظمة الموجودة', 'feedback', false),
((SELECT id FROM ideas LIMIT 1), '11111111-1111-1111-1111-111111111108', 'هل تم دراسة التكلفة التشغيلية للنظام على المدى الطويل؟', 'question', true),
((SELECT id FROM ideas OFFSET 1 LIMIT 1), '11111111-1111-1111-1111-111111111105', 'الحل مبتكر ومناسب لأهداف الاستدامة. يمكن تطبيقه على نطاق واسع', 'approval', false),
((SELECT id FROM ideas OFFSET 2 LIMIT 1), '11111111-1111-1111-1111-111111111106', 'المنصة تلبي حاجة ملحة في القطاع الصحي. أقترح إضافة ميزات الذكاء الاصطناعي للتشخيص', 'suggestion', false);

-- Challenge scorecards (evaluations)
INSERT INTO public.challenge_scorecards (
    challenge_id, evaluated_by, strategic_alignment_score, feasibility_score, 
    cost_effectiveness_score, impact_potential_score, innovation_level_score,
    resource_availability_score, stakeholder_support_score, overall_score,
    recommendation, risk_assessment, evaluation_notes
) VALUES
((SELECT id FROM challenges LIMIT 1), '11111111-1111-1111-1111-111111111103', 9, 8, 7, 9, 8, 7, 8, 8.0, 'proceed', 'low', 'مشروع استراتيجي مهم يحتاج دعم قوي من الإدارة العليا'),
((SELECT id FROM challenges OFFSET 1 LIMIT 1), '11111111-1111-1111-1111-111111111105', 10, 9, 8, 9, 7, 8, 9, 8.6, 'proceed', 'medium', 'مشروع واعد مع ضرورة التخطيط الجيد للتنفيذ'),
((SELECT id FROM challenges OFFSET 2 LIMIT 1), '11111111-1111-1111-1111-111111111106', 9, 7, 6, 10, 8, 6, 7, 7.6, 'proceed_with_conditions', 'medium', 'يحتاج تأكيد الموافقات الأمنية والتنظيمية قبل البدء');

-- Success! All tables have been seeded with comprehensive, realistic data that maintains proper relationships