-- Add missing foreign key constraint for challenge_requirements table
ALTER TABLE public.challenge_requirements 
ADD CONSTRAINT challenge_requirements_challenge_id_fkey 
FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) 
ON DELETE CASCADE;