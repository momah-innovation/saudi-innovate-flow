-- Create notifications table for user notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR NOT NULL DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
  is_read BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT NULL, -- For storing additional data like role_request_id
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications (mark as read)" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications for users" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_notifications_user_id_created_at ON public.notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_user_id_is_read ON public.notifications(user_id, is_read);

-- Create function to send notification
CREATE OR REPLACE FUNCTION public.send_notification(
  target_user_id UUID,
  notification_title VARCHAR,
  notification_message TEXT,
  notification_type VARCHAR DEFAULT 'info',
  notification_metadata JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type, metadata)
  VALUES (target_user_id, notification_title, notification_message, notification_type, notification_metadata)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Create user invitations table
CREATE TABLE public.user_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  invited_by UUID NOT NULL,
  invitation_token VARCHAR NOT NULL UNIQUE,
  name VARCHAR,
  name_ar VARCHAR,
  department VARCHAR,
  position VARCHAR,
  initial_roles TEXT[] DEFAULT ARRAY['innovator'],
  status VARCHAR NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'expired'
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  accepted_by UUID DEFAULT NULL
);

-- Enable RLS for invitations
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies for invitations
CREATE POLICY "Admins can manage invitations" 
ON public.user_invitations 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'user_manager'::app_role));

CREATE POLICY "Anyone can view pending invitations by token" 
ON public.user_invitations 
FOR SELECT 
USING (status = 'pending' AND expires_at > now());

-- Create function to generate invitation token
CREATE OR REPLACE FUNCTION public.generate_invitation_token()
RETURNS VARCHAR
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64url');
END;
$$;

-- Create trigger to automatically send notification when role request is reviewed
CREATE OR REPLACE FUNCTION public.notify_role_request_review()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only send notification when status changes from pending to approved/rejected
  IF OLD.status = 'pending' AND NEW.status IN ('approved', 'rejected') THEN
    PERFORM public.send_notification(
      NEW.requester_id,
      CASE 
        WHEN NEW.status = 'approved' THEN 'Role Request Approved'
        ELSE 'Role Request Update'
      END,
      CASE 
        WHEN NEW.status = 'approved' THEN 
          'Your request for the ' || NEW.requested_role || ' role has been approved! You now have access to this role.'
        ELSE 
          'Your request for the ' || NEW.requested_role || ' role has been reviewed. ' || 
          COALESCE('Reason: ' || NEW.reviewer_notes, 'Please contact an administrator for more information.')
      END,
      CASE 
        WHEN NEW.status = 'approved' THEN 'success'
        ELSE 'warning'
      END,
      jsonb_build_object(
        'role_request_id', NEW.id,
        'requested_role', NEW.requested_role,
        'status', NEW.status
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for role request notifications
CREATE TRIGGER trigger_role_request_notification
AFTER UPDATE ON public.role_requests
FOR EACH ROW
EXECUTE FUNCTION public.notify_role_request_review();

-- Add updated_at trigger for notifications
CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();