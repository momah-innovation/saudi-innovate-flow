-- Add missing translation keys for stakeholder management, roles, and attendance
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- Role Management Settings
('settings.role_rejection_wait_days.label', 'Role Rejection Wait Days', 'أيام انتظار رفض الدور', 'settings'),
('settings.role_rejection_wait_days.description', 'Number of days to wait before allowing re-application after role rejection', 'عدد الأيام للانتظار قبل السماح بإعادة التقديم بعد رفض الدور', 'settings'),
('settings.role_priority_hierarchy.label', 'Role Priority Hierarchy', 'تسلسل أولوية الأدوار', 'settings'),
('settings.role_priority_hierarchy.description', 'Hierarchical structure defining role priorities and permissions', 'الهيكل الهرمي الذي يحدد أولويات الأدوار والصلاحيات', 'settings'),

-- Engagement and Influence Levels
('settings.engagement_level_options.label', 'Engagement Level Options', 'خيارات مستوى المشاركة', 'settings'),
('settings.engagement_level_options.description', 'Available options for measuring engagement levels', 'الخيارات المتاحة لقياس مستويات المشاركة', 'settings'),
('settings.influence_level_options.label', 'Influence Level Options', 'خيارات مستوى التأثير', 'settings'),
('settings.influence_level_options.description', 'Available options for measuring influence levels', 'الخيارات المتاحة لقياس مستويات التأثير', 'settings'),

-- Stakeholder Management
('settings.stakeholder_categories.label', 'Stakeholder Categories', 'فئات أصحاب المصلحة', 'settings'),
('settings.stakeholder_categories.description', 'Categories for organizing and classifying stakeholders', 'فئات لتنظيم وتصنيف أصحاب المصلحة', 'settings'),
('settings.stakeholder_role_options.label', 'Stakeholder Role Options', 'خيارات أدوار أصحاب المصلحة', 'settings'),
('settings.stakeholder_role_options.description', 'Available role options for stakeholder assignments', 'خيارات الأدوار المتاحة لتعيينات أصحاب المصلحة', 'settings'),
('settings.stakeholder_status_options.label', 'Stakeholder Status Options', 'خيارات حالة أصحاب المصلحة', 'settings'),
('settings.stakeholder_status_options.description', 'Available status options for stakeholder management', 'خيارات الحالة المتاحة لإدارة أصحاب المصلحة', 'settings'),
('settings.stakeholder_type_options.label', 'Stakeholder Type Options', 'خيارات نوع أصحاب المصلحة', 'settings'),
('settings.stakeholder_type_options.description', 'Available type classifications for stakeholders', 'تصنيفات الأنواع المتاحة لأصحاب المصلحة', 'settings'),

-- Stakeholder Configuration
('settings.stakeholder_auto_categorize.label', 'Auto-Categorize Stakeholders', 'تصنيف أصحاب المصلحة تلقائياً', 'settings'),
('settings.stakeholder_auto_categorize.description', 'Automatically categorize stakeholders based on predefined criteria', 'تصنيف أصحاب المصلحة تلقائياً بناءً على معايير محددة مسبقاً', 'settings'),
('settings.stakeholder_max_per_organization.label', 'Max Stakeholders per Organization', 'الحد الأقصى لأصحاب المصلحة لكل منظمة', 'settings'),
('settings.stakeholder_max_per_organization.description', 'Maximum number of stakeholders allowed per organization', 'العدد الأقصى لأصحاب المصلحة المسموح به لكل منظمة', 'settings'),
('settings.stakeholder_require_verification.label', 'Require Stakeholder Verification', 'تطلب التحقق من أصحاب المصلحة', 'settings'),
('settings.stakeholder_require_verification.description', 'Require verification process for new stakeholder registrations', 'تطلب عملية التحقق لتسجيلات أصحاب المصلحة الجدد', 'settings'),

-- Assignment and Attendance
('settings.assignment_types.label', 'Assignment Types', 'أنواع التعيينات', 'settings'),
('settings.assignment_types.description', 'Available types for task and role assignments', 'الأنواع المتاحة لتعيينات المهام والأدوار', 'settings'),
('settings.attendance_status_options.label', 'Attendance Status Options', 'خيارات حالة الحضور', 'settings'),
('settings.attendance_status_options.description', 'Available status options for attendance tracking', 'خيارات الحالة المتاحة لتتبع الحضور', 'settings');