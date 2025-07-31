-- Enable real-time for analytics tables
ALTER TABLE public.opportunity_analytics REPLICA IDENTITY FULL;
ALTER TABLE public.opportunity_likes REPLICA IDENTITY FULL;
ALTER TABLE public.opportunity_shares REPLICA IDENTITY FULL;
ALTER TABLE public.opportunity_applications REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.opportunity_analytics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.opportunity_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.opportunity_shares;
ALTER PUBLICATION supabase_realtime ADD TABLE public.opportunity_applications;

-- Create session-based view tracking table
CREATE TABLE IF NOT EXISTS public.opportunity_view_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL REFERENCES public.partnership_opportunities(id) ON DELETE CASCADE,
  user_id UUID,
  session_id TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  first_view_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_view_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  view_count INTEGER NOT NULL DEFAULT 1,
  time_spent_seconds INTEGER DEFAULT 0,
  source TEXT DEFAULT 'unknown',
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(opportunity_id, session_id)
);

-- Enable RLS
ALTER TABLE public.opportunity_view_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own sessions" 
ON public.opportunity_view_sessions 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create view sessions" 
ON public.opportunity_view_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their sessions" 
ON public.opportunity_view_sessions 
FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_opportunity_view_sessions_opportunity_id ON public.opportunity_view_sessions(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_view_sessions_session_id ON public.opportunity_view_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_view_sessions_user_id ON public.opportunity_view_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_view_sessions_created_at ON public.opportunity_view_sessions(created_at);