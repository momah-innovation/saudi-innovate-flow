-- Create standardized status, type, and priority translation keys
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- Status Keys
('status.draft', 'Draft', 'مسودة', 'status'),
('status.active', 'Active', 'نشط', 'status'),
('status.published', 'Published', 'منشور', 'status'),
('status.completed', 'Completed', 'مكتمل', 'status'),
('status.cancelled', 'Cancelled', 'ملغي', 'status'),
('status.archived', 'Archived', 'مؤرشف', 'status'),
('status.closed', 'Closed', 'مغلق', 'status'),
('status.planning', 'Planning', 'تخطيط', 'status'),
('status.upcoming', 'Upcoming', 'قادم', 'status'),
('status.under_review', 'Under Review', 'قيد المراجعة', 'status'),
('status.approved', 'Approved', 'موافق عليه', 'status'),
('status.rejected', 'Rejected', 'مرفوض', 'status'),
('status.submitted', 'Submitted', 'مقدم', 'status'),
('status.pending', 'Pending', 'معلق', 'status'),
('status.in_progress', 'In Progress', 'قيد التنفيذ', 'status'),
('status.on_hold', 'On Hold', 'معلق', 'status'),
('status.suspended', 'Suspended', 'معلق', 'status'),
('status.inactive', 'Inactive', 'غير نشط', 'status'),

-- Priority Keys  
('priority.low', 'Low', 'منخفض', 'priority'),
('priority.medium', 'Medium', 'متوسط', 'priority'),
('priority.high', 'High', 'عالي', 'priority'),
('priority.critical', 'Critical', 'حرج', 'priority'),
('priority.urgent', 'Urgent', 'عاجل', 'priority'),

-- Challenge Types
('challenge_type.innovation', 'Innovation', 'ابتكار', 'challenge_type'),
('challenge_type.improvement', 'Improvement', 'تحسين', 'challenge_type'),
('challenge_type.research', 'Research', 'بحث', 'challenge_type'),
('challenge_type.development', 'Development', 'تطوير', 'challenge_type'),
('challenge_type.technical', 'Technical', 'تقني', 'challenge_type'),
('challenge_type.business', 'Business', 'تجاري', 'challenge_type'),
('challenge_type.environmental', 'Environmental', 'بيئي', 'challenge_type'),
('challenge_type.health', 'Health', 'صحي', 'challenge_type'),
('challenge_type.educational', 'Educational', 'تعليمي', 'challenge_type'),
('challenge_type.social', 'Social', 'اجتماعي', 'challenge_type'),

-- Event Types
('event_type.workshop', 'Workshop', 'ورشة عمل', 'event_type'),
('event_type.seminar', 'Seminar', 'ندوة', 'event_type'),
('event_type.conference', 'Conference', 'مؤتمر', 'event_type'),
('event_type.webinar', 'Webinar', 'ندوة إلكترونية', 'event_type'),
('event_type.training', 'Training', 'تدريب', 'event_type'),
('event_type.networking', 'Networking', 'تواصل', 'event_type'),
('event_type.competition', 'Competition', 'مسابقة', 'event_type'),
('event_type.hackathon', 'Hackathon', 'هاكاثون', 'event_type'),

-- Registration Types
('registration_type.open', 'Open', 'مفتوح', 'registration_type'),
('registration_type.invitation_only', 'Invitation Only', 'بدعوة فقط', 'registration_type'),
('registration_type.application_required', 'Application Required', 'يتطلب تقديم طلب', 'registration_type'),
('registration_type.closed', 'Closed', 'مغلق', 'registration_type'),

-- Opportunity Types
('opportunity_type.job', 'Job', 'وظيفة', 'opportunity_type'),
('opportunity_type.internship', 'Internship', 'تدريب', 'opportunity_type'),
('opportunity_type.volunteer', 'Volunteer', 'تطوع', 'opportunity_type'),
('opportunity_type.partnership', 'Partnership', 'شراكة', 'opportunity_type'),
('opportunity_type.funding', 'Funding', 'تمويل', 'opportunity_type'),
('opportunity_type.mentorship', 'Mentorship', 'إرشاد', 'opportunity_type'),
('opportunity_type.research', 'Research', 'بحث', 'opportunity_type'),
('opportunity_type.consultation', 'Consultation', 'استشارة', 'opportunity_type'),

-- Sensitivity Levels
('sensitivity.normal', 'Normal', 'عادي', 'sensitivity'),
('sensitivity.confidential', 'Confidential', 'سري', 'sensitivity'),
('sensitivity.restricted', 'Restricted', 'مقيد', 'sensitivity'),
('sensitivity.public', 'Public', 'عام', 'sensitivity'),
('sensitivity.internal', 'Internal', 'داخلي', 'sensitivity'),

-- Participation Types
('participation_type.individual', 'Individual', 'فردي', 'participation_type'),
('participation_type.team', 'Team', 'فريق', 'participation_type'),
('participation_type.organization', 'Organization', 'مؤسسة', 'participation_type'),

-- Assignment Types
('assignment_type.campaign', 'Campaign', 'حملة', 'assignment_type'),
('assignment_type.challenge', 'Challenge', 'تحدي', 'assignment_type'),
('assignment_type.event', 'Event', 'فعالية', 'assignment_type'),
('assignment_type.idea', 'Idea', 'فكرة', 'assignment_type'),
('assignment_type.project', 'Project', 'مشروع', 'assignment_type'),

-- Role Types for Challenge Experts
('role_type.evaluator', 'Evaluator', 'مقيم', 'role_type'),
('role_type.advisor', 'Advisor', 'مستشار', 'role_type'),
('role_type.mentor', 'Mentor', 'موجه', 'role_type'),
('role_type.reviewer', 'Reviewer', 'مراجع', 'role_type'),
('role_type.judge', 'Judge', 'حكم', 'role_type')

ON CONFLICT (translation_key) DO UPDATE SET
text_en = EXCLUDED.text_en,
text_ar = EXCLUDED.text_ar,
category = EXCLUDED.category;