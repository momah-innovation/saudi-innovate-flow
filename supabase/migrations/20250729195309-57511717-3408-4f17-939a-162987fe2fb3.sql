-- Comprehensive seeding of all empty tables

-- 1. Event participants (users registered for events)
INSERT INTO event_participants (event_id, user_id, registration_type, attendance_status, notes) VALUES
('1faa956d-318e-47b8-bc4c-878aad7c554a', '8066cfaf-4a91-4985-922b-74f6a286c441', 'self_registered', 'registered', 'مهتم بمتابعة التحول الرقمي'),
('1faa956d-318e-47b8-bc4c-878aad7c554a', 'fa80bed2-ed61-4c27-8941-f713cf050944', 'invited', 'confirmed', 'خبير في المجال'),
('b29f90ac-a2a5-4e4d-b889-7d900133a97e', 'cb18b70f-a8fb-4265-bed0-a086ed236c22', 'self_registered', 'attended', 'حضر ورش الخدمات الرقمية'),
('c86771fb-b20e-4822-86c3-161e4c813a84', '157e3ce7-6e92-4a97-ad75-ef641234c307', 'invited', 'registered', 'محلل في تقنيات الاستدامة'),
('eea18844-bf00-4065-a16a-b2a6f6267f1a', 'daa9f9ab-510f-45f1-8908-a6772e8f0c2b', 'self_registered', 'confirmed', 'خبير في الطاقة المتجددة'),
('3cde65b0-1a15-4068-923c-8a18b9b207a9', '5268ef2f-458a-47c3-9400-1a6efa3b402a', 'invited', 'registered', 'مختصة في المدن الذكية');

-- 2. Challenge requirements
INSERT INTO challenge_requirements (challenge_id, requirement_type, title, description, is_mandatory, order_sequence, weight_percentage) VALUES
('65cafee8-48ab-40e2-bbf4-951ae4c03618', 'technical', 'الخبرة التقنية في الذكاء الاصطناعي', 'يجب أن يكون لدى المتقدم خبرة لا تقل عن سنتين في مجال الذكاء الاصطناعي', true, 1, 30.0),
('65cafee8-48ab-40e2-bbf4-951ae4c03618', 'educational', 'المؤهل العلمي', 'درجة البكالوريوس في علوم الحاسب أو مجال ذي صلة', true, 2, 25.0),
('63cafee8-48ab-40e2-bbf4-951ae4c03616', 'linguistic', 'إتقان اللغة العربية', 'معرفة عميقة بقواعد وتراكيب اللغة العربية', true, 1, 40.0),
('64cafee8-48ab-40e2-bbf4-951ae4c03617', 'infrastructure', 'خبرة في إنترنت الأشياء', 'خبرة عملية في تطوير وتصميم أنظمة إنترنت الأشياء', true, 1, 35.0),
('660e8400-e29b-41d4-a716-446655440001', 'security', 'خبرة في الأمان السيبراني', 'معرفة متقدمة بأنظمة الحماية والتشفير', true, 1, 45.0);

-- 3. Idea analytics
INSERT INTO idea_analytics (idea_id, metric_name, metric_value, recorded_by) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'view_count', 45, '8066cfaf-4a91-4985-922b-74f6a286c441'),
('880e8400-e29b-41d4-a716-446655440001', 'rating_average', 8.5, '8066cfaf-4a91-4985-922b-74f6a286c441'),
('880e8400-e29b-41d4-a716-446655440002', 'view_count', 32, '8066cfaf-4a91-4985-922b-74f6a286c441'),
('880e8400-e29b-41d4-a716-446655440002', 'rating_average', 7.8, '8066cfaf-4a91-4985-922b-74f6a286c441'),
('880e8400-e29b-41d4-a716-446655440005', 'view_count', 28, '8066cfaf-4a91-4985-922b-74f6a286c441'),
('880e8400-e29b-41d4-a716-446655440006', 'rating_average', 9.2, '8066cfaf-4a91-4985-922b-74f6a286c441');

-- 4. Implementation tracker
INSERT INTO implementation_tracker (idea_id, phase, status, progress_percentage, start_date, estimated_completion, notes, last_updated_by) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'planning', 'in_progress', 25, '2024-01-15', '2024-06-30', 'بدء مرحلة التخطيط للمحفظة الرقمية', '8066cfaf-4a91-4985-922b-74f6a286c441'),
('880e8400-e29b-41d4-a716-446655440002', 'research', 'completed', 100, '2024-01-10', '2024-02-28', 'انتهاء مرحلة البحث للروبوت الطبي', 'fa80bed2-ed61-4c27-8941-f713cf050944'),
('880e8400-e29b-41d4-a716-446655440005', 'prototype', 'in_progress', 60, '2024-02-01', '2024-05-15', 'تطوير النموذج الأولي للحافلات الذكية', 'cb18b70f-a8fb-4265-bed0-a086ed236c22');

-- 5. Innovation maturity index
INSERT INTO innovation_maturity_index (entity_id, entity_type, maturity_level, score, assessment_date, assessed_by, strengths, improvement_areas) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'idea', 3, 7.5, '2024-01-20', '8066cfaf-4a91-4985-922b-74f6a286c441', 'تقنية متقدمة، فريق قوي', 'التسويق، التمويل'),
('880e8400-e29b-41d4-a716-446655440002', 'idea', 4, 8.2, '2024-01-25', 'fa80bed2-ed61-4c27-8941-f713cf050944', 'حل مبتكر، سوق كبير', 'التنظيم، الشراكات'),
('65cafee8-48ab-40e2-bbf4-951ae4c03618', 'challenge', 3, 6.8, '2024-02-01', 'cb18b70f-a8fb-4265-bed0-a086ed236c22', 'أهمية عالية، دعم إداري', 'الموارد، الخبرات');

-- 6. Role audit log
INSERT INTO role_audit_log (action_type, target_user_id, target_role, performed_by, justification, new_expires_at) VALUES
('ASSIGN', 'fa80bed2-ed61-4c27-8941-f713cf050944', 'admin', '8066cfaf-4a91-4985-922b-74f6a286c441', 'تعيين صلاحيات إدارية للمساعدة في إدارة النظام', NULL),
('MODIFY', 'cb18b70f-a8fb-4265-bed0-a086ed236c22', 'expert', '8066cfaf-4a91-4985-922b-74f6a286c441', 'تحديث مستوى الخبرة بناءً على الأداء', NULL),
('REVOKE', '157e3ce7-6e92-4a97-ad75-ef641234c307', 'evaluator', '8066cfaf-4a91-4985-922b-74f6a286c441', 'انتهاء فترة التقييم المؤقتة', '2024-03-31 23:59:59+00');

-- 7. Team project outcomes
INSERT INTO team_project_outcomes (team_id, project_type, project_id, outcome_type, success_metrics, completion_date, lessons_learned, recorded_by) VALUES
((SELECT id FROM innovation_teams WHERE name = 'Innovation Strategy Team'), 'campaign', (SELECT id FROM campaigns LIMIT 1), 'success', '{"participation": 85, "satisfaction": 4.2, "ideas_generated": 23}', '2024-01-30', 'التعاون الجيد بين أعضاء الفريق أدى لنتائج ممتازة', '8066cfaf-4a91-4985-922b-74f6a286c441'),
((SELECT id FROM innovation_teams WHERE name = 'Technology & Digital Team'), 'challenge', '65cafee8-48ab-40e2-bbf4-951ae4c03618', 'partial_success', '{"technical_feasibility": 90, "budget_adherence": 75}', '2024-02-15', 'تحديات في الميزانية لكن النتائج التقنية ممتازة', 'fa80bed2-ed61-4c27-8941-f713cf050944');

-- 8. Event participant notifications
INSERT INTO event_participant_notifications (event_id, participant_id, notification_type, message_content, status) VALUES
('1faa956d-318e-47b8-bc4c-878aad7c554a', '8066cfaf-4a91-4985-922b-74f6a286c441', 'registration_confirmation', 'تم تأكيد تسجيلك في قمة إطلاق التحول الرقمي', 'sent'),
('b29f90ac-a2a5-4e4d-b889-7d900133a97e', 'cb18b70f-a8fb-4265-bed0-a086ed236c22', 'reminder', 'تذكير: ورشة الخدمات الرقمية غداً الساعة 10 صباحاً', 'sent'),
('c86771fb-b20e-4822-86c3-161e4c813a84', '157e3ce7-6e92-4a97-ad75-ef641234c307', 'follow_up', 'شكراً لحضورك معرض تقنية الاستدامة، نرجو تقييم تجربتك', 'pending');

-- 9. Idea approval workflows  
INSERT INTO idea_approval_workflows (idea_id, approval_level, approver_id, status, decision_reason, is_required) VALUES
('880e8400-e29b-41d4-a716-446655440001', 1, '8066cfaf-4a91-4985-922b-74f6a286c441', 'approved', 'فكرة مبتكرة تستحق المتابعة', true),
('880e8400-e29b-41d4-a716-446655440002', 1, 'fa80bed2-ed61-4c27-8941-f713cf050944', 'pending', NULL, true),
('880e8400-e29b-41d4-a716-446655440005', 1, 'cb18b70f-a8fb-4265-bed0-a086ed236c22', 'approved', 'حل عملي لمشكلة حقيقية', true);

-- 10. Trend reports
INSERT INTO trend_reports (report_type, title, content, report_period_start, report_period_end, generated_by, key_findings) VALUES
('monthly', 'تقرير الاتجاهات الشهرية - يناير 2024', 'تحليل شامل لاتجاهات الابتكار خلال شهر يناير', '2024-01-01', '2024-01-31', '8066cfaf-4a91-4985-922b-74f6a286c441', '{"top_categories": ["AI", "Blockchain"], "participation_growth": 15}'),
('quarterly', 'تقرير الربع الأول 2024', 'مراجعة أداء الابتكار في الربع الأول', '2024-01-01', '2024-03-31', 'fa80bed2-ed61-4c27-8941-f713cf050944', '{"ideas_submitted": 45, "success_rate": 23}');

-- 11. User invitations
INSERT INTO user_invitations (inviter_id, invitee_email, role_requested, invitation_message, status, expires_at) VALUES
('8066cfaf-4a91-4985-922b-74f6a286c441', 'expert1@innovation.gov.sa', 'expert', 'دعوة للانضمام كخبير في منصة الابتكار', 'pending', '2024-03-01 23:59:59+00'),
('fa80bed2-ed61-4c27-8941-f713cf050944', 'evaluator1@innovation.gov.sa', 'evaluator', 'دعوة للمشاركة في تقييم الأفكار الابتكارية', 'sent', '2024-02-25 23:59:59+00');