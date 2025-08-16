-- Performance Optimization Tables (Final Version)
-- Create user activity summary table for faster profile data access
CREATE TABLE IF NOT EXISTS user_activity_summary (
  user_id UUID PRIMARY KEY,
  total_submissions INTEGER DEFAULT 0,
  total_participations INTEGER DEFAULT 0,
  total_bookmarks INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  engagement_score NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user activity summary
ALTER TABLE user_activity_summary ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user activity summary
CREATE POLICY "Users can view their own activity summary" ON user_activity_summary
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own activity summary" ON user_activity_summary
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own activity summary" ON user_activity_summary
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create navigation state cache table for instant sidebar restoration
CREATE TABLE IF NOT EXISTS user_navigation_cache (
  user_id UUID PRIMARY KEY,
  sidebar_open BOOLEAN DEFAULT true,
  last_route TEXT,
  navigation_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on navigation cache
ALTER TABLE user_navigation_cache ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for navigation cache
CREATE POLICY "Users can manage their own navigation cache" ON user_navigation_cache
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create optimized indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles (created_at);
CREATE INDEX IF NOT EXISTS idx_challenges_status_created_at ON challenges (status, created_at);
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_status_created_at ON challenge_submissions (status, created_at);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_user_created ON challenge_participants (user_id, created_at);

-- Create simplified dashboard stats view (working with existing schema)
CREATE OR REPLACE VIEW dashboard_aggregated_stats AS
WITH user_stats AS (
  SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as new_users_7d,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_users_30d
  FROM profiles
),
challenge_stats AS (
  SELECT 
    COUNT(*) as total_challenges,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_challenges,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_challenges,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_challenges_30d
  FROM challenges
),
idea_stats AS (
  SELECT 
    COUNT(*) as total_ideas,
    COUNT(CASE WHEN status = 'submitted' THEN 1 END) as submitted_ideas,
    COUNT(CASE WHEN status = 'implemented' THEN 1 END) as implemented_ideas,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_ideas_30d
  FROM challenge_submissions
),
participation_stats AS (
  SELECT 
    COUNT(DISTINCT user_id) as total_participants,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_participants_30d
  FROM challenge_participants
)
SELECT 
  -- User metrics
  us.total_users,
  us.new_users_7d,
  us.new_users_30d,
  
  -- Challenge metrics
  cs.total_challenges,
  cs.active_challenges,
  cs.completed_challenges,
  cs.new_challenges_30d,
  
  -- Idea metrics
  idea_stats.total_ideas,
  idea_stats.submitted_ideas,
  idea_stats.implemented_ideas,
  idea_stats.new_ideas_30d,
  
  -- Participation metrics
  ps.total_participants,
  ps.new_participants_30d,
  
  -- Calculated KPIs
  CASE 
    WHEN cs.total_challenges > 0 THEN ROUND((idea_stats.total_ideas::float / cs.total_challenges)::numeric, 1)
    ELSE 0 
  END as ideas_per_challenge,
  
  CASE 
    WHEN idea_stats.total_ideas > 0 THEN ROUND((idea_stats.implemented_ideas::float / idea_stats.total_ideas * 100)::numeric, 1)
    ELSE 0 
  END as implementation_rate,
  
  -- Timestamp for cache invalidation
  NOW() as generated_at
FROM user_stats us, challenge_stats cs, idea_stats, participation_stats ps;

-- Create function to update user activity summary
CREATE OR REPLACE FUNCTION update_user_activity_summary(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  submission_count INTEGER;
  participation_count INTEGER;
  bookmark_count INTEGER;
  like_count INTEGER;
  calculated_engagement_score NUMERIC;
BEGIN
  -- Calculate metrics
  SELECT COUNT(*) INTO submission_count 
  FROM challenge_submissions WHERE submitted_by = p_user_id;
  
  SELECT COUNT(*) INTO participation_count 
  FROM challenge_participants WHERE user_id = p_user_id;
  
  SELECT COUNT(*) INTO bookmark_count 
  FROM challenge_bookmarks WHERE user_id = p_user_id;
  
  SELECT COUNT(*) INTO like_count 
  FROM challenge_likes WHERE user_id = p_user_id;
  
  -- Calculate engagement score
  calculated_engagement_score := (
    (submission_count * 10) + 
    (participation_count * 5) + 
    (bookmark_count * 2) + 
    (like_count * 1)
  );
  
  -- Insert or update summary
  INSERT INTO user_activity_summary (
    user_id, total_submissions, total_participations, 
    total_bookmarks, total_likes, engagement_score, updated_at
  ) VALUES (
    p_user_id, submission_count, participation_count, 
    bookmark_count, like_count, calculated_engagement_score, NOW()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    total_submissions = EXCLUDED.total_submissions,
    total_participations = EXCLUDED.total_participations,
    total_bookmarks = EXCLUDED.total_bookmarks,
    total_likes = EXCLUDED.total_likes,
    engagement_score = EXCLUDED.engagement_score,
    last_activity_at = NOW(),
    updated_at = NOW();
END;
$$;

-- Create function to get optimized dashboard data
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT row_to_json(stats) INTO result
  FROM dashboard_aggregated_stats stats;
  
  RETURN result;
END;
$$;