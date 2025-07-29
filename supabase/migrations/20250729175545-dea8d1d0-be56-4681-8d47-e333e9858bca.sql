-- Add comprehensive team activities and capacity data for existing team members

-- Add more team activities for the existing Innovation Director
INSERT INTO team_activities (
  team_member_id, activity_type, activity_description, hours_spent, activity_date, quality_rating
) VALUES 
-- Director activities
((SELECT id FROM innovation_team_members WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'),
 'leadership', 'قيادة اجتماع الفريق الأسبوعي ومراجعة تقدم المشاريع الجارية', 3, '2024-03-11', 5),
 
((SELECT id FROM innovation_team_members WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'),
 'strategic_review', 'مراجعة استراتيجية الابتكار ربع السنوية مع أصحاب المصلحة', 6, '2024-03-12', 5),

((SELECT id FROM innovation_team_members WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'),
 'reporting', 'إعداد تقرير الأداء الشهري وعرضه على الإدارة العليا', 4, '2024-03-13', 4),

-- Senior Manager activities  
((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'),
 'training', 'تدريب أعضاء الفريق الجدد على منهجيات إدارة المشاريع', 8, '2024-03-08', 4),

((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'),
 'stakeholder_engagement', 'اجتماعات مع الشركاء الخارجيين لتنسيق المبادرات المشتركة', 12, '2024-03-14', 5),

((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'),
 'quality_assurance', 'مراجعة جودة المخرجات وضمان التوافق مع المعايير المطلوبة', 6, '2024-03-15', 4);

-- Add extensive capacity history for existing team members
INSERT INTO team_capacity_history (
  team_member_id, week_start_date, planned_capacity_hours, allocated_hours,
  utilization_percentage, availability_status
) VALUES 
-- Director capacity trends over several weeks
((SELECT id FROM innovation_team_members WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'),
 '2024-02-26', 40, 28, 70, 'busy'),
((SELECT id FROM innovation_team_members WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'),
 '2024-03-04', 40, 32, 80, 'busy'),
((SELECT id FROM innovation_team_members WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441'),
 '2024-03-11', 40, 35, 88, 'overloaded'),

-- Senior Manager capacity trends
((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'),
 '2024-02-26', 40, 20, 50, 'available'),
((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'),
 '2024-03-04', 40, 22, 55, 'available'),
((SELECT id FROM innovation_team_members WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944'),
 '2024-03-11', 40, 28, 70, 'busy');

-- Update team member profiles with more comprehensive information
UPDATE innovation_team_members 
SET 
  specialization = ARRAY['Innovation Leadership', 'Strategic Planning', 'Performance Management', 'Team Development', 'Stakeholder Relations'],
  current_workload = 80,
  max_concurrent_projects = 10,
  performance_rating = 96
WHERE user_id = '8066cfaf-4a91-4985-922b-74f6a286c441';

UPDATE innovation_team_members 
SET 
  specialization = ARRAY['Campaign Management', 'Project Coordination', 'Change Management', 'Quality Assurance', 'Team Training'],
  current_workload = 65,
  max_concurrent_projects = 7,
  performance_rating = 90
WHERE user_id = 'fa80bed2-ed61-4c27-8941-f713cf050944';