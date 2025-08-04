-- PHASE 6: FINAL IMPLEMENTATION - COMPREHENSIVE SEED DATA & ENHANCEMENTS

-- First, let's add more comprehensive seed data to tags table
INSERT INTO tags (name_en, name_ar, category, color, description_en, description_ar) VALUES
-- More sector tags
('Agriculture', 'الزراعة', 'sector', '#22C55E', 'Agricultural innovation and smart farming', 'الابتكار الزراعي والزراعة الذكية'),
('Defense', 'الدفاع', 'sector', '#525252', 'Defense and security solutions', 'حلول الدفاع والأمن'),
('Tourism', 'السياحة', 'sector', '#06B6D4', 'Tourism and hospitality innovations', 'ابتكارات السياحة والضيافة'),
('Sports', 'الرياضة', 'sector', '#F97316', 'Sports technology and fitness', 'تقنيات الرياضة واللياقة'),
('Real Estate', 'العقارات', 'sector', '#8B5CF6', 'Property technology and smart buildings', 'تقنيات العقارات والمباني الذكية'),
('Retail', 'التجارة', 'sector', '#EC4899', 'Retail innovation and e-commerce', 'ابتكار التجارة والتجارة الإلكترونية'),

-- Technology tags
('Blockchain', 'البلوك تشين', 'technology', '#F59E0B', 'Distributed ledger technology', 'تقنية الدفتر الموزع'),
('IoT', 'إنترنت الأشياء', 'technology', '#3B82F6', 'Internet of Things solutions', 'حلول إنترنت الأشياء'),
('Cloud Computing', 'الحوسبة السحابية', 'technology', '#06B6D4', 'Cloud infrastructure and services', 'البنية التحتية السحابية والخدمات'),
('Cybersecurity', 'الأمن السيبراني', 'technology', '#DC2626', 'Information security and privacy', 'أمن المعلومات والخصوصية'),
('5G', 'الجيل الخامس', 'technology', '#7C3AED', 'Fifth generation wireless technology', 'تقنية الجيل الخامس اللاسلكية'),
('Robotics', 'الروبوتات', 'technology', '#EA580C', 'Robotic systems and automation', 'أنظمة الروبوتات والأتمتة'),
('VR/AR', 'الواقع الافتراضي/المعزز', 'technology', '#EC4899', 'Virtual and Augmented Reality', 'الواقع الافتراضي والمعزز'),

-- Approach/methodology tags
('Design Thinking', 'التفكير التصميمي', 'approach', '#10B981', 'Human-centered design methodology', 'منهجية التصميم المتمحور حول الإنسان'),
('Agile', 'المرونة', 'approach', '#3B82F6', 'Agile development methodology', 'منهجية التطوير المرنة'),
('Lean Startup', 'الشركة الناشئة المرنة', 'approach', '#F59E0B', 'Lean startup methodology', 'منهجية الشركة الناشئة المرنة'),
('Open Innovation', 'الابتكار المفتوح', 'approach', '#06B6D4', 'Collaborative innovation approach', 'نهج الابتكار التعاوني'),

-- Challenge type tags  
('Hackathon', 'الهاكاثون', 'type', '#8B5CF6', 'Innovation hackathon event', 'فعالية هاكاثون الابتكار'),
('Competition', 'المسابقة', 'type', '#DC2626', 'Innovation competition', 'مسابقة الابتكار'),
('Workshop', 'ورشة العمل', 'type', '#059669', 'Hands-on workshop', 'ورشة عمل تطبيقية'),
('Accelerator', 'المسرع', 'type', '#7C3AED', 'Startup accelerator program', 'برنامج مسرع الشركات الناشئة'),

-- Priority and status tags
('Critical', 'حرج', 'priority', '#DC2626', 'Critical priority level', 'مستوى أولوية حرج'),
('Medium Priority', 'أولوية متوسطة', 'priority', '#F59E0B', 'Medium priority level', 'مستوى أولوية متوسط'),
('Low Priority', 'أولوية منخفضة', 'priority', '#22C55E', 'Low priority level', 'مستوى أولوية منخفض'),

-- Impact and outcome tags
('Social Impact', 'التأثير الاجتماعي', 'impact', '#10B981', 'Positive social impact solutions', 'حلول التأثير الاجتماعي الإيجابي'),
('Economic Growth', 'النمو الاقتصادي', 'impact', '#F59E0B', 'Economic development and growth', 'التنمية والنمو الاقتصادي'),
('Environmental', 'البيئي', 'impact', '#22C55E', 'Environmental conservation', 'الحفاظ على البيئة'),

-- Vision 2030 alignment tags
('Vision 2030', 'رؤية 2030', 'theme', '#6366F1', 'Saudi Vision 2030 aligned', 'متماشي مع رؤية السعودية 2030'),
('NEOM', 'نيوم', 'theme', '#EC4899', 'NEOM megacity project', 'مشروع مدينة نيوم'),
('Quality of Life', 'جودة الحياة', 'theme', '#10B981', 'Improving quality of life', 'تحسين جودة الحياة')
ON CONFLICT (name_en) DO NOTHING;

-- Add comprehensive seed data for challenges table
INSERT INTO challenges (
  id, title_ar, description_ar, status, priority_level, challenge_type, 
  start_date, end_date, estimated_budget, actual_budget,
  created_by, challenge_owner_id, assigned_expert_id,
  sensitivity_level, vision_2030_goal, kpi_alignment,
  collaboration_details, internal_team_notes
) VALUES
(
  gen_random_uuid(),
  'تطوير منصة ذكية للخدمات الحكومية',
  'تطوير منصة موحدة تدمج جميع الخدمات الحكومية باستخدام الذكاء الاصطناعي لتحسين تجربة المواطنين وتسريع الإجراءات الإدارية. تهدف المنصة إلى توفير خدمات 24/7 مع إمكانية التنبؤ بالاحتياجات والتوصيات الذكية.',
  'active',
  'high',
  'platform_development',
  CURRENT_DATE - INTERVAL '10 days',
  CURRENT_DATE + INTERVAL '90 days',
  2500000,
  NULL,
  (SELECT id FROM profiles LIMIT 1),
  (SELECT id FROM profiles LIMIT 1),
  NULL,
  'normal',
  'تحسين فعالية الخدمات الحكومية وتسريع التحول الرقمي',
  'خفض زمن الإجراءات بنسبة 70% وزيادة رضا المواطنين إلى 90%',
  'التعاون مع وزارات مختلفة ومنصة أبشر',
  'يتطلب تكامل مع الأنظمة الحالية وضمان الأمان'
),
(
  gen_random_uuid(),
  'حلول الذكاء الاصطناعي للرعاية الصحية',
  'تطوير نظام ذكي لتشخيص الأمراض المبكر باستخدام الذكاء الاصطناعي وتعلم الآلة. النظام يحلل البيانات الطبية ويقدم توصيات للأطباء مع إمكانية التنبؤ بالمخاطر الصحية قبل حدوثها.',
  'planning',
  'high',
  'ai_solution',
  CURRENT_DATE + INTERVAL '15 days',
  CURRENT_DATE + INTERVAL '180 days',
  4000000,
  NULL,
  (SELECT id FROM profiles LIMIT 1),
  (SELECT id FROM profiles LIMIT 1),
  NULL,
  'high',
  'تطوير قطاع الصحة ورفع جودة الخدمات الطبية',
  'خفض معدل الأخطاء التشخيصية بنسبة 40% وتسريع التشخيص',
  'شراكة مع وزارة الصحة والمستشفيات الرائدة',
  'يتطلب موافقات تنظيمية وحماية بيانات المرضى'
),
(
  gen_random_uuid(),
  'مبادرة المدن الذكية المستدامة',
  'تطوير حلول شاملة للمدن الذكية تشمل إدارة الطاقة، المرور، النفايات، والأمان العام باستخدام تقنيات إنترنت الأشياء والذكاء الاصطناعي لخلق بيئة حضرية مستدامة ومتطورة.',
  'active',
  'critical',
  'infrastructure',
  CURRENT_DATE - INTERVAL '30 days',
  CURRENT_DATE + INTERVAL '365 days',
  15000000,
  2000000,
  (SELECT id FROM profiles LIMIT 1),
  (SELECT id FROM profiles LIMIT 1),
  NULL,
  'normal',
  'بناء مدن مستدامة ومتطورة تقنياً',
  'خفض استهلاك الطاقة 30% وتحسين كفاءة المرور 50%',
  'تعاون مع أمانات المناطق وشركات التقنية',
  'مشروع ضخم يتطلب تنسيق بين جهات متعددة'
),
(
  gen_random_uuid(),
  'منصة التعليم الإلكتروني التفاعلي',
  'تطوير منصة تعليمية متقدمة تستخدم الواقع الافتراضي والذكاء الاصطناعي لتقديم تجربة تعليمية غامرة وشخصية. تهدف لتحسين نتائج التعلم وزيادة التفاعل بين الطلاب والمعلمين.',
  'completed',
  'medium',
  'education_platform',
  CURRENT_DATE - INTERVAL '180 days',
  CURRENT_DATE - INTERVAL '30 days',
  1800000,
  1650000,
  (SELECT id FROM profiles LIMIT 1),
  (SELECT id FROM profiles LIMIT 1),
  NULL,
  'normal',
  'تطوير نظام تعليمي متطور وشامل',
  'رفع معدل النجاح 25% وزيادة رضا الطلاب',
  'شراكة مع وزارة التعليم والجامعات',
  'تم التطوير بنجاح وبدأ التطبيق التجريبي'
);

-- Add challenge tags relationships
INSERT INTO challenge_tags (challenge_id, tag_id, added_by)
SELECT 
  c.id,
  t.id,
  (SELECT id FROM profiles LIMIT 1)
FROM challenges c
CROSS JOIN tags t
WHERE 
  (c.title_ar LIKE '%منصة ذكية%' AND t.name_en IN ('Technology', 'Artificial Intelligence', 'Vision 2030', 'High Priority'))
  OR (c.title_ar LIKE '%الذكاء الاصطناعي للرعاية%' AND t.name_en IN ('Healthcare', 'Artificial Intelligence', 'High Priority', 'Social Impact'))
  OR (c.title_ar LIKE '%المدن الذكية%' AND t.name_en IN ('Smart Cities', 'Sustainability', 'IoT', 'Critical', 'Vision 2030'))
  OR (c.title_ar LIKE '%التعليم الإلكتروني%' AND t.name_en IN ('Education', 'VR/AR', 'Technology', 'Medium Priority'));

-- Add seed data for ideas table
INSERT INTO ideas (
  id, title_ar, description_ar, status, challenge_id, focus_question_id,
  innovator_id, solution_approach, implementation_plan, business_model,
  expected_impact, target_beneficiaries, implementation_timeline,
  required_resources, risk_assessment, sustainability_plan
) VALUES
(
  gen_random_uuid(),
  'تطبيق ذكي لمراقبة جودة الهواء',
  'تطبيق يستخدم شبكة من أجهزة الاستشعار الذكية لمراقبة جودة الهواء في الوقت الفعلي وتقديم تنبيهات وتوصيات للمواطنين والجهات المختصة.',
  'under_review',
  (SELECT id FROM challenges WHERE title_ar LIKE '%المدن الذكية%' LIMIT 1),
  NULL,
  (SELECT id FROM innovators LIMIT 1),
  'شبكة أجهزة استشعار موزعة مع تطبيق جوال وموقع ويب',
  'المرحلة 1: تطوير النظام، المرحلة 2: التجريب، المرحلة 3: النشر الواسع',
  'اشتراكات مؤسسية وبيانات مجانية للعامة',
  'تحسين صحة المواطنين وتقليل الأمراض التنفسية',
  'المواطنون، الجهات الحكومية، المؤسسات الصحية',
  '12 شهر للتطوير و6 أشهر للنشر',
  'فريق تقني 8 أشخاص، أجهزة استشعار، خوادم سحابية',
  'تحديات في دقة البيانات والصيانة الدورية',
  'نموذج إيرادات مستدام وشراكات طويلة الأمد'
),
(
  gen_random_uuid(),
  'روبوت مساعد للمرضى في المستشفيات',
  'روبوت ذكي يقدم المساعدة للمرضى في التنقل داخل المستشفى، تذكيرهم بالأدوية، ومراقبة علاماتهم الحيوية الأساسية.',
  'approved',
  (SELECT id FROM challenges WHERE title_ar LIKE '%الذكاء الاصطناعي للرعاية%' LIMIT 1),
  NULL,
  (SELECT id FROM innovators LIMIT 1),
  'روبوت مجهز بذكاء اصطناعي وأجهزة استشعار طبية',
  'تطوير النموذج الأولي، اختبار إكلينيكي، إنتاج تجاري',
  'بيع وتأجير الروبوتات للمستشفيات',
  'تحسين تجربة المرضى وخفض عبء العمل على الممرضين',
  'المرضى، الطاقم الطبي، إدارة المستشفيات',
  '18 شهر للتطوير والاختبار',
  'مهندسين روبوتات، أطباء، مختبر للاختبار',
  'قبول المرضى للتقنية والامتثال للوائح الطبية',
  'صيانة دورية وتحديثات برمجية مستمرة'
),
(
  gen_random_uuid(),
  'منصة تعلم تكيفية بالذكاء الاصطناعي',
  'منصة تعليمية تستخدم الذكاء الاصطناعي لتحليل أسلوب تعلم كل طالب وتقديم محتوى مخصص يتكيف مع سرعة التعلم والقدرات الفردية.',
  'in_development',
  (SELECT id FROM challenges WHERE title_ar LIKE '%التعليم الإلكتروني%' LIMIT 1),
  NULL,
  (SELECT id FROM innovators LIMIT 1),
  'خوارزميات تعلم آلة لتحليل أنماط التعلم',
  'بناء المنصة، تجميع المحتوى، اختبار تجريبي في مدارس مختارة',
  'اشتراكات مدرسية ومحتوى مدفوع متقدم',
  'تحسين نتائج التعلم بنسبة 40% وزيادة الدافعية',
  'الطلاب، المعلمون، إدارات المدارس',
  '15 شهر للتطوير و6 أشهر للتطبيق التجريبي',
  'مطورين، خبراء تعليم، محتوى تعليمي عالي الجودة',
  'قبول المؤسسات التعليمية وتدريب المعلمين',
  'تحديث المحتوى المستمر وتطوير الخوارزميات'
);

-- Add idea tags relationships  
INSERT INTO idea_tags (idea_id, tag_id, added_by)
SELECT 
  i.id,
  t.id,
  (SELECT id FROM profiles LIMIT 1)
FROM ideas i
CROSS JOIN tags t
WHERE 
  (i.title_ar LIKE '%مراقبة جودة الهواء%' AND t.name_en IN ('IoT', 'Environmental', 'Smart Cities', 'Technology'))
  OR (i.title_ar LIKE '%روبوت مساعد%' AND t.name_en IN ('Robotics', 'Healthcare', 'Artificial Intelligence', 'Social Impact'))
  OR (i.title_ar LIKE '%تعلم تكيفية%' AND t.name_en IN ('Education', 'Artificial Intelligence', 'Technology', 'Innovation'));

-- Add seed data for events table
INSERT INTO events (
  id, title_ar, description_ar, event_type, format, status,
  event_date, start_time, end_time, registration_deadline,
  max_participants, current_participants, location_ar,
  visibility, created_by, event_manager_id,
  event_goals, target_audience, agenda, special_requirements
) VALUES
(
  gen_random_uuid(),
  'مؤتمر الابتكار الحكومي 2024',
  'مؤتمر سنوي يجمع خبراء الابتكار والمسؤولين الحكوميين لمناقشة أحدث الاتجاهات في التحول الرقمي والابتكار في القطاع العام.',
  'conference',
  'hybrid',
  'upcoming',
  CURRENT_DATE + INTERVAL '45 days',
  '09:00:00',
  '17:00:00',
  CURRENT_DATE + INTERVAL '30 days',
  500,
  127,
  'مركز الملك فهد الثقافي - الرياض',
  'public',
  (SELECT id FROM profiles LIMIT 1),
  (SELECT id FROM profiles LIMIT 1),
  'تعزيز ثقافة الابتكار وتبادل أفضل الممارسات',
  'المسؤولين الحكوميين، خبراء التقنية، رواد الأعمال',
  'جلسات نقاشية، عروض تقديمية، ورش عمل تفاعلية',
  'ترجمة فورية، بث مباشر، مواقف خاصة للضيوف'
),
(
  gen_random_uuid(),
  'ورشة تطوير تطبيقات الذكاء الاصطناعي',
  'ورشة عمل عملية لتعليم تطوير تطبيقات الذكاء الاصطناعي باستخدام أحدث التقنيات والأدوات مع مشاريع تطبيقية حقيقية.',
  'workshop',
  'in_person',
  'active',
  CURRENT_DATE + INTERVAL '20 days',
  '10:00:00',
  '16:00:00',
  CURRENT_DATE + INTERVAL '15 days',
  30,
  22,
  'مركز الابتكار التقني - جدة',
  'internal',
  (SELECT id FROM profiles LIMIT 1),
  (SELECT id FROM profiles LIMIT 1),
  'تأهيل كوادر وطنية في مجال الذكاء الاصطناعي',
  'المطورين، مهندسي البرمجيات، طلاب الحاسب',
  'نظرية الذكاء الاصطناعي، ورش عملية، مشروع تطبيقي',
  'أجهزة كمبيوتر محمولة، اتصال إنترنت سريع'
),
(
  gen_random_uuid(),
  'هاكاثون المدن الذكية',
  'هاكاثون لمدة 48 ساعة يتنافس فيه الفرق لتطوير حلول مبتكرة لتحديات المدن الذكية مع جوائز قيمة وفرص استثمارية.',
  'hackathon',
  'in_person',
  'completed',
  CURRENT_DATE - INTERVAL '15 days',
  '18:00:00',
  '18:00:00',
  CURRENT_DATE - INTERVAL '30 days',
  200,
  186,
  'مدينة الملك عبدالعزيز للعلوم والتقنية - الرياض',
  'public',
  (SELECT id FROM profiles LIMIT 1),
  (SELECT id FROM profiles LIMIT 1),
  'إيجاد حلول إبداعية لتحديات المدن الذكية',
  'المطورين، المصممين، رواد الأعمال، الطلاب',
  'تكوين الفرق، العصف الذهني، التطوير، العرض النهائي',
  'إقامة ليلتين، وجبات، مساحات عمل مجهزة'
);

-- Add event tags relationships
INSERT INTO event_tags (event_id, tag_id, added_by)
SELECT 
  e.id,
  t.id,
  (SELECT id FROM profiles LIMIT 1)
FROM events e
CROSS JOIN tags t
WHERE 
  (e.title_ar LIKE '%مؤتمر الابتكار%' AND t.name_en IN ('Innovation', 'Technology', 'Vision 2030', 'Conference'))
  OR (e.title_ar LIKE '%تطوير تطبيقات الذكاء%' AND t.name_en IN ('Artificial Intelligence', 'Technology', 'Workshop', 'Education'))
  OR (e.title_ar LIKE '%هاكاثون المدن%' AND t.name_en IN ('Smart Cities', 'Hackathon', 'Innovation', 'Technology'));

-- Create performance views for better query optimization
CREATE OR REPLACE VIEW public.challenges_with_stats AS
SELECT 
  c.*,
  COUNT(DISTINCT cp.id) as participant_count,
  COUNT(DISTINCT cs.id) as submission_count,
  ARRAY_AGG(DISTINCT t.name_en ORDER BY t.name_en) FILTER (WHERE t.name_en IS NOT NULL) as tag_names,
  ARRAY_AGG(DISTINCT t.name_ar ORDER BY t.name_ar) FILTER (WHERE t.name_ar IS NOT NULL) as tag_names_ar,
  ARRAY_AGG(DISTINCT t.color ORDER BY t.color) FILTER (WHERE t.color IS NOT NULL) as tag_colors,
  AVG(cf.rating) as average_rating,
  COUNT(DISTINCT cf.id) as feedback_count
FROM challenges c
LEFT JOIN challenge_participants cp ON c.id = cp.challenge_id AND cp.status = 'active'
LEFT JOIN challenge_submissions cs ON c.id = cs.challenge_id AND cs.status = 'submitted'
LEFT JOIN challenge_tags ct ON c.id = ct.challenge_id
LEFT JOIN tags t ON ct.tag_id = t.id
LEFT JOIN challenge_feedback cf ON c.id = cf.challenge_id
GROUP BY c.id;

CREATE OR REPLACE VIEW public.ideas_with_stats AS
SELECT 
  i.*,
  p.name as innovator_name,
  p.name_ar as innovator_name_ar,
  c.title_ar as challenge_title,
  COUNT(DISTINCT ic.id) as comment_count,
  COUNT(DISTINCT il.id) as like_count,
  ARRAY_AGG(DISTINCT t.name_en ORDER BY t.name_en) FILTER (WHERE t.name_en IS NOT NULL) as tag_names,
  ARRAY_AGG(DISTINCT t.name_ar ORDER BY t.name_ar) FILTER (WHERE t.name_ar IS NOT NULL) as tag_names_ar,
  ARRAY_AGG(DISTINCT t.color ORDER BY t.color) FILTER (WHERE t.color IS NOT NULL) as tag_colors
FROM ideas i
LEFT JOIN innovators inn ON i.innovator_id = inn.id
LEFT JOIN profiles p ON inn.user_id = p.id
LEFT JOIN challenges c ON i.challenge_id = c.id
LEFT JOIN idea_comments ic ON i.id = ic.idea_id
LEFT JOIN idea_likes il ON i.id = il.idea_id
LEFT JOIN idea_tags it ON i.id = it.idea_id
LEFT JOIN tags t ON it.tag_id = t.id
GROUP BY i.id, p.name, p.name_ar, c.title_ar;

CREATE OR REPLACE VIEW public.events_with_stats AS
SELECT 
  e.*,
  COUNT(DISTINCT ep.id) as actual_participants,
  COUNT(DISTINCT el.id) as like_count,
  COUNT(DISTINCT eb.id) as bookmark_count,
  AVG(ef.rating) as average_rating,
  COUNT(DISTINCT ef.id) as feedback_count,
  ARRAY_AGG(DISTINCT t.name_en ORDER BY t.name_en) FILTER (WHERE t.name_en IS NOT NULL) as tag_names,
  ARRAY_AGG(DISTINCT t.name_ar ORDER BY t.name_ar) FILTER (WHERE t.name_ar IS NOT NULL) as tag_names_ar,
  ARRAY_AGG(DISTINCT t.color ORDER BY t.color) FILTER (WHERE t.color IS NOT NULL) as tag_colors
FROM events e
LEFT JOIN event_participants ep ON e.id = ep.event_id AND ep.attendance_status = 'attended'
LEFT JOIN event_likes el ON e.id = el.event_id
LEFT JOIN event_bookmarks eb ON e.id = eb.event_id
LEFT JOIN event_feedback ef ON e.id = ef.event_id
LEFT JOIN event_tags et ON e.id = et.event_id
LEFT JOIN tags t ON et.tag_id = t.id
GROUP BY e.id;

-- Add some sample opportunities
INSERT INTO opportunities (
  id, title_ar, description_ar, opportunity_type, status,
  deadline, budget_min, budget_max, duration_months,
  created_by, target_audience, expected_outcomes,
  application_requirements, selection_criteria
) VALUES
(
  gen_random_uuid(),
  'مسرع الشركات الناشئة التقنية',
  'برنامج لتسريع نمو الشركات الناشئة في مجال التقنية مع توفير التمويل والإرشاد وفرص الشراكة مع الجهات الحكومية.',
  'accelerator',
  'open',
  CURRENT_DATE + INTERVAL '60 days',
  250000,
  1000000,
  6,
  (SELECT id FROM profiles LIMIT 1),
  'الشركات الناشئة التقنية، رواد الأعمال',
  'تسريع نمو 20 شركة ناشئة وخلق 200 وظيفة جديدة',
  'خطة عمل، فريق متكامل، نموذج أولي',
  'الابتكار، القابلية للتوسع، التأثير الاجتماعي'
),
(
  gen_random_uuid(),
  'صندوق الاستثمار في الابتكار الصحي',
  'صندوق استثماري لدعم الحلول المبتكرة في مجال الرعاية الصحية والتقنيات الطبية المتقدمة.',
  'funding',
  'open',
  CURRENT_DATE + INTERVAL '90 days',
  500000,
  5000000,
  24,
  (SELECT id FROM profiles LIMIT 1),
  'الشركات العاملة في مجال التقنيات الطبية',
  'تطوير 10 حلول طبية مبتكرة تخدم المرضى السعوديين',
  'دراسة جدوى، موافقات تنظيمية، فريق طبي متخصص',
  'الجدوى الطبية، الأثر الصحي، الاستدامة المالية'
);

-- Log the completion of Phase 6 implementation
INSERT INTO public.analytics_events (
  event_type,
  event_category,
  properties,
  timestamp
) VALUES (
  'phase_completion',
  'implementation',
  jsonb_build_object(
    'phase', 'Phase 6 - Final Implementation',
    'progress', '100%',
    'features_added', ARRAY[
      'comprehensive_seed_data',
      'performance_views', 
      'enhanced_tagging',
      'challenge_samples',
      'idea_samples',
      'event_samples',
      'opportunity_samples'
    ],
    'completion_time', NOW()
  ),
  NOW()
);