-- Seed team_project_outcomes with real data from team assignments
INSERT INTO team_project_outcomes (
    assignment_id,
    team_member_id,
    project_type,
    project_id,
    outcome_type,
    outcome_description,
    success_metrics,
    target_value,
    actual_value,
    achievement_percentage,
    impact_level,
    stakeholder_satisfaction,
    budget_variance_percentage,
    timeline_variance_days,
    lessons_learned,
    recommendations,
    recognition_received,
    completed_date
) VALUES
-- Challenge-based outcomes
('5648c995-2d69-4a5e-9d5a-6c68a7790bc8', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'challenge', '65cafee8-48ab-40e2-bbf4-951ae4c03618', 'innovation', 'تطوير حلول مبتكرة لتحديات التكنولوجيا المالية', '{"ideas_generated": 15, "implementation_rate": 0.8, "stakeholder_engagement": 85}', 12, 15, 125.0, 'high', 9.2, -5.5, -3, 'أهمية التركيز على احتياجات المستخدم النهائي منذ البداية', 'زيادة التفاعل مع الجهات المعنية في المراحل المبكرة', 'جائزة الابتكار الداخلية', '2024-08-15'),

('725b6746-b8f8-46ef-9b26-28686c00ac93', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'challenge', '63cafee8-48ab-40e2-bbf4-951ae4c03616', 'efficiency', 'تحسين كفاءة العمليات الداخلية', '{"process_improvement": 25, "time_reduction": 30, "cost_savings": 150000}', 20, 25, 125.0, 'high', 8.8, 2.3, 5, 'ضرورة إشراك جميع الأقسام في عملية التطوير', 'تطوير خطة تدريب شاملة للموظفين', 'شهادة تقدير من الإدارة العليا', '2024-07-20'),

('1eaf603c-2cca-4584-940c-0ff48e55a8b7', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'challenge', '64cafee8-48ab-40e2-bbf4-951ae4c03617', 'sustainability', 'مبادرات الاستدامة البيئية', '{"carbon_reduction": 15, "waste_reduction": 40, "energy_efficiency": 20}', 10, 15, 150.0, 'medium', 8.5, -8.2, -7, 'أهمية القياس المستمر والتحسين التدريجي', 'تطوير مؤشرات أداء واضحة للاستدامة', 'جائزة المسؤولية الاجتماعية', '2024-09-10'),

('643bfb8b-f993-407d-9f7b-c87089dc28b0', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'challenge', '660e8400-e29b-41d4-a716-446655440001', 'collaboration', 'تعزيز التعاون بين الفرق', '{"cross_team_projects": 8, "knowledge_sharing": 95, "team_satisfaction": 90}', 5, 8, 160.0, 'high', 9.0, 0.0, 0, 'قوة التواصل المفتوح في بناء الثقة', 'إنشاء منصة رقمية للتعاون المستمر', 'جائزة أفضل فريق عمل', '2024-06-30'),

('683de91c-81df-4308-b704-2c7987aba6db', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'challenge', '660e8400-e29b-41d4-a716-446655440002', 'digital_transformation', 'التحول الرقمي في الخدمات', '{"digitization_rate": 80, "user_adoption": 75, "service_quality": 88}', 70, 80, 114.3, 'high', 8.7, 3.8, 10, 'أهمية التدريب المكثف أثناء التحول', 'تطوير استراتيجية تغيير إدارة شاملة', 'شهادة التميز الرقمي', '2024-08-25')