-- EventsManagement Translation Keys
INSERT INTO public.system_translations (translation_key, text_en, text_ar, category) VALUES

-- Error messages  
('events.load_error_title', 'Error loading events', 'خطأ في تحميل الفعاليات', 'events'),
('events.load_error_description', 'An error occurred while loading events', 'حدث خطأ أثناء تحميل الفعاليات', 'events'),
('events.delete_success_title', 'Event deleted successfully', 'تم حذف الفعالية بنجاح', 'events'),
('events.delete_success_description', 'Event "{{title}}" deleted successfully', 'تم حذف فعالية "{{title}}" بنجاح', 'events'),
('events.delete_error_title', 'Error deleting event', 'خطأ في حذف الفعالية', 'events'),
('events.status_update_success_title', 'Event status updated', 'تم تحديث حالة الفعالية', 'events'),
('events.status_update_success_description', 'Event status changed to {{status}}', 'تم تغيير حالة الفعالية إلى {{status}}', 'events'),
('events.status_update_error_title', 'Error updating status', 'خطأ في تحديث الحالة', 'events'),

-- Status values
('status.active', 'Active', 'جاري', 'status'),
('status.scheduled', 'Scheduled', 'مجدول', 'status'),
('status.completed', 'Completed', 'مكتمل', 'status'),

-- Loading and empty states
('events.loading', 'Loading events...', 'جاري تحميل الفعاليات...', 'events'),
('events.no_events_title', 'No events', 'لا توجد فعاليات', 'events'),
('events.no_events_description', 'No events match the current search', 'لا توجد فعاليات تطابق البحث الحالي', 'events'),

-- Comments
('events.saved_successfully', 'Event saved successfully', 'تم حفظ الفعالية بنجاح', 'events')

ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = now();