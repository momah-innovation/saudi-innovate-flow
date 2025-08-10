-- Add remaining translation keys for TeamWizard and StakeholderWizard completion
INSERT INTO public.system_translations (translation_key, text_ar, text_en, category) VALUES
-- Remaining Team Wizard translations
('team_wizard.description', 'وصف الفريق', 'Team Description', 'team_wizard'),
('team_wizard.description_placeholder', 'اكتب وصفاً مفصلاً للفريق وأهدافه', 'Write a detailed description of the team and its objectives', 'team_wizard'),
('team_wizard.description_hint', 'وصف شامل يوضح مهام الفريق وأهدافه (لا يقل عن 20 حرف)', 'Comprehensive description explaining team tasks and objectives (minimum 20 characters)', 'team_wizard'),
('team_wizard.team_type', 'نوع الفريق', 'Team Type', 'team_wizard'),
('team_wizard.select_team_type', 'اختر نوع الفريق', 'Select team type', 'team_wizard'),
('team_wizard.team_details', 'تفاصيل الفريق', 'Team Details', 'team_wizard'),
('team_wizard.team_details_description', 'حدد إعدادات وإدارة الفريق', 'Set team settings and management', 'team_wizard'),
('team_wizard.edit_team', 'تعديل الفريق', 'Edit Team', 'team_wizard'),
('team_wizard.new_team', 'فريق جديد', 'New Team', 'team_wizard'),

-- Remaining Stakeholder Wizard translations  
('stakeholder_wizard.interest_level', 'مستوى الاهتمام', 'Interest Level', 'stakeholder_wizard'),
('stakeholder_wizard.select_interest_level', 'اختر مستوى الاهتمام', 'Select interest level', 'stakeholder_wizard'),
('stakeholder_wizard.engagement_status', 'حالة المشاركة', 'Engagement Status', 'stakeholder_wizard'),
('stakeholder_wizard.select_engagement_status', 'اختر حالة المشاركة', 'Select engagement status', 'stakeholder_wizard')

ON CONFLICT (translation_key) DO UPDATE SET
text_ar = EXCLUDED.text_ar,
text_en = EXCLUDED.text_en,
category = EXCLUDED.category;