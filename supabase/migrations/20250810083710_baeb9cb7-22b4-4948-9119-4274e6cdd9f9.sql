-- Add missing foreign key constraint for challenge_submissions table
ALTER TABLE public.challenge_submissions 
ADD CONSTRAINT challenge_submissions_submitted_by_fkey 
FOREIGN KEY (submitted_by) REFERENCES public.profiles(id) 
ON DELETE CASCADE;