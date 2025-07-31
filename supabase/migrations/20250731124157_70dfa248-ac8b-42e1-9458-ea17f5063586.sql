-- Essential seeding data with correct column names

-- Seed key data for demonstration
INSERT INTO public.sectors (id, name, name_ar, description, vision_2030_alignment) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Health', 'الصحة', 'Healthcare and medical services sector', 'Quality of Life Program - Health'),
('550e8400-e29b-41d4-a716-446655440002', 'Education', 'التعليم', 'Education and training sector', 'Human Capacity Development Program'),
('550e8400-e29b-41d4-a716-446655440003', 'Technology', 'التقنية', 'Information technology and digital transformation', 'National Transformation Program')
ON CONFLICT (id) DO NOTHING;

-- Seed partners
INSERT INTO public.partners (id, name, name_ar, partner_type, contact_person, email, phone, address, capabilities, funding_capacity, collaboration_history, status) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', 'Saudi Aramco', 'أرامكو السعودية', 'corporate', 'Ahmed Al-Innovation', 'innovation@aramco.com', '+966-11-123-4567', 'Dhahran, Saudi Arabia', '{"R&D", "Technology", "Energy"}', 50000000, 'Multiple successful partnerships in energy innovation', 'active'),
('aa0e8400-e29b-41d4-a716-446655440002', 'King Abdullah University', 'جامعة الملك عبدالله', 'academic', 'Dr. Sarah Research', 'research@kaust.edu.sa', '+966-12-808-0000', 'Thuwal, Saudi Arabia', '{"Research", "AI", "Technology"}', 10000000, 'Leading research institution with extensive collaboration history', 'active'),
('aa0e8400-e29b-41d4-a716-446655440003', 'STC Solutions', 'حلول الاتصالات السعودية', 'corporate', 'Eng. Mohammed Tech', 'partnerships@stc.com.sa', '+966-11-455-0000', 'Riyadh, Saudi Arabia', '{"Telecommunications", "Digital Solutions", "IoT"}', 25000000, 'Pioneer in Saudi digital transformation projects', 'active')
ON CONFLICT (id) DO NOTHING;

-- Seed partnership opportunities with correct columns
INSERT INTO public.partnership_opportunities (id, title_ar, title_en, description_ar, description_en, opportunity_type, budget_min, budget_max, deadline, status, sector_id, contact_person, contact_email, requirements, benefits) VALUES
('1111aaaa-1111-1111-1111-111111111111', 'شراكة الابتكار في الذكاء الاصطناعي للرعاية الصحية', 'Healthcare AI Innovation Partnership', 'شراكة استراتيجية لتطوير حلول الرعاية الصحية المدعومة بالذكاء الاصطناعي للسوق السعودي', 'Strategic partnership to develop AI-powered healthcare solutions for the Saudi market', 'strategic', 5000000, 15000000, '2024-06-30', 'open', '550e8400-e29b-41d4-a716-446655440001', 'Dr. Health Partnership', 'health.partnerships@gov.sa', '{"ar": "خبرة في الذكاء الاصطناعي، معرفة بمجال الرعاية الصحية، تواجد محلي", "en": "AI expertise, healthcare domain knowledge, local presence"}', '{"ar": "الوصول للعقود الحكومية، تمويل البحث والتطوير، دعم دخول السوق", "en": "Access to government contracts, R&D funding, market entry support"}'),
('2222bbbb-2222-2222-2222-222222222222', 'تطوير منصة التعليم الذكي', 'Smart Education Platform Development', 'شراكة تعاونية لبناء منصات تعليمية من الجيل القادم للمدارس والجامعات السعودية', 'Collaborative partnership to build next-generation educational platforms for Saudi schools and universities', 'collaborative', 3000000, 10000000, '2024-05-15', 'open', '550e8400-e29b-41d4-a716-446655440002', 'Prof. Education Tech', 'education.tech@gov.sa', '{"ar": "خبرة في تقنيات التعليم، دعم اللغة العربية، هندسة قابلة للتوسع", "en": "EdTech experience, Arabic language support, scalable architecture"}', '{"ar": "تأييد الوزارة، الوصول للبرامج التجريبية، فرص التوسع", "en": "Ministry endorsement, pilot program access, scaling opportunities"}'),
('3333cccc-3333-3333-3333-333333333333', 'تحالف حلول الأمن السيبراني', 'Cybersecurity Solutions Alliance', 'تشكيل تحالف لتطوير حلول الأمن السيبراني الشاملة لحماية البنية التحتية الحيوية', 'Form an alliance to develop comprehensive cybersecurity solutions for critical infrastructure protection', 'alliance', 10000000, 25000000, '2024-08-01', 'review', '550e8400-e29b-41d4-a716-446655440003', 'Eng. Cyber Security', 'cyber.security@gov.sa', '{"ar": "تصريح أمني، سجل حافل موثق، قدرات متقدمة في اكتشاف التهديدات", "en": "Security clearance, proven track record, advanced threat detection capabilities"}', '{"ar": "العقود الحكومية، التصاريح الأمنية، نقل التقنية", "en": "Government contracts, security clearances, technology transfer"}')
ON CONFLICT (id) DO NOTHING;

-- Seed partnership applications
INSERT INTO public.partnership_applications (id, opportunity_id, applicant_name, applicant_email, organization_name, proposal_summary, proposal_summary_ar, application_status, submitted_at) VALUES
('app11111-1111-1111-1111-111111111111', '1111aaaa-1111-1111-1111-111111111111', 'Dr. Sarah Tech', 'sarah.tech@medaipartners.com', 'MedAI Partners', 'Comprehensive AI solution for patient monitoring and diagnosis using advanced ML algorithms', 'حل شامل للذكاء الاصطناعي لمراقبة المرضى والتشخيص باستخدام خوارزميات التعلم الآلي المتقدمة', 'under_review', '2024-01-15 10:00:00'),
('app22222-2222-2222-2222-222222222222', '2222bbbb-2222-2222-2222-222222222222', 'Ahmed Al-Rashid', 'ahmed@edutech-saudi.com', 'EduTech Saudi', 'Interactive learning platform with AR/VR capabilities and Arabic NLP integration', 'منصة التعلم التفاعلي مع قدرات الواقع المعزز والافتراضي وتكامل معالجة اللغة العربية الطبيعية', 'approved', '2024-01-20 14:30:00'),
('app33333-3333-3333-3333-333333333333', '3333cccc-3333-3333-3333-333333333333', 'CyberGuard Solutions', 'partnerships@cyberguard.sa', 'CyberGuard Solutions', 'Next-generation threat detection system using quantum-resistant encryption', 'نظام اكتشاف التهديدات من الجيل القادم باستخدام التشفير المقاوم للحوسبة الكمية', 'pending', '2024-02-01 16:45:00')
ON CONFLICT (id) DO NOTHING;

-- Seed partnership analytics
INSERT INTO public.partnership_analytics (partner_id, metric_name, metric_value, period_start, period_end, metadata) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', 'active_partnerships', 3, '2024-01-01', '2024-01-31', '{"sector": "healthcare", "type": "strategic"}'),
('aa0e8400-e29b-41d4-a716-446655440002', 'research_collaborations', 5, '2024-01-01', '2024-01-31', '{"sector": "education", "type": "academic"}'),
('aa0e8400-e29b-41d4-a716-446655440003', 'innovation_projects', 2, '2024-01-01', '2024-01-31', '{"sector": "technology", "type": "corporate"}')
ON CONFLICT (id) DO NOTHING;