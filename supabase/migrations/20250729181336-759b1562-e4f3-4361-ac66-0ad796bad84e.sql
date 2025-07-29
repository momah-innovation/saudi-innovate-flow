-- Final comprehensive seed data with valid UUIDs

-- Create additional team members with valid UUIDs and comprehensive data
INSERT INTO innovation_team_members (id, user_id, cic_role, specialization, current_workload, max_concurrent_projects, performance_rating, join_date, department, contact_email, status) VALUES 
(gen_random_uuid(), gen_random_uuid(), 'Senior Data Scientist', ARRAY['Machine Learning', 'Data Analytics', 'AI Development', 'Statistical Modeling'], 70, 6, 88, '2024-02-10', 'Data Analytics', 'data.scientist@momah.gov.sa', 'active'),
(gen_random_uuid(), gen_random_uuid(), 'Innovation Researcher', ARRAY['Market Research', 'Trend Analysis', 'Technology Scouting', 'Innovation Metrics'], 45, 4, 85, '2024-03-01', 'Research & Development', 'researcher@momah.gov.sa', 'active'),
(gen_random_uuid(), gen_random_uuid(), 'Partnership Manager', ARRAY['Strategic Partnerships', 'Business Development', 'Stakeholder Management'], 60, 5, 92, '2024-01-20', 'Strategic Partnerships', 'partnerships@momah.gov.sa', 'active'),
(gen_random_uuid(), gen_random_uuid(), 'UX/UI Designer', ARRAY['User Experience Design', 'Interface Design', 'Prototyping'], 55, 5, 87, '2024-02-15', 'Digital Innovation', 'design@momah.gov.sa', 'active'),
(gen_random_uuid(), gen_random_uuid(), 'Technical Architect', ARRAY['System Architecture', 'Cloud Solutions', 'Security'], 75, 7, 90, '2024-01-10', 'Technology Department', 'architect@momah.gov.sa', 'active'),
(gen_random_uuid(), gen_random_uuid(), 'Quality Assurance Lead', ARRAY['Quality Management', 'Testing Strategies', 'Process Improvement'], 65, 6, 89, '2024-02-05', 'Quality Department', 'qa.lead@momah.gov.sa', 'active'),
(gen_random_uuid(), gen_random_uuid(), 'Communications Specialist', ARRAY['Content Strategy', 'Public Relations', 'Social Media Management'], 50, 5, 86, '2024-02-20', 'Communications', 'communications@momah.gov.sa', 'active');

-- Add comprehensive user roles for testing different access levels
INSERT INTO user_roles (user_id, role, is_active) VALUES 
('8066cfaf-4a91-4985-922b-74f6a286c441', 'admin', true),
('8066cfaf-4a91-4985-922b-74f6a286c441', 'super_admin', true),
('fa80bed2-ed61-4c27-8941-f713cf050944', 'team_member', true),
('fa80bed2-ed61-4c27-8941-f713cf050944', 'innovator', true),
('fa80bed2-ed61-4c27-8941-f713cf050944', 'evaluator', true);

-- Add more team activities for comprehensive testing
INSERT INTO team_activities (
  team_member_id, activity_type, activity_description, hours_spent, activity_date, quality_rating
) VALUES 
-- Activities for existing team members
((SELECT id FROM innovation_team_members WHERE contact_email = 'director@momah.gov.sa'), 'strategic_planning', 'تطوير الخطة الاستراتيجية السنوية للابتكار', 20, '2024-04-01', 5),
((SELECT id FROM innovation_team_members WHERE contact_email = 'campaigns@momah.gov.sa'), 'project_coordination', 'تنسيق مشروع التحول الرقمي مع عدة إدارات', 25, '2024-04-02', 4),
((SELECT id FROM innovation_team_members WHERE contact_email = 'director@momah.gov.sa'), 'stakeholder_meeting', 'اجتماع مع أصحاب المصلحة لمراجعة التقدم', 8, '2024-04-03', 5),
((SELECT id FROM innovation_team_members WHERE contact_email = 'campaigns@momah.gov.sa'), 'team_training', 'تدريب الفريق على أدوات إدارة المشاريع الجديدة', 12, '2024-04-04', 4),
((SELECT id FROM innovation_team_members WHERE contact_email = 'director@momah.gov.sa'), 'performance_review', 'مراجعة أداء الفريق والتخطيط للربع القادم', 6, '2024-04-05', 5);

-- Add comprehensive capacity tracking
INSERT INTO team_capacity_history (
  team_member_id, week_start_date, planned_capacity_hours, allocated_hours,
  utilization_percentage, availability_status
) VALUES 
-- Weekly capacity tracking for existing members
((SELECT id FROM innovation_team_members WHERE contact_email = 'director@momah.gov.sa'), '2024-04-01', 40, 35, 88, 'overloaded'),
((SELECT id FROM innovation_team_members WHERE contact_email = 'campaigns@momah.gov.sa'), '2024-04-01', 40, 26, 65, 'available'),
((SELECT id FROM innovation_team_members WHERE contact_email = 'director@momah.gov.sa'), '2024-04-08', 40, 32, 80, 'busy'),
((SELECT id FROM innovation_team_members WHERE contact_email = 'campaigns@momah.gov.sa'), '2024-04-08', 40, 28, 70, 'busy');