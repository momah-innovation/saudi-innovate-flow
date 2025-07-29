-- Simple seed data using only existing columns

-- Add team activities with only existing columns
INSERT INTO team_activities (
  team_member_id, activity_type, activity_description, 
  hours_spent, activity_date, quality_rating
) VALUES 
-- Activities for Innovation Director
((SELECT id FROM innovation_team_members WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'),
 'planning', 'وضع الخطة الاستراتيجية لفريق الابتكار وتحديد المؤشرات الرئيسية للأداء', 12, '2024-01-20', 5),

((SELECT id FROM innovation_team_members WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'),
 'strategic_review', 'مراجعة استراتيجية الابتكار ووضع معايير التقييم الجديدة', 8, '2024-02-10', 5),

((SELECT id FROM innovation_team_members WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'),
 'coordination', 'تنسيق الأنشطة بين الأقسام المختلفة وإعداد التقارير الدورية', 10, '2024-03-15', 4),

-- Activities for Senior Campaign Manager
((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'),
 'coordination', 'تنسيق اجتماعات الشركاء وإعداد خطة العمل التفصيلية للمشاريع', 15, '2024-02-05', 4),

((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'),
 'project_management', 'إدارة تنفيذ عدة مشاريع متوازية وتنسيق فرق العمل', 20, '2024-03-01', 4),

((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'),
 'stakeholder_engagement', 'إدارة علاقات أصحاب المصلحة وتنظيم اللقاءات الدورية', 12, '2024-03-20', 5);

-- Add team capacity history
INSERT INTO team_capacity_history (
  team_member_id, week_start_date, planned_capacity_hours, allocated_hours,
  utilization_percentage, availability_status, actual_hours_worked, efficiency_rating
) VALUES 
-- Capacity data for Director
((SELECT id FROM innovation_team_members WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'),
 '2024-03-18', 40, 30, 75, 'busy', 32, 95),
((SELECT id FROM innovation_team_members WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'),
 '2024-03-25', 40, 32, 80, 'busy', 35, 92),

-- Capacity data for Senior Manager
((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'),
 '2024-03-18', 40, 24, 60, 'available', 26, 88),
((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'),
 '2024-03-25', 40, 26, 65, 'available', 28, 85);

-- Update team member information
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