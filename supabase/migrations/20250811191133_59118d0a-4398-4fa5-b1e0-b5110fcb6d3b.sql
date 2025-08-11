-- Add missing translation keys from console logs
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- Admin and navigation keys
('admin.label', 'Admin', 'مدير النظام', 'navigation'),
('system_settings_page.description', 'Configure system-wide settings and preferences', 'تكوين إعدادات النظام والتفضيلات على نطاق النظام', 'admin'),
('settings_management.title', 'Settings Management', 'إدارة الإعدادات', 'admin'),
('settings_management.description', 'Manage all system settings from categories like general, security, AI features, and more.', 'إدارة جميع إعدادات النظام من فئات مثل العامة والأمان وميزات الذكاء الاصطناعي والمزيد.', 'admin'),
('nav.browse_challenges', 'Browse Challenges', 'استكشاف التحديات', 'navigation'),
('nav.browse_events', 'Browse Events', 'استكشاف الفعاليات', 'navigation'),

-- Settings category descriptions
('settings.category.Challenge Management.description', 'Settings related to challenge creation, submission, and evaluation processes', 'الإعدادات المتعلقة بإنشاء التحديات وعمليات التقديم والتقييم', 'settings_categories'),

-- Workflow and notification settings
('settings.idea_workflow_notifications_enabled.description', 'Enable automated notifications for idea workflow status changes', 'تمكين الإشعارات التلقائية لتغييرات حالة سير عمل الأفكار', 'settings'),
('settings.navigation_menu_visibility_roles.description', 'Define which user roles can see specific navigation menu items', 'تحديد أدوار المستخدمين التي يمكنها رؤية عناصر قائمة التنقل المحددة', 'settings'),
('settings.notification_challenge_deadlines_enabled.label', 'Challenge Deadline Notifications', 'إشعارات مواعيد التحديات النهائية', 'settings'),
('settings.notification_challenge_deadlines_enabled.description', 'Send notifications when challenge deadlines are approaching', 'إرسال إشعارات عند اقتراب المواعيد النهائية للتحديات', 'settings'),
('settings.notification_role_requests_enabled.description', 'Enable notifications for role assignment requests and approvals', 'تمكين الإشعارات لطلبات تعيين الأدوار والموافقات', 'settings'),

-- Partnership settings
('settings.enable_partnership_expiry_notifications.label', 'Partnership Expiry Notifications', 'إشعارات انتهاء الشراكة', 'settings'),
('settings.enable_partnership_expiry_notifications.description', 'Send notifications when partnerships are about to expire', 'إرسال إشعارات عند اقتراب انتهاء الشراكات', 'settings'),
('settings.enable_periodic_partner_evaluation.description', 'Enable periodic evaluation of partnership performance and effectiveness', 'تمكين التقييم الدوري لأداء وفعالية الشراكة', 'settings'),

-- Professional and role settings
('settings.professional_experience_levels.description', 'Define available professional experience levels for user profiles', 'تحديد مستويات الخبرة المهنية المتاحة لملفات تعريف المستخدمين', 'settings'),
('settings.role_justification_max_preview_length.label', 'Role Justification Preview Length', 'طول معاينة مبرر الدور', 'settings'),
('settings.role_justification_max_preview_length.description', 'Maximum character length for role justification preview text', 'الحد الأقصى لطول الأحرف لنص معاينة مبرر الدور', 'settings'),

-- Stakeholder settings
('settings.stakeholder_max_per_organization.description', 'Maximum number of stakeholders allowed per organization', 'الحد الأقصى لعدد أصحاب المصلحة المسموح بهم لكل منظمة', 'settings'),
('settings.stakeholder_require_verification.description', 'Require verification process for new stakeholder registrations', 'مطالبة بعملية التحقق لتسجيلات أصحاب المصلحة الجدد', 'settings'),

-- Campaign and status options
('settings.campaign_theme_options.label', 'Campaign Theme Options', 'خيارات موضوع الحملة', 'settings'),
('settings.campaign_theme_options.description', 'Available theme options for campaign customization', 'خيارات الموضوع المتاحة لتخصيص الحملة', 'settings'),
('settings.extended_status_options.label', 'Extended Status Options', 'خيارات الحالة الموسعة', 'settings'),
('settings.extended_status_options.description', 'Additional status options beyond the default set', 'خيارات حالة إضافية تتجاوز المجموعة الافتراضية', 'settings'),
('settings.frequency_options.label', 'Frequency Options', 'خيارات التكرار', 'settings'),
('settings.frequency_options.description', 'Available frequency settings for recurring tasks and notifications', 'إعدادات التكرار المتاحة للمهام والإشعارات المتكررة', 'settings'),

-- Migration and system tracking
('settings.hardcoded_arrays_migration_log.label', 'Hardcoded Arrays Migration Log', 'سجل ترحيل المصفوفات المُرمزة', 'settings'),
('settings.hardcoded_arrays_migration_log.description', 'Log of migration processes for converting hardcoded arrays to database settings', 'سجل عمليات الترحيل لتحويل المصفوفات المُرمزة إلى إعدادات قاعدة البيانات', 'settings'),
('settings.migration_progress_tracker.label', 'Migration Progress Tracker', 'متتبع تقدم الترحيل', 'settings'),
('settings.migration_progress_tracker.description', 'Track progress of data migration and system update processes', 'تتبع تقدم ترحيل البيانات وعمليات تحديث النظام', 'settings'),

-- Organization and relationship types
('settings.organization_types.label', 'Organization Types', 'أنواع المنظمات', 'settings'),
('settings.organization_types.description', 'Available organization types for registration and classification', 'أنواع المنظمات المتاحة للتسجيل والتصنيف', 'settings'),
('settings.participation_types.label', 'Participation Types', 'أنواع المشاركة', 'settings'),
('settings.participation_types.description', 'Different types of participation modes available in the system', 'أنواع مختلفة من أنماط المشاركة المتاحة في النظام', 'settings'),
('settings.registration_types.label', 'Registration Types', 'أنواع التسجيل', 'settings'),
('settings.registration_types.description', 'Available registration types for different user categories', 'أنواع التسجيل المتاحة لفئات المستخدمين المختلفة', 'settings'),
('settings.relationship_types.label', 'Relationship Types', 'أنواع العلاقات', 'settings'),
('settings.relationship_types.description', 'Define types of relationships between organizations and stakeholders', 'تحديد أنواع العلاقات بين المنظمات وأصحاب المصلحة', 'settings'),
('settings.sector_types.label', 'Sector Types', 'أنواع القطاعات', 'settings'),
('settings.sector_types.description', 'Available sector classifications for organizations and initiatives', 'تصنيفات القطاعات المتاحة للمنظمات والمبادرات', 'settings'),

-- System evaluation settings
('settings.system_idea_evaluation_scale_max.description', 'Maximum value for the idea evaluation rating scale', 'القيمة القصوى لمقياس تقييم الأفكار', 'settings')

ON CONFLICT (translation_key) DO UPDATE SET
text_en = EXCLUDED.text_en,
text_ar = EXCLUDED.text_ar,
category = EXCLUDED.category,
updated_at = now();