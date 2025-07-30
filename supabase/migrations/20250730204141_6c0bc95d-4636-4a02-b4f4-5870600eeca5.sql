-- Create comprehensive tables for enhanced Ideas platform

-- User achievements and gamification
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_type VARCHAR(100) NOT NULL,
  achievement_level VARCHAR(50) NOT NULL DEFAULT 'bronze',
  title VARCHAR(255) NOT NULL,
  description TEXT,
  points_earned INTEGER DEFAULT 0,
  icon_name VARCHAR(100),
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true
);

-- Innovation leaderboards
CREATE TABLE IF NOT EXISTS public.innovation_leaderboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  period_type VARCHAR(50) NOT NULL DEFAULT 'monthly',
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_points INTEGER DEFAULT 0,
  ideas_submitted INTEGER DEFAULT 0,
  ideas_implemented INTEGER DEFAULT 0,
  engagement_score NUMERIC DEFAULT 0,
  rank_position INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Idea multimedia attachments
CREATE TABLE IF NOT EXISTS public.idea_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size_mb NUMERIC,
  file_url TEXT NOT NULL,
  attachment_type VARCHAR(50) NOT NULL DEFAULT 'document',
  description TEXT,
  uploaded_by UUID,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_public BOOLEAN DEFAULT true,
  download_count INTEGER DEFAULT 0
);

-- Success stories and case studies
CREATE TABLE IF NOT EXISTS public.innovation_success_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL,
  detailed_story TEXT,
  implementation_timeline JSONB,
  roi_metrics JSONB,
  impact_areas JSONB,
  testimonials JSONB,
  media_urls JSONB,
  featured_image_url TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Idea recommendations and AI insights
CREATE TABLE IF NOT EXISTS public.idea_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  recommended_idea_id UUID NOT NULL,
  recommendation_type VARCHAR(100) NOT NULL,
  confidence_score NUMERIC DEFAULT 0,
  reasoning TEXT,
  interaction_type VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_viewed BOOLEAN DEFAULT false,
  is_clicked BOOLEAN DEFAULT false
);

-- Enhanced idea metrics and analytics
CREATE TABLE IF NOT EXISTS public.idea_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL,
  metric_date DATE NOT NULL,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  downloads_count INTEGER DEFAULT 0,
  implementation_progress NUMERIC DEFAULT 0,
  engagement_rate NUMERIC DEFAULT 0,
  virality_score NUMERIC DEFAULT 0,
  UNIQUE(idea_id, metric_date)
);

-- Innovation challenges with enhanced features
CREATE TABLE IF NOT EXISTS public.innovation_challenges_enhanced (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  base_challenge_id UUID,
  reward_points INTEGER DEFAULT 0,
  difficulty_level VARCHAR(50) DEFAULT 'medium',
  estimated_hours INTEGER,
  required_skills JSONB,
  success_criteria JSONB,
  mentorship_available BOOLEAN DEFAULT false,
  collaboration_encouraged BOOLEAN DEFAULT true,
  innovation_method VARCHAR(100),
  resource_links JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User innovation profiles
CREATE TABLE IF NOT EXISTS public.innovation_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  innovation_score INTEGER DEFAULT 0,
  expertise_areas JSONB DEFAULT '[]',
  achievement_badges JSONB DEFAULT '[]',
  mentorship_status VARCHAR(50) DEFAULT 'none',
  collaboration_preferences JSONB DEFAULT '{}',
  innovation_journey JSONB DEFAULT '[]',
  total_points INTEGER DEFAULT 0,
  level_tier VARCHAR(50) DEFAULT 'novice',
  bio TEXT,
  skills_tags JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innovation_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innovation_success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innovation_challenges_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innovation_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view achievements" ON public.user_achievements
  FOR SELECT USING (true);

CREATE POLICY "Users can view their own achievements" ON public.user_achievements
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view leaderboards" ON public.innovation_leaderboard
  FOR SELECT USING (true);

CREATE POLICY "Users can view idea attachments" ON public.idea_attachments
  FOR SELECT USING (is_public = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage their idea attachments" ON public.idea_attachments
  FOR ALL USING (auth.uid() = uploaded_by)
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Anyone can view published success stories" ON public.innovation_success_stories
  FOR SELECT USING (status = 'published');

CREATE POLICY "Team members can manage success stories" ON public.innovation_success_stories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM innovation_team_members itm 
      WHERE itm.user_id = auth.uid() AND itm.status = 'active'
    ) OR 
    has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Users can view their recommendations" ON public.idea_recommendations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view idea metrics" ON public.idea_metrics
  FOR SELECT USING (true);

CREATE POLICY "Team members can manage idea metrics" ON public.idea_metrics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM innovation_team_members itm 
      WHERE itm.user_id = auth.uid() AND itm.status = 'active'
    ) OR 
    has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Anyone can view enhanced challenges" ON public.innovation_challenges_enhanced
  FOR SELECT USING (true);

CREATE POLICY "Users can view innovation profiles" ON public.innovation_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own profile" ON public.innovation_profiles
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);