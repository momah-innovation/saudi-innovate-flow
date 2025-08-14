-- Add missing event-related translation keys
INSERT INTO system_translations (translation_key, text_en, text_ar) VALUES
-- Events metrics
('events.metrics.total', 'Total Events', 'إجمالي الفعاليات'),
('events.metrics.trend_month', '+12% from last month', '+12% من الشهر الماضي'),
('events.metrics.active', 'Active Events', 'الفعاليات النشطة'),
('events.metrics.ongoing_now', '{{count}} ongoing now', '{{count}} جارية الآن'),
('events.metrics.participants', 'Total Participants', 'إجمالي المشاركين'),
('events.metrics.registration_rate', '+8% registration rate', '+8% معدل التسجيل'),
('events.metrics.revenue', 'Revenue', 'الإيرادات'),
('events.metrics.revenue_growth', '+15% from last month', '+15% من الشهر الماضي'),

-- Events status
('events.status.upcoming', 'Upcoming', 'قادمة'),
('events.status.scheduled', 'Scheduled', 'مجدولة'),
('events.status.ongoing', 'Ongoing', 'جارية'),
('events.status.completed', 'Completed', 'مكتملة'),
('events.status.cancelled', 'Cancelled', 'ملغية'),

-- Events general
('events.venues', 'Venues', 'أماكن الانعقاد'),
('events.need_attention', 'Need Attention', 'تحتاج اهتمام'),
('events.quick_stats', 'Quick Stats', 'إحصائيات سريعة'),
('events.status_distribution', 'Event Status Distribution', 'توزيع حالة الفعاليات'),
('events.registration', 'Registration', 'التسجيل'),
('events.attendance', 'Attendance', 'الحضور'),
('events.feedback', 'Feedback', 'التعليقات'),
('events.resources', 'Resources', 'الموارد')

ON CONFLICT (translation_key) 
DO UPDATE SET 
    text_en = EXCLUDED.text_en,
    text_ar = EXCLUDED.text_ar;