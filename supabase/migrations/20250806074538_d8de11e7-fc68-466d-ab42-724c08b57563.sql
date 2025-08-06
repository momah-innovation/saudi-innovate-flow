-- Add missing settings that are referenced in UI components but not in database

-- General Settings
INSERT INTO system_settings (setting_key, setting_value, setting_category, description) VALUES
('systemName', '"نظام إدارة الابتكار"', 'general', 'System name displayed across the platform'),
('systemLanguage', '"ar"', 'general', 'Default system language'),
('systemDescription', '"منصة شاملة لإدارة التحديات والأفكار الابتكارية"', 'general', 'System description'),
('maintenanceMode', 'false', 'general', 'Enable maintenance mode to prevent normal user access'),
('allowPublicRegistration', 'true', 'general', 'Allow new users to register without invitation'),
('maxFileUploadSize', '10', 'general', 'Maximum file upload size in MB'),
('autoArchiveAfterDays', '365', 'general', 'Auto-archive content after specified days');

-- Security Settings  
INSERT INTO system_settings (setting_key, setting_value, setting_category, description) VALUES
('sessionTimeout', '60', 'security', 'Session timeout in minutes'),
('maxLoginAttempts', '5', 'security', 'Maximum login attempts before lockout'),
('passwordExpiryDays', '90', 'security', 'Password expiry in days'),
('accountLockoutDuration', '30', 'security', 'Account lockout duration in minutes'),
('enableDataEncryption', 'true', 'security', 'Enable data encryption for sensitive data'),
('enableAccessLogs', 'true', 'security', 'Log all system access attempts'),
('enforceWebauthn', 'false', 'security', 'Enforce two-factor authentication for all users'),
('enableCsrfProtection', 'true', 'security', 'Enable CSRF protection'),
('passwordPolicy', '"كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص"', 'security', 'Password policy description'),
('dataRetentionPolicy', '"يتم الاحتفاظ بالبيانات الشخصية لمدة 5 سنوات من آخر نشاط للمستخدم"', 'security', 'Data retention policy description'),
('accessControlPolicy', '"الوصول للنظام محدود حسب الصلاحيات المعطاة لكل مستخدم"', 'security', 'Access control policy description'),
('security_roles', '["admin", "security_officer", "auditor", "compliance_manager"]', 'security', 'Available security roles');

-- Check for any remaining duplicates
SELECT setting_key, COUNT(*) as count 
FROM system_settings 
GROUP BY setting_key 
HAVING COUNT(*) > 1;