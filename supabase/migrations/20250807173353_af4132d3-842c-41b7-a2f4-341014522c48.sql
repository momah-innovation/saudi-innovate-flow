-- Add missing Campaigns settings translation keys
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- Campaigns Category
('settings.category.campaigns.description', 'Settings for managing and configuring campaigns', 'إعدادات إدارة وتكوين الحملات', 'settings'),

-- Campaign Settings
('settings.allow_open_campaign_registration.label', 'Allow Open Campaign Registration', 'السماح بالتسجيل المفتوح للحملات', 'settings'),
('settings.allow_open_campaign_registration.description', 'Allow users to register for campaigns without approval', 'السماح للمستخدمين بالتسجيل في الحملات بدون موافقة', 'settings'),

('settings.campaign_budget_limit.label', 'Campaign Budget Limit', 'حد ميزانية الحملة', 'settings'),
('settings.campaign_budget_limit.description', 'Maximum budget allowed for a single campaign', 'الحد الأقصى للميزانية المسموحة لحملة واحدة', 'settings'),

('settings.campaign_default_duration.label', 'Campaign Default Duration', 'المدة الافتراضية للحملة', 'settings'),
('settings.campaign_default_duration.description', 'Default duration for campaigns in days', 'المدة الافتراضية للحملات بالأيام', 'settings'),

('settings.campaign_max_budget.label', 'Campaign Maximum Budget', 'الحد الأقصى لميزانية الحملة', 'settings'),
('settings.campaign_max_budget.description', 'Maximum budget that can be allocated to a campaign', 'الحد الأقصى للميزانية التي يمكن تخصيصها للحملة', 'settings'),

('settings.campaign_max_duration.label', 'Campaign Maximum Duration', 'الحد الأقصى لمدة الحملة', 'settings'),
('settings.campaign_max_duration.description', 'Maximum duration allowed for campaigns in days', 'الحد الأقصى للمدة المسموحة للحملات بالأيام', 'settings'),

('settings.campaign_min_duration.label', 'Campaign Minimum Duration', 'الحد الأدنى لمدة الحملة', 'settings'),
('settings.campaign_min_duration.description', 'Minimum duration required for campaigns in days', 'الحد الأدنى للمدة المطلوبة للحملات بالأيام', 'settings'),

('settings.campaign_require_approval.label', 'Campaign Require Approval', 'تتطلب الحملة موافقة', 'settings'),
('settings.campaign_require_approval.description', 'Require approval before campaigns can be published', 'تتطلب موافقة قبل أن يتم نشر الحملات', 'settings'),

('settings.campaign_status_options.label', 'Campaign Status Options', 'خيارات حالة الحملات', 'settings'),
('settings.campaign_status_options.description', 'Available status options for campaigns', 'خيارات الحالة المتاحة للحملات', 'settings'),

('settings.campaign_types.label', 'Campaign Types', 'أنواع الحملات', 'settings'),
('settings.campaign_types.description', 'Available types of campaigns in the system', 'أنواع الحملات المتاحة في النظام', 'settings'),

('settings.enable_automatic_notifications.label', 'Enable Automatic Notifications', 'تفعيل الإشعارات التلقائية', 'settings'),
('settings.enable_automatic_notifications.description', 'Automatically send notifications for campaign events', 'إرسال الإشعارات تلقائياً لأحداث الحملات', 'settings'),

('settings.enable_campaign_analytics.label', 'Enable Campaign Analytics', 'تفعيل تحليلات الحملات', 'settings'),
('settings.enable_campaign_analytics.description', 'Enable tracking and analytics for campaigns', 'تفعيل تتبع وتحليلات الحملات', 'settings'),

('settings.max_participants_per_campaign.label', 'Maximum Participants per Campaign', 'الحد الأقصى للمشاركين لكل حملة', 'settings'),
('settings.max_participants_per_campaign.description', 'Maximum number of participants allowed per campaign', 'الحد الأقصى لعدد المشاركين المسموح به لكل حملة', 'settings'),

('settings.registration_deadline_buffer.label', 'Registration Deadline Buffer', 'فترة إنتهاء التسجيل', 'settings'),
('settings.registration_deadline_buffer.description', 'Days before campaign start when registration closes', 'الأيام قبل بداية الحملة عندما يُغلق التسجيل', 'settings'),

('settings.require_campaign_review.label', 'Require Campaign Review', 'تتطلب مراجعة الحملة', 'settings'),
('settings.require_campaign_review.description', 'Require campaigns to be reviewed before approval', 'تتطلب مراجعة الحملات قبل الموافقة عليها', 'settings')

ON CONFLICT (translation_key) 
DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();