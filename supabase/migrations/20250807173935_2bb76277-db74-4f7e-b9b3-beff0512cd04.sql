-- Add missing Security settings translation keys
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- Security Category
('settings.category.security.description', 'Security settings and configurations', 'إعدادات وتكوينات الأمان', 'settings'),

-- Security Settings
('settings.access_control_policy.label', 'Access Control Policy', 'سياسة التحكم في الوصول', 'settings'),
('settings.access_control_policy.description', 'Access control policy configuration', 'تكوين سياسة التحكم في الوصول', 'settings'),

('settings.account_lockout_duration.label', 'Account Lockout Duration', 'مدة قفل الحساب', 'settings'),
('settings.account_lockout_duration.description', 'Duration to lock accounts after failed attempts (in minutes)', 'مدة قفل الحسابات بعد المحاولات الفاشلة (بالدقائق)', 'settings'),

('settings.data_retention_policy.label', 'Data Retention Policy', 'سياسة الاحتفاظ بالبيانات', 'settings'),
('settings.data_retention_policy.description', 'Data retention policy configuration', 'تكوين سياسة الاحتفاظ بالبيانات', 'settings'),

('settings.enable_access_logs.label', 'Enable Access Logs', 'تفعيل سجلات الوصول', 'settings'),
('settings.enable_access_logs.description', 'Enable logging of user access activities', 'تفعيل تسجيل أنشطة وصول المستخدمين', 'settings'),

('settings.enable_csrf_protection.label', 'Enable CSRF Protection', 'تفعيل حماية CSRF', 'settings'),
('settings.enable_csrf_protection.description', 'Enable Cross-Site Request Forgery protection', 'تفعيل الحماية من هجمات تزوير الطلبات عبر المواقع', 'settings'),

('settings.enable_data_encryption.label', 'Enable Data Encryption', 'تفعيل تشفير البيانات', 'settings'),
('settings.enable_data_encryption.description', 'Enable encryption for sensitive data', 'تفعيل التشفير للبيانات الحساسة', 'settings'),

('settings.enforce_webauthn.label', 'Enforce WebAuthn', 'إنفاذ WebAuthn', 'settings'),
('settings.enforce_webauthn.description', 'Enforce WebAuthn authentication for enhanced security', 'إنفاذ مصادقة WebAuthn لتعزيز الأمان', 'settings'),

('settings.max_login_attempts.label', 'Maximum Login Attempts', 'الحد الأقصى لمحاولات تسجيل الدخول', 'settings'),
('settings.max_login_attempts.description', 'Maximum number of failed login attempts before lockout', 'الحد الأقصى لعدد محاولات تسجيل الدخول الفاشلة قبل القفل', 'settings'),

('settings.password_expiry_days.label', 'Password Expiry Days', 'أيام انتهاء كلمة المرور', 'settings'),
('settings.password_expiry_days.description', 'Number of days before passwords expire', 'عدد الأيام قبل انتهاء صلاحية كلمات المرور', 'settings'),

('settings.password_min_length.label', 'Password Minimum Length', 'الحد الأدنى لطول كلمة المرور', 'settings'),
('settings.password_min_length.description', 'Minimum required length for passwords', 'الحد الأدنى المطلوب لطول كلمات المرور', 'settings'),

('settings.password_policy.label', 'Password Policy', 'سياسة كلمة المرور', 'settings'),
('settings.password_policy.description', 'Password policy configuration', 'تكوين سياسة كلمة المرور', 'settings'),

('settings.security_roles.label', 'Security Roles', 'الأدوار الأمنية', 'settings'),
('settings.security_roles.description', 'Available security roles in the system', 'الأدوار الأمنية المتاحة في النظام', 'settings'),

('settings.security_session_timeout.label', 'Security Session Timeout', 'انتهاء الجلسة الأمنية', 'settings'),
('settings.security_session_timeout.description', 'Security session timeout duration in minutes', 'مدة انتهاء الجلسة الأمنية بالدقائق', 'settings'),

('settings.session_timeout.label', 'Session Timeout', 'انتهاء الجلسة', 'settings'),
('settings.session_timeout.description', 'Session timeout duration in minutes', 'مدة انتهاء الجلسة بالدقائق', 'settings'),

('session_timeout_minutes.label', 'Session Timeout (Minutes)', 'انتهاء صلاحية الجلسة (دقائق)', 'settings'),
('session_timeout_minutes.description', 'Session expiry duration in minutes', 'مدة انتهاء صلاحية الجلسة بالدقائق', 'settings')

ON CONFLICT (translation_key) 
DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();