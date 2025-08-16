-- Performance Optimization: Create aggregated dashboard view (Fixed syntax)
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
  idea_stats.total_ideas,
  idea_stats.submitted_ideas,
  idea_stats.implemented_ideas,
  idea_stats.new_ideas_30d,
  
  -- Event metrics
  es.total_events,
  es.upcoming_events,
  es.active_events,
  
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
FROM user_stats us, challenge_stats cs, idea_stats, event_stats es, participation_stats ps;