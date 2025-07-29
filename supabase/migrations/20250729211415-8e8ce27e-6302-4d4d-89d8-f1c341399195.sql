-- Final ultra-simplified seeding for critical tables only
-- Using only confirmed working table structures

-- 1. Challenge Requirements (confirmed working)
INSERT INTO challenge_requirements (challenge_id, title, description, requirement_type, is_mandatory, weight_percentage, order_sequence) VALUES
('65cafee8-48ab-40e2-bbf4-951ae4c03618', 'Technical Feasibility Assessment', 'تقييم الجدوى التقنية للحل المقترح', 'criteria', true, 25.0, 1),
('65cafee8-48ab-40e2-bbf4-951ae4c03618', 'Market Impact Analysis', 'تحليل الأثر على السوق والمجتمع', 'criteria', true, 25.0, 2),
('63cafee8-48ab-40e2-bbf4-951ae4c03616', 'Innovation Level Assessment', 'تقييم مستوى الابتكار في الحل', 'criteria', true, 30.0, 1);

-- 2. Idea Analytics (confirmed working)
INSERT INTO idea_analytics (idea_id, metric_name, metric_value, recorded_by, metric_data) VALUES
('508948d0-2568-4b32-8b3c-b779d31edf97', 'evaluation_count', 3, '8066cfaf-4a91-4985-922b-74f6a286c441', '{"evaluations": 3, "avg_score": 7.5}'),
('880e8400-e29b-41d4-a716-446655440001', 'comment_count', 5, 'fa80bed2-ed61-4c27-8941-f713cf050944', '{"comments": 5, "public": 3, "internal": 2}'),
('880e8400-e29b-41d4-a716-446655440002', 'view_count', 45, 'cb18b70f-a8fb-4265-bed0-a086ed236c22', '{"views": 45, "unique_visitors": 23}');

-- 3. Implementation Tracker (confirmed working)
INSERT INTO implementation_tracker (challenge_id, implementation_stage, completion_percentage, estimated_completion_date, implementation_owner_id, approved_budget, spent_budget, total_milestones, milestones_completed) VALUES
('65cafee8-48ab-40e2-bbf4-951ae4c03618', 'planning', 75, '2024-09-30', '8066cfaf-4a91-4985-922b-74f6a286c441', 500000, 125000, 5, 3),
('63cafee8-48ab-40e2-bbf4-951ae4c03616', 'development', 40, '2024-12-15', 'fa80bed2-ed61-4c27-8941-f713cf050944', 750000, 180000, 8, 2);

-- 4. Innovation Maturity Index (confirmed working)
INSERT INTO innovation_maturity_index (measurement_scope, scope_id, strategy_maturity, process_maturity, technology_maturity, culture_maturity, governance_maturity, overall_maturity_score, maturity_level, assessed_by) VALUES
('challenge', '65cafee8-48ab-40e2-bbf4-951ae4c03618', 8, 7, 8, 7, 8, 7.6, 'Advanced', '8066cfaf-4a91-4985-922b-74f6a286c441'),
('campaign', '50793935-4861-4bb5-8645-d3c698402b1a', 7, 6, 7, 6, 7, 6.6, 'Intermediate', 'fa80bed2-ed61-4c27-8941-f713cf050944');

-- 5. Insights (confirmed working)
INSERT INTO insights (insight_type, insight_text_ar, applicable_domains, actionability_score, extracted_by) VALUES
('trend', 'تزايد الاتجاه نحو استخدام التكنولوجيا المالية في القطاع المصرفي بنسبة 35% خلال الربع الأخير', ARRAY['technology', 'finance'], 8, '8066cfaf-4a91-4985-922b-74f6a286c441'),
('performance', 'ارتفاع معدل إنتاجية فرق الابتكار إلى 78% مع تحسن ملحوظ في جودة المخرجات', ARRAY['team_management', 'performance'], 9, 'fa80bed2-ed61-4c27-8941-f713cf050944');

-- 6. Opportunity Status (confirmed working)
INSERT INTO opportunity_status (challenge_id, current_stage, stage_owner_id, stage_notes, next_milestone_date, stage_completion_percentage) VALUES
('65cafee8-48ab-40e2-bbf4-951ae4c03618', 'planning', '8066cfaf-4a91-4985-922b-74f6a286c441', 'مرحلة التخطيط والإعداد للتحدي', '2024-09-15', 60),
('63cafee8-48ab-40e2-bbf4-951ae4c03616', 'active', 'fa80bed2-ed61-4c27-8941-f713cf050944', 'التحدي نشط ويستقبل الأفكار', '2024-12-31', 30);

-- 7. Role Audit Log (confirmed working)
INSERT INTO role_audit_log (action_type, target_user_id, target_role, performed_by, justification, metadata) VALUES
('ASSIGN', '8066cfaf-4a91-4985-922b-74f6a286c441', 'domain_expert', 'fa80bed2-ed61-4c27-8941-f713cf050944', 'خبرة واسعة في المجال التقني', '{"assignment_context": "project_leadership"}'),
('MODIFY', 'fa80bed2-ed61-4c27-8941-f713cf050944', 'evaluator', 'cb18b70f-a8fb-4265-bed0-a086ed236c22', 'ترقية بناء على الأداء المميز', '{"previous_role": "innovator"}');