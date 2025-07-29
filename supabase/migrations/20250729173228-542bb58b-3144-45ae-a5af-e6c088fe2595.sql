-- Seed comprehensive innovation team data with realistic relationships

-- First, let's add some more innovation team members with diverse roles
INSERT INTO innovation_team_members (
  user_id, cic_role, specialization, current_workload, max_concurrent_projects, 
  performance_rating, join_date, status, contact_email, department
) VALUES 
-- Team Leaders
('8066cfaf-4a91-4985-922b-74f6a286c441', 'Innovation Director', ARRAY['Innovation Strategy & Planning', 'Strategic Partnerships'], 
 75, 8, 95, '2024-01-15', 'active', 'director@momah.gov.sa', 'Innovation Department'),
 
-- Core Team Members  
('fa80bed2-ed61-4c27-8941-f713cf050944', 'Senior Campaign Manager', ARRAY['Project Management & Execution', 'Stakeholder Engagement'], 
 60, 6, 88, '2024-02-01', 'active', 'campaigns@momah.gov.sa', 'Campaign Department'),

-- Additional team members (using UUIDs that would exist in a real system)
('11111111-1111-1111-1111-111111111111', 'Data Analytics Lead', ARRAY['Data Analytics & Insights', 'Performance Measurement & KPIs'], 
 45, 5, 92, '2024-03-01', 'active', 'analytics@momah.gov.sa', 'Analytics Department'),
 
('22222222-2222-2222-2222-222222222222', 'Technology Innovation Specialist', ARRAY['Technology Innovation & Development', 'Digital Transformation'], 
 70, 6, 85, '2024-01-20', 'active', 'tech@momah.gov.sa', 'Technology Department'),
 
('33333333-3333-3333-3333-333333333333', 'Stakeholder Engagement Manager', ARRAY['Stakeholder Engagement', 'Partnership Development'], 
 55, 5, 90, '2024-02-15', 'active', 'stakeholders@momah.gov.sa', 'External Relations'),
 
('44444444-4444-4444-4444-444444444444', 'Content & Communications Lead', ARRAY['Content Creation & Communication', 'Public Relations & Marketing'], 
 40, 4, 87, '2024-03-10', 'active', 'content@momah.gov.sa', 'Communications'),
 
('55555555-5555-5555-5555-555555555555', 'Event Coordination Specialist', ARRAY['Event Management & Coordination', 'Training & Development'], 
 65, 5, 91, '2024-01-25', 'active', 'events@momah.gov.sa', 'Events Department'),
 
('66666666-6666-6666-6666-666666666666', 'Research & Analysis Expert', ARRAY['Research & Market Analysis', 'Quality Assurance & Evaluation'], 
 50, 5, 89, '2024-02-20', 'active', 'research@momah.gov.sa', 'Research Department'),
 
('77777777-7777-7777-7777-777777777777', 'Strategy & Planning Consultant', ARRAY['Innovation Strategy & Planning', 'Process Optimization'], 
 35, 4, 94, '2024-03-05', 'active', 'strategy@momah.gov.sa', 'Strategy Department'),
 
('88888888-8888-8888-8888-888888888888', 'Financial & Budget Analyst', ARRAY['Financial Analysis & Budgeting', 'Risk Assessment & Management'], 
 30, 3, 86, '2024-03-15', 'active', 'finance@momah.gov.sa', 'Finance Department');

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
 '2024-03-01', '2024-09-30', 'نشط', '22222222-2222-2222-2222-222222222222', 400, 80, 3000000, 'smart_cities'),
 
('مبادرة الصحة الرقمية', 'ابتكارات في مجال الصحة الرقمية والذكاء الاصطناعي الطبي',
 '2024-01-20', '2024-07-20', 'مكتمل', '33333333-3333-3333-3333-333333333333', 250, 60, 1800000, 'healthcare');

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
 'منشور', 'medium', 'تعليم', '2024-03-01', '2024-07-01', 600000, '22222222-2222-2222-2222-222222222222');

-- Add some sample events
INSERT INTO events (
  title_ar, description_ar, event_date, start_time, end_time, location, format,
  event_type, status, max_participants, event_manager_id, budget
) VALUES 
('ورشة عمل الابتكار الرقمي', 'ورشة تدريبية حول أحدث تقنيات الابتكار الرقمي وتطبيقاتها',
 '2024-04-15', '09:00:00', '17:00:00', 'مركز الابتكار الحكومي - الرياض', 'in_person',
 'workshop', 'scheduled', 100, '55555555-5555-5555-5555-555555555555', 50000),
 
('مؤتمر الاستدامة والتكنولوجيا', 'مؤتمر دولي حول دور التكنولوجيا في تحقيق الاستدامة',
 '2024-05-20', '08:00:00', '18:00:00', 'مركز الملك عبدالعزيز الدولي للمؤتمرات', 'hybrid',
 'conference', 'scheduled', 500, '33333333-3333-3333-3333-333333333333', 200000),
 
('هاكاثون المدن الذكية', 'هاكاثون لتطوير حلول مبتكرة للمدن الذكية خلال 48 ساعة',
 '2024-04-25', '18:00:00', '18:00:00', 'مدينة الملك عبدالعزيز للعلوم والتقنية', 'in_person',
 'hackathon', 'scheduled', 200, '22222222-2222-2222-2222-222222222222', 80000),
 
('ندوة الابتكار المفتوح', 'ندوة افتراضية حول مفاهيم الابتكار المفتوح والتعاون',
 '2024-03-30', '14:00:00', '16:00:00', 'منصة افتراضية', 'virtual',
 'seminar', 'completed', 300, '44444444-4444-4444-4444-444444444444', 15000);

-- Now create realistic team assignments linking members to campaigns, challenges, and events
INSERT INTO team_assignments (
  team_member_id, assignment_type, assignment_id, role_in_assignment, 
  workload_percentage, status, assigned_date, start_date, due_date,
  estimated_hours, actual_hours, assigned_by, priority, notes
) VALUES 
-- Campaign assignments
((SELECT id FROM innovation_team_members WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'), 
 'campaign', (SELECT id FROM campaigns WHERE title_ar = 'حملة الابتكار الرقمي 2024'), 
 'director', 30, 'active', '2024-01-15', '2024-01-15', '2024-06-30', 400, 120, 
 '8066cfaf-4a91-4985-922b-74f6a286c441', 'high', 'الإشراف العام على الحملة وتوجيه الاستراتيجية'),

((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'), 
 'campaign', (SELECT id FROM campaigns WHERE title_ar = 'مبادرة الاستدامة الذكية'), 
 'manager', 25, 'active', '2024-02-01', '2024-02-01', '2024-08-31', 350, 180, 
 '8066cfaf-4a91-4985-922b-74f6a286c441', 'high', 'إدارة تنفيذ المبادرة والتنسيق مع الشركاء'),

((SELECT id FROM innovation_team_members WHERE user_id = '22222222-2222-2222-2222-222222222222'), 
 'campaign', (SELECT id FROM campaigns WHERE title_ar = 'برنامج المدن الذكية'), 
 'technical_lead', 40, 'active', '2024-03-01', '2024-03-01', '2024-09-30', 480, 90, 
 '8066cfaf-4a91-4985-922b-74f6a286c441', 'high', 'قيادة الجوانب التقنية للبرنامج'),

-- Challenge assignments
((SELECT id FROM innovation_team_members WHERE user_id = '66666666-6666-6666-6666-666666666666'), 
 'challenge', (SELECT id FROM challenges WHERE title_ar = 'تحدي الذكاء الاصطناعي للخدمات الحكومية'), 
 'researcher', 20, 'active', '2024-01-15', '2024-01-15', '2024-05-15', 200, 80, 
 '8066cfaf-4a91-4985-922b-74f6a286c441', 'medium', 'البحث وتحليل الحلول المقترحة'),

((SELECT id FROM innovation_team_members WHERE user_id = '11111111-1111-1111-1111-111111111111'), 
 'challenge', (SELECT id FROM challenges WHERE title_ar = 'تحدي الطاقة المتجددة'), 
 'analyst', 25, 'active', '2024-02-01', '2024-02-01', '2024-06-01', 240, 60, 
 '8066cfaf-4a91-4985-922b-74f6a286c441', 'medium', 'تحليل البيانات وقياس الأثر'),

-- Event assignments
((SELECT id FROM innovation_team_members WHERE user_id = '55555555-5555-5555-5555-555555555555'), 
 'event', (SELECT id FROM events WHERE title_ar = 'ورشة عمل الابتكار الرقمي'), 
 'coordinator', 15, 'active', '2024-03-15', '2024-03-15', '2024-04-15', 80, 25, 
 '8066cfaf-4a91-4985-922b-74f6a286c441', 'medium', 'تنسيق الورشة وإدارة المشاركين'),

((SELECT id FROM innovation_team_members WHERE user_id = '33333333-3333-3333-3333-333333333333'), 
 'event', (SELECT id FROM events WHERE title_ar = 'مؤتمر الاستدامة والتكنولوجيا'), 
 'stakeholder_manager', 30, 'active', '2024-04-01', '2024-04-01', '2024-05-20', 160, 40, 
 '8066cfaf-4a91-4985-922b-74f6a286c441', 'high', 'إدارة علاقات أصحاب المصلحة والشراكات'),

((SELECT id FROM innovation_team_members WHERE user_id = '44444444-4444-4444-4444-444444444444'), 
 'event', (SELECT id FROM events WHERE title_ar = 'ندوة الابتكار المفتوح'), 
 'content_manager', 10, 'completed', '2024-03-01', '2024-03-01', '2024-03-30', 60, 65, 
 '8066cfaf-4a91-4985-922b-74f6a286c441', 'low', 'إنتاج المحتوى والمواد التسويقية');

-- Add team activities showing work history and accomplishments
INSERT INTO team_activities (
  team_member_id, assignment_id, activity_type, activity_description, 
  hours_spent, activity_date, quality_rating, impact_level, created_by
) VALUES 
-- Recent activities for different team members
((SELECT id FROM innovation_team_members WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'),
 (SELECT id FROM team_assignments WHERE assignment_type = 'campaign' AND role_in_assignment = 'director' LIMIT 1),
 'planning', 'وضع الخطة الاستراتيجية للحملة وتحديد المؤشرات الرئيسية', 8, '2024-01-20', 5, 'high', 
 '8066cfaf-4a91-4985-922b-74f6a286c441'),

((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'),
 (SELECT id FROM team_assignments WHERE assignment_type = 'campaign' AND role_in_assignment = 'manager' LIMIT 1),
 'coordination', 'تنسيق اجتماعات الشركاء وإعداد خطة العمل التفصيلية', 12, '2024-02-05', 4, 'medium', 
 '8066cfaf-4a91-4985-922b-74f6a286c441'),

((SELECT id FROM innovation_team_members WHERE user_id = '22222222-2222-2222-2222-222222222222'),
 (SELECT id FROM team_assignments WHERE assignment_type = 'campaign' AND role_in_assignment = 'technical_lead' LIMIT 1),
 'technical_review', 'مراجعة المتطلبات التقنية وتقييم الحلول المقترحة', 15, '2024-03-10', 5, 'high', 
 '8066cfaf-4a91-4985-922b-74f6a286c441'),

((SELECT id FROM innovation_team_members WHERE user_id = '11111111-1111-1111-1111-111111111111'),
 (SELECT id FROM team_assignments WHERE assignment_type = 'challenge' AND role_in_assignment = 'analyst' LIMIT 1),
 'analysis', 'تحليل بيانات استهلاك الطاقة وإعداد التقارير الأولية', 10, '2024-02-15', 4, 'medium', 
 '8066cfaf-4a91-4985-922b-74f6a286c441'),

((SELECT id FROM innovation_team_members WHERE user_id = '66666666-6666-6666-6666-666666666666'),
 (SELECT id FROM team_assignments WHERE assignment_type = 'challenge' AND role_in_assignment = 'researcher' LIMIT 1),
 'research', 'إجراء بحث شامل حول تطبيقات الذكاء الاصطناعي في الخدمات الحكومية', 20, '2024-02-01', 5, 'high', 
 '8066cfaf-4a91-4985-922b-74f6a286c441'),

((SELECT id FROM innovation_team_members WHERE user_id = '55555555-5555-5555-5555-555555555555'),
 (SELECT id FROM team_assignments WHERE assignment_type = 'event' AND role_in_assignment = 'coordinator' LIMIT 1),
 'coordination', 'التنسيق مع المتحدثين وحجز القاعات وإعداد الجدول الزمني', 6, '2024-03-20', 4, 'medium', 
 '8066cfaf-4a91-4985-922b-74f6a286c441'),

((SELECT id FROM innovation_team_members WHERE user_id = '44444444-4444-4444-4444-444444444444'),
 (SELECT id FROM team_assignments WHERE assignment_type = 'event' AND role_in_assignment = 'content_manager' LIMIT 1),
 'completion', 'إنتاج المحتوى التسويقي وإدارة وسائل التواصل الاجتماعي للندوة', 8, '2024-03-30', 5, 'high', 
 '8066cfaf-4a91-4985-922b-74f6a286c441');

-- Add team capacity history for performance tracking
INSERT INTO team_capacity_history (
  team_member_id, week_start_date, planned_capacity_hours, allocated_hours,
  utilization_percentage, availability_status, actual_hours_worked, efficiency_rating
) VALUES 
-- Recent weeks for different team members
((SELECT id FROM innovation_team_members WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'),
 '2024-03-18', 40, 30, 75, 'busy', 32, 85),
((SELECT id FROM innovation_team_members WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'),
 '2024-03-25', 40, 32, 80, 'busy', 35, 88),

((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'),
 '2024-03-18', 40, 24, 60, 'available', 26, 92),
((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'),
 '2024-03-25', 40, 28, 70, 'busy', 30, 90),

((SELECT id FROM innovation_team_members WHERE user_id = '22222222-2222-2222-2222-222222222222'),
 '2024-03-18', 40, 28, 70, 'busy', 30, 87),
((SELECT id FROM innovation_team_members WHERE user_id = '22222222-2222-2222-2222-222222222222'),
 '2024-03-25', 40, 32, 80, 'busy', 34, 89),

((SELECT id FROM innovation_team_members WHERE user_id = '11111111-1111-1111-1111-111111111111'),
 '2024-03-18', 40, 18, 45, 'available', 20, 95),
((SELECT id FROM innovation_team_members WHERE user_id = '11111111-1111-1111-1111-111111111111'),
 '2024-03-25', 40, 20, 50, 'available', 22, 93);