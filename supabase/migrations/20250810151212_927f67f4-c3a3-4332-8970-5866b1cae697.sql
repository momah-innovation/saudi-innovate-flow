-- Fix Arabic translation keys by temporarily dropping policies

-- Temporarily drop the policy that depends on events.status
DROP POLICY IF EXISTS "Users can view events based on visibility and role" ON events;

-- Increase column character limits
ALTER TABLE challenges 
ALTER COLUMN priority_level TYPE character varying(50),
ALTER COLUMN sensitivity_level TYPE character varying(50);

ALTER TABLE events
ALTER COLUMN status TYPE character varying(50);

ALTER TABLE ideas
ALTER COLUMN status TYPE character varying(50);

ALTER TABLE campaigns
ALTER COLUMN status TYPE character varying(50);

ALTER TABLE partners
ALTER COLUMN partner_type TYPE character varying(50),
ALTER COLUMN status TYPE character varying(50);

-- Recreate the dropped policy
CREATE POLICY "Users can view events based on visibility and role" ON events
FOR SELECT USING (can_view_event(id, visibility, status));

-- Now update the Arabic keys to English keys
UPDATE challenges SET 
  priority_level = CASE priority_level
    WHEN 'priority.منخفض' THEN 'priority.low'
    WHEN 'priority.متوسط' THEN 'priority.medium'
    WHEN 'priority.عالي' THEN 'priority.high'
    WHEN 'priority.عاجل' THEN 'priority.urgent'
    ELSE priority_level
  END
WHERE priority_level SIMILAR TO '%[^\x00-\x7F]%';

UPDATE challenges SET 
  sensitivity_level = CASE sensitivity_level
    WHEN 'sensitivity.عادي' THEN 'sensitivity.normal'
    WHEN 'sensitivity.حساس' THEN 'sensitivity.sensitive'
    WHEN 'sensitivity.سري' THEN 'sensitivity.classified'
    ELSE sensitivity_level
  END
WHERE sensitivity_level SIMILAR TO '%[^\x00-\x7F]%';

UPDATE events SET 
  status = CASE status
    WHEN 'status.مسودة' THEN 'status.draft'
    WHEN 'status.نشط' THEN 'status.active'
    WHEN 'status.مكتمل' THEN 'status.completed'
    WHEN 'status.ملغي' THEN 'status.cancelled'
    ELSE status
  END
WHERE status SIMILAR TO '%[^\x00-\x7F]%';

UPDATE ideas SET 
  status = CASE status
    WHEN 'status.مسودة' THEN 'status.draft'
    WHEN 'status.مرسل' THEN 'status.submitted'
    WHEN 'status.قيد_المراجعة' THEN 'status.under_review'
    WHEN 'status.مقبول' THEN 'status.approved'
    WHEN 'status.مرفوض' THEN 'status.rejected'
    WHEN 'status.قيد_التطوير' THEN 'status.in_development'
    WHEN 'status.منفذ' THEN 'status.implemented'
    ELSE status
  END
WHERE status SIMILAR TO '%[^\x00-\x7F]%';

UPDATE campaigns SET 
  status = CASE status
    WHEN 'status.تخطيط' THEN 'status.planning'
    WHEN 'status.نشط' THEN 'status.active'
    WHEN 'status.مكتمل' THEN 'status.completed'
    WHEN 'status.معلق' THEN 'status.paused'
    ELSE status
  END
WHERE status SIMILAR TO '%[^\x00-\x7F]%';

UPDATE partners SET 
  partner_type = CASE partner_type
    WHEN 'type.حكومي' THEN 'type.government'
    WHEN 'type.خاص' THEN 'type.private'
    WHEN 'type.غير_ربحي' THEN 'type.non_profit'
    WHEN 'type.أكاديمي' THEN 'type.academic'
    ELSE partner_type
  END
WHERE partner_type SIMILAR TO '%[^\x00-\x7F]%';

UPDATE partners SET 
  status = CASE status
    WHEN 'status.نشط' THEN 'status.active'
    WHEN 'status.غير_نشط' THEN 'status.inactive'
    WHEN 'status.معلق' THEN 'status.suspended'
    ELSE status
  END
WHERE status SIMILAR TO '%[^\x00-\x7F]%';

-- Delete Arabic translation keys from system_translations
DELETE FROM system_translations 
WHERE key_name SIMILAR TO '%[^\x00-\x7F]%';