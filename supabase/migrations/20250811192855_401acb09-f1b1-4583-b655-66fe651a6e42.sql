-- Add missing team management and other system setting translation keys
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- System settings that are missing
('settings.system_org_max_hierarchy_levels.description', 'Maximum number of organizational hierarchy levels', 'الحد الأقصى لعدد مستويات التسلسل الهرمي التنظيمي', 'settings'),
('settings.system_sort_lists_alphabetically.label', 'Sort Lists Alphabetically', 'ترتيب القوائم أبجدياً', 'settings'),
('settings.system_sort_lists_alphabetically.description', 'Automatically sort all lists alphabetically', 'ترتيب جميع القوائم أبجدياً تلقائياً', 'settings'),
('settings.system_supported_languages.label', 'Supported Languages', 'اللغات المدعومة', 'settings'),
('settings.system_supported_languages.description', 'List of languages supported by the system', 'قائمة اللغات المدعومة في النظام', 'settings'),
('settings.system_systemName.label', 'System Name', 'اسم النظام', 'settings'),
('settings.system_systemName.description', 'The name displayed for the system', 'الاسم المعروض للنظام', 'settings'),
('settings.tag_categories.label', 'Tag Categories', 'فئات العلامات', 'settings'),
('settings.tag_categories.description', 'Categories for organizing tags', 'فئات لتنظيم العلامات', 'settings'),

-- Team Management category and settings
('settings.category.Team Management', 'Team Management', 'إدارة الفريق', 'settings'),
('settings.category.Team Management.description', 'Settings for managing team members, roles, and performance', 'إعدادات إدارة أعضاء الفريق والأدوار والأداء', 'settings'),

-- Team member workload settings
('settings.team_member_max_workload.label', 'Maximum Member Workload', 'الحد الأقصى لعبء العمل للعضو', 'settings'),
('settings.team_member_max_workload.description', 'Maximum number of tasks a team member can handle', 'الحد الأقصى لعدد المهام التي يمكن لعضو الفريق التعامل معها', 'settings'),
('settings.team_member_min_workload.label', 'Minimum Member Workload', 'الحد الأدنى لعبء العمل للعضو', 'settings'),
('settings.team_member_min_workload.description', 'Minimum number of tasks a team member should handle', 'الحد الأدنى لعدد المهام التي يجب على عضو الفريق التعامل معها', 'settings'),

-- Team performance settings
('settings.team_performance_rating_step.label', 'Performance Rating Step', 'خطوة تقييم الأداء', 'settings'),
('settings.team_performance_rating_step.description', 'Step increment for performance ratings', 'زيادة الخطوة لتقييمات الأداء', 'settings'),
('settings.team_role_options.label', 'Team Role Options', 'خيارات أدوار الفريق', 'settings'),
('settings.team_role_options.description', 'Available roles for team members', 'الأدوار المتاحة لأعضاء الفريق', 'settings'),
('settings.team_specialization_options.label', 'Team Specialization Options', 'خيارات تخصص الفريق', 'settings'),
('settings.team_specialization_options.description', 'Available specializations for team members', 'التخصصات المتاحة لأعضاء الفريق', 'settings'),

-- Team insights and capacity
('settings.team_insight_title_preview_length.label', 'Insight Title Preview Length', 'طول معاينة عنوان الرؤية', 'settings'),
('settings.team_insight_title_preview_length.description', 'Character limit for insight title previews', 'حد الأحرف لمعاينات عناوين الرؤى', 'settings'),
('settings.team_insights_display_limit.label', 'Insights Display Limit', 'حد عرض الرؤى', 'settings'),
('settings.team_insights_display_limit.description', 'Maximum number of insights to display', 'الحد الأقصى لعدد الرؤى المعروضة', 'settings'),
('settings.team_max_concurrent_projects_per_member.label', 'Max Concurrent Projects per Member', 'الحد الأقصى للمشاريع المتزامنة لكل عضو', 'settings'),
('settings.team_max_concurrent_projects_per_member.description', 'Maximum projects a member can work on simultaneously', 'الحد الأقصى للمشاريع التي يمكن للعضو العمل عليها في نفس الوقت', 'settings'),

-- Performance rating settings
('settings.team_max_performance_rating.label', 'Maximum Performance Rating', 'الحد الأقصى لتقييم الأداء', 'settings'),
('settings.team_max_performance_rating.description', 'Highest possible performance rating', 'أعلى تقييم أداء ممكن', 'settings'),
('settings.team_min_performance_rating.label', 'Minimum Performance Rating', 'الحد الأدنى لتقييم الأداء', 'settings'),
('settings.team_min_performance_rating.description', 'Lowest possible performance rating', 'أقل تقييم أداء ممكن', 'settings'),
('settings.team_capacity_warning_threshold.label', 'Capacity Warning Threshold', 'عتبة تحذير السعة', 'settings'),
('settings.team_capacity_warning_threshold.description', 'Warn when team capacity exceeds this percentage', 'تحذير عندما تتجاوز سعة الفريق هذه النسبة المئوية', 'settings'),
('settings.team_default_performance_rating.label', 'Default Performance Rating', 'تقييم الأداء الافتراضي', 'settings'),
('settings.team_default_performance_rating.description', 'Default rating assigned to new team members', 'التقييم الافتراضي المخصص لأعضاء الفريق الجدد', 'settings'),

-- Team project and structure settings
('settings.team_max_concurrent_projects.label', 'Maximum Concurrent Projects', 'الحد الأقصى للمشاريع المتزامنة', 'settings'),
('settings.team_max_concurrent_projects.description', 'Maximum number of projects the team can handle', 'الحد الأقصى لعدد المشاريع التي يمكن للفريق التعامل معها', 'settings'),
('settings.team_max_expert_workload.label', 'Maximum Expert Workload', 'الحد الأقصى لعبء عمل الخبير', 'settings'),
('settings.team_max_expert_workload.description', 'Maximum workload for expert team members', 'الحد الأقصى لعبء العمل لأعضاء الفريق الخبراء', 'settings'),
('settings.team_performance_rating_max.label', 'Performance Rating Maximum', 'الحد الأقصى لتقييم الأداء', 'settings'),
('settings.team_performance_rating_max.description', 'Maximum value for performance ratings', 'القيمة القصوى لتقييمات الأداء', 'settings'),
('settings.team_performance_rating_min.label', 'Performance Rating Minimum', 'الحد الأدنى لتقييم الأداء', 'settings'),
('settings.team_performance_rating_min.description', 'Minimum value for performance ratings', 'القيمة الدنيا لتقييمات الأداء', 'settings'),

-- Team management options
('settings.team_auto_workload_balance.label', 'Auto Workload Balance', 'توازن عبء العمل التلقائي', 'settings'),
('settings.team_auto_workload_balance.description', 'Automatically balance workload among team members', 'توزيع عبء العمل تلقائياً بين أعضاء الفريق', 'settings'),
('settings.team_max_members.label', 'Maximum Team Members', 'الحد الأقصى لأعضاء الفريق', 'settings'),
('settings.team_max_members.description', 'Maximum number of members allowed in a team', 'الحد الأقصى لعدد الأعضاء المسموح بهم في الفريق', 'settings'),
('settings.team_require_lead.label', 'Require Team Lead', 'مطالبة بقائد الفريق', 'settings'),
('settings.team_require_lead.description', 'Require each team to have a designated lead', 'مطالبة كل فريق بوجود قائد معين', 'settings'),
('settings.team_roles.label', 'Team Roles', 'أدوار الفريق', 'settings'),
('settings.team_roles.description', 'Define available roles for team members', 'تحديد الأدوار المتاحة لأعضاء الفريق', 'settings'),
('settings.test_component_list.label', 'Test Component List', 'قائمة مكونات الاختبار', 'settings');