-- Add translation keys for remaining admin components
INSERT INTO public.system_translations (translation_key, text_en, text_ar, category) VALUES

-- Challenge Wizard
('admin.challenges.wizard_title', 'Challenge Creation Wizard', 'معالج إنشاء التحدي', 'wizard'),
('admin.challenges.basic_info', 'Basic Information', 'المعلومات الأساسية', 'wizard'),
('admin.challenges.challenge_details', 'Challenge Details', 'تفاصيل التحدي', 'wizard'),
('admin.challenges.organizational_setup', 'Organizational Setup', 'الإعداد التنظيمي', 'wizard'),
('admin.challenges.partnerships', 'Partnerships & Collaboration', 'الشراكات والتعاون', 'wizard'),
('admin.challenges.review_submit', 'Review & Submit', 'مراجعة وإرسال', 'wizard'),

-- Dashboard Admin Cards
('admin.dashboard.user_management', 'User Management', 'إدارة المستخدمين', 'admin'),
('admin.dashboard.user_management_desc', 'Manage users, roles and permissions', 'إدارة المستخدمين والأدوار والصلاحيات', 'admin'),
('admin.dashboard.role_management', 'Role Management', 'إدارة الأدوار', 'admin'),
('admin.dashboard.role_management_desc', 'Configure roles and permissions', 'تكوين الأدوار والصلاحيات', 'admin'),
('admin.dashboard.access_control', 'Access Control', 'التحكم في الوصول', 'admin'),
('admin.dashboard.access_control_desc', 'Manage page and feature access control', 'إدارة التحكم في الوصول للصفحات والميزات', 'admin'),
('admin.dashboard.challenge_management', 'Challenge Management', 'إدارة التحديات', 'admin'),
('admin.dashboard.challenge_management_desc', 'Create and manage challenges and competitions', 'إنشاء وإدارة التحديات والمسابقات', 'admin'),
('admin.dashboard.ideas_management', 'Ideas Management', 'إدارة الأفكار', 'admin'),
('admin.dashboard.ideas_management_desc', 'Review and manage submitted ideas', 'مراجعة وإدارة الأفكار المقترحة', 'admin'),
('admin.dashboard.analytics_reports', 'Analytics & Reports', 'التحليلات والتقارير', 'admin'),
('admin.dashboard.analytics_reports_desc', 'View system reports and advanced analytics', 'عرض تقارير النظام والإحصائيات المتقدمة', 'admin'),
('admin.dashboard.system_settings', 'System Settings', 'إعدادات النظام', 'admin'),
('admin.dashboard.system_settings_desc', 'Configure global system settings', 'تكوين إعدادات النظام العامة', 'admin'),
('admin.dashboard.events_management', 'Events Management', 'إدارة الفعاليات', 'admin'),
('admin.dashboard.events_management_desc', 'Organize and manage events and conferences', 'تنظيم وإدارة الفعاليات والمؤتمرات', 'admin'),
('admin.dashboard.campaigns_management', 'Campaigns Management', 'إدارة الحملات', 'admin'),
('admin.dashboard.campaigns_management_desc', 'Create and manage innovation campaigns', 'إنشاء وإدارة حملات الابتكار', 'admin'),
('admin.dashboard.partners_management', 'Partners Management', 'إدارة الشراكات', 'admin'),
('admin.dashboard.partners_management_desc', 'Manage partnerships and external collaborations', 'إدارة الشراكات والتعاون الخارجي', 'admin'),
('admin.dashboard.sectors_management', 'Sectors Management', 'إدارة القطاعات', 'admin'),
('admin.dashboard.sectors_management_desc', 'Manage innovation sectors and fields', 'إدارة القطاعات والمجالات الابتكارية', 'admin'),
('admin.dashboard.expert_assignment', 'Expert Assignment Management', 'مهام الخبراء', 'admin'),
('admin.dashboard.expert_assignment_desc', 'Assign experts to challenges and manage evaluations', 'تعيين الخبراء للتحديات وإدارة التقييمات', 'admin'),
('admin.dashboard.core_team', 'Core Team Management', 'إدارة الفريق الأساسي', 'admin'),
('admin.dashboard.core_team_desc', 'Manage core team members and projects', 'إدارة أعضاء الفريق الأساسي والمشاريع', 'admin'),
('admin.dashboard.organizational_structure', 'Organizational Structure', 'الهيكل التنظيمي', 'admin'),
('admin.dashboard.organizational_structure_desc', 'Manage organizational hierarchy and departments', 'إدارة الهيكل التنظيمي والإدارات', 'admin'),
('admin.dashboard.stakeholders', 'Stakeholders Management', 'أصحاب المصلحة', 'admin'),
('admin.dashboard.stakeholders_desc', 'Manage stakeholder relationships and engagement', 'إدارة علاقات أصحاب المصلحة', 'admin'),
('admin.dashboard.teams_management', 'Teams Management', 'إدارة الفرق', 'admin'),
('admin.dashboard.teams_management_desc', 'Organize work teams and projects', 'تنظيم فرق العمل والمشاريع', 'admin'),
('admin.dashboard.entities_management', 'Entities Management', 'إدارة الكيانات', 'admin'),
('admin.dashboard.entities_management_desc', 'Manage organizational entities and institutions', 'إدارة الكيانات التنظيمية والمؤسسات', 'admin'),

-- Dashboard Categories
('admin.dashboard.category.management', 'Management', 'الإدارة العامة', 'admin'),
('admin.dashboard.category.content', 'Content Management', 'إدارة المحتوى', 'admin'),
('admin.dashboard.category.security', 'Security & Access', 'الأمان والصلاحيات', 'admin'),
('admin.dashboard.category.analytics', 'Analytics', 'التحليلات', 'admin'),
('admin.dashboard.category.system', 'System Configuration', 'إعدادات النظام', 'admin'),

-- Navigation
('admin.dashboard.overview', 'Overview', 'نظرة عامة', 'navigation'),
('admin.dashboard.quick_actions', 'Quick Actions', 'إجراءات سريعة', 'navigation')

ON CONFLICT (translation_key) DO UPDATE SET
text_en = EXCLUDED.text_en,
text_ar = EXCLUDED.text_ar,
category = EXCLUDED.category;