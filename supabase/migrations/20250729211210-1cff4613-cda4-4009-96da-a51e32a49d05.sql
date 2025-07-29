-- Final successful seeding for all remaining empty tables
-- Using valid enum values and correct foreign keys

-- 1. Challenge Requirements
INSERT INTO challenge_requirements (challenge_id, title, description, requirement_type, is_mandatory, weight_percentage, order_sequence) VALUES
('65cafee8-48ab-40e2-bbf4-951ae4c03618', 'Technical Feasibility Assessment', 'تقييم الجدوى التقنية للحل المقترح', 'criteria', true, 25.0, 1),
('65cafee8-48ab-40e2-bbf4-951ae4c03618', 'Market Impact Analysis', 'تحليل الأثر على السوق والمجتمع', 'criteria', true, 25.0, 2),
('63cafee8-48ab-40e2-bbf4-951ae4c03616', 'Innovation Level Assessment', 'تقييم مستوى الابتكار في الحل', 'criteria', true, 30.0, 1),
('64cafee8-48ab-40e2-bbf4-951ae4c03617', 'Resource Requirements', 'تحديد الموارد المطلوبة للتنفيذ', 'document', false, 20.0, 1),
('660e8400-e29b-41d4-a716-446655440001', 'General Guidelines', 'الإرشادات العامة للمشاركة', 'general', true, 0.0, 1);

-- 2. Idea Analytics
INSERT INTO idea_analytics (idea_id, metric_name, metric_value, recorded_by, metric_data) VALUES
('508948d0-2568-4b32-8b3c-b779d31edf97', 'evaluation_count', 3, '8066cfaf-4a91-4985-922b-74f6a286c441', '{"evaluations": 3, "avg_score": 7.5}'),
('880e8400-e29b-41d4-a716-446655440001', 'comment_count', 5, 'fa80bed2-ed61-4c27-8941-f713cf050944', '{"comments": 5, "public": 3, "internal": 2}'),
('880e8400-e29b-41d4-a716-446655440002', 'view_count', 45, 'cb18b70f-a8fb-4265-bed0-a086ed236c22', '{"views": 45, "unique_visitors": 23}'),
('880e8400-e29b-41d4-a716-446655440005', 'average_evaluation_score', 8.2, '157e3ce7-6e92-4a97-ad75-ef641234c307', '{"total_score": 8.2, "criteria_breakdown": {"technical": 8, "market": 9, "innovation": 8}}');

-- 3. Implementation Tracker
INSERT INTO implementation_tracker (challenge_id, implementation_stage, completion_percentage, estimated_completion_date, actual_completion_date, implementation_owner_id, approved_budget, spent_budget, total_milestones, milestones_completed) VALUES
('65cafee8-48ab-40e2-bbf4-951ae4c03618', 'planning', 75, '2024-09-30', NULL, '8066cfaf-4a91-4985-922b-74f6a286c441', 500000, 125000, 5, 3),
('63cafee8-48ab-40e2-bbf4-951ae4c03616', 'development', 40, '2024-12-15', NULL, 'fa80bed2-ed61-4c27-8941-f713cf050944', 750000, 180000, 8, 2),
('64cafee8-48ab-40e2-bbf4-951ae4c03617', 'testing', 90, '2024-08-30', '2024-08-28', 'cb18b70f-a8fb-4265-bed0-a086ed236c22', 300000, 285000, 4, 4);

-- 4. Innovation Maturity Index
INSERT INTO innovation_maturity_index (measurement_scope, scope_id, strategy_maturity, process_maturity, technology_maturity, culture_maturity, governance_maturity, overall_maturity_score, maturity_level, assessed_by) VALUES
('challenge', '65cafee8-48ab-40e2-bbf4-951ae4c03618', 8, 7, 8, 7, 8, 7.6, 'Advanced', '8066cfaf-4a91-4985-922b-74f6a286c441'),
('campaign', '50793935-4861-4bb5-8645-d3c698402b1a', 7, 6, 7, 6, 7, 6.6, 'Intermediate', 'fa80bed2-ed61-4c27-8941-f713cf050944'),
('organization', NULL, 6, 7, 8, 6, 7, 6.8, 'Intermediate', 'cb18b70f-a8fb-4265-bed0-a086ed236c22');

-- 5. Insights
INSERT INTO insights (insight_type, insight_text_ar, applicable_domains, actionability_score, extracted_by) VALUES
('trend', 'تزايد الاتجاه نحو استخدام التكنولوجيا المالية في القطاع المصرفي بنسبة 35% خلال الربع الأخير', ARRAY['technology', 'finance'], 8, '8066cfaf-4a91-4985-922b-74f6a286c441'),
('performance', 'ارتفاع معدل إنتاجية فرق الابتكار إلى 78% مع تحسن ملحوظ في جودة المخرجات', ARRAY['team_management', 'performance'], 9, 'fa80bed2-ed61-4c27-8941-f713cf050944'),
('challenge', 'التحديات الرئيسية في قطاع الرعاية الصحية تتركز حول التكلفة وإمكانية الوصول وتبني التكنولوجيا', ARRAY['healthcare', 'accessibility'], 7, 'cb18b70f-a8fb-4265-bed0-a086ed236c22');

-- 6. Opportunity Status
INSERT INTO opportunity_status (challenge_id, current_stage, stage_owner_id, stage_notes, next_milestone_date, stage_completion_percentage) VALUES
('65cafee8-48ab-40e2-bbf4-951ae4c03618', 'planning', '8066cfaf-4a91-4985-922b-74f6a286c441', 'مرحلة التخطيط والإعداد للتحدي', '2024-09-15', 60),
('63cafee8-48ab-40e2-bbf4-951ae4c03616', 'active', 'fa80bed2-ed61-4c27-8941-f713cf050944', 'التحدي نشط ويستقبل الأفكار', '2024-12-31', 30),
('64cafee8-48ab-40e2-bbf4-951ae4c03617', 'evaluation', 'cb18b70f-a8fb-4265-bed0-a086ed236c22', 'مرحلة تقييم الأفكار المقدمة', '2024-10-30', 80);

-- 7. Role Assignments
INSERT INTO role_assignments (entity_type, entity_id, assigned_to_id, assigned_to_type, role, status, notes, end_date) VALUES
('challenge', '65cafee8-48ab-40e2-bbf4-951ae4c03618', '8066cfaf-4a91-4985-922b-74f6a286c441', 'user', 'challenge_manager', 'active', 'قائد التحدي الرئيسي', NULL),
('campaign', '50793935-4861-4bb5-8645-d3c698402b1a', 'fa80bed2-ed61-4c27-8941-f713cf050944', 'user', 'campaign_manager', 'active', 'مدير الحملة', '2024-12-31'),
('organization', NULL, 'cb18b70f-a8fb-4265-bed0-a086ed236c22', 'user', 'domain_expert', 'active', 'خبير المجال', '2025-07-29');

-- 8. Role Audit Log (using valid app_role enum values)
INSERT INTO role_audit_log (action_type, target_user_id, target_role, performed_by, justification, metadata) VALUES
('ASSIGN', '8066cfaf-4a91-4985-922b-74f6a286c441', 'domain_expert', 'fa80bed2-ed61-4c27-8941-f713cf050944', 'خبرة واسعة في المجال التقني', '{"assignment_context": "project_leadership", "approved_by": "committee"}'),
('MODIFY', 'fa80bed2-ed61-4c27-8941-f713cf050944', 'evaluator', 'cb18b70f-a8fb-4265-bed0-a086ed236c22', 'ترقية بناء على الأداء المميز', '{"previous_role": "innovator", "performance_rating": 9}'),
('REVOKE', 'cb18b70f-a8fb-4265-bed0-a086ed236c22', 'viewer', '157e3ce7-6e92-4a97-ad75-ef641234c307', 'انتهاء فترة المشروع المؤقت', '{"project_id": "temp_project_2024", "completion_status": "completed"}');

-- 9. Team Project Outcomes
INSERT INTO team_project_outcomes (team_id, project_type, project_id, outcome_type, success_metrics, completion_date, lessons_learned, impact_assessment, recorded_by) VALUES
('504552ff-b47b-437d-aef5-72db5a3d3125', 'challenge', '65cafee8-48ab-40e2-bbf4-951ae4c03618', 'success', '{"ideas_generated": 45, "approval_rate": 78, "implementation_rate": 23}', '2024-07-15', 'تحسين عملية التقييم الأولي يزيد من جودة الأفكار', '{"innovation_score": 8.5, "team_satisfaction": 9.2}', '8066cfaf-4a91-4985-922b-74f6a286c441'),
('196bba8a-3e68-45fc-b026-343d09fde1f7', 'campaign', '50793935-4861-4bb5-8645-d3c698402b1a', 'partial_success', '{"participation_rate": 82, "idea_quality": 7.8, "stakeholder_engagement": 85}', '2024-07-20', 'أهمية التواصل المستمر مع أصحاب المصلحة', '{"reach": 1200, "engagement_quality": 7.9}', 'fa80bed2-ed61-4c27-8941-f713cf050944'),
('b98ed45f-937d-4264-95b4-79038ffefe00', 'idea_development', '880e8400-e29b-41d4-a716-446655440001', 'in_progress', '{"development_progress": 65, "milestone_completion": 4, "budget_utilization": 58}', NULL, 'التعاون متعدد التخصصات يعزز الابتكار', '{"projected_impact": 8.7, "feasibility_score": 8.2}', 'cb18b70f-a8fb-4265-bed0-a086ed236c22');

-- 10. Trend Reports
INSERT INTO trend_reports (report_type, title, description, time_period_start, time_period_end, key_findings, data_sources, generated_by, report_data, visibility_level) VALUES
('quarterly', 'تقرير الاتجاهات ربع السنوية - Q2 2024', 'تحليل شامل لاتجاهات الابتكار في الربع الثاني', '2024-04-01', '2024-06-30', ARRAY['زيادة 35% في أفكار الذكاء الاصطناعي', 'تركز 60% من التحديات على الاستدامة', 'ارتفاع مشاركة الشباب بنسبة 28%'], ARRAY['ideas', 'challenges', 'evaluations'], '8066cfaf-4a91-4985-922b-74f6a286c441', '{"total_ideas": 156, "success_rate": 23, "trending_sectors": ["ai", "sustainability", "healthcare"]}', 'public'),
('annual', 'تقرير الأداء السنوي 2023', 'مراجعة شاملة لأداء النظام خلال عام 2023', '2023-01-01', '2023-12-31', ARRAY['تحقيق 89% من أهداف الابتكار', 'زيادة عدد الشراكات بنسبة 45%', 'تطوير 12 حل مبتكر'], ARRAY['all_modules'], 'fa80bed2-ed61-4c27-8941-f713cf050944', '{"total_ideas": 890, "implementations": 67, "partnerships": 45, "impact_score": 8.9}', 'internal'),
('monthly', 'تقرير يوليو 2024', 'تحليل أداء شهر يوليو 2024', '2024-07-01', '2024-07-31', ARRAY['أعلى معدل مشاركة في التحديات', 'تحسن جودة الأفكار المقدمة', 'زيادة التفاعل مع الخبراء'], ARRAY['ideas', 'challenges', 'expert_interactions'], 'cb18b70f-a8fb-4265-bed0-a086ed236c22', '{"ideas_this_month": 34, "challenges_launched": 3, "expert_evaluations": 78}', 'public');