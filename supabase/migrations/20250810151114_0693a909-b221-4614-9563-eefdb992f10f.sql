-- Increase column character limits for translation keys

-- Increase challenges table column limits
ALTER TABLE challenges 
ALTER COLUMN priority_level TYPE character varying(50),
ALTER COLUMN sensitivity_level TYPE character varying(50);

-- Increase events table column limits  
ALTER TABLE events
ALTER COLUMN status TYPE character varying(50);

-- Increase ideas table column limits
ALTER TABLE ideas
ALTER COLUMN status TYPE character varying(50);

-- Increase campaigns table column limits
ALTER TABLE campaigns
ALTER COLUMN status TYPE character varying(50);

-- Increase partners table column limits
ALTER TABLE partners
ALTER COLUMN partner_type TYPE character varying(50),
ALTER COLUMN status TYPE character varying(50);

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

-- Log the migration completion
INSERT INTO public.security_audit_log (
  user_id, action_type, resource_type, details, risk_level
) VALUES (
  auth.uid(), 'TRANSLATION_KEY_MIGRATION', 'database_schema', 
  jsonb_build_object(
    'action', 'increased_column_limits_and_fixed_arabic_keys',
    'tables_updated', ARRAY['challenges', 'events', 'ideas', 'campaigns', 'partners', 'system_translations'],
    'column_limit_increased_to', 50
  ), 'low'
);