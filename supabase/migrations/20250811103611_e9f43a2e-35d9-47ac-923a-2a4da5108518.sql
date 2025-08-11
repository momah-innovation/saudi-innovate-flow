-- Add remaining translation keys for components with fallback strings
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- Stakeholder Management
('stakeholder.types.government', 'Government', 'حكومي', 'stakeholder'),
('stakeholder.types.private', 'Private Sector', 'قطاع خاص', 'stakeholder'),
('stakeholder.types.academic', 'Academic', 'أكاديمي', 'stakeholder'),
('stakeholder.types.non_profit', 'Non-Profit Organization', 'منظمة غير ربحية', 'stakeholder'),
('stakeholder.types.international', 'International', 'دولي', 'stakeholder'),
('stakeholder.influence_levels.medium', 'Medium', 'متوسط', 'stakeholder'),
('stakeholder.interest_levels.medium', 'Medium', 'متوسط', 'stakeholder'),
('stakeholder.engagement_status.neutral', 'Neutral', 'محايد', 'stakeholder'),
('stakeholder.levels.high', 'High', 'عالي', 'stakeholder'),
('stakeholder.levels.medium', 'Medium', 'متوسط', 'stakeholder'),
('stakeholder.levels.low', 'Low', 'منخفض', 'stakeholder'),
('stakeholder_wizard.error', 'Error', 'خطأ', 'stakeholder'),
('stakeholder_wizard.save_failed', 'Failed to save stakeholder', 'فشل في حفظ أصحاب المصلحة', 'stakeholder'),

-- Role Request Wizard
('toast.pending_request_exists', 'You already have a pending request for this role. Please wait for review.', 'لديك بالفعل طلب معلق لهذا الدور. يرجى انتظار المراجعة.', 'role_request'),
('toast.role_request_success', 'Role request submitted successfully! An administrator will review your request.', 'تم تقديم طلب الدور بنجاح! سيقوم المدير بمراجعة طلبك.', 'role_request'),
('roleRequest.submitError', 'Failed to submit role request. Please try again.', 'فشل في تقديم طلب الدور. يرجى المحاولة مرة أخرى.', 'role_request'),

-- Sectors Management
('admin.edit_sector', 'Edit Sector', 'تعديل القطاع', 'admin'),
('admin.add_new_sector', 'Add New Sector', 'إضافة قطاع جديد', 'admin'),

-- Storage Quota Manager
('error.validation', 'Validation Error', 'خطأ في التحقق', 'error'),
('storage.quota.select_bucket_size', 'Please select a bucket and enter quota size', 'يرجى اختيار مجموعة وإدخال حجم الحصة', 'storage'),
('storage.quota.set_success', 'Quota Set', 'تم تعيين الحصة', 'storage'),
('storage.quota.removed', 'Quota Removed', 'تم إزالة الحصة', 'storage'),
('storage.quota.auto_setup_complete', 'Auto Setup Complete', 'اكتمل الإعداد التلقائي', 'storage'),
('storage.quota.auto_setup_failed', 'Auto Setup Failed', 'فشل الإعداد التلقائي', 'storage'),
('storage.quotas.title', 'Storage Quotas', 'حصص التخزين', 'storage'),
('storage.quotas.description', 'Manage storage quotas for different buckets', 'إدارة حصص التخزين للمجموعات المختلفة', 'storage'),
('storage.quota.add', 'Add Quota', 'إضافة حصة', 'storage'),
('storage.quota.set_title', 'Set Storage Quota', 'تعيين حصة التخزين', 'storage'),
('storage.bucket', 'Bucket', 'مجموعة', 'storage'),
('storage.select_bucket', 'Select a bucket', 'اختر مجموعة', 'storage'),
('storage.quota.size', 'Quota Size', 'حجم الحصة', 'storage'),
('storage.quota.size_placeholder', '100', '100', 'storage'),
('storage.unit', 'Unit', 'وحدة', 'storage'),
('storage.quota.set', 'Set Quota', 'تعيين الحصة', 'storage'),
('storage.quota.none_configured', 'No storage quotas configured', 'لم يتم تكوين حصص تخزين', 'storage'),

-- General Status Options
('status.active', 'Active', 'نشط', 'status'),
('status.inactive', 'Inactive', 'غير نشط', 'status'),
('status.pending', 'Pending', 'معلق', 'status')

ON CONFLICT (translation_key) DO UPDATE SET 
text_en = EXCLUDED.text_en,
text_ar = EXCLUDED.text_ar,
category = EXCLUDED.category,
updated_at = now();