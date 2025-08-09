-- Create missing analytics tracking tables
CREATE TABLE IF NOT EXISTS public.challenge_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  bookmark_count INTEGER DEFAULT 0,
  participant_count INTEGER DEFAULT 0,
  submission_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  engagement_rate DECIMAL DEFAULT 0.0,
  conversion_rate DECIMAL DEFAULT 0.0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.challenge_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(challenge_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.challenge_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  share_method VARCHAR(50) DEFAULT 'link',
  shared_to VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.challenge_view_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID,
  session_id VARCHAR(255),
  view_duration INTEGER DEFAULT 0,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create real-time presence table
CREATE TABLE IF NOT EXISTS public.challenge_live_presence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status VARCHAR(50) DEFAULT 'viewing',
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  UNIQUE(challenge_id, user_id)
);

-- Enable RLS on new tables
ALTER TABLE public.challenge_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_view_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_live_presence ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Everyone can view challenge analytics" ON public.challenge_analytics FOR SELECT USING (true);
CREATE POLICY "System can update challenge analytics" ON public.challenge_analytics FOR ALL USING (true);

CREATE POLICY "Users can manage their own likes" ON public.challenge_likes FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Everyone can view challenge likes" ON public.challenge_likes FOR SELECT USING (true);

CREATE POLICY "Users can create shares" ON public.challenge_shares FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can view shares" ON public.challenge_shares FOR SELECT USING (true);

CREATE POLICY "System can create view sessions" ON public.challenge_view_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view sessions" ON public.challenge_view_sessions FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can update their presence" ON public.challenge_live_presence FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Everyone can view presence" ON public.challenge_live_presence FOR SELECT USING (true);

-- Add real-time subscription
ALTER PUBLICATION supabase_realtime ADD TABLE public.challenge_live_presence;
ALTER PUBLICATION supabase_realtime ADD TABLE public.challenge_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.challenge_participants;