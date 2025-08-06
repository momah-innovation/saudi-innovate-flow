-- Add translation data (separate migration to avoid syntax errors)

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
('security.data_retention_policy', 'en', 'Personal data is retained for 5 years from the last user activity', 'security'),
('security.access_control_policy', 'ar', 'الوصول للنظام محدود حسب الصلاحيات المعطاة لكل مستخدم', 'security'),
('security.access_control_policy', 'en', 'System access is limited according to permissions granted to each user', 'security'),

-- Settings labels
('settings.general.title', 'ar', 'الإعدادات العامة', 'settings'),
('settings.general.title', 'en', 'General Settings', 'settings'),
('settings.security.title', 'ar', 'إعدادات الأمان', 'settings'),
('settings.security.title', 'en', 'Security Settings', 'settings'),
('settings.ai.title', 'ar', 'إعدادات الذكاء الاصطناعي', 'settings'),
('settings.ai.title', 'en', 'AI Settings', 'settings'),

-- UI labels with proper i18n keys
('settings.system_name.label', 'ar', 'اسم النظام', 'settings'),
('settings.system_name.label', 'en', 'System Name', 'settings'),
('settings.system_description.label', 'ar', 'وصف النظام', 'settings'),
('settings.system_description.label', 'en', 'System Description', 'settings'),
('settings.maintenance_mode.label', 'ar', 'وضع الصيانة', 'settings'),
('settings.maintenance_mode.label', 'en', 'Maintenance Mode', 'settings'),
('settings.session_timeout.label', 'ar', 'انتهاء الجلسة (دقيقة)', 'settings'),
('settings.session_timeout.label', 'en', 'Session Timeout (minutes)', 'settings'),
('settings.max_challenges_per_user.label', 'ar', 'الحد الأقصى للتحديات لكل مستخدم', 'settings'),
('settings.max_challenges_per_user.label', 'en', 'Maximum Challenges per User', 'settings');