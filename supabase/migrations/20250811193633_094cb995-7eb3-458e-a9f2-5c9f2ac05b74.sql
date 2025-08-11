-- Add remaining missing UI and form setting translation keys
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- Test component settings
('settings.test_component_list.description', 'List of test components for debugging', 'قائمة مكونات الاختبار لتصحيح الأخطاء', 'settings'),
('settings.test_component_names.label', 'Test Component Names', 'أسماء مكونات الاختبار', 'settings'),
('settings.test_component_names.description', 'Names of components used for testing', 'أسماء المكونات المستخدمة للاختبار', 'settings'),

-- UI & Form category
('settings.category.UI & Form', 'UI & Form', 'واجهة المستخدم والنماذج', 'settings'),
('settings.category.UI & Form.description', 'User interface and form configuration settings', 'إعدادات تكوين واجهة المستخدم والنماذج', 'settings'),

-- UI sidebar and initials settings
('settings.ui_sidebar_cookie_max_age_days.description', 'Maximum age in days for sidebar cookies', 'الحد الأقصى للعمر بالأيام لملفات تعريف الارتباط الجانبية', 'settings'),
('settings.ui_initials_max_length.label', 'Initials Max Length', 'الحد الأقصى لطول الأحرف الأولى', 'settings'),
('settings.ui_initials_max_length.description', 'Maximum number of characters for user initials', 'الحد الأقصى لعدد الأحرف للأحرف الأولى للمستخدم', 'settings'),

-- Animation and visual settings
('settings.animation_shapes.label', 'Animation Shapes', 'أشكال الحركة', 'settings'),
('settings.animation_shapes.description', 'Available shapes for animations', 'الأشكال المتاحة للحركات', 'settings'),
('settings.ui_animation_duration_ms.label', 'Animation Duration (ms)', 'مدة الحركة (مللي ثانية)', 'settings'),
('settings.ui_animation_duration_ms.description', 'Duration of UI animations in milliseconds', 'مدة حركات واجهة المستخدم بالمللي ثانية', 'settings'),
('settings.ui_css_transition_duration_ms.label', 'CSS Transition Duration (ms)', 'مدة انتقال CSS (مللي ثانية)', 'settings'),
('settings.ui_css_transition_duration_ms.description', 'Duration of CSS transitions in milliseconds', 'مدة انتقالات CSS بالمللي ثانية', 'settings'),
('settings.ui_navigation_delay_ms.label', 'Navigation Delay (ms)', 'تأخير التنقل (مللي ثانية)', 'settings'),
('settings.ui_navigation_delay_ms.description', 'Delay before navigation actions in milliseconds', 'التأخير قبل إجراءات التنقل بالمللي ثانية', 'settings'),

-- Challenge form settings
('settings.challenge_notes_rows.label', 'Challenge Notes Rows', 'صفوف ملاحظات التحدي', 'settings'),
('settings.challenge_notes_rows.description', 'Number of rows for challenge notes textarea', 'عدد الصفوف لمنطقة نص ملاحظات التحدي', 'settings'),
('settings.challenge_textarea_rows.label', 'Challenge Textarea Rows', 'صفوف منطقة نص التحدي', 'settings'),
('settings.challenge_textarea_rows.description', 'Number of rows for challenge description textarea', 'عدد الصفوف لمنطقة نص وصف التحدي', 'settings'),
('settings.expert_profile_textarea_rows.label', 'Expert Profile Textarea Rows', 'صفوف منطقة نص ملف الخبير', 'settings'),
('settings.expert_profile_textarea_rows.description', 'Number of rows for expert profile textarea', 'عدد الصفوف لمنطقة نص ملف الخبير', 'settings'),

-- UI form defaults
('settings.ui_default_textarea_rows.label', 'Default Textarea Rows', 'صفوف منطقة النص الافتراضية', 'settings'),
('settings.ui_default_textarea_rows.description', 'Default number of rows for textarea elements', 'العدد الافتراضي للصفوف لعناصر منطقة النص', 'settings'),
('settings.ui_description_max_preview_length.label', 'Description Preview Max Length', 'الحد الأقصى لطول معاينة الوصف', 'settings'),
('settings.ui_description_max_preview_length.description', 'Maximum characters to show in description previews', 'الحد الأقصى للأحرف المعروضة في معاينات الوصف', 'settings'),
('settings.ui_table_page_size.label', 'Table Page Size', 'حجم صفحة الجدول', 'settings'),
('settings.ui_table_page_size.description', 'Number of rows per page in data tables', 'عدد الصفوف لكل صفحة في جداول البيانات', 'settings'),
('settings.ui_avatar_size_px.label', 'Avatar Size (px)', 'حجم الصورة الرمزية (بكسل)', 'settings'),
('settings.ui_avatar_size_px.description', 'Size of user avatars in pixels', 'حجم الصور الرمزية للمستخدمين بالبكسل', 'settings'),

-- User role and management settings
('settings.available_user_roles.label', 'Available User Roles', 'أدوار المستخدم المتاحة', 'settings'),
('settings.available_user_roles.description', 'List of roles that can be assigned to users', 'قائمة الأدوار التي يمكن تعيينها للمستخدمين', 'settings'),
('settings.requestable_user_roles.label', 'Requestable User Roles', 'أدوار المستخدم القابلة للطلب', 'settings'),
('settings.requestable_user_roles.description', 'List of roles that users can request', 'قائمة الأدوار التي يمكن للمستخدمين طلبها', 'settings'),
('settings.role_request_justifications.label', 'Role Request Justifications', 'مبررات طلب الدور', 'settings'),
('settings.role_request_justifications.description', 'Predefined justifications for role requests', 'المبررات المحددة مسبقاً لطلبات الأدوار', 'settings'),
('settings.user_status_options.label', 'User Status Options', 'خيارات حالة المستخدم', 'settings'),
('settings.user_status_options.description', 'Available status options for users', 'خيارات الحالة المتاحة للمستخدمين', 'settings'),

-- User Profile category
('settings.category.User Profile', 'User Profile', 'ملف المستخدم', 'settings'),
('settings.category.User Profile.description', 'Settings for user profile configuration and display', 'إعدادات تكوين وعرض ملف المستخدم', 'settings'),

-- Profile form settings
('settings.profile_bio_textarea_rows.label', 'Profile Bio Textarea Rows', 'صفوف منطقة نص السيرة الذاتية', 'settings'),
('settings.profile_bio_textarea_rows.description', 'Number of rows for profile bio textarea', 'عدد الصفوف لمنطقة نص السيرة الذاتية', 'settings'),
('settings.profile_innovation_background_rows.label', 'Innovation Background Rows', 'صفوف خلفية الابتكار', 'settings'),
('settings.profile_innovation_background_rows.description', 'Number of rows for innovation background textarea', 'عدد الصفوف لمنطقة نص خلفية الابتكار', 'settings'),
('settings.profile_max_experience_years.label', 'Maximum Experience Years', 'الحد الأقصى لسنوات الخبرة', 'settings'),
('settings.profile_max_experience_years.description', 'Maximum years of experience allowed in profiles', 'الحد الأقصى لسنوات الخبرة المسموحة في الملفات', 'settings'),
('settings.profile_min_experience_years.label', 'Minimum Experience Years', 'الحد الأدنى لسنوات الخبرة', 'settings'),
('settings.profile_min_experience_years.description', 'Minimum years of experience required in profiles', 'الحد الأدنى لسنوات الخبرة المطلوبة في الملفات', 'settings'),

-- User Management category
('settings.category.user_management', 'User Management', 'إدارة المستخدمين', 'settings'),
('settings.category.user_management.description', 'Settings for managing user accounts and permissions', 'إعدادات إدارة حسابات المستخدمين والصلاحيات', 'settings'),

-- User auto deactivation
('settings.user_auto_deactivate_inactive.label', 'Auto Deactivate Inactive Users', 'إلغاء تنشيط المستخدمين غير النشطين تلقائياً', 'settings'),
('settings.user_auto_deactivate_inactive.description', 'Automatically deactivate users after period of inactivity', 'إلغاء تنشيط المستخدمين تلقائياً بعد فترة من عدم النشاط', 'settings');