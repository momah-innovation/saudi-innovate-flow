-- Add foreign key constraint from idea_comments.author_id to profiles.id
ALTER TABLE public.idea_comments 
ADD CONSTRAINT fk_idea_comments_author_id 
FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;