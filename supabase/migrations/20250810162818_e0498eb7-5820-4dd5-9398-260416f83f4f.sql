-- Migration for AdminUserManagement translation keys
-- Adding comprehensive translation keys for user management interface

INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- User management interface
('user_management_title', 'User Management', 'إدارة المستخدمين', 'admin'),
('manage_users_roles_permissions', 'Manage users, roles and permissions', 'إدارة المستخدمين والأدوار والصلاحيات', 'admin'),
('invite_user', 'Invite User', 'دعوة مستخدم', 'admin'),
('bulk_actions', 'Bulk Actions', 'العمليات المجمعة', 'admin'),
('search_users', 'Search users...', 'البحث في المستخدمين...', 'admin'),

-- Filter options
('filter_by_status', 'Filter by Status', 'تصفية حسب الحالة', 'admin'),
('filter_by_role', 'Filter by Role', 'تصفية حسب الدور', 'admin'),
('all_status', 'All Status', 'جميع الحالات', 'admin'),
('all_roles', 'All Roles', 'جميع الأدوار', 'admin'),

-- Stats cards
('total_users', 'Total Users', 'إجمالي المستخدمين', 'admin'),
('active_users', 'Active Users', 'المستخدمين النشطين', 'admin'),
('pending_invitations', 'Pending Invitations', 'الدعوات المعلقة', 'admin'),
('expert_users', 'Expert Users', 'المستخدمين الخبراء', 'admin'),
('from_last_month', 'from last month', 'من الشهر الماضي', 'admin'),

-- User table columns and data
('users', 'Users', 'المستخدمين', 'admin'),
('name', 'Name', 'الاسم', 'admin'),
('email', 'Email', 'البريد الإلكتروني', 'admin'),
('role', 'Role', 'الدور', 'admin'),
('department', 'Department', 'القسم', 'admin'),
('status', 'Status', 'الحالة', 'admin'),
('last_login', 'Last Login', 'آخر تسجيل دخول', 'admin'),
('never_logged_in', 'Never logged in', 'لم يسجل دخول مطلقاً', 'admin'),

-- User roles
('admin', 'Admin', 'مدير', 'admin'),
('expert', 'Expert', 'خبير', 'admin'),
('innovator', 'Innovator', 'مبتكر', 'admin'),

-- User status
('active', 'Active', 'نشط', 'admin'),
('inactive', 'Inactive', 'غير نشط', 'admin'),
('pending', 'Pending', 'معلق', 'admin'),

-- User actions
('edit_profile', 'Edit Profile', 'تعديل الملف الشخصي', 'admin'),
('manage_role', 'Manage Role', 'إدارة الدور', 'admin'),
('send_invitation', 'Send Invitation', 'إرسال دعوة', 'admin'),

-- User management sample data (for department names)
('department_administration', 'Administration', 'الإدارة', 'admin'),
('department_technology', 'Technology', 'التقنية', 'admin'),
('department_research_development', 'Research & Development', 'البحث والتطوير', 'admin'),

-- Sample user names (for testing - can be removed in production)
('sample_user_ahmed', 'Ahmed Mohamed', 'أحمد محمد', 'admin'),
('sample_user_fatima', 'Fatima Ali', 'فاطمة علي', 'admin'),
('sample_user_mohamed', 'Mohamed Salem', 'محمد سالم', 'admin');