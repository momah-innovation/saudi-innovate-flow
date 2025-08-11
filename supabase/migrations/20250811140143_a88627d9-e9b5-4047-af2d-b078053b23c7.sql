-- Add final missing system settings translation keys
INSERT INTO public.system_translations (translation_key, text_en, text_ar, category) VALUES
-- Notification settings
('settings.notification_toast_timeout_ms.label', 'Toast Timeout (ms)', 'مهلة التنبيه (مللي ثانية)', 'settings'),
('settings.notification_toast_timeout_ms.description', 'Duration in milliseconds before toast notifications disappear', 'مدة بقاء إشعارات التنبيه بالمللي ثانية قبل اختفائها', 'settings'),
('settings.notification_types.label', 'Notification Types', 'أنواع الإشعارات', 'settings'),
('settings.notification_types.description', 'Available notification types in the system', 'أنواع الإشعارات المتاحة في النظام', 'settings'),

-- Organization settings
('settings.org_auto_update_structure.label', 'Auto Update Organization Structure', 'تحديث هيكل المنظمة تلقائياً', 'settings'),
('settings.org_auto_update_structure.description', 'Automatically update organization structure when changes occur', 'تحديث هيكل المنظمة تلقائياً عند حدوث تغييرات', 'settings'),
('settings.org_max_hierarchy_levels.label', 'Maximum Hierarchy Levels', 'أقصى مستويات التسلسل الهرمي', 'settings'),
('settings.org_max_hierarchy_levels.description', 'Maximum number of hierarchy levels allowed in organization structure', 'الحد الأقصى لعدد مستويات التسلسل الهرمي المسموح في هيكل المنظمة', 'settings'),
('settings.org_max_sectors.label', 'Maximum Sectors', 'أقصى عدد قطاعات', 'settings'),
('settings.org_max_sectors.description', 'Maximum number of sectors allowed in the organization', 'الحد الأقصى لعدد القطاعات المسموح في المنظمة', 'settings'),

-- Partner settings
('settings.partner_status_options.label', 'Partner Status Options', 'خيارات حالة الشريك', 'settings'),
('settings.partner_status_options.description', 'Available status options for partners', 'خيارات الحالة المتاحة للشركاء', 'settings'),
('settings.partner_type_options.label', 'Partner Type Options', 'خيارات نوع الشريك', 'settings'),
('settings.partner_type_options.description', 'Available type options for partners', 'خيارات النوع المتاحة للشركاء', 'settings'),
('settings.partnership_type_options.label', 'Partnership Type Options', 'خيارات نوع الشراكة', 'settings'),
('settings.partnership_type_options.description', 'Available partnership type options', 'خيارات نوع الشراكة المتاحة', 'settings'),

-- Professional settings
('settings.professional_experience_levels.label', 'Professional Experience Levels', 'مستويات الخبرة المهنية', 'settings'),
('settings.professional_experience_levels.description', 'Available professional experience level options', 'خيارات مستويات الخبرة المهنية المتاحة', 'settings'),

-- Question settings
('settings.question_types.label', 'Question Types', 'أنواع الأسئلة', 'settings'),
('settings.question_types.description', 'Available question type options', 'خيارات أنواع الأسئلة المتاحة', 'settings'),

-- Role request settings
('settings.role_request_status_options.label', 'Role Request Status Options', 'خيارات حالة طلب الدور', 'settings'),
('settings.role_request_status_options.description', 'Available status options for role requests', 'خيارات الحالة المتاحة لطلبات الأدوار', 'settings'),
('settings.role_justification_max_preview_length.label', 'Role Justification Max Preview Length', 'الحد الأقصى لطول معاينة مبرر الدور', 'settings'),
('settings.role_justification_max_preview_length.description', 'Maximum number of characters shown in role justification preview', 'الحد الأقصى لعدد الحروف المعروضة في معاينة مبرر الدور', 'settings'),
('settings.role_max_requests_per_week.label', 'Max Role Requests Per Week', 'الحد الأقصى لطلبات الأدوار أسبوعياً', 'settings'),
('settings.role_max_requests_per_week.description', 'Maximum number of role requests allowed per user per week', 'الحد الأقصى لعدد طلبات الأدوار المسموح للمستخدم أسبوعياً', 'settings');