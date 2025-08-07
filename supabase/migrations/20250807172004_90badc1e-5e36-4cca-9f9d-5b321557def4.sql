-- Add Ideas settings translation keys (Part 1)
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- Ideas Category Description
('settings.category.ideas.description', 'Ideas management and configuration settings', 'إعدادات إدارة وتكوين الأفكار', 'settings'),

-- Auto Approve Ideas
('settings.challenge_auto_approve_ideas.label', 'Auto Approve Challenge Ideas', 'الموافقة التلقائية على أفكار التحديات', 'settings'),
('settings.challenge_auto_approve_ideas.description', 'Automatically approve ideas submitted to challenges', 'الموافقة التلقائية على الأفكار المرسلة للتحديات', 'settings'),

-- Form Title Length
('settings.form_max_idea_title_length.label', 'Maximum Idea Title Length', 'الحد الأقصى لطول عنوان الفكرة', 'settings'),
('settings.form_max_idea_title_length.description', 'Maximum number of characters allowed in idea titles', 'الحد الأقصى لعدد الأحرف المسموحة في عناوين الأفكار', 'settings'),

-- Anonymous Submissions
('settings.idea_allow_anonymous_submissions.label', 'Allow Anonymous Idea Submissions', 'السماح بإرسال الأفكار مجهولة الهوية', 'settings'),
('settings.idea_allow_anonymous_submissions.description', 'Allow users to submit ideas without registration', 'السماح للمستخدمين بإرسال الأفكار بدون تسجيل', 'settings'),

-- Attachment Types
('settings.idea_allowed_attachment_types.label', 'Allowed Attachment Types', 'أنواع المرفقات المسموحة', 'settings'),
('settings.idea_allowed_attachment_types.description', 'File types that can be attached to ideas', 'أنواع الملفات التي يمكن إرفاقها بالأفكار', 'settings'),

-- Analytics
('settings.idea_analytics_enabled.label', 'Enable Idea Analytics', 'تفعيل تحليلات الأفكار', 'settings'),
('settings.idea_analytics_enabled.description', 'Enable analytics tracking for ideas', 'تفعيل تتبع التحليلات للأفكار', 'settings'),

('settings.idea_analytics_retention_days.label', 'Analytics Retention Days', 'أيام الاحتفاظ بالتحليلات', 'settings'),
('settings.idea_analytics_retention_days.description', 'Number of days to retain analytics data', 'عدد الأيام للاحتفاظ ببيانات التحليلات', 'settings'),

-- Assignment Due Date
('settings.idea_assignment_due_date_days.label', 'Assignment Due Date (Days)', 'موعد استحقاق المهمة (أيام)', 'settings'),
('settings.idea_assignment_due_date_days.description', 'Default days for idea assignment due dates', 'الأيام الافتراضية لمواعيد استحقاق مهام الأفكار', 'settings'),

-- Attachments
('settings.idea_attachments_enabled.label', 'Enable Idea Attachments', 'تفعيل مرفقات الأفكار', 'settings'),
('settings.idea_attachments_enabled.description', 'Allow users to attach files to ideas', 'السماح للمستخدمين بإرفاق ملفات بالأفكار', 'settings'),

-- Auto Approve
('settings.idea_auto_approve_submissions.label', 'Auto Approve Idea Submissions', 'الموافقة التلقائية على إرسالات الأفكار', 'settings'),
('settings.idea_auto_approve_submissions.description', 'Automatically approve submitted ideas', 'الموافقة التلقائية على الأفكار المرسلة', 'settings'),

-- Auto Save
('settings.idea_auto_save_drafts.label', 'Auto Save Drafts', 'الحفظ التلقائي للمسودات', 'settings'),
('settings.idea_auto_save_drafts.description', 'Automatically save idea drafts while editing', 'الحفظ التلقائي لمسودات الأفكار أثناء التحرير', 'settings')

ON CONFLICT (translation_key) 
DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();