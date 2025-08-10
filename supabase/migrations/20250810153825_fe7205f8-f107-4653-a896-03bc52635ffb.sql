-- Add more comprehensive translation keys
INSERT INTO public.system_translations (translation_key, text_en, text_ar, category) VALUES

-- Campaign Wizard Dates
('admin.campaigns.registration_deadline', 'Registration Deadline *', 'آخر موعد للتسجيل *', 'form'),
('admin.campaigns.budget_label', 'Budget (Saudi Riyals)', 'الميزانية (ريال سعودي)', 'form'),
('admin.campaigns.budget_placeholder', 'Enter campaign budget', 'أدخل ميزانية الحملة', 'form'),

-- Organizational Structure
('admin.campaigns.main_sector', 'Main Sector', 'القطاع الرئيسي', 'form'),
('admin.campaigns.choose_main_sector', 'Choose main sector', 'اختر القطاع الرئيسي', 'form'),
('admin.campaigns.main_deputy', 'Main Deputy', 'الوكالة الرئيسية', 'form'),
('admin.campaigns.choose_main_deputy', 'Choose main deputy', 'اختر الوكالة الرئيسية', 'form'),
('admin.campaigns.main_department', 'Main Department', 'الإدارة الرئيسية', 'form'),
('admin.campaigns.choose_main_department', 'Choose main department', 'اختر الإدارة الرئيسية', 'form'),
('admin.campaigns.main_challenge', 'Main Challenge', 'التحدي الرئيسي', 'form'),
('admin.campaigns.choose_main_challenge', 'Choose main challenge', 'اختر التحدي الرئيسي', 'form'),
('admin.campaigns.participating_sectors', 'Participating Sectors', 'القطاعات المشاركة', 'form'),
('admin.campaigns.participating_deputies', 'Participating Deputies', 'الوكالات المشاركة', 'form'),
('admin.campaigns.participating_departments', 'Participating Departments', 'الإدارات المشاركة', 'form'),
('admin.campaigns.participating_challenges', 'Participating Challenges', 'التحديات المشاركة', 'form'),

-- Partnerships
('admin.campaigns.partners', 'Partners', 'الشركاء', 'form'),
('admin.campaigns.search_partner', 'Search for partner...', 'ابحث عن شريك...', 'form'),
('admin.campaigns.stakeholders', 'Stakeholders', 'أصحاب المصلحة', 'form'),
('admin.campaigns.search_stakeholder', 'Search for stakeholder...', 'ابحث عن صاحب مصلحة...', 'form'),

-- Campaign Wizard Navigation
('admin.campaigns.previous', 'Previous', 'السابق', 'navigation'),
('admin.campaigns.cancel', 'Cancel', 'إلغاء', 'navigation'),
('admin.campaigns.next', 'Next', 'التالي', 'navigation'),
('admin.campaigns.saving', 'Saving...', 'جاري الحفظ...', 'navigation'),
('admin.campaigns.update_campaign', 'Update Campaign', 'تحديث الحملة', 'navigation'),
('admin.campaigns.create_campaign', 'Create Campaign', 'إنشاء الحملة', 'navigation'),
('admin.campaigns.edit_campaign', 'Edit Campaign', 'تعديل الحملة', 'dialog'),
('admin.campaigns.add_new_campaign', 'Add New Campaign', 'إضافة حملة جديدة', 'dialog'),

-- File and Avatar Management
('admin.avatars.bulk_upload', 'Bulk Avatar Upload', 'رفع صور شخصية مجمعة', 'admin'),
('admin.avatars.upload_avatars', 'Upload Avatars', 'رفع الصور الشخصية', 'admin'),
('admin.avatars.processing', 'Processing avatars...', 'جاري معالجة الصور...', 'admin'),
('admin.avatars.success', 'Avatars uploaded successfully', 'تم رفع الصور الشخصية بنجاح', 'admin'),

-- Progress Tracking
('progress.fixing_translations', 'Fixing translation system', 'إصلاح نظام الترجمة', 'progress'),
('progress.components_updated', 'Components updated', 'تم تحديث المكونات', 'progress'),
('progress.database_fixed', 'Database translations fixed', 'تم إصلاح ترجمات قاعدة البيانات', 'progress'),
('progress.remaining_components', 'Remaining components to fix', 'المكونات المتبقية للإصلاح', 'progress')

ON CONFLICT (translation_key) DO UPDATE SET
text_en = EXCLUDED.text_en,
text_ar = EXCLUDED.text_ar,
category = EXCLUDED.category;