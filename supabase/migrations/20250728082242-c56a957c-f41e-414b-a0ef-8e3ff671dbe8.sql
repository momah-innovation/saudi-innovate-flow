-- Update system_settings descriptions to Arabic
UPDATE system_settings SET description = 'إرسال إشعارات بريد إلكتروني للأحداث المهمة' WHERE setting_key = 'notification_email_enabled';

UPDATE system_settings SET description = 'إشعار المديرين بطلبات الأدوار الجديدة' WHERE setting_key = 'notification_role_requests_enabled';

UPDATE system_settings SET description = 'إرسال تذكيرات قبل مواعيد التحديات النهائية' WHERE setting_key = 'notification_challenge_deadlines_enabled';

UPDATE system_settings SET description = 'الحد الأقصى الافتراضي للمشاريع المتزامنة لأعضاء الفريق الجدد' WHERE setting_key = 'team_max_concurrent_projects';

UPDATE system_settings SET description = 'تقييم الأداء الابتدائي لأعضاء الفريق الجدد' WHERE setting_key = 'team_default_performance_rating';

UPDATE system_settings SET description = 'عدد الصفوف لحقل منطقة النص الخاص بالسيرة الذاتية' WHERE setting_key = 'profile_bio_textarea_rows';

UPDATE system_settings SET description = 'المدة الافتراضية للتحديات الجديدة بالأيام' WHERE setting_key = 'challenge_default_duration_days';

UPDATE system_settings SET description = 'الحد الافتراضي لتقديم التحديات' WHERE setting_key = 'challenge_default_submission_limit';

UPDATE system_settings SET description = 'الموافقة التلقائية على الأفكار المقدمة' WHERE setting_key = 'challenge_auto_approve_ideas';

UPDATE system_settings SET description = 'الحد الأقصى للتحديات المتزامنة التي يمكن للخبير التعامل معها' WHERE setting_key = 'team_max_expert_workload';