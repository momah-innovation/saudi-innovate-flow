-- Add missing translation keys for /admin/users page
INSERT INTO system_translations (translation_key, text_en, text_ar, category, created_at, updated_at) VALUES
-- Sample user names
('sample_user_ahmed', 'Ahmed Al-Rashid', 'أحمد الراشد', 'users', now(), now()),
('sample_user_fatima', 'Fatima Al-Zahra', 'فاطمة الزهراء', 'users', now(), now()),
('sample_user_mohamed', 'Mohamed Al-Mansouri', 'محمد المنصوري', 'users', now(), now()),

-- Department names
('department_administration', 'Administration', 'الإدارة', 'departments', now(), now()),
('department_technology', 'Technology', 'التكنولوجيا', 'departments', now(), now()),
('department_research_development', 'Research & Development', 'البحث والتطوير', 'departments', now(), now()),

-- User management interface
('user_management_title', 'User Management', 'إدارة المستخدمين', 'users', now(), now()),
('manage_users_roles_permissions', 'Manage users, roles, and permissions', 'إدارة المستخدمين والأدوار والصلاحيات', 'users', now(), now()),
('invite_user', 'Invite User', 'دعوة مستخدم', 'users', now(), now()),
('bulk_actions', 'Bulk Actions', 'إجراءات مجمعة', 'users', now(), now()),
('search_users', 'Search users...', 'البحث في المستخدمين...', 'users', now(), now()),

-- Filter options
('filter_by_status', 'Filter by Status', 'تصفية حسب الحالة', 'filters', now(), now()),
('all_status', 'All Status', 'جميع الحالات', 'filters', now(), now()),
('filter_by_role', 'Filter by Role', 'تصفية حسب الدور', 'filters', now(), now()),
('all_roles', 'All Roles', 'جميع الأدوار', 'filters', now(), now()),

-- User categories
('active_users', 'Active Users', 'المستخدمون النشطون', 'users', now(), now()),
('pending_invitations', 'Pending Invitations', 'الدعوات المعلقة', 'users', now(), now()),
('expert_users', 'Expert Users', 'المستخدمون الخبراء', 'users', now(), now()),

-- Actions
('edit_profile', 'Edit Profile', 'تعديل الملف الشخصي', 'actions', now(), now()),
('manage_role', 'Manage Role', 'إدارة الدور', 'actions', now(), now()),
('send_invitation', 'Send Invitation', 'إرسال دعوة', 'actions', now(), now()),

-- Status messages
('never_logged_in', 'Never logged in', 'لم يسجل الدخول مطلقاً', 'status', now(), now()),
('noData', 'No data available', 'لا توجد بيانات متاحة', 'general', now(), now())

ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = now();