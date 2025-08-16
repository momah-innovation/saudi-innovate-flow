-- Performance Optimization: Create aggregated dashboard view
-- This replaces 6+ separate count queries with a single optimized view
CREATE OR REPLACE VIEW dashboard_aggregated_stats AS
WITH user_stats AS (
  SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN last_sign_in_at >= NOW() - INTERVAL '7 days' THEN 1 END) as active_users_7d,
    COUNT(CASE WHEN last_sign_in_at >= NOW() - INTERVAL '30 days' THEN 1 END) as active_users_30d,
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
event_stats AS (
  SELECT 
    COUNT(*) as total_events,
    COUNT(CASE WHEN start_date >= CURRENT_DATE THEN 1 END) as upcoming_events,
    COUNT(CASE WHEN start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE THEN 1 END) as active_events
  FROM events
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
  us.active_users_7d,
  us.active_users_30d,
  us.new_users_30d,
  CASE 
    WHEN us.total_users > 0 THEN ROUND((us.active_users_30d::float / us.total_users * 100)::numeric, 1)
    ELSE 0 
  END as user_activity_rate,
  
  -- Challenge metrics
  cs.total_challenges,
  cs.active_challenges,
  cs.completed_challenges,
  cs.new_challenges_30d,
  
  -- Idea metrics
  is.total_ideas,
  is.submitted_ideas,
  is.implemented_ideas,
  is.new_ideas_30d,
  
  -- Event metrics
  es.total_events,
  es.upcoming_events,
  es.active_events,
  
  -- Participation metrics
  ps.total_participants,
  ps.new_participants_30d,
  
  -- Calculated KPIs
  CASE 
    WHEN cs.total_challenges > 0 THEN ROUND((is.total_ideas::float / cs.total_challenges)::numeric, 1)
    ELSE 0 
  END as ideas_per_challenge,
  
  CASE 
    WHEN is.total_ideas > 0 THEN ROUND((is.implemented_ideas::float / is.total_ideas * 100)::numeric, 1)
    ELSE 0 
  END as implementation_rate,
  
  -- Timestamp for cache invalidation
  NOW() as generated_at
FROM user_stats us, challenge_stats cs, idea_stats is, event_stats es, participation_stats ps;

-- Create materialized view for even better performance (refreshed periodically)
CREATE MATERIALIZED VIEW dashboard_stats_cache AS
SELECT * FROM dashboard_aggregated_stats;

-- Create index for fast access
CREATE UNIQUE INDEX idx_dashboard_stats_cache_generated_at ON dashboard_stats_cache (generated_at);

-- Create function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_dashboard_stats_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW dashboard_stats_cache;
END;
$$;

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

-- Create optimized indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_last_sign_in_at ON profiles (last_sign_in_at);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles (created_at);
CREATE INDEX IF NOT EXISTS idx_challenges_status_created_at ON challenges (status, created_at);
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_status_created_at ON challenge_submissions (status, created_at);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_user_created ON challenge_participants (user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_events_date_range ON events (start_date, end_date);

-- Create function to get user dashboard data (optimized single call)
CREATE OR REPLACE FUNCTION get_user_dashboard_data(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  user_summary RECORD;
  recent_activities JSONB;
BEGIN
  -- Get user activity summary
  SELECT * INTO user_summary 
  FROM user_activity_summary 
  WHERE user_id = p_user_id;
  
  -- If no summary exists, create it
  IF NOT FOUND THEN
    PERFORM update_user_activity_summary(p_user_id);
    SELECT * INTO user_summary 
    FROM user_activity_summary 
    WHERE user_id = p_user_id;
  END IF;
  
  -- Get recent activities (limited to improve performance)
  SELECT COALESCE(json_agg(
    json_build_object(
      'id', ae.id,
      'event_type', ae.event_type,
      'entity_type', ae.entity_type,
      'created_at', ae.created_at,
      'metadata', ae.metadata
    ) ORDER BY ae.created_at DESC
  ), '[]'::json) INTO recent_activities
  FROM activity_events ae
  WHERE ae.user_id = p_user_id
    AND ae.created_at >= NOW() - INTERVAL '30 days'
  LIMIT 10;
  
  -- Build result
  result := jsonb_build_object(
    'user_summary', row_to_json(user_summary),
    'recent_activities', recent_activities,
    'generated_at', NOW()
  );
  
  RETURN result;
END;
$$;

-- Create trigger to auto-update activity summary on key actions
CREATE OR REPLACE FUNCTION trigger_update_user_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update for submission-related changes
  IF TG_TABLE_NAME = 'challenge_submissions' THEN
    PERFORM update_user_activity_summary(NEW.submitted_by);
  END IF;
  
  -- Update for participation-related changes
  IF TG_TABLE_NAME = 'challenge_participants' THEN
    PERFORM update_user_activity_summary(NEW.user_id);
  END IF;
  
  -- Update for bookmark-related changes
  IF TG_TABLE_NAME = 'challenge_bookmarks' THEN
    PERFORM update_user_activity_summary(NEW.user_id);
  END IF;
  
  -- Update for like-related changes
  IF TG_TABLE_NAME = 'challenge_likes' THEN
    PERFORM update_user_activity_summary(NEW.user_id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create triggers for automatic activity summary updates
DROP TRIGGER IF EXISTS trigger_submission_activity ON challenge_submissions;
CREATE TRIGGER trigger_submission_activity
  AFTER INSERT OR UPDATE ON challenge_submissions
  FOR EACH ROW EXECUTE FUNCTION trigger_update_user_activity();

DROP TRIGGER IF EXISTS trigger_participation_activity ON challenge_participants;
CREATE TRIGGER trigger_participation_activity
  AFTER INSERT OR UPDATE ON challenge_participants
  FOR EACH ROW EXECUTE FUNCTION trigger_update_user_activity();

DROP TRIGGER IF EXISTS trigger_bookmark_activity ON challenge_bookmarks;
CREATE TRIGGER trigger_bookmark_activity
  AFTER INSERT OR UPDATE ON challenge_bookmarks
  FOR EACH ROW EXECUTE FUNCTION trigger_update_user_activity();

DROP TRIGGER IF EXISTS trigger_like_activity ON challenge_likes;
CREATE TRIGGER trigger_like_activity
  AFTER INSERT OR UPDATE ON challenge_likes
  FOR EACH ROW EXECUTE FUNCTION trigger_update_user_activity();