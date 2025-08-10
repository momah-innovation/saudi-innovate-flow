-- Phase 1: Complete Database Migration for Remaining Tables
-- Update user roles, team members, and participation-related fields

-- Update innovation_team_members status and role fields
UPDATE innovation_team_members 
SET status = CASE 
  WHEN status = 'active' THEN 'status.active'
  WHEN status = 'inactive' THEN 'status.inactive'
  WHEN status = 'pending' THEN 'status.pending'
  WHEN status = 'suspended' THEN 'status.suspended'
  ELSE status
END
WHERE status IN ('active', 'inactive', 'pending', 'suspended');

UPDATE innovation_team_members 
SET role = CASE 
  WHEN role = 'manager' THEN 'team_role.manager'
  WHEN role = 'member' THEN 'team_role.member'
  WHEN role = 'lead' THEN 'team_role.lead'
  WHEN role = 'coordinator' THEN 'team_role.coordinator'
  ELSE role
END
WHERE role IN ('manager', 'member', 'lead', 'coordinator');

-- Update challenge participants
UPDATE challenge_participants 
SET status = CASE 
  WHEN status = 'registered' THEN 'participant_status.registered'
  WHEN status = 'confirmed' THEN 'participant_status.confirmed'
  WHEN status = 'cancelled' THEN 'participant_status.cancelled'
  WHEN status = 'completed' THEN 'participant_status.completed'
  ELSE status
END
WHERE status IN ('registered', 'confirmed', 'cancelled', 'completed');

UPDATE challenge_participants 
SET participation_type = CASE 
  WHEN participation_type = 'individual' THEN 'participation.individual'
  WHEN participation_type = 'team' THEN 'participation.team'
  ELSE participation_type
END
WHERE participation_type IN ('individual', 'team');

-- Update challenge submissions
UPDATE challenge_submissions 
SET status = CASE 
  WHEN status = 'draft' THEN 'submission_status.draft'
  WHEN status = 'submitted' THEN 'submission_status.submitted'
  WHEN status = 'under_review' THEN 'submission_status.under_review'
  WHEN status = 'approved' THEN 'submission_status.approved'
  WHEN status = 'rejected' THEN 'submission_status.rejected'
  ELSE status
END
WHERE status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected');

-- Update event participants
UPDATE event_participants 
SET status = CASE 
  WHEN status = 'registered' THEN 'registration_status.registered'
  WHEN status = 'confirmed' THEN 'registration_status.confirmed'
  WHEN status = 'waitlisted' THEN 'registration_status.waitlisted'
  WHEN status = 'attended' THEN 'registration_status.attended'
  WHEN status = 'cancelled' THEN 'registration_status.cancelled'
  ELSE status
END
WHERE status IN ('registered', 'confirmed', 'waitlisted', 'attended', 'cancelled');

-- Update events visibility if not already handled
UPDATE events 
SET visibility = CASE 
  WHEN visibility = 'public' THEN 'visibility.public'
  WHEN visibility = 'private' THEN 'visibility.private'
  WHEN visibility = 'internal' THEN 'visibility.internal'
  WHEN visibility = 'restricted' THEN 'visibility.restricted'
  ELSE visibility
END
WHERE visibility IN ('public', 'private', 'internal', 'restricted');

-- Update notification types in challenge_notifications
UPDATE challenge_notifications 
SET notification_type = CASE 
  WHEN notification_type = 'reminder' THEN 'notification.reminder'
  WHEN notification_type = 'update' THEN 'notification.update'
  WHEN notification_type = 'deadline' THEN 'notification.deadline'
  WHEN notification_type = 'result' THEN 'notification.result'
  ELSE notification_type
END
WHERE notification_type IN ('reminder', 'update', 'deadline', 'result');

-- Update notification types in event_notifications
UPDATE event_notifications 
SET notification_type = CASE 
  WHEN notification_type = 'registration' THEN 'notification.registration'
  WHEN notification_type = 'cancellation' THEN 'notification.cancellation'
  WHEN notification_type = 'reminder' THEN 'notification.reminder'
  WHEN notification_type = 'update' THEN 'notification.update'
  ELSE notification_type
END
WHERE notification_type IN ('registration', 'cancellation', 'reminder', 'update');