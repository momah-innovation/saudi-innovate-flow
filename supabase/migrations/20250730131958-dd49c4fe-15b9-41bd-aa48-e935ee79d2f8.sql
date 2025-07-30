-- Create idea_notifications table for comment notifications (if not exists)
CREATE TABLE IF NOT EXISTS public.idea_notifications (
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

-- Add indexes for idea_notifications (if not exists)
CREATE INDEX IF NOT EXISTS idx_idea_notifications_recipient_id ON public.idea_notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_idea_notifications_idea_id ON public.idea_notifications(idea_id);
CREATE INDEX IF NOT EXISTS idx_idea_notifications_created_at ON public.idea_notifications(created_at DESC);

-- Enable RLS for idea_notifications (if not exists)
ALTER TABLE public.idea_notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own idea notifications" ON public.idea_notifications;
DROP POLICY IF EXISTS "Users can update their own idea notifications" ON public.idea_notifications;

-- RLS Policies for idea_notifications
CREATE POLICY "Users can view their own idea notifications"
ON public.idea_notifications
FOR SELECT
USING (recipient_id = auth.uid());

CREATE POLICY "Users can update their own idea notifications"
ON public.idea_notifications
FOR UPDATE
USING (recipient_id = auth.uid());