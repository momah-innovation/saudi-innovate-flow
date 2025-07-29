-- Final seeding with correct ideas table structure

-- Create ideas from innovators using correct column names
INSERT INTO public.ideas (
    title_ar, description_ar, status, innovator_id, challenge_id, focus_question_id,
    solution_approach, implementation_plan, expected_impact, resource_requirements,
    maturity_level
) VALUES
(
    'تطبيق ذكي للخدمات الحكومية بالذكاء الاصطناعي',
    'تطوير تطبيق ذكي يستخدم الذكاء الاصطناعي لتقديم الخدمات الحكومية بطريقة تفاعلية ومخصصة حسب احتياجات كل مستفيد. التطبيق سيتضمن مساعد ذكي يمكنه فهم استفسارات المواطنين وتوجيههم للخدمة المناسبة.',
    'under_review',
    (SELECT id FROM innovators LIMIT 1),
    (SELECT id FROM challenges LIMIT 1),
    (SELECT id FROM focus_questions WHERE challenge_id = (SELECT id FROM challenges LIMIT 1) LIMIT 1),
    'استخدام تقنيات معالجة اللغات الطبيعية والتعلم الآلي لتطوير مساعد ذكي يتفاعل مع المستفيدين',
    'المرحلة الأولى: تطوير النموذج الأولي (3 أشهر) - المرحلة الثانية: التجريب والتطوير (6 أشهر) - المرحلة الثالثة: النشر والتشغيل (3 أشهر)',
    'تحسين تجربة المستفيدين بنسبة 60% وتقليل وقت الحصول على الخدمات بنسبة 40%',
    'فريق تطوير من 8 أشخاص، خوادم سحابية، تراخيص برمجية، ميزانية 2.5 مليون ريال',
    'concept'
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
    'أجهزة استشعار، وحدات تحكم، منصة سحابية، فريق هندسي متخصص، ميزانية 1.8 مليون ريال',
    'prototype'
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
    'فريق طبي استشاري، مطورين متخصصين، بنية تحتية آمنة، موافقات تنظيمية، ميزانية 3.2 مليون ريال',
    'idea'
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
    'أجهزة واقع افتراضي، منصة تطوير ألعاب، خبراء محتوى تعليمي، ميزانية 2.8 مليون ريال',
    'prototype'
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
    'خبراء أمن سيبراني، مطورين AI/ML، بنية تحتية عالية الأداء، شهادات أمنية، ميزانية 4.5 مليون ريال',
    'concept'
);

-- Create innovation team members with correct column names (cic_role and specialization)
INSERT INTO public.innovation_team_members (user_id, cic_role, status, max_concurrent_projects, specialization, current_workload) 
SELECT id, 'admin', 'active', 10, ARRAY['إدارة النظام', 'إدارة المستخدمين'], 0
FROM public.profiles LIMIT 1;

INSERT INTO public.innovation_team_members (user_id, cic_role, status, max_concurrent_projects, specialization, current_workload) 
SELECT id, 'admin', 'active', 8, ARRAY['الإشراف العام', 'إدارة التحديات'], 0
FROM public.profiles OFFSET 1 LIMIT 1;

INSERT INTO public.innovation_team_members (user_id, cic_role, status, max_concurrent_projects, specialization, current_workload) 
SELECT id, 'expert', 'active', 5, ARRAY['إدارة التكنولوجيا', 'التحول الرقمي'], 0
FROM public.profiles OFFSET 2 LIMIT 1;

INSERT INTO public.innovation_team_members (user_id, cic_role, status, max_concurrent_projects, specialization, current_workload) 
SELECT id, 'analyst', 'active', 6, ARRAY['تحليل البيانات', 'إعداد التقارير'], 0
FROM public.profiles OFFSET 3 LIMIT 1;

INSERT INTO public.innovation_team_members (user_id, cic_role, status, max_concurrent_projects, specialization, current_workload) 
SELECT id, 'expert', 'active', 4, ARRAY['الطاقة المتجددة', 'الاستشارات البيئية'], 0
FROM public.profiles OFFSET 4 LIMIT 1;

INSERT INTO public.innovation_team_members (user_id, cic_role, status, max_concurrent_projects, specialization, current_workload) 
SELECT id, 'expert', 'active', 4, ARRAY['الصحة العامة', 'البحث الطبي'], 0
FROM public.profiles OFFSET 5 LIMIT 1;

INSERT INTO public.innovation_team_members (user_id, cic_role, status, max_concurrent_projects, specialization, current_workload) 
SELECT id, 'expert', 'active', 5, ARRAY['التدريب والتطوير', 'المناهج'], 0
FROM public.profiles OFFSET 6 LIMIT 1;

INSERT INTO public.innovation_team_members (user_id, cic_role, status, max_concurrent_projects, specialization, current_workload) 
SELECT id, 'manager', 'active', 6, ARRAY['إدارة التحديات', 'التخطيط'], 0
FROM public.profiles OFFSET 7 LIMIT 1;

INSERT INTO public.innovation_team_members (user_id, cic_role, status, max_concurrent_projects, specialization, current_workload) 
SELECT id, 'manager', 'active', 6, ARRAY['إدارة المشاريع', 'التنسيق'], 0
FROM public.profiles OFFSET 8 LIMIT 1;

INSERT INTO public.innovation_team_members (user_id, cic_role, status, max_concurrent_projects, specialization, current_workload) 
SELECT id, 'analyst', 'active', 7, ARRAY['تحليل الأداء', 'المتابعة'], 0
FROM public.profiles OFFSET 9 LIMIT 1;

INSERT INTO public.innovation_team_members (user_id, cic_role, status, max_concurrent_projects, specialization, current_workload) 
SELECT id, 'content_manager', 'active', 8, ARRAY['إدارة المحتوى', 'التحرير'], 0
FROM public.profiles OFFSET 18 LIMIT 1;

INSERT INTO public.innovation_team_members (user_id, cic_role, status, max_concurrent_projects, specialization, current_workload) 
SELECT id, 'content_manager', 'active', 8, ARRAY['المراجعة', 'النشر'], 0
FROM public.profiles OFFSET 19 LIMIT 1;

-- Add idea comments using profile IDs
INSERT INTO public.idea_comments (idea_id, author_id, content, comment_type, is_internal) VALUES
((SELECT id FROM ideas LIMIT 1), (SELECT id FROM profiles OFFSET 2 LIMIT 1), 'فكرة ممتازة! أقترح التركيز على التكامل مع الأنظمة الموجودة', 'feedback', false),
((SELECT id FROM ideas LIMIT 1), (SELECT id FROM profiles OFFSET 7 LIMIT 1), 'هل تم دراسة التكلفة التشغيلية للنظام على المدى الطويل؟', 'question', true),
((SELECT id FROM ideas OFFSET 1 LIMIT 1), (SELECT id FROM profiles OFFSET 4 LIMIT 1), 'الحل مبتكر ومناسب لأهداف الاستدامة. يمكن تطبيقه على نطاق واسع', 'approval', false),
((SELECT id FROM ideas OFFSET 2 LIMIT 1), (SELECT id FROM profiles OFFSET 5 LIMIT 1), 'المنصة تلبي حاجة ملحة في القطاع الصحي. أقترح إضافة ميزات الذكاء الاصطناعي للتشخيص', 'suggestion', false);

-- Add challenge scorecards (evaluations) using profile IDs
INSERT INTO public.challenge_scorecards (
    challenge_id, evaluated_by, strategic_alignment_score, feasibility_score, 
    cost_effectiveness_score, impact_potential_score, innovation_level_score,
    resource_availability_score, stakeholder_support_score, overall_score,
    recommendation, risk_assessment, evaluation_notes
) VALUES
((SELECT id FROM challenges LIMIT 1), (SELECT id FROM profiles OFFSET 2 LIMIT 1), 9, 8, 7, 9, 8, 7, 8, 8.0, 'proceed', 'low', 'مشروع استراتيجي مهم يحتاج دعم قوي من الإدارة العليا'),
((SELECT id FROM challenges OFFSET 1 LIMIT 1), (SELECT id FROM profiles OFFSET 4 LIMIT 1), 10, 9, 8, 9, 7, 8, 9, 8.6, 'proceed', 'medium', 'مشروع واعد مع ضرورة التخطيط الجيد للتنفيذ'),
((SELECT id FROM challenges OFFSET 2 LIMIT 1), (SELECT id FROM profiles OFFSET 5 LIMIT 1), 9, 7, 6, 10, 8, 6, 7, 7.6, 'proceed_with_conditions', 'medium', 'يحتاج تأكيد الموافقات الأمنية والتنظيمية قبل البدء');

-- Success! Comprehensive database seeding completed with all tables and relationships properly established