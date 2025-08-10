-- Update ideas table values with better handling
-- First update maturity_level (safer)
UPDATE ideas 
SET maturity_level = CASE 
  WHEN maturity_level = 'idea' THEN 'maturity.idea'
  WHEN maturity_level = 'concept' THEN 'maturity.concept'
  WHEN maturity_level = 'prototype' THEN 'maturity.prototype'
  WHEN maturity_level = 'development' THEN 'maturity.development'
  WHEN maturity_level = 'pilot' THEN 'maturity.pilot'
  WHEN maturity_level = 'scaling' THEN 'maturity.scaling'
  ELSE maturity_level
END
WHERE maturity_level IN ('idea', 'concept', 'prototype', 'development', 'pilot', 'scaling');