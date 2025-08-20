
-- Create enhanced activity_events table with proper indexing
CREATE TABLE IF NOT EXISTS public.activity_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id UUID REFERENCES auth.users NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  target_user_id UUID REFERENCES auth.users,
  workspace_id UUID,
  workspace_type VARCHAR(50),
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  privacy_level VARCHAR(20) DEFAULT 'public' CHECK (privacy_level IN ('public', 'team', 'organization', 'private')),
  severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for optimal query performance
CREATE INDEX IF NOT EXISTS idx_activity_events_actor_id ON public.activity_events(actor_id);
CREATE INDEX IF NOT EXISTS idx_activity_events_action_type ON public.activity_events(action_type);
CREATE INDEX IF NOT EXISTS idx_activity_events_entity_type ON public.activity_events(entity_type);
CREATE INDEX IF NOT EXISTS idx_activity_events_entity_id ON public.activity_events(entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_events_workspace_id ON public.activity_events(workspace_id);
CREATE INDEX IF NOT EXISTS idx_activity_events_created_at ON public.activity_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_events_privacy_level ON public.activity_events(privacy_level);
CREATE INDEX IF NOT EXISTS idx_activity_events_severity ON public.activity_events(severity);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_activity_events_actor_created ON public.activity_events(actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_events_entity_created ON public.activity_events(entity_type, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_events_workspace_created ON public.activity_events(workspace_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Activity Events
CREATE POLICY "Users can create their own activities" ON public.activity_events
  FOR INSERT WITH CHECK (actor_id = auth.uid());

CREATE POLICY "Users can view public activities" ON public.activity_events
  FOR SELECT USING (
    privacy_level = 'public' OR 
    actor_id = auth.uid() OR
    (privacy_level = 'organization' AND auth.uid() IS NOT NULL)
  );

CREATE POLICY "Team members can view team activities" ON public.activity_events
  FOR SELECT USING (
    privacy_level IN ('public', 'team') OR 
    actor_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM innovation_team_members 
      WHERE user_id = auth.uid() AND status = 'active'
    ) OR
    has_role(auth.uid(), 'admin'::app_role)
  );

-- Create activity aggregation views for performance
CREATE OR REPLACE VIEW public.activity_summary AS
SELECT 
  DATE_TRUNC('day', created_at) as activity_date,
  action_type,
  entity_type,
  COUNT(*) as event_count,
  COUNT(DISTINCT actor_id) as unique_actors
FROM public.activity_events
WHERE created_at >= NOW() - INTERVAL '90 days'
GROUP BY DATE_TRUNC('day', created_at), action_type, entity_type
ORDER BY activity_date DESC;

-- Create triggers for automatic activity cleanup (optional)
CREATE OR REPLACE FUNCTION public.cleanup_expired_activities()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.activity_events 
  WHERE expires_at IS NOT NULL AND expires_at < NOW();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to run cleanup daily
CREATE OR REPLACE FUNCTION public.schedule_activity_cleanup()
RETURNS void AS $$
BEGIN
  -- This would ideally be a cron job, but for now we'll rely on periodic cleanup
  PERFORM public.cleanup_expired_activities();
END;
$$ LANGUAGE plpgsql;
