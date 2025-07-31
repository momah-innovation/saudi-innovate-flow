-- Comprehensive seeding of all tables with realistic linked data

-- First, create some test users in auth.users if they don't exist
-- Note: In production, users would be created through authentication

-- Seed sectors (Saudi government sectors)
INSERT INTO public.sectors (id, name, name_ar, description, description_ar) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Health', 'الصحة', 'Healthcare and medical services sector', 'قطاع الرعاية الصحية والخدمات الطبية'),
('550e8400-e29b-41d4-a716-446655440002', 'Education', 'التعليم', 'Education and training sector', 'قطاع التعليم والتدريب'),
('550e8400-e29b-41d4-a716-446655440003', 'Technology', 'التقنية', 'Information technology and digital transformation', 'تقنية المعلومات والتحول الرقمي'),
('550e8400-e29b-41d4-a716-446655440004', 'Energy', 'الطاقة', 'Energy and renewable resources sector', 'قطاع الطاقة والموارد المتجددة'),
('550e8400-e29b-41d4-a716-446655440005', 'Transportation', 'النقل', 'Transportation and logistics sector', 'قطاع النقل واللوجستيات')
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

-- Seed services
INSERT INTO public.services (id, name, name_ar, description, description_ar, service_type, domain_id) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'Virtual Consultations', 'الاستشارات الافتراضية', 'Online medical consultation platform', 'منصة الاستشارات الطبية عبر الإنترنت', 'digital_service', '880e8400-e29b-41d4-a716-446655440001'),
('990e8400-e29b-41d4-a716-446655440002', 'Diagnostic AI Assistant', 'مساعد التشخيص الذكي', 'AI-powered diagnostic support system', 'نظام الدعم التشخيصي المدعوم بالذكاء الاصطناعي', 'ai_service', '880e8400-e29b-41d4-a716-446655440002'),
('990e8400-e29b-41d4-a716-446655440003', 'Smart Learning Portal', 'بوابة التعلم الذكي', 'Personalized education platform', 'منصة التعليم الشخصي', 'digital_service', '880e8400-e29b-41d4-a716-446655440003'),
('990e8400-e29b-41d4-a716-446655440004', 'Government Cloud Services', 'خدمات الحكومة السحابية', 'Secure cloud infrastructure for government', 'البنية التحتية السحابية الآمنة للحكومة', 'infrastructure', '880e8400-e29b-41d4-a716-446655440004'),
('990e8400-e29b-41d4-a716-446655440005', 'Smart Grid Platform', 'منصة الشبكة الذكية', 'Intelligent energy distribution system', 'نظام توزيع الطاقة الذكي', 'infrastructure', '880e8400-e29b-41d4-a716-446655440005')
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
INSERT INTO public.challenges (id, title_ar, description_ar, challenge_type, status, priority_level, start_date, end_date, estimated_budget, sector_id, deputy_id, department_id, created_by) VALUES
('dd0e8400-e29b-41d4-a716-446655440001', 'تطوير نظام مراقبة المرضى الذكي', 'تطوير نظام متكامل لمراقبة المرضى عن بُعد باستخدام أجهزة إنترنت الأشياء والذكاء الاصطناعي لتحسين جودة الرعاية الصحية وتقليل التكاليف', 'innovation', 'active', 'high', '2024-02-01', '2024-08-01', 2500000, '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', null),
('dd0e8400-e29b-41d4-a716-446655440002', 'منصة التعلم التكيفي الذكية', 'إنشاء منصة تعليمية تستخدم الذكاء الاصطناعي لتقديم تجربة تعلم شخصية ومخصصة لكل طالب بناءً على قدراته واحتياجاته', 'digital_transformation', 'active', 'high', '2024-01-15', '2024-07-15', 3000000, '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440003', null),
('dd0e8400-e29b-41d4-a716-446655440003', 'حماية البنية التحتية السيبرانية', 'تطوير نظام متقدم لحماية البنية التحتية الحكومية من التهديدات السيبرانية باستخدام تقنيات الذكاء الاصطناعي والتعلم الآلي', 'security', 'active', 'critical', '2024-03-01', '2024-12-01', 5000000, '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440004', null),
('dd0e8400-e29b-41d4-a716-446655440004', 'تقنيات تخزين الطاقة المتطورة', 'البحث وتطوير تقنيات جديدة لتخزين الطاقة المتجددة بكفاءة عالية وتكلفة منخفضة لدعم أهداف رؤية 2030', 'research', 'planning', 'high', '2024-04-01', '2025-04-01', 8000000, '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440005', null),
('dd0e8400-e29b-41d4-a716-446655440005', 'نظام النقل الذكي المتكامل', 'تطوير نظام نقل ذكي شامل يربط جميع وسائل النقل في المدن السعودية لتحسين كفاءة المرور وتقليل الازدحام', 'innovation', 'draft', 'medium', '2024-06-01', '2025-06-01', 4500000, '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', null, null)
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

-- Seed innovators (assuming some users exist)
INSERT INTO public.innovators (id, specialization, experience_level, industry_focus, innovation_interests, status) VALUES
('11111111-1111-1111-1111-111111111111', 'artificial_intelligence', 'senior', 'healthcare', '{"AI", "machine_learning", "healthcare_tech"}', 'active'),
('22222222-2222-2222-2222-222222222222', 'software_engineering', 'mid_level', 'education', '{"web_development", "mobile_apps", "edtech"}', 'active'),
('33333333-3333-3333-3333-333333333333', 'cybersecurity', 'expert', 'government', '{"network_security", "encryption", "threat_detection"}', 'active'),
('44444444-4444-4444-4444-444444444444', 'renewable_energy', 'senior', 'energy', '{"solar_power", "energy_storage", "smart_grids"}', 'active'),
('55555555-5555-5555-5555-555555555555', 'iot_systems', 'mid_level', 'transportation', '{"IoT", "sensors", "smart_cities"}', 'active')
ON CONFLICT (id) DO NOTHING;

-- Seed ideas
INSERT INTO public.ideas (id, title_ar, description_ar, status, innovator_id, challenge_id, focus_question_id, solution_approach, implementation_plan, expected_impact, business_model) VALUES
('aaaa1111-1111-1111-1111-111111111111', 'نظام مراقبة حيوية ذكي للمرضى', 'نظام متطور يستخدم أجهزة استشعار ذكية وخوارزميات الذكاء الاصطناعي لمراقبة العلامات الحيوية للمرضى في الوقت الفعلي وإرسال تنبيهات فورية للطاقم الطبي عند اكتشاف أي تغيرات خطيرة', 'under_review', '11111111-1111-1111-1111-111111111111', 'dd0e8400-e29b-41d4-a716-446655440001', 'cc0e8400-e29b-41d4-a716-446655440001', 'استخدام أجهزة استشعار متقدمة مع خوارزميات التعلم الآلي', 'المرحلة الأولى: تطوير النموذج الأولي، المرحلة الثانية: التجريب السريري، المرحلة الثالثة: التطبيق الواسع', 'تحسين جودة الرعاية الصحية بنسبة 40% وتقليل الأخطاء الطبية', 'نموذج الاشتراك الشهري للمستشفيات'),
('bbbb2222-2222-2222-2222-222222222222', 'منصة التعلم التفاعلي المخصص', 'منصة تعليمية تستخدم الذكاء الاصطناعي لتحليل أسلوب تعلم كل طالب وتقديم محتوى مخصص يناسب قدراته وسرعة تعلمه', 'approved', '22222222-2222-2222-2222-222222222222', 'dd0e8400-e29b-41d4-a716-446655440002', 'cc0e8400-e29b-41d4-a716-446655440002', 'خوارزميات التعلم التكيفي والتحليل السلوكي', 'بناء المنصة باستخدام تقنيات الويب الحديثة وتطبيق الهاتف المحمول', 'زيادة كفاءة التعلم بنسبة 60% وتحسين النتائج الأكاديمية', 'نموذج الترخيص للمؤسسات التعليمية'),
('cccc3333-3333-3333-3333-333333333333', 'نظام الكشف المبكر للتهديدات السيبرانية', 'نظام متطور يستخدم الذكاء الاصطناعي والتعلم الآلي لتحليل حركة البيانات واكتشاف التهديدات السيبرانية قبل حدوثها', 'in_development', '33333333-3333-3333-3333-333333333333', 'dd0e8400-e29b-41d4-a716-446655440003', 'cc0e8400-e29b-41d4-a716-446655440003', 'تحليل السلوك الشاذ باستخدام الذكاء الاصطناعي', 'تطوير خوارزميات التعلم الآلي وبناء قاعدة بيانات التهديدات', 'حماية البنية التحتية الحكومية بنسبة 95%', 'نموذج الخدمة كحل متكامل للأمن السيبراني'),
('dddd4444-4444-4444-4444-444444444444', 'بطارية تخزين طاقة متطورة', 'تطوير تقنية بطارية جديدة عالية الكفاءة وطويلة المدى لتخزين الطاقة المتجددة', 'submitted', '44444444-4444-4444-4444-444444444444', 'dd0e8400-e29b-41d4-a716-446655440004', 'cc0e8400-e29b-41d4-a716-446655440004', 'استخدام مواد نانوية متقدمة في البطاريات', 'البحث والتطوير، النموذج الأولي، الاختبار الصناعي', 'زيادة كفاءة تخزين الطاقة بنسبة 300%', 'شراكة مع شركات الطاقة لتصنيع وتوزيع البطاريات'),
('eeee5555-5555-5555-5555-555555555555', 'شبكة أجهزة استشعار النقل الذكي', 'شبكة متكاملة من أجهزة الاستشعار والكاميرات الذكية لمراقبة حركة المرور وتحسين تدفق النقل في المدن', 'draft', '55555555-5555-5555-5555-555555555555', 'dd0e8400-e29b-41d4-a716-446655440005', 'cc0e8400-e29b-41d4-a716-446655440005', 'إنترنت الأشياء وتحليل البيانات الضخمة', 'نشر أجهزة الاستشعار، بناء منصة التحليل، تطبيق الحلول', 'تقليل الازدحام المروري بنسبة 50%', 'نموذج الشراكة مع البلديات والحكومات المحلية')
ON CONFLICT (id) DO NOTHING;

-- Seed partnership opportunities
INSERT INTO public.partnership_opportunities (id, title, title_ar, description, description_ar, partnership_type, requirements, requirements_ar, budget_range, deadline, status, sector_id, contact_email, benefits, benefits_ar) VALUES
('1111aaaa-1111-1111-1111-111111111111', 'Healthcare AI Innovation Partnership', 'شراكة الابتكار في الذكاء الاصطناعي للرعاية الصحية', 'Strategic partnership to develop AI-powered healthcare solutions for the Saudi market', 'شراكة استراتيجية لتطوير حلول الرعاية الصحية المدعومة بالذكاء الاصطناعي للسوق السعودي', 'strategic', 'AI expertise, healthcare domain knowledge, local presence', 'خبرة في الذكاء الاصطناعي، معرفة بمجال الرعاية الصحية، تواجد محلي', '5000000-15000000', '2024-06-30', 'open', '550e8400-e29b-41d4-a716-446655440001', 'health.partnerships@gov.sa', 'Access to government contracts, R&D funding, market entry support', 'الوصول للعقود الحكومية، تمويل البحث والتطوير، دعم دخول السوق'),
('2222bbbb-2222-2222-2222-222222222222', 'Smart Education Platform Development', 'تطوير منصة التعليم الذكي', 'Collaborative partnership to build next-generation educational platforms for Saudi schools and universities', 'شراكة تعاونية لبناء منصات تعليمية من الجيل القادم للمدارس والجامعات السعودية', 'collaborative', 'EdTech experience, Arabic language support, scalable architecture', 'خبرة في تقنيات التعليم، دعم اللغة العربية، هندسة قابلة للتوسع', '3000000-10000000', '2024-05-15', 'open', '550e8400-e29b-41d4-a716-446655440002', 'education.tech@gov.sa', 'Ministry endorsement, pilot program access, scaling opportunities', 'تأييد الوزارة، الوصول للبرامج التجريبية، فرص التوسع'),
('3333cccc-3333-3333-3333-333333333333', 'Cybersecurity Solutions Alliance', 'تحالف حلول الأمن السيبراني', 'Form an alliance to develop comprehensive cybersecurity solutions for critical infrastructure protection', 'تشكيل تحالف لتطوير حلول الأمن السيبراني الشاملة لحماية البنية التحتية الحيوية', 'alliance', 'Security clearance, proven track record, advanced threat detection capabilities', 'تصريح أمني، سجل حافل موثق، قدرات متقدمة في اكتشاف التهديدات', '10000000-25000000', '2024-08-01', 'review', '550e8400-e29b-41d4-a716-446655440003', 'cyber.security@gov.sa', 'Government contracts, security clearances, technology transfer', 'العقود الحكومية، التصاريح الأمنية، نقل التقنية'),
('4444dddd-4444-4444-4444-444444444444', 'Renewable Energy Storage Innovation', 'ابتكار تخزين الطاقة المتجددة', 'Research and development partnership for advanced energy storage technologies aligned with Vision 2030', 'شراكة البحث والتطوير لتقنيات تخزين الطاقة المتقدمة المتماشية مع رؤية 2030', 'research', 'Energy sector expertise, research capabilities, sustainability focus', 'خبرة في قطاع الطاقة، قدرات بحثية، تركيز على الاستدامة', '8000000-20000000', '2024-07-20', 'open', '550e8400-e29b-41d4-a716-446655440004', 'energy.innovation@gov.sa', 'NEOM project access, research grants, commercialization support', 'الوصول لمشروع نيوم، منح البحث، دعم التسويق'),
('5555eeee-5555-5555-5555-555555555555', 'Smart Transportation Ecosystem', 'نظام النقل الذكي البيئي', 'Develop integrated smart transportation solutions for Saudi smart cities initiative', 'تطوير حلول النقل الذكي المتكاملة لمبادرة المدن الذكية السعودية', 'ecosystem', 'IoT expertise, transportation systems, smart city experience', 'خبرة إنترنت الأشياء، أنظمة النقل، خبرة المدن الذكية', '6000000-18000000', '2024-09-30', 'open', '550e8400-e29b-41d4-a716-446655440005', 'transport.smart@gov.sa', 'Smart city project participation, infrastructure access, long-term contracts', 'المشاركة في مشاريع المدن الذكية، الوصول للبنية التحتية، العقود طويلة المدى')
ON CONFLICT (id) DO NOTHING;

-- Seed partnership applications
INSERT INTO public.partnership_applications (id, opportunity_id, applicant_name, applicant_email, organization_name, proposal_summary, proposal_summary_ar, application_status, submitted_at, reviewed_at, reviewer_notes) VALUES
('app11111-1111-1111-1111-111111111111', '1111aaaa-1111-1111-1111-111111111111', 'Dr. Sarah Tech', 'sarah.tech@medaipartners.com', 'MedAI Partners', 'Comprehensive AI solution for patient monitoring and diagnosis using advanced ML algorithms', 'حل شامل للذكاء الاصطناعي لمراقبة المرضى والتشخيص باستخدام خوارزميات التعلم الآلي المتقدمة', 'under_review', '2024-01-15 10:00:00', null, null),
('app22222-2222-2222-2222-222222222222', '2222bbbb-2222-2222-2222-222222222222', 'Ahmed Al-Rashid', 'ahmed@edutech-saudi.com', 'EduTech Saudi', 'Interactive learning platform with AR/VR capabilities and Arabic NLP integration', 'منصة التعلم التفاعلي مع قدرات الواقع المعزز والافتراضي وتكامل معالجة اللغة العربية الطبيعية', 'approved', '2024-01-20 14:30:00', '2024-02-05 09:15:00', 'Excellent proposal with strong technical foundation and clear implementation roadmap'),
('app33333-3333-3333-3333-333333333333', '3333cccc-3333-3333-3333-333333333333', 'CyberGuard Solutions', 'partnerships@cyberguard.sa', 'CyberGuard Solutions', 'Next-generation threat detection system using quantum-resistant encryption', 'نظام اكتشاف التهديدات من الجيل القادم باستخدام التشفير المقاوم للحوسبة الكمية', 'pending', '2024-02-01 16:45:00', null, null),
('app44444-4444-4444-4444-444444444444', '4444dddd-4444-4444-4444-444444444444', 'Dr. Fatima Energy', 'f.energy@greenpowersaudi.com', 'GreenPower Saudi', 'Revolutionary solid-state battery technology for large-scale energy storage', 'تقنية البطاريات الصلبة الثورية لتخزين الطاقة على نطاق واسع', 'rejected', '2024-01-25 11:20:00', '2024-02-10 13:30:00', 'Technology not yet mature enough for large-scale deployment. Recommend resubmission after prototype validation'),
('app55555-5555-5555-5555-555555555555', '5555eeee-5555-5555-5555-555555555555', 'Smart Mobility Co', 'info@smartmobility.sa', 'Smart Mobility Co', 'Integrated IoT platform for traffic management and autonomous vehicle support', 'منصة إنترنت الأشياء المتكاملة لإدارة المرور ودعم المركبات ذاتية القيادة', 'under_review', '2024-02-10 08:15:00', null, null)
ON CONFLICT (id) DO NOTHING;

-- Seed innovation team members
INSERT INTO public.innovation_team_members (id, full_name, email, role, department, expertise_areas, status, max_concurrent_projects, current_workload) VALUES
('team1111-1111-1111-1111-111111111111', 'Dr. Omar Al-Harbi', 'omar.harbi@innovation.gov.sa', 'senior_researcher', 'AI Research', '{"artificial_intelligence", "machine_learning", "healthcare_tech"}', 'active', 5, 3),
('team2222-2222-2222-2222-222222222222', 'Eng. Layla Al-Mutairi', 'layla.mutairi@innovation.gov.sa', 'project_manager', 'Digital Solutions', '{"project_management", "digital_transformation", "education_tech"}', 'active', 4, 2),
('team3333-3333-3333-3333-333333333333', 'Dr. Khalid Security', 'khalid.security@innovation.gov.sa', 'security_specialist', 'Cybersecurity', '{"cybersecurity", "network_security", "threat_analysis"}', 'active', 3, 2),
('team4444-4444-4444-4444-444444444444', 'Dr. Maha Energy', 'maha.energy@innovation.gov.sa', 'research_lead', 'Energy Innovation', '{"renewable_energy", "energy_storage", "sustainability"}', 'active', 4, 1),
('team5555-5555-5555-5555-555555555555', 'Eng. Turki Transport', 'turki.transport@innovation.gov.sa', 'technical_lead', 'Smart Cities', '{"IoT", "smart_transportation", "urban_planning"}', 'active', 5, 3)
ON CONFLICT (id) DO NOTHING;

-- Seed user roles
INSERT INTO public.user_roles (user_id, role, is_active) VALUES
('team1111-1111-1111-1111-111111111111', 'team_member', true),
('team2222-2222-2222-2222-222222222222', 'team_member', true),
('team3333-3333-3333-3333-333333333333', 'team_member', true),
('team4444-4444-4444-4444-444444444444', 'admin', true),
('team5555-5555-5555-5555-555555555555', 'team_member', true),
('11111111-1111-1111-1111-111111111111', 'innovator', true),
('22222222-2222-2222-2222-222222222222', 'innovator', true),
('33333333-3333-3333-3333-333333333333', 'expert', true),
('44444444-4444-4444-4444-444444444444', 'innovator', true),
('55555555-5555-5555-5555-555555555555', 'innovator', true)
ON CONFLICT (user_id, role) DO NOTHING;

-- Seed challenge experts assignments
INSERT INTO public.challenge_experts (challenge_id, expert_id, role_type, status) VALUES
('dd0e8400-e29b-41d4-a716-446655440001', '33333333-3333-3333-3333-333333333333', 'lead_evaluator', 'active'),
('dd0e8400-e29b-41d4-a716-446655440002', 'team1111-1111-1111-1111-111111111111', 'technical_reviewer', 'active'),
('dd0e8400-e29b-41d4-a716-446655440003', 'team3333-3333-3333-3333-333333333333', 'security_advisor', 'active')
ON CONFLICT (challenge_id, expert_id) DO NOTHING;

-- Seed challenge participants
INSERT INTO public.challenge_participants (challenge_id, user_id, participation_type, status) VALUES
('dd0e8400-e29b-41d4-a716-446655440001', '11111111-1111-1111-1111-111111111111', 'individual', 'active'),
('dd0e8400-e29b-41d4-a716-446655440002', '22222222-2222-2222-2222-222222222222', 'individual', 'active'),
('dd0e8400-e29b-41d4-a716-446655440003', '33333333-3333-3333-3333-333333333333', 'individual', 'active'),
('dd0e8400-e29b-41d4-a716-446655440004', '44444444-4444-4444-4444-444444444444', 'individual', 'registered')
ON CONFLICT (challenge_id, user_id) DO NOTHING;

-- Seed event participants
INSERT INTO public.event_participants (event_id, user_id, registration_type, attendance_status) VALUES
('ff0e8400-e29b-41d4-a716-446655440001', '11111111-1111-1111-1111-111111111111', 'self_registered', 'confirmed'),
('ff0e8400-e29b-41d4-a716-446655440001', '22222222-2222-2222-2222-222222222222', 'self_registered', 'confirmed'),
('ff0e8400-e29b-41d4-a716-446655440002', 'team2222-2222-2222-2222-222222222222', 'invited', 'confirmed'),
('ff0e8400-e29b-41d4-a716-446655440003', '33333333-3333-3333-3333-333333333333', 'self_registered', 'attended'),
('ff0e8400-e29b-41d4-a716-446655440004', '44444444-4444-4444-4444-444444444444', 'self_registered', 'confirmed')
ON CONFLICT (event_id, user_id) DO NOTHING;

-- Seed campaign partner links
INSERT INTO public.campaign_partner_links (campaign_id, partner_id) VALUES
('ee0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440002'),
('ee0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440003'),
('ee0e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440002'),
('ee0e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (campaign_id, partner_id) DO NOTHING;

-- Seed campaign stakeholder links
INSERT INTO public.campaign_stakeholder_links (campaign_id, stakeholder_id) VALUES
('ee0e8400-e29b-41d4-a716-446655440001', 'bb0e8400-e29b-41d4-a716-446655440001'),
('ee0e8400-e29b-41d4-a716-446655440001', 'bb0e8400-e29b-41d4-a716-446655440005'),
('ee0e8400-e29b-41d4-a716-446655440002', 'bb0e8400-e29b-41d4-a716-446655440002'),
('ee0e8400-e29b-41d4-a716-446655440003', 'bb0e8400-e29b-41d4-a716-446655440003')
ON CONFLICT (campaign_id, stakeholder_id) DO NOTHING;

-- Seed event focus question links
INSERT INTO public.event_focus_question_links (event_id, focus_question_id) VALUES
('ff0e8400-e29b-41d4-a716-446655440001', 'cc0e8400-e29b-41d4-a716-446655440001'),
('ff0e8400-e29b-41d4-a716-446655440002', 'cc0e8400-e29b-41d4-a716-446655440002'),
('ff0e8400-e29b-41d4-a716-446655440003', 'cc0e8400-e29b-41d4-a716-446655440003'),
('ff0e8400-e29b-41d4-a716-446655440004', 'cc0e8400-e29b-41d4-a716-446655440004')
ON CONFLICT (event_id, focus_question_id) DO NOTHING;

-- Seed challenge partners
INSERT INTO public.challenge_partners (challenge_id, partner_id, partnership_type, funding_amount, status) VALUES
('dd0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', 'funding_partner', 1000000, 'active'),
('dd0e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440002', 'technical_partner', 500000, 'active'),
('dd0e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440003', 'implementation_partner', 2000000, 'active')
ON CONFLICT (challenge_id, partner_id) DO NOTHING;

-- Seed evaluation criteria
INSERT INTO public.evaluation_criteria (name, name_ar, description, description_ar, category, weight, min_score, max_score, scoring_guide, scoring_guide_ar) VALUES
('Technical Feasibility', 'الجدوى التقنية', 'Assessment of technical viability and implementation complexity', 'تقييم الجدوى التقنية وتعقيد التنفيذ', 'technical', 25, 1, 10, 'Rate based on technical maturity and implementation difficulty', 'التقييم بناءً على النضج التقني وصعوبة التنفيذ'),
('Innovation Level', 'مستوى الابتكار', 'Evaluation of novelty and creative approach', 'تقييم الجدة والنهج الإبداعي', 'innovation', 20, 1, 10, 'Consider uniqueness and breakthrough potential', 'النظر في الفرادة وإمكانية الاختراق'),
('Market Potential', 'إمكانات السوق', 'Assessment of commercial viability and market size', 'تقييم الجدوى التجارية وحجم السوق', 'commercial', 20, 1, 10, 'Evaluate market demand and scalability', 'تقييم طلب السوق وقابلية التوسع'),
('Strategic Alignment', 'التوافق الاستراتيجي', 'Alignment with Vision 2030 and national priorities', 'التوافق مع رؤية 2030 والأولويات الوطنية', 'strategic', 25, 1, 10, 'Assess contribution to national goals', 'تقييم المساهمة في الأهداف الوطنية'),
('Team Capability', 'قدرة الفريق', 'Evaluation of team expertise and track record', 'تقييم خبرة الفريق وسجل الإنجازات', 'team', 10, 1, 10, 'Consider team experience and qualifications', 'النظر في خبرة الفريق والمؤهلات')
ON CONFLICT (name) DO NOTHING;

-- Seed some analytics data
INSERT INTO public.partnership_analytics (partner_id, metric_name, metric_value, period_start, period_end, metadata) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', 'active_partnerships', 3, '2024-01-01', '2024-01-31', '{"sector": "healthcare", "type": "strategic"}'),
('aa0e8400-e29b-41d4-a716-446655440002', 'research_collaborations', 5, '2024-01-01', '2024-01-31', '{"sector": "education", "type": "academic"}'),
('aa0e8400-e29b-41d4-a716-446655440003', 'innovation_projects', 2, '2024-01-01', '2024-01-31', '{"sector": "technology", "type": "corporate"}'),
('aa0e8400-e29b-41d4-a716-446655440001', 'funding_provided', 5000000, '2024-01-01', '2024-03-31', '{"currency": "SAR", "projects": 3}'),
('aa0e8400-e29b-41d4-a716-446655440002', 'publications_count', 12, '2024-01-01', '2024-01-31', '{"type": "research_papers", "impact_factor": 4.2}')
ON CONFLICT (id) DO NOTHING;