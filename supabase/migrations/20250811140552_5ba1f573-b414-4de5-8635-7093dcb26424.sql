-- Add final stakeholder and role management translation keys
INSERT INTO public.system_translations (translation_key, text_en, text_ar, category) VALUES
-- Role management settings
('settings.role_rejection_wait_days.label', 'Role Rejection Wait Days', 'أيام انتظار رفض الدور', 'settings'),
('settings.role_rejection_wait_days.description', 'Number of days to wait before allowing resubmission after role rejection', 'عدد الأيام للانتظار قبل السماح بإعادة التقديم بعد رفض الدور', 'settings'),
('settings.role_priority_hierarchy.label', 'Role Priority Hierarchy', 'التسلسل الهرمي لأولوية الأدوار', 'settings'),
('settings.role_priority_hierarchy.description', 'Hierarchy system for role prioritization and assignment', 'نظام التسلسل الهرمي لأولوية الأدوار والتعيين', 'settings'),

-- Engagement and influence levels
('settings.engagement_level_options.label', 'Engagement Level Options', 'خيارات مستوى المشاركة', 'settings'),
('settings.engagement_level_options.description', 'Available engagement level options for stakeholders', 'خيارات مستوى المشاركة المتاحة لأصحاب المصلحة', 'settings'),
('settings.influence_level_options.label', 'Influence Level Options', 'خيارات مستوى التأثير', 'settings'),
('settings.influence_level_options.description', 'Available influence level options for stakeholders', 'خيارات مستوى التأثير المتاحة لأصحاب المصلحة', 'settings'),

-- Stakeholder management
('settings.stakeholder_categories.label', 'Stakeholder Categories', 'فئات أصحاب المصلحة', 'settings'),
('settings.stakeholder_categories.description', 'Available categories for stakeholder classification', 'الفئات المتاحة لتصنيف أصحاب المصلحة', 'settings'),
('settings.stakeholder_role_options.label', 'Stakeholder Role Options', 'خيارات دور أصحاب المصلحة', 'settings'),
('settings.stakeholder_role_options.description', 'Available role options for stakeholders', 'خيارات الأدوار المتاحة لأصحاب المصلحة', 'settings'),
('settings.stakeholder_status_options.label', 'Stakeholder Status Options', 'خيارات حالة أصحاب المصلحة', 'settings'),
('settings.stakeholder_status_options.description', 'Available status options for stakeholders', 'خيارات الحالة المتاحة لأصحاب المصلحة', 'settings'),
('settings.stakeholder_type_options.label', 'Stakeholder Type Options', 'خيارات نوع أصحاب المصلحة', 'settings'),
('settings.stakeholder_type_options.description', 'Available type options for stakeholders', 'خيارات النوع المتاحة لأصحاب المصلحة', 'settings'),

-- Stakeholder management features
('settings.stakeholder_auto_categorize.label', 'Auto Categorize Stakeholders', 'تصنيف أصحاب المصلحة تلقائياً', 'settings'),
('settings.stakeholder_auto_categorize.description', 'Automatically categorize stakeholders based on predefined criteria', 'تصنيف أصحاب المصلحة تلقائياً بناءً على معايير محددة مسبقاً', 'settings'),
('settings.stakeholder_max_per_organization.label', 'Max Stakeholders Per Organization', 'الحد الأقصى لأصحاب المصلحة لكل منظمة', 'settings'),
('settings.stakeholder_max_per_organization.description', 'Maximum number of stakeholders allowed per organization', 'الحد الأقصى لعدد أصحاب المصلحة المسموح لكل منظمة', 'settings'),
('settings.stakeholder_require_verification.label', 'Require Stakeholder Verification', 'تتطلب التحقق من أصحاب المصلحة', 'settings'),
('settings.stakeholder_require_verification.description', 'Require verification process for new stakeholders', 'تتطلب عملية التحقق لأصحاب المصلحة الجدد', 'settings'),

-- Assignment and attendance
('settings.assignment_types.label', 'Assignment Types', 'أنواع التكليفات', 'settings'),
('settings.assignment_types.description', 'Available types for task and role assignments', 'الأنواع المتاحة لتكليفات المهام والأدوار', 'settings'),
('settings.attendance_status_options.label', 'Attendance Status Options', 'خيارات حالة الحضور', 'settings'),
('settings.attendance_status_options.description', 'Available status options for event attendance', 'خيارات الحالة المتاحة لحضور الفعاليات', 'settings');