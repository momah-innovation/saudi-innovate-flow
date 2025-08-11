-- Add remaining missing translation keys from migrated components
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- Translation Manager keys
('translations.downloadSuccess', 'Download completed successfully', 'تم تنزيل الملف بنجاح', 'translations'),
('translations.downloadError', 'Download failed', 'فشل في التنزيل', 'translations'),
('translations.saveError', 'Failed to save translation', 'فشل في حفظ الترجمة', 'translations'),

-- Focus Question Management keys
('focusQuestions.loadError', 'Failed to load focus questions', 'فشل في تحميل الأسئلة المحورية', 'focus_questions'),
('focusQuestions.deleteError', 'Failed to delete focus question', 'فشل في حذف السؤال المحوري', 'focus_questions'),

-- Opportunity Management keys
('opportunities.fetch_error', 'Failed to fetch opportunities list', 'فشل في جلب قائمة الفرص', 'opportunities'),
('opportunity_type.job', 'Job', 'وظيفة', 'opportunities'),
('opportunity_type.internship', 'Internship', 'تدريب', 'opportunities'),
('opportunity_type.volunteer', 'Volunteer', 'تطوع', 'opportunities'),
('opportunity_type.partnership', 'Partnership', 'شراكة', 'opportunities'),
('opportunity_type.grant', 'Grant', 'منحة', 'opportunities'),
('opportunity_type.competition', 'Competition', 'مسابقة', 'opportunities'),

-- Challenge Management keys
('challenges.submissions_error', 'Failed to load submissions', 'فشل في تحميل المشاركات', 'challenges'),

-- Status keys
('status.open', 'Open', 'مفتوح', 'ui'),
('status.closed', 'Closed', 'مغلق', 'ui'),
('status.on_hold', 'On Hold', 'معلق', 'ui'),
('status.cancelled', 'Cancelled', 'ملغي', 'ui'),

-- Location keys
('location.remote', 'Remote', 'عن بُعد', 'ui'),
('location.not_specified', 'Not Specified', 'غير محدد', 'ui'),

-- UI keys
('ui.selected', 'Selected', 'محدد', 'ui'),
('ui.select_all', 'Select All', 'تحديد الكل', 'ui'),

-- Translation cache keys
('translation.cache.refresh_success', 'Translation cache refreshed successfully', 'تم تحديث ذاكرة التخزين المؤقت للترجمات بنجاح', 'translations'),
('translation.cache.refresh_error', 'Failed to refresh translation cache', 'فشل في تحديث ذاكرة التخزين المؤقت للترجمات', 'translations')

ON CONFLICT (translation_key) DO NOTHING;