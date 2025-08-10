-- Find and disable ALL triggers on ideas table
DO $$
DECLARE
    trigger_rec RECORD;
BEGIN
    FOR trigger_rec IN 
        SELECT tgname FROM pg_trigger WHERE tgrelid = 'ideas'::regclass AND NOT tgisinternal
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || trigger_rec.tgname || ' ON ideas';
    END LOOP;
END $$;

-- PHASE 8: DATABASE VALUE MIGRATION (SAFE EXECUTION)
-- Update only simple tables first, then restore triggers

-- Step 1: Update campaigns table
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

-- Step 2: Update opportunities table
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

-- Step 3: Update partners table
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

-- Step 4: Update innovators table
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

-- Step 5: Log successful partial migration
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES 
('migration.database_values_partial', 'Partial database value migration completed', 'تم إكمال ترحيل جزئي لقيم قاعدة البيانات', 'system')
ON CONFLICT (translation_key) DO NOTHING;