-- Add missing translation keys for focus questions and other components

INSERT INTO system_translations (translation_key, text_ar, text_en, category) VALUES

-- Focus question specific translations
('focus_questions.empty_title', 'لا توجد أسئلة محورية', 'No Focus Questions', 'focus_questions'),
('focus_questions.empty_description', 'ابدأ بإنشاء سؤال محوري جديد لتوجيه المبتكرين', 'Start by creating a new focus question to guide innovators', 'focus_questions'),
('focus_questions.create_new', 'إنشاء سؤال محوري جديد', 'Create New Focus Question', 'focus_questions'),
('focus_questions.delete_success', 'تم حذف السؤال بنجاح', 'Question deleted successfully', 'focus_questions'),
('focus_questions.delete_success_description', 'تم حذف السؤال المحوري بنجاح', 'Focus question deleted successfully', 'focus_questions'),
('focus_questions.delete_error', 'خطأ في حذف السؤال', 'Error deleting question', 'focus_questions'),
('focus_questions.delete_error_description', 'فشل في حذف السؤال المحوري', 'Failed to delete focus question', 'focus_questions'),
('focus_questions.sensitivity', 'الحساسية', 'Sensitivity', 'focus_questions'),

-- General UI terms
('challenge', 'التحدي', 'Challenge', 'ui'),
('general_question', 'سؤال عام', 'General Question', 'ui'),
('linked_to_challenge', 'مرتبط بتحدي', 'Linked to Challenge', 'ui'),
('order', 'الترتيب', 'Order', 'ui'),
('creation_date', 'تاريخ الإنشاء', 'Creation Date', 'ui'),

-- Event management translations
('event_delete_success', 'تم حذف الفعالية بنجاح', 'Event deleted successfully', 'events'),
('event_delete_error', 'خطأ في حذف الفعالية', 'Error deleting event', 'events'),
('event_status_updated', 'تم تحديث حالة الفعالية', 'Event status updated', 'events'),
('event_status_error', 'خطأ في تحديث الحالة', 'Error updating status', 'events'),
('loading_events_msg', 'جاري تحميل الفعاليات...', 'Loading events...', 'events'),
('no_events_found', 'لا توجد فعاليات تطابق البحث الحالي', 'No events match current search', 'events'),

-- Stakeholder translations  
('influence_level', 'مستوى التأثير', 'Influence Level', 'stakeholders'),
('interest_level', 'مستوى الاهتمام', 'Interest Level', 'stakeholders'),
('engagement_status', 'حالة المشاركة', 'Engagement Status', 'stakeholders'),

-- Team and workspace translations
('active_tasks', 'المهام النشطة', 'Active Tasks', 'team'),
('latest_activities', 'آخر الأنشطة', 'Latest Activities', 'team'),
('quick_actions', 'إجراءات سريعة', 'Quick Actions', 'team'),
('average_capacity', 'متوسط السعة', 'Average Capacity', 'team'),

-- Form labels and placeholders
('label.start_date', 'تاريخ البداية', 'Start Date', 'form'),
('label.participants', 'المشاركون', 'Participants', 'form'),  
('label.ideas', 'الأفكار', 'Ideas', 'form'),
('label.event', 'الفعالية', 'Event', 'form'),
('placeholder.vision_2030', 'كيف يساهم هذا التحدي في تحقيق أهداف رؤية 2030؟', 'How does this challenge contribute to Vision 2030 goals?', 'form'),
('placeholder.kpi_alignment', 'مؤشرات الأداء الرئيسية المتأثرة بهذا التحدي', 'Key performance indicators affected by this challenge', 'form'),
('placeholder.collaboration_details', 'تفاصيل كيفية التعاون مع الشركاء والخبراء', 'Details on how to collaborate with partners and experts', 'form'),
('placeholder.internal_notes', 'ملاحظات داخلية للفريق (لن تظهر للمشاركين)', 'Internal team notes (will not be visible to participants)', 'form'),

-- Challenge and opportunity specific
('opportunity.create_new', 'فرصة جديدة', 'New Opportunity', 'opportunities'),
('idea.create_new', 'إضافة فكرة جديدة', 'Add New Idea', 'ideas'),
('team.create_new', 'فريق جديد', 'New Team', 'teams'),
('campaign.create_new', 'إضافة حملة جديدة', 'Add New Campaign', 'campaigns'),

-- Success and creation messages
('creation_success', 'نجح الإنشاء', 'Creation Successful', 'ui'),
('creation_success_description', 'تم إنشاء العنصر بنجاح', 'Item created successfully', 'ui'),
('addition_success', 'تم الإضافة بنجاح', 'Added Successfully', 'ui'),
('addition_success_description', 'تم إضافة العنصر بنجاح', 'Item added successfully', 'ui'),

-- Search and placeholder
('search_by_name_email', 'ابحث بالاسم أو البريد الإلكتروني...', 'Search by name or email...', 'form'),
('management_settings', 'حدد إعدادات وإدارة', 'Set settings and management', 'form')

ON CONFLICT (translation_key) DO UPDATE SET
  text_ar = EXCLUDED.text_ar,
  text_en = EXCLUDED.text_en,
  updated_at = NOW();