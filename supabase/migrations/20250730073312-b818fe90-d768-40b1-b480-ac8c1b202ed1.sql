-- Create challenge attachments storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('challenge-attachments', 'challenge-attachments', true);

-- Create storage policies for challenge attachments
CREATE POLICY "Public read access to challenge attachments" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'challenge-attachments');

CREATE POLICY "Team members can upload challenge attachments" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'challenge-attachments' AND 
  (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin') OR 
   EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid() AND status = 'active'))
);

CREATE POLICY "Team members can update challenge attachments" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'challenge-attachments' AND 
  (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin') OR 
   EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid() AND status = 'active'))
);

-- Create challenge submissions table
CREATE TABLE public.challenge_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID NOT NULL,
  submitted_by UUID NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  description_ar TEXT NOT NULL,
  solution_approach TEXT,
  implementation_plan TEXT,
  technical_details JSONB DEFAULT '{}',
  business_model TEXT,
  expected_impact TEXT,
  team_members JSONB DEFAULT '[]',
  attachment_urls TEXT[],
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'accepted', 'rejected', 'winner')),
  submission_date TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  score DECIMAL(5,2),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on challenge submissions
ALTER TABLE public.challenge_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for challenge submissions
CREATE POLICY "Users can view public submissions" 
ON public.challenge_submissions 
FOR SELECT 
USING (is_public = true OR submitted_by = auth.uid());

CREATE POLICY "Users can manage their own submissions" 
ON public.challenge_submissions 
FOR ALL 
USING (submitted_by = auth.uid())
WITH CHECK (submitted_by = auth.uid());

CREATE POLICY "Team members can view all submissions" 
ON public.challenge_submissions 
FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid() AND status = 'active') OR
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin')
);

-- Create challenge participants table
CREATE TABLE public.challenge_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID NOT NULL,
  user_id UUID NOT NULL,
  participation_type VARCHAR(50) DEFAULT 'individual' CHECK (participation_type IN ('individual', 'team_lead', 'team_member')),
  team_name VARCHAR(255),
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status VARCHAR(50) DEFAULT 'registered' CHECK (status IN ('registered', 'active', 'inactive', 'disqualified')),
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

-- Enable RLS on challenge participants
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;

-- RLS policies for challenge participants
CREATE POLICY "Users can view challenge participants" 
ON public.challenge_participants 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their own participation" 
ON public.challenge_participants 
FOR ALL 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Team members can manage all participations" 
ON public.challenge_participants 
FOR ALL 
USING (
  EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid() AND status = 'active') OR
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'super_admin')
);

-- Create challenge comments table
CREATE TABLE public.challenge_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID NOT NULL,
  user_id UUID NOT NULL,
  parent_comment_id UUID REFERENCES public.challenge_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_expert_comment BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on challenge comments
ALTER TABLE public.challenge_comments ENABLE ROW LEVEL SECURITY;

-- RLS policies for challenge comments
CREATE POLICY "Users can view challenge comments" 
ON public.challenge_comments 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create comments" 
ON public.challenge_comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.challenge_comments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.challenge_comments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create challenge notifications table
CREATE TABLE public.challenge_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  sender_id UUID,
  notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('deadline_reminder', 'status_change', 'new_comment', 'expert_feedback', 'submission_update')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on challenge notifications
ALTER TABLE public.challenge_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for challenge notifications
CREATE POLICY "Users can view their own notifications" 
ON public.challenge_notifications 
FOR SELECT 
USING (recipient_id = auth.uid());

CREATE POLICY "Users can update their own notifications" 
ON public.challenge_notifications 
FOR UPDATE 
USING (recipient_id = auth.uid());

-- Add foreign key constraints
ALTER TABLE public.challenge_submissions 
ADD CONSTRAINT fk_challenge_submissions_challenge 
FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE;

ALTER TABLE public.challenge_participants 
ADD CONSTRAINT fk_challenge_participants_challenge 
FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE;

ALTER TABLE public.challenge_comments 
ADD CONSTRAINT fk_challenge_comments_challenge 
FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE;

ALTER TABLE public.challenge_notifications 
ADD CONSTRAINT fk_challenge_notifications_challenge 
FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE;

-- Create triggers for updated_at columns
CREATE TRIGGER update_challenge_submissions_updated_at
BEFORE UPDATE ON public.challenge_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_challenge_comments_updated_at
BEFORE UPDATE ON public.challenge_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to send challenge notifications
CREATE OR REPLACE FUNCTION public.send_challenge_notification(
  p_challenge_id UUID,
  p_recipient_id UUID,
  p_notification_type VARCHAR(50),
  p_title VARCHAR(255),
  p_message TEXT,
  p_action_url TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.challenge_notifications (
    challenge_id, recipient_id, sender_id, notification_type, 
    title, message, action_url, metadata
  ) VALUES (
    p_challenge_id, p_recipient_id, auth.uid(), p_notification_type,
    p_title, p_message, p_action_url, p_metadata
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Create function to auto-notify challenge participants
CREATE OR REPLACE FUNCTION public.notify_challenge_participants()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Notify participants when challenge status changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.challenge_notifications (
      challenge_id, recipient_id, notification_type, title, message
    )
    SELECT 
      NEW.id,
      cp.user_id,
      'status_change',
      'تحديث حالة التحدي',
      'تم تحديث حالة التحدي "' || NEW.title_ar || '" إلى: ' || NEW.status
    FROM public.challenge_participants cp
    WHERE cp.challenge_id = NEW.id 
      AND cp.notifications_enabled = true
      AND cp.status = 'active';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for challenge status notifications
CREATE TRIGGER trigger_notify_challenge_participants
AFTER UPDATE ON public.challenges
FOR EACH ROW
EXECUTE FUNCTION public.notify_challenge_participants();