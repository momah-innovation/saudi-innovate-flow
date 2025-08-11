-- Add missing translation keys for systematic migration
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- Admin Campaign Wizard
('admin.campaigns.success_metrics_placeholder', 'Enter success metrics and required indicators', 'أدخل مؤشرات النجاح والمتطلبات المطلوبة', 'admin'),
('admin.campaigns.manager_label', 'Campaign Manager', 'مدير الحملة', 'admin'),
('admin.campaigns.choose_manager', 'Choose Campaign Manager', 'اختر مدير الحملة', 'admin'),
('admin.campaigns.search_manager', 'Search for manager...', 'البحث عن مدير...', 'admin'),
('admin.campaigns.no_results', 'No results found', 'لم يتم العثور على نتائج', 'admin'),
('admin.campaigns.start_date_label', 'Start Date *', 'تاريخ البداية *', 'admin'),
('admin.campaigns.end_date_label', 'End Date *', 'تاريخ النهاية *', 'admin'),
('admin.campaigns.registration_deadline', 'Registration Deadline *', 'موعد انتهاء التسجيل *', 'admin'),
('admin.campaigns.budget_label', 'Budget (Saudi Riyals)', 'الميزانية (ريال سعودي)', 'admin'),
('admin.campaigns.budget_placeholder', 'Enter campaign budget', 'أدخل ميزانية الحملة', 'admin'),
('admin.campaigns.main_sector', 'Main Sector', 'القطاع الرئيسي', 'admin'),
('admin.campaigns.choose_main_sector', 'Choose main sector', 'اختر القطاع الرئيسي', 'admin'),
('admin.campaigns.main_deputy', 'Main Deputy', 'النائب الرئيسي', 'admin'),
('admin.campaigns.choose_main_deputy', 'Choose main deputy', 'اختر النائب الرئيسي', 'admin'),
('admin.campaigns.main_department', 'Main Department', 'الإدارة الرئيسية', 'admin'),
('admin.campaigns.choose_main_department', 'Choose main department', 'اختر الإدارة الرئيسية', 'admin'),
('admin.campaigns.main_challenge', 'Main Challenge', 'التحدي الرئيسي', 'admin'),
('admin.campaigns.choose_main_challenge', 'Choose main challenge', 'اختر التحدي الرئيسي', 'admin'),
('admin.campaigns.participating_sectors', 'Participating Sectors', 'القطاعات المشاركة', 'admin'),
('admin.campaigns.participating_deputies', 'Participating Deputies', 'النواب المشاركون', 'admin'),
('admin.campaigns.participating_departments', 'Participating Departments', 'الإدارات المشاركة', 'admin'),
('admin.campaigns.participating_challenges', 'Participating Challenges', 'التحديات المشاركة', 'admin'),
('admin.campaigns.partners', 'Partners', 'الشركاء', 'admin'),
('admin.campaigns.search_partner', 'Search for partner...', 'البحث عن شريك...', 'admin'),
('admin.campaigns.stakeholders', 'Stakeholders', 'أصحاب المصلحة', 'admin'),
('admin.campaigns.search_stakeholder', 'Search for stakeholder...', 'البحث عن صاحب مصلحة...', 'admin'),
('admin.campaigns.edit_campaign', 'Edit Campaign', 'تعديل الحملة', 'admin'),
('admin.campaigns.add_new_campaign', 'Add New Campaign', 'إضافة حملة جديدة', 'admin'),
('admin.campaigns.previous', 'Previous', 'السابق', 'admin'),
('admin.campaigns.cancel', 'Cancel', 'إلغاء', 'admin'),
('admin.campaigns.saving', 'Saving...', 'جاري الحفظ...', 'admin'),
('admin.campaigns.update_campaign', 'Update Campaign', 'تحديث الحملة', 'admin'),
('admin.campaigns.create_campaign', 'Create Campaign', 'إنشاء الحملة', 'admin'),
('admin.campaigns.next', 'Next', 'التالي', 'admin'),

-- Admin Challenge Wizard
('admin.challenges.validation_error', 'Validation Error', 'خطأ في التحقق', 'admin'),
('admin.challenges.enter_title', 'Please enter a challenge title', 'يرجى إدخال عنوان التحدي', 'admin'),
('admin.challenges.enter_description', 'Please enter a challenge description', 'يرجى إدخال وصف التحدي', 'admin'),
('admin.challenges.update_success', 'Challenge Updated', 'تم تحديث التحدي', 'admin'),
('admin.challenges.update_success_desc', 'Challenge has been updated successfully', 'تم تحديث التحدي بنجاح', 'admin'),
('admin.challenges.create_success', 'Challenge Created', 'تم إنشاء التحدي', 'admin'),
('admin.challenges.create_success_desc', 'Challenge has been created successfully', 'تم إنشاء التحدي بنجاح', 'admin'),
('admin.challenges.save_failed', 'Save Failed', 'فشل في الحفظ', 'admin'),
('admin.challenges.try_again', 'Please try again', 'يرجى المحاولة مرة أخرى', 'admin'),
('admin.challenges.edit_challenge', 'Edit Challenge', 'تعديل التحدي', 'admin'),
('admin.challenges.create_challenge', 'Create Challenge', 'إنشاء التحدي', 'admin'),

-- Challenge Filters
('challenge_filters.sort', 'Sort', 'ترتيب', 'challenges'),
('challenge_filters.ascending', 'Ascending', 'تصاعدي', 'challenges'),
('challenge_filters.descending', 'Descending', 'تنازلي', 'challenges'),
('challenge_filters.filters_active_ar', 'فلتر نشط', 'فلتر نشط', 'challenges'),
('challenge_filters.filters_active', 'active filters', 'فلاتر نشطة', 'challenges'),
('challenge_filters.clear_all_ar', 'مسح الكل', 'مسح الكل', 'challenges'),
('challenge_filters.clear_all', 'Clear all', 'مسح الكل', 'challenges'),

-- Challenges
('challenges.submissions_error', 'Failed to load submissions', 'فشل في تحميل المشاركات', 'challenges'),

-- Events Status
('events.status.scheduled', 'Scheduled', 'مجدول', 'events'),
('events.status.ongoing', 'Ongoing', 'جاري', 'events'),
('events.status.completed', 'Completed', 'مكتمل', 'events'),
('events.status.cancelled', 'Cancelled', 'ملغي', 'events'),

-- Events Location and UI
('events.location.online', 'Online', 'عبر الإنترنت', 'events'),
('events.registration.limited', 'Limited', 'محدود', 'events'),
('events.registration.title', 'Registration', 'التسجيل', 'events'),
('events.registration.full', 'full', 'ممتلئ', 'events'),
('events.registration.limited_spots', 'Limited spots', 'أماكن محدودة', 'events'),
('events.stats.registered', 'Registered', 'مسجل', 'events'),
('events.stats.attended', 'Attended', 'حضر', 'events'),
('events.budget.free', 'Free', 'مجاني', 'events'),
('events.budget.title', 'Budget', 'الميزانية', 'events'),
('events.registration.rate', 'Registration rate', 'معدل التسجيل', 'events'),

-- Common UI elements
('common.delete', 'Delete', 'حذف', 'common'),
('common.view', 'View', 'عرض', 'common'),
('common.edit', 'Edit', 'تعديل', 'common'),
('common.currency.sar', 'SAR', 'ريال', 'common')

ON CONFLICT (translation_key) DO UPDATE SET 
text_en = EXCLUDED.text_en,
text_ar = EXCLUDED.text_ar,
category = EXCLUDED.category,
updated_at = now();