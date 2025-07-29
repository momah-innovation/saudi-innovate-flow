-- Fix the foreign key constraint for ideas.innovator_id
-- It should reference innovators.id, not auth.users.id

-- First, drop the existing foreign key constraint if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE table_name = 'ideas' 
        AND constraint_name = 'ideas_innovator_id_fkey'
    ) THEN
        ALTER TABLE ideas DROP CONSTRAINT ideas_innovator_id_fkey;
    END IF;
END $$;

-- Add the correct foreign key constraint to reference innovators table
ALTER TABLE ideas 
ADD CONSTRAINT ideas_innovator_id_fkey 
FOREIGN KEY (innovator_id) 
REFERENCES innovators(id) 
ON DELETE CASCADE;