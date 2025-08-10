-- FIX ARABIC TRANSLATION KEYS - Convert to proper English keys (with length constraints)

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

-- Fix challenges table - sensitivity_level with Arabic keys (shorter keys)
UPDATE challenges SET 
  sensitivity_level = CASE sensitivity_level
    WHEN 'sensitivity.عادي' THEN 'sensitivity.normal'
    WHEN 'sensitivity.حساس' THEN 'sensitivity.sensitive'
    WHEN 'sensitivity.سري' THEN 'sensitivity.classified'
    ELSE sensitivity_level
  END
WHERE sensitivity_level SIMILAR TO '%[^\x00-\x7F]%';