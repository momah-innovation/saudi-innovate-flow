-- Enhanced get_analytics_data function with RBAC and error handling
CREATE OR REPLACE FUNCTION public.get_analytics_data(
  p_user_id UUID,
  p_user_role app_role,
  p_filters JSONB DEFAULT '{}'::JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result JSONB;
  timeframe TEXT := COALESCE(p_filters->>'timeframe', '30d');
  days_back INTEGER;
  start_date TIMESTAMP WITH TIME ZONE;
  error_context TEXT;
BEGIN
  -- Validate user has access to analytics
  IF NOT (
    p_user_role IN ('admin', 'super_admin') 
    OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = p_user_id AND status = 'active')
  ) THEN
    RAISE EXCEPTION 'Access denied: insufficient privileges for analytics data';
  END IF;

  -- Calculate date range with error handling
  BEGIN
    days_back := CASE timeframe
      WHEN '7d' THEN 7
      WHEN '30d' THEN 30
      WHEN '90d' THEN 90
      WHEN '1y' THEN 365
      ELSE 30
    END;
    
    start_date := NOW() - (days_back || ' days')::INTERVAL;
  EXCEPTION WHEN OTHERS THEN
    -- Fallback to 30 days if date calculation fails
    days_back := 30;
    start_date := NOW() - INTERVAL '30 days';
    error_context := 'Date calculation fallback applied';
  END;

  -- Build result with comprehensive error handling
  BEGIN
    WITH user_metrics AS (
      SELECT 
        COALESCE(COUNT(DISTINCT p.id), 0) as total_users,
        COALESCE(COUNT(DISTINCT CASE WHEN p.last_sign_in_at >= start_date THEN p.id END), 0) as active_users,
        COALESCE(COUNT(DISTINCT CASE WHEN p.created_at >= start_date THEN p.id END), 0) as new_users
      FROM profiles p
    ),
    challenge_metrics AS (
      SELECT 
        COALESCE(COUNT(*), 0) as total_challenges,
        COALESCE(COUNT(CASE WHEN status = 'active' THEN 1 END), 0) as active_challenges,
        COALESCE(COUNT(CASE WHEN status = 'completed' THEN 1 END), 0) as completed_challenges
      FROM challenges c
      WHERE (p_user_role IN ('admin', 'super_admin') OR c.sensitivity_level = 'normal')
    ),
    submission_metrics AS (
      SELECT 
        COALESCE(COUNT(*), 0) as total_submissions,
        COALESCE(COUNT(CASE WHEN status = 'implemented' THEN 1 END), 0) as implemented_ideas
      FROM challenge_submissions cs
      JOIN challenges c ON cs.challenge_id = c.id
      WHERE (p_user_role IN ('admin', 'super_admin') OR c.sensitivity_level = 'normal')
    ),
    engagement_metrics AS (
      SELECT 
        COALESCE(COUNT(*), 0) as total_participants,
        COALESCE(COUNT(CASE WHEN created_at >= start_date THEN 1 END), 0) as recent_participants
      FROM challenge_participants
    )
    SELECT jsonb_build_object(
      'users', jsonb_build_object(
        'total', COALESCE(um.total_users, 0),
        'active', COALESCE(um.active_users, 0), 
        'new', COALESCE(um.new_users, 0),
        'growthRate', CASE 
          WHEN um.total_users > 0 THEN 
            ROUND((um.active_users::float / um.total_users * 100)::numeric, 1)
          ELSE 0 
        END,
        'trend', CASE 
          WHEN um.active_users::float / NULLIF(um.total_users, 0) > 0.7 THEN 'up'
          WHEN um.active_users::float / NULLIF(um.total_users, 0) < 0.3 THEN 'down'
          ELSE 'stable'
        END
      ),
      'challenges', jsonb_build_object(
        'total', COALESCE(cm.total_challenges, 0),
        'active', COALESCE(cm.active_challenges, 0),
        'completed', COALESCE(cm.completed_challenges, 0),
        'submissions', COALESCE(sm.total_submissions, 0),
        'completionRate', CASE 
          WHEN cm.total_challenges > 0 THEN 
            ROUND((sm.total_submissions::float / cm.total_challenges * 100)::numeric, 1)
          ELSE 0 
        END
      ),
      'business', jsonb_build_object(
        'implementedIdeas', COALESCE(sm.implemented_ideas, 0),
        'budgetUtilized', 0,
        'partnershipValue', 0,
        'roi', CASE 
          WHEN sm.total_submissions > 0 THEN 
            ROUND((sm.implemented_ideas::float / sm.total_submissions * 100)::numeric, 1)
          ELSE 0 
        END
      ),
      'engagement', jsonb_build_object(
        'totalParticipants', COALESCE(em.total_participants, 0),
        'recentParticipants', COALESCE(em.recent_participants, 0),
        'participationRate', CASE 
          WHEN um.total_users > 0 THEN 
            ROUND((em.total_participants::float / um.total_users * 100)::numeric, 1)
          ELSE 0 
        END,
        'avgSessionDuration', 0,
        'pageViews', 0,
        'returnRate', 0
      ),
      'metadata', jsonb_build_object(
        'timeframe', timeframe,
        'user_role', p_user_role,
        'generated_at', NOW(),
        'error_context', COALESCE(error_context, 'none'),
        'data_quality', 'complete'
      )
    ) INTO result
    FROM user_metrics um, challenge_metrics cm, submission_metrics sm, engagement_metrics em;

  EXCEPTION WHEN OTHERS THEN
    -- Comprehensive error fallback
    result := jsonb_build_object(
      'users', jsonb_build_object('total', 0, 'active', 0, 'new', 0, 'growthRate', 0, 'trend', 'stable'),
      'challenges', jsonb_build_object('total', 0, 'active', 0, 'completed', 0, 'submissions', 0, 'completionRate', 0),
      'business', jsonb_build_object('implementedIdeas', 0, 'budgetUtilized', 0, 'partnershipValue', 0, 'roi', 0),
      'engagement', jsonb_build_object('totalParticipants', 0, 'recentParticipants', 0, 'participationRate', 0, 'avgSessionDuration', 0, 'pageViews', 0, 'returnRate', 0),
      'metadata', jsonb_build_object(
        'timeframe', timeframe,
        'user_role', p_user_role,
        'generated_at', NOW(),
        'error_context', 'data_fetch_failed',
        'data_quality', 'fallback',
        'error_message', SQLERRM
      )
    );
  END;

  -- Log analytics access with error handling
  BEGIN
    INSERT INTO analytics_events (user_id, event_type, event_category, properties)
    VALUES (
      p_user_id, 
      'analytics_access', 
      'system_metrics',
      jsonb_build_object(
        'role', p_user_role,
        'filters', p_filters,
        'timeframe', timeframe,
        'success', CASE WHEN result->'metadata'->>'data_quality' = 'complete' THEN true ELSE false END
      )
    );
  EXCEPTION WHEN OTHERS THEN
    -- Continue even if logging fails
    NULL;
  END;

  RETURN result;
END;
$$;

-- Security-specific analytics function with enhanced error handling
CREATE OR REPLACE FUNCTION public.get_security_analytics(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Only admins can access security analytics
  IF NOT has_role(p_user_id, 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin privileges required for security analytics';
  END IF;

  BEGIN
    WITH security_stats AS (
      SELECT 
        COALESCE(COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours'), 0) as recent_events,
        COALESCE(COUNT(*) FILTER (WHERE risk_level = 'high'), 0) as high_risk_events,
        COALESCE(COUNT(*) FILTER (WHERE risk_level = 'critical'), 0) as critical_events
      FROM security_audit_log
    ),
    rate_limit_stats AS (
      SELECT 
        COALESCE(COUNT(*), 0) as violations,
        COALESCE(COUNT(DISTINCT user_id), 0) as affected_users
      FROM rate_limits 
      WHERE request_count > 100 AND created_at >= NOW() - INTERVAL '24 hours'
    ),
    suspicious_stats AS (
      SELECT 
        COALESCE(COUNT(*), 0) as total_activities,
        COALESCE(COUNT(*) FILTER (WHERE severity = 'high'), 0) as high_severity
      FROM suspicious_activities
      WHERE created_at >= NOW() - INTERVAL '24 hours'
    )
    SELECT jsonb_build_object(
      'riskLevel', CASE 
        WHEN ss.critical_events > 0 THEN 'critical'
        WHEN ss.high_risk_events > 3 THEN 'high'
        WHEN ss.high_risk_events > 0 THEN 'medium'
        ELSE 'low'
      END,
      'threatCount', COALESCE(ss.high_risk_events + ss.critical_events, 0),
      'suspiciousActivities', COALESCE(sus.total_activities, 0),
      'rateLimitViolations', COALESCE(rl.violations, 0),
      'failedLogins', COALESCE((
        SELECT COUNT(*) FROM security_audit_log 
        WHERE action_type = 'FAILED_LOGIN' 
        AND created_at >= NOW() - INTERVAL '24 hours'
      ), 0),
      'securityScore', CASE 
        WHEN ss.critical_events > 0 THEN 60
        WHEN ss.high_risk_events > 5 THEN 75
        WHEN ss.high_risk_events > 0 THEN 85
        ELSE 98
      END,
      'metadata', jsonb_build_object(
        'generated_at', NOW(),
        'data_quality', 'complete'
      )
    ) INTO result
    FROM security_stats ss, rate_limit_stats rl, suspicious_stats sus;

  EXCEPTION WHEN OTHERS THEN
    -- Security fallback with minimal data
    result := jsonb_build_object(
      'riskLevel', 'unknown',
      'threatCount', 0,
      'suspiciousActivities', 0,
      'rateLimitViolations', 0,
      'failedLogins', 0,
      'securityScore', 0,
      'metadata', jsonb_build_object(
        'generated_at', NOW(),
        'data_quality', 'fallback',
        'error_message', SQLERRM
      )
    );
  END;

  -- Log security analytics access
  BEGIN
    PERFORM log_security_event(
      'SECURITY_ANALYTICS_ACCESS',
      'security_metrics',
      NULL,
      jsonb_build_object('accessed_by', p_user_id),
      'medium'
    );
  EXCEPTION WHEN OTHERS THEN
    -- Continue even if logging fails
    NULL;
  END;

  RETURN result;
END;
$$;

-- Role-specific metrics function with comprehensive error handling
CREATE OR REPLACE FUNCTION public.get_role_specific_analytics(
  p_user_id UUID,
  p_user_role app_role,
  p_filters JSONB DEFAULT '{}'::JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER  
SET search_path TO 'public'
AS $$
DECLARE
  result JSONB := '{}'::JSONB;
  department_filter UUID;
  sector_filter UUID;
BEGIN
  -- Base access validation
  IF NOT (
    p_user_role IN ('admin', 'super_admin') 
    OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = p_user_id AND status = 'active')
  ) THEN
    RAISE EXCEPTION 'Access denied: insufficient privileges for role-specific analytics';
  END IF;

  -- Extract filters with error handling
  BEGIN
    department_filter := (p_filters->>'department')::UUID;
    sector_filter := (p_filters->>'sector')::UUID;
  EXCEPTION WHEN OTHERS THEN
    department_filter := NULL;
    sector_filter := NULL;
  END;

  -- Admin/Super Admin metrics with error handling
  IF p_user_role IN ('admin', 'super_admin') THEN
    BEGIN
      result := result || jsonb_build_object(
        'admin_metrics', jsonb_build_object(
          'total_roles_assigned', COALESCE((SELECT COUNT(*) FROM user_roles WHERE is_active = true), 0),
          'pending_approvals', COALESCE((SELECT COUNT(*) FROM role_approval_requests WHERE status = 'pending'), 0),
          'system_health', jsonb_build_object(
            'active_sessions', COALESCE((SELECT COUNT(DISTINCT user_id) FROM profiles WHERE last_sign_in_at >= NOW() - INTERVAL '1 hour'), 0),
            'storage_usage', 0,
            'error_rate', 0,
            'uptime', 99.9
          ),
          'data_quality', 'complete'
        )
      );
    EXCEPTION WHEN OTHERS THEN
      result := result || jsonb_build_object(
        'admin_metrics', jsonb_build_object(
          'total_roles_assigned', 0,
          'pending_approvals', 0,
          'system_health', jsonb_build_object('active_sessions', 0, 'storage_usage', 0, 'error_rate', 0, 'uptime', 0),
          'data_quality', 'fallback',
          'error_message', SQLERRM
        )
      );
    END;
  END IF;

  -- Innovation Team Member metrics with error handling
  IF EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = p_user_id AND status = 'active') THEN
    BEGIN
      result := result || jsonb_build_object(
        'team_metrics', jsonb_build_object(
          'managed_challenges', COALESCE((
            SELECT COUNT(*) FROM challenges 
            WHERE created_by = p_user_id 
            AND (department_filter IS NULL OR department_id = department_filter)
            AND (sector_filter IS NULL OR sector_id = sector_filter)
          ), 0),
          'reviewed_submissions', COALESCE((
            SELECT COUNT(*) FROM challenge_submissions cs
            JOIN challenges c ON cs.challenge_id = c.id
            WHERE c.created_by = p_user_id AND cs.status != 'draft'
            AND (department_filter IS NULL OR c.department_id = department_filter)
          ), 0),
          'team_performance', jsonb_build_object(
            'challenges_completed', COALESCE((
              SELECT COUNT(*) FROM challenges 
              WHERE created_by = p_user_id AND status = 'completed'
            ), 0),
            'avg_submissions_per_challenge', 0
          ),
          'data_quality', 'complete'
        )
      );
    EXCEPTION WHEN OTHERS THEN
      result := result || jsonb_build_object(
        'team_metrics', jsonb_build_object(
          'managed_challenges', 0,
          'reviewed_submissions', 0,
          'team_performance', jsonb_build_object('challenges_completed', 0, 'avg_submissions_per_challenge', 0),
          'data_quality', 'fallback',
          'error_message', SQLERRM
        )
      );
    END;
  END IF;

  -- User-specific personal metrics with error handling
  BEGIN
    result := result || jsonb_build_object(
      'personal_metrics', jsonb_build_object(
        'submissions_count', COALESCE((SELECT COUNT(*) FROM challenge_submissions WHERE submitted_by = p_user_id), 0),
        'participations', COALESCE((SELECT COUNT(*) FROM challenge_participants WHERE user_id = p_user_id), 0),
        'events_attended', COALESCE((SELECT COUNT(*) FROM event_participants WHERE user_id = p_user_id), 0),
        'bookmarks_count', COALESCE((SELECT COUNT(*) FROM challenge_bookmarks WHERE user_id = p_user_id), 0),
        'engagement_score', COALESCE((
          SELECT ROUND(AVG(CASE WHEN status = 'implemented' THEN 100 WHEN status = 'reviewed' THEN 75 ELSE 25 END))
          FROM challenge_submissions WHERE submitted_by = p_user_id
        ), 0),
        'data_quality', 'complete'
      )
    );
  EXCEPTION WHEN OTHERS THEN
    result := result || jsonb_build_object(
      'personal_metrics', jsonb_build_object(
        'submissions_count', 0,
        'participations', 0,
        'events_attended', 0,
        'bookmarks_count', 0,
        'engagement_score', 0,
        'data_quality', 'fallback',
        'error_message', SQLERRM
      )
    );
  END;

  -- Add metadata
  result := result || jsonb_build_object(
    'metadata', jsonb_build_object(
      'user_role', p_user_role,
      'filters_applied', p_filters,
      'generated_at', NOW(),
      'version', '1.0.0'
    )
  );

  RETURN result;
END;
$$;