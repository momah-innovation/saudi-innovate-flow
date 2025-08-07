-- Add missing translation keys for Challenges settings category
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- Challenges Category Description
('settings.category.challenges.description', 'Challenge management and configuration settings', 'إعدادات إدارة وتكوين التحديات', 'settings'),

-- Anonymous Submissions
('settings.allow_anonymous_submissions.label', 'Allow Anonymous Submissions', 'السماح بالإرسالات المجهولة', 'settings'),
('settings.allow_anonymous_submissions.description', 'Allow users to submit challenges without registration', 'السماح للمستخدمين بإرسال التحديات بدون تسجيل', 'settings'),

-- Challenge Filter Status Options
('settings.challenge_filter_status_options.label', 'Challenge Filter Status Options', 'خيارات حالة تصفية التحديات', 'settings'),
('settings.challenge_filter_status_options.description', 'Available status options for filtering challenges', 'خيارات الحالة المتاحة لتصفية التحديات', 'settings'),

-- Approval Requirements
('settings.require_approval_for_publish.label', 'Require Approval for Publish', 'تتطلب موافقة للنشر', 'settings'),
('settings.require_approval_for_publish.description', 'Require administrator approval before publishing challenges', 'تتطلب موافقة المدير قبل نشر التحديات', 'settings')

-- Handle conflicts by updating existing records
ON CONFLICT (translation_key) 
DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();