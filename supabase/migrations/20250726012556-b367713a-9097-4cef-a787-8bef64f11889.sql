-- Add missing team roles
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'campaign_manager';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'event_manager';  
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'stakeholder_manager';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'partnership_manager';

-- Fix the notification trigger - it needs to be properly attached to the table
DROP TRIGGER IF EXISTS notify_role_request_review_trigger ON role_requests;

CREATE TRIGGER notify_role_request_review_trigger
  AFTER UPDATE ON role_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_role_request_review();

-- Also create notifications for existing role request that was rejected
INSERT INTO notifications (user_id, title, message, type, metadata)
SELECT 
  rr.requester_id,
  'Role Request Update',
  'Your request for the ' || rr.requested_role || ' role has been reviewed. Reason: ' || COALESCE(rr.reviewer_notes, 'Please contact an administrator for more information.'),
  'warning',
  jsonb_build_object(
    'role_request_id', rr.id,
    'requested_role', rr.requested_role,
    'status', rr.status
  )
FROM role_requests rr 
WHERE rr.status = 'rejected' 
AND NOT EXISTS (
  SELECT 1 FROM notifications n 
  WHERE n.metadata->>'role_request_id' = rr.id::text
);

-- Create notifications for admin users about pending role requests
INSERT INTO notifications (user_id, title, message, type, metadata)
SELECT DISTINCT
  ur.user_id,
  'New Role Request Pending Review',
  'A user has requested the ' || rr.requested_role || ' role and needs admin review.',
  'info',
  jsonb_build_object(
    'role_request_id', rr.id,
    'requested_role', rr.requested_role,
    'status', rr.status,
    'requester_id', rr.requester_id
  )
FROM role_requests rr
CROSS JOIN user_roles ur
WHERE rr.status = 'pending'
AND ur.role IN ('admin', 'super_admin', 'role_manager', 'user_manager')
AND ur.is_active = true
AND NOT EXISTS (
  SELECT 1 FROM notifications n 
  WHERE n.metadata->>'role_request_id' = rr.id::text 
  AND n.user_id = ur.user_id
);