-- Phase 1.1: Create Database Views for Admin Dashboard Metrics (Fixed column references)

-- Drop existing views if they exist
DROP VIEW IF EXISTS admin_dashboard_metrics_view;
DROP VIEW IF EXISTS challenges_metrics_view;
DROP VIEW IF EXISTS system_metrics_view;
DROP VIEW IF EXISTS security_metrics_view;

-- 1. Create admin_dashboard_metrics_view for user statistics
CREATE OR REPLACE VIEW admin_dashboard_metrics_view AS
SELECT 
  -- User metrics
  (SELECT COUNT(*) FROM auth.users) as total_users,
  (SELECT COUNT(*) FROM auth.users WHERE last_sign_in_at > NOW() - INTERVAL '30 days') as active_users_30d,
  (SELECT COUNT(*) FROM auth.users WHERE created_at > NOW() - INTERVAL '7 days') as new_users_7d,
  (SELECT COUNT(*) FROM auth.users WHERE created_at > NOW() - INTERVAL '30 days') as new_users_30d,
  
  -- User role distribution (using correct role names)
  (SELECT COUNT(*) FROM user_roles WHERE role = 'admin' AND is_active = true) as admin_count,
  (SELECT COUNT(*) FROM user_roles WHERE role = 'innovator' AND is_active = true) as innovator_count,
  (SELECT COUNT(*) FROM user_roles WHERE role = 'external_expert' AND is_active = true) as expert_count,
  (SELECT COUNT(*) FROM user_roles WHERE role = 'organization_member' AND is_active = true) as partner_count,
  (SELECT COUNT(*) FROM user_roles WHERE role = 'evaluator' AND is_active = true) as evaluator_count,
  (SELECT COUNT(*) FROM user_roles WHERE role = 'domain_expert' AND is_active = true) as domain_expert_count,
  
  -- Innovation team members
  (SELECT COUNT(*) FROM innovation_team_members WHERE status = 'active') as team_members_count,
  
  -- Calculate growth rates
  CASE 
    WHEN (SELECT COUNT(*) FROM auth.users WHERE created_at BETWEEN NOW() - INTERVAL '60 days' AND NOW() - INTERVAL '30 days') > 0 
    THEN ROUND(
      ((SELECT COUNT(*) FROM auth.users WHERE created_at > NOW() - INTERVAL '30 days')::NUMERIC - 
       (SELECT COUNT(*) FROM auth.users WHERE created_at BETWEEN NOW() - INTERVAL '60 days' AND NOW() - INTERVAL '30 days')::NUMERIC) /
      (SELECT COUNT(*) FROM auth.users WHERE created_at BETWEEN NOW() - INTERVAL '60 days' AND NOW() - INTERVAL '30 days')::NUMERIC * 100, 2
    )
    ELSE 0 
  END as user_growth_rate_percentage,
  
  NOW() as last_updated;

-- 2. Create challenges_metrics_view for challenge statistics (fixed column qualifiers)
CREATE OR REPLACE VIEW challenges_metrics_view AS
SELECT 
  -- Challenge counts by status
  COUNT(*) as total_challenges,
  COUNT(*) FILTER (WHERE c.status = 'active') as active_challenges,
  COUNT(*) FILTER (WHERE c.status = 'published') as published_challenges,
  COUNT(*) FILTER (WHERE c.status = 'completed') as completed_challenges,
  COUNT(*) FILTER (WHERE c.status = 'draft') as draft_challenges,
  COUNT(*) FILTER (WHERE c.status = 'evaluation') as evaluation_challenges,
  
  -- Challenge submissions and participation
  (SELECT COUNT(*) FROM challenge_submissions) as total_submissions,
  (SELECT COUNT(*) FROM challenge_participants) as total_participants,
  (SELECT COUNT(DISTINCT user_id) FROM challenge_participants) as unique_participants,
  
  -- Recent activity (last 30 days)
  COUNT(*) FILTER (WHERE c.created_at > NOW() - INTERVAL '30 days') as new_challenges_30d,
  (SELECT COUNT(*) FROM challenge_submissions WHERE created_at > NOW() - INTERVAL '30 days') as new_submissions_30d,
  (SELECT COUNT(*) FROM challenge_participants WHERE created_at > NOW() - INTERVAL '30 days') as new_participants_30d,
  
  -- Priority distribution
  COUNT(*) FILTER (WHERE c.priority_level = 'critical') as critical_priority_count,
  COUNT(*) FILTER (WHERE c.priority_level = 'high') as high_priority_count,
  COUNT(*) FILTER (WHERE c.priority_level = 'medium') as medium_priority_count,
  COUNT(*) FILTER (WHERE c.priority_level = 'low') as low_priority_count,
  
  -- Average metrics
  ROUND(AVG(
    CASE 
      WHEN cs.score IS NOT NULL THEN cs.score 
      ELSE 0 
    END
  ), 2) as average_submission_score,
  
  -- Completion rate
  CASE 
    WHEN COUNT(*) FILTER (WHERE c.status IN ('active', 'published', 'completed')) > 0 
    THEN ROUND(
      COUNT(*) FILTER (WHERE c.status = 'completed')::NUMERIC / 
      COUNT(*) FILTER (WHERE c.status IN ('active', 'published', 'completed'))::NUMERIC * 100, 2
    )
    ELSE 0 
  END as completion_rate_percentage,
  
  NOW() as last_updated
FROM challenges c
LEFT JOIN challenge_submissions cs ON c.id = cs.challenge_id;

-- 3. Create system_metrics_view for system performance
CREATE OR REPLACE VIEW system_metrics_view AS
SELECT 
  -- Storage metrics
  (SELECT COUNT(*) FROM storage.objects) as total_files,
  (SELECT COUNT(DISTINCT bucket_id) FROM storage.objects) as total_buckets,
  (SELECT COALESCE(SUM((metadata->>'size')::bigint), 0) FROM storage.objects) as total_storage_bytes,
  
  -- Storage by bucket
  (SELECT COUNT(*) FROM storage.objects WHERE bucket_id = 'avatars') as avatar_files_count,
  (SELECT COUNT(*) FROM storage.objects WHERE bucket_id = 'challenge-attachments') as challenge_files_count,
  (SELECT COUNT(*) FROM storage.objects WHERE bucket_id = 'idea-attachments') as idea_files_count,
  
  -- System activity metrics
  (SELECT COUNT(*) FROM analytics_events WHERE timestamp > NOW() - INTERVAL '24 hours') as events_24h,
  (SELECT COUNT(*) FROM analytics_events WHERE timestamp > NOW() - INTERVAL '7 days') as events_7d,
  (SELECT COUNT(DISTINCT user_id) FROM analytics_events WHERE timestamp > NOW() - INTERVAL '24 hours' AND user_id IS NOT NULL) as active_users_24h,
  
  -- Database table sizes (approximate)
  (SELECT COUNT(*) FROM challenges) as challenges_table_size,
  (SELECT COUNT(*) FROM challenge_submissions) as submissions_table_size,
  (SELECT COUNT(*) FROM events) as events_table_size,
  (SELECT COUNT(*) FROM profiles) as profiles_table_size,
  
  -- Recent file uploads
  (SELECT COUNT(*) FROM storage.objects WHERE created_at > NOW() - INTERVAL '24 hours') as new_files_24h,
  (SELECT COUNT(*) FROM storage.objects WHERE created_at > NOW() - INTERVAL '7 days') as new_files_7d,
  
  -- Performance indicators
  EXTRACT(EPOCH FROM NOW()) as current_timestamp,
  NOW() as last_updated;

-- 4. Create security_metrics_view for security statistics
CREATE OR REPLACE VIEW security_metrics_view AS
SELECT 
  -- Security audit metrics
  (SELECT COUNT(*) FROM security_audit_log WHERE created_at > NOW() - INTERVAL '24 hours') as security_events_24h,
  (SELECT COUNT(*) FROM security_audit_log WHERE created_at > NOW() - INTERVAL '7 days') as security_events_7d,
  (SELECT COUNT(*) FROM security_audit_log WHERE risk_level = 'high' AND created_at > NOW() - INTERVAL '7 days') as high_risk_events_7d,
  (SELECT COUNT(*) FROM security_audit_log WHERE risk_level = 'critical' AND created_at > NOW() - INTERVAL '7 days') as critical_risk_events_7d,
  
  -- Authentication metrics
  (SELECT COUNT(*) FROM auth.users WHERE last_sign_in_at > NOW() - INTERVAL '24 hours') as logins_24h,
  (SELECT COUNT(*) FROM auth.users WHERE last_sign_in_at > NOW() - INTERVAL '7 days') as logins_7d,
  (SELECT COUNT(*) FROM auth.users WHERE created_at > NOW() - INTERVAL '24 hours') as new_registrations_24h,
  
  -- Rate limiting and suspicious activity
  (SELECT COUNT(*) FROM rate_limits WHERE created_at > NOW() - INTERVAL '24 hours') as rate_limit_hits_24h,
  (SELECT COUNT(*) FROM suspicious_activities WHERE created_at > NOW() - INTERVAL '7 days') as suspicious_activities_7d,
  (SELECT COUNT(*) FROM suspicious_activities WHERE severity = 'high' AND created_at > NOW() - INTERVAL '7 days') as high_severity_suspicious_7d,
  
  -- Role management metrics
  (SELECT COUNT(*) FROM user_roles WHERE is_active = true) as active_role_assignments,
  (SELECT COUNT(*) FROM role_approval_requests WHERE status = 'pending') as pending_role_requests,
  (SELECT COUNT(*) FROM role_audit_log WHERE created_at > NOW() - INTERVAL '7 days') as role_changes_7d,
  
  -- Failed operations
  (SELECT COUNT(*) FROM security_audit_log WHERE action_type LIKE '%DENIED%' AND created_at > NOW() - INTERVAL '24 hours') as access_denied_24h,
  (SELECT COUNT(*) FROM security_audit_log WHERE action_type LIKE '%FAILED%' AND created_at > NOW() - INTERVAL '24 hours') as failed_operations_24h,
  
  -- Overall security score (0-100 based on recent incidents)
  GREATEST(0, 100 - (
    (SELECT COUNT(*) FROM security_audit_log WHERE risk_level = 'critical' AND created_at > NOW() - INTERVAL '7 days') * 20 +
    (SELECT COUNT(*) FROM security_audit_log WHERE risk_level = 'high' AND created_at > NOW() - INTERVAL '7 days') * 5 +
    (SELECT COUNT(*) FROM suspicious_activities WHERE severity = 'high' AND created_at > NOW() - INTERVAL '7 days') * 10
  )) as security_score,
  
  NOW() as last_updated;

-- Grant access to admin dashboard metrics views
GRANT SELECT ON admin_dashboard_metrics_view TO authenticated;
GRANT SELECT ON challenges_metrics_view TO authenticated;  
GRANT SELECT ON system_metrics_view TO authenticated;
GRANT SELECT ON security_metrics_view TO authenticated;