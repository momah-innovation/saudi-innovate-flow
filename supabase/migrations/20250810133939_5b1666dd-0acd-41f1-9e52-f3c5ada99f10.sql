-- Update only draft ideas first to avoid trigger validation
UPDATE ideas 
SET status = 'status.draft'
WHERE status = 'draft';

-- Update non-draft ideas by temporarily disabling the trigger
ALTER TABLE ideas DISABLE TRIGGER validate_idea_submission_trigger;