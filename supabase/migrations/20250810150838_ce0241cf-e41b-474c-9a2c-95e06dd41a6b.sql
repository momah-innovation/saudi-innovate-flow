-- FIX ARABIC TRANSLATION KEYS - Convert all Arabic keys to English
-- This fixes issues like "priority.عالي" and converts them to proper English keys

-- Fix challenges table - priority_level with Arabic keys
UPDATE challenges SET 
  priority_level = CASE priority_level
    WHEN 'priority.منخفض' THEN 'priority.low'
    WHEN 'priority.متوسط' THEN 'priority.medium'
    WHEN 'priority.عالي' THEN 'priority.high'
    WHEN 'priority.عاجل' THEN 'priority.urgent'
    ELSE priority_level
  END
WHERE priority_level SIMILAR TO '%[^\x00-\x7F]%';

-- Fix challenges table - sensitivity_level with Arabic keys
UPDATE challenges SET 
  sensitivity_level = CASE sensitivity_level
    WHEN 'sensitivity.عادي' THEN 'sensitivity.normal'
    WHEN 'sensitivity.حساس' THEN 'sensitivity.sensitive'
    WHEN 'sensitivity.سري' THEN 'sensitivity.classified'
    WHEN 'sensitivity.سرية' THEN 'sensitivity.confidential'
    ELSE sensitivity_level
  END
WHERE sensitivity_level SIMILAR TO '%[^\x00-\x7F]%';

-- Fix events table - status with Arabic keys
UPDATE events SET 
  status = CASE status
    WHEN 'مسودة' THEN 'status.draft'
    WHEN 'منشور' THEN 'status.published'
    WHEN 'ملغي' THEN 'status.cancelled'
    WHEN 'مكتمل' THEN 'status.completed'
    WHEN 'مؤجل' THEN 'status.postponed'
    WHEN 'جاري' THEN 'status.ongoing'
    WHEN 'مجدول' THEN 'status.scheduled'
    ELSE status
  END
WHERE status SIMILAR TO '%[^\x00-\x7F]%';

-- Fix any other tables that might have Arabic keys
UPDATE ideas SET 
  status = CASE status
    WHEN 'مسودة' THEN 'status.draft'
    WHEN 'قيد المراجعة' THEN 'status.under_review'
    WHEN 'معتمد' THEN 'status.approved'
    WHEN 'مرفوض' THEN 'status.rejected'
    WHEN 'قيد التطوير' THEN 'status.in_development'
    WHEN 'منفذ' THEN 'status.implemented'
    WHEN 'مؤرشف' THEN 'status.archived'
    ELSE status
  END
WHERE status SIMILAR TO '%[^\x00-\x7F]%';

-- Fix campaigns table if it has Arabic keys
UPDATE campaigns SET 
  status = CASE status
    WHEN 'التخطيط' THEN 'status.planning'
    WHEN 'نشط' THEN 'status.active'
    WHEN 'مكتمل' THEN 'status.completed'
    WHEN 'ملغي' THEN 'status.cancelled'
    WHEN 'متوقف' THEN 'status.paused'
    ELSE status
  END
WHERE status SIMILAR TO '%[^\x00-\x7F]%';

-- Fix partners table if it has Arabic keys
UPDATE partners SET 
  partner_type = CASE partner_type
    WHEN 'حكومي' THEN 'type.government'
    WHEN 'شركات' THEN 'type.corporate'
    WHEN 'أكاديمي' THEN 'type.academic'
    WHEN 'منظمة غير ربحية' THEN 'type.ngo'
    WHEN 'شركة ناشئة' THEN 'type.startup'
    WHEN 'دولي' THEN 'type.international'
    ELSE partner_type
  END,
  status = CASE status
    WHEN 'نشط' THEN 'status.active'
    WHEN 'غير نشط' THEN 'status.inactive'
    WHEN 'قيد الانتظار' THEN 'status.pending'
    WHEN 'معلق' THEN 'status.suspended'
    ELSE status
  END
WHERE partner_type SIMILAR TO '%[^\x00-\x7F]%' OR status SIMILAR TO '%[^\x00-\x7F]%';

-- Check for and fix any system_translations with Arabic keys (these shouldn't exist but just in case)
DELETE FROM system_translations WHERE translation_key SIMILAR TO '%[^\x00-\x7F]%';

-- Log the fix
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES 
('migration.arabic_keys_fixed', 'Arabic translation keys converted to English', 'تم تحويل مفاتيح الترجمة العربية إلى الإنجليزية', 'system')
ON CONFLICT (translation_key) DO NOTHING;