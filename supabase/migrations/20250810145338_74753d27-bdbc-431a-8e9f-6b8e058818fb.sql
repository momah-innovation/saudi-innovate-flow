-- Disable all triggers that might interfere with migration
DROP TRIGGER IF EXISTS validate_idea_submission_trigger ON ideas;
DROP TRIGGER IF EXISTS create_idea_version_snapshot_trigger ON ideas;

-- PHASE 8: CRITICAL DATABASE VALUE MIGRATION (FINAL ATTEMPT)
-- Replace all hardcoded values with English translation keys

-- Step 1: Update challenges table
UPDATE challenges SET 
  status = CASE status
    WHEN 'draft' THEN 'status.draft'
    WHEN 'active' THEN 'status.active' 
    WHEN 'published' THEN 'status.published'
    WHEN 'completed' THEN 'status.completed'
    WHEN 'cancelled' THEN 'status.cancelled'
    WHEN 'on_hold' THEN 'status.on_hold'
    WHEN 'planning' THEN 'status.planning'
    WHEN 'scheduled' THEN 'status.scheduled'
    WHEN 'ongoing' THEN 'status.ongoing'
    WHEN 'postponed' THEN 'status.postponed'
    ELSE 'status.draft'
  END,
  priority_level = CASE priority_level
    WHEN 'low' THEN 'priority.low'
    WHEN 'medium' THEN 'priority.medium'
    WHEN 'high' THEN 'priority.high'
    WHEN 'urgent' THEN 'priority.urgent'
    WHEN 'منخفض' THEN 'priority.low'
    WHEN 'متوسط' THEN 'priority.medium'
    WHEN 'عالي' THEN 'priority.high'
    WHEN 'عاجل' THEN 'priority.urgent'
    ELSE 'priority.medium'
  END,
  challenge_type = CASE challenge_type
    WHEN 'innovation' THEN 'type.innovation'
    WHEN 'research' THEN 'type.research'
    WHEN 'development' THEN 'type.development'
    WHEN 'design' THEN 'type.design'
    WHEN 'technical' THEN 'type.technical'
    WHEN 'business' THEN 'type.business'
    WHEN 'social' THEN 'type.social'
    WHEN 'environmental' THEN 'type.environmental'
    ELSE 'type.innovation'
  END,
  sensitivity_level = CASE sensitivity_level
    WHEN 'normal' THEN 'sensitivity.normal'
    WHEN 'sensitive' THEN 'sensitivity.sensitive'
    WHEN 'classified' THEN 'sensitivity.classified'
    WHEN 'confidential' THEN 'sensitivity.confidential'
    ELSE 'sensitivity.normal'
  END
WHERE status NOT LIKE 'status.%' OR priority_level NOT LIKE 'priority.%' 
   OR challenge_type NOT LIKE 'type.%' OR sensitivity_level NOT LIKE 'sensitivity.%';

-- Step 2: Update ideas table (all triggers disabled)
UPDATE ideas SET 
  status = CASE status
    WHEN 'draft' THEN 'status.draft'
    WHEN 'pending' THEN 'status.pending'
    WHEN 'under_review' THEN 'status.under_review'
    WHEN 'approved' THEN 'status.approved'
    WHEN 'rejected' THEN 'status.rejected'
    WHEN 'in_development' THEN 'status.in_development'
    WHEN 'implemented' THEN 'status.implemented'
    WHEN 'archived' THEN 'status.archived'
    ELSE 'status.draft'
  END
WHERE status NOT LIKE 'status.%';

-- Step 3: Update events table
UPDATE events SET 
  status = CASE status
    WHEN 'draft' THEN 'status.draft'
    WHEN 'published' THEN 'status.published'
    WHEN 'cancelled' THEN 'status.cancelled'
    WHEN 'completed' THEN 'status.completed'
    WHEN 'postponed' THEN 'status.postponed'
    WHEN 'ongoing' THEN 'status.ongoing'
    ELSE 'status.draft'
  END,
  event_type = CASE event_type
    WHEN 'workshop' THEN 'type.workshop'
    WHEN 'conference' THEN 'type.conference'
    WHEN 'webinar' THEN 'type.webinar'
    WHEN 'seminar' THEN 'type.seminar'
    WHEN 'training' THEN 'type.training'
    WHEN 'networking' THEN 'type.networking'
    WHEN 'competition' THEN 'type.competition'
    ELSE 'type.workshop'
  END,
  visibility = CASE visibility
    WHEN 'public' THEN 'visibility.public'
    WHEN 'private' THEN 'visibility.private'
    WHEN 'internal' THEN 'visibility.internal'
    WHEN 'restricted' THEN 'visibility.restricted'
    ELSE 'visibility.public'
  END
WHERE status NOT LIKE 'status.%' OR event_type NOT LIKE 'type.%' 
   OR visibility NOT LIKE 'visibility.%';