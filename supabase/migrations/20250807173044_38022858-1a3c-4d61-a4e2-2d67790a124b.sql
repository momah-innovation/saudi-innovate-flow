-- Add missing Events settings translation keys
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- Events Category
('settings.category.events.description', 'Settings for managing and configuring events', 'إعدادات إدارة وتكوين الفعاليات', 'settings'),

-- Events Settings
('settings.event_allow_waitlist.label', 'Allow Waitlist', 'السماح بقائمة الانتظار', 'settings'),
('settings.event_allow_waitlist.description', 'Allow participants to join a waitlist when event is full', 'السماح للمشاركين بالانضمام لقائمة انتظار عند امتلاء الفعالية', 'settings'),

('settings.event_categories.label', 'Event Categories', 'فئات الفعاليات', 'settings'),
('settings.event_categories.description', 'Available categories for events', 'الفئات المتاحة للفعاليات', 'settings'),

('settings.event_formats.label', 'Event Formats', 'أشكال الفعاليات', 'settings'),
('settings.event_formats.description', 'Available formats for events (virtual, in-person, hybrid)', 'الأشكال المتاحة للفعاليات (افتراضية، حضورية، مختلطة)', 'settings'),

('settings.event_max_participants.label', 'Maximum Participants', 'الحد الأقصى للمشاركين', 'settings'),
('settings.event_max_participants.description', 'Maximum number of participants allowed per event', 'الحد الأقصى لعدد المشاركين المسموح به لكل فعالية', 'settings'),

('settings.event_require_registration.label', 'Require Registration', 'تتطلب التسجيل', 'settings'),
('settings.event_require_registration.description', 'Require users to register before attending events', 'تتطلب من المستخدمين التسجيل قبل حضور الفعاليات', 'settings'),

('settings.event_status_options.label', 'Event Status Options', 'خيارات حالة الفعاليات', 'settings'),
('settings.event_status_options.description', 'Available status options for events', 'خيارات الحالة المتاحة للفعاليات', 'settings'),

('settings.event_types.label', 'Event Types', 'أنواع الفعاليات', 'settings'),
('settings.event_types.description', 'Available types of events in the system', 'أنواع الفعاليات المتاحة في النظام', 'settings'),

('settings.event_visibility_options.label', 'Event Visibility Options', 'خيارات ظهور الفعاليات', 'settings'),
('settings.event_visibility_options.description', 'Visibility levels for events (public, internal, restricted)', 'مستويات الظهور للفعاليات (عامة، داخلية، مقيدة)', 'settings')

ON CONFLICT (translation_key) 
DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();