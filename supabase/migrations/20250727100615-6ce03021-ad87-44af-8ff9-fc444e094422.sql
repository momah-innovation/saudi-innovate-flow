-- Add multi-day and recurring event support to events table
ALTER TABLE public.events 
ADD COLUMN end_date date,
ADD COLUMN recurrence_pattern character varying,
ADD COLUMN recurrence_end_date date,
ADD COLUMN is_recurring boolean DEFAULT false;

-- Create event participants table
CREATE TABLE public.event_participants (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid NOT NULL,
  user_id uuid NOT NULL,
  registration_date timestamp with time zone NOT NULL DEFAULT now(),
  attendance_status character varying NOT NULL DEFAULT 'registered',
  check_in_time timestamp with time zone,
  check_out_time timestamp with time zone,
  notes text,
  registration_type character varying NOT NULL DEFAULT 'self_registered',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Enable RLS on event_participants
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;

-- Create policies for event_participants
CREATE POLICY "Users can view their own event participations" 
ON public.event_participants 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can register for events" 
ON public.event_participants 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own event participations" 
ON public.event_participants 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Team members can manage all event participations" 
ON public.event_participants 
FOR ALL 
USING (
  (EXISTS ( SELECT 1
   FROM innovation_team_members itm
  WHERE (itm.user_id = auth.uid()))) OR has_role(auth.uid(), 'admin'::app_role)
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_event_participants_updated_at
BEFORE UPDATE ON public.event_participants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_event_participants_event_id ON public.event_participants(event_id);
CREATE INDEX idx_event_participants_user_id ON public.event_participants(user_id);
CREATE INDEX idx_event_participants_attendance_status ON public.event_participants(attendance_status);

-- Create event participant notifications table
CREATE TABLE public.event_participant_notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid NOT NULL,
  participant_id uuid NOT NULL,
  notification_type character varying NOT NULL,
  sent_at timestamp with time zone NOT NULL DEFAULT now(),
  status character varying NOT NULL DEFAULT 'sent',
  message_content text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on event_participant_notifications
ALTER TABLE public.event_participant_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for event_participant_notifications
CREATE POLICY "Team members can manage event participant notifications" 
ON public.event_participant_notifications 
FOR ALL 
USING (
  (EXISTS ( SELECT 1
   FROM innovation_team_members itm
  WHERE (itm.user_id = auth.uid()))) OR has_role(auth.uid(), 'admin'::app_role)
);