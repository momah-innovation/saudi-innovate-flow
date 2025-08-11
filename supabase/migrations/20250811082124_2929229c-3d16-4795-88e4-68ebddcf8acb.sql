-- Add missing breadcrumb navigation translation keys
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
('challenges', 'Challenges', 'التحديات', 'navigation'),
('ideas', 'Ideas', 'الأفكار', 'navigation'),
('events', 'Events', 'الفعاليات', 'navigation'),
('opportunities', 'Opportunities', 'الفرص', 'navigation'),
('workspace', 'Workspace', 'مساحة العمل', 'navigation'),
('profile', 'Profile', 'الملف الشخصي', 'navigation'),
('challenge_details', 'Challenge Details', 'تفاصيل التحدي', 'navigation'),
('idea_details', 'Idea Details', 'تفاصيل الفكرة', 'navigation'),
('event_details', 'Event Details', 'تفاصيل الفعالية', 'navigation'),
('workspace_details', 'Workspace Details', 'تفاصيل مساحة العمل', 'navigation'),
('more', 'More', 'المزيد', 'navigation')
ON CONFLICT (translation_key) DO NOTHING;