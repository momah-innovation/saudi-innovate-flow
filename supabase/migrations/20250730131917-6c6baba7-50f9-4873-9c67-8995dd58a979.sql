-- Create idea_comments table
CREATE TABLE public.idea_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  comment_type CHARACTER VARYING DEFAULT 'general',
  parent_comment_id UUID REFERENCES public.idea_comments(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  is_expert_comment BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_idea_comments_idea_id ON public.idea_comments(idea_id);
CREATE INDEX idx_idea_comments_author_id ON public.idea_comments(author_id);
CREATE INDEX idx_idea_comments_parent_id ON public.idea_comments(parent_comment_id);
CREATE INDEX idx_idea_comments_created_at ON public.idea_comments(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.idea_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for idea_comments
CREATE POLICY "Anyone can view idea comments"
ON public.idea_comments
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create comments"
ON public.idea_comments
FOR INSERT
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments"
ON public.idea_comments
FOR UPDATE
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own comments"
ON public.idea_comments
FOR DELETE
USING (auth.uid() = author_id);

-- Create updated_at trigger
CREATE TRIGGER update_idea_comments_updated_at
  BEFORE UPDATE ON public.idea_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create idea_notifications table for comment notifications
CREATE TABLE public.idea_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notification_type CHARACTER VARYING NOT NULL,
  title CHARACTER VARYING NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for idea_notifications
CREATE INDEX idx_idea_notifications_recipient_id ON public.idea_notifications(recipient_id);
CREATE INDEX idx_idea_notifications_idea_id ON public.idea_notifications(idea_id);
CREATE INDEX idx_idea_notifications_created_at ON public.idea_notifications(created_at DESC);

-- Enable RLS for idea_notifications
ALTER TABLE public.idea_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for idea_notifications
CREATE POLICY "Users can view their own idea notifications"
ON public.idea_notifications
FOR SELECT
USING (recipient_id = auth.uid());

CREATE POLICY "Users can update their own idea notifications"
ON public.idea_notifications
FOR UPDATE
USING (recipient_id = auth.uid());

-- Function to send idea comment notifications
CREATE OR REPLACE FUNCTION public.notify_idea_comment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  idea_title VARCHAR(255);
  innovator_user_id UUID;
  commenter_name VARCHAR(255);
BEGIN
  -- Get idea details and innovator
  SELECT i.title_ar, inn.user_id INTO idea_title, innovator_user_id
  FROM public.ideas i
  JOIN public.innovators inn ON i.innovator_id = inn.id
  WHERE i.id = NEW.idea_id;
  
  -- Get commenter name
  SELECT COALESCE(name_ar, name) INTO commenter_name
  FROM public.profiles
  WHERE id = NEW.author_id;
  
  -- Notify idea owner (if they're not the commenter)
  IF innovator_user_id != NEW.author_id THEN
    INSERT INTO public.idea_notifications (
      idea_id, recipient_id, sender_id, notification_type, title, message, action_url
    ) VALUES (
      NEW.idea_id,
      innovator_user_id,
      NEW.author_id,
      'new_comment',
      'تعليق جديد على فكرتك',
      'علق ' || COALESCE(commenter_name, 'مستخدم') || ' على فكرة "' || idea_title || '"',
      '/ideas?view=' || NEW.idea_id
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for comment notifications
CREATE TRIGGER trigger_notify_idea_comment
  AFTER INSERT ON public.idea_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_idea_comment();