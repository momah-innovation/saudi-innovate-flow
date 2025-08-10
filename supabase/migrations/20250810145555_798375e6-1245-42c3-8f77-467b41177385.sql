-- PHASE 8: DATABASE VALUE MIGRATION (TARGETED APPROACH)
-- Update core tables with proper translation keys

-- Step 1: Update challenges table (main target)
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

-- Step 2: Update events table (skip format column if it doesn't exist)
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

-- Step 3: Update campaigns table
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

-- Step 4: Update partners table
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

-- Log successful migration
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES 
('migration.core_tables_completed', 'Core tables migration completed successfully', 'تم إكمال ترحيل الجداول الأساسية بنجاح', 'system')
ON CONFLICT (translation_key) DO NOTHING;