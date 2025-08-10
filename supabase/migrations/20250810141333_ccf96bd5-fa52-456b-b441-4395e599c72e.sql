-- Phase 5: Add comprehensive translation database entries
-- All status, type, and other translations for the system

INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- Core status translations
('status.draft', 'Draft', 'مسودة', 'status'),
('status.submitted', 'Submitted', 'مقدم', 'status'),
('status.under_review', 'Under Review', 'قيد المراجعة', 'status'),
('status.approved', 'Approved', 'موافق عليه', 'status'),
('status.rejected', 'Rejected', 'مرفوض', 'status'),
('status.in_development', 'In Development', 'قيد التطوير', 'status'),
('status.implemented', 'Implemented', 'منفذ', 'status'),
('status.archived', 'Archived', 'مؤرشف', 'status'),
('status.active', 'Active', 'نشط', 'status'),
('status.inactive', 'Inactive', 'غير نشط', 'status'),
('status.pending', 'Pending', 'في الانتظار', 'status'),
('status.suspended', 'Suspended', 'معلق', 'status'),
('status.planning', 'Planning', 'التخطيط', 'status'),
('status.paused', 'Paused', 'متوقف', 'status'),
('status.completed', 'Completed', 'مكتمل', 'status'),
('status.cancelled', 'Cancelled', 'ملغي', 'status'),
('status.published', 'Published', 'منشور', 'status'),
('status.registration_open', 'Registration Open', 'التسجيل مفتوح', 'status'),
('status.registration_closed', 'Registration Closed', 'التسجيل مغلق', 'status'),
('status.ongoing', 'Ongoing', 'جاري', 'status'),
('status.open', 'Open', 'مفتوح', 'status'),
('status.closed', 'Closed', 'مغلق', 'status'),

-- Challenge types
('challenge_type.innovation', 'Innovation', 'ابتكار', 'challenge_type'),
('challenge_type.improvement', 'Improvement', 'تحسين', 'challenge_type'),
('challenge_type.research', 'Research', 'بحث', 'challenge_type'),
('challenge_type.technology', 'Technology', 'تقنية', 'challenge_type'),

-- Event formats
('format.in_person', 'In Person', 'حضوري', 'format'),
('format.virtual', 'Virtual', 'افتراضي', 'format'),
('format.hybrid', 'Hybrid', 'مختلط', 'format'),

-- Visibility levels
('visibility.public', 'Public', 'عام', 'visibility'),
('visibility.private', 'Private', 'خاص', 'visibility'),
('visibility.internal', 'Internal', 'داخلي', 'visibility'),
('visibility.restricted', 'Restricted', 'مقيد', 'visibility'),

-- Opportunity types
('opportunity_type.partnership', 'Partnership', 'شراكة', 'opportunity_type'),
('opportunity_type.investment', 'Investment', 'استثمار', 'opportunity_type'),
('opportunity_type.collaboration', 'Collaboration', 'تعاون', 'opportunity_type'),
('opportunity_type.procurement', 'Procurement', 'مشتريات', 'opportunity_type'),

-- Sensitivity levels
('sensitivity.normal', 'Normal', 'عادي', 'sensitivity'),
('sensitivity.sensitive', 'Sensitive', 'حساس', 'sensitivity'),
('sensitivity.classified', 'Classified', 'سري', 'sensitivity'),

-- Team roles
('team_role.manager', 'Manager', 'مدير', 'team_role'),
('team_role.member', 'Member', 'عضو', 'team_role'),
('team_role.lead', 'Lead', 'قائد', 'team_role'),
('team_role.coordinator', 'Coordinator', 'منسق', 'team_role'),
('team_role.admin', 'Admin', 'مشرف', 'team_role'),

-- Participant statuses
('participant_status.registered', 'Registered', 'مسجل', 'participant_status'),
('participant_status.confirmed', 'Confirmed', 'مؤكد', 'participant_status'),
('participant_status.cancelled', 'Cancelled', 'ملغي', 'participant_status'),
('participant_status.completed', 'Completed', 'مكتمل', 'participant_status'),

-- Participation types
('participation.individual', 'Individual', 'فردي', 'participation'),
('participation.team', 'Team', 'فريق', 'participation'),

-- Submission statuses
('submission_status.draft', 'Draft', 'مسودة', 'submission_status'),
('submission_status.submitted', 'Submitted', 'مقدم', 'submission_status'),
('submission_status.under_review', 'Under Review', 'قيد المراجعة', 'submission_status'),
('submission_status.approved', 'Approved', 'موافق عليه', 'submission_status'),
('submission_status.rejected', 'Rejected', 'مرفوض', 'submission_status'),

-- Registration statuses
('registration_status.registered', 'Registered', 'مسجل', 'registration_status'),
('registration_status.confirmed', 'Confirmed', 'مؤكد', 'registration_status'),
('registration_status.waitlisted', 'Waitlisted', 'في قائمة الانتظار', 'registration_status'),
('registration_status.attended', 'Attended', 'حضر', 'registration_status'),
('registration_status.cancelled', 'Cancelled', 'ملغي', 'registration_status'),

-- Application statuses
('application_status.pending', 'Pending', 'في الانتظار', 'application_status'),
('application_status.approved', 'Approved', 'موافق عليه', 'application_status'),
('application_status.rejected', 'Rejected', 'مرفوض', 'application_status'),
('application_status.withdrawn', 'Withdrawn', 'مسحوب', 'application_status'),

-- Notification types
('notification.reminder', 'Reminder', 'تذكير', 'notification'),
('notification.update', 'Update', 'تحديث', 'notification'),
('notification.deadline', 'Deadline', 'موعد نهائي', 'notification'),
('notification.result', 'Result', 'نتيجة', 'notification'),
('notification.registration', 'Registration', 'تسجيل', 'notification'),
('notification.cancellation', 'Cancellation', 'إلغاء', 'notification')

ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category;