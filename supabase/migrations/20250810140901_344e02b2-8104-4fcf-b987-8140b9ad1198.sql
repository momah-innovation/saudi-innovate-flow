-- First, drop existing check constraints and recreate them with translation keys

-- Update challenge_participants status constraint
ALTER TABLE challenge_participants DROP CONSTRAINT IF EXISTS challenge_participants_status_check;
ALTER TABLE challenge_participants ADD CONSTRAINT challenge_participants_status_check 
CHECK (status IN ('participant_status.registered', 'participant_status.confirmed', 'participant_status.cancelled', 'participant_status.completed', 'registered', 'confirmed', 'cancelled', 'completed'));

-- Update challenge_participants participation_type constraint  
ALTER TABLE challenge_participants DROP CONSTRAINT IF EXISTS challenge_participants_participation_type_check;
ALTER TABLE challenge_participants ADD CONSTRAINT challenge_participants_participation_type_check 
CHECK (participation_type IN ('participation.individual', 'participation.team', 'individual', 'team'));

-- Update challenge_submissions status constraint
ALTER TABLE challenge_submissions DROP CONSTRAINT IF EXISTS challenge_submissions_status_check;
ALTER TABLE challenge_submissions ADD CONSTRAINT challenge_submissions_status_check 
CHECK (status IN ('submission_status.draft', 'submission_status.submitted', 'submission_status.under_review', 'submission_status.approved', 'submission_status.rejected', 'draft', 'submitted', 'under_review', 'approved', 'rejected'));

-- Update event_participants status constraint
ALTER TABLE event_participants DROP CONSTRAINT IF EXISTS event_participants_status_check;
ALTER TABLE event_participants ADD CONSTRAINT event_participants_status_check 
CHECK (status IN ('registration_status.registered', 'registration_status.confirmed', 'registration_status.waitlisted', 'registration_status.attended', 'registration_status.cancelled', 'registered', 'confirmed', 'waitlisted', 'attended', 'cancelled'));

-- Update events visibility constraint
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_visibility_check;
ALTER TABLE events ADD CONSTRAINT events_visibility_check 
CHECK (visibility IN ('visibility.public', 'visibility.private', 'visibility.internal', 'visibility.restricted', 'public', 'private', 'internal', 'restricted'));

-- Update challenge_notifications notification_type constraint
ALTER TABLE challenge_notifications DROP CONSTRAINT IF EXISTS challenge_notifications_notification_type_check;
ALTER TABLE challenge_notifications ADD CONSTRAINT challenge_notifications_notification_type_check 
CHECK (notification_type IN ('notification.reminder', 'notification.update', 'notification.deadline', 'notification.result', 'reminder', 'update', 'deadline', 'result'));

-- Update event_notifications notification_type constraint
ALTER TABLE event_notifications DROP CONSTRAINT IF EXISTS event_notifications_notification_type_check;
ALTER TABLE event_notifications ADD CONSTRAINT event_notifications_notification_type_check 
CHECK (notification_type IN ('notification.registration', 'notification.cancellation', 'notification.reminder', 'notification.update', 'registration', 'cancellation', 'reminder', 'update'));

-- Update innovation_team_members constraints
ALTER TABLE innovation_team_members DROP CONSTRAINT IF EXISTS innovation_team_members_status_check;
ALTER TABLE innovation_team_members ADD CONSTRAINT innovation_team_members_status_check 
CHECK (status IN ('status.active', 'status.inactive', 'status.pending', 'status.suspended', 'active', 'inactive', 'pending', 'suspended'));

ALTER TABLE innovation_team_members DROP CONSTRAINT IF EXISTS innovation_team_members_cic_role_check;
ALTER TABLE innovation_team_members ADD CONSTRAINT innovation_team_members_cic_role_check 
CHECK (cic_role IN ('team_role.manager', 'team_role.member', 'team_role.lead', 'team_role.coordinator', 'team_role.admin', 'manager', 'member', 'lead', 'coordinator', 'admin'));