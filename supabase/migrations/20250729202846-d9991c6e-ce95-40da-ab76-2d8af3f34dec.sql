-- Comprehensive seeding migration for all remaining empty tables
-- Using existing foreign key IDs from the database

-- 1. Challenge Requirements (empty)
INSERT INTO challenge_requirements (challenge_id, title, description, requirement_type, is_mandatory, weight_percentage, order_sequence) VALUES
('65cafee8-48ab-40e2-bbf4-951ae4c03618', 'متطلبات تقنية', 'يجب أن تكون الحلول متوافقة مع الأنظمة الصحية الحالية', 'technical', true, 30, 1),
('65cafee8-48ab-40e2-bbf4-951ae4c03618', 'متطلبات الأمان', 'ضمان حماية بيانات المرضى وفقاً لمعايير الخصوصية', 'security', true, 25, 2),
('63cafee8-48ab-40e2-bbf4-951ae4c03616', 'دعم اللغة العربية', 'يجب دعم النصوص العربية بشكل كامل', 'functional', true, 40, 1),
('64cafee8-48ab-40e2-bbf4-951ae4c03617', 'توافق مع إنترنت الأشياء', 'التكامل مع أجهزة إنترنت الأشياء الموجودة', 'integration', true, 35, 1),
('660e8400-e29b-41d4-a716-446655440001', 'معايير الأمان المصرفي', 'الامتثال لمعايير الأمان المصرفية الدولية', 'compliance', true, 50, 1);

-- 2. Campaign Partners (empty) 
INSERT INTO campaign_partners (campaign_id, partner_id, partnership_type, partnership_status, contribution_amount, partnership_role) VALUES
('50793935-4861-4bb5-8645-d3c698402b1a', '86466aa4-4403-4d06-9ee8-1bc2de6f42b0', 'strategic', 'active', 500000, 'sponsor'),
('b756f28b-ec7f-4e52-a890-eeb04cc1bfe1', 'ca1c4560-45d2-420e-92bf-7a730d3cc20f', 'research', 'active', 300000, 'research_partner'),
('18f86632-64d2-4387-ba46-15f404f3bf3e', '1fb19a6f-6c4b-48d0-b60b-0b3f020046f0', 'technology', 'active', 200000, 'technology_provider'),
('1d2bb6e7-e1ea-4654-aeb5-8772dd2aef4f', '799cdcc4-1d3b-49a9-8c7b-d598f353e919', 'security', 'active', 150000, 'security_advisor'),
('a7b334c8-2101-443b-939a-536ad8a33fdf', '2c62d513-6e9f-44c4-bcbb-95fa98f91ae2', 'marketing', 'active', 100000, 'marketing_partner');

-- 3. Event Participants (empty)
INSERT INTO event_participants (event_id, user_id, attendance_status, registration_type, notes) VALUES
('1faa956d-318e-47b8-bc4c-878aad7c554a', 'fa80bed2-ed61-4c27-8941-f713cf050944', 'confirmed', 'invited', 'متحدث رئيسي'),
('1faa956d-318e-47b8-bc4c-878aad7c554a', '8066cfaf-4a91-4985-922b-74f6a286c441', 'confirmed', 'self_registered', 'مشارك'),
('b29f90ac-a2a5-4e4d-b889-7d900133a97e', '061e4b32-3e80-49bc-87b4-9fa5725aee8c', 'pending', 'invited', 'خبير في الورش'),
('c86771fb-b20e-4822-86c3-161e4c813a84', '8ca5cf6c-ce3c-458b-bd09-5023f8053d2c', 'confirmed', 'self_registered', 'زائر'),
('eea18844-bf00-4065-a16a-b2a6f6267f1a', '157e3ce7-6e92-4a97-ad75-ef641234c307', 'attended', 'self_registered', 'حضر بنجاح'),
('3cde65b0-1a15-4068-923c-8a18b9b207a9', 'fa80bed2-ed61-4c27-8941-f713cf050944', 'no_show', 'invited', 'لم يحضر');

-- 4. Event Participant Notifications (empty)
INSERT INTO event_participant_notifications (event_id, participant_id, notification_type, status, message_content) VALUES
('1faa956d-318e-47b8-bc4c-878aad7c554a', 'fa80bed2-ed61-4c27-8941-f713cf050944', 'reminder', 'sent', 'تذكير بالفعالية غداً'),
('1faa956d-318e-47b8-bc4c-878aad7c554a', '8066cfaf-4a91-4985-922b-74f6a286c441', 'confirmation', 'sent', 'تأكيد التسجيل'),
('b29f90ac-a2a5-4e4d-b889-7d900133a97e', '061e4b32-3e80-49bc-87b4-9fa5725aee8c', 'invitation', 'delivered', 'دعوة للمشاركة'),
('c86771fb-b20e-4822-86c3-161e4c813a84', '8ca5cf6c-ce3c-458b-bd09-5023f8053d2c', 'update', 'sent', 'تحديث في تفاصيل الفعالية'),
('eea18844-bf00-4065-a16a-b2a6f6267f1a', '157e3ce7-6e92-4a97-ad75-ef641234c307', 'followup', 'sent', 'شكر للمشاركة');

-- 5. Event Stakeholders (empty)
INSERT INTO event_stakeholders (event_id, stakeholder_id, invitation_status, attendance_status) VALUES
('1faa956d-318e-47b8-bc4c-878aad7c554a', '6b91ad41-a631-4c23-a1fd-8e479ec74457', 'sent', 'attended'),
('b29f90ac-a2a5-4e4d-b889-7d900133a97e', '89e07e2a-1420-46eb-a95f-04ae88d64b85', 'confirmed', 'attended'),
('c86771fb-b20e-4822-86c3-161e4c813a84', 'c7cbf0a2-cbc2-4375-aa8c-e5688e00c967', 'pending', 'not_attended'),
('eea18844-bf00-4065-a16a-b2a6f6267f1a', '6bfdccc7-9af8-4b05-a3e5-851846517175', 'declined', 'not_attended'),
('3cde65b0-1a15-4068-923c-8a18b9b207a9', '96d5a875-0baa-4f8c-a0c9-6ae966b95ad9', 'sent', 'pending');

-- 6. Idea Approval Workflows (empty)
INSERT INTO idea_approval_workflows (idea_id, approver_id, approval_level, status, is_required) VALUES
('508948d0-2568-4b32-8b3c-b779d31edf97', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 1, 'pending', true),
('880e8400-e29b-41d4-a716-446655440001', '71e0fb71-c8f6-455c-a10a-8ced61ca830a', 1, 'approved', true),
('880e8400-e29b-41d4-a716-446655440002', '392bb10b-f2a8-4791-8f8b-510262056f9a', 1, 'pending', true),
('880e8400-e29b-41d4-a716-446655440005', '98c13bbb-edf7-44cb-b483-099637988714', 2, 'pending', false),
('880e8400-e29b-41d4-a716-446655440006', 'b4365f74-4b0e-4adc-8693-7dc0f35a5de6', 1, 'rejected', true);

-- 7. Idea Attachments (empty)
INSERT INTO idea_attachments (idea_id, file_name, file_path, file_type, file_size, uploaded_by, description, is_public) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'blockchain_whitepaper.pdf', '/attachments/blockchain_whitepaper.pdf', 'application/pdf', 2048000, '2167cc32-2308-4768-9097-d026779c20c2', 'ورقة بيضاء تقنية البلوك تشين', true),
('880e8400-e29b-41d4-a716-446655440002', 'medical_robot_specs.docx', '/attachments/medical_robot_specs.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 1024000, 'd01a9d41-fca6-47df-a0da-11975be11ffc', 'مواصفات الروبوت الطبي', false),
('880e8400-e29b-41d4-a716-446655440005', 'bus_network_diagram.png', '/attachments/bus_network_diagram.png', 'image/png', 512000, 'cefacad0-5118-4475-a9be-96acb0ff9448', 'مخطط شبكة الحافلات', true),
('880e8400-e29b-41d4-a716-446655440006', 'energy_consumption_analysis.xlsx', '/attachments/energy_consumption_analysis.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 256000, '7946c490-2d7b-4c07-8d6f-af4c284b526e', 'تحليل استهلاك الطاقة', true);

-- 8. Idea Collaboration Teams (empty)
INSERT INTO idea_collaboration_teams (idea_id, member_id, role, status, added_by, permissions) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'd01a9d41-fca6-47df-a0da-11975be11ffc', 'co_developer', 'active', '2167cc32-2308-4768-9097-d026779c20c2', '{"edit": true, "comment": true, "approve": false}'),
('880e8400-e29b-41d4-a716-446655440002', 'cefacad0-5118-4475-a9be-96acb0ff9448', 'reviewer', 'active', 'd01a9d41-fca6-47df-a0da-11975be11ffc', '{"edit": false, "comment": true, "approve": true}'),
('880e8400-e29b-41d4-a716-446655440005', '7946c490-2d7b-4c07-8d6f-af4c284b526e', 'contributor', 'active', 'cefacad0-5118-4475-a9be-96acb0ff9448', '{"edit": false, "comment": true, "approve": false}'),
('880e8400-e29b-41d4-a716-446655440006', 'f7f4d687-106b-434c-bdaa-cc9a02790b18', 'advisor', 'active', '7946c490-2d7b-4c07-8d6f-af4c284b526e', '{"edit": false, "comment": true, "approve": true}');

-- 9. Implementation Tracker (empty)
INSERT INTO implementation_tracker (idea_id, milestone_name, milestone_description, target_date, completion_percentage, status, responsible_team_member, last_updated_by) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'مرحلة التصميم', 'تصميم واجهة المحفظة الرقمية', '2024-08-15', 75, 'in_progress', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', '71e0fb71-c8f6-455c-a10a-8ced61ca830a'),
('880e8400-e29b-41d4-a716-446655440002', 'النموذج الأولي', 'بناء النموذج الأولي للروبوت', '2024-09-01', 40, 'in_progress', '392bb10b-f2a8-4791-8f8b-510262056f9a', '98c13bbb-edf7-44cb-b483-099637988714'),
('880e8400-e29b-41d4-a716-446655440005', 'اختبار النظام', 'اختبار شبكة الحافلات الذكية', '2024-07-30', 90, 'near_completion', 'b4365f74-4b0e-4adc-8693-7dc0f35a5de6', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e'),
('880e8400-e29b-41d4-a716-446655440006', 'تطوير التطبيق', 'تطوير تطبيق إدارة الطاقة', '2024-08-20', 60, 'in_progress', '71e0fb71-c8f6-455c-a10a-8ced61ca830a', '392bb10b-f2a8-4791-8f8b-510262056f9a');

-- 10. Innovation Maturity Index (empty)
INSERT INTO innovation_maturity_index (organization_name, maturity_level, innovation_score, assessment_date, strategic_alignment_score, resource_availability_score, culture_readiness_score, technology_adoption_score, partnership_ecosystem_score, assessed_by, improvement_recommendations) VALUES
('وزارة التقنية والاتصالات', 'advanced', 85, '2024-07-01', 90, 80, 85, 95, 75, 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'تحسين النظام البيئي للشراكات'),
('الهيئة السعودية للذكاء الاصطناعي', 'leading', 92, '2024-06-15', 95, 85, 90, 98, 90, '71e0fb71-c8f6-455c-a10a-8ced61ca830a', 'مواصلة التطوير والتوسع'),
('مؤسسة الملك عبدالعزيز للعلوم والتقنية', 'developing', 70, '2024-05-20', 75, 70, 65, 80, 60, '392bb10b-f2a8-4791-8f8b-510262056f9a', 'تطوير الثقافة المؤسسية للابتكار'),
('شركة أرامكو السعودية', 'advanced', 88, '2024-04-10', 90, 95, 80, 85, 85, '98c13bbb-edf7-44cb-b483-099637988714', 'زيادة تبني التقنيات الناشئة');

-- 11. Insights (empty)
INSERT INTO insights (title, description, insight_type, data_source, generated_by, confidence_score, impact_level, actionable_recommendations, related_entities) VALUES
('اتجاهات الابتكار في التحول الرقمي', 'تحليل شامل لاتجاهات الابتكار الحكومي في التحول الرقمي', 'trend_analysis', 'campaign_data', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 0.92, 'high', 'زيادة الاستثمار في حلول الذكاء الاصطناعي', '["campaigns", "challenges"]'),
('تأثير الشراكات على نجاح المشاريع', 'دراسة تأثير الشراكات الاستراتيجية على معدل نجاح المشاريع الابتكارية', 'performance_analysis', 'partnership_data', '71e0fb71-c8f6-455c-a10a-8ced61ca830a', 0.87, 'medium', 'تطوير معايير اختيار الشركاء', '["partners", "projects"]'),
('فجوات المهارات في قطاع التقنية', 'تحليل الفجوات في المهارات التقنية المطلوبة للمشاريع المستقبلية', 'gap_analysis', 'skills_assessment', '392bb10b-f2a8-4791-8f8b-510262056f9a', 0.89, 'high', 'وضع برامج تدريبية متخصصة', '["team_members", "experts"]'),
('أداء الخبراء في تقييم الأفكار', 'مراجعة أداء الخبراء في عملية تقييم الأفكار الابتكارية', 'evaluation_analysis', 'expert_evaluations', '98c13bbb-edf7-44cb-b483-099637988714', 0.85, 'medium', 'تحسين آليات التقييم وتدريب الخبراء', '["experts", "ideas"]');

-- 12. Opportunity Status (empty)
INSERT INTO opportunity_status (opportunity_name, status, priority_level, estimated_value, target_completion_date, responsible_team, description, success_probability, resource_requirements, created_by) VALUES
('منصة الحكومة الرقمية الموحدة', 'in_progress', 'critical', 50000000, '2025-03-01', 'فريق التحول الرقمي', 'تطوير منصة موحدة لجميع الخدمات الحكومية', 0.85, 'فريق من 25 مطور وخبير أمان', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e'),
('شبكة المدن الذكية الوطنية', 'planning', 'high', 100000000, '2025-12-31', 'فريق المدن الذكية', 'ربط جميع المدن السعودية بشبكة ذكية موحدة', 0.75, 'فريق متعدد التخصصات من 50 خبير', '71e0fb71-c8f6-455c-a10a-8ced61ca830a'),
('مركز الذكاء الاصطناعي الوطني', 'evaluation', 'high', 75000000, '2025-06-30', 'فريق الذكاء الاصطناعي', 'إنشاء مركز وطني للذكاء الاصطناعي', 0.80, 'باحثين ومطورين متخصصين', '392bb10b-f2a8-4791-8f8b-510262056f9a'),
('منصة التجارة الإلكترونية المحلية', 'on_hold', 'medium', 25000000, '2024-12-01', 'فريق التجارة الرقمية', 'منصة لدعم التجارة الإلكترونية المحلية', 0.60, 'فريق تطوير وتسويق', '98c13bbb-edf7-44cb-b483-099637988714');

-- 13. Role Assignments (empty)
INSERT INTO role_assignments (user_id, assigned_role, assigned_by, assignment_reason, is_temporary, expires_at) VALUES
('fa80bed2-ed61-4c27-8941-f713cf050944', 'project_manager', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'خبرة في إدارة المشاريع التقنية', false, NULL),
('8066cfaf-4a91-4985-922b-74f6a286c441', 'technical_lead', '71e0fb71-c8f6-455c-a10a-8ced61ca830a', 'خبرة تقنية متميزة', false, NULL),
('061e4b32-3e80-49bc-87b4-9fa5725aee8c', 'quality_assurance', '392bb10b-f2a8-4791-8f8b-510262056f9a', 'متخصص في ضمان الجودة', true, '2024-12-31'),
('8ca5cf6c-ce3c-458b-bd09-5023f8053d2c', 'business_analyst', '98c13bbb-edf7-44cb-b483-099637988714', 'محلل أعمال معتمد', false, NULL),
('157e3ce7-6e92-4a97-ad75-ef641234c307', 'security_specialist', 'b4365f74-4b0e-4adc-8693-7dc0f35a5de6', 'خبير أمن سيبراني', true, '2025-06-30');

-- 14. Role Audit Log (empty) 
INSERT INTO role_audit_log (action_type, target_user_id, target_role, performed_by, justification, new_expires_at, metadata) VALUES
('ASSIGN', 'fa80bed2-ed61-4c27-8941-f713cf050944', 'project_manager', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'تكليف بإدارة مشروع التحول الرقمي', NULL, '{"department": "digital_transformation", "project": "government_platform"}'),
('ASSIGN', '8066cfaf-4a91-4985-922b-74f6a286c441', 'technical_lead', '71e0fb71-c8f6-455c-a10a-8ced61ca830a', 'قيادة الفريق التقني', NULL, '{"team_size": 12, "technology_stack": "cloud_native"}'),
('MODIFY', '061e4b32-3e80-49bc-87b4-9fa5725aee8c', 'quality_assurance', '392bb10b-f2a8-4791-8f8b-510262056f9a', 'تمديد المهام لنهاية العام', '2024-12-31', '{"extension_reason": "project_delay", "original_end_date": "2024-08-31"}'),
('ASSIGN', '8ca5cf6c-ce3c-458b-bd09-5023f8053d2c', 'business_analyst', '98c13bbb-edf7-44cb-b483-099637988714', 'تحليل متطلبات العمل', NULL, '{"specialization": "requirements_analysis", "certification": "CBAP"}'),
('REVOKE', '157e3ce7-6e92-4a97-ad75-ef641234c307', 'admin', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'إنهاء صلاحيات الإدارة المؤقتة', NULL, '{"revoke_reason": "temporary_assignment_ended", "new_role": "security_specialist"}');

-- 15. Team Project Outcomes (empty)
INSERT INTO team_project_outcomes (project_id, project_name, team_member_id, outcome_type, outcome_description, success_metrics, lessons_learned, completion_date, impact_assessment, recorded_by) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'محفظة رقمية ذكية', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'successful_completion', 'تم تطوير محفظة رقمية متكاملة بنجاح', '{"user_satisfaction": 92, "security_score": 98, "performance": 95}', 'أهمية الاختبارات الأمنية المستمرة', '2024-07-15', 'تأثير إيجابي كبير على تجربة المستخدم', '71e0fb71-c8f6-455c-a10a-8ced61ca830a'),
('880e8400-e29b-41d4-a716-446655440002', 'روبوت طبي ذكي', '392bb10b-f2a8-4791-8f8b-510262056f9a', 'partial_completion', 'تم إنجاز النموذج الأولي بنجاح', '{"prototype_accuracy": 87, "response_time": "2.3s", "reliability": 94}', 'ضرورة التعاون الوثيق مع المختصين الطبيين', '2024-06-30', 'إمكانيات واعدة للتطبيق الطبي', '98c13bbb-edf7-44cb-b483-099637988714'),
('880e8400-e29b-41d4-a716-446655440005', 'شبكة حافلات ذكية', 'b4365f74-4b0e-4adc-8693-7dc0f35a5de6', 'ongoing', 'المشروع في مرحلة الاختبار النهائي', '{"prediction_accuracy": 91, "energy_savings": "15%", "user_adoption": 78}', 'أهمية إشراك المستخدمين في مرحلة التصميم', NULL, 'تحسن كبير في كفاءة النقل العام', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e'),
('880e8400-e29b-41d4-a716-446655440006', 'إدارة استهلاك الطاقة', '71e0fb71-c8f6-455c-a10a-8ced61ca830a', 'requires_revision', 'المشروع يحتاج مراجعة المتطلبات', '{"energy_reduction": "8%", "user_engagement": 45, "cost_effectiveness": 72}', 'ضرورة تبسيط واجهة المستخدم', NULL, 'تأثير محدود نسبياً، يحتاج تحسين', '392bb10b-f2a8-4791-8f8b-510262056f9a');

-- 16. Trend Reports (empty)
INSERT INTO trend_reports (report_title, report_type, analysis_period_start, analysis_period_end, key_findings, trend_direction, confidence_level, impact_prediction, data_sources, generated_by, executive_summary) VALUES
('تقرير اتجاهات الابتكار Q2 2024', 'quarterly', '2024-04-01', '2024-06-30', '{"ai_adoption": "increased by 35%", "digital_transformation": "accelerated", "partnership_growth": "25% increase"}', 'positive', 0.89, 'استمرار النمو في الربع القادم', '["campaign_data", "idea_submissions", "expert_evaluations"]', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'نمو قوي في تبني تقنيات الذكاء الاصطناعي والتحول الرقمي'),
('تحليل أداء الخبراء 2024', 'annual', '2024-01-01', '2024-07-29', '{"evaluation_quality": "high", "response_time": "improved by 20%", "expertise_coverage": "expanded"}', 'positive', 0.92, 'تحسن مستمر في جودة التقييمات', '["expert_evaluations", "idea_feedback", "challenge_assessments"]', '71e0fb71-c8f6-455c-a10a-8ced61ca830a', 'أداء ممتاز للخبراء مع تحسن في أوقات الاستجابة'),
('اتجاهات الشراكات الاستراتيجية', 'monthly', '2024-07-01', '2024-07-31', '{"new_partnerships": 8, "partnership_value": "increased by 40%", "success_rate": "78%"}', 'stable', 0.85, 'استقرار مع نمو تدريجي', '["partnership_agreements", "collaboration_outcomes"]', '392bb10b-f2a8-4791-8f8b-510262056f9a', 'نمو مستقر في عدد وقيمة الشراكات الجديدة'),
('تقييم فعالية الحملات', 'quarterly', '2024-04-01', '2024-06-30', '{"participation_rate": "increased by 22%", "idea_quality": "improved", "conversion_rate": "15% to implementation"}', 'positive', 0.87, 'توقع استمرار التحسن', '["campaign_metrics", "idea_analytics", "participation_data"]', '98c13bbb-edf7-44cb-b483-099637988714', 'تحسن ملحوظ في معدلات المشاركة وجودة الأفكار');

-- 17. User Invitations (empty)
INSERT INTO user_invitations (email, invited_by, role, status, invitation_token, expires_at, acceptance_url, invitation_message) VALUES
('ahmed.alrashid@gov.sa', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'expert', 'sent', 'inv_token_1234567890abcdef', '2024-08-15 23:59:59', '/accept-invitation?token=inv_token_1234567890abcdef', 'دعوة للانضمام كخبير في منصة الابتكار'),
('fatima.almansouri@tech.sa', '71e0fb71-c8f6-455c-a10a-8ced61ca830a', 'innovator', 'pending', 'inv_token_abcdef1234567890', '2024-08-20 23:59:59', '/accept-invitation?token=inv_token_abcdef1234567890', 'دعوة للمشاركة في مسابقة الابتكار'),
('mohammad.alzahra@research.sa', '392bb10b-f2a8-4791-8f8b-510262056f9a', 'team_member', 'accepted', 'inv_token_fedcba0987654321', '2024-07-30 23:59:59', '/accept-invitation?token=inv_token_fedcba0987654321', 'انضمام لفريق البحث والتطوير'),
('sara.alqahtani@innovation.sa', '98c13bbb-edf7-44cb-b483-099637988714', 'expert', 'expired', 'inv_token_0987654321fedcba', '2024-07-25 23:59:59', '/accept-invitation?token=inv_token_0987654321fedcba', 'دعوة منتهية الصلاحية للمشاركة كخبير'),
('khalid.alharbi@startup.sa', 'b4365f74-4b0e-4adc-8693-7dc0f35a5de6', 'innovator', 'declined', 'inv_token_456789abcdef0123', '2024-08-10 23:59:59', '/accept-invitation?token=inv_token_456789abcdef0123', 'دعوة مرفوضة للمشاركة كمبتكر');