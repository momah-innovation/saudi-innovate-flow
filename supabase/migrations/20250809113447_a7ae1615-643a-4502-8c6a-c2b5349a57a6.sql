-- Add workspace translations to existing system_translations table
-- Using the correct column structure: translation_key, text_en, text_ar, category

-- Insert workspace translations for User Workspace
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('workspace.user.title', 'Personal Workspace', 'مساحة العمل الشخصية', 'workspace'),
('workspace.user.description', 'Your personal workspace to manage your activities and projects', 'مساحة عملك الشخصية لإدارة أنشطتك ومشاريعك', 'workspace'),
('workspace.user.features.myIdeas', 'My Ideas', 'أفكاري', 'workspace'),
('workspace.user.features.mySubmissions', 'My Submissions', 'مساهماتي', 'workspace'),
('workspace.user.features.favoriteEvents', 'Favorite Events', 'الفعاليات المفضلة', 'workspace'),
('workspace.user.features.bookmarkedChallenges', 'Bookmarked Challenges', 'التحديات المحفوظة', 'workspace'),
('workspace.user.features.notificationSettings', 'Notification Settings', 'إعدادات الإشعارات', 'workspace'),
('workspace.user.features.profileManagement', 'Profile Management', 'إدارة الملف الشخصي', 'workspace'),

-- Insert workspace translations for Expert Workspace
('workspace.expert.title', 'Expert Workspace', 'مساحة عمل الخبير', 'workspace'),
('workspace.expert.description', 'Specialized workspace for experts to evaluate ideas and manage challenges', 'مساحة عمل متخصصة للخبراء لتقييم الأفكار وإدارة التحديات', 'workspace'),
('workspace.expert.features.ideaEvaluation', 'Idea Evaluation', 'تقييم الأفكار', 'workspace'),
('workspace.expert.features.challengeReview', 'Challenge Review', 'مراجعة التحديات', 'workspace'),
('workspace.expert.features.scorecardManagement', 'Scorecard Management', 'إدارة بطاقات التقييم', 'workspace'),
('workspace.expert.features.expertFeedback', 'Expert Feedback', 'ملاحظات الخبراء', 'workspace'),
('workspace.expert.features.reportGeneration', 'Report Generation', 'إنشاء التقارير', 'workspace'),
('workspace.expert.features.mentorshipActivities', 'Mentorship Activities', 'أنشطة التوجيه', 'workspace'),

-- Insert workspace translations for Organization Workspace
('workspace.organization.title', 'Organization Workspace', 'مساحة عمل المؤسسة', 'workspace'),
('workspace.organization.description', 'Organization workspace for managing challenges, events, and projects', 'مساحة عمل المؤسسة لإدارة التحديات والفعاليات والمشاريع', 'workspace'),
('workspace.organization.features.challengeManagement', 'Challenge Management', 'إدارة التحديات', 'workspace'),
('workspace.organization.features.eventCoordination', 'Event Coordination', 'تنسيق الفعاليات', 'workspace'),
('workspace.organization.features.teamCollaboration', 'Team Collaboration', 'تعاون الفريق', 'workspace'),
('workspace.organization.features.resourcePlanning', 'Resource Planning', 'تخطيط الموارد', 'workspace'),
('workspace.organization.features.stakeholderCommunication', 'Stakeholder Communication', 'التواصل مع أصحاب المصلحة', 'workspace'),
('workspace.organization.features.progressTracking', 'Progress Tracking', 'تتبع التقدم', 'workspace'),

-- Insert workspace translations for Partner Workspace
('workspace.partner.title', 'Partner Workspace', 'مساحة عمل الشريك', 'workspace'),
('workspace.partner.description', 'Partner workspace for collaboration and contribution to projects and solutions', 'مساحة عمل للشركاء للتعاون والمساهمة في المشاريع والحلول', 'workspace'),
('workspace.partner.features.partnershipManagement', 'Partnership Management', 'إدارة الشراكات', 'workspace'),
('workspace.partner.features.resourceContribution', 'Resource Contribution', 'مساهمة الموارد', 'workspace'),
('workspace.partner.features.collaborativeProjects', 'Collaborative Projects', 'المشاريع التعاونية', 'workspace'),
('workspace.partner.features.marketplaceAccess', 'Marketplace Access', 'الوصول للسوق', 'workspace'),
('workspace.partner.features.networkingOpportunities', 'Networking Opportunities', 'فرص التواصل', 'workspace'),
('workspace.partner.features.performanceMetrics', 'Performance Metrics', 'مقاييس الأداء', 'workspace'),

-- Insert workspace translations for Admin Workspace
('workspace.admin.title', 'Admin Workspace', 'مساحة عمل الإدارة', 'workspace'),
('workspace.admin.description', 'Comprehensive workspace for system, user, and operations management', 'مساحة عمل شاملة لإدارة النظام والمستخدمين والعمليات', 'workspace'),
('workspace.admin.features.systemConfiguration', 'System Configuration', 'إعدادات النظام', 'workspace'),
('workspace.admin.features.userManagement', 'User Management', 'إدارة المستخدمين', 'workspace'),
('workspace.admin.features.rolePermissions', 'Role Permissions', 'أذونات الأدوار', 'workspace'),
('workspace.admin.features.dataAnalytics', 'Data Analytics', 'تحليل البيانات', 'workspace'),
('workspace.admin.features.securityMonitoring', 'Security Monitoring', 'مراقبة الأمان', 'workspace'),
('workspace.admin.features.systemMaintenance', 'System Maintenance', 'صيانة النظام', 'workspace'),

-- Insert workspace translations for Team Workspace
('workspace.team.title', 'Team Workspace', 'مساحة عمل الفريق', 'workspace'),
('workspace.team.description', 'Collaborative workspace for innovation teams to manage projects and tasks', 'مساحة عمل تعاونية لفرق الابتكار لإدارة المشاريع والمهام', 'workspace'),
('workspace.team.features.projectManagement', 'Project Management', 'إدارة المشاريع', 'workspace'),
('workspace.team.features.taskAssignment', 'Task Assignment', 'تكليف المهام', 'workspace'),
('workspace.team.features.capacityPlanning', 'Capacity Planning', 'تخطيط القدرات', 'workspace'),
('workspace.team.features.workloadTracking', 'Workload Tracking', 'تتبع عبء العمل', 'workspace'),
('workspace.team.features.performanceMetrics', 'Performance Metrics', 'مقاييس الأداء', 'workspace'),
('workspace.team.features.communicationTools', 'Communication Tools', 'أدوات التواصل', 'workspace'),

-- Insert general workspace translations
('workspace.concept.definition', 'A workspace is an interactive work environment tailored to the user role, focused on tasks, productivity, and collaboration', 'مساحة العمل هي بيئة عمل تفاعلية مخصصة لدور المستخدم، تركز على المهام والإنتاجية والتعاون', 'workspace'),
('workspace.vs.dashboard.workspace', 'Workspace: Active environment for work, collaboration, and task completion', 'مساحة العمل: بيئة نشطة للعمل والتعاون وإنجاز المهام', 'workspace'),
('workspace.vs.dashboard.dashboard', 'Dashboard: Passive display of information and analytics', 'لوحة المعلومات: عرض سلبي للمعلومات والإحصائيات', 'workspace'),
('workspace.navigation.workspaces', 'Workspaces', 'مساحات العمل', 'workspace'),
('workspace.common.features', 'Features', 'المميزات', 'workspace'),
('workspace.common.tools', 'Tools', 'الأدوات', 'workspace'),
('workspace.common.activities', 'Activities', 'الأنشطة', 'workspace'),
('workspace.common.collaboration', 'Collaboration', 'التعاون', 'workspace');