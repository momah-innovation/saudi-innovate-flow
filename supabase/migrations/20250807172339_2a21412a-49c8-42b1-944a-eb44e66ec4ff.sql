-- Add final Ideas settings translation keys (Part 4)
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- Sorting and Status
('settings.idea_sort_default.label', 'Default Sort Order', 'ترتيب العرض الافتراضي', 'settings'),
('settings.idea_sort_default.description', 'Default sorting order for displaying ideas', 'ترتيب العرض الافتراضي لعرض الأفكار', 'settings'),

('settings.idea_status_options.label', 'Idea Status Options', 'خيارات حالة الأفكار', 'settings'),
('settings.idea_status_options.description', 'Available status options for ideas', 'خيارات الحالة المتاحة للأفكار', 'settings'),

-- Idea Types  
('settings.idea_types.label', 'Idea Types', 'أنواع الأفكار', 'settings'),
('settings.idea_types.description', 'Available types of ideas in the system', 'أنواع الأفكار المتاحة في النظام', 'settings'),

-- Version Tracking
('settings.idea_version_tracking_enabled.label', 'Enable Version Tracking', 'تفعيل تتبع الإصدارات', 'settings'),
('settings.idea_version_tracking_enabled.description', 'Track versions and changes to ideas', 'تتبع الإصدارات والتغييرات في الأفكار', 'settings'),

-- Workflow Notifications
('settings.idea_workflow_notifications_enabled.label', 'Enable Workflow Notifications', 'تفعيل إشعارات سير العمل', 'settings'),
('settings.idea_workflow_notifications_enabled.description', 'Send notifications for workflow status changes', 'إرسال إشعارات لتغييرات حالة سير العمل', 'settings')

ON CONFLICT (translation_key) 
DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();