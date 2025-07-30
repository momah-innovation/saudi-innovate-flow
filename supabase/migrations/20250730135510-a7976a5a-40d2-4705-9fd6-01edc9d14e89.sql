-- Create idea_likes table for tracking likes
CREATE TABLE IF NOT EXISTS public.idea_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(idea_id, user_id)
);

-- Enable RLS
ALTER TABLE public.idea_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for idea_likes
CREATE POLICY "Users can view all likes" 
ON public.idea_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their own likes" 
ON public.idea_likes 
FOR ALL
USING (auth.uid() = user_id);