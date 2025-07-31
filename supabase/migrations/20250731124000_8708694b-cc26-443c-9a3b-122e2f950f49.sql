-- Core seeding data with correct column names

-- Seed sectors
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
('660e8400-e29b-41d4-a716-446655440003', 'Digital Transformation Deputy', 'نائب التحول الرقمي', 'Eng. Mohammed Al-Otaibi', 'mohammed.otaibi@tech.gov.sa', '550e8400-e29b-41d4-a716-446655440003')
ON CONFLICT (id) DO NOTHING;

-- Seed partners
INSERT INTO public.partners (id, name, name_ar, partner_type, contact_person, email, phone, address, capabilities, funding_capacity, collaboration_history, status) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', 'Saudi Aramco', 'أرامكو السعودية', 'corporate', 'Ahmed Al-Innovation', 'innovation@aramco.com', '+966-11-123-4567', 'Dhahran, Saudi Arabia', '{"R&D", "Technology", "Energy"}', 50000000, 'Multiple successful partnerships in energy innovation', 'active'),
('aa0e8400-e29b-41d4-a716-446655440002', 'King Abdullah University', 'جامعة الملك عبدالله', 'academic', 'Dr. Sarah Research', 'research@kaust.edu.sa', '+966-12-808-0000', 'Thuwal, Saudi Arabia', '{"Research", "AI", "Technology"}', 10000000, 'Leading research institution with extensive collaboration history', 'active'),
('aa0e8400-e29b-41d4-a716-446655440003', 'STC Solutions', 'حلول الاتصالات السعودية', 'corporate', 'Eng. Mohammed Tech', 'partnerships@stc.com.sa', '+966-11-455-0000', 'Riyadh, Saudi Arabia', '{"Telecommunications", "Digital Solutions", "IoT"}', 25000000, 'Pioneer in Saudi digital transformation projects', 'active'),
('aa0e8400-e29b-41d4-a716-446655440004', 'Riyadh Techno Valley', 'وادي الرياض للتقنية', 'incubator', 'Layla Al-Startup', 'info@rtv.sa', '+966-11-299-9999', 'Riyadh, Saudi Arabia', '{"Incubation", "Startups", "Innovation"}', 5000000, 'Successful startup ecosystem development', 'active'),
('aa0e8400-e29b-41d4-a716-446655440005', 'NEOM Tech', 'نيوم للتقنية', 'government', 'Dr. Khalid Future', 'tech@neom.com', '+966-50-123-4567', 'NEOM, Saudi Arabia', '{"Future Cities", "AI", "Sustainability"}', 100000000, 'Mega project with global innovation focus', 'active')
ON CONFLICT (id) DO NOTHING;

-- Seed stakeholders (using correct column names)
INSERT INTO public.stakeholders (id, name, organization, position, email, stakeholder_type, influence_level, interest_level, engagement_status, notes) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', 'Dr. Abdullah Al-Rasheed', 'Ministry of Health', 'Chief Innovation Officer', 'abdullah.rasheed@moh.gov.sa', 'government', 'high', 'high', 'active', 'Key decision maker for health innovation initiatives'),
('bb0e8400-e29b-41d4-a716-446655440002', 'Prof. Noura Al-Fayez', 'King Saud University', 'Dean of Computer Science', 'nfayez@ksu.edu.sa', 'academic', 'high', 'high', 'active', 'Leading academic in AI and technology research'),
('bb0e8400-e29b-41d4-a716-446655440003', 'Eng. Turki Al-Dakhil', 'MCIT', 'Director of Digital Innovation', 'turki.dakhil@mcit.gov.sa', 'government', 'high', 'high', 'active', 'Strategic partner for digital transformation projects'),
('bb0e8400-e29b-41d4-a716-446655440004', 'Dr. Mona Al-Munajjed', 'KACST', 'Research Director', 'mona.munajjed@kacst.edu.sa', 'research', 'medium', 'high', 'interested', 'Research collaboration opportunities'),
('bb0e8400-e29b-41d4-a716-446655440005', 'Mr. Salman Al-Rajhi', 'Saudi Aramco', 'Innovation Manager', 'salman.rajhi@aramco.com', 'private', 'medium', 'high', 'active', 'Corporate innovation partnerships')
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
INSERT INTO public.partnership_applications (id, opportunity_id, applicant_name, applicant_email, organization_name, proposal_summary, proposal_summary_ar, application_status, submitted_at) VALUES
('app11111-1111-1111-1111-111111111111', '1111aaaa-1111-1111-1111-111111111111', 'Dr. Sarah Tech', 'sarah.tech@medaipartners.com', 'MedAI Partners', 'Comprehensive AI solution for patient monitoring and diagnosis using advanced ML algorithms', 'حل شامل للذكاء الاصطناعي لمراقبة المرضى والتشخيص باستخدام خوارزميات التعلم الآلي المتقدمة', 'under_review', '2024-01-15 10:00:00'),
('app22222-2222-2222-2222-222222222222', '2222bbbb-2222-2222-2222-222222222222', 'Ahmed Al-Rashid', 'ahmed@edutech-saudi.com', 'EduTech Saudi', 'Interactive learning platform with AR/VR capabilities and Arabic NLP integration', 'منصة التعلم التفاعلي مع قدرات الواقع المعزز والافتراضي وتكامل معالجة اللغة العربية الطبيعية', 'approved', '2024-01-20 14:30:00'),
('app33333-3333-3333-3333-333333333333', '3333cccc-3333-3333-3333-333333333333', 'CyberGuard Solutions', 'partnerships@cyberguard.sa', 'CyberGuard Solutions', 'Next-generation threat detection system using quantum-resistant encryption', 'نظام اكتشاف التهديدات من الجيل القادم باستخدام التشفير المقاوم للحوسبة الكمية', 'pending', '2024-02-01 16:45:00'),
('app44444-4444-4444-4444-444444444444', '4444dddd-4444-4444-4444-444444444444', 'Dr. Fatima Energy', 'f.energy@greenpowersaudi.com', 'GreenPower Saudi', 'Revolutionary solid-state battery technology for large-scale energy storage', 'تقنية البطاريات الصلبة الثورية لتخزين الطاقة على نطاق واسع', 'rejected', '2024-01-25 11:20:00'),
('app55555-5555-5555-5555-555555555555', '5555eeee-5555-5555-5555-555555555555', 'Smart Mobility Co', 'info@smartmobility.sa', 'Smart Mobility Co', 'Integrated IoT platform for traffic management and autonomous vehicle support', 'منصة إنترنت الأشياء المتكاملة لإدارة المرور ودعم المركبات ذاتية القيادة', 'under_review', '2024-02-10 08:15:00')
ON CONFLICT (id) DO NOTHING;

-- Seed partnership analytics
INSERT INTO public.partnership_analytics (partner_id, metric_name, metric_value, period_start, period_end, metadata) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', 'active_partnerships', 3, '2024-01-01', '2024-01-31', '{"sector": "healthcare", "type": "strategic"}'),
('aa0e8400-e29b-41d4-a716-446655440002', 'research_collaborations', 5, '2024-01-01', '2024-01-31', '{"sector": "education", "type": "academic"}'),
('aa0e8400-e29b-41d4-a716-446655440003', 'innovation_projects', 2, '2024-01-01', '2024-01-31', '{"sector": "technology", "type": "corporate"}'),
('aa0e8400-e29b-41d4-a716-446655440001', 'funding_provided', 5000000, '2024-01-01', '2024-03-31', '{"currency": "SAR", "projects": 3}'),
('aa0e8400-e29b-41d4-a716-446655440002', 'publications_count', 12, '2024-01-01', '2024-01-31', '{"type": "research_papers", "impact_factor": 4.2}')
ON CONFLICT (id) DO NOTHING;