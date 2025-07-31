-- Create opportunity view sessions table for real user tracking
CREATE TABLE public.opportunity_view_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL REFERENCES public.partnership_opportunities(id) ON DELETE CASCADE,
  session_id VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  country_code VARCHAR(2),
  country_name VARCHAR(100),
  city VARCHAR(100),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  page_views INTEGER DEFAULT 1,
  bounce BOOLEAN DEFAULT false,
  referrer TEXT,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create opportunity geographic analytics table
CREATE TABLE public.opportunity_geographic_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL REFERENCES public.partnership_opportunities(id) ON DELETE CASCADE,
  country_code VARCHAR(2) NOT NULL,
  country_name VARCHAR(100) NOT NULL,
  city VARCHAR(100),
  view_count INTEGER NOT NULL DEFAULT 0,
  application_count INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(opportunity_id, country_code, city)
);

-- Create opportunity user journeys table for behavior tracking
CREATE TABLE public.opportunity_user_journeys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL REFERENCES public.partnership_opportunities(id) ON DELETE CASCADE,
  session_id VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  step_name VARCHAR(100) NOT NULL,
  step_order INTEGER NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  time_spent_seconds INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create opportunity behavior patterns table
CREATE TABLE public.opportunity_behavior_patterns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL REFERENCES public.partnership_opportunities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id VARCHAR(255),
  action_type VARCHAR(50) NOT NULL,
  action_target VARCHAR(100),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  duration_ms INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_view_sessions_opportunity_id ON public.opportunity_view_sessions(opportunity_id);
CREATE INDEX idx_view_sessions_session_id ON public.opportunity_view_sessions(session_id);
CREATE INDEX idx_view_sessions_start_time ON public.opportunity_view_sessions(start_time);
CREATE INDEX idx_view_sessions_country_code ON public.opportunity_view_sessions(country_code);

CREATE INDEX idx_geographic_analytics_opportunity_id ON public.opportunity_geographic_analytics(opportunity_id);
CREATE INDEX idx_geographic_analytics_country ON public.opportunity_geographic_analytics(country_code);

CREATE INDEX idx_user_journeys_opportunity_id ON public.opportunity_user_journeys(opportunity_id);
CREATE INDEX idx_user_journeys_session_id ON public.opportunity_user_journeys(session_id);
CREATE INDEX idx_user_journeys_timestamp ON public.opportunity_user_journeys(timestamp);

CREATE INDEX idx_behavior_patterns_opportunity_id ON public.opportunity_behavior_patterns(opportunity_id);
CREATE INDEX idx_behavior_patterns_action_type ON public.opportunity_behavior_patterns(action_type);
CREATE INDEX idx_behavior_patterns_timestamp ON public.opportunity_behavior_patterns(timestamp);

-- Enable RLS
ALTER TABLE public.opportunity_view_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_geographic_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_user_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_behavior_patterns ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Team members can view all analytics data"
ON public.opportunity_view_sessions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) OR 
  has_role(auth.uid(), 'admin'::public.app_role) OR
  has_role(auth.uid(), 'super_admin'::public.app_role)
);

CREATE POLICY "System can insert session data"
ON public.opportunity_view_sessions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Team members can view geographic analytics"
ON public.opportunity_geographic_analytics FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) OR 
  has_role(auth.uid(), 'admin'::public.app_role) OR
  has_role(auth.uid(), 'super_admin'::public.app_role)
);

CREATE POLICY "System can manage geographic analytics"
ON public.opportunity_geographic_analytics FOR ALL
USING (true);

CREATE POLICY "Team members can view user journeys"
ON public.opportunity_user_journeys FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) OR 
  has_role(auth.uid(), 'admin'::public.app_role) OR
  has_role(auth.uid(), 'super_admin'::public.app_role)
);

CREATE POLICY "System can insert journey data"
ON public.opportunity_user_journeys FOR INSERT
WITH CHECK (true);

CREATE POLICY "Team members can view behavior patterns"
ON public.opportunity_behavior_patterns FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.innovation_team_members itm 
    WHERE itm.user_id = auth.uid() AND itm.status = 'active'
  ) OR 
  has_role(auth.uid(), 'admin'::public.app_role) OR
  has_role(auth.uid(), 'super_admin'::public.app_role)
);

CREATE POLICY "System can insert behavior data"
ON public.opportunity_behavior_patterns FOR INSERT
WITH CHECK (true);

-- Create function to update geographic analytics
CREATE OR REPLACE FUNCTION public.update_geographic_analytics(
  p_opportunity_id UUID,
  p_country_code VARCHAR(2),
  p_country_name VARCHAR(100),
  p_city VARCHAR(100) DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.opportunity_geographic_analytics (
    opportunity_id, country_code, country_name, city, view_count, last_updated
  )
  VALUES (
    p_opportunity_id, p_country_code, p_country_name, p_city, 1, NOW()
  )
  ON CONFLICT (opportunity_id, country_code, city)
  DO UPDATE SET
    view_count = opportunity_geographic_analytics.view_count + 1,
    last_updated = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to track user journey step
CREATE OR REPLACE FUNCTION public.track_user_journey_step(
  p_opportunity_id UUID,
  p_session_id VARCHAR(255),
  p_step_name VARCHAR(100),
  p_time_spent_seconds INTEGER DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
DECLARE
  v_step_order INTEGER;
BEGIN
  -- Get next step order for this session
  SELECT COALESCE(MAX(step_order), 0) + 1 
  INTO v_step_order
  FROM public.opportunity_user_journeys
  WHERE session_id = p_session_id AND opportunity_id = p_opportunity_id;
  
  INSERT INTO public.opportunity_user_journeys (
    opportunity_id, session_id, user_id, step_name, step_order, time_spent_seconds, metadata
  )
  VALUES (
    p_opportunity_id, p_session_id, auth.uid(), p_step_name, v_step_order, p_time_spent_seconds, p_metadata
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to track behavior pattern
CREATE OR REPLACE FUNCTION public.track_behavior_pattern(
  p_opportunity_id UUID,
  p_session_id VARCHAR(255),
  p_action_type VARCHAR(50),
  p_action_target VARCHAR(100) DEFAULT NULL,
  p_duration_ms INTEGER DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.opportunity_behavior_patterns (
    opportunity_id, user_id, session_id, action_type, action_target, duration_ms, metadata
  )
  VALUES (
    p_opportunity_id, auth.uid(), p_session_id, p_action_type, p_action_target, p_duration_ms, p_metadata
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to end view session
CREATE OR REPLACE FUNCTION public.end_view_session(
  p_session_id VARCHAR(255),
  p_duration_seconds INTEGER,
  p_page_views INTEGER DEFAULT 1,
  p_bounce BOOLEAN DEFAULT false
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.opportunity_view_sessions
  SET 
    end_time = NOW(),
    duration_seconds = p_duration_seconds,
    page_views = p_page_views,
    bounce = p_bounce
  WHERE session_id = p_session_id AND end_time IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;