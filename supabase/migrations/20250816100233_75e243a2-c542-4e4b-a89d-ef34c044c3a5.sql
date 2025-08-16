-- Fix security issues: Remove SECURITY DEFINER from view and add proper RLS policies
-- Drop and recreate the view without security definer
DROP VIEW IF EXISTS dashboard_aggregated_stats;

-- Create the view without security definer (regular view)
CREATE VIEW dashboard_aggregated_stats AS
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

-- Update functions to have proper search_path
CREATE OR REPLACE FUNCTION update_user_activity_summary(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

-- Update get_dashboard_stats function with proper search_path
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT row_to_json(stats) INTO result
  FROM dashboard_aggregated_stats stats;
  
  RETURN result;
END;
$$;