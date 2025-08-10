-- Add translation keys for standardized database values
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- Campaign themes
('theme.fintech', 'Financial Technology', 'التكنولوجيا المالية', 'campaigns'),
('theme.edtech', 'Education Technology', 'تكنولوجيا التعليم', 'campaigns'),
('theme.healthtech', 'Healthcare Technology', 'تكنولوجيا الرعاية الصحية', 'campaigns'),
('theme.digital_transformation', 'Digital Transformation', 'التحول الرقمي', 'campaigns'),
('theme.smart_cities', 'Smart Cities', 'المدن الذكية', 'campaigns'),
('theme.sustainability', 'Sustainability', 'الاستدامة', 'campaigns'),

-- Ideas maturity levels  
('maturity.idea', 'Idea', 'فكرة', 'ideas'),
('maturity.concept', 'Concept', 'مفهوم', 'ideas'),
('maturity.prototype', 'Prototype', 'نموذج أولي', 'ideas'),
('maturity.development', 'Development', 'تطوير', 'ideas'),
('maturity.pilot', 'Pilot', 'تجربة تطبيقية', 'ideas'),
('maturity.scaling', 'Scaling', 'توسع', 'ideas'),

-- Event types
('event_type.workshop', 'Workshop', 'ورشة عمل', 'events'),
('event_type.conference', 'Conference', 'مؤتمر', 'events'),
('event_type.summit', 'Summit', 'قمة', 'events'),
('event_type.hackathon', 'Hackathon', 'هاكاثون', 'events'),
('event_type.forum', 'Forum', 'منتدى', 'events'),
('event_type.expo', 'Expo', 'معرض', 'events'),
('event_type.training', 'Training', 'تدريب', 'events'),
('event_type.competition', 'Competition', 'مسابقة', 'events'),
('event_type.demo', 'Demo', 'عرض توضيحي', 'events'),
('event_type.masterclass', 'Masterclass', 'درس متقدم', 'events'),
('event_type.meetup', 'Meetup', 'لقاء', 'events'),
('event_type.webinar', 'Webinar', 'ندوة عبر الإنترنت', 'events'),
('event_type.brainstorm', 'Brainstorm', 'عصف ذهني', 'events'),
('event_type.seminar', 'Seminar', 'ندوة', 'events'),
('event_type.showcase', 'Showcase', 'عرض', 'events'),

-- Additional status values
('status.upcoming', 'Upcoming', 'قادم', 'general'),
('status.scheduled', 'Scheduled', 'مجدول', 'general'),
('status.ongoing', 'Ongoing', 'جاري', 'general'),
('status.postponed', 'Postponed', 'مؤجل', 'general'),
('status.submitted', 'Submitted', 'مقدم', 'general'),
('status.under_review', 'Under Review', 'قيد المراجعة', 'general'),
('status.approved', 'Approved', 'موافق عليه', 'general'),
('status.rejected', 'Rejected', 'مرفوض', 'general'),
('status.draft', 'Draft', 'مسودة', 'general');