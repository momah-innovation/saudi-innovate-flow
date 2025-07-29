-- Seed comprehensive core innovation team data

-- Add more diverse core team members with realistic profiles
INSERT INTO innovation_team_members (
  user_id, cic_role, specialization, current_workload, max_concurrent_projects,
  performance_rating, join_date, department, contact_email, status
) VALUES 
-- Innovation Strategist
('550e8400-e29b-41d4-a716-446655440001', 'Innovation Strategist', 
 ARRAY['Digital Transformation', 'Innovation Process Design', 'Research & Development'], 
 45, 5, 92, '2024-01-20', 'Strategy Department', 'strategy@momah.gov.sa', 'active'),

-- Senior Data Analyst
('550e8400-e29b-41d4-a716-446655440002', 'Senior Data Analyst',
 ARRAY['Data Analytics & Insights', 'Performance Metrics', 'Business Intelligence'],
 70, 7, 89, '2024-02-15', 'Analytics Department', 'analytics@momah.gov.sa', 'active'),

-- Innovation Program Manager
('550e8400-e29b-41d4-a716-446655440003', 'Innovation Program Manager',
 ARRAY['Program Management', 'Cross-functional Coordination', 'Quality Assurance'],
 55, 6, 91, '2024-01-10', 'Program Office', 'programs@momah.gov.sa', 'active'),

-- Technology Integration Specialist
('550e8400-e29b-41d4-a716-446655440004', 'Technology Integration Specialist',
 ARRAY['Technology Implementation', 'System Integration', 'Digital Solutions'],
 80, 8, 87, '2024-03-01', 'Technology Department', 'tech@momah.gov.sa', 'active'),

-- Change Management Lead
('550e8400-e29b-41d4-a716-446655440005', 'Change Management Lead',
 ARRAY['Organizational Change', 'Training & Development', 'Communication Strategy'],
 40, 4, 94, '2024-01-25', 'HR Department', 'change@momah.gov.sa', 'active'),

-- Innovation Research Coordinator
('550e8400-e29b-41d4-a716-446655440006', 'Innovation Research Coordinator',
 ARRAY['Research Coordination', 'Market Analysis', 'Trend Identification'],
 35, 4, 86, '2024-02-20', 'Research Department', 'research@momah.gov.sa', 'active');

-- Add extensive team activities for all members
INSERT INTO team_activities (
  team_member_id, activity_type, activity_description, hours_spent, activity_date, quality_rating
) VALUES 
-- Innovation Strategist activities
((SELECT id FROM innovation_team_members WHERE contact_email = 'strategy@momah.gov.sa'),
 'strategic_planning', 'تطوير استراتيجية الابتكار الرقمي وخارطة الطريق التقنية', 16, '2024-03-15', 5),
((SELECT id FROM innovation_team_members WHERE contact_email = 'strategy@momah.gov.sa'),
 'research', 'دراسة الاتجاهات العالمية في الابتكار وتحليل أفضل الممارسات', 12, '2024-03-20', 4),

-- Senior Data Analyst activities
((SELECT id FROM innovation_team_members WHERE contact_email = 'analytics@momah.gov.sa'),
 'analysis', 'تحليل بيانات الأداء وإعداد تقارير شاملة للإدارة العليا', 20, '2024-03-18', 4),
((SELECT id FROM innovation_team_members WHERE contact_email = 'analytics@momah.gov.sa'),
 'reporting', 'تصميم لوحات المؤشرات الرئيسية لقياس أثر المبادرات', 14, '2024-03-22', 5),

-- Innovation Program Manager activities
((SELECT id FROM innovation_team_members WHERE contact_email = 'programs@momah.gov.sa'),
 'coordination', 'تنسيق تنفيذ برامج الابتكار مع الجهات المختلفة', 18, '2024-03-16', 4),
((SELECT id FROM innovation_team_members WHERE contact_email = 'programs@momah.gov.sa'),
 'quality_control', 'مراجعة جودة المخرجات وضمان التوافق مع المعايير', 10, '2024-03-25', 5),

-- Technology Integration Specialist activities
((SELECT id FROM innovation_team_members WHERE contact_email = 'tech@momah.gov.sa'),
 'implementation', 'تنفيذ وتكامل الحلول التقنية للمشاريع الابتكارية', 24, '2024-03-17', 4),
((SELECT id FROM innovation_team_members WHERE contact_email = 'tech@momah.gov.sa'),
 'technical_review', 'مراجعة التصاميم التقنية وتقييم الحلول المقترحة', 16, '2024-03-21', 4),

-- Change Management Lead activities
((SELECT id FROM innovation_team_members WHERE contact_email = 'change@momah.gov.sa'),
 'training', 'تطوير وتنفيذ برامج التدريب على عمليات الابتكار', 12, '2024-03-19', 5),
((SELECT id FROM innovation_team_members WHERE contact_email = 'change@momah.gov.sa'),
 'communication', 'تطوير استراتيجية التواصل وحملات التوعية بالابتكار', 8, '2024-03-23', 4),

-- Innovation Research Coordinator activities
((SELECT id FROM innovation_team_members WHERE contact_email = 'research@momah.gov.sa'),
 'research', 'إجراء البحوث المتخصصة في مجال الابتكار الحكومي', 10, '2024-03-14', 4),
((SELECT id FROM innovation_team_members WHERE contact_email = 'research@momah.gov.sa'),
 'analysis', 'تحليل السوق وتحديد الفرص الابتكارية الجديدة', 14, '2024-03-26', 4);

-- Add capacity history for all team members
INSERT INTO team_capacity_history (
  team_member_id, week_start_date, planned_capacity_hours, allocated_hours,
  utilization_percentage, availability_status
) VALUES 
-- Innovation Strategist capacity
((SELECT id FROM innovation_team_members WHERE contact_email = 'strategy@momah.gov.sa'),
 '2024-03-18', 40, 18, 45, 'available'),
((SELECT id FROM innovation_team_members WHERE contact_email = 'strategy@momah.gov.sa'),
 '2024-03-25', 40, 20, 50, 'available'),

-- Senior Data Analyst capacity
((SELECT id FROM innovation_team_members WHERE contact_email = 'analytics@momah.gov.sa'),
 '2024-03-18', 40, 28, 70, 'busy'),
((SELECT id FROM innovation_team_members WHERE contact_email = 'analytics@momah.gov.sa'),
 '2024-03-25', 40, 30, 75, 'busy'),

-- Innovation Program Manager capacity
((SELECT id FROM innovation_team_members WHERE contact_email = 'programs@momah.gov.sa'),
 '2024-03-18', 40, 22, 55, 'available'),
((SELECT id FROM innovation_team_members WHERE contact_email = 'programs@momah.gov.sa'),
 '2024-03-25', 40, 24, 60, 'available'),

-- Technology Integration Specialist capacity
((SELECT id FROM innovation_team_members WHERE contact_email = 'tech@momah.gov.sa'),
 '2024-03-18', 40, 32, 80, 'busy'),
((SELECT id FROM innovation_team_members WHERE contact_email = 'tech@momah.gov.sa'),
 '2024-03-25', 40, 34, 85, 'overloaded'),

-- Change Management Lead capacity
((SELECT id FROM innovation_team_members WHERE contact_email = 'change@momah.gov.sa'),
 '2024-03-18', 40, 16, 40, 'available'),
((SELECT id FROM innovation_team_members WHERE contact_email = 'change@momah.gov.sa'),
 '2024-03-25', 40, 18, 45, 'available'),

-- Innovation Research Coordinator capacity
((SELECT id FROM innovation_team_members WHERE contact_email = 'research@momah.gov.sa'),
 '2024-03-18', 40, 14, 35, 'available'),
((SELECT id FROM innovation_team_members WHERE contact_email = 'research@momah.gov.sa'),
 '2024-03-25', 40, 16, 40, 'available');