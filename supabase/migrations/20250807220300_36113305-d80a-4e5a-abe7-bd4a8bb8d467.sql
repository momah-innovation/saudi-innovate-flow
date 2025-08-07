-- Add specific settings labels and descriptions
INSERT INTO public.system_translations (translation_key, text_en, text_ar, category) VALUES

-- Visibility and Access Control
('settings.visibility_levels.label', 'Visibility Levels', 'مستويات الرؤية', 'settings'),
('settings.visibility_levels.description', 'Configure content visibility levels', 'تكوين مستويات رؤية المحتوى', 'settings'),
('settings.access_control_levels.label', 'Access Control Levels', 'مستويات التحكم في الوصول', 'settings'),
('settings.access_control_levels.description', 'Define access control levels', 'تحديد مستويات التحكم في الوصول', 'settings'),
('settings.access_control_resource_types.label', 'Resource Types', 'أنواع الموارد', 'settings'),
('settings.access_control_resource_types.description', 'Types of resources for access control', 'أنواع الموارد للتحكم في الوصول', 'settings'),
('settings.access_levels.label', 'Access Levels', 'مستويات الوصول', 'settings'),
('settings.access_levels.description', 'System access levels', 'مستويات وصول النظام', 'settings'),
('settings.resource_types.label', 'Resource Types', 'أنواع الموارد', 'settings'),
('settings.resource_types.description', 'Available resource types', 'أنواع الموارد المتاحة', 'settings'),

-- API Settings
('settings.api_rate_limit_per_hour.label', 'API Rate Limit per Hour', 'حد API في الساعة', 'settings'),
('settings.api_rate_limit_per_hour.description', 'Maximum API requests per hour', 'الحد الأقصى لطلبات API في الساعة', 'settings'),

-- Specializations
('settings.specializations.label', 'Specializations', 'التخصصات', 'settings'),
('settings.specializations.description', 'Available specialization areas', 'مجالات التخصص المتاحة', 'settings'),

-- Assignment Settings
('settings.assignment_status_options.label', 'Assignment Status Options', 'خيارات حالة المهام', 'settings'),
('settings.assignment_status_options.description', 'Available assignment status values', 'قيم حالة المهام المتاحة', 'settings'),

-- Role Priority
('settings.role_priority_order.label', 'Role Priority Order', 'ترتيب أولوية الأدوار', 'settings'),
('settings.role_priority_order.description', 'Priority order for user roles', 'ترتيب الأولوية لأدوار المستخدمين', 'settings'),

-- Authentication
('settings.auth_password_min_length.label', 'Minimum Password Length', 'الحد الأدنى لطول كلمة المرور', 'settings'),
('settings.auth_password_min_length.description', 'Minimum required password length', 'الحد الأدنى المطلوب لطول كلمة المرور', 'settings'),

-- Challenge Settings
('settings.challenge_priority_levels.label', 'Challenge Priority Levels', 'مستويات أولوية التحدي', 'settings'),
('settings.challenge_priority_levels.description', 'Priority levels for challenges', 'مستويات الأولوية للتحديات', 'settings'),
('settings.challenge_sensitivity_levels.label', 'Challenge Sensitivity Levels', 'مستويات حساسية التحدي', 'settings'),
('settings.challenge_sensitivity_levels.description', 'Sensitivity levels for challenges', 'مستويات الحساسية للتحديات', 'settings'),
('settings.challenge_status_options.label', 'Challenge Status Options', 'خيارات حالة التحدي', 'settings'),
('settings.challenge_status_options.description', 'Available challenge status values', 'قيم حالة التحدي المتاحة', 'settings'),
('settings.challenge_details_description_rows.label', 'Description Textarea Rows', 'صفوف منطقة النص للوصف', 'settings'),
('settings.challenge_details_description_rows.description', 'Number of rows for description textarea', 'عدد الصفوف لمنطقة نص الوصف', 'settings'),
('settings.challenge_details_vision_rows.label', 'Vision Textarea Rows', 'صفوف منطقة النص للرؤية', 'settings'),
('settings.challenge_details_vision_rows.description', 'Number of rows for vision textarea', 'عدد الصفوف لمنطقة نص الرؤية', 'settings'),
('settings.focus_question_textarea_rows.label', 'Focus Question Textarea Rows', 'صفوف منطقة نص سؤال التركيز', 'settings'),
('settings.focus_question_textarea_rows.description', 'Number of rows for focus question textarea', 'عدد الصفوف لمنطقة نص سؤال التركيز', 'settings'),
('settings.challenge_default_duration_days.label', 'Default Challenge Duration (Days)', 'مدة التحدي الافتراضية (أيام)', 'settings'),
('settings.challenge_default_duration_days.description', 'Default duration for challenges in days', 'المدة الافتراضية للتحديات بالأيام', 'settings'),
('settings.challenge_default_submission_limit.label', 'Default Submission Limit', 'حد الإرسال الافتراضي', 'settings'),
('settings.challenge_default_submission_limit.description', 'Default limit for challenge submissions', 'الحد الافتراضي لإرسالات التحدي', 'settings'),
('settings.challenge_digital_maturity_score_max.label', 'Digital Maturity Score Maximum', 'الحد الأقصى لنقاط النضج الرقمي', 'settings'),
('settings.challenge_digital_maturity_score_max.description', 'Maximum digital maturity score', 'الحد الأقصى لنقاط النضج الرقمي', 'settings'),
('settings.challenge_digital_maturity_score_min.label', 'Digital Maturity Score Minimum', 'الحد الأدنى لنقاط النضج الرقمي', 'settings'),
('settings.challenge_digital_maturity_score_min.description', 'Minimum digital maturity score', 'الحد الأدنى لنقاط النضج الرقمي', 'settings'),
('settings.challenge_max_budget.label', 'Maximum Challenge Budget', 'الحد الأقصى لميزانية التحدي', 'settings'),
('settings.challenge_max_budget.description', 'Maximum budget allowed for challenges', 'الحد الأقصى للميزانية المسموحة للتحديات', 'settings'),
('settings.challenge_max_submissions_per_challenge.label', 'Max Submissions per Challenge', 'الحد الأقصى للإرسالات لكل تحدي', 'settings'),
('settings.challenge_max_submissions_per_challenge.description', 'Maximum submissions allowed per challenge', 'الحد الأقصى للإرسالات المسموحة لكل تحدي', 'settings'),
('settings.challenge_form_types.label', 'Challenge Form Types', 'أنواع نماذج التحدي', 'settings'),
('settings.challenge_form_types.description', 'Available challenge form types', 'أنواع نماذج التحدي المتاحة', 'settings'),
('settings.enhanced_priority_levels.label', 'Enhanced Priority Levels', 'مستويات الأولوية المحسنة', 'settings'),
('settings.enhanced_priority_levels.description', 'Enhanced priority level options', 'خيارات مستويات الأولوية المحسنة', 'settings'),
('settings.enhanced_sensitivity_levels.label', 'Enhanced Sensitivity Levels', 'مستويات الحساسية المحسنة', 'settings'),
('settings.enhanced_sensitivity_levels.description', 'Enhanced sensitivity level options', 'خيارات مستويات الحساسية المحسنة', 'settings'),
('settings.enhanced_status_options.label', 'Enhanced Status Options', 'خيارات الحالة المحسنة', 'settings'),
('settings.enhanced_status_options.description', 'Enhanced status option values', 'قيم خيارات الحالة المحسنة', 'settings'),

-- Data Export
('settings.data_export_formats.label', 'Data Export Formats', 'تنسيقات تصدير البيانات', 'settings'),
('settings.data_export_formats.description', 'Available data export formats', 'تنسيقات تصدير البيانات المتاحة', 'settings'),

-- Evaluation Settings
('settings.evaluation_criteria.label', 'Evaluation Criteria', 'معايير التقييم', 'settings'),
('settings.evaluation_criteria.description', 'Criteria used for evaluations', 'المعايير المستخدمة للتقييمات', 'settings'),
('settings.evaluation_require_comments.label', 'Require Evaluation Comments', 'تتطلب تعليقات التقييم', 'settings'),
('settings.evaluation_require_comments.description', 'Require comments for evaluations', 'تتطلب تعليقات للتقييمات', 'settings'),
('settings.evaluation_required_fields.label', 'Required Evaluation Fields', 'حقول التقييم المطلوبة', 'settings'),
('settings.evaluation_required_fields.description', 'Number of required evaluation fields', 'عدد حقول التقييم المطلوبة', 'settings'),
('settings.evaluation_scale.label', 'Evaluation Scale', 'مقياس التقييم', 'settings'),
('settings.evaluation_scale.description', 'Scale used for evaluations', 'المقياس المستخدم للتقييمات', 'settings'),

-- Event Settings
('settings.recurrence_pattern_options.label', 'Recurrence Pattern Options', 'خيارات نمط التكرار', 'settings'),
('settings.recurrence_pattern_options.description', 'Available recurrence patterns for events', 'أنماط التكرار المتاحة للفعاليات', 'settings'),
('settings.event_capacity_options.label', 'Event Capacity Options', 'خيارات سعة الفعالية', 'settings'),
('settings.event_capacity_options.description', 'Available event capacity ranges', 'نطاقات سعة الفعالية المتاحة', 'settings'),
('settings.event_capacity_range_values.label', 'Event Capacity Range Values', 'قيم نطاق سعة الفعالية', 'settings'),
('settings.event_capacity_range_values.description', 'Specific capacity range values', 'قيم نطاق السعة المحددة', 'settings'),
('settings.event_dialog_tabs.label', 'Event Dialog Tabs', 'تبويبات حوار الفعالية', 'settings'),
('settings.event_dialog_tabs.description', 'Available tabs in event dialog', 'التبويبات المتاحة في حوار الفعالية', 'settings'),
('settings.event_dialog_visible_tabs.label', 'Event Dialog Visible Tabs', 'تبويبات حوار الفعالية المرئية', 'settings'),
('settings.event_dialog_visible_tabs.description', 'Visible tabs in event dialog', 'التبويبات المرئية في حوار الفعالية', 'settings'),
('settings.event_format_options.label', 'Event Format Options', 'خيارات تنسيق الفعالية', 'settings'),
('settings.event_format_options.description', 'Available event format options', 'خيارات تنسيق الفعالية المتاحة', 'settings'),
('settings.event_price_range_values.label', 'Event Price Range Values', 'قيم نطاق سعر الفعالية', 'settings'),
('settings.event_price_range_values.description', 'Specific price range values for events', 'قيم نطاق السعر المحددة للفعاليات', 'settings'),
('settings.event_price_ranges.label', 'Event Price Ranges', 'نطاقات سعر الفعالية', 'settings'),
('settings.event_price_ranges.description', 'Available price ranges for events', 'نطاقات الأسعار المتاحة للفعاليات', 'settings'),
('settings.event_visible_tabs.label', 'Event Visible Tabs', 'تبويبات الفعالية المرئية', 'settings'),
('settings.event_visible_tabs.description', 'Visible tabs for event interface', 'التبويبات المرئية لواجهة الفعالية', 'settings'),
('settings.supported_capacity_ranges.label', 'Supported Capacity Ranges', 'نطاقات السعة المدعومة', 'settings'),
('settings.supported_capacity_ranges.description', 'Supported capacity ranges for events', 'نطاقات السعة المدعومة للفعاليات', 'settings'),
('settings.supported_price_ranges.label', 'Supported Price Ranges', 'نطاقات الأسعار المدعومة', 'settings'),
('settings.supported_price_ranges.description', 'Supported price ranges for events', 'نطاقات الأسعار المدعومة للفعاليات', 'settings')

ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category;