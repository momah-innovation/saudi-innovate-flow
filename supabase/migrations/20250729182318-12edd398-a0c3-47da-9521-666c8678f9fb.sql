-- Comprehensive seed data with only existing table columns

-- 1. Basic data for existing tables
INSERT INTO sectors (id, name, name_ar) VALUES 
('550e8400-e29b-41d4-a716-446655440010', 'Healthcare Innovation', 'الابتكار الصحي'),
('550e8400-e29b-41d4-a716-446655440011', 'Smart Cities', 'المدن الذكية'),
('550e8400-e29b-41d4-a716-446655440012', 'Financial Technology', 'التقنية المالية'),
('550e8400-e29b-41d4-a716-446655440013', 'Education Technology', 'تقنية التعليم');

-- 2. Partners
INSERT INTO partners (id, name, name_ar, partner_type, sector, contact_person, contact_email, phone, partnership_level, status) VALUES 
('550e8400-e29b-41d4-a716-446655440060', 'Saudi Aramco', 'أرامكو السعودية', 'corporate', 'Energy', 'أحمد السالم', 'ahmed.salem@aramco.com', '+966501234567', 'strategic', 'active'),
('550e8400-e29b-41d4-a716-446655440061', 'King Abdulaziz University', 'جامعة الملك عبدالعزيز', 'academic', 'Education', 'د. فهد الأحمدي', 'fahd.ahmadi@kau.edu.sa', '+966502345678', 'strategic', 'active'),
('550e8400-e29b-41d4-a716-446655440062', 'Microsoft Saudi Arabia', 'مايكروسوفت السعودية', 'technology', 'Technology', 'سارة محمد', 'sarah.mohammed@microsoft.com', '+966503456789', 'operational', 'active'),
('550e8400-e29b-41d4-a716-446655440063', 'STC Solutions', 'حلول الاتصالات السعودية', 'technology', 'Telecommunications', 'عبدالله القرني', 'abdullah.qarni@stc.com.sa', '+966504567890', 'operational', 'active');

-- 3. Stakeholders
INSERT INTO stakeholders (id, name, name_ar, organization, position, email, phone, category, influence_level, engagement_level, notes) VALUES 
('550e8400-e29b-41d4-a716-446655440070', 'Dr. Khalid Al-Falih', 'د. خالد الفالح', 'Ministry of Energy', 'Minister', 'minister@moenergy.gov.sa', '+966505678901', 'government', 'high', 'high', 'وزير الطاقة - شريك استراتيجي في مشاريع الطاقة المتجددة'),
('550e8400-e29b-41d4-a716-446655440071', 'Eng. Abdullah Al-Swaha', 'م. عبدالله السواحة', 'Ministry of Communications', 'Minister', 'minister@mcit.gov.sa', '+966506789012', 'government', 'high', 'high', 'وزير الاتصالات - شريك في مشاريع التحول الرقمي'),
('550e8400-e29b-41d4-a716-446655440072', 'Dr. Bandar Al-Knawy', 'د. بندر الكناوي', 'Ministry of Health', 'Deputy Minister', 'deputy@moh.gov.sa', '+966507890123', 'government', 'medium', 'high', 'نائب وزير الصحة - مهتم بالابتكار الصحي'),
('550e8400-e29b-41d4-a716-446655440073', 'Prof. Ahmed Al-Saif', 'أ.د. أحمد السيف', 'King Saud University', 'Vice Rector', 'vicerector@ksu.edu.sa', '+966508901234', 'academic', 'medium', 'medium', 'وكيل جامعة الملك سعود - خبير في التقنيات الناشئة');

-- 4. Challenges (basic structure)
INSERT INTO challenges (id, title_ar, description_ar, challenge_type, priority_level, status, sensitivity_level) VALUES 
('550e8400-e29b-41d4-a716-446655440080', 'تطوير نظام ذكي لإدارة المرور في المدن', 'تطوير نظام ذكي متكامل لإدارة حركة المرور في المدن الكبيرة باستخدام الذكاء الاصطناعي وإنترنت الأشياء لتقليل الازدحام وتحسين السلامة المرورية', 'technical', 'high', 'active', 'normal'),
('550e8400-e29b-41d4-a716-446655440081', 'منصة التشخيص الطبي بالذكاء الاصطناعي', 'تطوير منصة ذكية للتشخيص الطبي المبكر للأمراض المزمنة باستخدام تقنيات الذكاء الاصطناعي وتحليل الصور الطبية', 'innovation', 'critical', 'active', 'sensitive'),
('550e8400-e29b-41d4-a716-446655440082', 'نظام الأمان السيبراني المتقدم للقطاع المالي', 'تطوير نظام متقدم لحماية المؤسسات المالية من التهديدات السيبرانية باستخدام تقنيات الذكاء الاصطناعي والتعلم الآلي', 'technical', 'critical', 'planning', 'confidential'),
('550e8400-e29b-41d4-a716-446655440083', 'منصة التعلم التكيفي الذكية', 'تطوير منصة تعليمية ذكية تتكيف مع احتياجات كل طالب باستخدام الذكاء الاصطناعي وتحليل البيانات التعليمية', 'innovation', 'high', 'active', 'normal');

-- 5. Focus Questions
INSERT INTO focus_questions (id, question_text_ar, question_type, is_sensitive, order_sequence, challenge_id) VALUES 
('550e8400-e29b-41d4-a716-446655440090', 'كيف يمكن استخدام البيانات المرورية في الوقت الفعلي لتحسين تدفق حركة المرور؟', 'technical', false, 1, '550e8400-e29b-41d4-a716-446655440080'),
('550e8400-e29b-41d4-a716-446655440091', 'ما هي أفضل الخوارزميات للتنبؤ بالازدحام المروري قبل حدوثه؟', 'technical', false, 2, '550e8400-e29b-41d4-a716-446655440080'),
('550e8400-e29b-41d4-a716-446655440092', 'كيف يمكن دمج أنظمة النقل العام مع نظام إدارة المرور الذكي؟', 'strategic', false, 3, '550e8400-e29b-41d4-a716-446655440080'),
('550e8400-e29b-41d4-a716-446655440093', 'ما هي أنواع البيانات الطبية المطلوبة لتدريب نماذج التشخيص الذكي؟', 'technical', true, 1, '550e8400-e29b-41d4-a716-446655440081'),
('550e8400-e29b-41d4-a716-446655440094', 'كيف يمكن ضمان خصوصية وأمان البيانات الطبية في منصة التشخيص؟', 'security', true, 2, '550e8400-e29b-41d4-a716-446655440081');

-- 6. Experts
INSERT INTO experts (id, user_id, expertise_areas, experience_years, expert_level, availability_status, education_background, certifications, consultation_rate) VALUES 
('550e8400-e29b-41d4-a716-446655440100', gen_random_uuid(), ARRAY['Artificial Intelligence', 'Machine Learning', 'Computer Vision'], 15, 'senior', 'available', 'PhD in Computer Science from MIT, MSc in AI from Stanford', ARRAY['AWS Certified ML Specialist', 'Google Cloud AI Certified', 'Microsoft AI Expert'], 2500),
('550e8400-e29b-41d4-a716-446655440101', gen_random_uuid(), ARRAY['Cybersecurity', 'Network Security', 'Penetration Testing'], 12, 'senior', 'busy', 'MSc in Cybersecurity from Carnegie Mellon, BSc in Computer Engineering', ARRAY['CISSP', 'CEH', 'CISM', 'Security+'], 2000),
('550e8400-e29b-41d4-a716-446655440102', gen_random_uuid(), ARRAY['Healthcare Technology', 'Medical Imaging', 'Digital Health'], 10, 'mid', 'available', 'MD from Harvard Medical School, MSc in Biomedical Engineering', ARRAY['Board Certified Radiologist', 'Digital Health Certified'], 1800);

-- 7. Innovators
INSERT INTO innovators (id, user_id, innovation_areas, career_stage, academic_background, previous_innovations, contact_preferences) VALUES 
('550e8400-e29b-41d4-a716-446655440110', gen_random_uuid(), ARRAY['AI Solutions', 'Data Analytics'], 'mid_career', 'MSc Computer Science', 3, 'email'),
('550e8400-e29b-41d4-a716-446655440111', gen_random_uuid(), ARRAY['Healthcare Tech', 'Mobile Apps'], 'early_career', 'BSc Biomedical Engineering', 1, 'phone'),
('550e8400-e29b-41d4-a716-446655440112', gen_random_uuid(), ARRAY['Smart Cities', 'IoT'], 'senior', 'PhD Urban Planning', 7, 'email');

-- 8. Campaigns
INSERT INTO campaigns (id, title_ar, description_ar, theme, status, start_date, end_date, registration_deadline, target_participants, target_ideas, budget, challenge_id, sector_id, success_metrics) VALUES 
('550e8400-e29b-41d4-a716-446655440120', 'حملة الابتكار في المدن الذكية 2024', 'حملة شاملة لجمع الأفكار الابتكارية في مجال تطوير المدن الذكية والحلول التقنية المتقدمة', 'Smart Cities', 'active', '2024-01-15', '2024-06-30', '2024-05-15', 500, 200, 3000000, '550e8400-e29b-41d4-a716-446655440080', '550e8400-e29b-41d4-a716-446655440011', 'عدد الأفكار المقدمة، جودة الحلول، نسبة التنفيذ'),
('550e8400-e29b-41d4-a716-446655440121', 'مبادرة الابتكار الصحي', 'مبادرة لتطوير حلول مبتكرة في القطاع الصحي باستخدام التقنيات الحديثة', 'Healthcare Innovation', 'active', '2024-02-01', '2024-08-31', '2024-07-01', 300, 150, 5000000, '550e8400-e29b-41d4-a716-446655440081', '550e8400-e29b-41d4-a716-446655440010', 'عدد المشاريع المطورة، التأثير على المرضى، التوفير في التكاليف');

-- 9. Events
INSERT INTO events (id, title_ar, description_ar, event_type, format, status, event_date, start_time, end_time, location, max_participants, registered_participants, actual_participants, budget, campaign_id, challenge_id, sector_id) VALUES 
('550e8400-e29b-41d4-a716-446655440130', 'ورشة عمل تطوير المدن الذكية', 'ورشة عمل تفاعلية لمناقشة أحدث التقنيات في تطوير المدن الذكية', 'workshop', 'hybrid', 'scheduled', '2024-03-15', '09:00:00', '17:00:00', 'مركز الملك عبدالعزيز للمؤتمرات', 150, 120, 0, 150000, '550e8400-e29b-41d4-a716-446655440120', '550e8400-e29b-41d4-a716-446655440080', '550e8400-e29b-41d4-a716-446655440011'),
('550e8400-e29b-41d4-a716-446655440131', 'مؤتمر الابتكار الصحي السعودي', 'مؤتمر دولي لعرض أحدث الابتكارات في القطاع الصحي', 'conference', 'in_person', 'scheduled', '2024-04-20', '08:00:00', '18:00:00', 'مركز الرياض للمعارض والمؤتمرات', 500, 350, 0, 800000, '550e8400-e29b-41d4-a716-446655440121', '550e8400-e29b-41d4-a716-446655440081', '550e8400-e29b-41d4-a716-446655440010');

-- 10. Ideas
INSERT INTO ideas (id, title_ar, description_ar, solution_approach, implementation_plan, maturity_level, expected_impact, estimated_cost, development_timeline, required_resources, risk_assessment, status, innovator_id, challenge_id, focus_question_id, campaign_id) VALUES 
('550e8400-e29b-41d4-a716-446655440140', 'نظام إشارات المرور التكيفي بالذكاء الاصطناعي', 'نظام ذكي لإدارة إشارات المرور يتكيف مع كثافة الحركة في الوقت الفعلي باستخدام كاميرات ذكية وخوارزميات التعلم الآلي', 'استخدام كاميرات عالية الدقة مع معالجة الصور بالذكاء الاصطناعي لتحليل كثافة المرور وتعديل توقيت الإشارات تلقائياً', 'المرحلة الأولى: تطوير النموذج الأولي (3 أشهر)\nالمرحلة الثانية: الاختبار التجريبي (4 أشهر)\nالمرحلة الثالثة: التطبيق الواسع (6 أشهر)', 'prototype', 'تقليل زمن الانتظار بنسبة 40% وتحسين تدفق المرور', 2500000, '13 months', 'فريق من 8 مطورين، معدات كاميرات ذكية، خوادم معالجة', 'متوسط - يتطلب تدريب المشغلين واختبارات مكثفة', 'under_review', '550e8400-e29b-41d4-a716-446655440110', '550e8400-e29b-41d4-a716-446655440080', '550e8400-e29b-41d4-a716-446655440090', '550e8400-e29b-41d4-a716-446655440120'),
('550e8400-e29b-41d4-a716-446655440141', 'تطبيق التشخيص المبكر للسكري باستخدام الصور', 'تطبيق محمول يستخدم الذكاء الاصطناعي لتحليل صور شبكية العين للكشف المبكر عن مرض السكري', 'تدريب نماذج الشبكات العصبية على آلاف صور الشبكية المشخصة طبياً لتطوير خوارزمية دقيقة للكشف المبكر', 'التطوير التقني (6 أشهر)\nالاختبارات السريرية (8 أشهر)\nالحصول على الموافقات الطبية (4 أشهر)\nالإطلاق التجاري (2 أشهر)', 'concept', 'زيادة معدل الكشف المبكر بنسبة 60% وتقليل التكاليف العلاجية', 4000000, '20 months', 'فريق طبي وتقني، قاعدة بيانات طبية، معدات تصوير متخصصة', 'عالي - يتطلب موافقات طبية ودقة عالية جداً', 'submitted', '550e8400-e29b-41d4-a716-446655440111', '550e8400-e29b-41d4-a716-446655440081', '550e8400-e29b-41d4-a716-446655440093', '550e8400-e29b-41d4-a716-446655440121');

-- 11. Link Partners, Stakeholders, and Experts to Challenges and Campaigns
INSERT INTO challenge_experts (challenge_id, expert_id, role_type, status, notes) VALUES 
('550e8400-e29b-41d4-a716-446655440080', '550e8400-e29b-41d4-a716-446655440100', 'lead_expert', 'active', 'خبير رئيسي في الذكاء الاصطناعي وأنظمة المرور الذكية'),
('550e8400-e29b-41d4-a716-446655440081', '550e8400-e29b-41d4-a716-446655440102', 'lead_expert', 'active', 'خبير رئيسي في التقنيات الطبية والتشخيص الذكي'),
('550e8400-e29b-41d4-a716-446655440082', '550e8400-e29b-41d4-a716-446655440101', 'lead_expert', 'active', 'خبير رئيسي في الأمن السيبراني والحماية');

INSERT INTO campaign_partner_links (campaign_id, partner_id) VALUES 
('550e8400-e29b-41d4-a716-446655440120', '550e8400-e29b-41d4-a716-446655440062'),
('550e8400-e29b-41d4-a716-446655440121', '550e8400-e29b-41d4-a716-446655440061');

INSERT INTO campaign_stakeholder_links (campaign_id, stakeholder_id) VALUES 
('550e8400-e29b-41d4-a716-446655440120', '550e8400-e29b-41d4-a716-446655440071'),
('550e8400-e29b-41d4-a716-446655440121', '550e8400-e29b-41d4-a716-446655440072');

INSERT INTO event_partner_links (event_id, partner_id) VALUES 
('550e8400-e29b-41d4-a716-446655440130', '550e8400-e29b-41d4-a716-446655440062'),
('550e8400-e29b-41d4-a716-446655440131', '550e8400-e29b-41d4-a716-446655440061');

INSERT INTO event_focus_question_links (event_id, focus_question_id) VALUES 
('550e8400-e29b-41d4-a716-446655440130', '550e8400-e29b-41d4-a716-446655440090'),
('550e8400-e29b-41d4-a716-446655440131', '550e8400-e29b-41d4-a716-446655440093');