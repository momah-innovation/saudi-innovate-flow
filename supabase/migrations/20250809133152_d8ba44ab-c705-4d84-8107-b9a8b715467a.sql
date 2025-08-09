-- Add collaboration translations to system_translations table
INSERT INTO public.system_translations (translation_key, text_en, text_ar, category) VALUES
-- Common collaboration terms
('collaboration.online', 'Online', 'متصل', 'collaboration'),
('collaboration.offline', 'Offline', 'غير متصل', 'collaboration'),
('collaboration.away', 'Away', 'غائب', 'collaboration'),
('collaboration.busy', 'Busy', 'مشغول', 'collaboration'),

-- Presence
('collaboration.users_online', 'User Online', 'مستخدم متصل', 'collaboration'),
('collaboration.users_online_plural', 'Users Online', 'مستخدمون متصلون', 'collaboration'),
('collaboration.last_seen', 'Last Seen', 'آخر ظهور', 'collaboration'),
('collaboration.current_location', 'In', 'في', 'collaboration'),
('collaboration.no_users_online', 'No users online', 'لا يوجد مستخدمون متصلون', 'collaboration'),

-- Activity Feed
('collaboration.activity_feed', 'Activity Feed', 'تدفق الأنشطة', 'collaboration'),
('collaboration.new_activity', 'New Activity', 'نشاط جديد', 'collaboration'),
('collaboration.no_activities', 'No activities to show', 'لا توجد أنشطة للعرض', 'collaboration'),
('collaboration.filter_activities', 'Filter Activities', 'تصفية الأنشطة', 'collaboration'),
('collaboration.all_activities', 'All Activities', 'جميع الأنشطة', 'collaboration'),

-- Activity Types
('collaboration.activity_create', 'Create', 'إنشاء', 'collaboration'),
('collaboration.activity_update', 'Update', 'تحديث', 'collaboration'),
('collaboration.activity_delete', 'Delete', 'حذف', 'collaboration'),
('collaboration.activity_comment', 'Comment', 'تعليق', 'collaboration'),
('collaboration.activity_like', 'Like', 'إعجاب', 'collaboration'),
('collaboration.activity_share', 'Share', 'مشاركة', 'collaboration'),
('collaboration.activity_join', 'Join', 'انضمام', 'collaboration'),
('collaboration.activity_leave', 'Leave', 'مغادرة', 'collaboration'),

-- Entity Types
('collaboration.entity_challenge', 'Challenge', 'تحدي', 'collaboration'),
('collaboration.entity_idea', 'Idea', 'فكرة', 'collaboration'),
('collaboration.entity_event', 'Event', 'فعالية', 'collaboration'),
('collaboration.entity_opportunity', 'Opportunity', 'فرصة', 'collaboration'),
('collaboration.entity_campaign', 'Campaign', 'حملة', 'collaboration'),
('collaboration.entity_workspace', 'Workspace', 'مساحة عمل', 'collaboration'),
('collaboration.entity_project', 'Project', 'مشروع', 'collaboration'),

-- Messaging
('collaboration.messages', 'Messages', 'الرسائل', 'collaboration'),
('collaboration.new_message', 'New Message', 'رسالة جديدة', 'collaboration'),
('collaboration.send_message', 'Send Message', 'إرسال رسالة', 'collaboration'),
('collaboration.type_message', 'Type a message...', 'اكتب رسالة...', 'collaboration'),
('collaboration.no_messages', 'No messages yet. Start the conversation!', 'لا توجد رسائل بعد. ابدأ المحادثة!', 'collaboration'),
('collaboration.message_sent', 'Message sent', 'تم إرسال الرسالة', 'collaboration'),
('collaboration.message_failed', 'Failed to send message. Please try again', 'فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى', 'collaboration'),
('collaboration.mentioned_you', 'mentioned you', 'تم ذكرك', 'collaboration'),
('collaboration.message_edited', 'edited', 'معدل', 'collaboration'),

-- Chat Contexts
('collaboration.global_chat', 'Global Chat', 'المحادثة العامة', 'collaboration'),
('collaboration.organization_chat', 'Organization Chat', 'محادثة المؤسسة', 'collaboration'),
('collaboration.team_chat', 'Team Chat', 'محادثة الفريق', 'collaboration'),
('collaboration.project_chat', 'Project Chat', 'محادثة المشروع', 'collaboration'),
('collaboration.direct_chat', 'Direct Chat', 'محادثة مباشرة', 'collaboration'),

-- User mentions and search
('collaboration.search_users', 'Search users...', 'البحث عن المستخدمين...', 'collaboration'),
('collaboration.mention_user', 'Mention user', 'ذكر مستخدم', 'collaboration'),
('collaboration.user_not_found', 'User not found', 'المستخدم غير موجود', 'collaboration'),
('collaboration.select_user', 'Select user', 'اختر مستخدم', 'collaboration'),

-- Tags integration
('collaboration.add_tags', 'Add tags', 'إضافة علامات', 'collaboration'),
('collaboration.search_tags', 'Search tags...', 'البحث عن العلامات...', 'collaboration'),
('collaboration.tag_content', 'Tag content', 'وضع علامة على المحتوى', 'collaboration'),
('collaboration.suggested_tags', 'Suggested tags', 'علامات مقترحة', 'collaboration'),

-- Notifications
('collaboration.notifications', 'Notifications', 'الإشعارات', 'collaboration'),
('collaboration.new_notification', 'New Notification', 'إشعار جديد', 'collaboration'),
('collaboration.mark_as_read', 'Mark as Read', 'تحديد كمقروء', 'collaboration'),
('collaboration.mark_all_read', 'Mark All Read', 'قراءة الكل', 'collaboration'),
('collaboration.no_notifications', 'No notifications', 'لا توجد إشعارات', 'collaboration'),

-- Time formats
('collaboration.time_now', 'Now', 'الآن', 'collaboration'),
('collaboration.time_minutes_ago', '{{count}} minute ago', 'منذ {{count}} دقيقة', 'collaboration'),
('collaboration.time_minutes_ago_plural', '{{count}} minutes ago', 'منذ {{count}} دقائق', 'collaboration'),
('collaboration.time_hours_ago', '{{count}} hour ago', 'منذ {{count}} ساعة', 'collaboration'),
('collaboration.time_hours_ago_plural', '{{count}} hours ago', 'منذ {{count}} ساعات', 'collaboration'),
('collaboration.time_days_ago', '{{count}} day ago', 'منذ {{count}} يوم', 'collaboration'),
('collaboration.time_days_ago_plural', '{{count}} days ago', 'منذ {{count}} أيام', 'collaboration'),

-- Errors
('collaboration.connection_failed', 'Connection failed', 'فشل في الاتصال', 'collaboration'),
('collaboration.connection_poor', 'System is having trouble connecting. Please try again', 'يواجه النظام صعوبة في الاتصال. يرجى المحاولة مرة أخرى', 'collaboration'),
('collaboration.send_failed', 'Send error', 'خطأ في الإرسال', 'collaboration'),
('collaboration.authentication_required', 'Authentication required', 'مطلوب تسجيل الدخول', 'collaboration'),
('collaboration.access_denied', 'Access denied', 'تم رفض الوصول', 'collaboration'),

-- Actions
('collaboration.minimize', 'Minimize', 'تصغير', 'collaboration'),
('collaboration.maximize', 'Maximize', 'تكبير', 'collaboration'),
('collaboration.close', 'Close', 'إغلاق', 'collaboration'),
('collaboration.settings', 'Settings', 'الإعدادات', 'collaboration'),
('collaboration.filter', 'Filter', 'تصفية', 'collaboration'),
('collaboration.refresh', 'Refresh', 'تحديث', 'collaboration'),

-- Privacy Levels
('collaboration.privacy_public', 'Public', 'عام', 'collaboration'),
('collaboration.privacy_organization', 'Organization', 'المؤسسة', 'collaboration'),
('collaboration.privacy_team', 'Team', 'الفريق', 'collaboration'),
('collaboration.privacy_project', 'Project', 'المشروع', 'collaboration'),
('collaboration.privacy_private', 'Private', 'خاص', 'collaboration')
ON CONFLICT (translation_key) DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category;