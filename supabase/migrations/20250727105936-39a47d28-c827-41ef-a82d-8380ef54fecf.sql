-- Create event_challenge_links table for many-to-many relationship
CREATE TABLE public.event_challenge_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL,
  challenge_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, challenge_id)
);

-- Enable RLS
ALTER TABLE public.event_challenge_links ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Team members can manage event challenge links" 
ON public.event_challenge_links 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid()
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

-- Add event categorization fields to events table
ALTER TABLE public.events 
ADD COLUMN event_visibility CHARACTER VARYING DEFAULT 'public'::character varying,
ADD COLUMN event_category CHARACTER VARYING DEFAULT 'standalone'::character varying,
ADD COLUMN inherit_from_campaign BOOLEAN DEFAULT false;

-- Add check constraints for valid values
ALTER TABLE public.events 
ADD CONSTRAINT valid_event_visibility 
CHECK (event_visibility IN ('public', 'private', 'internal'));

ALTER TABLE public.events 
ADD CONSTRAINT valid_event_category 
CHECK (event_category IN ('campaign_event', 'standalone', 'training', 'workshop'));

-- Create indexes for better performance
CREATE INDEX idx_event_challenge_links_event_id ON public.event_challenge_links(event_id);
CREATE INDEX idx_event_challenge_links_challenge_id ON public.event_challenge_links(challenge_id);
CREATE INDEX idx_events_visibility ON public.events(event_visibility);
CREATE INDEX idx_events_category ON public.events(event_category);