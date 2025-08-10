-- Add missing foreign key constraint for challenge_participants table
ALTER TABLE public.challenge_participants 
ADD CONSTRAINT challenge_participants_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) 
ON DELETE CASCADE;