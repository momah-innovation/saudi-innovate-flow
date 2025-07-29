-- Seed remaining empty tables with corrected data

-- 1. Event participants (users registered for events)
INSERT INTO event_participants (event_id, user_id, registration_type, attendance_status, notes) VALUES
('1faa956d-318e-47b8-bc4c-878aad7c554a', '8066cfaf-4a91-4985-922b-74f6a286c441', 'self_registered', 'registered', 'مهتم بمتابعة التحول الرقمي'),
('1faa956d-318e-47b8-bc4c-878aad7c554a', 'fa80bed2-ed61-4c27-8941-f713cf050944', 'invited', 'confirmed', 'خبير في المجال'),
('b29f90ac-a2a5-4e4d-b889-7d900133a97e', 'cb18b70f-a8fb-4265-bed0-a086ed236c22', 'self_registered', 'attended', 'حضر ورش الخدمات الرقمية'),
('c86771fb-b20e-4822-86c3-161e4c813a84', '157e3ce7-6e92-4a97-ad75-ef641234c307', 'invited', 'registered', 'محلل في تقنيات الاستدامة');

-- 2. Idea analytics
INSERT INTO idea_analytics (idea_id, metric_name, metric_value, recorded_by) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'view_count', 45, '8066cfaf-4a91-4985-922b-74f6a286c441'),
('880e8400-e29b-41d4-a716-446655440001', 'rating_average', 8.5, '8066cfaf-4a91-4985-922b-74f6a286c441'),
('880e8400-e29b-41d4-a716-446655440002', 'view_count', 32, '8066cfaf-4a91-4985-922b-74f6a286c441'),
('880e8400-e29b-41d4-a716-446655440005', 'view_count', 28, '8066cfaf-4a91-4985-922b-74f6a286c441');

-- 3. Implementation tracker 
INSERT INTO implementation_tracker (idea_id, phase, status, progress_percentage, start_date, estimated_completion, notes, last_updated_by) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'planning', 'in_progress', 25, '2024-01-15', '2024-06-30', 'بدء مرحلة التخطيط للمحفظة الرقمية', '8066cfaf-4a91-4985-922b-74f6a286c441'),
('880e8400-e29b-41d4-a716-446655440002', 'research', 'completed', 100, '2024-01-10', '2024-02-28', 'انتهاء مرحلة البحث للروبوت الطبي', 'fa80bed2-ed61-4c27-8941-f713cf050944'),
('880e8400-e29b-41d4-a716-446655440005', 'prototype', 'in_progress', 60, '2024-02-01', '2024-05-15', 'تطوير النموذج الأولي للحافلات الذكية', 'cb18b70f-a8fb-4265-bed0-a086ed236c22');

-- 4. Innovation maturity index
INSERT INTO innovation_maturity_index (entity_id, entity_type, maturity_level, score, assessment_date, assessed_by, strengths, improvement_areas) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'idea', 3, 7.5, '2024-01-20', '8066cfaf-4a91-4985-922b-74f6a286c441', 'تقنية متقدمة، فريق قوي', 'التسويق، التمويل'),
('880e8400-e29b-41d4-a716-446655440002', 'idea', 4, 8.2, '2024-01-25', 'fa80bed2-ed61-4c27-8941-f713cf050944', 'حل مبتكر، سوق كبير', 'التنظيم، الشراكات');

-- 5. Role audit log
INSERT INTO role_audit_log (action_type, target_user_id, target_role, performed_by, justification) VALUES
('ASSIGN', 'fa80bed2-ed61-4c27-8941-f713cf050944', 'admin', '8066cfaf-4a91-4985-922b-74f6a286c441', 'تعيين صلاحيات إدارية للمساعدة في إدارة النظام'),
('MODIFY', 'cb18b70f-a8fb-4265-bed0-a086ed236c22', 'expert', '8066cfaf-4a91-4985-922b-74f6a286c441', 'تحديث مستوى الخبرة بناءً على الأداء');

-- 6. Event participant notifications
INSERT INTO event_participant_notifications (event_id, participant_id, notification_type, message_content, status) VALUES
('1faa956d-318e-47b8-bc4c-878aad7c554a', '8066cfaf-4a91-4985-922b-74f6a286c441', 'registration_confirmation', 'تم تأكيد تسجيلك في قمة إطلاق التحول الرقمي', 'sent'),
('b29f90ac-a2a5-4e4d-b889-7d900133a97e', 'cb18b70f-a8fb-4265-bed0-a086ed236c22', 'reminder', 'تذكير: ورشة الخدمات الرقمية غداً الساعة 10 صباحاً', 'sent');

-- 7. Idea approval workflows  
INSERT INTO idea_approval_workflows (idea_id, approval_level, approver_id, status, decision_reason, is_required) VALUES
('880e8400-e29b-41d4-a716-446655440001', 1, '8066cfaf-4a91-4985-922b-74f6a286c441', 'approved', 'فكرة مبتكرة تستحق المتابعة', true),
('880e8400-e29b-41d4-a716-446655440002', 1, 'fa80bed2-ed61-4c27-8941-f713cf050944', 'pending', NULL, true);

-- 8. Idea attachments
INSERT INTO idea_attachments (idea_id, uploaded_by, file_name, file_path, file_size, file_type, description, is_public) VALUES
('880e8400-e29b-41d4-a716-446655440001', '8066cfaf-4a91-4985-922b-74f6a286c441', 'blockchain_wallet_design.pdf', '/uploads/ideas/blockchain_wallet_design.pdf', 1024567, 'application/pdf', 'تصميم المحفظة الرقمية', true),
('880e8400-e29b-41d4-a716-446655440002', 'fa80bed2-ed61-4c27-8941-f713cf050944', 'medical_robot_specs.docx', '/uploads/ideas/medical_robot_specs.docx', 890123, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'مواصفات الروبوت الطبي', false);

-- 9. Trend reports
INSERT INTO trend_reports (report_type, title, content, report_period_start, report_period_end, generated_by, key_findings) VALUES
('monthly', 'تقرير الاتجاهات الشهرية - يناير 2024', 'تحليل شامل لاتجاهات الابتكار خلال شهر يناير', '2024-01-01', '2024-01-31', '8066cfaf-4a91-4985-922b-74f6a286c441', '{"top_categories": ["AI", "Blockchain"], "participation_growth": 15}'),
('quarterly', 'تقرير الربع الأول 2024', 'مراجعة أداء الابتكار في الربع الأول', '2024-01-01', '2024-03-31', 'fa80bed2-ed61-4c27-8941-f713cf050944', '{"ideas_submitted": 45, "success_rate": 23}');

-- 10. User invitations
INSERT INTO user_invitations (inviter_id, invitee_email, role_requested, invitation_message, status, expires_at) VALUES
('8066cfaf-4a91-4985-922b-74f6a286c441', 'expert1@innovation.gov.sa', 'expert', 'دعوة للانضمام كخبير في منصة الابتكار', 'pending', '2024-03-01 23:59:59+00'),
('fa80bed2-ed61-4c27-8941-f713cf050944', 'evaluator1@innovation.gov.sa', 'evaluator', 'دعوة للمشاركة في تقييم الأفكار الابتكارية', 'sent', '2024-02-25 23:59:59+00');