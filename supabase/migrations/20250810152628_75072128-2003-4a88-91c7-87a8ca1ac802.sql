-- Fix remaining Arabic values in events table
UPDATE events SET 
  status = CASE status
    WHEN 'مجدول' THEN 'status.scheduled'
    WHEN 'جاري' THEN 'status.ongoing'  
    WHEN 'مؤجل' THEN 'status.postponed'
    WHEN 'مكتمل' THEN 'status.completed'
    WHEN 'ملغي' THEN 'status.cancelled'
    ELSE status
  END
WHERE status SIMILAR TO '%[^\x00-\x7F]%';

-- Add missing translation keys for events
INSERT INTO system_translations (translation_key, text_ar, text_en, category) VALUES
('status.scheduled', 'مجدول', 'Scheduled', 'status'),
('status.ongoing', 'جاري', 'Ongoing', 'status'),
('status.postponed', 'مؤجل', 'Postponed', 'status'),

-- Add more common translations found in components
('management.create', 'إنشاء وإدارة', 'Create and Manage', 'management'),
('management.start_creating', 'ابدأ بإنشاء', 'Start by creating', 'management'),
('confirm_delete', 'هل أنت متأكد من حذف', 'Are you sure you want to delete', 'ui'),
('choose_manager', 'اختر مدير', 'Choose manager', 'form'),
('search_manager', 'ابحث عن مدير...', 'Search for manager...', 'form'),
('search_partner', 'ابحث عن شريك...', 'Search for partner...', 'form'),
('search_stakeholder', 'ابحث عن صاحب مصلحة...', 'Search for stakeholder...', 'form'),
('updating', 'تحديث', 'Updating', 'ui'),
('creating', 'إنشاء', 'Creating', 'ui'),
('active_projects', 'المشاريع النشطة', 'Active Projects', 'ui'),
('recent_activities', 'الأنشطة الحديثة', 'Recent Activities', 'ui'),
('active_members', 'الأعضاء النشطون', 'Active Members', 'ui'),
('no_recent_activities', 'لا توجد أنشطة حديثة', 'No recent activities', 'ui'),
('loading_events', 'جاري تحميل الفعاليات...', 'Loading events...', 'ui'),
('no_events', 'لا توجد فعاليات', 'No events', 'ui'),
('no_events_match', 'لا توجد فعاليات تطابق البحث الحالي', 'No events match current search', 'ui'),

-- Sensitivity and priority level translations
('sensitivity.label', 'الحساسية', 'Sensitivity', 'form'),
('priority.label', 'الأولوية', 'Priority', 'form'),
('level.high', 'عالي', 'High', 'level'),
('level.medium', 'متوسط', 'Medium', 'level'),
('level.low', 'منخفض', 'Low', 'level'),
('level.urgent', 'عاجل', 'Urgent', 'level'),
('level.normal', 'عادي', 'Normal', 'level'),
('level.sensitive', 'حساس', 'Sensitive', 'level'),
('level.classified', 'سري', 'Classified', 'level'),

-- Status variations
('status.inactive', 'غير نشط', 'Inactive', 'status'),
('status.archived', 'مؤرشف', 'Archived', 'status'),
('status.published', 'منشور', 'Published', 'status'),
('status.closed', 'مغلق', 'Closed', 'status'),

-- Form placeholders and labels
('placeholder.enter_success_metrics', 'أدخل مقاييس النجاح والمؤشرات المطلوب تحقيقها', 'Enter success metrics and required indicators', 'form'),
('placeholder.enter_budget', 'أدخل ميزانية الحملة', 'Enter campaign budget', 'form'),
('placeholder.choose_main_sector', 'اختر القطاع الرئيسي', 'Choose main sector', 'form'),
('placeholder.choose_main_agency', 'اختر الوكالة الرئيسية', 'Choose main agency', 'form'),
('placeholder.choose_main_department', 'اختر الإدارة الرئيسية', 'Choose main department', 'form'),
('placeholder.choose_main_challenge', 'اختر التحدي الرئيسي', 'Choose main challenge', 'form'),
('placeholder.choose_event', 'اختر الفعالية', 'Choose event', 'form'),
('without_event', 'بدون فعالية', 'Without event', 'form')

ON CONFLICT (translation_key) DO UPDATE SET
  text_ar = EXCLUDED.text_ar,
  text_en = EXCLUDED.text_en,
  updated_at = NOW();