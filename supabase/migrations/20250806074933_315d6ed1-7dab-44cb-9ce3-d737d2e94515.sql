-- Fix all issues: duplicates, missing i18n, inconsistent naming, and add proper localization

-- 1. Fix camelCase keys to snake_case in UI (still using camelCase in some settings components)
UPDATE system_settings SET setting_key = 'max_challenges_per_user' WHERE setting_key = 'maxChallengesPerUser';
UPDATE system_settings SET setting_key = 'items_per_page' WHERE setting_key = 'itemsPerPage';
UPDATE system_settings SET setting_key = 'require_approval_for_publish' WHERE setting_key = 'requireApprovalForPublish';
UPDATE system_settings SET setting_key = 'allow_anonymous_submissions' WHERE setting_key = 'allowAnonymousSubmissions';
UPDATE system_settings SET setting_key = 'enable_collaboration' WHERE setting_key = 'enableCollaboration';
UPDATE system_settings SET setting_key = 'max_file_upload_size' WHERE setting_key = 'maxFileUploadSize';
UPDATE system_settings SET setting_key = 'auto_archive_after_days' WHERE setting_key = 'autoArchiveAfterDays';
UPDATE system_settings SET setting_key = 'system_name' WHERE setting_key = 'systemName';
UPDATE system_settings SET setting_key = 'system_language' WHERE setting_key = 'systemLanguage';
UPDATE system_settings SET setting_key = 'system_description' WHERE setting_key = 'systemDescription';
UPDATE system_settings SET setting_key = 'maintenance_mode' WHERE setting_key = 'maintenanceMode';
UPDATE system_settings SET setting_key = 'allow_public_registration' WHERE setting_key = 'allowPublicRegistration';
UPDATE system_settings SET setting_key = 'session_timeout' WHERE setting_key = 'sessionTimeout';
UPDATE system_settings SET setting_key = 'max_login_attempts' WHERE setting_key = 'maxLoginAttempts';
UPDATE system_settings SET setting_key = 'password_expiry_days' WHERE setting_key = 'passwordExpiryDays';
UPDATE system_settings SET setting_key = 'account_lockout_duration' WHERE setting_key = 'accountLockoutDuration';
UPDATE system_settings SET setting_key = 'enable_data_encryption' WHERE setting_key = 'enableDataEncryption';
UPDATE system_settings SET setting_key = 'enable_access_logs' WHERE setting_key = 'enableAccessLogs';
UPDATE system_settings SET setting_key = 'enforce_webauthn' WHERE setting_key = 'enforceWebauthn';
UPDATE system_settings SET setting_key = 'enable_csrf_protection' WHERE setting_key = 'enableCsrfProtection';
UPDATE system_settings SET setting_key = 'password_policy' WHERE setting_key = 'passwordPolicy';
UPDATE system_settings SET setting_key = 'data_retention_policy' WHERE setting_key = 'dataRetentionPolicy';
UPDATE system_settings SET setting_key = 'access_control_policy' WHERE setting_key = 'accessControlPolicy';

-- 2. Convert hardcoded Arabic text to i18n keys and move text to separate i18n table
CREATE TABLE IF NOT EXISTS system_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  translation_key VARCHAR(255) NOT NULL,
  language_code VARCHAR(5) NOT NULL DEFAULT 'ar',
  translation_text TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(translation_key, language_code)
);

-- Enable RLS
ALTER TABLE system_translations ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Anyone can view translations" ON system_translations FOR SELECT USING (true);
CREATE POLICY "Admins can manage translations" ON system_translations FOR ALL USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)
);

-- 3. Replace Arabic hardcoded values with i18n keys
UPDATE system_settings SET setting_value = '"system.name"' WHERE setting_key = 'system_name';
UPDATE system_settings SET setting_value = '"system.description"' WHERE setting_key = 'system_description';
UPDATE system_settings SET setting_value = '"challenge.status.draft"' WHERE setting_key = 'challenge_default_status';
UPDATE system_settings SET setting_value = '"security.password_policy"' WHERE setting_key = 'password_policy';
UPDATE system_settings SET setting_value = '"security.data_retention_policy"' WHERE setting_key = 'data_retention_policy';
UPDATE system_settings SET setting_value = '"security.access_control_policy"' WHERE setting_key = 'access_control_policy';

-- 4. Insert translation data
INSERT INTO system_translations (translation_key, language_code, translation_text, category) VALUES
-- System translations
('system.name', 'ar', 'نظام إدارة الابتكار', 'system'),
('system.name', 'en', 'Innovation Management System', 'system'),
('system.description', 'ar', 'منصة شاملة لإدارة التحديات والأفكار الابتكارية', 'system'),
('system.description', 'en', 'Comprehensive platform for managing challenges and innovative ideas', 'system'),

-- Challenge translations
('challenge.status.draft', 'ar', 'مسودة', 'challenge'),
('challenge.status.draft', 'en', 'Draft', 'challenge'),

-- Security translations
('security.password_policy', 'ar', 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص', 'security'),
('security.password_policy', 'en', 'Password must contain at least 8 characters, uppercase letter, lowercase letter, number, and special character', 'security'),
('security.data_retention_policy', 'ar', 'يتم الاحتفاظ بالبيانات الشخصية لمدة 5 سنوات من آخر نشاط للمستخدم', 'security'),
('security.data_retention_policy', 'en', 'Personal data is retained for 5 years from the user\'s last activity', 'security'),
('security.access_control_policy', 'ar', 'الوصول للنظام محدود حسب الصلاحيات المعطاة لكل مستخدم', 'security'),
('security.access_control_policy', 'en', 'System access is limited according to permissions granted to each user', 'security'),

-- Settings labels
('settings.general.title', 'ar', 'الإعدادات العامة', 'settings'),
('settings.general.title', 'en', 'General Settings', 'settings'),
('settings.security.title', 'ar', 'إعدادات الأمان', 'settings'),
('settings.security.title', 'en', 'Security Settings', 'settings'),
('settings.ai.title', 'ar', 'إعدادات الذكاء الاصطناعي', 'settings'),
('settings.ai.title', 'en', 'AI Settings', 'settings');

-- Check for remaining duplicates
SELECT setting_key, COUNT(*) as count 
FROM system_settings 
GROUP BY setting_key 
HAVING COUNT(*) > 1;