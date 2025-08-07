-- Add missing basic translation keys that are heavily used throughout the codebase

-- Basic common keys
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('description', 'Description', 'الوصف', 'general'),
('status', 'Status', 'الحالة', 'general'),
('priority', 'Priority', 'الأولوية', 'general'),
('collaboration_details', 'Collaboration Details', 'تفاصيل التعاون', 'general'),
('total_users', 'Total Users', 'إجمالي المستخدمين', 'dashboard'),
('system_health', 'System Health', 'صحة النظام', 'dashboard'),
('storage_usage', 'Storage Usage', 'استخدام التخزين', 'dashboard'),
('security_status', 'Security Status', 'حالة الأمان', 'dashboard'),
('secure', 'Secure', 'آمن', 'general'),
('action_required', 'Action Required', 'مطلوب إجراء', 'general'),
('vision_2030_goal', 'Vision 2030 Goal', 'هدف رؤية 2030', 'challenge'),

-- Dashboard specific keys
('active_users_count', 'Active Users', 'المستخدمون النشطون', 'dashboard'),
('uptime_this_month', 'Uptime This Month', 'وقت التشغيل هذا الشهر', 'dashboard'),
('active_policies_count', 'Active Policies', 'السياسات النشطة', 'dashboard'),
('alerts_count', 'Alerts', 'التنبيهات', 'dashboard'),
('pending_updates_count', 'Pending Updates', 'التحديثات المعلقة', 'dashboard'),

-- Evaluation specific keys
('total_evaluations', 'Total Evaluations', 'إجمالي التقييمات', 'evaluation'),
('from_last_month', 'From Last Month', 'من الشهر الماضي', 'evaluation'),
('pending_reviews', 'Pending Reviews', 'المراجعات المعلقة', 'evaluation'),
('awaiting_expert_review', 'Awaiting Expert Review', 'في انتظار مراجعة الخبير', 'evaluation'),
('average_score', 'Average Score', 'المتوسط', 'evaluation'),
('quality_benchmark', 'Quality Benchmark', 'معيار الجودة', 'evaluation'),
('active_evaluators', 'Active Evaluators', 'المقيمون النشطون', 'evaluation'),
('expert_reviewers', 'Expert Reviewers', 'المراجعون الخبراء', 'evaluation'),
('evaluation_performance', 'Evaluation Performance', 'أداء التقييم', 'evaluation'),
('completed', 'Completed', 'مكتمل', 'general'),
('review_status', 'Review Status', 'حالة المراجعة', 'evaluation'),
('critical_issues', 'Critical Issues', 'المشاكل الحرجة', 'evaluation'),
('completion_rate', 'Completion Rate', 'معدل الإنجاز', 'evaluation'),

-- Relationship/Network keys
('total_connections', 'Total Connections', 'إجمالي الاتصالات', 'network'),
('from_last_week', 'From Last Week', 'من الأسبوع الماضي', 'network'),
('active_nodes', 'Active Nodes', 'العقد النشطة', 'network'),
('connected_entities', 'Connected Entities', 'الكيانات المتصلة', 'network'),
('network_density', 'Network Density', 'كثافة الشبكة', 'network'),
('connection_strength', 'Connection Strength', 'قوة الاتصال', 'network'),
('network_health', 'Network Health', 'صحة الشبكة', 'network'),
('overall_connectivity', 'Overall Connectivity', 'الاتصال العام', 'network'),
('connection_analysis', 'Connection Analysis', 'تحليل الاتصالات', 'network'),
('strong_links', 'Strong Links', 'الروابط القوية', 'network'),
('weak_links', 'Weak Links', 'الروابط الضعيفة', 'network'),
('network_status', 'Network Status', 'حالة الشبكة', 'network'),
('orphaned_entities', 'Orphaned Entities', 'الكيانات المنعزلة', 'network'),
('last_updated', 'Last Updated', 'آخر تحديث', 'general'),

-- Assignment specific keys
('error', 'Error', 'خطأ', 'general'),
('failedToFetchData', 'Failed to fetch data', 'فشل في جلب البيانات', 'general'),
('notSpecified', 'Not Specified', 'غير محدد', 'general'),
('role', 'Role', 'الدور', 'general'),
('basicInformation', 'Basic Information', 'المعلومات الأساسية', 'general'),
('type', 'Type', 'النوع', 'general'),
('assignedRole', 'Assigned Role', 'الدور المخصص', 'assignment'),
('assignmentStatus', 'Assignment Status', 'حالة المهمة', 'assignment'),
('timeline', 'Timeline', 'الجدول الزمني', 'general'),
('assignmentStart', 'Assignment Start', 'بداية المهمة', 'assignment'),
('assignmentEnd', 'Assignment End', 'نهاية المهمة', 'assignment'),
('projectStart', 'Project Start', 'بداية المشروع', 'project'),
('projectEnd', 'Project End', 'نهاية المشروع', 'project'),
('budget', 'Budget', 'الميزانية', 'general'),
('estimatedBudget', 'Estimated Budget', 'الميزانية المقدرة', 'budget'),
('actualBudget', 'Actual Budget', 'الميزانية الفعلية', 'budget'),
('notes', 'Notes', 'الملاحظات', 'general'),
('assignmentNotes', 'Assignment Notes', 'ملاحظات المهمة', 'assignment'),
('viewFullDetails', 'View Full Details', 'عرض التفاصيل الكاملة', 'general'),

-- Bulk operations
('all_avatars_updated_successfully', 'All avatars updated successfully', 'تم تحديث جميع الصور الشخصية بنجاح', 'user'),
('avatars_update_partial_success', 'Some avatars were updated successfully', 'تم تحديث بعض الصور الشخصية بنجاح', 'user')

ON CONFLICT (translation_key) DO NOTHING;