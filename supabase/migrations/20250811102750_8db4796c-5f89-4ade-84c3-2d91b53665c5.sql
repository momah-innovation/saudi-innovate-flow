-- Add remaining missing translation keys for completed migration
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- Settings and configuration keys (from console logs)
('settings.file_size_units_extended.label', 'Extended File Size Units', 'وحدات حجم الملف الموسعة', 'settings'),
('settings.category.file_management', 'File Management', 'إدارة الملفات', 'settings'),
('settings.category.question_management', 'Question Management', 'إدارة الأسئلة', 'settings'),
('settings.category.system_configuration', 'System Configuration', 'تكوين النظام', 'settings'),
('settings.enabled', 'Enabled', 'مفعل', 'settings'),
('settings.disabled', 'Disabled', 'معطل', 'settings'),
('settings.default_value', 'Default Value', 'القيمة الافتراضية', 'settings'),
('settings.options', 'Options', 'الخيارات', 'settings'),
('settings.configuration', 'Configuration', 'التكوين', 'settings'),

-- Role Request Management
('toast.pending_request_exists', 'You already have a pending request for this role. Please wait for review.', 'لديك بالفعل طلب معلق لهذا الدور. يرجى انتظار المراجعة.', 'role_requests'),
('toast.role_request_success', 'Role request submitted successfully! An administrator will review your request.', 'تم إرسال طلب الدور بنجاح! سيقوم المسؤول بمراجعة طلبك.', 'role_requests'),
('roleRequest.submitError', 'Failed to submit role request. Please try again.', 'فشل في إرسال طلب الدور. يرجى المحاولة مرة أخرى.', 'role_requests'),

-- Sectors Management
('admin.edit_sector', 'Edit Sector', 'تعديل القطاع', 'admin'),
('admin.add_new_sector', 'Add New Sector', 'إضافة قطاع جديد', 'admin'),

-- Stakeholder Management
('stakeholder.types.government', 'حكومي', 'حكومي', 'stakeholder'),
('stakeholder.types.private', 'قطاع خاص', 'قطاع خاص', 'stakeholder'),
('stakeholder.types.academic', 'أكاديمي', 'أكاديمي', 'stakeholder'),
('stakeholder.types.non_profit', 'منظمة غير ربحية', 'منظمة غير ربحية', 'stakeholder'),
('stakeholder.types.international', 'دولي', 'دولي', 'stakeholder'),
('stakeholder.influence_levels.medium', 'متوسط', 'متوسط', 'stakeholder'),
('stakeholder.interest_levels.medium', 'متوسط', 'متوسط', 'stakeholder'),
('stakeholder.engagement_status.neutral', 'محايد', 'محايد', 'stakeholder'),
('stakeholder.levels.high', 'عالي', 'عالي', 'stakeholder'),
('stakeholder.levels.medium', 'متوسط', 'متوسط', 'stakeholder'),
('stakeholder.levels.low', 'منخفض', 'منخفض', 'stakeholder'),
('status.active', 'نشط', 'نشط', 'common'),
('status.inactive', 'غير نشط', 'غير نشط', 'common'),
('status.pending', 'معلق', 'معلق', 'common'),

-- User Profile Management  
('userProfile.deleteProfileDescription', 'This action cannot be undone. This will permanently delete your account and remove your data from our servers.', 'لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف حسابك نهائياً وإزالة بياناتك من خوادمنا.', 'user_profile'),

-- Challenge Submission Management
('challengeSubmission.deleteSubmissionDescription', 'This action cannot be undone. This will permanently delete this submission.', 'لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف هذا التقديم نهائياً.', 'challenge_submissions'),

-- Event Management  
('events.metrics.total', 'Total Events', 'إجمالي الفعاليات', 'events'),
('events.metrics.trend_month', '+12% from last month', '+12% من الشهر الماضي', 'events'),
('events.metrics.active', 'Active Events', 'الفعاليات النشطة', 'events'),
('events.metrics.ongoing_now', '{{count}} ongoing now', '{{count}} جارية الآن', 'events'),
('events.metrics.participants', 'Total Participants', 'إجمالي المشاركين', 'events'),
('events.metrics.registration_rate', '+8% registration rate', '+8% معدل التسجيل', 'events'),
('events.metrics.revenue', 'Revenue', 'الإيرادات', 'events'),
('events.metrics.revenue_growth', '+15% from last month', '+15% من الشهر الماضي', 'events'),
('events.status.upcoming', 'Upcoming', 'قادمة', 'events'),
('events.venues', 'Venues', 'الأماكن', 'events'),
('events.need_attention', 'Need Attention', 'تحتاج انتباه', 'events'),
('events.quick_stats', 'Quick Stats', 'إحصائيات سريعة', 'events'),
('events.status_distribution', 'Event Status Distribution', 'توزيع حالة الفعاليات', 'events'),

-- Challenge Hero  
('challenges.platform_badge', 'Innovation Challenges Platform', 'منصة تحديات الابتكار', 'challenges'),
('challenges.hero_title_part1', 'Take on', 'تحدى', 'challenges'),
('challenges.hero_title_part2', 'Challenges', 'التحديات', 'challenges'),
('challenges.hero_title_part3', 'Shape the Future', 'اصنع المستقبل', 'challenges'),
('challenges.hero_description', 'Join innovators worldwide in solving real-world challenges and contributing to Saudi Arabia\'s Vision 2030 transformation.', 'انضم إلى المبتكرين حول العالم في حل التحديات الحقيقية والمساهمة في تحويل رؤية السعودية 2030.', 'challenges'),
('challenges.explore_challenges', 'Explore Challenges', 'استكشف التحديات', 'challenges'),
('challenges.create_challenge', 'Create Challenge', 'أنشئ تحدي', 'challenges'),
('challenges.advanced_filters', 'Advanced Filters', 'فلاتر متقدمة', 'challenges'),
('challenges.active', 'Active', 'نشط', 'challenges'),
('challenges.featured', 'Featured', 'مميز', 'challenges'),
('challenges.participants', 'participants', 'مشاركين', 'challenges'),
('challenges.end_date', 'end date', 'تاريخ الانتهاء', 'challenges'),
('challenges.view_details', 'View Details', 'عرض التفاصيل', 'challenges'),
('challenges.no_featured_challenge', 'No Featured Challenge', 'لا يوجد تحدي مميز', 'challenges'),
('challenges.featured_will_appear', 'Featured challenges will appear here', 'ستظهر التحديات المميزة هنا', 'challenges'),
('challenges.saved_challenges', 'Saved Challenges', 'التحديات المحفوظة', 'challenges'),
('challenges.view_saved', 'View Saved', 'عرض المحفوظ', 'challenges'),
('challenges.achievements', 'Achievements', 'الإنجازات', 'challenges'),
('challenges.my_achievements', 'My Achievements', 'إنجازاتي', 'challenges')

ON CONFLICT (translation_key) DO UPDATE SET 
text_en = EXCLUDED.text_en,
text_ar = EXCLUDED.text_ar,
category = EXCLUDED.category,
updated_at = now();