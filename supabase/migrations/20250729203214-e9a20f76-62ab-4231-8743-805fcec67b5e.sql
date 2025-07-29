-- Comprehensive seeding migration for remaining empty tables (corrected)
-- Using existing foreign key IDs from the database

-- 1. Challenge Requirements (using basic requirement types)
INSERT INTO challenge_requirements (challenge_id, title, description, requirement_type, is_mandatory, weight_percentage, order_sequence) VALUES
('65cafee8-48ab-40e2-bbf4-951ae4c03618', 'متطلبات تقنية', 'يجب أن تكون الحلول متوافقة مع الأنظمة الصحية الحالية', 'mandatory', true, 30, 1),
('65cafee8-48ab-40e2-bbf4-951ae4c03618', 'متطلبات الأمان', 'ضمان حماية بيانات المرضى وفقاً لمعايير الخصوصية', 'security', true, 25, 2),
('63cafee8-48ab-40e2-bbf4-951ae4c03616', 'دعم اللغة العربية', 'يجب دعم النصوص العربية بشكل كامل', 'functional', true, 40, 1),
('64cafee8-48ab-40e2-bbf4-951ae4c03617', 'توافق مع إنترنت الأشياء', 'التكامل مع أجهزة إنترنت الأشياء الموجودة', 'technical', true, 35, 1),
('660e8400-e29b-41d4-a716-446655440001', 'معايير الأمان المصرفي', 'الامتثال لمعايير الأمان المصرفية الدولية', 'compliance', true, 50, 1);

-- 2. Campaign Partners
INSERT INTO campaign_partners (campaign_id, partner_id, partnership_type, partnership_status, contribution_amount, partnership_role) VALUES
('50793935-4861-4bb5-8645-d3c698402b1a', '86466aa4-4403-4d06-9ee8-1bc2de6f42b0', 'strategic', 'active', 500000, 'sponsor'),
('b756f28b-ec7f-4e52-a890-eeb04cc1bfe1', 'ca1c4560-45d2-420e-92bf-7a730d3cc20f', 'research', 'active', 300000, 'research_partner'),
('18f86632-64d2-4387-ba46-15f404f3bf3e', '1fb19a6f-6c4b-48d0-b60b-0b3f020046f0', 'technology', 'active', 200000, 'technology_provider'),
('1d2bb6e7-e1ea-4654-aeb5-8772dd2aef4f', '799cdcc4-1d3b-49a9-8c7b-d598f353e919', 'security', 'active', 150000, 'security_advisor'),
('a7b334c8-2101-443b-939a-536ad8a33fdf', '2c62d513-6e9f-44c4-bcbb-95fa98f91ae2', 'marketing', 'active', 100000, 'marketing_partner');

-- 3. Event Participants
INSERT INTO event_participants (event_id, user_id, attendance_status, registration_type, notes) VALUES
('1faa956d-318e-47b8-bc4c-878aad7c554a', 'fa80bed2-ed61-4c27-8941-f713cf050944', 'confirmed', 'invited', 'متحدث رئيسي'),
('1faa956d-318e-47b8-bc4c-878aad7c554a', '8066cfaf-4a91-4985-922b-74f6a286c441', 'confirmed', 'self_registered', 'مشارك'),
('b29f90ac-a2a5-4e4d-b889-7d900133a97e', '061e4b32-3e80-49bc-87b4-9fa5725aee8c', 'pending', 'invited', 'خبير في الورش'),
('c86771fb-b20e-4822-86c3-161e4c813a84', '8ca5cf6c-ce3c-458b-bd09-5023f8053d2c', 'confirmed', 'self_registered', 'زائر'),
('eea18844-bf00-4065-a16a-b2a6f6267f1a', '157e3ce7-6e92-4a97-ad75-ef641234c307', 'attended', 'self_registered', 'حضر بنجاح');

-- 4. Event Stakeholders
INSERT INTO event_stakeholders (event_id, stakeholder_id, invitation_status, attendance_status) VALUES
('1faa956d-318e-47b8-bc4c-878aad7c554a', '6b91ad41-a631-4c23-a1fd-8e479ec74457', 'sent', 'attended'),
('b29f90ac-a2a5-4e4d-b889-7d900133a97e', '89e07e2a-1420-46eb-a95f-04ae88d64b85', 'confirmed', 'attended'),
('c86771fb-b20e-4822-86c3-161e4c813a84', 'c7cbf0a2-cbc2-4375-aa8c-e5688e00c967', 'pending', 'not_attended'),
('eea18844-bf00-4065-a16a-b2a6f6267f1a', '6bfdccc7-9af8-4b05-a3e5-851846517175', 'declined', 'not_attended');

-- 5. Idea Attachments
INSERT INTO idea_attachments (idea_id, file_name, file_path, file_type, file_size, uploaded_by, description, is_public) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'blockchain_whitepaper.pdf', '/attachments/blockchain_whitepaper.pdf', 'application/pdf', 2048000, '2167cc32-2308-4768-9097-d026779c20c2', 'ورقة بيضاء تقنية البلوك تشين', true),
('880e8400-e29b-41d4-a716-446655440002', 'medical_robot_specs.docx', '/attachments/medical_robot_specs.docx', 'application/msword', 1024000, 'd01a9d41-fca6-47df-a0da-11975be11ffc', 'مواصفات الروبوت الطبي', false),
('880e8400-e29b-41d4-a716-446655440005', 'bus_network_diagram.png', '/attachments/bus_network_diagram.png', 'image/png', 512000, 'cefacad0-5118-4475-a9be-96acb0ff9448', 'مخطط شبكة الحافلات', true);

-- 6. Idea Collaboration Teams
INSERT INTO idea_collaboration_teams (idea_id, member_id, role, status, added_by, permissions) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'd01a9d41-fca6-47df-a0da-11975be11ffc', 'co_developer', 'active', '2167cc32-2308-4768-9097-d026779c20c2', '{"edit": true, "comment": true, "approve": false}'),
('880e8400-e29b-41d4-a716-446655440002', 'cefacad0-5118-4475-a9be-96acb0ff9448', 'reviewer', 'active', 'd01a9d41-fca6-47df-a0da-11975be11ffc', '{"edit": false, "comment": true, "approve": true}'),
('880e8400-e29b-41d4-a716-446655440005', '7946c490-2d7b-4c07-8d6f-af4c284b526e', 'contributor', 'active', 'cefacad0-5118-4475-a9be-96acb0ff9448', '{"edit": false, "comment": true, "approve": false}');

-- 7. Implementation Tracker
INSERT INTO implementation_tracker (idea_id, milestone_name, milestone_description, target_date, completion_percentage, status, responsible_team_member, last_updated_by) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'مرحلة التصميم', 'تصميم واجهة المحفظة الرقمية', '2024-08-15', 75, 'in_progress', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', '71e0fb71-c8f6-455c-a10a-8ced61ca830a'),
('880e8400-e29b-41d4-a716-446655440002', 'النموذج الأولي', 'بناء النموذج الأولي للروبوت', '2024-09-01', 40, 'in_progress', '392bb10b-f2a8-4791-8f8b-510262056f9a', '98c13bbb-edf7-44cb-b483-099637988714'),
('880e8400-e29b-41d4-a716-446655440005', 'اختبار النظام', 'اختبار شبكة الحافلات الذكية', '2024-07-30', 90, 'near_completion', 'b4365f74-4b0e-4adc-8693-7dc0f35a5de6', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e');

-- 8. User Invitations
INSERT INTO user_invitations (email, invited_by, role, status, invitation_token, expires_at, acceptance_url, invitation_message) VALUES
('ahmed.alrashid@gov.sa', 'f07d24ff-a9e6-4a82-bfa0-483cdcb6930e', 'expert', 'sent', 'inv_token_1234567890abcdef', '2024-08-15 23:59:59', '/accept-invitation?token=inv_token_1234567890abcdef', 'دعوة للانضمام كخبير في منصة الابتكار'),
('fatima.almansouri@tech.sa', '71e0fb71-c8f6-455c-a10a-8ced61ca830a', 'innovator', 'pending', 'inv_token_abcdef1234567890', '2024-08-20 23:59:59', '/accept-invitation?token=inv_token_abcdef1234567890', 'دعوة للمشاركة في مسابقة الابتكار'),
('mohammad.alzahra@research.sa', '392bb10b-f2a8-4791-8f8b-510262056f9a', 'team_member', 'accepted', 'inv_token_fedcba0987654321', '2024-07-30 23:59:59', '/accept-invitation?token=inv_token_fedcba0987654321', 'انضمام لفريق البحث والتطوير');