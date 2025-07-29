-- Comprehensive seed data for all tables with realistic linked data (using only existing columns)

-- 1. Basic organizational structure
INSERT INTO sectors (id, name, name_ar) VALUES 
('550e8400-e29b-41d4-a716-446655440010', 'Healthcare Innovation', 'الابتكار الصحي'),
('550e8400-e29b-41d4-a716-446655440011', 'Smart Cities', 'المدن الذكية'),
('550e8400-e29b-41d4-a716-446655440012', 'Financial Technology', 'التقنية المالية'),
('550e8400-e29b-41d4-a716-446655440013', 'Education Technology', 'تقنية التعليم');

INSERT INTO deputies (id, name, name_ar, deputy_minister, contact_email, sector_id) VALUES 
('550e8400-e29b-41d4-a716-446655440020', 'Digital Innovation Deputy', 'وكالة الابتكار الرقمي', 'د. سارة محمد الغامدي', 'deputy.digital@momah.gov.sa', '550e8400-e29b-41d4-a716-446655440010'),
('550e8400-e29b-41d4-a716-446655440021', 'Strategic Development Deputy', 'وكالة التطوير الاستراتيجي', 'م. محمد عبدالعزيز النفيعي', 'deputy.strategy@momah.gov.sa', '550e8400-e29b-41d4-a716-446655440011');

INSERT INTO departments (id, name, name_ar, department_head, budget_allocation, deputy_id) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Digital Transformation', 'التحول الرقمي', 'أحمد محمد العلي', 15000000, '550e8400-e29b-41d4-a716-446655440020'),
('550e8400-e29b-41d4-a716-446655440002', 'Innovation Strategy', 'استراتيجية الابتكار', 'فاطمة سعد الحربي', 12000000, '550e8400-e29b-41d4-a716-446655440021'),
('550e8400-e29b-41d4-a716-446655440003', 'Business Development', 'تطوير الأعمال', 'خالد عبدالله القحطاني', 8000000, null),
('550e8400-e29b-41d4-a716-446655440004', 'Research & Development', 'البحث والتطوير', 'نورا عبدالرحمن المطيري', 20000000, null);

-- 2. Partners (using only existing columns)
INSERT INTO partners (id, name, name_ar, partner_type, contact_person, contact_email, phone, partnership_level, status) VALUES 
('550e8400-e29b-41d4-a716-446655440060', 'Saudi Aramco', 'أرامكو السعودية', 'corporate', 'أحمد السالم', 'ahmed.salem@aramco.com', '+966501234567', 'strategic', 'active'),
('550e8400-e29b-41d4-a716-446655440061', 'King Abdulaziz University', 'جامعة الملك عبدالعزيز', 'academic', 'د. فهد الأحمدي', 'fahd.ahmadi@kau.edu.sa', '+966502345678', 'strategic', 'active'),
('550e8400-e29b-41d4-a716-446655440062', 'Microsoft Saudi Arabia', 'مايكروسوفت السعودية', 'technology', 'سارة محمد', 'sarah.mohammed@microsoft.com', '+966503456789', 'operational', 'active'),
('550e8400-e29b-41d4-a716-446655440063', 'STC Solutions', 'حلول الاتصالات السعودية', 'technology', 'عبدالله القرني', 'abdullah.qarni@stc.com.sa', '+966504567890', 'operational', 'active'),
('550e8400-e29b-41d4-a716-446655440064', 'NEOM', 'نيوم', 'government', 'رانيا الخليل', 'rania.khalil@neom.com', '+966505123456', 'strategic', 'active');

-- 3. Stakeholders
INSERT INTO stakeholders (id, name, name_ar, organization, position, email, phone, category, influence_level, engagement_level, notes) VALUES 
('550e8400-e29b-41d4-a716-446655440070', 'Dr. Khalid Al-Falih', 'د. خالد الفالح', 'Ministry of Energy', 'Minister', 'minister@moenergy.gov.sa', '+966505678901', 'government', 'high', 'high', 'وزير الطاقة - شريك استراتيجي في مشاريع الطاقة المتجددة'),
('550e8400-e29b-41d4-a716-446655440071', 'Eng. Abdullah Al-Swaha', 'م. عبدالله السواحة', 'Ministry of Communications', 'Minister', 'minister@mcit.gov.sa', '+966506789012', 'government', 'high', 'high', 'وزير الاتصالات - شريك في مشاريع التحول الرقمي'),
('550e8400-e29b-41d4-a716-446655440072', 'Dr. Bandar Al-Knawy', 'د. بندر الكناوي', 'Ministry of Health', 'Deputy Minister', 'deputy@moh.gov.sa', '+966507890123', 'government', 'medium', 'high', 'نائب وزير الصحة - مهتم بالابتكار الصحي'),
('550e8400-e29b-41d4-a716-446655440073', 'Prof. Ahmed Al-Saif', 'أ.د. أحمد السيف', 'King Saud University', 'Vice Rector', 'vicerector@ksu.edu.sa', '+966508901234', 'academic', 'medium', 'medium', 'وكيل جامعة الملك سعود - خبير في التقنيات الناشئة'),
('550e8400-e29b-41d4-a716-446655440074', 'CEO Mohammed Al-Jadaan', 'الرئيس التنفيذي محمد الجدعان', 'Public Investment Fund', 'CEO', 'ceo@pif.gov.sa', '+966509234567', 'government', 'high', 'high', 'الرئيس التنفيذي لصندوق الاستثمارات العامة');

-- 4. Challenges with proper linking
INSERT INTO challenges (id, title_ar, description_ar, challenge_type, priority_level, status, sensitivity_level, vision_2030_goal, start_date, end_date, estimated_budget, sector_id, department_id, deputy_id) VALUES 
('550e8400-e29b-41d4-a716-446655440080', 'تطوير نظام ذكي لإدارة المرور في المدن', 'تطوير نظام ذكي متكامل لإدارة حركة المرور في المدن الكبيرة باستخدام الذكاء الاصطناعي وإنترنت الأشياء لتقليل الازدحام وتحسين السلامة المرورية', 'technical', 'high', 'active', 'normal', 'تحسين جودة الحياة في المدن وتقليل التلوث', '2024-01-15', '2024-12-31', 5000000, '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440020'),
('550e8400-e29b-41d4-a716-446655440081', 'منصة التشخيص الطبي بالذكاء الاصطناعي', 'تطوير منصة ذكية للتشخيص الطبي المبكر للأمراض المزمنة باستخدام تقنيات الذكاء الاصطناعي وتحليل الصور الطبية', 'innovation', 'critical', 'active', 'sensitive', 'تحسين جودة الرعاية الصحية وتقليل التكاليف', '2024-02-01', '2025-01-31', 8000000, '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440020'),
('550e8400-e29b-41d4-a716-446655440082', 'نظام الأمان السيبراني المتقدم للقطاع المالي', 'تطوير نظام متقدم لحماية المؤسسات المالية من التهديدات السيبرانية باستخدام تقنيات الذكاء الاصطناعي والتعلم الآلي', 'technical', 'critical', 'planning', 'confidential', 'تعزيز الأمان المالي والثقة في النظام المصرفي', '2024-03-01', '2025-02-28', 12000000, '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440021'),
('550e8400-e29b-41d4-a716-446655440083', 'منصة التعلم التكيفي الذكية', 'تطوير منصة تعليمية ذكية تتكيف مع احتياجات كل طالب باستخدام الذكاء الاصطناعي وتحليل البيانات التعليمية', 'innovation', 'high', 'active', 'normal', 'تطوير التعليم وإعداد جيل المستقبل', '2024-01-20', '2024-11-30', 6000000, '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440020'),
('550e8400-e29b-41d4-a716-446655440084', 'مدينة NEOM الذكية المستدامة', 'تطوير مفاهيم وحلول تقنية مبتكرة لمدينة NEOM الذكية مع التركيز على الاستدامة والتقنيات المستقبلية', 'innovation', 'critical', 'active', 'normal', 'بناء مدن المستقبل ضمن رؤية 2030', '2024-01-01', '2025-12-31', 25000000, '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440021');

-- 5. Focus Questions linked to challenges
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
('550e8400-e29b-41d4-a716-446655440099', 'ما هي مؤشرات الأداء المناسبة لقياس فعالية التعلم التكيفي؟', 'analytical', false, 2, '550e8400-e29b-41d4-a716-446655440083'),
('550e8400-e29b-41d4-a716-446655440100', 'كيف يمكن تطوير بنية تحتية ذكية ومستدامة في مدن المستقبل؟', 'strategic', false, 1, '550e8400-e29b-41d4-a716-446655440084'),
('550e8400-e29b-41d4-a716-446655440101', 'ما هي التقنيات المطلوبة لإنشاء مدينة خالية من الانبعاثات الكربونية؟', 'environmental', false, 2, '550e8400-e29b-41d4-a716-446655440084');

-- 6. Experts with diverse expertise
INSERT INTO experts (id, user_id, expertise_areas, experience_years, expert_level, availability_status, education_background, certifications, consultation_rate) VALUES 
('550e8400-e29b-41d4-a716-446655440110', gen_random_uuid(), ARRAY['Artificial Intelligence', 'Machine Learning', 'Computer Vision'], 15, 'senior', 'available', 'PhD in Computer Science from MIT, MSc in AI from Stanford', ARRAY['AWS Certified ML Specialist', 'Google Cloud AI Certified', 'Microsoft AI Expert'], 2500),
('550e8400-e29b-41d4-a716-446655440111', gen_random_uuid(), ARRAY['Cybersecurity', 'Network Security', 'Penetration Testing'], 12, 'senior', 'busy', 'MSc in Cybersecurity from Carnegie Mellon, BSc in Computer Engineering', ARRAY['CISSP', 'CEH', 'CISM', 'Security+'], 2000),
('550e8400-e29b-41d4-a716-446655440112', gen_random_uuid(), ARRAY['Healthcare Technology', 'Medical Imaging', 'Digital Health'], 10, 'mid', 'available', 'MD from Harvard Medical School, MSc in Biomedical Engineering', ARRAY['Board Certified Radiologist', 'Digital Health Certified'], 1800),
('550e8400-e29b-41d4-a716-446655440113', gen_random_uuid(), ARRAY['Urban Planning', 'Smart Cities', 'IoT Systems'], 8, 'mid', 'available', 'PhD in Urban Planning from MIT, MSc in Civil Engineering', ARRAY['Smart Cities Expert Certificate', 'IoT Professional'], 1500),
('550e8400-e29b-41d4-a716-446655440114', gen_random_uuid(), ARRAY['Educational Technology', 'Learning Analytics', 'Curriculum Design'], 9, 'mid', 'busy', 'PhD in Educational Technology, MSc in Computer Science', ARRAY['Educational Technology Specialist', 'Learning Analytics Certified'], 1600),
('550e8400-e29b-41d4-a716-446655440115', gen_random_uuid(), ARRAY['Sustainable Technology', 'Green Energy', 'Environmental Systems'], 14, 'senior', 'available', 'PhD in Environmental Engineering, MSc in Renewable Energy', ARRAY['LEED AP', 'Certified Energy Manager', 'Sustainability Expert'], 2200);

-- 7. Innovators with various backgrounds
INSERT INTO innovators (id, user_id, innovation_areas, career_stage, academic_background, previous_innovations, contact_preferences) VALUES 
('550e8400-e29b-41d4-a716-446655440120', gen_random_uuid(), ARRAY['AI Solutions', 'Data Analytics'], 'mid_career', 'MSc Computer Science', 3, 'email'),
('550e8400-e29b-41d4-a716-446655440121', gen_random_uuid(), ARRAY['Healthcare Tech', 'Mobile Apps'], 'early_career', 'BSc Biomedical Engineering', 1, 'phone'),
('550e8400-e29b-41d4-a716-446655440122', gen_random_uuid(), ARRAY['Smart Cities', 'IoT'], 'senior', 'PhD Urban Planning', 7, 'email'),
('550e8400-e29b-41d4-a716-446655440123', gen_random_uuid(), ARRAY['Fintech', 'Blockchain'], 'mid_career', 'MSc Finance & Technology', 4, 'both'),
('550e8400-e29b-41d4-a716-446655440124', gen_random_uuid(), ARRAY['EdTech', 'VR/AR'], 'early_career', 'BSc Education Technology', 2, 'email'),
('550e8400-e29b-41d4-a716-446655440125', gen_random_uuid(), ARRAY['Green Technology', 'Sustainability'], 'senior', 'PhD Environmental Science', 12, 'both');

-- 8. Campaigns linked to challenges and sectors
INSERT INTO campaigns (id, title_ar, description_ar, theme, status, start_date, end_date, registration_deadline, target_participants, target_ideas, budget, challenge_id, department_id, deputy_id, sector_id, success_metrics) VALUES 
('550e8400-e29b-41d4-a716-446655440130', 'حملة الابتكار في المدن الذكية 2024', 'حملة شاملة لجمع الأفكار الابتكارية في مجال تطوير المدن الذكية والحلول التقنية المتقدمة', 'Smart Cities', 'active', '2024-01-15', '2024-06-30', '2024-05-15', 500, 200, 3000000, '550e8400-e29b-41d4-a716-446655440080', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440011', 'عدد الأفكار المقدمة، جودة الحلول، نسبة التنفيذ'),
('550e8400-e29b-41d4-a716-446655440131', 'مبادرة الابتكار الصحي', 'مبادرة لتطوير حلول مبتكرة في القطاع الصحي باستخدام التقنيات الحديثة', 'Healthcare Innovation', 'active', '2024-02-01', '2024-08-31', '2024-07-01', 300, 150, 5000000, '550e8400-e29b-41d4-a716-446655440081', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440010', 'عدد المشاريع المطورة، التأثير على المرضى، التوفير في التكاليف'),
('550e8400-e29b-41d4-a716-446655440132', 'هاكاثون الأمن السيبراني', 'هاكاثون متخصص في تطوير حلول الأمن السيبراني للقطاع المالي', 'Cybersecurity', 'planning', '2024-03-01', '2024-03-03', '2024-02-20', 100, 50, 1000000, '550e8400-e29b-41d4-a716-446655440082', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440012', 'عدد الحلول المطورة، جودة الحماية، قابلية التطبيق'),
('550e8400-e29b-41d4-a716-446655440133', 'مسابقة التعلم الذكي', 'مسابقة لتطوير حلول تعليمية ذكية تعتمد على الذكاء الاصطناعي', 'Educational Technology', 'active', '2024-01-20', '2024-07-20', '2024-06-01', 400, 180, 2500000, '550e8400-e29b-41d4-a716-446655440083', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440013', 'تحسن نتائج التعلم، رضا المستخدمين، انتشار الحلول'),
('550e8400-e29b-41d4-a716-446655440134', 'تحدي مدينة NEOM المستقبلية', 'تحدي ابتكاري لتطوير حلول تقنية مستدامة لمدينة المستقبل', 'Future Cities', 'active', '2024-02-15', '2024-12-15', '2024-10-01', 1000, 500, 15000000, '550e8400-e29b-41d4-a716-446655440084', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440011', 'الابتكار التقني، الاستدامة البيئية، قابلية التطبيق');