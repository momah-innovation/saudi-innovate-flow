-- Add new columns for enhanced event management (safer version)

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

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_events_registration_type ON public.events(registration_type);
CREATE INDEX IF NOT EXISTS idx_events_event_language ON public.events(event_language);