-- Add missing Partners settings translation keys
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- Partners Category
('settings.category.partners.description', 'Settings for managing and configuring partners', 'إعدادات إدارة وتكوين الشركاء', 'settings'),

-- Partners Settings
('settings.enable_partnership_expiry_notifications.label', 'Enable Partnership Expiry Notifications', 'تفعيل إشعارات انتهاء الشراكة', 'settings'),
('settings.enable_partnership_expiry_notifications.description', 'Send notifications when partnerships are about to expire', 'إرسال إشعارات عندما توشك الشراكات على الانتهاء', 'settings'),

('settings.enable_periodic_partner_evaluation.label', 'Enable Periodic Partner Evaluation', 'تفعيل التقييم الدوري للشركاء', 'settings'),
('settings.enable_periodic_partner_evaluation.description', 'Enable regular evaluation of partner performance', 'تفعيل التقييم المنتظم لأداء الشركاء', 'settings'),

('settings.max_partners_per_project.label', 'Maximum Partners per Project', 'الحد الأقصى للشركاء لكل مشروع', 'settings'),
('settings.max_partners_per_project.description', 'Maximum number of partners allowed per project', 'الحد الأقصى لعدد الشركاء المسموح به لكل مشروع', 'settings'),

('settings.min_partnership_value.label', 'Minimum Partnership Value', 'الحد الأدنى لقيمة الشراكة', 'settings'),
('settings.min_partnership_value.description', 'Minimum value required for partnerships', 'الحد الأدنى للقيمة المطلوبة للشراكات', 'settings'),

('settings.partner_auto_onboarding.label', 'Partner Auto Onboarding', 'الإدراج التلقائي للشركاء', 'settings'),
('settings.partner_auto_onboarding.description', 'Automatically onboard new partners after approval', 'إدراج الشركاء الجدد تلقائياً بعد الموافقة', 'settings'),

('settings.partner_max_per_project.label', 'Partner Maximum per Project', 'الحد الأقصى للشركاء لكل مشروع', 'settings'),
('settings.partner_max_per_project.description', 'Maximum number of partners allowed in a single project', 'الحد الأقصى لعدد الشركاء المسموح به في مشروع واحد', 'settings'),

('settings.partner_require_contract.label', 'Partner Require Contract', 'يتطلب الشريك عقد', 'settings'),
('settings.partner_require_contract.description', 'Require formal contracts for all partnerships', 'تتطلب عقود رسمية لجميع الشراكات', 'settings'),

('settings.partner_types.label', 'Partner Types', 'أنواع الشركاء', 'settings'),
('settings.partner_types.description', 'Available types of partners in the system', 'أنواع الشركاء المتاحة في النظام', 'settings'),

('settings.partnership_default_duration.label', 'Partnership Default Duration', 'المدة الافتراضية للشراكة', 'settings'),
('settings.partnership_default_duration.description', 'Default duration for partnerships in months', 'المدة الافتراضية للشراكات بالشهور', 'settings'),

('settings.partnership_renewal_period.label', 'Partnership Renewal Period', 'فترة تجديد الشراكة', 'settings'),
('settings.partnership_renewal_period.description', 'Days before expiry to start renewal process', 'الأيام قبل الانتهاء لبدء عملية التجديد', 'settings'),

('settings.require_partnership_approval.label', 'Require Partnership Approval', 'تتطلب موافقة الشراكة', 'settings'),
('settings.require_partnership_approval.description', 'Require approval before partnerships become active', 'تتطلب موافقة قبل أن تصبح الشراكات نشطة', 'settings')

ON CONFLICT (translation_key) 
DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();