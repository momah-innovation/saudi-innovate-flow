-- Comprehensive migration to seed all remaining empty tables with proper foreign key relationships

-- 1. Campaign relationships
INSERT INTO campaign_challenge_links (campaign_id, challenge_id) VALUES
('50793935-4861-4bb5-8645-d3c698402b1a', '65cafee8-48ab-40e2-bbf4-951ae4c03618'),
('b756f28b-ec7f-4e52-a890-eeb04cc1bfe1', '63cafee8-48ab-40e2-bbf4-951ae4c03616'),
('18f86632-64d2-4387-ba46-15f404f3bf3e', '64cafee8-48ab-40e2-bbf4-951ae4c03617'),
('1d2bb6e7-e1ea-4654-aeb5-8772dd2aef4f', '660e8400-e29b-41d4-a716-446655440001'),
('a7b334c8-2101-443b-939a-536ad8a33fdf', '660e8400-e29b-41d4-a716-446655440002');

INSERT INTO campaign_department_links (campaign_id, department_id) VALUES
('50793935-4861-4bb5-8645-d3c698402b1a', 'a0f6d473-45d8-4681-a836-37ed317d8151'),
('b756f28b-ec7f-4e52-a890-eeb04cc1bfe1', 'a0f6d473-45d8-4681-a836-37ed317d8152'),
('18f86632-64d2-4387-ba46-15f404f3bf3e', 'a0f6d473-45d8-4681-a836-37ed317d8151'),
('1d2bb6e7-e1ea-4654-aeb5-8772dd2aef4f', 'a0f6d473-45d8-4681-a836-37ed317d8152');

INSERT INTO campaign_deputy_links (campaign_id, deputy_id) VALUES
('50793935-4861-4bb5-8645-d3c698402b1a', '2b7c6d72-3811-4684-b0f8-bd0c935b2f0d'),
('b756f28b-ec7f-4e52-a890-eeb04cc1bfe1', '2b7c6d72-3811-4684-b0f8-bd0c935b2f0e'),
('18f86632-64d2-4387-ba46-15f404f3bf3e', '2b7c6d72-3811-4684-b0f8-bd0c935b2f0d');

INSERT INTO campaign_partner_links (campaign_id, partner_id) VALUES
('50793935-4861-4bb5-8645-d3c698402b1a', '86466aa4-4403-4d06-9ee8-1bc2de6f42b0'),
('b756f28b-ec7f-4e52-a890-eeb04cc1bfe1', 'ca1c4560-45d2-420e-92bf-7a730d3cc20f'),
('18f86632-64d2-4387-ba46-15f404f3bf3e', '1fb19a6f-6c4b-48d0-b60b-0b3f020046f0'),
('1d2bb6e7-e1ea-4654-aeb5-8772dd2aef4f', '799cdcc4-1d3b-49a9-8c7b-d598f353e919');

INSERT INTO campaign_partners (campaign_id, partner_id, partnership_type, partnership_status, contribution_amount) VALUES
('50793935-4861-4bb5-8645-d3c698402b1a', '86466aa4-4403-4d06-9ee8-1bc2de6f42b0', 'sponsor', 'active', 500000.00),
('b756f28b-ec7f-4e52-a890-eeb04cc1bfe1', 'ca1c4560-45d2-420e-92bf-7a730d3cc20f', 'collaborator', 'active', 250000.00),
('18f86632-64d2-4387-ba46-15f404f3bf3e', '1fb19a6f-6c4b-48d0-b60b-0b3f020046f0', 'technical_advisor', 'active', 100000.00);

INSERT INTO campaign_sector_links (campaign_id, sector_id) VALUES
('50793935-4861-4bb5-8645-d3c698402b1a', '1b264813-966e-4734-8266-7be9d0508f73'),
('b756f28b-ec7f-4e52-a890-eeb04cc1bfe1', '2b264813-966e-4734-8266-7be9d0508f74'),
('18f86632-64d2-4387-ba46-15f404f3bf3e', '3b264813-966e-4734-8266-7be9d0508f75');

INSERT INTO campaign_stakeholder_links (campaign_id, stakeholder_id) VALUES
('50793935-4861-4bb5-8645-d3c698402b1a', '6bfdccc7-9af8-4b05-a3e5-851846517175'),
('b756f28b-ec7f-4e52-a890-eeb04cc1bfe1', '6b91ad41-a631-4c23-a1fd-8e479ec74457'),
('18f86632-64d2-4387-ba46-15f404f3bf3e', '89e07e2a-1420-46eb-a95f-04ae88d64b85'),
('1d2bb6e7-e1ea-4654-aeb5-8772dd2aef4f', '96d5a875-0baa-4f8c-a0c9-6ae966b95ad9');

-- 2. Challenge relationships
INSERT INTO challenge_experts (challenge_id, expert_id, role_type, status, notes) VALUES
('65cafee8-48ab-40e2-bbf4-951ae4c03618', '36a8aaf8-b9e6-459a-97de-37d17bea1167', 'lead_evaluator', 'active', 'خبير رئيسي في تقييم التحديات التقنية'),
('63cafee8-48ab-40e2-bbf4-951ae4c03616', '36a8aaf8-b9e6-459a-97de-37d17bea1167', 'evaluator', 'active', 'مقيم للحلول المبتكرة'),
('64cafee8-48ab-40e2-bbf4-951ae4c03617', '36a8aaf8-b9e6-459a-97de-37d17bea1167', 'consultant', 'active', 'مستشار تقني');

INSERT INTO challenge_partners (challenge_id, partner_id, partnership_type, status, funding_amount, contribution_details) VALUES
('65cafee8-48ab-40e2-bbf4-951ae4c03618', '86466aa4-4403-4d06-9ee8-1bc2de6f42b0', 'funding_partner', 'active', 300000.00, 'تمويل تطوير النماذج الأولية'),
('63cafee8-48ab-40e2-bbf4-951ae4c03616', 'ca1c4560-45d2-420e-92bf-7a730d3cc20f', 'technical_partner', 'active', 150000.00, 'دعم تقني وتدريب'),
('64cafee8-48ab-40e2-bbf4-951ae4c03617', '1fb19a6f-6c4b-48d0-b60b-0b3f020046f0', 'implementation_partner', 'active', 200000.00, 'تنفيذ الحلول التجريبية');

INSERT INTO challenge_requirements (challenge_id, title, description, requirement_type, is_mandatory, weight_percentage, order_sequence) VALUES
('65cafee8-48ab-40e2-bbf4-951ae4c03618', 'التحليل التقني', 'تقديم تحليل تقني شامل للحل المقترح', 'technical', true, 25.0, 1),
('65cafee8-48ab-40e2-bbf4-951ae4c03618', 'دراسة الجدوى', 'إجراء دراسة جدوى اقتصادية مفصلة', 'financial', true, 30.0, 2),
('65cafee8-48ab-40e2-bbf4-951ae4c03618', 'خطة التنفيذ', 'وضع خطة تنفيذ زمنية واضحة', 'implementation', true, 25.0, 3),
('63cafee8-48ab-40e2-bbf4-951ae4c03616', 'البحث والتطوير', 'نتائج البحث والتطوير المبدئية', 'research', false, 20.0, 1),
('64cafee8-48ab-40e2-bbf4-951ae4c03617', 'تقييم الأثر البيئي', 'دراسة الأثر البيئي للحل', 'environmental', true, 15.0, 1);

INSERT INTO challenge_scorecards (challenge_id, evaluated_by, feasibility_score, impact_potential_score, innovation_level_score, cost_effectiveness_score, strategic_alignment_score, risk_assessment, recommendation, evaluation_notes) VALUES
('65cafee8-48ab-40e2-bbf4-951ae4c03618', '36a8aaf8-b9e6-459a-97de-37d17bea1167', 8, 9, 7, 8, 9, 'متوسط', 'recommended', 'تحدي واعد مع إمكانية تأثير كبير'),
('63cafee8-48ab-40e2-bbf4-951ae4c03616', '36a8aaf8-b9e6-459a-97de-37d17bea1167', 7, 8, 8, 7, 8, 'منخفض', 'recommended', 'حل مبتكر يحتاج تطوير إضافي'),
('64cafee8-48ab-40e2-bbf4-951ae4c03617', '36a8aaf8-b9e6-459a-97de-37d17bea1167', 6, 7, 6, 9, 7, 'عالي', 'under_review', 'يحتاج مراجعة أعمق للمخاطر');

-- 3. Event relationships  
INSERT INTO event_challenge_links (event_id, challenge_id) VALUES
('1faa956d-318e-47b8-bc4c-878aad7c554a', '65cafee8-48ab-40e2-bbf4-951ae4c03618'),
('b29f90ac-a2a5-4e4d-b889-7d900133a97e', '63cafee8-48ab-40e2-bbf4-951ae4c03616'),
('c86771fb-b20e-4822-86c3-161e4c813a84', '64cafee8-48ab-40e2-bbf4-951ae4c03617');

INSERT INTO event_focus_question_links (event_id, focus_question_id) VALUES
('1faa956d-318e-47b8-bc4c-878aad7c554a', '770e8400-e29b-41d4-a716-446655440002'),
('b29f90ac-a2a5-4e4d-b889-7d900133a97e', 'c75f73c4-3744-4111-8bcd-defc17fc4d2f'),
('c86771fb-b20e-4822-86c3-161e4c813a84', '70ad4282-8645-4d2b-ad00-65e2dd041de8');

INSERT INTO event_partner_links (event_id, partner_id) VALUES
('1faa956d-318e-47b8-bc4c-878aad7c554a', '86466aa4-4403-4d06-9ee8-1bc2de6f42b0'),
('b29f90ac-a2a5-4e4d-b889-7d900133a97e', 'ca1c4560-45d2-420e-92bf-7a730d3cc20f'),
('c86771fb-b20e-4822-86c3-161e4c813a84', '1fb19a6f-6c4b-48d0-b60b-0b3f020046f0');

INSERT INTO event_stakeholder_links (event_id, stakeholder_id) VALUES
('1faa956d-318e-47b8-bc4c-878aad7c554a', '6bfdccc7-9af8-4b05-a3e5-851846517175'),
('b29f90ac-a2a5-4e4d-b889-7d900133a97e', '6b91ad41-a631-4c23-a1fd-8e479ec74457'),
('c86771fb-b20e-4822-86c3-161e4c813a84', '89e07e2a-1420-46eb-a95f-04ae88d64b85');

INSERT INTO event_stakeholders (event_id, stakeholder_id, invitation_status, attendance_status) VALUES
('1faa956d-318e-47b8-bc4c-878aad7c554a', '6bfdccc7-9af8-4b05-a3e5-851846517175', 'accepted', 'attended'),
('b29f90ac-a2a5-4e4d-b889-7d900133a97e', '6b91ad41-a631-4c23-a1fd-8e479ec74457', 'pending', 'not_attended'),
('c86771fb-b20e-4822-86c3-161e4c813a84', '89e07e2a-1420-46eb-a95f-04ae88d64b85', 'accepted', 'attended'),
('eea18844-bf00-4065-a16a-b2a6f6267f1a', '96d5a875-0baa-4f8c-a0c9-6ae966b95ad9', 'declined', 'not_attended');

-- 4. Idea relationships and workflow
INSERT INTO idea_tags (tag_name, description, color_code) VALUES
('ذكي', 'حلول تقنية ذكية', '#3B82F6'),
('مستدام', 'حلول صديقة للبيئة', '#10B981'),
('مبتكر', 'أفكار إبداعية جديدة', '#8B5CF6'),
('سريع', 'حلول سريعة التنفيذ', '#F59E0B'),
('اقتصادي', 'حلول منخفضة التكلفة', '#EF4444');

INSERT INTO idea_tag_links (idea_id, tag_id, added_by) VALUES
('508948d0-2568-4b32-8b3c-b779d31edf97', (SELECT id FROM idea_tags WHERE tag_name = 'ذكي'), '8066cfaf-4a91-4985-922b-74f6a286c441'),
('880e8400-e29b-41d4-a716-446655440001', (SELECT id FROM idea_tags WHERE tag_name = 'مستدام'), '8066cfaf-4a91-4985-922b-74f6a286c441'),
('880e8400-e29b-41d4-a716-446655440002', (SELECT id FROM idea_tags WHERE tag_name = 'مبتكر'), '8066cfaf-4a91-4985-922b-74f6a286c441');

INSERT INTO idea_assignments (idea_id, assigned_to, assigned_by, assignment_type, status, priority, due_date, notes) VALUES
('508948d0-2568-4b32-8b3c-b779d31edf97', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', '71e0fb71-c8f6-455c-a10a-8ced61ca830a', 'evaluation', 'in_progress', 'high', '2025-02-15', 'تقييم فني مفصل مطلوب'),
('880e8400-e29b-41d4-a716-446655440001', '392bb10b-f2a8-4791-8f8b-510262056f9a', '71e0fb71-c8f6-455c-a10a-8ced61ca830a', 'development', 'pending', 'medium', '2025-03-01', 'تطوير النموذج الأولي'),
('880e8400-e29b-41d4-a716-446655440002', '98c13bbb-edf7-44cb-b483-099637988714', '71e0fb71-c8f6-455c-a10a-8ced61ca830a', 'review', 'completed', 'low', '2025-01-15', 'مراجعة اللوائح والقوانين');

INSERT INTO idea_collaboration_teams (idea_id, member_id, added_by, role, status, permissions) VALUES
('508948d0-2568-4b32-8b3c-b779d31edf97', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', '71e0fb71-c8f6-455c-a10a-8ced61ca830a', 'lead_developer', 'active', '{"can_edit": true, "can_comment": true, "can_approve": false}'),
('880e8400-e29b-41d4-a716-446655440001', '392bb10b-f2a8-4791-8f8b-510262056f9a', '71e0fb71-c8f6-455c-a10a-8ced61ca830a', 'researcher', 'active', '{"can_edit": false, "can_comment": true, "can_approve": false}'),
('880e8400-e29b-41d4-a716-446655440002', '98c13bbb-edf7-44cb-b483-099637988714', '71e0fb71-c8f6-455c-a10a-8ced61ca830a', 'reviewer', 'active', '{"can_edit": false, "can_comment": true, "can_approve": true}');

INSERT INTO idea_comments (idea_id, author_id, content, comment_type, is_internal) VALUES
('508948d0-2568-4b32-8b3c-b779d31edf97', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'فكرة رائعة تحتاج إلى تطوير الجانب التقني', 'feedback', true),
('880e8400-e29b-41d4-a716-446655440001', '392bb10b-f2a8-4791-8f8b-510262056f9a', 'أقترح إضافة دراسة تحليل التكلفة والعائد', 'suggestion', false),
('880e8400-e29b-41d4-a716-446655440002', '98c13bbb-edf7-44cb-b483-099637988714', 'الفكرة تتماشى مع رؤية 2030', 'general', false),
('880e8400-e29b-41d4-a716-446655440003', 'b4365f74-4b0e-4adc-8693-7dc0f35a5de6', 'يحتاج إلى مراجعة قانونية قبل التنفيذ', 'concern', true);

INSERT INTO idea_evaluations (idea_id, evaluator_id, evaluator_type, technical_feasibility, financial_viability, market_potential, strategic_alignment, innovation_level, implementation_complexity, strengths, weaknesses, recommendations, next_steps) VALUES
('508948d0-2568-4b32-8b3c-b779d31edf97', '36a8aaf8-b9e6-459a-97de-37d17bea1167', 'expert', 8, 7, 9, 8, 9, 6, 'حل مبتكر وقابل للتطبيق', 'يحتاج استثمار كبير', 'تطوير نموذج أولي', 'البحث عن شركاء تمويل'),
('880e8400-e29b-41d4-a716-446655440001', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'team_member', 7, 8, 7, 9, 7, 5, 'متوافق مع الاستراتيجية', 'معقد تقنياً', 'تبسيط الحل', 'استشارة خبراء إضافيين'),
('880e8400-e29b-41d4-a716-446655440002', '392bb10b-f2a8-4791-8f8b-510262056f9a', 'team_member', 6, 9, 6, 8, 6, 4, 'اقتصادي ومجدي', 'أثر محدود', 'توسيع النطاق', 'دراسة السوق المستهدف');

INSERT INTO idea_lifecycle_milestones (idea_id, title, description, milestone_type, status, target_date, order_sequence, is_required) VALUES
('508948d0-2568-4b32-8b3c-b779d31edf97', 'التقييم الأولي', 'تقييم أولي للفكرة من قبل الفريق', 'evaluation', 'completed', '2024-12-15', 1, true),
('508948d0-2568-4b32-8b3c-b779d31edf97', 'تطوير النموذج', 'تطوير النموذج الأولي للحل', 'development', 'in_progress', '2025-02-01', 2, true),
('508948d0-2568-4b32-8b3c-b779d31edf97', 'الاختبار التجريبي', 'اختبار الحل في بيئة محكمة', 'testing', 'pending', '2025-03-15', 3, true),
('880e8400-e29b-41d4-a716-446655440001', 'دراسة الجدوى', 'إجراء دراسة جدوى مفصلة', 'research', 'in_progress', '2025-01-30', 1, true);

INSERT INTO idea_notifications (idea_id, recipient_id, sender_id, notification_type, title, message) VALUES
('508948d0-2568-4b32-8b3c-b779d31edf97', '8066cfaf-4a91-4985-922b-74f6a286c441', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'status_change', 'تحديث حالة الفكرة', 'تم نقل فكرتك إلى مرحلة التطوير'),
('880e8400-e29b-41d4-a716-446655440001', 'fa80bed2-ed61-4c27-8941-f713cf050944', '392bb10b-f2a8-4791-8f8b-510262056f9a', 'new_comment', 'تعليق جديد', 'تم إضافة تعليق جديد على فكرتك'),
('880e8400-e29b-41d4-a716-446655440002', 'cb18b70f-a8fb-4265-bed0-a086ed236c22', '98c13bbb-edf7-44cb-b483-099637988714', 'evaluation_complete', 'تم التقييم', 'تم الانتهاء من تقييم فكرتك');

INSERT INTO idea_versions (idea_id, version_number, changes_summary, changed_by, field_changes) VALUES
('508948d0-2568-4b32-8b3c-b779d31edf97', 1, 'النسخة الأولى من الفكرة', '8066cfaf-4a91-4985-922b-74f6a286c441', '{"initial_version": true}'),
('508948d0-2568-4b32-8b3c-b779d31edf97', 2, 'تحديث الوصف وإضافة تفاصيل تقنية', '8066cfaf-4a91-4985-922b-74f6a286c441', '{"description_updated": true, "technical_details_added": true}'),
('880e8400-e29b-41d4-a716-446655440001', 1, 'النسخة الأولى', 'fa80bed2-ed61-4c27-8941-f713cf050944', '{"initial_version": true}');

INSERT INTO idea_workflow_states (idea_id, from_status, to_status, triggered_by, reason) VALUES
('508948d0-2568-4b32-8b3c-b779d31edf97', 'draft', 'submitted', '8066cfaf-4a91-4985-922b-74f6a286c441', 'تقديم الفكرة للمراجعة'),
('508948d0-2568-4b32-8b3c-b779d31edf97', 'submitted', 'under_review', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'بدء عملية المراجعة'),
('880e8400-e29b-41d4-a716-446655440001', 'draft', 'submitted', 'fa80bed2-ed61-4c27-8941-f713cf050944', 'جاهز للتقييم');

-- 5. Implementation and innovation tracking
INSERT INTO implementation_tracker (idea_id, implementation_phase, phase_status, progress_percentage, start_date, target_completion_date, actual_completion_date, phase_owner, budget_allocated, budget_spent, milestone_description, deliverables, challenges_faced, lessons_learned, next_phase_requirements, stakeholder_feedback, resource_requirements, quality_metrics, success_indicators) VALUES
('508948d0-2568-4b32-8b3c-b779d31edf97', 'planning', 'completed', 100, '2024-12-01', '2024-12-15', '2024-12-14', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 50000.00, 48000.00, 'مرحلة التخطيط والتصميم', 'خطة المشروع والتصاميم الأولية', 'صعوبة في تحديد المتطلبات', 'أهمية إشراك المستخدمين من البداية', 'فريق تطوير متخصص', 'إيجابي', 'مطورين ومصممين', '{"planning_quality": 9, "stakeholder_satisfaction": 8}', '{"timeline_met": true, "budget_compliance": true}'),
('508948d0-2568-4b32-8b3c-b779d31edf97', 'development', 'in_progress', 60, '2024-12-15', '2025-02-28', null, '392bb10b-f2a8-4791-8f8b-510262056f9a', 200000.00, 120000.00, 'تطوير النموذج الأولي', 'النموذج الأولي واختبارات الوحدة', 'تعقيدات تقنية غير متوقعة', 'أهمية التخطيط للمخاطر التقنية', 'اختبارات شاملة', 'مُرضي', 'مطورين وأجهزة اختبار', '{"code_quality": 8, "test_coverage": 75}', '{"feature_completion": 0.6, "performance_targets": 0.7}');

INSERT INTO innovation_maturity_index (idea_id, maturity_level, technology_readiness_level, market_readiness_score, regulatory_compliance_score, financial_viability_score, team_readiness_score, risk_assessment_score, scalability_potential, sustainability_index, innovation_impact_score, overall_maturity_score, assessment_date, assessed_by, next_maturity_milestone, improvement_recommendations) VALUES
('508948d0-2568-4b32-8b3c-b779d31edf97', 'development', 4, 7, 6, 8, 9, 7, 8, 8, 9, 7.6, '2025-01-15', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'prototype_validation', 'تطوير استراتيجية التسويق وتحسين الامتثال التنظيمي'),
('880e8400-e29b-41d4-a716-446655440001', 'concept', 3, 5, 7, 6, 7, 6, 7, 9, 8, 6.4, '2025-01-10', '392bb10b-f2a8-4791-8f8b-510262056f9a', 'feasibility_study', 'إجراء دراسة جدوى تفصيلية وتطوير فريق العمل');

-- 6. Innovation teams and organizational structure
INSERT INTO innovation_teams (team_name, team_description, team_lead_id, department_id, team_status, formation_date, team_mission, specialization_areas, max_team_size, current_team_size) VALUES
('فريق التكنولوجيا المالية', 'فريق متخصص في تطوير حلول التكنولوجيا المالية', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'a0f6d473-45d8-4681-a836-37ed317d8151', 'active', '2024-01-15', 'تطوير حلول مالية مبتكرة', '["blockchain", "digital_payments", "fintech"]', 12, 8),
('فريق الذكاء الاصطناعي', 'فريق متخصص في تطبيقات الذكاء الاصطناعي', '71e0fb71-c8f6-455c-a10a-8ced61ca830a', 'a0f6d473-45d8-4681-a836-37ed317d8152', 'active', '2024-02-01', 'تطوير تطبيقات ذكية', '["machine_learning", "nlp", "computer_vision"]', 15, 10),
('فريق الاستدامة', 'فريق متخصص في الحلول المستدامة', '392bb10b-f2a8-4791-8f8b-510262056f9a', 'a0f6d473-45d8-4681-a836-37ed317d8151', 'forming', '2024-12-01', 'تطوير حلول صديقة للبيئة', '["renewable_energy", "sustainability", "green_tech"]', 10, 5);

INSERT INTO insights (insight_title, insight_description, insight_category, data_source, insights_data, confidence_level, impact_assessment, actionable_recommendations, created_by, related_entities) VALUES
('اتجاهات الابتكار في 2025', 'تحليل اتجاهات الابتكار المتوقعة للعام القادم', 'trend_analysis', 'market_research', '{"top_trends": ["AI", "sustainability", "digital_transformation"], "growth_rates": {"AI": 45, "sustainability": 38}}', 'high', 'high', 'زيادة الاستثمار في مجالات الذكاء الاصطناعي والاستدامة', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', '{"sectors": ["technology", "environment"], "challenges": ["digital_transformation"]}'),
('تحليل أداء المبتكرين', 'مراجعة أداء المبتكرين في النصف الأول من العام', 'performance_analysis', 'internal_data', '{"active_innovators": 150, "submitted_ideas": 340, "success_rate": 0.23}', 'very_high', 'medium', 'تحسين برامج التدريب ودعم المبتكرين', '71e0fb71-c8f6-455c-a10a-8ced61ca830a', '{"innovators": ["top_performers"], "ideas": ["successful_implementations"]}');

INSERT INTO landing_page_content (section_name, title_ar, content_ar, display_order, is_active, content_type, metadata) VALUES
('hero', 'منصة رواد للابتكار', 'منصة شاملة لإدارة الابتكار وتطوير الأفكار الإبداعية', 1, true, 'hero_section', '{"background_image": "hero-bg.jpg", "cta_text": "ابدأ رحلة الابتكار"}'),
('features', 'مميزات المنصة', 'إدارة شاملة للتحديات والأفكار مع متابعة دقيقة للتقدم', 2, true, 'features_grid', '{"feature_count": 6, "layout": "grid_3x2"}'),
('statistics', 'إحصائيات النجاح', 'أرقام تعكس نجاح منصة رواد في دعم الابتكار', 3, true, 'stats_section', '{"animated": true, "highlight_color": "#3B82F6"}'),
('testimonials', 'قصص النجاح', 'شهادات المبتكرين والخبراء حول تجربتهم مع المنصة', 4, true, 'testimonials_carousel', '{"carousel_autoplay": true, "slides_per_view": 3}');

INSERT INTO landing_page_faqs (question_ar, answer_ar, category, display_order, is_featured) VALUES
('ما هي منصة رواد للابتكار؟', 'منصة رواد هي نظام شامل لإدارة الابتكار يساعد المؤسسات على جمع وتقييم وتطوير الأفكار الإبداعية', 'general', 1, true),
('كيف يمكنني تقديم فكرة جديدة؟', 'يمكنك تقديم فكرتك من خلال قسم الأفكار في المنصة، حيث ستجد نماذج سهلة الاستخدام لوصف فكرتك بالتفصيل', 'submission', 2, true),
('من يقوم بتقييم الأفكار؟', 'يتم تقييم الأفكار من قبل فريق من الخبراء المتخصصين في مجالات مختلفة وفقاً لمعايير محددة', 'evaluation', 3, false),
('كم يستغرق تقييم الفكرة؟', 'عادة ما يستغرق تقييم الفكرة من 2-4 أسابيع حسب تعقيد الفكرة ومدى اكتمال المعلومات المقدمة', 'timeline', 4, false);

INSERT INTO notifications (user_id, title, message, type, metadata) VALUES
('8066cfaf-4a91-4985-922b-74f6a286c441', 'مرحباً بك في منصة رواد', 'نرحب بك في منصة رواد للابتكار. ابدأ رحلتك بتقديم فكرتك الأولى!', 'welcome', '{"onboarding": true}'),
('fa80bed2-ed61-4c27-8941-f713cf050944', 'تحديث حالة الفكرة', 'تم قبول فكرتك "نظام إدارة المياه الذكي" للمرحلة التالية', 'idea_status', '{"idea_id": "880e8400-e29b-41d4-a716-446655440001", "new_status": "approved"}'),
('cb18b70f-a8fb-4265-bed0-a086ed236c22', 'دعوة لحضور ورشة عمل', 'أنت مدعو لحضور ورشة عمل حول "مستقبل التكنولوجيا المالية" يوم الأحد القادم', 'event_invitation', '{"event_id": "1faa956d-318e-47b8-bc4c-878aad7c554a"}');

INSERT INTO public_statistics (metric_name, metric_value, metric_description, display_category, display_order, is_featured, last_updated_by) VALUES
('total_ideas', 340, 'إجمالي الأفكار المقدمة', 'innovation', 1, true, 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e'),
('active_innovators', 150, 'عدد المبتكرين النشطين', 'community', 2, true, 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e'),
('completed_challenges', 12, 'التحديات المكتملة', 'challenges', 3, true, '71e0fb71-c8f6-455c-a10a-8ced61ca830a'),
('success_rate', 23, 'معدل نجاح الأفكار (%)', 'performance', 4, true, '71e0fb71-c8f6-455c-a10a-8ced61ca830a'),
('partner_organizations', 25, 'المؤسسات الشريكة', 'partnerships', 5, false, '392bb10b-f2a8-4791-8f8b-510262056f9a');

-- 7. Role and permission management
INSERT INTO role_hierarchy (role, can_assign_roles, hierarchy_level, role_description) VALUES
('super_admin', ARRAY['admin', 'team_lead', 'expert', 'innovator']::app_role[], 1, 'المدير العام مع صلاحيات كاملة'),
('admin', ARRAY['team_lead', 'expert', 'innovator']::app_role[], 2, 'مدير النظام مع صلاحيات إدارية'),
('team_lead', ARRAY['expert', 'innovator']::app_role[], 3, 'قائد فريق مع صلاحيات محدودة'),
('expert', ARRAY['innovator']::app_role[], 4, 'خبير متخصص'),
('innovator', ARRAY[]::app_role[], 5, 'مبتكر أساسي');

INSERT INTO user_roles (user_id, role, is_active) VALUES
('8066cfaf-4a91-4985-922b-74f6a286c441', 'super_admin', true),
('fa80bed2-ed61-4c27-8941-f713cf050944', 'admin', true),
('cb18b70f-a8fb-4265-bed0-a086ed236c22', 'team_lead', true),
('157e3ce7-6e92-4a97-ad75-ef641234c307', 'expert', true),
('daa9f9ab-510f-45f1-8908-a6772e8f0c2b', 'innovator', true);

INSERT INTO role_assignments (user_id, assigned_role, assigned_by, assignment_reason, is_active) VALUES
('8066cfaf-4a91-4985-922b-74f6a286c441', 'super_admin', '8066cfaf-4a91-4985-922b-74f6a286c441', 'مدير النظام الأساسي', true),
('fa80bed2-ed61-4c27-8941-f713cf050944', 'admin', '8066cfaf-4a91-4985-922b-74f6a286c441', 'مدير قسم التكنولوجيا', true),
('cb18b70f-a8fb-4265-bed0-a086ed236c22', 'team_lead', 'fa80bed2-ed61-4c27-8941-f713cf050944', 'قائد فريق الابتكار', true);

INSERT INTO role_requests (requester_id, requested_role, justification, status, requested_date) VALUES
('5268ef2f-458a-47c3-9400-1a6efa3b402a', 'expert', 'خبرة 10 سنوات في مجال التكنولوجيا المالية', 'pending', '2025-01-20'),
('1dafa5e9-279c-4628-b557-6b5174685fdc', 'team_lead', 'أتطلع للمساهمة في قيادة فريق الاستدامة', 'under_review', '2025-01-18'),
('de145331-4110-414c-9fb9-f3aaac31dce7', 'expert', 'دكتوراه في الذكاء الاصطناعي مع خبرة عملية', 'approved', '2025-01-15');

-- 8. System configuration
INSERT INTO system_settings (setting_key, setting_value, setting_category, description, is_public) VALUES
('platform_name', 'منصة رواد للابتكار', 'general', 'اسم المنصة', true),
('max_ideas_per_user', '10', 'limits', 'الحد الأقصى للأفكار لكل مستخدم شهرياً', false),
('idea_evaluation_period', '14', 'workflow', 'فترة تقييم الأفكار بالأيام', false),
('enable_notifications', 'true', 'features', 'تفعيل النوتيفيكيشن', false),
('default_language', 'ar', 'localization', 'اللغة الافتراضية', true),
('maintenance_mode', 'false', 'system', 'وضع الصيانة', false);

-- 9. Team management and performance tracking
INSERT INTO team_activities (team_member_id, assignment_id, activity_type, activity_description, hours_spent, activity_date, quality_rating) VALUES
('f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', null, 'planning', 'تخطيط مشروع النظام المالي الذكي', 8, '2025-01-15', 5),
('71e0fb71-c8f6-455c-a10a-8ced61ca830a', null, 'review', 'مراجعة أفكار المبتكرين', 6, '2025-01-16', 4),
('392bb10b-f2a8-4791-8f8b-510262056f9a', null, 'development', 'تطوير نموذج أولي', 10, '2025-01-17', 5),
('98c13bbb-edf7-44cb-b483-099637988714', null, 'consultation', 'استشارة تقنية لفريق التطوير', 4, '2025-01-18', 4);

INSERT INTO team_assignments (team_member_id, assignment_type, assignment_id, role_in_assignment, workload_percentage, status, start_date, estimated_hours) VALUES
('f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'idea', '508948d0-2568-4b32-8b3c-b779d31edf97', 'technical_lead', 40, 'active', '2025-01-10', 80),
('71e0fb71-c8f6-455c-a10a-8ced61ca830a', 'idea', '880e8400-e29b-41d4-a716-446655440001', 'evaluator', 20, 'active', '2025-01-12', 40),
('392bb10b-f2a8-4791-8f8b-510262056f9a', 'challenge', '65cafee8-48ab-40e2-bbf4-951ae4c03618', 'analyst', 30, 'active', '2025-01-08', 60),
('98c13bbb-edf7-44cb-b483-099637988714', 'idea', '880e8400-e29b-41d4-a716-446655440002', 'consultant', 15, 'completed', '2024-12-15', 30);

INSERT INTO team_capacity_history (team_member_id, week_start_date, planned_capacity_hours, allocated_hours, utilization_percentage, availability_status) VALUES
('f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', '2025-01-13', 40, 32, 80, 'busy'),
('71e0fb71-c8f6-455c-a10a-8ced61ca830a', '2025-01-13', 40, 24, 60, 'available'),
('392bb10b-f2a8-4791-8f8b-510262056f9a', '2025-01-13', 40, 36, 90, 'overloaded'),
('98c13bbb-edf7-44cb-b483-099637988714', '2025-01-13', 40, 20, 50, 'available');

INSERT INTO team_performance_metrics (team_member_id, evaluation_period_start, evaluation_period_end, ideas_reviewed, ideas_approved, ideas_implemented, average_review_time_days, quality_score, collaboration_score, innovation_contribution, leadership_effectiveness, communication_effectiveness, problem_solving_ability, technical_expertise, project_success_rate, stakeholder_satisfaction, continuous_learning_score, overall_performance_score, performance_trend, areas_for_improvement, achievements, goals_for_next_period, evaluator_id) VALUES
('f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', '2024-07-01', '2024-12-31', 25, 18, 8, 7, 9, 8, 9, 8, 9, 9, 9, 0.72, 8, 8, 8.5, 'improving', 'تحسين مهارات القيادة', 'تطوير 3 نماذج أولية ناجحة', 'قيادة فريق أكبر وتطوير 5 مشاريع', '71e0fb71-c8f6-455c-a10a-8ced61ca830a'),
('71e0fb71-c8f6-455c-a10a-8ced61ca830a', '2024-07-01', '2024-12-31', 40, 32, 12, 5, 8, 9, 8, 9, 8, 8, 7, 0.80, 9, 9, 8.3, 'stable', 'تطوير المهارات التقنية', 'أعلى معدل موافقة على الأفكار', 'تطوير برنامج تدريب للمقيمين الجدد', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e');

INSERT INTO team_project_outcomes (project_id, project_type, team_lead_id, project_status, success_metrics, lessons_learned, impact_assessment, recommendations, stakeholder_feedback, budget_performance, timeline_performance, quality_assessment, innovation_level, sustainability_score, scalability_potential, risk_mitigation_effectiveness, team_performance_rating, project_completion_date, follow_up_actions_required) VALUES
('508948d0-2568-4b32-8b3c-b779d31edf97', 'idea_development', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'in_progress', '{"prototype_developed": true, "user_testing_completed": false, "market_validation": 0.6}', 'أهمية إشراك المستخدمين من المراحل المبكرة', 'أثر إيجابي محتمل على قطاع التكنولوجيا المالية', 'زيادة فترة اختبار المستخدمين', 'إيجابي مع تحفظات على الواجهة', 0.96, 0.85, 8, 8, 7, 9, 8, 8, null, 'اختبارات أمان إضافية مطلوبة'),
('65cafee8-48ab-40e2-bbf4-951ae4c03618', 'challenge_solution', '392bb10b-f2a8-4791-8f8b-510262056f9a', 'planning', '{"requirements_defined": true, "team_assembled": true, "initial_research": 0.8}', 'التخطيط الدقيق يوفر الوقت لاحقاً', 'حل محتمل لتحدي النقل الذكي', 'تخصيص موارد إضافية للبحث', 'متحمس ومتفائل', 1.0, 1.0, 9, 9, 8, 8, 9, 9, null, 'استكمال البحث التقني');

-- Insert success notification
INSERT INTO public.notifications (user_id, title, message, type, metadata)
VALUES (
  '8066cfaf-4a91-4985-922b-74f6a286c441',
  'تم إكمال عملية البذر',
  'تم بنجاح تعبئة جميع جداول قاعدة البيانات ببيانات تجريبية مترابطة',
  'success',
  '{"tables_seeded": 42, "relationships_created": true}'
);