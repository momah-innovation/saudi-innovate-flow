-- Remove check constraints temporarily to allow migration (excluding views)
ALTER TABLE challenge_participants DROP CONSTRAINT IF EXISTS challenge_participants_status_check;
ALTER TABLE challenge_participants DROP CONSTRAINT IF EXISTS challenge_participants_participation_type_check;
ALTER TABLE challenge_submissions DROP CONSTRAINT IF EXISTS challenge_submissions_status_check;
ALTER TABLE opportunity_applications DROP CONSTRAINT IF EXISTS opportunity_applications_status_check;

-- Now run the data migration for actual tables
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
SET cic_role = CASE 
  WHEN cic_role = 'manager' THEN 'team_role.manager'
  WHEN cic_role = 'member' THEN 'team_role.member'
  WHEN cic_role = 'lead' THEN 'team_role.lead'
  WHEN cic_role = 'coordinator' THEN 'team_role.coordinator'
  WHEN cic_role = 'admin' THEN 'team_role.admin'
  ELSE cic_role
END
WHERE cic_role IN ('manager', 'member', 'lead', 'coordinator', 'admin');

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

UPDATE opportunity_applications 
SET status = CASE 
  WHEN status = 'pending' THEN 'application_status.pending'
  WHEN status = 'approved' THEN 'application_status.approved'
  WHEN status = 'rejected' THEN 'application_status.rejected'
  WHEN status = 'withdrawn' THEN 'application_status.withdrawn'
  ELSE status
END
WHERE status IN ('pending', 'approved', 'rejected', 'withdrawn');

UPDATE challenge_notifications 
SET notification_type = CASE 
  WHEN notification_type = 'reminder' THEN 'notification.reminder'
  WHEN notification_type = 'update' THEN 'notification.update'
  WHEN notification_type = 'deadline' THEN 'notification.deadline'
  WHEN notification_type = 'result' THEN 'notification.result'
  ELSE notification_type
END
WHERE notification_type IN ('reminder', 'update', 'deadline', 'result');

UPDATE event_notifications 
SET notification_type = CASE 
  WHEN notification_type = 'registration' THEN 'notification.registration'
  WHEN notification_type = 'cancellation' THEN 'notification.cancellation'
  WHEN notification_type = 'reminder' THEN 'notification.reminder'
  WHEN notification_type = 'update' THEN 'notification.update'
  ELSE notification_type
END
WHERE notification_type IN ('registration', 'cancellation', 'reminder', 'update');

-- Recreate constraints with updated values for actual tables
ALTER TABLE challenge_participants ADD CONSTRAINT challenge_participants_status_check 
CHECK (status IN ('participant_status.registered', 'participant_status.confirmed', 'participant_status.cancelled', 'participant_status.completed'));

ALTER TABLE challenge_participants ADD CONSTRAINT challenge_participants_participation_type_check 
CHECK (participation_type IN ('participation.individual', 'participation.team'));

ALTER TABLE challenge_submissions ADD CONSTRAINT challenge_submissions_status_check 
CHECK (status IN ('submission_status.draft', 'submission_status.submitted', 'submission_status.under_review', 'submission_status.approved', 'submission_status.rejected'));

ALTER TABLE opportunity_applications ADD CONSTRAINT opportunity_applications_status_check 
CHECK (status IN ('application_status.pending', 'application_status.approved', 'application_status.rejected', 'application_status.withdrawn'));