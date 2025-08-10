-- Phase 1: Complete Database Migration to Key-Based Translation System
-- Update all remaining tables to use translation keys instead of hardcoded text

-- 1. Update challenges table
UPDATE challenges 
SET 
  status = CASE status
    WHEN 'draft' THEN 'status.draft'
    WHEN 'planning' THEN 'status.planning'
    WHEN 'active' THEN 'status.active'
    WHEN 'completed' THEN 'status.completed'
    WHEN 'cancelled' THEN 'status.cancelled'
    WHEN 'paused' THEN 'status.paused'
    WHEN 'under_review' THEN 'status.under_review'
    WHEN 'approved' THEN 'status.approved'
    WHEN 'rejected' THEN 'status.rejected'
    ELSE COALESCE('status.' || status, status)
  END,
  challenge_type = CASE challenge_type
    WHEN 'innovation' THEN 'challenge_type.innovation'
    WHEN 'research' THEN 'challenge_type.research'
    WHEN 'development' THEN 'challenge_type.development'
    WHEN 'implementation' THEN 'challenge_type.implementation'
    WHEN 'optimization' THEN 'challenge_type.optimization'
    WHEN 'transformation' THEN 'challenge_type.transformation'
    ELSE COALESCE('challenge_type.' || challenge_type, challenge_type)
  END,
  priority = CASE priority
    WHEN 'high' THEN 'priority.high'
    WHEN 'medium' THEN 'priority.medium'
    WHEN 'low' THEN 'priority.low'
    WHEN 'urgent' THEN 'priority.urgent'
    WHEN 'critical' THEN 'priority.critical'
    ELSE COALESCE('priority.' || priority, priority)
  END,
  sensitivity_level = CASE sensitivity_level
    WHEN 'public' THEN 'sensitivity.public'
    WHEN 'internal' THEN 'sensitivity.internal'
    WHEN 'confidential' THEN 'sensitivity.confidential'
    WHEN 'restricted' THEN 'sensitivity.restricted'
    WHEN 'normal' THEN 'sensitivity.normal'
    ELSE COALESCE('sensitivity.' || sensitivity_level, sensitivity_level)
  END
WHERE status NOT LIKE 'status.%' 
   OR challenge_type NOT LIKE 'challenge_type.%' 
   OR priority NOT LIKE 'priority.%' 
   OR sensitivity_level NOT LIKE 'sensitivity.%';

-- 2. Update campaigns table
UPDATE campaigns 
SET 
  status = CASE status
    WHEN 'planning' THEN 'status.planning'
    WHEN 'active' THEN 'status.active'
    WHEN 'completed' THEN 'status.completed'
    WHEN 'paused' THEN 'status.paused'
    WHEN 'cancelled' THEN 'status.cancelled'
    WHEN 'draft' THEN 'status.draft'
    ELSE COALESCE('status.' || status, status)
  END,
  theme = CASE theme
    WHEN 'innovation' THEN 'theme.innovation'
    WHEN 'sustainability' THEN 'theme.sustainability'
    WHEN 'digital_transformation' THEN 'theme.digital_transformation'
    WHEN 'healthcare' THEN 'theme.healthcare'
    WHEN 'education' THEN 'theme.education'
    WHEN 'environment' THEN 'theme.environment'
    ELSE COALESCE('theme.' || theme, theme)
  END
WHERE status NOT LIKE 'status.%' OR theme NOT LIKE 'theme.%';

-- 3. Update ideas table
UPDATE ideas 
SET 
  status = CASE status
    WHEN 'draft' THEN 'status.draft'
    WHEN 'submitted' THEN 'status.submitted'
    WHEN 'under_review' THEN 'status.under_review'
    WHEN 'approved' THEN 'status.approved'
    WHEN 'rejected' THEN 'status.rejected'
    WHEN 'in_development' THEN 'status.in_development'
    WHEN 'implemented' THEN 'status.implemented'
    WHEN 'archived' THEN 'status.archived'
    ELSE COALESCE('status.' || status, status)
  END,
  priority = CASE priority
    WHEN 'high' THEN 'priority.high'
    WHEN 'medium' THEN 'priority.medium'
    WHEN 'low' THEN 'priority.low'
    WHEN 'urgent' THEN 'priority.urgent'
    WHEN 'critical' THEN 'priority.critical'
    ELSE COALESCE('priority.' || priority, priority)
  END
WHERE status NOT LIKE 'status.%' OR priority NOT LIKE 'priority.%';

-- 4. Update events table
UPDATE events 
SET 
  status = CASE status
    WHEN 'draft' THEN 'status.draft'
    WHEN 'scheduled' THEN 'status.scheduled'
    WHEN 'live' THEN 'status.live'
    WHEN 'completed' THEN 'status.completed'
    WHEN 'cancelled' THEN 'status.cancelled'
    WHEN 'postponed' THEN 'status.postponed'
    ELSE COALESCE('status.' || status, status)
  END,
  format = CASE format
    WHEN 'in_person' THEN 'format.in_person'
    WHEN 'virtual' THEN 'format.virtual'
    WHEN 'hybrid' THEN 'format.hybrid'
    ELSE COALESCE('format.' || format, format)
  END,
  visibility = CASE visibility
    WHEN 'public' THEN 'visibility.public'
    WHEN 'internal' THEN 'visibility.internal'
    WHEN 'restricted' THEN 'visibility.restricted'
    ELSE COALESCE('visibility.' || visibility, visibility)
  END
WHERE status NOT LIKE 'status.%' OR format NOT LIKE 'format.%' OR visibility NOT LIKE 'visibility.%';

-- 5. Update opportunities table
UPDATE opportunities 
SET 
  status = CASE status
    WHEN 'open' THEN 'status.open'
    WHEN 'closed' THEN 'status.closed'
    WHEN 'paused' THEN 'status.paused'
    WHEN 'draft' THEN 'status.draft'
    WHEN 'under_review' THEN 'status.under_review'
    ELSE COALESCE('status.' || status, status)
  END,
  opportunity_type = CASE opportunity_type
    WHEN 'funding' THEN 'opportunity_type.funding'
    WHEN 'partnership' THEN 'opportunity_type.partnership'
    WHEN 'mentorship' THEN 'opportunity_type.mentorship'
    WHEN 'training' THEN 'opportunity_type.training'
    WHEN 'collaboration' THEN 'opportunity_type.collaboration'
    ELSE COALESCE('opportunity_type.' || opportunity_type, opportunity_type)
  END
WHERE status NOT LIKE 'status.%' OR opportunity_type NOT LIKE 'opportunity_type.%';

-- 6. Update challenge_participants table
UPDATE challenge_participants 
SET 
  status = CASE status
    WHEN 'registered' THEN 'status.registered'
    WHEN 'confirmed' THEN 'status.confirmed'
    WHEN 'cancelled' THEN 'status.cancelled'
    WHEN 'completed' THEN 'status.completed'
    WHEN 'withdrawn' THEN 'status.withdrawn'
    ELSE COALESCE('status.' || status, status)
  END,
  participation_type = CASE participation_type
    WHEN 'individual' THEN 'participation_type.individual'
    WHEN 'team' THEN 'participation_type.team'
    WHEN 'organization' THEN 'participation_type.organization'
    ELSE COALESCE('participation_type.' || participation_type, participation_type)
  END
WHERE status NOT LIKE 'status.%' OR participation_type NOT LIKE 'participation_type.%';

-- 7. Update challenge_submissions table
UPDATE challenge_submissions 
SET 
  status = CASE status
    WHEN 'draft' THEN 'status.draft'
    WHEN 'submitted' THEN 'status.submitted'
    WHEN 'under_review' THEN 'status.under_review'
    WHEN 'approved' THEN 'status.approved'
    WHEN 'rejected' THEN 'status.rejected'
    WHEN 'finalist' THEN 'status.finalist'
    WHEN 'winner' THEN 'status.winner'
    ELSE COALESCE('status.' || status, status)
  END
WHERE status NOT LIKE 'status.%';

-- 8. Update bookmark tables priority fields
UPDATE challenge_bookmarks 
SET priority = CASE priority
  WHEN 'high' THEN 'priority.high'
  WHEN 'medium' THEN 'priority.medium'
  WHEN 'low' THEN 'priority.low'
  WHEN 'urgent' THEN 'priority.urgent'
  ELSE COALESCE('priority.' || priority, priority)
END
WHERE priority NOT LIKE 'priority.%';

UPDATE campaign_bookmarks 
SET priority = CASE priority
  WHEN 'high' THEN 'priority.high'
  WHEN 'medium' THEN 'priority.medium'
  WHEN 'low' THEN 'priority.low'
  WHEN 'urgent' THEN 'priority.urgent'
  ELSE COALESCE('priority.' || priority, priority)
END
WHERE priority NOT LIKE 'priority.%';

UPDATE event_bookmarks 
SET priority = CASE priority
  WHEN 'high' THEN 'priority.high'
  WHEN 'medium' THEN 'priority.medium'
  WHEN 'low' THEN 'priority.low'
  WHEN 'urgent' THEN 'priority.urgent'
  ELSE COALESCE('priority.' || priority, priority)
END
WHERE priority NOT LIKE 'priority.%';

-- 9. Update partners table
UPDATE partners 
SET 
  status = CASE status
    WHEN 'active' THEN 'status.active'
    WHEN 'inactive' THEN 'status.inactive'
    WHEN 'pending' THEN 'status.pending'
    WHEN 'suspended' THEN 'status.suspended'
    ELSE COALESCE('status.' || status, status)
  END,
  partnership_type = CASE partnership_type
    WHEN 'strategic' THEN 'partnership_type.strategic'
    WHEN 'funding' THEN 'partnership_type.funding'
    WHEN 'technical' THEN 'partnership_type.technical'
    WHEN 'academic' THEN 'partnership_type.academic'
    WHEN 'government' THEN 'partnership_type.government'
    ELSE COALESCE('partnership_type.' || partnership_type, partnership_type)
  END
WHERE status NOT LIKE 'status.%' OR partnership_type NOT LIKE 'partnership_type.%';

-- 10. Update team assignments
UPDATE team_assignments 
SET 
  status = CASE status
    WHEN 'active' THEN 'status.active'
    WHEN 'completed' THEN 'status.completed'
    WHEN 'paused' THEN 'status.paused'
    WHEN 'cancelled' THEN 'status.cancelled'
    ELSE COALESCE('status.' || status, status)
  END,
  assignment_type = CASE assignment_type
    WHEN 'challenge' THEN 'assignment_type.challenge'
    WHEN 'campaign' THEN 'assignment_type.campaign'
    WHEN 'event' THEN 'assignment_type.event'
    WHEN 'idea' THEN 'assignment_type.idea'
    WHEN 'opportunity' THEN 'assignment_type.opportunity'
    ELSE COALESCE('assignment_type.' || assignment_type, assignment_type)
  END,
  role_in_assignment = CASE role_in_assignment
    WHEN 'manager' THEN 'role.manager'
    WHEN 'contributor' THEN 'role.contributor'
    WHEN 'reviewer' THEN 'role.reviewer'
    WHEN 'coordinator' THEN 'role.coordinator'
    ELSE COALESCE('role.' || role_in_assignment, role_in_assignment)
  END
WHERE status NOT LIKE 'status.%' 
   OR assignment_type NOT LIKE 'assignment_type.%' 
   OR role_in_assignment NOT LIKE 'role.%';

-- Log the migration progress
INSERT INTO public.system_audit_log (
  user_id, action_type, resource_type, details, risk_level
) VALUES (
  auth.uid(), 'DATABASE_MIGRATION', 'translation_system', 
  jsonb_build_object(
    'migration_type', 'key_based_translation_system',
    'tables_updated', ARRAY[
      'challenges', 'campaigns', 'ideas', 'events', 'opportunities',
      'challenge_participants', 'challenge_submissions', 'partners',
      'team_assignments', 'challenge_bookmarks', 'campaign_bookmarks', 'event_bookmarks'
    ],
    'fields_migrated', ARRAY[
      'status', 'priority', 'challenge_type', 'sensitivity_level', 'theme',
      'format', 'visibility', 'opportunity_type', 'participation_type',
      'partnership_type', 'assignment_type', 'role_in_assignment'
    ],
    'migration_completed_at', NOW()
  ), 'medium'
);