-- Insert all translation keys used in the codebase into system_translations table

INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- Ideas Management keys
('ideas.title', 'Ideas Management', 'إدارة الأفكار', 'ideas'),
('ideas.subtitle', 'Manage and review innovation ideas', 'إدارة ومراجعة الأفكار الابتكارية', 'ideas'),
('ideas.empty.title', 'No Ideas Found', 'لا توجد أفكار', 'ideas'),
('ideas.empty.description', 'Start by creating your first innovation idea', 'ابدأ بإنشاء أول فكرة ابتكارية', 'ideas'),
('ideas.create', 'Create Idea', 'إنشاء فكرة', 'ideas'),
('ideas.filter.all', 'All Ideas', 'جميع الأفكار', 'ideas'),
('ideas.filter.pending', 'Pending Review', 'قيد المراجعة', 'ideas'),
('ideas.filter.approved', 'Approved', 'موافق عليها', 'ideas'),
('ideas.filter.rejected', 'Rejected', 'مرفوضة', 'ideas'),
('ideas.bulk.select_all', 'Select All', 'تحديد الكل', 'ideas'),
('ideas.bulk.actions', 'Bulk Actions', 'إجراءات مجمعة', 'ideas'),
('ideas.bulk.approve', 'Approve Selected', 'الموافقة على المحدد', 'ideas'),
('ideas.bulk.reject', 'Reject Selected', 'رفض المحدد', 'ideas'),
('ideas.bulk.delete', 'Delete Selected', 'حذف المحدد', 'ideas'),
('ideas.search.placeholder', 'Search ideas...', 'البحث في الأفكار...', 'ideas'),

-- Innovation Teams keys
('teams.title', 'Innovation Teams', 'فرق الابتكار', 'teams'),
('teams.subtitle', 'Manage innovation teams and members', 'إدارة فرق الابتكار والأعضاء', 'teams'),
('teams.empty.title', 'No Teams Found', 'لا توجد فرق', 'teams'),
('teams.empty.description', 'Create your first innovation team', 'أنشئ أول فريق ابتكار', 'teams'),
('teams.create', 'Create Team', 'إنشاء فريق', 'teams'),
('teams.member.add', 'Add Member', 'إضافة عضو', 'teams'),
('teams.member.role', 'Role', 'الدور', 'teams'),
('teams.member.status', 'Status', 'الحالة', 'teams'),
('teams.member.actions', 'Actions', 'الإجراءات', 'teams'),

-- Team Management keys
('team_management.title', 'Team Management', 'إدارة الفريق', 'team_management'),
('team_management.subtitle', 'Manage team members and their roles', 'إدارة أعضاء الفريق وأدوارهم', 'team_management'),
('team_management.add_member', 'Add Member', 'إضافة عضو', 'team_management'),
('team_management.member_added', 'Team member added successfully', 'تم إضافة عضو الفريق بنجاح', 'team_management'),
('team_management.member_updated', 'Team member updated successfully', 'تم تحديث عضو الفريق بنجاح', 'team_management'),
('team_management.member_removed', 'Team member removed successfully', 'تم إزالة عضو الفريق بنجاح', 'team_management'),

-- Workspace keys
('workspace.title', 'Innovation Workspace', 'مساحة عمل الابتكار', 'workspace'),
('workspace.subtitle', 'Your central hub for innovation management', 'مركزك الرئيسي لإدارة الابتكار', 'workspace'),
('workspace.quick_stats', 'Quick Stats', 'إحصائيات سريعة', 'workspace'),
('workspace.recent_activity', 'Recent Activity', 'النشاط الأخير', 'workspace'),
('workspace.pending_tasks', 'Pending Tasks', 'المهام المعلقة', 'workspace'),

-- Idea Workflow keys
('idea_workflow.title', 'Idea Workflow', 'سير عمل الفكرة', 'idea_workflow'),
('idea_workflow.stage.draft', 'Draft', 'مسودة', 'idea_workflow'),
('idea_workflow.stage.review', 'Under Review', 'قيد المراجعة', 'idea_workflow'),
('idea_workflow.stage.approved', 'Approved', 'موافق عليها', 'idea_workflow'),
('idea_workflow.stage.rejected', 'Rejected', 'مرفوضة', 'idea_workflow'),
('idea_workflow.stage.implementation', 'Implementation', 'التنفيذ', 'idea_workflow'),
('idea_workflow.transition', 'Move to', 'انتقل إلى', 'idea_workflow'),

-- Focus Question Detail keys
('focus_question.details', 'Question Details', 'تفاصيل السؤال', 'focus_question'),
('focus_question.responses', 'Responses', 'الردود', 'focus_question'),
('focus_question.analytics', 'Analytics', 'التحليلات', 'focus_question'),
('focus_question.engagement', 'Engagement Rate', 'معدل المشاركة', 'focus_question'),
('focus_question.completion', 'Completion Rate', 'معدل الإكمال', 'focus_question'),
('focus_question.average_score', 'Average Score', 'المتوسط', 'focus_question'),

-- Challenge Analytics keys
('challenge_analytics.title', 'Challenge Analytics', 'تحليلات التحدي', 'challenge_analytics'),
('challenge_analytics.overview', 'Overview', 'نظرة عامة', 'challenge_analytics'),
('challenge_analytics.participants', 'Participants', 'المشاركون', 'challenge_analytics'),
('challenge_analytics.submissions', 'Submissions', 'المشاركات', 'challenge_analytics'),
('challenge_analytics.engagement', 'Engagement', 'المشاركة', 'challenge_analytics'),
('challenge_analytics.timeline', 'Timeline', 'الجدولة الزمنية', 'challenge_analytics'),

-- Focus Question Analytics keys
('focus_analytics.title', 'Focus Question Analytics', 'تحليلات أسئلة التركيز', 'focus_analytics'),
('focus_analytics.response_trends', 'Response Trends', 'اتجاهات الردود', 'focus_analytics'),
('focus_analytics.score_distribution', 'Score Distribution', 'توزيع النقاط', 'focus_analytics'),
('focus_analytics.participation_rate', 'Participation Rate', 'معدل المشاركة', 'focus_analytics'),

-- Team Member Wizard keys
('wizard.team_member.title', 'Add Team Member', 'إضافة عضو فريق', 'wizard'),
('wizard.team_member.basic_info', 'Basic Information', 'المعلومات الأساسية', 'wizard'),
('wizard.team_member.role_permissions', 'Role & Permissions', 'الدور والصلاحيات', 'wizard'),
('wizard.team_member.review', 'Review & Confirm', 'مراجعة وتأكيد', 'wizard'),
('wizard.team_member.success', 'Team member added successfully!', 'تم إضافة عضو الفريق بنجاح!', 'wizard'),

-- Challenge Wizard keys
('wizard.challenge.title', 'Create Challenge', 'إنشاء تحدي', 'wizard'),
('wizard.challenge.basic_info', 'Basic Information', 'المعلومات الأساسية', 'wizard'),
('wizard.challenge.details', 'Challenge Details', 'تفاصيل التحدي', 'wizard'),
('wizard.challenge.settings', 'Settings & Configuration', 'الإعدادات والتكوين', 'wizard'),
('wizard.challenge.review', 'Review & Publish', 'مراجعة ونشر', 'wizard'),
('wizard.challenge.success', 'Challenge created successfully!', 'تم إنشاء التحدي بنجاح!', 'wizard'),

-- Challenge Management keys
('challenge_management.title', 'Challenge Management', 'إدارة التحديات', 'challenge_management'),
('challenge_management.create', 'Create Challenge', 'إنشاء تحدي', 'challenge_management'),
('challenge_management.edit', 'Edit Challenge', 'تعديل التحدي', 'challenge_management'),
('challenge_management.delete', 'Delete Challenge', 'حذف التحدي', 'challenge_management'),
('challenge_management.participants', 'Manage Participants', 'إدارة المشاركين', 'challenge_management'),
('challenge_management.submissions', 'View Submissions', 'عرض المشاركات', 'challenge_management'),

-- Common UI keys
('common.save', 'Save', 'حفظ', 'ui'),
('common.cancel', 'Cancel', 'إلغاء', 'ui'),
('common.edit', 'Edit', 'تعديل', 'ui'),
('common.delete', 'Delete', 'حذف', 'ui'),
('common.view', 'View', 'عرض', 'ui'),
('common.create', 'Create', 'إنشاء', 'ui'),
('common.update', 'Update', 'تحديث', 'ui'),
('common.remove', 'Remove', 'إزالة', 'ui'),
('common.add', 'Add', 'إضافة', 'ui'),
('common.search', 'Search', 'بحث', 'ui'),
('common.filter', 'Filter', 'تصفية', 'ui'),
('common.sort', 'Sort', 'ترتيب', 'ui'),
('common.export', 'Export', 'تصدير', 'ui'),
('common.import', 'Import', 'استيراد', 'ui'),
('common.loading', 'Loading...', 'جارٍ التحميل...', 'ui'),
('common.error', 'Error', 'خطأ', 'ui'),
('common.success', 'Success', 'نجح', 'ui'),
('common.warning', 'Warning', 'تحذير', 'ui'),
('common.info', 'Information', 'معلومات', 'ui'),
('common.confirm', 'Confirm', 'تأكيد', 'ui'),
('common.yes', 'Yes', 'نعم', 'ui'),
('common.no', 'No', 'لا', 'ui'),
('common.submit', 'Submit', 'إرسال', 'ui'),
('common.reset', 'Reset', 'إعادة تعيين', 'ui'),
('common.close', 'Close', 'إغلاق', 'ui'),
('common.open', 'Open', 'فتح', 'ui'),
('common.next', 'Next', 'التالي', 'ui'),
('common.previous', 'Previous', 'السابق', 'ui'),
('common.back', 'Back', 'رجوع', 'ui'),
('common.continue', 'Continue', 'متابعة', 'ui'),
('common.finish', 'Finish', 'إنهاء', 'ui'),
('common.skip', 'Skip', 'تخطي', 'ui'),
('common.retry', 'Retry', 'إعادة المحاولة', 'ui'),
('common.refresh', 'Refresh', 'تحديث', 'ui'),
('common.more', 'More', 'المزيد', 'ui'),
('common.less', 'Less', 'أقل', 'ui'),
('common.show', 'Show', 'إظهار', 'ui'),
('common.hide', 'Hide', 'إخفاء', 'ui'),
('common.expand', 'Expand', 'توسيع', 'ui'),
('common.collapse', 'Collapse', 'طي', 'ui'),

-- Status keys
('status.active', 'Active', 'نشط', 'status'),
('status.inactive', 'Inactive', 'غير نشط', 'status'),
('status.pending', 'Pending', 'في الانتظار', 'status'),
('status.approved', 'Approved', 'موافق عليه', 'status'),
('status.rejected', 'Rejected', 'مرفوض', 'status'),
('status.draft', 'Draft', 'مسودة', 'status'),
('status.published', 'Published', 'منشور', 'status'),
('status.archived', 'Archived', 'مؤرشف', 'status'),
('status.completed', 'Completed', 'مكتمل', 'status'),
('status.in_progress', 'In Progress', 'قيد التنفيذ', 'status'),

-- Form validation keys
('validation.required', 'This field is required', 'هذا الحقل مطلوب', 'validation'),
('validation.email.invalid', 'Please enter a valid email address', 'يرجى إدخال عنوان بريد إلكتروني صحيح', 'validation'),
('validation.password.min_length', 'Password must be at least 8 characters', 'كلمة المرور يجب أن تكون 8 أحرف على الأقل', 'validation'),
('validation.confirm_password.match', 'Passwords do not match', 'كلمات المرور غير متطابقة', 'validation'),
('validation.phone.invalid', 'Please enter a valid phone number', 'يرجى إدخال رقم هاتف صحيح', 'validation'),
('validation.date.invalid', 'Please enter a valid date', 'يرجى إدخال تاريخ صحيح', 'validation'),
('validation.number.invalid', 'Please enter a valid number', 'يرجى إدخال رقم صحيح', 'validation'),
('validation.url.invalid', 'Please enter a valid URL', 'يرجى إدخال رابط صحيح', 'validation'),

-- Navigation keys
('nav.dashboard', 'Dashboard', 'لوحة التحكم', 'navigation'),
('nav.ideas', 'Ideas', 'الأفكار', 'navigation'),
('nav.challenges', 'Challenges', 'التحديات', 'navigation'),
('nav.teams', 'Teams', 'الفرق', 'navigation'),
('nav.analytics', 'Analytics', 'التحليلات', 'navigation'),
('nav.settings', 'Settings', 'الإعدادات', 'navigation'),
('nav.profile', 'Profile', 'الملف الشخصي', 'navigation'),
('nav.logout', 'Logout', 'تسجيل خروج', 'navigation'),
('nav.login', 'Login', 'تسجيل دخول', 'navigation'),
('nav.register', 'Register', 'تسجيل', 'navigation'),

-- Date and time keys
('date.today', 'Today', 'اليوم', 'datetime'),
('date.yesterday', 'Yesterday', 'أمس', 'datetime'),
('date.tomorrow', 'Tomorrow', 'غداً', 'datetime'),
('date.this_week', 'This Week', 'هذا الأسبوع', 'datetime'),
('date.last_week', 'Last Week', 'الأسبوع الماضي', 'datetime'),
('date.this_month', 'This Month', 'هذا الشهر', 'datetime'),
('date.last_month', 'Last Month', 'الشهر الماضي', 'datetime'),
('date.this_year', 'This Year', 'هذا العام', 'datetime'),
('date.last_year', 'Last Year', 'العام الماضي', 'datetime'),

-- File and media keys
('file.upload', 'Upload File', 'رفع ملف', 'media'),
('file.download', 'Download', 'تحميل', 'media'),
('file.delete', 'Delete File', 'حذف الملف', 'media'),
('file.preview', 'Preview', 'معاينة', 'media'),
('file.size_limit', 'File size must be less than', 'حجم الملف يجب أن يكون أقل من', 'media'),
('file.format_not_supported', 'File format not supported', 'تنسيق الملف غير مدعوم', 'media'),
('file.upload_success', 'File uploaded successfully', 'تم رفع الملف بنجاح', 'media'),
('file.upload_error', 'File upload failed', 'فشل رفع الملف', 'media'),

-- Notification keys
('notification.new_idea', 'New idea submitted', 'تم إرسال فكرة جديدة', 'notifications'),
('notification.idea_approved', 'Your idea has been approved', 'تم الموافقة على فكرتك', 'notifications'),
('notification.idea_rejected', 'Your idea has been rejected', 'تم رفض فكرتك', 'notifications'),
('notification.challenge_published', 'New challenge published', 'تم نشر تحدي جديد', 'notifications'),
('notification.team_invitation', 'You have been invited to join a team', 'تم دعوتك للانضمام إلى فريق', 'notifications'),
('notification.deadline_reminder', 'Deadline reminder', 'تذكير بالموعد النهائي', 'notifications'),

-- Permission and role keys
('role.admin', 'Administrator', 'مدير', 'roles'),
('role.team_lead', 'Team Lead', 'قائد الفريق', 'roles'),
('role.member', 'Member', 'عضو', 'roles'),
('role.viewer', 'Viewer', 'مشاهد', 'roles'),
('role.evaluator', 'Evaluator', 'مقيم', 'roles'),
('permission.create', 'Create', 'إنشاء', 'permissions'),
('permission.read', 'Read', 'قراءة', 'permissions'),
('permission.update', 'Update', 'تحديث', 'permissions'),
('permission.delete', 'Delete', 'حذف', 'permissions'),
('permission.manage', 'Manage', 'إدارة', 'permissions'),

-- Error messages
('error.network', 'Network connection error', 'خطأ في الاتصال بالشبكة', 'errors'),
('error.server', 'Server error occurred', 'حدث خطأ في الخادم', 'errors'),
('error.unauthorized', 'You are not authorized to perform this action', 'غير مخول لك تنفيذ هذا الإجراء', 'errors'),
('error.not_found', 'The requested resource was not found', 'المورد المطلوب غير موجود', 'errors'),
('error.validation', 'Please check your input and try again', 'يرجى التحقق من البيانات والمحاولة مرة أخرى', 'errors'),
('error.generic', 'Something went wrong. Please try again.', 'حدث خطأ ما. يرجى المحاولة مرة أخرى.', 'errors'),

-- Success messages
('success.saved', 'Changes saved successfully', 'تم حفظ التغييرات بنجاح', 'success'),
('success.created', 'Created successfully', 'تم الإنشاء بنجاح', 'success'),
('success.updated', 'Updated successfully', 'تم التحديث بنجاح', 'success'),
('success.deleted', 'Deleted successfully', 'تم الحذف بنجاح', 'success'),
('success.sent', 'Sent successfully', 'تم الإرسال بنجاح', 'success'),
('success.uploaded', 'Uploaded successfully', 'تم الرفع بنجاح', 'success'),

-- Table and list headers
('table.name', 'Name', 'الاسم', 'table'),
('table.email', 'Email', 'البريد الإلكتروني', 'table'),
('table.role', 'Role', 'الدور', 'table'),
('table.status', 'Status', 'الحالة', 'table'),
('table.created_at', 'Created', 'تاريخ الإنشاء', 'table'),
('table.updated_at', 'Updated', 'تاريخ التحديث', 'table'),
('table.actions', 'Actions', 'الإجراءات', 'table'),
('table.no_data', 'No data available', 'لا توجد بيانات متاحة', 'table'),
('table.loading', 'Loading data...', 'جارٍ تحميل البيانات...', 'table'),

-- Pagination
('pagination.previous', 'Previous', 'السابق', 'pagination'),
('pagination.next', 'Next', 'التالي', 'pagination'),
('pagination.first', 'First', 'الأول', 'pagination'),
('pagination.last', 'Last', 'الأخير', 'pagination'),
('pagination.page', 'Page', 'صفحة', 'pagination'),
('pagination.of', 'of', 'من', 'pagination'),
('pagination.show', 'Show', 'إظهار', 'pagination'),
('pagination.items_per_page', 'items per page', 'عنصر في الصفحة', 'pagination'),

-- Search and filter
('search.placeholder', 'Search...', 'البحث...', 'search'),
('search.no_results', 'No results found', 'لم يتم العثور على نتائج', 'search'),
('search.results_count', 'results found', 'نتيجة موجودة', 'search'),
('filter.all', 'All', 'الكل', 'filter'),
('filter.clear', 'Clear Filters', 'مسح المرشحات', 'filter'),
('filter.apply', 'Apply Filters', 'تطبيق المرشحات', 'filter'),

-- Dashboard specific
('dashboard.welcome', 'Welcome back', 'مرحباً بعودتك', 'dashboard'),
('dashboard.overview', 'Overview', 'نظرة عامة', 'dashboard'),
('dashboard.recent_activities', 'Recent Activities', 'الأنشطة الأخيرة', 'dashboard'),
('dashboard.quick_actions', 'Quick Actions', 'إجراءات سريعة', 'dashboard'),
('dashboard.statistics', 'Statistics', 'الإحصائيات', 'dashboard'),

-- Settings
('settings.general', 'General Settings', 'الإعدادات العامة', 'settings'),
('settings.account', 'Account Settings', 'إعدادات الحساب', 'settings'),
('settings.notifications', 'Notification Settings', 'إعدادات الإشعارات', 'settings'),
('settings.privacy', 'Privacy Settings', 'إعدادات الخصوصية', 'settings'),
('settings.security', 'Security Settings', 'إعدادات الأمان', 'settings'),
('settings.language', 'Language', 'اللغة', 'settings'),
('settings.theme', 'Theme', 'المظهر', 'settings'),

-- Miscellaneous
('misc.empty_state', 'Nothing to see here yet', 'لا يوجد شيء هنا حتى الآن', 'misc'),
('misc.coming_soon', 'Coming Soon', 'قريباً', 'misc'),
('misc.under_maintenance', 'Under Maintenance', 'تحت الصيانة', 'misc'),
('misc.contact_support', 'Contact Support', 'اتصل بالدعم', 'misc'),
('misc.help', 'Help', 'مساعدة', 'misc'),
('misc.about', 'About', 'حول', 'misc'),
('misc.terms', 'Terms of Service', 'شروط الخدمة', 'misc'),
('misc.privacy_policy', 'Privacy Policy', 'سياسة الخصوصية', 'misc')

ON CONFLICT (translation_key) DO UPDATE SET
    text_en = EXCLUDED.text_en,
    text_ar = EXCLUDED.text_ar,
    category = EXCLUDED.category,
    updated_at = now();