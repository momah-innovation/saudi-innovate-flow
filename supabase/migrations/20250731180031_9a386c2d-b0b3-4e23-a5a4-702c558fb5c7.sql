-- Create advanced analytics tables for geographic and behavior tracking
CREATE TABLE IF NOT EXISTS public.opportunity_user_journeys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL REFERENCES public.partnership_opportunities(id) ON DELETE CASCADE,
  user_id UUID,
  session_id TEXT NOT NULL,
  journey_step TEXT NOT NULL, -- 'view', 'scroll', 'section_click', 'share', 'apply', 'bookmark'
  step_data JSONB DEFAULT '{}'::jsonb,
  step_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  page_url TEXT,
  previous_step TEXT,
  time_from_previous_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create geographic analytics table
CREATE TABLE IF NOT EXISTS public.opportunity_geographic_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL REFERENCES public.partnership_opportunities(id) ON DELETE CASCADE,
  user_id UUID,
  session_id TEXT NOT NULL,
  country_code CHAR(2),
  country_name TEXT,
  region TEXT,
  city TEXT,
  ip_address INET,
  view_count INTEGER NOT NULL DEFAULT 1,
  first_view_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_view_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(opportunity_id, session_id, country_code)
);

-- Create real-time presence tracking table
CREATE TABLE IF NOT EXISTS public.opportunity_live_presence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL REFERENCES public.partnership_opportunities(id) ON DELETE CASCADE,
  user_id UUID,
  session_id TEXT NOT NULL,
  user_name TEXT,
  user_avatar TEXT,
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  current_section TEXT DEFAULT 'overview',
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(opportunity_id, session_id)
);

-- Enable RLS for all new tables
ALTER TABLE public.opportunity_user_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_geographic_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_live_presence ENABLE ROW LEVEL SECURITY;

-- Create policies for user journeys
CREATE POLICY "Users can view aggregated journey data" 
ON public.opportunity_user_journeys 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create journey entries" 
ON public.opportunity_user_journeys 
FOR INSERT 
WITH CHECK (true);

-- Create policies for geographic analytics
CREATE POLICY "Users can view geographic analytics" 
ON public.opportunity_geographic_analytics 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create geographic entries" 
ON public.opportunity_geographic_analytics 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update geographic entries" 
ON public.opportunity_geographic_analytics 
FOR UPDATE 
USING (true);

-- Create policies for live presence
CREATE POLICY "Users can view live presence" 
ON public.opportunity_live_presence 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their presence" 
ON public.opportunity_live_presence 
FOR ALL 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_opportunity_user_journeys_opportunity_id ON public.opportunity_user_journeys(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_user_journeys_session_id ON public.opportunity_user_journeys(session_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_user_journeys_timestamp ON public.opportunity_user_journeys(step_timestamp);

CREATE INDEX IF NOT EXISTS idx_opportunity_geographic_analytics_opportunity_id ON public.opportunity_geographic_analytics(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_geographic_analytics_country ON public.opportunity_geographic_analytics(country_code);

CREATE INDEX IF NOT EXISTS idx_opportunity_live_presence_opportunity_id ON public.opportunity_live_presence(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_live_presence_active ON public.opportunity_live_presence(is_active);
CREATE INDEX IF NOT EXISTS idx_opportunity_live_presence_last_seen ON public.opportunity_live_presence(last_seen);

-- Enable real-time for new tables
ALTER TABLE public.opportunity_user_journeys REPLICA IDENTITY FULL;
ALTER TABLE public.opportunity_geographic_analytics REPLICA IDENTITY FULL;
ALTER TABLE public.opportunity_live_presence REPLICA IDENTITY FULL;

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.opportunity_user_journeys;
ALTER PUBLICATION supabase_realtime ADD TABLE public.opportunity_geographic_analytics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.opportunity_live_presence;