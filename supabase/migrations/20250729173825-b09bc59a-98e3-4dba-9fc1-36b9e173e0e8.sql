-- Seed realistic team data using only existing users
-- We'll use the two existing users and create meaningful assignments

-- Update existing team members with more detailed information
UPDATE innovation_team_members 
SET 
  cic_role = 'Innovation Director',
  specialization = ARRAY['Innovation Strategy & Planning', 'Strategic Partnerships'],
  current_workload = 75,
  max_concurrent_projects = 8,
  performance_rating = 95,
  join_date = '2024-01-15',
  department = 'Innovation Department',
  contact_email = 'director@momah.gov.sa'
WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441';

UPDATE innovation_team_members 
SET 
  cic_role = 'Senior Campaign Manager',
  specialization = ARRAY['Project Management & Execution', 'Stakeholder Engagement'],
  current_workload = 60,
  max_concurrent_projects = 6,
  performance_rating = 88,
  join_date = '2024-02-01',
  department = 'Campaign Department',
  contact_email = 'campaigns@momah.gov.sa'
WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944';

-- Add some sample campaigns for assignments
INSERT INTO campaigns (
  title_ar, description_ar, start_date, end_date, status, campaign_manager_id,
  target_participants, target_ideas, budget, theme
) VALUES 
('حملة الابتكار الرقمي 2024', 'حملة شاملة لتطوير الحلول الرقمية المبتكرة في القطاع الحكومي', 
 '2024-01-15', '2024-06-30', 'نشط', '8066cfaf-4a91-4985-922b-74f6a286c441', 500, 100, 2000000, 'digital_transformation'),
 
('مبادرة الاستدامة الذكية', 'تطوير حلول مبتكرة للاستدامة البيئية والطاقة المتجددة',
 '2024-02-01', '2024-08-31', 'نشط', 'fa80bed2-ed61-4c27-8941-f713cf050944', 300, 75, 1500000, 'sustainability'),
 
('برنامج المدن الذكية', 'تطوير تقنيات المدن الذكية وحلول النقل المستدام',
 '2024-03-01', '2024-09-30', 'نشط', '8066cfaf-4a91-4985-922b-74f6a286c441', 400, 80, 3000000, 'smart_cities'),
 
('مبادرة الصحة الرقمية', 'ابتكارات في مجال الصحة الرقمية والذكاء الاصطناعي الطبي',
 '2024-01-20', '2024-07-20', 'مكتمل', 'fa80bed2-ed61-4c27-8941-f713cf050944', 250, 60, 1800000, 'healthcare');

-- Add some sample challenges
INSERT INTO challenges (
  title_ar, description_ar, status, priority_level, challenge_type, 
  start_date, end_date, estimated_budget, created_by
) VALUES 
('تحدي الذكاء الاصطناعي للخدمات الحكومية', 'تطوير حلول ذكاء اصطناعي لتحسين الخدمات الحكومية وتجربة المواطنين',
 'نشط', 'high', 'تقنية', '2024-01-15', '2024-05-15', 800000, '8066cfaf-4a91-4985-922b-74f6a286c441'),
 
('تحدي الطاقة المتجددة', 'ابتكار حلول جديدة لزيادة كفاءة الطاقة المتجددة في المباني الحكومية',
 'نشط', 'high', 'استدامة', '2024-02-01', '2024-06-01', 1200000, 'fa80bed2-ed61-4c27-8941-f713cf050944'),
 
('تحدي التعليم التفاعلي', 'تطوير منصات تعليمية تفاعلية باستخدام الواقع المعزز والافتراضي',
 'منشور', 'medium', 'تعليم', '2024-03-01', '2024-07-01', 600000, '8066cfaf-4a91-4985-922b-74f6a286c441');

-- Add some sample events
INSERT INTO events (
  title_ar, description_ar, event_date, start_time, end_time, location, format,
  event_type, status, max_participants, event_manager_id, budget
) VALUES 
('ورشة عمل الابتكار الرقمي', 'ورشة تدريبية حول أحدث تقنيات الابتكار الرقمي وتطبيقاتها',
 '2024-04-15', '09:00:00', '17:00:00', 'مركز الابتكار الحكومي - الرياض', 'in_person',
 'workshop', 'scheduled', 100, '8066cfaf-4a91-4985-922b-74f6a286c441', 50000),
 
('مؤتمر الاستدامة والتكنولوجيا', 'مؤتمر دولي حول دور التكنولوجيا في تحقيق الاستدامة',
 '2024-05-20', '08:00:00', '18:00:00', 'مركز الملك عبدالعزيز الدولي للمؤتمرات', 'hybrid',
 'conference', 'scheduled', 500, 'fa80bed2-ed61-4c27-8941-f713cf050944', 200000),
 
('هاكاثون المدن الذكية', 'هاكاثون لتطوير حلول مبتكرة للمدن الذكية خلال 48 ساعة',
 '2024-04-25', '18:00:00', '18:00:00', 'مدينة الملك عبدالعزيز للعلوم والتقنية', 'in_person',
 'hackathon', 'scheduled', 200, '8066cfaf-4a91-4985-922b-74f6a286c441', 80000),
 
('ندوة الابتكار المفتوح', 'ندوة افتراضية حول مفاهيم الابتكار المفتوح والتعاون',
 '2024-03-30', '14:00:00', '16:00:00', 'منصة افتراضية', 'virtual',
 'seminar', 'completed', 300, 'fa80bed2-ed61-4c27-8941-f713cf050944', 15000);

-- Now create realistic team assignments for the existing team members
INSERT INTO team_assignments (
  team_member_id, assignment_type, assignment_id, role_in_assignment, 
  workload_percentage, status, assigned_date, start_date, due_date,
  estimated_hours, actual_hours, assigned_by, priority, notes
) VALUES 
-- Campaign assignments for Director (user 8066cfaf...)
((SELECT id FROM innovation_team_members WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'), 
 'campaign', (SELECT id FROM campaigns WHERE title_ar = 'حملة الابتكار الرقمي 2024'), 
 'director', 30, 'active', '2024-01-15', '2024-01-15', '2024-06-30', 400, 120, 
 '8066cfaf-4a91-4985-922b-74f6a286c441', 'high', 'الإشراف العام على الحملة وتوجيه الاستراتيجية'),

((SELECT id FROM innovation_team_members WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'), 
 'campaign', (SELECT id FROM campaigns WHERE title_ar = 'برنامج المدن الذكية'), 
 'strategic_advisor', 25, 'active', '2024-03-01', '2024-03-01', '2024-09-30', 300, 60, 
 '8066cfaf-4a91-4985-922b-74f6a286c441', 'high', 'الإشراف الاستراتيجي على البرنامج'),

-- Campaign assignments for Senior Manager (user fa80bed2...)
((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'), 
 'campaign', (SELECT id FROM campaigns WHERE title_ar = 'مبادرة الاستدامة الذكية'), 
 'manager', 30, 'active', '2024-02-01', '2024-02-01', '2024-08-31', 350, 180, 
 '8066cfaf-4a91-4985-922b-74f6a286c441', 'high', 'إدارة تنفيذ المبادرة والتنسيق مع الشركاء'),

((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'), 
 'campaign', (SELECT id FROM campaigns WHERE title_ar = 'مبادرة الصحة الرقمية'), 
 'lead_manager', 30, 'completed', '2024-01-20', '2024-01-20', '2024-07-20', 400, 420, 
 '8066cfaf-4a91-4985-922b-74f6a286c441', 'high', 'قيادة فريق تنفيذ مبادرة الصحة الرقمية'),

-- Challenge assignments
((SELECT id FROM innovation_team_members WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'), 
 'challenge', (SELECT id FROM challenges WHERE title_ar = 'تحدي الذكاء الاصطناعي للخدمات الحكومية'), 
 'strategic_lead', 15, 'active', '2024-01-15', '2024-01-15', '2024-05-15', 150, 50, 
 '8066cfaf-4a91-4985-922b-74f6a286c441', 'medium', 'القيادة الاستراتيجية للتحدي'),

((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'), 
 'challenge', (SELECT id FROM challenges WHERE title_ar = 'تحدي الطاقة المتجددة'), 
 'project_manager', 20, 'active', '2024-02-01', '2024-02-01', '2024-06-01', 200, 80, 
 '8066cfaf-4a91-4985-922b-74f6a286c441', 'medium', 'إدارة مشروع التحدي وتنسيق الفرق'),

-- Event assignments
((SELECT id FROM innovation_team_members WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'), 
 'event', (SELECT id FROM events WHERE title_ar = 'ورشة عمل الابتكار الرقمي'), 
 'keynote_speaker', 5, 'active', '2024-03-15', '2024-03-15', '2024-04-15', 20, 8, 
 '8066cfaf-4a91-4985-922b-74f6a286c441', 'medium', 'المتحدث الرئيسي في الورشة'),

((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'), 
 'event', (SELECT id FROM events WHERE title_ar = 'مؤتمر الاستدامة والتكنولوجيا'), 
 'event_manager', 10, 'active', '2024-04-01', '2024-04-01', '2024-05-20', 80, 20, 
 '8066cfaf-4a91-4985-922b-74f6a286c441', 'high', 'إدارة تنظيم المؤتمر والتنسيق'),

((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'), 
 'event', (SELECT id FROM events WHERE title_ar = 'ندوة الابتكار المفتوح'), 
 'facilitator', 5, 'completed', '2024-03-01', '2024-03-01', '2024-03-30', 30, 35, 
 '8066cfaf-4a91-4985-922b-74f6a286c441', 'low', 'تيسير الندوة وإدارة النقاشات');

-- Add team activities showing work history and accomplishments
INSERT INTO team_activities (
  team_member_id, assignment_id, activity_type, activity_description, 
  hours_spent, activity_date, quality_rating, impact_level, created_by
) VALUES 
-- Recent activities for Director
((SELECT id FROM innovation_team_members WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'),
 (SELECT id FROM team_assignments WHERE assignment_type = 'campaign' AND role_in_assignment = 'director' LIMIT 1),
 'planning', 'وضع الخطة الاستراتيجية للحملة وتحديد المؤشرات الرئيسية للأداء', 12, '2024-01-20', 5, 'high', 
 '8066cfaf-4a91-4985-922b-74f6a286c441'),

((SELECT id FROM innovation_team_members WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'),
 (SELECT id FROM team_assignments WHERE assignment_type = 'challenge' AND role_in_assignment = 'strategic_lead' LIMIT 1),
 'strategic_review', 'مراجعة استراتيجية التحدي ووضع معايير التقييم', 8, '2024-02-10', 5, 'high', 
 '8066cfaf-4a91-4985-922b-74f6a286c441'),

((SELECT id FROM innovation_team_members WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'),
 (SELECT id FROM team_assignments WHERE assignment_type = 'event' AND role_in_assignment = 'keynote_speaker' LIMIT 1),
 'preparation', 'إعداد العرض التقديمي الرئيسي والمواد التعليمية', 6, '2024-04-10', 4, 'medium', 
 '8066cfaf-4a91-4985-922b-74f6a286c441'),

-- Recent activities for Senior Manager
((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'),
 (SELECT id FROM team_assignments WHERE assignment_type = 'campaign' AND role_in_assignment = 'manager' LIMIT 1),
 'coordination', 'تنسيق اجتماعات الشركاء وإعداد خطة العمل التفصيلية للمبادرة', 15, '2024-02-05', 4, 'medium', 
 '8066cfaf-4a91-4985-922b-74f6a286c441'),

((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'),
 (SELECT id FROM team_assignments WHERE assignment_type = 'campaign' AND role_in_assignment = 'lead_manager' LIMIT 1),
 'completion', 'إنجاز مبادرة الصحة الرقمية وتسليم التقرير النهائي', 20, '2024-07-20', 5, 'high', 
 '8066cfaf-4a91-4985-922b-74f6a286c441'),

((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'),
 (SELECT id FROM team_assignments WHERE assignment_type = 'challenge' AND role_in_assignment = 'project_manager' LIMIT 1),
 'project_management', 'تنسيق فرق العمل وإدارة الجدول الزمني للتحدي', 10, '2024-03-01', 4, 'medium', 
 '8066cfaf-4a91-4985-922b-74f6a286c441'),

((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'),
 (SELECT id FROM team_assignments WHERE assignment_type = 'event' AND role_in_assignment = 'facilitator' LIMIT 1),
 'completion', 'تيسير ندوة الابتكار المفتوح وإدارة جلسات النقاش', 8, '2024-03-30', 5, 'high', 
 '8066cfaf-4a91-4985-922b-74f6a286c441');

-- Add team capacity history for performance tracking
INSERT INTO team_capacity_history (
  team_member_id, week_start_date, planned_capacity_hours, allocated_hours,
  utilization_percentage, availability_status, actual_hours_worked, efficiency_rating
) VALUES 
-- Recent weeks for Director
((SELECT id FROM innovation_team_members WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'),
 '2024-03-18', 40, 30, 75, 'busy', 32, 95),
((SELECT id FROM innovation_team_members WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'),
 '2024-03-25', 40, 32, 80, 'busy', 35, 92),
((SELECT id FROM innovation_team_members WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'),
 '2024-04-01', 40, 28, 70, 'busy', 30, 90),

-- Recent weeks for Senior Manager
((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'),
 '2024-03-18', 40, 24, 60, 'available', 26, 88),
((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'),
 '2024-03-25', 40, 26, 65, 'available', 28, 85),
((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'),
 '2024-04-01', 40, 30, 75, 'busy', 32, 87);