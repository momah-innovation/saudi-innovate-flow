-- Add missing columns to idea_bookmarks table to match other bookmark tables
ALTER TABLE public.idea_bookmarks 
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS priority character varying DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS reminder_date timestamp with time zone;

-- Add missing columns to challenge_bookmarks table 
ALTER TABLE public.challenge_bookmarks 
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS priority character varying DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS reminder_date timestamp with time zone;

-- Add missing columns to event_bookmarks table
ALTER TABLE public.event_bookmarks 
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS priority character varying DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS reminder_date timestamp with time zone;

-- Create missing tables for likes functionality
CREATE TABLE IF NOT EXISTS public.challenge_likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  challenge_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT fk_challenge_likes_challenge_id 
    FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE,
  UNIQUE(user_id, challenge_id)
);

CREATE TABLE IF NOT EXISTS public.event_likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  event_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT fk_event_likes_event_id 
    FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE,
  UNIQUE(user_id, event_id)
);

CREATE TABLE IF NOT EXISTS public.idea_likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  idea_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT fk_idea_likes_idea_id 
    FOREIGN KEY (idea_id) REFERENCES public.ideas(id) ON DELETE CASCADE,
  UNIQUE(user_id, idea_id)
);

CREATE TABLE IF NOT EXISTS public.idea_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  idea_id uuid NOT NULL,
  content text NOT NULL,
  parent_comment_id uuid,
  is_pinned boolean DEFAULT false,
  likes_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT fk_idea_comments_idea_id 
    FOREIGN KEY (idea_id) REFERENCES public.ideas(id) ON DELETE CASCADE,
  CONSTRAINT fk_idea_comments_parent_id 
    FOREIGN KEY (parent_comment_id) REFERENCES public.idea_comments(id) ON DELETE CASCADE
);

-- Enable RLS on new tables
ALTER TABLE public.challenge_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for likes tables
CREATE POLICY "Users can manage their own challenge likes" 
ON public.challenge_likes 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all challenge likes" 
ON public.challenge_likes 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can manage their own event likes" 
ON public.event_likes 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all event likes" 
ON public.event_likes 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can manage their own idea likes" 
ON public.idea_likes 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all idea likes" 
ON public.idea_likes 
FOR SELECT 
TO authenticated 
USING (true);

-- Create RLS policies for idea comments
CREATE POLICY "Users can create comments" 
ON public.idea_comments 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all comments" 
ON public.idea_comments 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can update their own comments" 
ON public.idea_comments 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.idea_comments 
FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- Create update trigger for idea_comments
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_idea_comments_updated_at
BEFORE UPDATE ON public.idea_comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();