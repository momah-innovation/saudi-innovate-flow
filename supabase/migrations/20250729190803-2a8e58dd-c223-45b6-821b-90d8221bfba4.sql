-- Continue seeding with correct column names

-- Create events linked to campaigns using profile IDs for event_manager_id
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
    100, 50000.00, (SELECT id FROM profiles OFFSET 7 LIMIT 1),
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
    200, 150000.00, (SELECT id FROM profiles OFFSET 8 LIMIT 1),
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
    150, 200000.00, (SELECT id FROM profiles OFFSET 7 LIMIT 1),
    (SELECT id FROM campaigns OFFSET 2 LIMIT 1),
    (SELECT id FROM sectors OFFSET 2 LIMIT 1),
    (SELECT id FROM challenges OFFSET 2 LIMIT 1),
    'standalone', 'public'
);

-- Create focus questions for challenges
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

-- Create ideas from innovators
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

-- Create linking tables for relationships

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

-- Event participant registrations using profile IDs
INSERT INTO public.event_participants (event_id, user_id, registration_type, attendance_status, notes) VALUES
((SELECT id FROM events LIMIT 1), (SELECT id FROM profiles LIMIT 1), 'self_registered', 'registered', 'مهتم بالابتكار في الخدمات الحكومية'),
((SELECT id FROM events LIMIT 1), (SELECT id FROM profiles OFFSET 1 LIMIT 1), 'invited', 'confirmed', 'خبير في مجال الطاقة المتجددة'),
((SELECT id FROM events LIMIT 1), (SELECT id FROM profiles OFFSET 2 LIMIT 1), 'self_registered', 'registered', 'مطور تطبيقات صحية'),
((SELECT id FROM events OFFSET 1 LIMIT 1), (SELECT id FROM profiles OFFSET 3 LIMIT 1), 'invited', 'confirmed', 'متخصص في التعليم التقني'),
((SELECT id FROM events OFFSET 1 LIMIT 1), (SELECT id FROM profiles OFFSET 4 LIMIT 1), 'self_registered', 'registered', 'خبير أمن سيبراني'),
((SELECT id FROM events OFFSET 2 LIMIT 1), (SELECT id FROM profiles OFFSET 5 LIMIT 1), 'self_registered', 'registered', 'مطور تطبيقات ويب'),
((SELECT id FROM events OFFSET 2 LIMIT 1), (SELECT id FROM profiles OFFSET 6 LIMIT 1), 'invited', 'confirmed', 'خبير في التقنيات الزراعية');

-- Challenge experts assignments using profile IDs
INSERT INTO public.challenge_experts (challenge_id, expert_id, role_type, status, notes) VALUES
((SELECT id FROM challenges LIMIT 1), (SELECT id FROM profiles OFFSET 2 LIMIT 1), 'lead_evaluator', 'active', 'خبير رئيسي في التحول الرقمي'),
((SELECT id FROM challenges LIMIT 1), (SELECT id FROM profiles OFFSET 3 LIMIT 1), 'reviewer', 'active', 'مراجع لتحليل البيانات'),
((SELECT id FROM challenges OFFSET 1 LIMIT 1), (SELECT id FROM profiles OFFSET 4 LIMIT 1), 'lead_evaluator', 'active', 'خبير الطاقة المتجددة'),
((SELECT id FROM challenges OFFSET 2 LIMIT 1), (SELECT id FROM profiles OFFSET 5 LIMIT 1), 'lead_evaluator', 'active', 'خبير أنظمة المعلومات الصحية'),
((SELECT id FROM challenges OFFSET 3 LIMIT 1), (SELECT id FROM profiles OFFSET 6 LIMIT 1), 'evaluator', 'active', 'خبير التعليم التقني'),
((SELECT id FROM challenges OFFSET 4 LIMIT 1), (SELECT id FROM profiles OFFSET 2 LIMIT 1), 'evaluator', 'active', 'خبير الأمن السيبراني');

-- Challenge partners
INSERT INTO public.challenge_partners (challenge_id, partner_id, partnership_type, status, contribution_details) VALUES
((SELECT id FROM challenges LIMIT 1), (SELECT id FROM partners LIMIT 1), 'technology_provider', 'active', 'توفير الحلول التقنية والاستشارات'),
((SELECT id FROM challenges OFFSET 1 LIMIT 1), (SELECT id FROM partners OFFSET 3 LIMIT 1), 'funding_partner', 'active', 'المساهمة في التمويل والخبرات البيئية'),
((SELECT id FROM challenges OFFSET 2 LIMIT 1), (SELECT id FROM partners OFFSET 2 LIMIT 1), 'research_partner', 'active', 'إجراء البحوث والدراسات الصحية'),
((SELECT id FROM challenges OFFSET 3 LIMIT 1), (SELECT id FROM partners OFFSET 2 LIMIT 1), 'academic_partner', 'active', 'تطوير المناهج والبرامج التدريبية');

-- Success! Comprehensive seeding completed with all relationships and proper data integrity