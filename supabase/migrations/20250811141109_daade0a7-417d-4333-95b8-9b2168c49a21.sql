-- Add remaining missing translation keys that are showing in console
INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.role_rejection_wait_days.label', 'Role Rejection Wait Days', 'أيام انتظار رفض الدور', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.role_rejection_wait_days.label');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.role_rejection_wait_days.description', 'Number of days to wait before allowing re-application after role rejection', 'عدد الأيام للانتظار قبل السماح بإعادة التقديم بعد رفض الدور', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.role_rejection_wait_days.description');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.role_priority_hierarchy.label', 'Role Priority Hierarchy', 'تسلسل أولوية الأدوار', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.role_priority_hierarchy.label');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.role_priority_hierarchy.description', 'Hierarchical structure defining role priorities and permissions', 'الهيكل الهرمي الذي يحدد أولويات الأدوار والصلاحيات', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.role_priority_hierarchy.description');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.engagement_level_options.label', 'Engagement Level Options', 'خيارات مستوى المشاركة', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.engagement_level_options.label');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.engagement_level_options.description', 'Available options for measuring engagement levels', 'الخيارات المتاحة لقياس مستويات المشاركة', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.engagement_level_options.description');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.influence_level_options.label', 'Influence Level Options', 'خيارات مستوى التأثير', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.influence_level_options.label');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.influence_level_options.description', 'Available options for measuring influence levels', 'الخيارات المتاحة لقياس مستويات التأثير', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.influence_level_options.description');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.stakeholder_categories.label', 'Stakeholder Categories', 'فئات أصحاب المصلحة', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.stakeholder_categories.label');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.stakeholder_categories.description', 'Categories for organizing and classifying stakeholders', 'فئات لتنظيم وتصنيف أصحاب المصلحة', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.stakeholder_categories.description');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.stakeholder_role_options.label', 'Stakeholder Role Options', 'خيارات أدوار أصحاب المصلحة', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.stakeholder_role_options.label');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.stakeholder_role_options.description', 'Available role options for stakeholder assignments', 'خيارات الأدوار المتاحة لتعيينات أصحاب المصلحة', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.stakeholder_role_options.description');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.stakeholder_status_options.label', 'Stakeholder Status Options', 'خيارات حالة أصحاب المصلحة', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.stakeholder_status_options.label');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.stakeholder_status_options.description', 'Available status options for stakeholder management', 'خيارات الحالة المتاحة لإدارة أصحاب المصلحة', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.stakeholder_status_options.description');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.stakeholder_type_options.label', 'Stakeholder Type Options', 'خيارات نوع أصحاب المصلحة', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.stakeholder_type_options.label');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.stakeholder_type_options.description', 'Available type classifications for stakeholders', 'تصنيفات الأنواع المتاحة لأصحاب المصلحة', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.stakeholder_type_options.description');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.stakeholder_auto_categorize.label', 'Auto-Categorize Stakeholders', 'تصنيف أصحاب المصلحة تلقائياً', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.stakeholder_auto_categorize.label');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.stakeholder_auto_categorize.description', 'Automatically categorize stakeholders based on predefined criteria', 'تصنيف أصحاب المصلحة تلقائياً بناءً على معايير محددة مسبقاً', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.stakeholder_auto_categorize.description');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.stakeholder_max_per_organization.label', 'Max Stakeholders per Organization', 'الحد الأقصى لأصحاب المصلحة لكل منظمة', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.stakeholder_max_per_organization.label');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.stakeholder_max_per_organization.description', 'Maximum number of stakeholders allowed per organization', 'العدد الأقصى لأصحاب المصلحة المسموح به لكل منظمة', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.stakeholder_max_per_organization.description');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.stakeholder_require_verification.label', 'Require Stakeholder Verification', 'تطلب التحقق من أصحاب المصلحة', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.stakeholder_require_verification.label');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.stakeholder_require_verification.description', 'Require verification process for new stakeholder registrations', 'تطلب عملية التحقق لتسجيلات أصحاب المصلحة الجدد', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.stakeholder_require_verification.description');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.assignment_types.label', 'Assignment Types', 'أنواع التعيينات', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.assignment_types.label');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.assignment_types.description', 'Available types for task and role assignments', 'الأنواع المتاحة لتعيينات المهام والأدوار', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.assignment_types.description');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.attendance_status_options.label', 'Attendance Status Options', 'خيارات حالة الحضور', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.attendance_status_options.label');

INSERT INTO system_translations (translation_key, text_en, text_ar, category) 
SELECT 'settings.attendance_status_options.description', 'Available status options for attendance tracking', 'خيارات الحالة المتاحة لتتبع الحضور', 'settings'
WHERE NOT EXISTS (SELECT 1 FROM system_translations WHERE translation_key = 'settings.attendance_status_options.description');