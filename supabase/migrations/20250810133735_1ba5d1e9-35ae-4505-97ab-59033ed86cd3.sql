-- Remove existing check constraints that conflict with key-based system
-- Then perform the migration

-- Drop existing check constraints for challenges table
ALTER TABLE challenges DROP CONSTRAINT IF EXISTS challenges_challenge_type_check;
ALTER TABLE challenges DROP CONSTRAINT IF EXISTS challenges_status_check;
ALTER TABLE challenges DROP CONSTRAINT IF EXISTS challenges_sensitivity_level_check;

-- Drop existing check constraints for other tables
ALTER TABLE campaigns DROP CONSTRAINT IF EXISTS campaigns_status_check;
ALTER TABLE campaigns DROP CONSTRAINT IF EXISTS campaigns_theme_check;
ALTER TABLE ideas DROP CONSTRAINT IF EXISTS ideas_status_check;
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_status_check;
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_format_check;
ALTER TABLE opportunities DROP CONSTRAINT IF EXISTS opportunities_status_check;
ALTER TABLE opportunities DROP CONSTRAINT IF EXISTS opportunities_opportunity_type_check;
ALTER TABLE partners DROP CONSTRAINT IF EXISTS partners_status_check;