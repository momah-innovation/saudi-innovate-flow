-- First drop the check constraints that are preventing the update
ALTER TABLE challenges DROP CONSTRAINT IF EXISTS challenges_sensitivity_level_check;
ALTER TABLE challenges DROP CONSTRAINT IF EXISTS challenges_priority_level_check;
ALTER TABLE challenges DROP CONSTRAINT IF EXISTS challenges_challenge_type_check;

-- Update challenges priority_level values to Arabic
UPDATE challenges 
SET priority_level = CASE 
  WHEN priority_level = 'high' THEN 'عالي'
  WHEN priority_level = 'medium' THEN 'متوسط'
  WHEN priority_level = 'low' THEN 'منخفض'
  ELSE priority_level
END;

-- Update challenges sensitivity_level values to Arabic
UPDATE challenges 
SET sensitivity_level = CASE 
  WHEN sensitivity_level = 'normal' THEN 'عادي'
  WHEN sensitivity_level = 'sensitive' THEN 'حساس'
  WHEN sensitivity_level = 'confidential' THEN 'سري'
  ELSE sensitivity_level
END;

-- Update challenges challenge_type values to Arabic
UPDATE challenges 
SET challenge_type = CASE 
  WHEN challenge_type = 'technology' THEN 'تقنية'
  WHEN challenge_type = 'sustainability' THEN 'استدامة'
  WHEN challenge_type = 'healthcare' THEN 'صحة'
  WHEN challenge_type = 'education' THEN 'تعليم'
  WHEN challenge_type = 'governance' THEN 'حوكمة'
  WHEN challenge_type = 'smart_infrastructure' THEN 'بنية تحتية ذكية'
  WHEN challenge_type = 'digital_transformation' THEN 'تحول رقمي'
  WHEN challenge_type = 'healthcare_innovation' THEN 'ابتكار صحي'
  ELSE challenge_type
END;

-- Add new check constraints with Arabic values
ALTER TABLE challenges ADD CONSTRAINT challenges_priority_level_check 
CHECK (priority_level IN ('عالي', 'متوسط', 'منخفض'));

ALTER TABLE challenges ADD CONSTRAINT challenges_sensitivity_level_check 
CHECK (sensitivity_level IN ('عادي', 'حساس', 'سري'));

ALTER TABLE challenges ADD CONSTRAINT challenges_challenge_type_check 
CHECK (challenge_type IN ('تقنية', 'استدامة', 'صحة', 'تعليم', 'حوكمة', 'بنية تحتية ذكية', 'تحول رقمي', 'ابتكار صحي'));