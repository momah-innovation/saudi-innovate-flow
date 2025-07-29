-- Comprehensive seed data for all tables with realistic linked data

-- 1. Organizational Structure
INSERT INTO departments (id, name, name_ar, department_head, budget_allocation) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Digital Transformation', 'التحول الرقمي', 'أحمد محمد العلي', 15000000),
('550e8400-e29b-41d4-a716-446655440002', 'Innovation Strategy', 'استراتيجية الابتكار', 'فاطمة سعد الحربي', 12000000),
('550e8400-e29b-41d4-a716-446655440003', 'Business Development', 'تطوير الأعمال', 'خالد عبدالله القحطاني', 8000000),
('550e8400-e29b-41d4-a716-446655440004', 'Research & Development', 'البحث والتطوير', 'نورا عبدالرحمن المطيري', 20000000);

INSERT INTO sectors (id, name, name_ar, vision_2030_program, strategic_objectives) VALUES 
('550e8400-e29b-41d4-a716-446655440010', 'Healthcare Innovation', 'الابتكار الصحي', 'برنامج التحول الصحي', ARRAY['تحسين جودة الرعاية الصحية', 'تطوير التقنيات الطبية', 'الوقاية والصحة العامة']),
('550e8400-e29b-41d4-a716-446655440011', 'Smart Cities', 'المدن الذكية', 'برنامج جودة الحياة', ARRAY['تطوير البنية التحتية الذكية', 'تحسين الخدمات المدنية', 'الاستدامة البيئية']),
('550e8400-e29b-41d4-a716-446655440012', 'Financial Technology', 'التقنية المالية', 'برنامج تطوير القطاع المالي', ARRAY['الشمول المالي', 'الأمان السيبراني', 'الابتكار المالي']),
('550e8400-e29b-41d4-a716-446655440013', 'Education Technology', 'تقنية التعليم', 'برنامج تنمية القدرات البشرية', ARRAY['التعلم الرقمي', 'تطوير المناهج', 'التدريب المهني']);

INSERT INTO deputies (id, name, name_ar, deputy_minister, contact_email, sector_id) VALUES 
('550e8400-e29b-41d4-a716-446655440020', 'Digital Innovation Deputy', 'وكالة الابتكار الرقمي', 'د. سارة محمد الغامدي', 'deputy.digital@momah.gov.sa', '550e8400-e29b-41d4-a716-446655440010'),
('550e8400-e29b-41d4-a716-446655440021', 'Strategic Development Deputy', 'وكالة التطوير الاستراتيجي', 'م. محمد عبدالعزيز النفيعي', 'deputy.strategy@momah.gov.sa', '550e8400-e29b-41d4-a716-446655440011');

INSERT INTO domains (id, name, name_ar, specialization, domain_lead, department_id) VALUES 
('550e8400-e29b-41d4-a716-446655440030', 'Artificial Intelligence', 'الذكاء الاصطناعي', 'تطوير حلول الذكاء الاصطناعي للقطاع الحكومي', 'د. عمر حسن الشهري', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440031', 'Cybersecurity', 'الأمن السيبراني', 'حماية الأنظمة والبيانات الحكومية', 'م. ليلى أحمد باعشن', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440032', 'Data Analytics', 'تحليل البيانات', 'استخراج الرؤى من البيانات الحكومية', 'د. يوسف عبدالله الدوسري', '550e8400-e29b-41d4-a716-446655440002');

INSERT INTO sub_domains (id, name, name_ar, technical_focus, innovation_potential, domain_id) VALUES 
('550e8400-e29b-41d4-a716-446655440040', 'Machine Learning', 'التعلم الآلي', 'خوارزميات التعلم الآلي والشبكات العصبية', 'عالي', '550e8400-e29b-41d4-a716-446655440030'),
('550e8400-e29b-41d4-a716-446655440041', 'Natural Language Processing', 'معالجة اللغة الطبيعية', 'فهم ومعالجة النصوص العربية', 'عالي جداً', '550e8400-e29b-41d4-a716-446655440030'),
('550e8400-e29b-41d4-a716-446655440042', 'Threat Detection', 'كشف التهديدات', 'أنظمة كشف التهديدات المتقدمة', 'متوسط', '550e8400-e29b-41d4-a716-446655440031');

INSERT INTO services (id, name, name_ar, service_type, digital_maturity_level, sub_domain_id) VALUES 
('550e8400-e29b-41d4-a716-446655440050', 'AI Chatbot Platform', 'منصة المحادثة الذكية', 'Platform', 'متقدم', '550e8400-e29b-41d4-a716-446655440040'),
('550e8400-e29b-41d4-a716-446655440051', 'Document Analysis System', 'نظام تحليل المستندات', 'Application', 'متوسط', '550e8400-e29b-41d4-a716-446655440041'),
('550e8400-e29b-41d4-a716-446655440052', 'Security Monitoring Dashboard', 'لوحة مراقبة الأمان', 'Dashboard', 'متقدم', '550e8400-e29b-41d4-a716-446655440042');

-- 2. Partners and Stakeholders
INSERT INTO partners (id, name, name_ar, partner_type, sector, contact_person, contact_email, phone, partnership_level, status) VALUES 
('550e8400-e29b-41d4-a716-446655440060', 'Saudi Aramco', 'أرامكو السعودية', 'corporate', 'Energy', 'أحمد السالم', 'ahmed.salem@aramco.com', '+966501234567', 'strategic', 'active'),
('550e8400-e29b-41d4-a716-446655440061', 'King Abdulaziz University', 'جامعة الملك عبدالعزيز', 'academic', 'Education', 'د. فهد الأحمدي', 'fahd.ahmadi@kau.edu.sa', '+966502345678', 'strategic', 'active'),
('550e8400-e29b-41d4-a716-446655440062', 'Microsoft Saudi Arabia', 'مايكروسوفت السعودية', 'technology', 'Technology', 'سارة محمد', 'sarah.mohammed@microsoft.com', '+966503456789', 'operational', 'active'),
('550e8400-e29b-41d4-a716-446655440063', 'STC Solutions', 'حلول الاتصالات السعودية', 'technology', 'Telecommunications', 'عبدالله القرني', 'abdullah.qarni@stc.com.sa', '+966504567890', 'operational', 'active');

INSERT INTO stakeholders (id, name, name_ar, organization, position, email, phone, category, influence_level, engagement_level, notes) VALUES 
('550e8400-e29b-41d4-a716-446655440070', 'Dr. Khalid Al-Falih', 'د. خالد الفالح', 'Ministry of Energy', 'Minister', 'minister@moenergy.gov.sa', '+966505678901', 'government', 'high', 'high', 'وزير الطاقة - شريك استراتيجي في مشاريع الطاقة المتجددة'),
('550e8400-e29b-41d4-a716-446655440071', 'Eng. Abdullah Al-Swaha', 'م. عبدالله السواحة', 'Ministry of Communications', 'Minister', 'minister@mcit.gov.sa', '+966506789012', 'government', 'high', 'high', 'وزير الاتصالات - شريك في مشاريع التحول الرقمي'),
('550e8400-e29b-41d4-a716-446655440072', 'Dr. Bandar Al-Knawy', 'د. بندر الكناوي', 'Ministry of Health', 'Deputy Minister', 'deputy@moh.gov.sa', '+966507890123', 'government', 'medium', 'high', 'نائب وزير الصحة - مهتم بالابتكار الصحي'),
('550e8400-e29b-41d4-a716-446655440073', 'Prof. Ahmed Al-Saif', 'أ.د. أحمد السيف', 'King Saud University', 'Vice Rector', 'vicerector@ksu.edu.sa', '+966508901234', 'academic', 'medium', 'medium', 'وكيل جامعة الملك سعود - خبير في التقنيات الناشئة');

-- 3. Challenges
INSERT INTO challenges (id, title_ar, description_ar, challenge_type, priority_level, status, sensitivity_level, vision_2030_goal, start_date, end_date, estimated_budget, sector_id, department_id, deputy_id, domain_id, sub_domain_id, service_id) VALUES 
('550e8400-e29b-41d4-a716-446655440080', 'تطوير نظام ذكي لإدارة المرور في المدن', 'تطوير نظام ذكي متكامل لإدارة حركة المرور في المدن الكبيرة باستخدام الذكاء الاصطناعي وإنترنت الأشياء لتقليل الازدحام وتحسين السلامة المرورية', 'technical', 'high', 'active', 'normal', 'تحسين جودة الحياة في المدن وتقليل التلوث', '2024-01-15', '2024-12-31', 5000000, '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440040', null),
('550e8400-e29b-41d4-a716-446655440081', 'منصة التشخيص الطبي بالذكاء الاصطناعي', 'تطوير منصة ذكية للتشخيص الطبي المبكر للأمراض المزمنة باستخدام تقنيات الذكاء الاصطناعي وتحليل الصور الطبية', 'innovation', 'critical', 'active', 'sensitive', 'تحسين جودة الرعاية الصحية وتقليل التكاليف', '2024-02-01', '2025-01-31', 8000000, '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440040', null),
('550e8400-e29b-41d4-a716-446655440082', 'نظام الأمان السيبراني المتقدم للقطاع المالي', 'تطوير نظام متقدم لحماية المؤسسات المالية من التهديدات السيبرانية باستخدام تقنيات الذكاء الاصطناعي والتعلم الآلي', 'technical', 'critical', 'planning', 'confidential', 'تعزيز الأمان المالي والثقة في النظام المصرفي', '2024-03-01', '2025-02-28', 12000000, '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440042', null),
('550e8400-e29b-41d4-a716-446655440083', 'منصة التعلم التكيفي الذكية', 'تطوير منصة تعليمية ذكية تتكيف مع احتياجات كل طالب باستخدام الذكاء الاصطناعي وتحليل البيانات التعليمية', 'innovation', 'high', 'active', 'normal', 'تطوير التعليم وإعداد جيل المستقبل', '2024-01-20', '2024-11-30', 6000000, '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440041', null);

-- 4. Focus Questions
INSERT INTO focus_questions (id, question_text_ar, question_type, is_sensitive, order_sequence, challenge_id) VALUES 
('550e8400-e29b-41d4-a716-446655440090', 'كيف يمكن استخدام البيانات المرورية في الوقت الفعلي لتحسين تدفق حركة المرور؟', 'technical', false, 1, '550e8400-e29b-41d4-a716-446655440080'),
('550e8400-e29b-41d4-a716-446655440091', 'ما هي أفضل الخوارزميات للتنبؤ بالازدحام المروري قبل حدوثه؟', 'technical', false, 2, '550e8400-e29b-41d4-a716-446655440080'),
('550e8400-e29b-41d4-a716-446655440092', 'كيف يمكن دمج أنظمة النقل العام مع نظام إدارة المرور الذكي؟', 'strategic', false, 3, '550e8400-e29b-41d4-a716-446655440080'),
('550e8400-e29b-41d4-a716-446655440093', 'ما هي أنواع البيانات الطبية المطلوبة لتدريب نماذج التشخيص الذكي؟', 'technical', true, 1, '550e8400-e29b-41d4-a716-446655440081'),
('550e8400-e29b-41d4-a716-446655440094', 'كيف يمكن ضمان خصوصية وأمان البيانات الطبية في منصة التشخيص؟', 'security', true, 2, '550e8400-e29b-41d4-a716-446655440081'),
('550e8400-e29b-41d4-a716-446655440095', 'ما هي معايير دقة التشخيص المطلوبة للحصول على الموافقات الطبية؟', 'regulatory', true, 3, '550e8400-e29b-41d4-a716-446655440081'),
('550e8400-e29b-41d4-a716-446655440096', 'كيف يمكن كشف أنماط الهجمات السيبرانية الجديدة باستخدام التعلم الآلي؟', 'technical', true, 1, '550e8400-e29b-41d4-a716-446655440082'),
('550e8400-e29b-41d4-a716-446655440097', 'ما هي أفضل الممارسات لحماية البيانات المالية الحساسة؟', 'security', true, 2, '550e8400-e29b-41d4-a716-446655440082'),
('550e8400-e29b-41d4-a716-446655440098', 'كيف يمكن تطوير نظام تعلم يتكيف مع أساليب التعلم المختلفة للطلاب؟', 'pedagogical', false, 1, '550e8400-e29b-41d4-a716-446655440083'),
('550e8400-e29b-41d4-a716-446655440099', 'ما هي مؤشرات الأداء المناسبة لقياس فعالية التعلم التكيفي؟', 'analytical', false, 2, '550e8400-e29b-41d4-a716-446655440083');

-- 5. Experts
INSERT INTO experts (id, user_id, expertise_areas, experience_years, expert_level, availability_status, education_background, certifications, consultation_rate) VALUES 
('550e8400-e29b-41d4-a716-446655440100', gen_random_uuid(), ARRAY['Artificial Intelligence', 'Machine Learning', 'Computer Vision'], 15, 'senior', 'available', 'PhD in Computer Science from MIT, MSc in AI from Stanford', ARRAY['AWS Certified ML Specialist', 'Google Cloud AI Certified', 'Microsoft AI Expert'], 2500),
('550e8400-e29b-41d4-a716-446655440101', gen_random_uuid(), ARRAY['Cybersecurity', 'Network Security', 'Penetration Testing'], 12, 'senior', 'busy', 'MSc in Cybersecurity from Carnegie Mellon, BSc in Computer Engineering', ARRAY['CISSP', 'CEH', 'CISM', 'Security+'], 2000),
('550e8400-e29b-41d4-a716-446655440102', gen_random_uuid(), ARRAY['Healthcare Technology', 'Medical Imaging', 'Digital Health'], 10, 'mid', 'available', 'MD from Harvard Medical School, MSc in Biomedical Engineering', ARRAY['Board Certified Radiologist', 'Digital Health Certified'], 1800),
('550e8400-e29b-41d4-a716-446655440103', gen_random_uuid(), ARRAY['Urban Planning', 'Smart Cities', 'IoT Systems'], 8, 'mid', 'available', 'PhD in Urban Planning from MIT, MSc in Civil Engineering', ARRAY['Smart Cities Expert Certificate', 'IoT Professional'], 1500),
('550e8400-e29b-41d4-a716-446655440104', gen_random_uuid(), ARRAY['Educational Technology', 'Learning Analytics', 'Curriculum Design'], 9, 'mid', 'busy', 'PhD in Educational Technology, MSc in Computer Science', ARRAY['Educational Technology Specialist', 'Learning Analytics Certified'], 1600);

-- 6. Innovators
INSERT INTO innovators (id, user_id, innovation_areas, career_stage, academic_background, previous_innovations, contact_preferences) VALUES 
('550e8400-e29b-41d4-a716-446655440110', gen_random_uuid(), ARRAY['AI Solutions', 'Data Analytics'], 'mid_career', 'MSc Computer Science', 3, 'email'),
('550e8400-e29b-41d4-a716-446655440111', gen_random_uuid(), ARRAY['Healthcare Tech', 'Mobile Apps'], 'early_career', 'BSc Biomedical Engineering', 1, 'phone'),
('550e8400-e29b-41d4-a716-446655440112', gen_random_uuid(), ARRAY['Smart Cities', 'IoT'], 'senior', 'PhD Urban Planning', 7, 'email'),
('550e8400-e29b-41d4-a716-446655440113', gen_random_uuid(), ARRAY['Fintech', 'Blockchain'], 'mid_career', 'MSc Finance & Technology', 4, 'both'),
('550e8400-e29b-41d4-a716-446655440114', gen_random_uuid(), ARRAY['EdTech', 'VR/AR'], 'early_career', 'BSc Education Technology', 2, 'email');

-- 7. Campaigns
INSERT INTO campaigns (id, title_ar, description_ar, theme, status, start_date, end_date, registration_deadline, target_participants, target_ideas, budget, campaign_manager_id, challenge_id, department_id, deputy_id, sector_id, success_metrics) VALUES 
('550e8400-e29b-41d4-a716-446655440120', 'حملة الابتكار في المدن الذكية 2024', 'حملة شاملة لجمع الأفكار الابتكارية في مجال تطوير المدن الذكية والحلول التقنية المتقدمة', 'Smart Cities', 'active', '2024-01-15', '2024-06-30', '2024-05-15', 500, 200, 3000000, null, '550e8400-e29b-41d4-a716-446655440080', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440011', 'عدد الأفكار المقدمة، جودة الحلول، نسبة التنفيذ'),
('550e8400-e29b-41d4-a716-446655440121', 'مبادرة الابتكار الصحي', 'مبادرة لتطوير حلول مبتكرة في القطاع الصحي باستخدام التقنيات الحديثة', 'Healthcare Innovation', 'active', '2024-02-01', '2024-08-31', '2024-07-01', 300, 150, 5000000, null, '550e8400-e29b-41d4-a716-446655440081', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440010', 'عدد المشاريع المطورة، التأثير على المرضى، التوفير في التكاليف'),
('550e8400-e29b-41d4-a716-446655440122', 'هاكاثون الأمن السيبراني', 'هاكاثون متخصص في تطوير حلول الأمن السيبراني للقطاع المالي', 'Cybersecurity', 'planning', '2024-03-01', '2024-03-03', '2024-02-20', 100, 50, 1000000, null, '550e8400-e29b-41d4-a716-446655440082', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440012', 'عدد الحلول المطورة، جودة الحماية، قابلية التطبيق'),
('550e8400-e29b-41d4-a716-446655440123', 'مسابقة التعلم الذكي', 'مسابقة لتطوير حلول تعليمية ذكية تعتمد على الذكاء الاصطناعي', 'Educational Technology', 'active', '2024-01-20', '2024-07-20', '2024-06-01', 400, 180, 2500000, null, '550e8400-e29b-41d4-a716-446655440083', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440013', 'تحسن نتائج التعلم، رضا المستخدمين، انتشار الحلول');

-- 8. Events
INSERT INTO events (id, title_ar, description_ar, event_type, format, status, event_date, start_time, end_time, location, virtual_link, max_participants, registered_participants, actual_participants, budget, event_manager_id, campaign_id, challenge_id, sector_id) VALUES 
('550e8400-e29b-41d4-a716-446655440130', 'ورشة عمل تطوير المدن الذكية', 'ورشة عمل تفاعلية لمناقشة أحدث التقنيات في تطوير المدن الذكية', 'workshop', 'hybrid', 'scheduled', '2024-03-15', '09:00:00', '17:00:00', 'مركز الملك عبدالعزيز للمؤتمرات', 'https://meet.momah.gov.sa/smart-cities-workshop', 150, 120, 0, 150000, null, '550e8400-e29b-41d4-a716-446655440120', '550e8400-e29b-41d4-a716-446655440080', '550e8400-e29b-41d4-a716-446655440011'),
('550e8400-e29b-41d4-a716-446655440131', 'مؤتمر الابتكار الصحي السعودي', 'مؤتمر دولي لعرض أحدث الابتكارات في القطاع الصحي', 'conference', 'in_person', 'scheduled', '2024-04-20', '08:00:00', '18:00:00', 'مركز الرياض للمعارض والمؤتمرات', null, 500, 350, 0, 800000, null, '550e8400-e29b-41d4-a716-446655440121', '550e8400-e29b-41d4-a716-446655440081', '550e8400-e29b-41d4-a716-446655440010'),
('550e8400-e29b-41d4-a716-446655440132', 'هاكاثون الأمن السيبراني 48 ساعة', 'هاكاثون مكثف لتطوير حلول الأمن السيبراني', 'hackathon', 'in_person', 'scheduled', '2024-03-01', '18:00:00', '18:00:00', 'تكوين - مساحة العمل التقني', null, 100, 80, 0, 300000, null, '550e8400-e29b-41d4-a716-446655440122', '550e8400-e29b-41d4-a716-446655440082', '550e8400-e29b-41d4-a716-446655440012'),
('550e8400-e29b-41d4-a716-446655440133', 'ندوة التعلم التكيفي والذكاء الاصطناعي', 'ندوة علمية حول استخدام الذكاء الاصطناعي في التعليم', 'seminar', 'virtual', 'scheduled', '2024-02-25', '14:00:00', '17:00:00', 'افتراضي', 'https://meet.momah.gov.sa/adaptive-learning-seminar', 200, 180, 0, 50000, null, '550e8400-e29b-41d4-a716-446655440123', '550e8400-e29b-41d4-a716-446655440083', '550e8400-e29b-41d4-a716-446655440013');

-- 9. Ideas
INSERT INTO ideas (id, title_ar, description_ar, solution_approach, implementation_plan, maturity_level, expected_impact, estimated_cost, development_timeline, required_resources, risk_assessment, status, innovator_id, challenge_id, focus_question_id, campaign_id) VALUES 
('550e8400-e29b-41d4-a716-446655440140', 'نظام إشارات المرور التكيفي بالذكاء الاصطناعي', 'نظام ذكي لإدارة إشارات المرور يتكيف مع كثافة الحركة في الوقت الفعلي باستخدام كاميرات ذكية وخوارزميات التعلم الآلي', 'استخدام كاميرات عالية الدقة مع معالجة الصور بالذكاء الاصطناعي لتحليل كثافة المرور وتعديل توقيت الإشارات تلقائياً', 'المرحلة الأولى: تطوير النموذج الأولي (3 أشهر)\nالمرحلة الثانية: الاختبار التجريبي (4 أشهر)\nالمرحلة الثالثة: التطبيق الواسع (6 أشهر)', 'prototype', 'تقليل زمن الانتظار بنسبة 40% وتحسين تدفق المرور', 2500000, '13 months', 'فريق من 8 مطورين، معدات كاميرات ذكية، خوادم معالجة', 'متوسط - يتطلب تدريب المشغلين واختبارات مكثفة', 'under_review', '550e8400-e29b-41d4-a716-446655440110', '550e8400-e29b-41d4-a716-446655440080', '550e8400-e29b-41d4-a716-446655440090', '550e8400-e29b-41d4-a716-446655440120'),
('550e8400-e29b-41d4-a716-446655440141', 'تطبيق التشخيص المبكر للسكري باستخدام الصور', 'تطبيق محمول يستخدم الذكاء الاصطناعي لتحليل صور شبكية العين للكشف المبكر عن مرض السكري', 'تدريب نماذج الشبكات العصبية على آلاف صور الشبكية المشخصة طبياً لتطوير خوارزمية دقيقة للكشف المبكر', 'التطوير التقني (6 أشهر)\nالاختبارات السريرية (8 أشهر)\nالحصول على الموافقات الطبية (4 أشهر)\nالإطلاق التجاري (2 أشهر)', 'concept', 'زيادة معدل الكشف المبكر بنسبة 60% وتقليل التكاليف العلاجية', 4000000, '20 months', 'فريق طبي وتقني، قاعدة بيانات طبية، معدات تصوير متخصصة', 'عالي - يتطلب موافقات طبية ودقة عالية جداً', 'submitted', '550e8400-e29b-41d4-a716-446655440111', '550e8400-e29b-41d4-a716-446655440081', '550e8400-e29b-41d4-a716-446655440093', '550e8400-e29b-41d4-a716-446655440121'),
('550e8400-e29b-41d4-a716-446655440142', 'منصة كشف التهديدات السيبرانية بالتعلم الآلي', 'منصة متقدمة تستخدم التعلم الآلي لكشف أنماط الهجمات السيبرانية الجديدة والمتطورة في الوقت الفعلي', 'تطوير خوارزميات تعلم آلي تحلل سلوك الشبكة وتكتشف الشذوذ والأنماط المشبوهة باستخدام Big Data والذكاء الاصطناعي', 'بناء البنية التحتية (4 أشهر)\nتطوير الخوارزميات (6 أشهر)\nالاختبارات الأمنية (3 أشهر)\nالتشغيل التجريبي (3 أشهر)', 'pilot', 'تحسين كشف التهديدات بنسبة 85% وتقليل زمن الاستجابة إلى أقل من دقيقة', 6000000, '16 months', 'خبراء أمن سيبراني، مهندسو بيانات، أجهزة خادمة عالية الأداء', 'عالي - التعامل مع بيانات حساسة وتهديدات متطورة', 'approved', '550e8400-e29b-41d4-a716-446655440112', '550e8400-e29b-41d4-a716-446655440082', '550e8400-e29b-41d4-a716-446655440096', '550e8400-e29b-41d4-a716-446655440122'),
('550e8400-e29b-41d4-a716-446655440143', 'منصة التعلم التكيفي الذكي للطلاب', 'منصة تعليمية تستخدم الذكاء الاصطناعي لتخصيص المحتوى التعليمي حسب قدرات وأسلوب تعلم كل طالب', 'تحليل بيانات أداء الطلاب وسلوكهم التعليمي لتخصيص المسارات التعليمية وتقديم المحتوى الأنسب لكل طالب', 'تطوير محرك التوصيات (5 أشهر)\nإنشاء المحتوى التعليمي (4 أشهر)\nالاختبار مع مجموعات الطلاب (3 أشهر)\nالتطوير والتحسين (2 أشهر)', 'mvp', 'تحسين نتائج التعلم بنسبة 45% وزيادة مشاركة الطلاب', 3500000, '14 months', 'مطورين، خبراء تعليميين، مصممي محتوى تفاعلي', 'متوسط - يتطلب تكامل مع الأنظمة التعليمية الحالية', 'in_development', '550e8400-e29b-41d4-a716-446655440113', '550e8400-e29b-41d4-a716-446655440083', '550e8400-e29b-41d4-a716-446655440098', '550e8400-e29b-41d4-a716-446655440123'),
('550e8400-e29b-41d4-a716-446655440144', 'نظام مراقبة جودة الهواء الذكي للمدن', 'شبكة من أجهزة الاستشعار الذكية لمراقبة جودة الهواء في الوقت الفعلي مع تحليلات تنبؤية', 'نشر شبكة من أجهزة الاستشعار IoT في المدينة مع تحليل البيانات بالذكاء الاصطناعي للتنبؤ بمستويات التلوث', 'تصميم أجهزة الاستشعار (3 أشهر)\nتطوير منصة التحليل (4 أشهر)\nالنشر التجريبي (2 أشهر)\nالتوسع الكامل (3 أشهر)', 'concept', 'تحسين جودة الهواء وصحة المواطنين، تقليل التلوث بنسبة 25%', 1800000, '12 months', 'مهندسو IoT، أخصائيو البيئة، تقنيو الشبكات', 'منخفض - تقنية مختبرة مع تحسينات', 'draft', '550e8400-e29b-41d4-a716-446655440114', '550e8400-e29b-41d4-a716-446655440080', '550e8400-e29b-41d4-a716-446655440091', '550e8400-e29b-41d4-a716-446655440120');

-- 10. Challenge-Expert Assignments
INSERT INTO challenge_experts (challenge_id, expert_id, role_type, status, notes) VALUES 
('550e8400-e29b-41d4-a716-446655440080', '550e8400-e29b-41d4-a716-446655440103', 'lead_expert', 'active', 'خبير رئيسي في تخطيط المدن الذكية وأنظمة IoT'),
('550e8400-e29b-41d4-a716-446655440080', '550e8400-e29b-41d4-a716-446655440100', 'technical_advisor', 'active', 'مستشار تقني للذكاء الاصطناعي وتحليل البيانات'),
('550e8400-e29b-41d4-a716-446655440081', '550e8400-e29b-41d4-a716-446655440102', 'lead_expert', 'active', 'خبير رئيسي في التقنيات الطبية والتشخيص الذكي'),
('550e8400-e29b-41d4-a716-446655440081', '550e8400-e29b-41d4-a716-446655440100', 'evaluator', 'active', 'مقيم تقني للحلول المبنية على الذكاء الاصطناعي'),
('550e8400-e29b-41d4-a716-446655440082', '550e8400-e29b-41d4-a716-446655440101', 'lead_expert', 'active', 'خبير رئيسي في الأمن السيبراني والحماية'),
('550e8400-e29b-41d4-a716-446655440083', '550e8400-e29b-41d4-a716-446655440104', 'lead_expert', 'active', 'خبير رئيسي في التقنيات التعليمية والتعلم التكيفي'),
('550e8400-e29b-41d4-a716-446655440083', '550e8400-e29b-41d4-a716-446655440100', 'technical_advisor', 'active', 'مستشار تقني للذكاء الاصطناعي في التعليم');

-- 11. Event Participants
INSERT INTO event_participants (event_id, user_id, registration_type, attendance_status, notes) VALUES 
('550e8400-e29b-41d4-a716-446655440130', (SELECT user_id FROM innovators WHERE id = '550e8400-e29b-41d4-a716-446655440110'), 'self_registered', 'registered', 'مهتم بأنظمة المرور الذكية'),
('550e8400-e29b-41d4-a716-446655440130', (SELECT user_id FROM innovators WHERE id = '550e8400-e29b-41d4-a716-446655440112'), 'self_registered', 'registered', 'خبرة في تخطيط المدن'),
('550e8400-e29b-41d4-a716-446655440131', (SELECT user_id FROM innovators WHERE id = '550e8400-e29b-41d4-a716-446655440111'), 'invited', 'registered', 'مطور حلول صحية'),
('550e8400-e29b-41d4-a716-446655440132', (SELECT user_id FROM innovators WHERE id = '550e8400-e29b-41d4-a716-446655440113'), 'self_registered', 'registered', 'متخصص في الأمن المالي'),
('550e8400-e29b-41d4-a716-446655440133', (SELECT user_id FROM innovators WHERE id = '550e8400-e29b-41d4-a716-446655440114'), 'self_registered', 'registered', 'مطور تطبيقات تعليمية');

-- 12. Linking Tables Data
INSERT INTO campaign_partner_links (campaign_id, partner_id) VALUES 
('550e8400-e29b-41d4-a716-446655440120', '550e8400-e29b-41d4-a716-446655440062'),
('550e8400-e29b-41d4-a716-446655440121', '550e8400-e29b-41d4-a716-446655440060'),
('550e8400-e29b-41d4-a716-446655440122', '550e8400-e29b-41d4-a716-446655440063'),
('550e8400-e29b-41d4-a716-446655440123', '550e8400-e29b-41d4-a716-446655440061');

INSERT INTO campaign_stakeholder_links (campaign_id, stakeholder_id) VALUES 
('550e8400-e29b-41d4-a716-446655440120', '550e8400-e29b-41d4-a716-446655440071'),
('550e8400-e29b-41d4-a716-446655440121', '550e8400-e29b-41d4-a716-446655440072'),
('550e8400-e29b-41d4-a716-446655440122', '550e8400-e29b-41d4-a716-446655440070'),
('550e8400-e29b-41d4-a716-446655440123', '550e8400-e29b-41d4-a716-446655440073');

INSERT INTO event_partner_links (event_id, partner_id) VALUES 
('550e8400-e29b-41d4-a716-446655440130', '550e8400-e29b-41d4-a716-446655440062'),
('550e8400-e29b-41d4-a716-446655440131', '550e8400-e29b-41d4-a716-446655440060'),
('550e8400-e29b-41d4-a716-446655440132', '550e8400-e29b-41d4-a716-446655440063');

INSERT INTO event_stakeholder_links (event_id, stakeholder_id) VALUES 
('550e8400-e29b-41d4-a716-446655440130', '550e8400-e29b-41d4-a716-446655440071'),
('550e8400-e29b-41d4-a716-446655440131', '550e8400-e29b-41d4-a716-446655440072'),
('550e8400-e29b-41d4-a716-446655440132', '550e8400-e29b-41d4-a716-446655440070');

INSERT INTO event_focus_question_links (event_id, focus_question_id) VALUES 
('550e8400-e29b-41d4-a716-446655440130', '550e8400-e29b-41d4-a716-446655440090'),
('550e8400-e29b-41d4-a716-446655440130', '550e8400-e29b-41d4-a716-446655440091'),
('550e8400-e29b-41d4-a716-446655440131', '550e8400-e29b-41d4-a716-446655440093'),
('550e8400-e29b-41d4-a716-446655440132', '550e8400-e29b-41d4-a716-446655440096'),
('550e8400-e29b-41d4-a716-446655440133', '550e8400-e29b-41d4-a716-446655440098');