-- PHASE 8: CRITICAL DATABASE VALUE MIGRATION (CORRECTED)
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

-- Step 2: Update ideas table (corrected - no category column)
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

-- Step 4: Update campaigns table
UPDATE campaigns SET 
  status = CASE status
    WHEN 'planning' THEN 'status.planning'
    WHEN 'active' THEN 'status.active'
    WHEN 'completed' THEN 'status.completed'
    WHEN 'cancelled' THEN 'status.cancelled'
    WHEN 'paused' THEN 'status.paused'
    ELSE 'status.planning'
  END
WHERE status NOT LIKE 'status.%';

-- Step 5: Update opportunities table
UPDATE opportunities SET 
  status = CASE status
    WHEN 'open' THEN 'status.open'
    WHEN 'closed' THEN 'status.closed'
    WHEN 'paused' THEN 'status.paused'
    WHEN 'draft' THEN 'status.draft'
    ELSE 'status.open'
  END,
  opportunity_type = CASE opportunity_type
    WHEN 'funding' THEN 'type.funding'
    WHEN 'partnership' THEN 'type.partnership'
    WHEN 'collaboration' THEN 'type.collaboration'
    WHEN 'mentorship' THEN 'type.mentorship'
    WHEN 'investment' THEN 'type.investment'
    WHEN 'grant' THEN 'type.grant'
    ELSE 'type.funding'
  END
WHERE status NOT LIKE 'status.%' OR opportunity_type NOT LIKE 'type.%';

-- Step 6: Update partners table
UPDATE partners SET 
  partner_type = CASE partner_type
    WHEN 'government' THEN 'type.government'
    WHEN 'corporate' THEN 'type.corporate'
    WHEN 'academic' THEN 'type.academic'
    WHEN 'ngo' THEN 'type.ngo'
    WHEN 'startup' THEN 'type.startup'
    WHEN 'international' THEN 'type.international'
    ELSE 'type.government'
  END,
  status = CASE status
    WHEN 'active' THEN 'status.active'
    WHEN 'inactive' THEN 'status.inactive'
    WHEN 'pending' THEN 'status.pending'
    WHEN 'suspended' THEN 'status.suspended'
    ELSE 'status.active'
  END
WHERE partner_type NOT LIKE 'type.%' OR status NOT LIKE 'status.%';

-- Step 7: Update innovators table
UPDATE innovators SET 
  status = CASE status
    WHEN 'active' THEN 'status.active'
    WHEN 'inactive' THEN 'status.inactive'
    WHEN 'pending' THEN 'status.pending'
    WHEN 'suspended' THEN 'status.suspended'
    ELSE 'status.active'
  END,
  specialization = CASE specialization
    WHEN 'technology' THEN 'specialization.technology'
    WHEN 'business' THEN 'specialization.business'
    WHEN 'design' THEN 'specialization.design'
    WHEN 'research' THEN 'specialization.research'
    WHEN 'engineering' THEN 'specialization.engineering'
    WHEN 'marketing' THEN 'specialization.marketing'
    WHEN 'general' THEN 'specialization.general'
    ELSE 'specialization.general'
  END
WHERE status NOT LIKE 'status.%' OR specialization NOT LIKE 'specialization.%';