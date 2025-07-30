-- Add new columns for enhanced event management

-- Participant management fields
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS registration_type varchar DEFAULT 'open',
ADD COLUMN IF NOT EXISTS registration_fee numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS requires_approval boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS allow_waitlist boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS participant_requirements text,
ADD COLUMN IF NOT EXISTS selection_criteria text;

-- Resource management fields  
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS live_stream_url text,
ADD COLUMN IF NOT EXISTS recording_url text,
ADD COLUMN IF NOT EXISTS additional_links text;

-- Settings and notification fields
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS email_reminders boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS sms_notifications boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS auto_confirmation boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS reminder_schedule varchar DEFAULT '24h',
ADD COLUMN IF NOT EXISTS enable_feedback boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS enable_qr_checkin boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS enable_networking boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS record_sessions boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS event_language varchar DEFAULT 'ar',
ADD COLUMN IF NOT EXISTS timezone varchar DEFAULT 'Asia/Riyadh';

-- Create table for event participant notifications
CREATE TABLE IF NOT EXISTS public.event_participant_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  participant_id uuid NOT NULL,
  notification_type varchar NOT NULL,
  message_content text,
  sent_at timestamp with time zone NOT NULL DEFAULT now(),
  status varchar NOT NULL DEFAULT 'sent',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_event_participant_notifications_event_id ON public.event_participant_notifications(event_id);
CREATE INDEX IF NOT EXISTS idx_event_participant_notifications_participant_id ON public.event_participant_notifications(participant_id);
CREATE INDEX IF NOT EXISTS idx_events_registration_type ON public.events(registration_type);
CREATE INDEX IF NOT EXISTS idx_events_event_language ON public.events(event_language);

-- Enable RLS for event participant notifications
ALTER TABLE public.event_participant_notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for event participant notifications
CREATE POLICY "Team members can manage event participant notifications" 
ON public.event_participant_notifications 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.innovation_team_members itm 
    WHERE itm.user_id = auth.uid()
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

-- Create trigger to automatically update updated_at timestamp for events
CREATE OR REPLACE FUNCTION public.update_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Only create trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_events_updated_at_trigger'
  ) THEN
    CREATE TRIGGER update_events_updated_at_trigger
      BEFORE UPDATE ON public.events
      FOR EACH ROW
      EXECUTE FUNCTION public.update_events_updated_at();
  END IF;
END;
$$;

-- Add comments for better documentation
COMMENT ON COLUMN public.events.registration_type IS 'Type of registration: open, invite_only, approval_required, paid';
COMMENT ON COLUMN public.events.registration_fee IS 'Registration fee in SAR (0 for free events)';
COMMENT ON COLUMN public.events.requires_approval IS 'Whether registrations require manual approval';
COMMENT ON COLUMN public.events.allow_waitlist IS 'Whether to allow waitlist when event is full';
COMMENT ON COLUMN public.events.participant_requirements IS 'Special requirements for participants';
COMMENT ON COLUMN public.events.selection_criteria IS 'Criteria for selecting participants';
COMMENT ON COLUMN public.events.live_stream_url IS 'URL for live streaming the event';
COMMENT ON COLUMN public.events.recording_url IS 'URL for event recording';
COMMENT ON COLUMN public.events.additional_links IS 'Additional useful links for the event';
COMMENT ON COLUMN public.events.email_reminders IS 'Whether to send email reminders';
COMMENT ON COLUMN public.events.sms_notifications IS 'Whether to send SMS notifications';
COMMENT ON COLUMN public.events.auto_confirmation IS 'Whether to auto-confirm registrations';
COMMENT ON COLUMN public.events.reminder_schedule IS 'When to send reminders (1h, 24h, 48h, 1w)';
COMMENT ON COLUMN public.events.enable_feedback IS 'Whether feedback collection is enabled';
COMMENT ON COLUMN public.events.enable_qr_checkin IS 'Whether QR code check-in is enabled';
COMMENT ON COLUMN public.events.enable_networking IS 'Whether networking platform is enabled';
COMMENT ON COLUMN public.events.record_sessions IS 'Whether to record event sessions';
COMMENT ON COLUMN public.events.event_language IS 'Primary language of the event (ar, en, both)';
COMMENT ON COLUMN public.events.timezone IS 'Timezone for the event';