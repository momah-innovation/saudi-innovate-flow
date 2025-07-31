-- Comprehensive seeding of all tables with realistic linked data

-- Seed sectors (Saudi government sectors)
INSERT INTO public.sectors (id, name, name_ar, description, vision_2030_alignment) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Health', 'الصحة', 'Healthcare and medical services sector', 'Quality of Life Program - Health'),
('550e8400-e29b-41d4-a716-446655440002', 'Education', 'التعليم', 'Education and training sector', 'Human Capacity Development Program'),
('550e8400-e29b-41d4-a716-446655440003', 'Technology', 'التقنية', 'Information technology and digital transformation', 'National Transformation Program'),
('550e8400-e29b-41d4-a716-446655440004', 'Energy', 'الطاقة', 'Energy and renewable resources sector', 'Saudi Green Initiative'),
('550e8400-e29b-41d4-a716-446655440005', 'Transportation', 'النقل', 'Transportation and logistics sector', 'Saudi Vision 2030 - Transportation')
ON CONFLICT (id) DO NOTHING;

-- Seed deputies
INSERT INTO public.deputies (id, name, name_ar, deputy_minister, contact_email, sector_id) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Digital Health Deputy', 'نائب الصحة الرقمية', 'Dr. Ahmad Al-Rashid', 'ahmad.rashid@health.gov.sa', '550e8400-e29b-41d4-a716-446655440001'),
('660e8400-e29b-41d4-a716-446655440002', 'Higher Education Deputy', 'نائب التعليم العالي', 'Dr. Sarah Al-Mahmoud', 'sarah.mahmoud@education.gov.sa', '550e8400-e29b-41d4-a716-446655440002'),
('660e8400-e29b-41d4-a716-446655440003', 'Digital Transformation Deputy', 'نائب التحول الرقمي', 'Eng. Mohammed Al-Otaibi', 'mohammed.otaibi@tech.gov.sa', '550e8400-e29b-41d4-a716-446655440003'),
('660e8400-e29b-41d4-a716-446655440004', 'Renewable Energy Deputy', 'نائب الطاقة المتجددة', 'Dr. Fatima Al-Zahrani', 'fatima.zahrani@energy.gov.sa', '550e8400-e29b-41d4-a716-446655440004'),
('660e8400-e29b-41d4-a716-446655440005', 'Smart Transport Deputy', 'نائب النقل الذكي', 'Eng. Khalid Al-Dosari', 'khalid.dosari@transport.gov.sa', '550e8400-e29b-41d4-a716-446655440005')
ON CONFLICT (id) DO NOTHING;

-- Seed departments
INSERT INTO public.departments (id, name, name_ar, department_head, budget_allocation, deputy_id) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Telemedicine', 'الطب عن بُعد', 'Dr. Nora Al-Ghamdi', 5000000, '660e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440002', 'Medical AI', 'الذكاء الاصطناعي الطبي', 'Dr. Omar Al-Harbi', 8000000, '660e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440003', 'E-Learning Platforms', 'منصات التعلم الإلكتروني', 'Prof. Layla Al-Mutairi', 6000000, '660e8400-e29b-41d4-a716-446655440002'),
('770e8400-e29b-41d4-a716-446655440004', 'Digital Infrastructure', 'البنية التحتية الرقمية', 'Eng. Yazid Al-Qahtani', 12000000, '660e8400-e29b-41d4-a716-446655440003'),
('770e8400-e29b-41d4-a716-446655440005', 'Solar Innovation', 'ابتكار الطاقة الشمسية', 'Dr. Reem Al-Shehri', 10000000, '660e8400-e29b-41d4-a716-446655440004')
ON CONFLICT (id) DO NOTHING;

-- Seed domains
INSERT INTO public.domains (id, name, name_ar, specialization, domain_lead, department_id) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'Remote Patient Monitoring', 'مراقبة المرضى عن بُعد', 'IoT healthcare devices and monitoring systems', 'Dr. Hassan Al-Balawi', '770e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440002', 'Medical Imaging AI', 'الذكاء الاصطناعي للتصوير الطبي', 'AI-powered medical image analysis', 'Dr. Maha Al-Anzi', '770e8400-e29b-41d4-a716-446655440002'),
('880e8400-e29b-41d4-a716-446655440003', 'Adaptive Learning', 'التعلم التكيفي', 'Personalized learning algorithms', 'Prof. Ibrahim Al-Khaldi', '770e8400-e29b-41d4-a716-446655440003'),
('880e8400-e29b-41d4-a716-446655440004', 'Cloud Computing', 'الحوسبة السحابية', 'Government cloud infrastructure', 'Eng. Amira Al-Fadl', '770e8400-e29b-41d4-a716-446655440004'),
('880e8400-e29b-41d4-a716-446655440005', 'Energy Storage', 'تخزين الطاقة', 'Advanced battery and storage technologies', 'Dr. Saad Al-Jaber', '770e8400-e29b-41d4-a716-446655440005')
ON CONFLICT (id) DO NOTHING;

-- Seed partners
INSERT INTO public.partners (id, name, name_ar, organization_type, contact_email, phone, website, partnership_tier, status) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', 'Saudi Aramco', 'أرامكو السعودية', 'corporate', 'innovation@aramco.com', '+966-11-123-4567', 'https://www.aramco.com', 'strategic', 'active'),
('aa0e8400-e29b-41d4-a716-446655440002', 'King Abdullah University', 'جامعة الملك عبدالله', 'academic', 'research@kaust.edu.sa', '+966-12-808-0000', 'https://www.kaust.edu.sa', 'strategic', 'active'),
('aa0e8400-e29b-41d4-a716-446655440003', 'STC Solutions', 'حلول الاتصالات السعودية', 'corporate', 'partnerships@stc.com.sa', '+966-11-455-0000', 'https://www.stc.com.sa', 'preferred', 'active'),
('aa0e8400-e29b-41d4-a716-446655440004', 'Riyadh Techno Valley', 'وادي الرياض للتقنية', 'incubator', 'info@rtv.sa', '+966-11-299-9999', 'https://www.rtv.sa', 'standard', 'active'),
('aa0e8400-e29b-41d4-a716-446655440005', 'NEOM Tech', 'نيوم للتقنية', 'corporate', 'tech@neom.com', '+966-50-123-4567', 'https://www.neom.com', 'strategic', 'active')
ON CONFLICT (id) DO NOTHING;

-- Seed stakeholders
INSERT INTO public.stakeholders (id, name, name_ar, role, organization, email, influence_level, engagement_status, contact_preferences) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', 'Dr. Abdullah Al-Rasheed', 'د. عبدالله الرشيد', 'Chief Innovation Officer', 'Ministry of Health', 'abdullah.rasheed@moh.gov.sa', 'high', 'active', '{"email": true, "phone": false, "meetings": true}'),
('bb0e8400-e29b-41d4-a716-446655440002', 'Prof. Noura Al-Fayez', 'أ.د. نورا الفايز', 'Dean of Computer Science', 'King Saud University', 'nfayez@ksu.edu.sa', 'high', 'active', '{"email": true, "phone": true, "meetings": true}'),
('bb0e8400-e29b-41d4-a716-446655440003', 'Eng. Turki Al-Dakhil', 'م. تركي الدخيل', 'Director of Digital Innovation', 'MCIT', 'turki.dakhil@mcit.gov.sa', 'high', 'active', '{"email": true, "phone": false, "meetings": true}'),
('bb0e8400-e29b-41d4-a716-446655440004', 'Dr. Mona Al-Munajjed', 'د. منى المنجد', 'Research Director', 'KACST', 'mona.munajjed@kacst.edu.sa', 'medium', 'interested', '{"email": true, "phone": false, "meetings": false}'),
('bb0e8400-e29b-41d4-a716-446655440005', 'Mr. Salman Al-Rajhi', 'أ. سلمان الراجحي', 'Innovation Manager', 'Saudi Aramco', 'salman.rajhi@aramco.com', 'medium', 'active', '{"email": true, "phone": true, "meetings": true}')
ON CONFLICT (id) DO NOTHING;

-- Seed focus questions
INSERT INTO public.focus_questions (id, question_ar, question_en, description_ar, description_en, category, status, priority_level, sector_id, deputy_id) VALUES
('cc0e8400-e29b-41d4-a716-446655440001', 'كيف يمكن تحسين جودة الرعاية الصحية من خلال التقنيات الذكية؟', 'How can we improve healthcare quality through smart technologies?', 'تطوير حلول تقنية مبتكرة لتحسين خدمات الرعاية الصحية', 'Develop innovative tech solutions to enhance healthcare services', 'healthcare', 'active', 'high', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001'),
('cc0e8400-e29b-41d4-a716-446655440002', 'ما هي أفضل الطرق لتطوير منصات التعلم التفاعلي؟', 'What are the best ways to develop interactive learning platforms?', 'إيجاد حلول مبتكرة للتعليم الإلكتروني والتعلم عن بُعد', 'Find innovative solutions for e-learning and remote education', 'education', 'active', 'high', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002'),
('cc0e8400-e29b-41d4-a716-446655440003', 'كيف نضمن الأمن السيبراني في البنية التحتية الرقمية؟', 'How do we ensure cybersecurity in digital infrastructure?', 'تطوير استراتيجيات وحلول الأمن السيبراني المتقدمة', 'Develop advanced cybersecurity strategies and solutions', 'technology', 'active', 'critical', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003'),
('cc0e8400-e29b-41d4-a716-446655440004', 'ما هي الحلول المبتكرة لتخزين الطاقة المتجددة؟', 'What are innovative solutions for renewable energy storage?', 'البحث عن تقنيات متطورة لتخزين الطاقة النظيفة', 'Research advanced technologies for clean energy storage', 'energy', 'active', 'high', '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004'),
('cc0e8400-e29b-41d4-a716-446655440005', 'كيف يمكن تطوير أنظمة النقل الذكي في المدن؟', 'How can we develop smart transportation systems in cities?', 'إيجاد حلول نقل ذكية ومستدامة للمدن السعودية', 'Find smart and sustainable transportation solutions for Saudi cities', 'transportation', 'active', 'medium', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005')
ON CONFLICT (id) DO NOTHING;

-- Seed challenges
INSERT INTO public.challenges (id, title_ar, description_ar, challenge_type, status, priority_level, start_date, end_date, estimated_budget, sector_id, deputy_id, department_id) VALUES
('dd0e8400-e29b-41d4-a716-446655440001', 'تطوير نظام مراقبة المرضى الذكي', 'تطوير نظام متكامل لمراقبة المرضى عن بُعد باستخدام أجهزة إنترنت الأشياء والذكاء الاصطناعي لتحسين جودة الرعاية الصحية وتقليل التكاليف', 'innovation', 'active', 'high', '2024-02-01', '2024-08-01', 2500000, '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001'),
('dd0e8400-e29b-41d4-a716-446655440002', 'منصة التعلم التكيفي الذكية', 'إنشاء منصة تعليمية تستخدم الذكاء الاصطناعي لتقديم تجربة تعلم شخصية ومخصصة لكل طالب بناءً على قدراته واحتياجاته', 'digital_transformation', 'active', 'high', '2024-01-15', '2024-07-15', 3000000, '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440003'),
('dd0e8400-e29b-41d4-a716-446655440003', 'حماية البنية التحتية السيبرانية', 'تطوير نظام متقدم لحماية البنية التحتية الحكومية من التهديدات السيبرانية باستخدام تقنيات الذكاء الاصطناعي والتعلم الآلي', 'security', 'active', 'critical', '2024-03-01', '2024-12-01', 5000000, '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440004'),
('dd0e8400-e29b-41d4-a716-446655440004', 'تقنيات تخزين الطاقة المتطورة', 'البحث وتطوير تقنيات جديدة لتخزين الطاقة المتجددة بكفاءة عالية وتكلفة منخفضة لدعم أهداف رؤية 2030', 'research', 'planning', 'high', '2024-04-01', '2025-04-01', 8000000, '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440005'),
('dd0e8400-e29b-41d4-a716-446655440005', 'نظام النقل الذكي المتكامل', 'تطوير نظام نقل ذكي شامل يربط جميع وسائل النقل في المدن السعودية لتحسين كفاءة المرور وتقليل الازدحام', 'innovation', 'draft', 'medium', '2024-06-01', '2025-06-01', 4500000, '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', null)
ON CONFLICT (id) DO NOTHING;

-- Seed campaigns
INSERT INTO public.campaigns (id, title_ar, description_ar, theme, status, start_date, end_date, target_participants, target_ideas, budget, sector_id, deputy_id, department_id, challenge_id) VALUES
('ee0e8400-e29b-41d4-a716-446655440001', 'حملة الابتكار في الرعاية الصحية الرقمية', 'حملة شاملة لتشجيع الابتكار في مجال الرعاية الصحية الرقمية وتطوير حلول تقنية متقدمة', 'digital_health', 'active', '2024-01-01', '2024-06-30', 500, 100, 1000000, '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'dd0e8400-e29b-41d4-a716-446655440001'),
('ee0e8400-e29b-41d4-a716-446655440002', 'مبادرة التعليم الذكي', 'مبادرة لتطوير حلول التعلم الإلكتروني والذكي في القطاع التعليمي السعودي', 'smart_education', 'active', '2024-02-01', '2024-08-31', 300, 75, 800000, '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440003', 'dd0e8400-e29b-41d4-a716-446655440002'),
('ee0e8400-e29b-41d4-a716-446655440003', 'تحدي الأمن السيبراني الوطني', 'تحدي وطني لتطوير حلول الأمن السيبراني المتقدمة لحماية البنية التحتية الحكومية', 'cybersecurity', 'planning', '2024-04-01', '2024-10-31', 200, 50, 1500000, '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440004', 'dd0e8400-e29b-41d4-a716-446655440003')
ON CONFLICT (id) DO NOTHING;

-- Seed events
INSERT INTO public.events (id, title_ar, description_ar, event_type, format, status, event_date, registration_deadline, max_participants, location, sector_id, deputy_id) VALUES
('ff0e8400-e29b-41d4-a716-446655440001', 'مؤتمر الابتكار في الصحة الرقمية', 'مؤتمر متخصص يجمع الخبراء والمبتكرين في مجال الصحة الرقمية لمناقشة أحدث التطورات والحلول', 'conference', 'hybrid', 'upcoming', '2024-04-15', '2024-04-01', 300, 'مركز الملك عبدالعزيز للمؤتمرات، الرياض', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001'),
('ff0e8400-e29b-41d4-a716-446655440002', 'ورشة تطوير المنصات التعليمية', 'ورشة عمل متخصصة في تطوير وتصميم المنصات التعليمية الإلكترونية باستخدام أحدث التقنيات', 'workshop', 'in_person', 'active', '2024-03-20', '2024-03-10', 50, 'جامعة الملك سعود، الرياض', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002'),
('ff0e8400-e29b-41d4-a716-446655440003', 'هاكاثون الأمن السيبراني', 'هاكاثون مكثف لمدة 48 ساعة يركز على تطوير حلول الأمن السيبراني المبتكرة', 'hackathon', 'in_person', 'completed', '2024-02-15', '2024-02-01', 100, 'وادي الرياض للتقنية', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003'),
('ff0e8400-e29b-41d4-a716-446655440004', 'ندوة الطاقة المتجددة والتخزين', 'ندوة علمية تناقش التطورات الحديثة في تقنيات الطاقة المتجددة وحلول التخزين', 'seminar', 'virtual', 'upcoming', '2024-05-10', '2024-04-25', 200, 'منصة افتراضية', '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004'),
('ff0e8400-e29b-41d4-a716-446655440005', 'معرض تقنيات النقل الذكي', 'معرض متخصص يعرض أحدث التقنيات والحلول في مجال النقل الذكي والمدن الذكية', 'exhibition', 'in_person', 'planning', '2024-07-05', '2024-06-15', 500, 'مركز المعارض الدولي، الرياض', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005')
ON CONFLICT (id) DO NOTHING;

-- Seed innovators
INSERT INTO public.innovators (id, specialization, experience_level, industry_focus, innovation_interests, status) VALUES
('11111111-1111-1111-1111-111111111111', 'artificial_intelligence', 'senior', 'healthcare', '{"AI", "machine_learning", "healthcare_tech"}', 'active'),
('22222222-2222-2222-2222-222222222222', 'software_engineering', 'mid_level', 'education', '{"web_development", "mobile_apps", "edtech"}', 'active'),
('33333333-3333-3333-3333-333333333333', 'cybersecurity', 'expert', 'government', '{"network_security", "encryption", "threat_detection"}', 'active'),
('44444444-4444-4444-4444-444444444444', 'renewable_energy', 'senior', 'energy', '{"solar_power", "energy_storage", "smart_grids"}', 'active'),
('55555555-5555-5555-5555-555555555555', 'iot_systems', 'mid_level', 'transportation', '{"IoT", "sensors", "smart_cities"}', 'active')
ON CONFLICT (id) DO NOTHING;

-- Seed ideas
INSERT INTO public.ideas (id, title_ar, description_ar, status, innovator_id, challenge_id, focus_question_id, solution_approach, implementation_plan, expected_impact, business_model) VALUES
('aaaa1111-1111-1111-1111-111111111111', 'نظام مراقبة حيوية ذكي للمرضى', 'نظام متطور يستخدم أجهزة استشعار ذكية وخوارزميات الذكاء الاصطناعي لمراقبة العلامات الحيوية للمرضى في الوقت الفعلي وإرسال تنبيهات فورية للطاقم الطبي', 'under_review', '11111111-1111-1111-1111-111111111111', 'dd0e8400-e29b-41d4-a716-446655440001', 'cc0e8400-e29b-41d4-a716-446655440001', 'استخدام أجهزة استشعار متقدمة مع خوارزميات التعلم الآلي', 'المرحلة الأولى: تطوير النموذج الأولي، المرحلة الثانية: التجريب السريري، المرحلة الثالثة: التطبيق الواسع', 'تحسين جودة الرعاية الصحية بنسبة 40% وتقليل الأخطاء الطبية', 'نموذج الاشتراك الشهري للمستشفيات'),
('bbbb2222-2222-2222-2222-222222222222', 'منصة التعلم التفاعلي المخصص', 'منصة تعليمية تستخدم الذكاء الاصطناعي لتحليل أسلوب تعلم كل طالب وتقديم محتوى مخصص يناسب قدراته', 'approved', '22222222-2222-2222-2222-222222222222', 'dd0e8400-e29b-41d4-a716-446655440002', 'cc0e8400-e29b-41d4-a716-446655440002', 'خوارزميات التعلم التكيفي والتحليل السلوكي', 'بناء المنصة باستخدام تقنيات الويب الحديثة وتطبيق الهاتف المحمول', 'زيادة كفاءة التعلم بنسبة 60% وتحسين النتائج الأكاديمية', 'نموذج الترخيص للمؤسسات التعليمية'),
('cccc3333-3333-3333-3333-333333333333', 'نظام الكشف المبكر للتهديدات السيبرانية', 'نظام متطور يستخدم الذكاء الاصطناعي والتعلم الآلي لتحليل حركة البيانات واكتشاف التهديدات السيبرانية قبل حدوثها', 'in_development', '33333333-3333-3333-3333-333333333333', 'dd0e8400-e29b-41d4-a716-446655440003', 'cc0e8400-e29b-41d4-a716-446655440003', 'تحليل السلوك الشاذ باستخدام الذكاء الاصطناعي', 'تطوير خوارزميات التعلم الآلي وبناء قاعدة بيانات التهديدات', 'حماية البنية التحتية الحكومية بنسبة 95%', 'نموذج الخدمة كحل متكامل للأمن السيبراني')
ON CONFLICT (id) DO NOTHING;

-- Seed partnership opportunities
INSERT INTO public.partnership_opportunities (id, title, title_ar, description, description_ar, partnership_type, requirements, requirements_ar, budget_range, deadline, status, sector_id, contact_email, benefits, benefits_ar) VALUES
('1111aaaa-1111-1111-1111-111111111111', 'Healthcare AI Innovation Partnership', 'شراكة الابتكار في الذكاء الاصطناعي للرعاية الصحية', 'Strategic partnership to develop AI-powered healthcare solutions for the Saudi market', 'شراكة استراتيجية لتطوير حلول الرعاية الصحية المدعومة بالذكاء الاصطناعي للسوق السعودي', 'strategic', 'AI expertise, healthcare domain knowledge, local presence', 'خبرة في الذكاء الاصطناعي، معرفة بمجال الرعاية الصحية، تواجد محلي', '5000000-15000000', '2024-06-30', 'open', '550e8400-e29b-41d4-a716-446655440001', 'health.partnerships@gov.sa', 'Access to government contracts, R&D funding, market entry support', 'الوصول للعقود الحكومية، تمويل البحث والتطوير، دعم دخول السوق'),
('2222bbbb-2222-2222-2222-222222222222', 'Smart Education Platform Development', 'تطوير منصة التعليم الذكي', 'Collaborative partnership to build next-generation educational platforms for Saudi schools and universities', 'شراكة تعاونية لبناء منصات تعليمية من الجيل القادم للمدارس والجامعات السعودية', 'collaborative', 'EdTech experience, Arabic language support, scalable architecture', 'خبرة في تقنيات التعليم، دعم اللغة العربية، هندسة قابلة للتوسع', '3000000-10000000', '2024-05-15', 'open', '550e8400-e29b-41d4-a716-446655440002', 'education.tech@gov.sa', 'Ministry endorsement, pilot program access, scaling opportunities', 'تأييد الوزارة، الوصول للبرامج التجريبية، فرص التوسع'),
('3333cccc-3333-3333-3333-333333333333', 'Cybersecurity Solutions Alliance', 'تحالف حلول الأمن السيبراني', 'Form an alliance to develop comprehensive cybersecurity solutions for critical infrastructure protection', 'تشكيل تحالف لتطوير حلول الأمن السيبراني الشاملة لحماية البنية التحتية الحيوية', 'alliance', 'Security clearance, proven track record, advanced threat detection capabilities', 'تصريح أمني، سجل حافل موثق، قدرات متقدمة في اكتشاف التهديدات', '10000000-25000000', '2024-08-01', 'review', '550e8400-e29b-41d4-a716-446655440003', 'cyber.security@gov.sa', 'Government contracts, security clearances, technology transfer', 'العقود الحكومية، التصاريح الأمنية، نقل التقنية')
ON CONFLICT (id) DO NOTHING;

-- Seed partnership applications
INSERT INTO public.partnership_applications (id, opportunity_id, applicant_name, applicant_email, organization_name, proposal_summary, proposal_summary_ar, application_status, submitted_at) VALUES
('app11111-1111-1111-1111-111111111111', '1111aaaa-1111-1111-1111-111111111111', 'Dr. Sarah Tech', 'sarah.tech@medaipartners.com', 'MedAI Partners', 'Comprehensive AI solution for patient monitoring and diagnosis using advanced ML algorithms', 'حل شامل للذكاء الاصطناعي لمراقبة المرضى والتشخيص باستخدام خوارزميات التعلم الآلي المتقدمة', 'under_review', '2024-01-15 10:00:00'),
('app22222-2222-2222-2222-222222222222', '2222bbbb-2222-2222-2222-222222222222', 'Ahmed Al-Rashid', 'ahmed@edutech-saudi.com', 'EduTech Saudi', 'Interactive learning platform with AR/VR capabilities and Arabic NLP integration', 'منصة التعلم التفاعلي مع قدرات الواقع المعزز والافتراضي وتكامل معالجة اللغة العربية الطبيعية', 'approved', '2024-01-20 14:30:00'),
('app33333-3333-3333-3333-333333333333', '3333cccc-3333-3333-3333-333333333333', 'CyberGuard Solutions', 'partnerships@cyberguard.sa', 'CyberGuard Solutions', 'Next-generation threat detection system using quantum-resistant encryption', 'نظام اكتشاف التهديدات من الجيل القادم باستخدام التشفير المقاوم للحوسبة الكمية', 'pending', '2024-02-01 16:45:00')
ON CONFLICT (id) DO NOTHING;

-- Seed analytics data
INSERT INTO public.partnership_analytics (partner_id, metric_name, metric_value, period_start, period_end, metadata) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', 'active_partnerships', 3, '2024-01-01', '2024-01-31', '{"sector": "healthcare", "type": "strategic"}'),
('aa0e8400-e29b-41d4-a716-446655440002', 'research_collaborations', 5, '2024-01-01', '2024-01-31', '{"sector": "education", "type": "academic"}'),
('aa0e8400-e29b-41d4-a716-446655440003', 'innovation_projects', 2, '2024-01-01', '2024-01-31', '{"sector": "technology", "type": "corporate"}')
ON CONFLICT (id) DO NOTHING;