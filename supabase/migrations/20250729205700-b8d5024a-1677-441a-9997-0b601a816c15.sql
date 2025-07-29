-- Comprehensive seeding for all remaining empty tables
-- Using existing foreign key IDs from database records

-- 1. Challenge Requirements
INSERT INTO challenge_requirements (challenge_id, title, description, requirement_type, is_mandatory, weight_percentage, order_sequence) VALUES
('65cafee8-48ab-40e2-bbf4-951ae4c03618', 'Technical Feasibility Assessment', 'تقييم الجدوى التقنية للحل المقترح', 'technical', true, 25.0, 1),
('65cafee8-48ab-40e2-bbf4-951ae4c03618', 'Market Impact Analysis', 'تحليل الأثر على السوق والمجتمع', 'business', true, 25.0, 2),
('63cafee8-48ab-40e2-bbf4-951ae4c03616', 'Innovation Level Assessment', 'تقييم مستوى الابتكار في الحل', 'innovation', true, 30.0, 1),
('64cafee8-48ab-40e2-bbf4-951ae4c03617', 'Resource Requirements', 'تحديد الموارد المطلوبة للتنفيذ', 'resource', false, 20.0, 1);

-- 2. Idea Analytics
INSERT INTO idea_analytics (idea_id, metric_name, metric_value, recorded_by, metric_data) VALUES
('508948d0-2568-4b32-8b3c-b779d31edf97', 'evaluation_count', 3, 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', '{"evaluations": 3, "avg_score": 7.5}'),
('880e8400-e29b-41d4-a716-446655440001', 'comment_count', 5, '71e0fb71-c8f6-455c-a10a-8ced61ca830a', '{"comments": 5, "public": 3, "internal": 2}'),
('880e8400-e29b-41d4-a716-446655440002', 'view_count', 45, '392bb10b-f2a8-4791-8f8b-510262056f9a', '{"views": 45, "unique_visitors": 23}'),
('880e8400-e29b-41d4-a716-446655440005', 'average_evaluation_score', 8.2, '98c13bbb-edf7-44cb-b483-099637988714', '{"total_score": 8.2, "criteria_breakdown": {"technical": 8, "market": 9, "innovation": 8}}');

-- 3. Implementation Tracker
INSERT INTO implementation_tracker (idea_id, implementation_stage, progress_percentage, milestone_description, estimated_completion_date, actual_completion_date, updated_by, notes) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'planning', 75, 'مرحلة التخطيط الأولي', '2024-09-30', NULL, 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'جاري وضع الخطة التفصيلية'),
('880e8400-e29b-41d4-a716-446655440002', 'development', 40, 'مرحلة التطوير', '2024-12-15', NULL, '71e0fb71-c8f6-455c-a10a-8ced61ca830a', 'بدء مرحلة التطوير الفعلية'),
('880e8400-e29b-41d4-a716-446655440005', 'testing', 90, 'مرحلة الاختبار', '2024-08-30', '2024-08-28', '392bb10b-f2a8-4791-8f8b-510262056f9a', 'اكتمال الاختبارات بنجاح');

-- 4. Innovation Maturity Index
INSERT INTO innovation_maturity_index (entity_type, entity_id, maturity_score, assessment_date, assessed_by, criteria_scores, improvement_recommendations) VALUES
('challenge', '65cafee8-48ab-40e2-bbf4-951ae4c03618', 7.5, '2024-07-29', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', '{"strategy": 8, "process": 7, "technology": 8, "culture": 7}', '{"areas": ["تحسين العمليات", "تطوير الثقافة التقنية"]}'),
('idea', '880e8400-e29b-41d4-a716-446655440001', 8.2, '2024-07-28', '71e0fb71-c8f6-455c-a10a-8ced61ca830a', '{"novelty": 9, "feasibility": 8, "impact": 8, "scalability": 8}', '{"areas": ["تحسين قابلية التطبيق", "دراسة إمكانية التوسع"]}'),
('campaign', '50793935-4861-4bb5-8645-d3c698402b1a', 6.8, '2024-07-27', '392bb10b-f2a8-4791-8f8b-510262056f9a', '{"planning": 7, "execution": 6, "monitoring": 7, "outcomes": 7}', '{"areas": ["تحسين آليات التنفيذ", "تطوير أدوات المراقبة"]}');

-- 5. Insights
INSERT INTO insights (insight_type, title, description, data_source, insight_data, generated_by, visibility_level, tags) VALUES
('trend', 'اتجاهات الابتكار في التكنولوجيا المالية', 'تحليل اتجاهات الابتكار في قطاع التكنولوجيا المالية خلال الربع الأخير', 'idea_submissions', '{"trend_direction": "increasing", "growth_rate": 35, "key_areas": ["blockchain", "ai", "mobile_payments"]}', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'public', ARRAY['تكنولوجيا مالية', 'اتجاهات']),
('performance', 'أداء فرق الابتكار', 'تقرير عن أداء فرق الابتكار وإنتاجيتها', 'team_metrics', '{"avg_productivity": 78, "completion_rate": 85, "quality_score": 8.2}', '71e0fb71-c8f6-455c-a10a-8ced61ca830a', 'internal', ARRAY['أداء', 'فرق العمل']),
('challenge', 'تحديات القطاع الصحي', 'تحليل التحديات الرئيسية في قطاع الرعاية الصحية', 'challenge_analysis', '{"main_challenges": ["cost", "accessibility", "technology_adoption"], "priority_level": "high"}', '392bb10b-f2a8-4791-8f8b-510262056f9a', 'public', ARRAY['صحة', 'تحديات']);

-- 6. Opportunity Status
INSERT INTO opportunity_status (idea_id, status_type, current_status, status_date, status_reason, updated_by, next_milestone, estimated_timeline) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'development', 'in_progress', '2024-07-29', 'انتقلت الفكرة إلى مرحلة التطوير بعد الموافقة', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'prototype_completion', '2024-11-30'),
('880e8400-e29b-41d4-a716-446655440002', 'evaluation', 'pending_review', '2024-07-28', 'في انتظار مراجعة اللجنة الفنية', '71e0fb71-c8f6-455c-a10a-8ced61ca830a', 'technical_review', '2024-08-15'),
('880e8400-e29b-41d4-a716-446655440005', 'funding', 'approved', '2024-07-27', 'تمت الموافقة على التمويل المطلوب', '392bb10b-f2a8-4791-8f8b-510262056f9a', 'implementation_start', '2024-09-01');

-- 7. Role Assignments
INSERT INTO role_assignments (user_id, role_name, assigned_by, assignment_context, assignment_scope, is_temporary, expires_at) VALUES
('8066cfaf-4a91-4985-922b-74f6a286c441', 'challenge_lead', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'challenge_65cafee8-48ab-40e2-bbf4-951ae4c03618', 'challenge_specific', false, NULL),
('fa80bed2-ed61-4c27-8941-f713cf050944', 'expert_evaluator', '71e0fb71-c8f6-455c-a10a-8ced61ca830a', 'evaluation_committee', 'department_wide', false, NULL),
('cb18b70f-a8fb-4265-bed0-a086ed236c22', 'innovation_mentor', '392bb10b-f2a8-4791-8f8b-510262056f9a', 'mentorship_program', 'organization_wide', true, '2025-07-29');

-- 8. Role Audit Log
INSERT INTO role_audit_log (action_type, target_user_id, target_role, performed_by, justification, metadata) VALUES
('ASSIGN', '8066cfaf-4a91-4985-922b-74f6a286c441', 'expert', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'خبرة واسعة في المجال التقني', '{"assignment_context": "project_leadership", "approved_by": "committee"}'),
('MODIFY', 'fa80bed2-ed61-4c27-8941-f713cf050944', 'team_member', '71e0fb71-c8f6-455c-a10a-8ced61ca830a', 'ترقية بناء على الأداء المميز', '{"previous_role": "innovator", "performance_rating": 9}'),
('REVOKE', 'cb18b70f-a8fb-4265-bed0-a086ed236c22', 'temporary_access', '392bb10b-f2a8-4791-8f8b-510262056f9a', 'انتهاء فترة المشروع المؤقت', '{"project_id": "temp_project_2024", "completion_status": "completed"}');

-- 9. Team Project Outcomes
INSERT INTO team_project_outcomes (team_id, project_type, project_id, outcome_type, success_metrics, completion_date, lessons_learned, impact_assessment, recorded_by) VALUES
('504552ff-b47b-437d-aef5-72db5a3d3125', 'challenge', '65cafee8-48ab-40e2-bbf4-951ae4c03618', 'success', '{"ideas_generated": 45, "approval_rate": 78, "implementation_rate": 23}', '2024-07-15', 'تحسين عملية التقييم الأولي يزيد من جودة الأفكار', '{"innovation_score": 8.5, "team_satisfaction": 9.2}', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e'),
('196bba8a-3e68-45fc-b026-343d09fde1f7', 'campaign', '50793935-4861-4bb5-8645-d3c698402b1a', 'partial_success', '{"participation_rate": 82, "idea_quality": 7.8, "stakeholder_engagement": 85}', '2024-07-20', 'أهمية التواصل المستمر مع أصحاب المصلحة', '{"reach": 1200, "engagement_quality": 7.9}', '71e0fb71-c8f6-455c-a10a-8ced61ca830a'),
('b98ed45f-937d-4264-95b4-79038ffefe00', 'idea_development', '880e8400-e29b-41d4-a716-446655440001', 'in_progress', '{"development_progress": 65, "milestone_completion": 4, "budget_utilization": 58}', NULL, 'التعاون متعدد التخصصات يعزز الابتكار', '{"projected_impact": 8.7, "feasibility_score": 8.2}', '392bb10b-f2a8-4791-8f8b-510262056f9a');

-- 10. Trend Reports
INSERT INTO trend_reports (report_type, title, description, time_period_start, time_period_end, key_findings, data_sources, generated_by, report_data, visibility_level) VALUES
('quarterly', 'تقرير الاتجاهات ربع السنوية - Q2 2024', 'تحليل شامل لاتجاهات الابتكار في الربع الثاني', '2024-04-01', '2024-06-30', ARRAY['زيادة 35% في أفكار الذكاء الاصطناعي', 'تركز 60% من التحديات على الاستدامة', 'ارتفاع مشاركة الشباب بنسبة 28%'], ARRAY['ideas', 'challenges', 'evaluations'], 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', '{"total_ideas": 156, "success_rate": 23, "trending_sectors": ["ai", "sustainability", "healthcare"]}', 'public'),
('annual', 'تقرير الأداء السنوي 2023', 'مراجعة شاملة لأداء النظام خلال عام 2023', '2023-01-01', '2023-12-31', ARRAY['تحقيق 89% من أهداف الابتكار', 'زيادة عدد الشراكات بنسبة 45%', 'تطوير 12 حل مبتكر'], ARRAY['all_modules'], '71e0fb71-c8f6-455c-a10a-8ced61ca830a', '{"total_ideas": 890, "implementations": 67, "partnerships": 45, "impact_score": 8.9}', 'internal'),
('monthly', 'تقرير يوليو 2024', 'تحليل أداء شهر يوليو 2024', '2024-07-01', '2024-07-31', ARRAY['أعلى معدل مشاركة في التحديات', 'تحسن جودة الأفكار المقدمة', 'زيادة التفاعل مع الخبراء'], ARRAY['ideas', 'challenges', 'expert_interactions'], '392bb10b-f2a8-4791-8f8b-510262056f9a', '{"ideas_this_month": 34, "challenges_launched": 3, "expert_evaluations": 78}', 'public');