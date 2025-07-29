-- Complete comprehensive seed data with all correct constraint values

-- Create realistic challenges with all valid constraint values
INSERT INTO challenges (id, title_ar, description_ar, priority_level, status, challenge_type, sensitivity_level, start_date, end_date, estimated_budget, department_id, sector_id, deputy_id, created_by) VALUES 
(gen_random_uuid(), 'منصة الخدمات الحكومية الموحدة', 'تطوير منصة رقمية شاملة لتقديم جميع الخدمات الحكومية من خلال واجهة موحدة مع تكامل كامل مع الأنظمة الحالية', 'عالي', 'active', 'تحول رقمي', 'عادي', '2024-04-01', '2024-12-31', 5000000, (SELECT id FROM departments WHERE name = 'Digital Innovation' LIMIT 1), (SELECT id FROM sectors WHERE name = 'Smart Cities' LIMIT 1), (SELECT id FROM deputies LIMIT 1), '8066cfaf-4a91-4985-922b-74f6a286c441'),

(gen_random_uuid(), 'نظام الذكاء الاصطناعي للتشخيص الطبي', 'تطوير نظام ذكي لمساعدة الأطباء في التشخيص المبكر للأمراض باستخدام تقنيات الذكاء الاصطناعي وتحليل الصور الطبية', 'عالي', 'planning', 'ابتكار صحي', 'حساس', '2024-06-01', '2025-03-31', 8000000, (SELECT id FROM departments WHERE name = 'Research & Development' LIMIT 1), (SELECT id FROM sectors WHERE name = 'Healthcare Innovation' LIMIT 1), (SELECT id FROM deputies LIMIT 1), '8066cfaf-4a91-4985-922b-74f6a286c441'),

(gen_random_uuid(), 'منصة التعليم التفاعلي بالواقع الافتراضي', 'إنشاء بيئة تعليمية افتراضية متقدمة تستخدم تقنيات الواقع الافتراضي والمعزز لتحسين جودة التعليم وزيادة التفاعل', 'متوسط', 'active', 'تعليم', 'عادي', '2024-05-15', '2024-11-30', 3500000, (SELECT id FROM departments WHERE name = 'Digital Innovation' LIMIT 1), (SELECT id FROM sectors WHERE name = 'Education Technology' LIMIT 1), (SELECT id FROM deputies LIMIT 1), 'fa80bed2-ed61-4c27-8941-f713cf050944'),

(gen_random_uuid(), 'منظومة المدن الذكية المتكاملة', 'تطوير حلول متكاملة للمدن الذكية تشمل إدارة المرور والطاقة والنفايات باستخدام إنترنت الأشياء', 'عالي', 'planning', 'بنية تحتية ذكية', 'عادي', '2024-07-01', '2025-06-30', 12000000, (SELECT id FROM departments WHERE name = 'Strategic Partnerships' LIMIT 1), (SELECT id FROM sectors WHERE name = 'Smart Cities' LIMIT 1), (SELECT id FROM deputies LIMIT 1), '8066cfaf-4a91-4985-922b-74f6a286c441'),

(gen_random_uuid(), 'نظام إدارة النفايات الذكي', 'تطوير نظام متكامل لإدارة النفايات باستخدام تقنيات الذكاء الاصطناعي وإنترنت الأشياء لتحسين الكفاءة البيئية', 'متوسط', 'active', 'استدامة', 'عادي', '2024-03-15', '2024-10-31', 4500000, (SELECT id FROM departments WHERE name = 'Change Management' LIMIT 1), (SELECT id FROM sectors WHERE name = 'Environmental Solutions' LIMIT 1), (SELECT id FROM deputies LIMIT 1), 'fa80bed2-ed61-4c27-8941-f713cf050944');

-- Create comprehensive innovators
INSERT INTO innovators (id, user_id, specialization, education_level, work_experience, innovation_interests, previous_submissions, success_rate) VALUES 
(gen_random_uuid(), '8066cfaf-4a91-4985-922b-74f6a286c441', 'تقنيات ذكية', 'ماجستير', 'مدير تقني في شركة تقنية كبرى لمدة 8 سنوات', ARRAY['الذكاء الاصطناعي', 'إنترنت الأشياء', 'البلوك تشين'], 12, 75),
(gen_random_uuid(), 'fa80bed2-ed61-4c27-8941-f713cf050944', 'إدارة المشاريع', 'ماجستير', 'مديرة مشاريع في القطاع الحكومي لمدة 10 سنوات', ARRAY['التحول الرقمي', 'تحسين العمليات', 'إدارة التغيير'], 8, 80);

-- Create realistic ideas with different statuses
INSERT INTO ideas (id, title_ar, description_ar, solution_approach, implementation_plan, expected_impact, status, priority_level, innovator_id, challenge_id, focus_question_id, created_at) VALUES 
(gen_random_uuid(), 'تطبيق ذكي للخدمات الحكومية بالذكاء الاصطناعي', 'تطوير تطبيق محمول يستخدم الذكاء الاصطناعي لفهم استفسارات المواطنين وتوجيههم للخدمة المناسبة تلقائياً مع دعم معالجة اللغة الطبيعية باللغة العربية', 'استخدام نماذج الذكاء الاصطناعي المدربة على البيانات الحكومية مع واجهة محادثة ذكية', 'المرحلة الأولى: تطوير النموذج الأساسي، المرحلة الثانية: التكامل مع الأنظمة، المرحلة الثالثة: الإطلاق التجريبي', 'تحسين تجربة المواطن بنسبة 40% وتقليل وقت الحصول على الخدمات بنسبة 60%', 'under_review', 'عالي', (SELECT id FROM innovators WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'), (SELECT id FROM challenges WHERE title_ar = 'منصة الخدمات الحكومية الموحدة' LIMIT 1), (SELECT id FROM focus_questions LIMIT 1), '2024-03-15'),

(gen_random_uuid(), 'نظام التشخيص بالصور الطبية المدعوم بالذكاء الاصطناعي', 'تطوير نظام متقدم لتحليل الصور الطبية (أشعة سينية، رنين مغناطيسي، أشعة مقطعية) باستخدام خوارزميات التعلم العميق للكشف المبكر عن الأمراض', 'استخدام شبكات التعلم العميق CNN المدربة على مجموعات بيانات طبية كبيرة مع تقنيات Transfer Learning', 'بناء قاعدة بيانات طبية، تدريب النماذج، اختبار الدقة، التكامل مع الأنظمة الطبية الحالية', 'تحسين دقة التشخيص بنسبة 25% وتقليل وقت التشخيص بنسبة 50%', 'approved', 'عالي', (SELECT id FROM innovators WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'), (SELECT id FROM challenges WHERE title_ar = 'نظام الذكاء الاصطناعي للتشخيص الطبي' LIMIT 1), (SELECT id FROM focus_questions LIMIT 1 OFFSET 1), '2024-03-10');

-- Assign user roles 
INSERT INTO user_roles (user_id, role, is_active) VALUES 
('8066cfaf-4a91-4985-922b-74f6a286c441', 'admin', true),
('fa80bed2-ed61-4c27-8941-f713cf050944', 'team_member', true),
('8066cfaf-4a91-4985-922b-74f6a286c441', 'expert', true),
('fa80bed2-ed61-4c27-8941-f713cf050944', 'innovator', true);

-- Add more team activities and capacity data for comprehensive testing
INSERT INTO team_activities (
  team_member_id, activity_type, activity_description, hours_spent, activity_date, quality_rating
) VALUES 
-- More activities for all team members
((SELECT id FROM innovation_team_members WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'),
 'evaluation', 'تقييم الأفكار المقدمة في حملة الابتكار الرقمي والتعليق عليها', 10, '2024-03-27', 5),
((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'),
 'workshop_facilitation', 'تسهيل ورشة عمل تطوير الحلول المبتكرة مع فرق متعددة التخصصات', 6, '2024-03-28', 4);