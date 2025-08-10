-- Fix remaining Arabic values in challenges table
UPDATE challenges SET status = 'published' WHERE status = 'منشور';

-- Check and fix any other Arabic values in ideas table if they exist
UPDATE ideas SET status = 'published' WHERE status = 'منشور';
UPDATE ideas SET status = 'active' WHERE status = 'نشط';
UPDATE ideas SET status = 'under_review' WHERE status = 'قيد المراجعة';
UPDATE ideas SET status = 'completed' WHERE status = 'مكتمل';

-- Check and fix any other Arabic values in campaigns table if they exist  
UPDATE campaigns SET status = 'published' WHERE status = 'منشور';
UPDATE campaigns SET status = 'active' WHERE status = 'نشط';
UPDATE campaigns SET status = 'planning' WHERE status = 'تخطيط';

-- Check and fix any other Arabic values in other key tables
UPDATE challenge_submissions SET status = 'published' WHERE status = 'منشور';
UPDATE challenge_submissions SET status = 'draft' WHERE status = 'مسودة';
UPDATE challenge_submissions SET status = 'under_review' WHERE status = 'قيد المراجعة';

UPDATE challenge_participants SET status = 'active' WHERE status = 'نشط';
UPDATE challenge_participants SET status = 'registered' WHERE status = 'مسجل';