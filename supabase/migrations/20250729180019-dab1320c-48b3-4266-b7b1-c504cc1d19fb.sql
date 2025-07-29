-- Comprehensive seed data across all services with real users and profiles

-- First, create profiles for existing users
INSERT INTO profiles (id, first_name, last_name, avatar_url, bio) 
VALUES 
('8066cfaf-4a91-4985-922b-74f6a286c441', 'أحمد', 'العثمان', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'مدير الابتكار ذو خبرة واسعة في التطوير التنظيمي والتحول الرقمي'),
('fa80bed2-ed61-4c27-8941-f713cf050944', 'فاطمة', 'الزهراني', 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150&h=150&fit=crop&crop=face', 'مديرة حملات متخصصة في إدارة المشاريع والتنسيق بين الفرق')
ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio;

-- Create additional diverse departments  
INSERT INTO departments (id, name, name_ar, department_head, budget_allocation, deputy_id) VALUES 
(gen_random_uuid(), 'Digital Innovation', 'الابتكار الرقمي', 'محمد السعود', 2500000, (SELECT id FROM deputies LIMIT 1)),
(gen_random_uuid(), 'Research & Development', 'البحث والتطوير', 'نورا القحطاني', 1800000, (SELECT id FROM deputies LIMIT 1)),
(gen_random_uuid(), 'Strategic Partnerships', 'الشراكات الاستراتيجية', 'خالد الرشيد', 1200000, (SELECT id FROM deputies LIMIT 1)),
(gen_random_uuid(), 'Data Analytics', 'تحليل البيانات', 'مريم الدوسري', 900000, (SELECT id FROM deputies LIMIT 1)),
(gen_random_uuid(), 'Change Management', 'إدارة التغيير', 'سعد المطيري', 750000, (SELECT id FROM deputies LIMIT 1));

-- Create comprehensive sectors
INSERT INTO sectors (id, name, name_ar, sector_lead, focus_areas) VALUES 
(gen_random_uuid(), 'Healthcare Innovation', 'ابتكار الرعاية الصحية', 'د. علي الشمري', ARRAY['التطبيب عن بُعد', 'الذكاء الاصطناعي الطبي', 'إدارة السجلات الصحية']),
(gen_random_uuid(), 'Education Technology', 'تقنيات التعليم', 'د. هند العتيبي', ARRAY['التعلم الإلكتروني', 'الواقع الافتراضي', 'المناهج التفاعلية']),
(gen_random_uuid(), 'Smart Cities', 'المدن الذكية', 'م. عبدالله الحربي', ARRAY['إنترنت الأشياء', 'النقل الذكي', 'إدارة الطاقة']),
(gen_random_uuid(), 'Financial Technology', 'التقنيات المالية', 'أ. سارة النعيمي', ARRAY['المدفوعات الرقمية', 'البلوك تشين', 'التمويل الشامل']),
(gen_random_uuid(), 'Environmental Solutions', 'الحلول البيئية', 'د. ماجد الغامدي', ARRAY['الطاقة المتجددة', 'إدارة النفايات', 'حماية البيئة']);

-- Create realistic partners
INSERT INTO partners (id, organization_name, organization_name_ar, partner_type, contact_person, contact_email, phone, partnership_status, specialization_areas, established_date) VALUES 
(gen_random_uuid(), 'Saudi Aramco', 'أرامكو السعودية', 'strategic', 'أحمد المنصور', 'ahmed.almansour@aramco.com', '+966501234567', 'active', ARRAY['Energy Innovation', 'Digital Transformation'], '2024-01-15'),
(gen_random_uuid(), 'King Abdullah University', 'جامعة الملك عبدالله', 'academic', 'د. فهد العمري', 'fahd.alomari@kaust.edu.sa', '+966501234568', 'active', ARRAY['Research', 'Technology Transfer'], '2024-02-01'),
(gen_random_uuid(), 'STC Group', 'مجموعة STC', 'technology', 'نايف الشهري', 'naif.alshehri@stc.com.sa', '+966501234569', 'active', ARRAY['Telecommunications', '5G Technology'], '2024-01-20'),
(gen_random_uuid(), 'NEOM', 'نيوم', 'strategic', 'لينا الحارثي', 'lina.alharthi@neom.com', '+966501234570', 'active', ARRAY['Future Cities', 'Sustainability'], '2024-03-01');

-- Create comprehensive stakeholders
INSERT INTO stakeholders (id, name, name_ar, organization, position, email, phone, stakeholder_type, influence_level, engagement_status, notes) VALUES 
(gen_random_uuid(), 'Dr. Abdulrahman Alshami', 'د. عبدالرحمن الشامي', 'Ministry of Economy', 'Deputy Minister', 'alshami@mep.gov.sa', '+966112345678', 'government', 'high', 'active', 'رئيس لجنة الابتكار الاقتصادي'),
(gen_random_uuid(), 'Eng. Maha Alsudairi', 'م. مها السديري', 'CITC', 'Innovation Director', 'maha.alsudairi@citc.gov.sa', '+966112345679', 'regulatory', 'high', 'active', 'متخصصة في تنظيم التقنيات الناشئة'),
(gen_random_uuid(), 'Prof. Omar Batterjee', 'أ.د. عمر باطرجي', 'King Saud University', 'Research Dean', 'obatterjee@ksu.edu.sa', '+966112345680', 'academic', 'medium', 'engaged', 'خبير في الذكاء الاصطناعي والبحث العلمي'),
(gen_random_uuid(), 'Ms. Reem Alghamdi', 'أ. ريم الغامدي', 'Saudi Federation', 'Business Development', 'reem.alghamdi@saudichamber.sa', '+966112345681', 'private_sector', 'medium', 'active', 'ممثلة القطاع الخاص في مبادرات الابتكار');

-- Create realistic challenges with different sensitivity levels
INSERT INTO challenges (id, title_ar, description_ar, priority_level, status, challenge_type, sensitivity_level, start_date, end_date, estimated_budget, department_id, sector_id, deputy_id, created_by) VALUES 
(gen_random_uuid(), 'منصة الخدمات الحكومية الموحدة', 'تطوير منصة رقمية شاملة لتقديم جميع الخدمات الحكومية من خلال واجهة موحدة مع تكامل كامل مع الأنظمة الحالية', 'high', 'active', 'digital_transformation', 'normal', '2024-04-01', '2024-12-31', 5000000, (SELECT id FROM departments WHERE name = 'Digital Innovation'), (SELECT id FROM sectors WHERE name = 'Smart Cities'), (SELECT id FROM deputies LIMIT 1), '8066cfaf-4a91-4985-922b-74f6a286c441'),

(gen_random_uuid(), 'نظام الذكاء الاصطناعي للتشخيص الطبي', 'تطوير نظام ذكي لمساعدة الأطباء في التشخيص المبكر للأمراض باستخدام تقنيات الذكاء الاصطناعي وتحليل الصور الطبية', 'critical', 'planning', 'technology_innovation', 'sensitive', '2024-06-01', '2025-03-31', 8000000, (SELECT id FROM departments WHERE name = 'Research & Development'), (SELECT id FROM sectors WHERE name = 'Healthcare Innovation'), (SELECT id FROM deputies LIMIT 1), '8066cfaf-4a91-4985-922b-74f6a286c441'),

(gen_random_uuid(), 'منصة التعليم التفاعلي بالواقع الافتراضي', 'إنشاء بيئة تعليمية افتراضية متقدمة تستخدم تقنيات الواقع الافتراضي والمعزز لتحسين جودة التعليم وزيادة التفاعل', 'medium', 'active', 'education_innovation', 'normal', '2024-05-15', '2024-11-30', 3500000, (SELECT id FROM departments WHERE name = 'Digital Innovation'), (SELECT id FROM sectors WHERE name = 'Education Technology'), (SELECT id FROM deputies LIMIT 1), 'fa80bed2-ed61-4c27-8941-f713cf050944');

-- Create focus questions for challenges
INSERT INTO focus_questions (id, challenge_id, question_text_ar, question_type, order_sequence, is_sensitive) VALUES 
(gen_random_uuid(), (SELECT id FROM challenges WHERE title_ar = 'منصة الخدمات الحكومية الموحدة'), 'كيف يمكن ضمان أمان البيانات الشخصية في المنصة الموحدة؟', 'security', 1, false),
(gen_random_uuid(), (SELECT id FROM challenges WHERE title_ar = 'منصة الخدمات الحكومية الموحدة'), 'ما هي أفضل الطرق لتكامل الأنظمة القديمة مع المنصة الجديدة؟', 'technical', 2, false),
(gen_random_uuid(), (SELECT id FROM challenges WHERE title_ar = 'نظام الذكاء الاصطناعي للتشخيص الطبي'), 'كيف يمكن ضمان دقة التشخيص والامتثال للمعايير الطبية؟', 'compliance', 1, true),
(gen_random_uuid(), (SELECT id FROM challenges WHERE title_ar = 'منصة التعليم التفاعلي بالواقع الافتراضي'), 'ما هي المتطلبات التقنية للبنية التحتية لدعم الواقع الافتراضي؟', 'infrastructure', 1, false);

-- Create comprehensive experts with different specializations
INSERT INTO experts (id, user_id, expertise_areas, experience_years, expert_level, education_background, certifications, availability_status, consultation_rate) VALUES 
(gen_random_uuid(), '8066cfaf-4a91-4985-922b-74f6a286c441', ARRAY['Digital Transformation', 'Innovation Management', 'Strategic Planning'], 15, 'senior', 'ماجستير إدارة الأعمال من جامعة الملك فهد، بكالوريوس هندسة نظم من جامعة الملك سعود', ARRAY['PMP', 'ITIL', 'Six Sigma Black Belt'], 'busy', 1500),
(gen_random_uuid(), 'fa80bed2-ed61-4c27-8941-f713cf050944', ARRAY['Project Management', 'Change Management', 'Quality Assurance'], 12, 'senior', 'ماجستير إدارة المشاريع، بكالوريوس هندسة صناعية', ARRAY['PMP', 'PRINCE2', 'Agile Certified'], 'available', 1200);

-- Create campaigns with comprehensive data
INSERT INTO campaigns (id, title_ar, description_ar, start_date, end_date, status, target_participants, target_ideas, budget, campaign_manager_id, theme, success_metrics, registration_deadline, challenge_id, department_id, sector_id) VALUES 
(gen_random_uuid(), 'حملة الابتكار الرقمي 2024', 'حملة شاملة لتحفيز الابتكار في مجال التحول الرقمي مع التركيز على الحلول الذكية للخدمات الحكومية', '2024-04-01', '2024-08-31', 'active', 500, 100, 2000000, 'fa80bed2-ed61-4c27-8941-f713cf050944', 'Digital Innovation', 'عدد الأفكار المقدمة، جودة الحلول، معدل التنفيذ', '2024-07-15', (SELECT id FROM challenges WHERE title_ar = 'منصة الخدمات الحكومية الموحدة'), (SELECT id FROM departments WHERE name = 'Digital Innovation'), (SELECT id FROM sectors WHERE name = 'Smart Cities')),

(gen_random_uuid(), 'مبادرة الابتكار في الرعاية الصحية', 'مبادرة متخصصة لتطوير حلول ابتكارية في مجال الرعاية الصحية باستخدام التقنيات الحديثة', '2024-06-01', '2024-12-31', 'planning', 300, 75, 3500000, '8066cfaf-4a91-4985-922b-74f6a286c441', 'Healthcare Innovation', 'تأثير الحلول على جودة الرعاية، توفير التكاليف، رضا المرضى', '2024-08-30', (SELECT id FROM challenges WHERE title_ar = 'نظام الذكاء الاصطناعي للتشخيص الطبي'), (SELECT id FROM departments WHERE name = 'Research & Development'), (SELECT id FROM sectors WHERE name = 'Healthcare Innovation'));

-- Create events with different formats and types
INSERT INTO events (id, title_ar, description_ar, event_date, start_time, end_time, format, location, virtual_link, event_type, max_participants, status, budget, event_manager_id, campaign_id, challenge_id, sector_id) VALUES 
(gen_random_uuid(), 'منتدى الابتكار الرقمي الأول', 'منتدى متخصص يجمع الخبراء والمبتكرين لمناقشة أحدث الاتجاهات في التحول الرقمي', '2024-05-15', '09:00', '17:00', 'hybrid', 'مركز الملك عبدالعزيز الثقافي، الظهران', 'https://meet.gov.sa/digital-forum-2024', 'forum', 300, 'scheduled', 500000, 'fa80bed2-ed61-4c27-8941-f713cf050944', (SELECT id FROM campaigns WHERE title_ar = 'حملة الابتكار الرقمي 2024'), (SELECT id FROM challenges WHERE title_ar = 'منصة الخدمات الحكومية الموحدة'), (SELECT id FROM sectors WHERE name = 'Smart Cities')),

(gen_random_uuid(), 'ورشة تطوير الحلول الصحية الذكية', 'ورشة عمل تفاعلية لتطوير نماذج أولية للحلول الصحية باستخدام الذكاء الاصطناعي', '2024-07-20', '10:00', '16:00', 'in_person', 'مدينة الملك عبدالعزيز للعلوم والتقنية، الرياض', NULL, 'workshop', 50, 'scheduled', 150000, '8066cfaf-4a91-4985-922b-74f6a286c441', (SELECT id FROM campaigns WHERE title_ar = 'مبادرة الابتكار في الرعاية الصحية'), (SELECT id FROM challenges WHERE title_ar = 'نظام الذكاء الاصطناعي للتشخيص الطبي'), (SELECT id FROM sectors WHERE name = 'Healthcare Innovation'));

-- Create comprehensive innovators with profiles
INSERT INTO innovators (id, user_id, specialization, education_level, work_experience, innovation_interests, previous_submissions, success_rate) VALUES 
(gen_random_uuid(), '8066cfaf-4a91-4985-922b-74f6a286c441', 'تقنيات ذكية', 'ماجستير', 'مدير تقني في شركة تقنية كبرى لمدة 8 سنوات', ARRAY['الذكاء الاصطناعي', 'إنترنت الأشياء', 'البلوك تشين'], 12, 75),
(gen_random_uuid(), 'fa80bed2-ed61-4c27-8941-f713cf050944', 'إدارة المشاريع', 'ماجستير', 'مديرة مشاريع في القطاع الحكومي لمدة 10 سنوات', ARRAY['التحول الرقمي', 'تحسين العمليات', 'إدارة التغيير'], 8, 80);

-- Create realistic ideas with different statuses
INSERT INTO ideas (id, title_ar, description_ar, solution_approach, implementation_plan, expected_impact, status, priority_level, innovator_id, challenge_id, focus_question_id, created_at) VALUES 
(gen_random_uuid(), 'تطبيق ذكي للخدمات الحكومية بالذكاء الاصطناعي', 'تطوير تطبيق محمول يستخدم الذكاء الاصطناعي لفهم استفسارات المواطنين وتوجيههم للخدمة المناسبة تلقائياً مع دعم معالجة اللغة الطبيعية باللغة العربية', 'استخدام نماذج الذكاء الاصطناعي المدربة على البيانات الحكومية مع واجهة محادثة ذكية', 'المرحلة الأولى: تطوير النموذج الأساسي، المرحلة الثانية: التكامل مع الأنظمة، المرحلة الثالثة: الإطلاق التجريبي', 'تحسين تجربة المواطن بنسبة 40% وتقليل وقت الحصول على الخدمات بنسبة 60%', 'under_review', 'high', (SELECT id FROM innovators WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'), (SELECT id FROM challenges WHERE title_ar = 'منصة الخدمات الحكومية الموحدة'), (SELECT id FROM focus_questions WHERE question_text_ar LIKE '%أمان البيانات%'), '2024-03-15'),

(gen_random_uuid(), 'نظام التشخيص بالصور الطبية المدعوم بالذكاء الاصطناعي', 'تطوير نظام متقدم لتحليل الصور الطبية (أشعة سينية، رنين مغناطيسي، أشعة مقطعية) باستخدام خوارزميات التعلم العميق للكشف المبكر عن الأمراض', 'استخدام شبكات التعلم العميق CNN المدربة على مجموعات بيانات طبية كبيرة مع تقنيات Transfer Learning', 'بناء قاعدة بيانات طبية، تدريب النماذج، اختبار الدقة، التكامل مع الأنظمة الطبية الحالية', 'تحسين دقة التشخيص بنسبة 25% وتقليل وقت التشخيص بنسبة 50%', 'approved', 'critical', (SELECT id FROM innovators WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'), (SELECT id FROM challenges WHERE title_ar = 'نظام الذكاء الاصطناعي للتشخيص الطبي'), (SELECT id FROM focus_questions WHERE question_text_ar LIKE '%دقة التشخيص%'), '2024-03-10');

-- Create idea evaluations
INSERT INTO idea_evaluations (id, idea_id, evaluator_id, technical_feasibility, financial_viability, market_potential, strategic_alignment, innovation_level, implementation_complexity, strengths, weaknesses, recommendations, next_steps, evaluator_type) VALUES 
(gen_random_uuid(), (SELECT id FROM ideas WHERE title_ar = 'تطبيق ذكي للخدمات الحكومية بالذكاء الاصطناعي'), '8066cfaf-4a91-4985-922b-74f6a286c441', 8, 7, 9, 9, 8, 6, 'فكرة مبتكرة ومناسبة للسياق المحلي، إمكانية تطبيق عالية', 'تحتاج لموارد تقنية كبيرة، التكامل مع الأنظمة الحالية قد يكون معقداً', 'البدء بنموذج أولي محدود ثم التوسع تدريجياً', 'إعداد دراسة جدوى تفصيلية وتحديد المتطلبات التقنية', 'technical_expert'),

(gen_random_uuid(), (SELECT id FROM ideas WHERE title_ar = 'نظام التشخيص بالصور الطبية المدعوم بالذكاء الاصطناعي'), 'fa80bed2-ed61-4c27-8941-f713cf050944', 9, 8, 8, 10, 9, 8, 'تأثير كبير على جودة الرعاية الصحية، تقنية متقدمة ومطلوبة', 'تتطلب بيانات طبية كبيرة ومعتمدة، حاجة لموافقات تنظيمية', 'التعاون مع المستشفيات الكبرى والجامعات الطبية', 'الحصول على الموافقات اللازمة وبناء شراكات استراتيجية', 'domain_expert');

-- Create additional innovation team members with different roles
INSERT INTO innovation_team_members (id, user_id, cic_role, specialization, current_workload, max_concurrent_projects, performance_rating, join_date, department, contact_email, status) VALUES 
(gen_random_uuid(), gen_random_uuid(), 'Senior Data Scientist', ARRAY['Machine Learning', 'Data Analytics', 'AI Development'], 70, 6, 88, '2024-02-10', 'Data Analytics', 'data.scientist@momah.gov.sa', 'active'),
(gen_random_uuid(), gen_random_uuid(), 'Innovation Researcher', ARRAY['Market Research', 'Trend Analysis', 'Technology Scouting'], 45, 4, 85, '2024-03-01', 'Research & Development', 'researcher@momah.gov.sa', 'active'),
(gen_random_uuid(), gen_random_uuid(), 'Partnership Manager', ARRAY['Strategic Partnerships', 'Business Development', 'Stakeholder Management'], 60, 5, 92, '2024-01-20', 'Strategic Partnerships', 'partnerships@momah.gov.sa', 'active'),
(gen_random_uuid(), gen_random_uuid(), 'UX/UI Designer', ARRAY['User Experience Design', 'Interface Design', 'Prototyping'], 55, 5, 87, '2024-02-15', 'Digital Innovation', 'design@momah.gov.sa', 'active'),
(gen_random_uuid(), gen_random_uuid(), 'Technical Architect', ARRAY['System Architecture', 'Cloud Solutions', 'Security'], 75, 7, 90, '2024-01-10', 'Technology Department', 'architect@momah.gov.sa', 'active');

-- Assign roles to users
INSERT INTO user_roles (user_id, role, is_active) VALUES 
('8066cfaf-4a91-4985-922b-74f6a286c441', 'admin', true),
('fa80bed2-ed61-4c27-8941-f713cf050944', 'team_member', true),
('8066cfaf-4a91-4985-922b-74f6a286c441', 'expert', true),
('fa80bed2-ed61-4c27-8941-f713cf050944', 'innovator', true);