-- Phase 1.2: Add Missing Translations for New Array Settings
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- Question types
('question_types.open_ended', 'Open Ended', 'سؤال مفتوح', 'questions'),
('question_types.multiple_choice', 'Multiple Choice', 'متعدد الخيارات', 'questions'),
('question_types.yes_no', 'Yes/No', 'نعم/لا', 'questions'),
('question_types.rating', 'Rating', 'تقييم', 'questions'),
('question_types.ranking', 'Ranking', 'ترتيب', 'questions'),

-- Attachment types
('attachment_types.pdf', 'PDF Document', 'وثيقة PDF', 'files'),
('attachment_types.doc', 'Word Document', 'وثيقة Word', 'files'),
('attachment_types.docx', 'Word Document', 'وثيقة Word', 'files'),
('attachment_types.ppt', 'PowerPoint Presentation', 'عرض PowerPoint', 'files'),
('attachment_types.pptx', 'PowerPoint Presentation', 'عرض PowerPoint', 'files'),
('attachment_types.jpg', 'JPEG Image', 'صورة JPEG', 'files'),
('attachment_types.jpeg', 'JPEG Image', 'صورة JPEG', 'files'),
('attachment_types.png', 'PNG Image', 'صورة PNG', 'files'),
('attachment_types.gif', 'GIF Image', 'صورة GIF', 'files'),

-- Assignment types
('assignment_types.reviewer', 'Reviewer', 'مراجع', 'assignments'),
('assignment_types.evaluator', 'Evaluator', 'مقيم', 'assignments'),
('assignment_types.implementer', 'Implementer', 'منفذ', 'assignments'),
('assignment_types.observer', 'Observer', 'مراقب', 'assignments'),

-- Integration types
('integration_types.api', 'API Integration', 'تكامل API', 'integrations'),
('integration_types.webhook', 'Webhook', 'Webhook', 'integrations'),
('integration_types.sso', 'Single Sign-On', 'تسجيل دخول موحد', 'integrations'),
('integration_types.file_sync', 'File Synchronization', 'مزامنة الملفات', 'integrations'),
('integration_types.database', 'Database Integration', 'تكامل قاعدة البيانات', 'integrations'),

-- Notification types
('notification_types.email', 'Email', 'بريد إلكتروني', 'notifications'),
('notification_types.sms', 'SMS', 'رسالة نصية', 'notifications'),
('notification_types.push', 'Push Notification', 'إشعار فوري', 'notifications'),
('notification_types.in_app', 'In-App Notification', 'إشعار داخل التطبيق', 'notifications'),

-- Team specializations
('team_specializations.Innovation Strategy & Planning', 'Innovation Strategy & Planning', 'استراتيجية وتخطيط الابتكار', 'teams'),
('team_specializations.Project Management & Execution', 'Project Management & Execution', 'إدارة وتنفيذ المشاريع', 'teams'),
('team_specializations.Research & Market Analysis', 'Research & Market Analysis', 'البحث وتحليل السوق', 'teams'),
('team_specializations.Stakeholder Engagement', 'Stakeholder Engagement', 'مشاركة أصحاب المصلحة', 'teams'),
('team_specializations.Change Management', 'Change Management', 'إدارة التغيير', 'teams'),

-- Team roles
('team_roles.Innovation Manager', 'Innovation Manager', 'مدير الابتكار', 'teams'),
('team_roles.Data Analyst', 'Data Analyst', 'محلل البيانات', 'teams'),
('team_roles.Content Creator', 'Content Creator', 'منتج المحتوى', 'teams'),
('team_roles.Project Manager', 'Project Manager', 'مدير المشروع', 'teams'),
('team_roles.Research Analyst', 'Research Analyst', 'محلل الأبحاث', 'teams'),

-- File categories
('file_categories.documents', 'Documents', 'وثائق', 'files'),
('file_categories.images', 'Images', 'صور', 'files'),
('file_categories.presentations', 'Presentations', 'عروض تقديمية', 'files'),
('file_categories.spreadsheets', 'Spreadsheets', 'جداول بيانات', 'files'),
('file_categories.archives', 'Archives', 'أرشيف', 'files'),

-- Workflow statuses
('workflow_statuses.draft', 'Draft', 'مسودة', 'workflow'),
('workflow_statuses.submitted', 'Submitted', 'مقدم', 'workflow'),
('workflow_statuses.under_review', 'Under Review', 'قيد المراجعة', 'workflow'),
('workflow_statuses.approved', 'Approved', 'مقبول', 'workflow'),
('workflow_statuses.rejected', 'Rejected', 'مرفوض', 'workflow'),
('workflow_statuses.in_development', 'In Development', 'قيد التطوير', 'workflow'),
('workflow_statuses.implemented', 'Implemented', 'مُطبق', 'workflow'),

-- Visibility levels
('visibility_levels.public', 'Public', 'عام', 'access'),
('visibility_levels.internal', 'Internal', 'داخلي', 'access'),
('visibility_levels.restricted', 'Restricted', 'مقيد', 'access'),
('visibility_levels.private', 'Private', 'خاص', 'access')

ON CONFLICT (translation_key) 
DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();