-- Final working seeding migration with correct column structures
-- Using existing foreign key IDs from the database

-- 1. Campaign Partners (already confirmed columns)
INSERT INTO campaign_partners (campaign_id, partner_id, partnership_status, contribution_amount, partnership_role) VALUES
('50793935-4861-4bb5-8645-d3c698402b1a', '86466aa4-4403-4d06-9ee8-1bc2de6f42b0', 'active', 500000, 'sponsor'),
('b756f28b-ec7f-4e52-a890-eeb04cc1bfe1', 'ca1c4560-45d2-420e-92bf-7a730d3cc20f', 'active', 300000, 'research_partner'),
('18f86632-64d2-4387-ba46-15f404f3bf3e', '1fb19a6f-6c4b-48d0-b60b-0b3f020046f0', 'active', 200000, 'technology_provider'),
('1d2bb6e7-e1ea-4654-aeb5-8772dd2aef4f', '799cdcc4-1d3b-49a9-8c7b-d598f353e919', 'active', 150000, 'security_advisor'),
('a7b334c8-2101-443b-939a-536ad8a33fdf', '2c62d513-6e9f-44c4-bcbb-95fa98f91ae2', 'active', 100000, 'marketing_partner');

-- 2. Event Participants
INSERT INTO event_participants (event_id, user_id, attendance_status, registration_type, notes) VALUES
('1faa956d-318e-47b8-bc4c-878aad7c554a', 'fa80bed2-ed61-4c27-8941-f713cf050944', 'confirmed', 'invited', 'متحدث رئيسي'),
('1faa956d-318e-47b8-bc4c-878aad7c554a', '8066cfaf-4a91-4985-922b-74f6a286c441', 'confirmed', 'self_registered', 'مشارك'),
('b29f90ac-a2a5-4e4d-b889-7d900133a97e', '061e4b32-3e80-49bc-87b4-9fa5725aee8c', 'pending', 'invited', 'خبير في الورش'),
('c86771fb-b20e-4822-86c3-161e4c813a84', '8ca5cf6c-ce3c-458b-bd09-5023f8053d2c', 'confirmed', 'self_registered', 'زائر'),
('eea18844-bf00-4065-a16a-b2a6f6267f1a', '157e3ce7-6e92-4a97-ad75-ef641234c307', 'attended', 'self_registered', 'حضر بنجاح');

-- 3. Event Participant Notifications
INSERT INTO event_participant_notifications (event_id, participant_id, notification_type, status, message_content) VALUES
('1faa956d-318e-47b8-bc4c-878aad7c554a', 'fa80bed2-ed61-4c27-8941-f713cf050944', 'reminder', 'sent', 'تذكير بالفعالية غداً'),
('1faa956d-318e-47b8-bc4c-878aad7c554a', '8066cfaf-4a91-4985-922b-74f6a286c441', 'confirmation', 'sent', 'تأكيد التسجيل'),
('b29f90ac-a2a5-4e4d-b889-7d900133a97e', '061e4b32-3e80-49bc-87b4-9fa5725aee8c', 'invitation', 'delivered', 'دعوة للمشاركة');

-- 4. Event Stakeholders
INSERT INTO event_stakeholders (event_id, stakeholder_id, invitation_status, attendance_status) VALUES
('1faa956d-318e-47b8-bc4c-878aad7c554a', '6b91ad41-a631-4c23-a1fd-8e479ec74457', 'sent', 'attended'),
('b29f90ac-a2a5-4e4d-b889-7d900133a97e', '89e07e2a-1420-46eb-a95f-04ae88d64b85', 'confirmed', 'attended'),
('c86771fb-b20e-4822-86c3-161e4c813a84', 'c7cbf0a2-cbc2-4375-aa8c-e5688e00c967', 'pending', 'not_attended');

-- 5. Idea Approval Workflows
INSERT INTO idea_approval_workflows (idea_id, approver_id, approval_level, status, is_required) VALUES
('508948d0-2568-4b32-8b3c-b779d31edf97', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 1, 'pending', true),
('880e8400-e29b-41d4-a716-446655440001', '71e0fb71-c8f6-455c-a10a-8ced61ca830a', 1, 'approved', true),
('880e8400-e29b-41d4-a716-446655440002', '392bb10b-f2a8-4791-8f8b-510262056f9a', 1, 'pending', true);

-- 6. Idea Attachments
INSERT INTO idea_attachments (idea_id, file_name, file_path, file_type, file_size, uploaded_by, description, is_public) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'blockchain_whitepaper.pdf', '/attachments/blockchain_whitepaper.pdf', 'application/pdf', 2048000, '2167cc32-2308-4768-9097-d026779c20c2', 'ورقة بيضاء تقنية البلوك تشين', true),
('880e8400-e29b-41d4-a716-446655440002', 'medical_robot_specs.docx', '/attachments/medical_robot_specs.docx', 'application/msword', 1024000, 'd01a9d41-fca6-47df-a0da-11975be11ffc', 'مواصفات الروبوت الطبي', false),
('880e8400-e29b-41d4-a716-446655440005', 'bus_network_diagram.png', '/attachments/bus_network_diagram.png', 'image/png', 512000, 'cefacad0-5118-4475-a9be-96acb0ff9448', 'مخطط شبكة الحافلات', true);

-- 7. Idea Collaboration Teams
INSERT INTO idea_collaboration_teams (idea_id, member_id, role, status, added_by, permissions) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'd01a9d41-fca6-47df-a0da-11975be11ffc', 'co_developer', 'active', '2167cc32-2308-4768-9097-d026779c20c2', '{"edit": true, "comment": true, "approve": false}'),
('880e8400-e29b-41d4-a716-446655440002', 'cefacad0-5118-4475-a9be-96acb0ff9448', 'reviewer', 'active', 'd01a9d41-fca6-47df-a0da-11975be11ffc', '{"edit": false, "comment": true, "approve": true}');

-- 8. User Invitations (using actual columns)
INSERT INTO user_invitations (email, invited_by, invitation_token, name, name_ar, department, position, initial_roles, status, expires_at) VALUES
('ahmed.alrashid@gov.sa', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'inv_token_1234567890abcdef', 'Ahmed Al-Rashid', 'أحمد الراشد', 'Innovation Department', 'Expert', '["expert"]', 'sent', '2024-08-15 23:59:59'),
('fatima.almansouri@tech.sa', '71e0fb71-c8f6-455c-a10a-8ced61ca830a', 'inv_token_abcdef1234567890', 'Fatima Al-Mansouri', 'فاطمة المنصوري', 'Technology Department', 'Innovator', '["innovator"]', 'pending', '2024-08-20 23:59:59'),
('mohammad.alzahra@research.sa', '392bb10b-f2a8-4791-8f8b-510262056f9a', 'inv_token_fedcba0987654321', 'Mohammad Al-Zahra', 'محمد الزهراء', 'Research Department', 'Team Member', '["team_member"]', 'accepted', '2024-07-30 23:59:59');