-- Simple final seed with specific IDs to avoid subquery conflicts

-- Create additional comprehensive team members using new UUIDs
INSERT INTO innovation_team_members (id, user_id, cic_role, specialization, current_workload, max_concurrent_projects, performance_rating, join_date, department, contact_email, status) VALUES 
('7f6d5c4b-3e2a-1f9b-8e7d-6c5b4a39f8e7', 'dd11e33c-22aa-44bb-99cc-ee55ff6677aa', 'Senior Data Scientist', ARRAY['Machine Learning', 'Data Analytics', 'AI Development', 'Statistical Modeling'], 70, 6, 88, '2024-02-10', 'Data Analytics', 'data.scientist@momah.gov.sa', 'active'),

('8e7d6c5b-4f3a-2f8c-9e8d-7c6b5a48e9f8', 'ee22f44d-33bb-55cc-aabb-ff66gg7788bb', 'Innovation Researcher', ARRAY['Market Research', 'Trend Analysis', 'Technology Scouting', 'Innovation Metrics'], 45, 4, 85, '2024-03-01', 'Research & Development', 'researcher@momah.gov.sa', 'active'),

('9f8e7d6c-5a4b-3f9d-af9e-8d7c6b59faaf', 'ff33g55e-44cc-66dd-bbcc-gg77hh8899cc', 'Partnership Manager', ARRAY['Strategic Partnerships', 'Business Development', 'Stakeholder Management', 'Contract Negotiation'], 60, 5, 92, '2024-01-20', 'Strategic Partnerships', 'partnerships@momah.gov.sa', 'active'),

('af9e8d7c-6b5a-4fae-bfaf-9e8d7c6bafbf', 'gg44h66f-55dd-77ee-ccdd-hh88ii99aadd', 'UX/UI Designer', ARRAY['User Experience Design', 'Interface Design', 'Prototyping', 'User Research'], 55, 5, 87, '2024-02-15', 'Digital Innovation', 'design@momah.gov.sa', 'active'),

('bfaf9e8d-7c6b-5abf-cfbf-af9e8d7cbfcf', 'hh55i77g-66ee-88ff-ddee-ii99jj00bbee', 'Technical Architect', ARRAY['System Architecture', 'Cloud Solutions', 'Security', 'Integration Design'], 75, 7, 90, '2024-01-10', 'Technology Department', 'architect@momah.gov.sa', 'active');

-- Add comprehensive team activities for existing and new members
INSERT INTO team_activities (
  team_member_id, activity_type, activity_description, hours_spent, activity_date, quality_rating
) VALUES 
-- Activities for existing team members
('f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'evaluation', 'تقييم الأفكار المقدمة في حملة الابتكار الرقمي والتعليق عليها', 10, '2024-03-27', 5),
('71e0fb71-c8f6-455c-a10a-8ced61ca830a', 'workshop_facilitation', 'تسهيل ورشة عمل تطوير الحلول المبتكرة مع فرق متعددة التخصصات', 6, '2024-03-28', 4),

-- Activities for new team members
('7f6d5c4b-3e2a-1f9b-8e7d-6c5b4a39f8e7', 'data_analysis', 'تحليل بيانات المنصة وإعداد تقارير الأداء الشهرية', 15, '2024-03-29', 4),
('8e7d6c5b-4f3a-2f8c-9e8d-7c6b5a48e9f8', 'market_research', 'إجراء بحث السوق للتقنيات الناشئة في مجال الابتكار', 12, '2024-03-30', 5),
('9f8e7d6c-5a4b-3f9d-af9e-8d7c6b59faaf', 'partnership_development', 'تطوير شراكات استراتيجية مع القطاع الخاص', 18, '2024-03-31', 4);

-- Add capacity history for all team members
INSERT INTO team_capacity_history (
  team_member_id, week_start_date, planned_capacity_hours, allocated_hours,
  utilization_percentage, availability_status
) VALUES 
-- Capacity for new team members
('7f6d5c4b-3e2a-1f9b-8e7d-6c5b4a39f8e7', '2024-03-25', 40, 28, 70, 'busy'),
('8e7d6c5b-4f3a-2f8c-9e8d-7c6b5a48e9f8', '2024-03-25', 40, 18, 45, 'available'),
('9f8e7d6c-5a4b-3f9d-af9e-8d7c6b59faaf', '2024-03-25', 40, 24, 60, 'available'),
('af9e8d7c-6b5a-4fae-bfaf-9e8d7c6bafbf', '2024-03-25', 40, 22, 55, 'available'),
('bfaf9e8d-7c6b-5abf-cfbf-af9e8d7cbfcf', '2024-03-25', 40, 30, 75, 'busy');