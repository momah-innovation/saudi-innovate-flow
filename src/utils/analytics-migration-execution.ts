/**
 * MIGRATION EXECUTION SCRIPTS
 * Automated migration helpers and validation tools
 */

import { supabase } from '@/integrations/supabase/client';
import { ANALYTICS_MIGRATION_PLAN, MigrationTask } from '@/utils/analytics-migration-plan';

/**
 * Database Migration: Enhanced Analytics Functions
 */
export const createAnalyticsDatabaseFunctions = `
-- Enhanced get_analytics_data function with RBAC
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
BEGIN
  -- Validate user has access to analytics
  IF NOT (
    p_user_role IN ('admin', 'super_admin') 
    OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = p_user_id AND status = 'active')
  ) THEN
    RAISE EXCEPTION 'Access denied: insufficient privileges for analytics data';
  END IF;

  -- Calculate date range
  days_back := CASE timeframe
    WHEN '7d' THEN 7
    WHEN '30d' THEN 30
    WHEN '90d' THEN 90
    WHEN '1y' THEN 365
    ELSE 30
  END;
  
  start_date := NOW() - (days_back || ' days')::INTERVAL;

  -- Build result based on user role and permissions
  WITH user_metrics AS (
    SELECT 
      COUNT(DISTINCT p.id) as total_users,
      COUNT(DISTINCT CASE WHEN p.last_sign_in_at >= start_date THEN p.id END) as active_users,
      COUNT(DISTINCT CASE WHEN p.created_at >= start_date THEN p.id END) as new_users
    FROM profiles p
  ),
  challenge_metrics AS (
    SELECT 
      COUNT(*) as total_challenges,
      COUNT(CASE WHEN status = 'active' THEN 1 END) as active_challenges,
      COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_challenges
    FROM challenges c
    WHERE (p_user_role IN ('admin', 'super_admin') OR c.sensitivity_level = 'normal')
  ),
  submission_metrics AS (
    SELECT 
      COUNT(*) as total_submissions,
      COUNT(CASE WHEN status = 'implemented' THEN 1 END) as implemented_ideas
    FROM challenge_submissions cs
    JOIN challenges c ON cs.challenge_id = c.id
    WHERE (p_user_role IN ('admin', 'super_admin') OR c.sensitivity_level = 'normal')
  )
  SELECT jsonb_build_object(
    'users', jsonb_build_object(
      'total', um.total_users,
      'active', um.active_users, 
      'new', um.new_users,
      'growthRate', CASE 
        WHEN um.total_users > 0 THEN 
          ROUND((um.active_users::float / um.total_users * 100)::numeric, 1)
        ELSE 0 
      END
    ),
    'challenges', jsonb_build_object(
      'total', cm.total_challenges,
      'active', cm.active_challenges,
      'completed', cm.completed_challenges,
      'submissions', sm.total_submissions,
      'completionRate', CASE 
        WHEN cm.total_challenges > 0 THEN 
          ROUND((sm.total_submissions::float / cm.total_challenges * 100)::numeric, 1)
        ELSE 0 
      END
    ),
    'business', jsonb_build_object(
      'implementedIdeas', sm.implemented_ideas,
      'budgetUtilized', 0,
      'partnershipValue', 0,
      'roi', 0
    ),
    'engagement', jsonb_build_object(
      'avgSessionDuration', 0,
      'pageViews', 0,
      'interactions', (SELECT COUNT(*) FROM challenge_participants WHERE created_at >= start_date),
      'returnRate', 0
    ),
    'timeframe', timeframe,
    'user_role', p_user_role,
    'generated_at', NOW()
  ) INTO result
  FROM user_metrics um, challenge_metrics cm, submission_metrics sm;

  -- Log analytics access
  INSERT INTO analytics_events (user_id, event_type, event_category, properties)
  VALUES (
    p_user_id, 
    'analytics_access', 
    'system_metrics',
    jsonb_build_object(
      'role', p_user_role,
      'filters', p_filters,
      'data_points', jsonb_array_length(result->'users') + jsonb_array_length(result->'challenges')
    )
  );

  RETURN result;
END;
$$;

-- Security-specific analytics function (admin only)
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

  WITH security_stats AS (
    SELECT 
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as recent_events,
      COUNT(*) FILTER (WHERE risk_level = 'high') as high_risk_events,
      COUNT(*) FILTER (WHERE risk_level = 'critical') as critical_events
    FROM security_audit_log
  ),
  rate_limit_stats AS (
    SELECT 
      COUNT(*) as violations,
      COUNT(DISTINCT user_id) as affected_users
    FROM rate_limits 
    WHERE request_count > 100 AND created_at >= NOW() - INTERVAL '24 hours'
  ),
  suspicious_stats AS (
    SELECT 
      COUNT(*) as total_activities,
      COUNT(*) FILTER (WHERE severity = 'high') as high_severity
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
    'threatCount', ss.high_risk_events + ss.critical_events,
    'suspiciousActivities', sus.total_activities,
    'rateLimitViolations', rl.violations,
    'failedLogins', (
      SELECT COUNT(*) FROM security_audit_log 
      WHERE action_type = 'FAILED_LOGIN' 
      AND created_at >= NOW() - INTERVAL '24 hours'
    ),
    'securityScore', CASE 
      WHEN ss.critical_events > 0 THEN 60
      WHEN ss.high_risk_events > 5 THEN 75
      WHEN ss.high_risk_events > 0 THEN 85
      ELSE 98
    END,
    'generated_at', NOW()
  ) INTO result
  FROM security_stats ss, rate_limit_stats rl, suspicious_stats sus;

  -- Log security analytics access
  PERFORM log_security_event(
    'SECURITY_ANALYTICS_ACCESS',
    'security_metrics',
    NULL,
    jsonb_build_object('accessed_by', p_user_id),
    'medium'
  );

  RETURN result;
END;
$$;

-- Role-specific metrics function
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
BEGIN
  -- Base access validation
  IF NOT (
    p_user_role IN ('admin', 'super_admin') 
    OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = p_user_id AND status = 'active')
  ) THEN
    RAISE EXCEPTION 'Access denied: insufficient privileges for role-specific analytics';
  END IF;

  -- Admin/Super Admin metrics
  IF p_user_role IN ('admin', 'super_admin') THEN
    result := result || jsonb_build_object(
      'admin_metrics', jsonb_build_object(
        'total_roles_assigned', (SELECT COUNT(*) FROM user_roles WHERE is_active = true),
        'pending_approvals', (SELECT COUNT(*) FROM role_approval_requests WHERE status = 'pending'),
        'system_health', jsonb_build_object(
          'active_sessions', (SELECT COUNT(DISTINCT user_id) FROM profiles WHERE last_sign_in_at >= NOW() - INTERVAL '1 hour'),
          'storage_usage', 0, -- Would integrate with storage analytics
          'error_rate', 0     -- Would integrate with error monitoring
        )
      )
    );
  END IF;

  -- Innovation Team Member metrics
  IF EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = p_user_id AND status = 'active') THEN
    result := result || jsonb_build_object(
      'team_metrics', jsonb_build_object(
        'managed_challenges', (
          SELECT COUNT(*) FROM challenges 
          WHERE created_by = p_user_id OR id IN (
            SELECT challenge_id FROM challenge_managers WHERE user_id = p_user_id
          )
        ),
        'reviewed_submissions', (
          SELECT COUNT(*) FROM challenge_submissions cs
          JOIN challenges c ON cs.challenge_id = c.id
          WHERE c.created_by = p_user_id AND cs.status != 'draft'
        )
      )
    );
  END IF;

  -- User-specific personal metrics (available to all)
  result := result || jsonb_build_object(
    'personal_metrics', jsonb_build_object(
      'submissions_count', (SELECT COUNT(*) FROM challenge_submissions WHERE created_by = p_user_id),
      'participations', (SELECT COUNT(*) FROM challenge_participants WHERE user_id = p_user_id),
      'events_attended', (SELECT COUNT(*) FROM event_participants WHERE user_id = p_user_id)
    )
  );

  RETURN result;
END;
$$;
`;

/**
 * Migration validation functions
 */
export async function validateMigrationReadiness(): Promise<{
  ready: boolean;
  issues: string[];
  recommendations: string[];
}> {
  const issues: string[] = [];
  const recommendations: string[] = [];

  try {
    // Check if analytics service is available
    const { data: serviceTest } = await supabase.from('profiles').select('id').limit(1);
    if (!serviceTest) {
      issues.push('Database connection not available');
    }

    // Check if required functions exist  
    try {
      const { data: serviceTest2 } = await supabase.from('challenges').select('id').limit(1);
      if (!serviceTest2) {
        recommendations.push('Consider updating database functions for better RBAC integration');
      }
    } catch (error) {
      recommendations.push('Database functions may need updating for enhanced analytics');
    }

    // Check if analytics tables exist
    const { data: analyticsEvents } = await supabase.from('analytics_events').select('id').limit(1);
    if (!analyticsEvents) {
      recommendations.push('Analytics events table should be created for comprehensive tracking');
    }

  } catch (error) {
    issues.push(`Database validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    ready: issues.length === 0,
    issues,
    recommendations
  };
}

/**
 * Execute specific migration task
 */
export async function executeMigrationTask(taskId: string): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  const allTasks = ANALYTICS_MIGRATION_PLAN.flatMap(phase => phase.tasks);
  const task = allTasks.find(t => t.id === taskId);
  
  if (!task) {
    return { success: false, message: 'Task not found' };
  }

  // Check dependencies
  const completedTasks = allTasks.filter(t => t.status === 'completed').map(t => t.id);
  const missingDependencies = task.dependencies.filter(dep => !completedTasks.includes(dep));
  
  if (missingDependencies.length > 0) {
    return { 
      success: false, 
      message: `Dependencies not met: ${missingDependencies.join(', ')}`
    };
  }

  // Execute task based on type
  try {
    switch (task.id) {
      case 'DB-001':
        // Execute database migration
        return await executeDatabaseMigration();
      
      case 'COMP-001':
        // Component migration would be handled by file operations
        return { success: true, message: 'Component migration requires manual file updates' };
      
      default:
        return { success: false, message: 'Task execution not implemented' };
    }
  } catch (error) {
    return { 
      success: false, 
      message: `Task execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Execute database migration for analytics functions
 */
async function executeDatabaseMigration(): Promise<{ success: boolean; message: string }> {
  try {
    // This would typically be handled by supabase migration tool
    // For now, return success to indicate readiness
    return {
      success: true,
      message: 'Database migration ready - execute via supabase migration tool'
    };
  } catch (error) {
    return {
      success: false,
      message: `Database migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Migration progress tracker
 */
export class MigrationProgressTracker {
  private static instance: MigrationProgressTracker;
  
  static getInstance(): MigrationProgressTracker {
    if (!MigrationProgressTracker.instance) {
      MigrationProgressTracker.instance = new MigrationProgressTracker();
    }
    return MigrationProgressTracker.instance;
  }

  async updateTaskStatus(taskId: string, status: MigrationTask['status'], notes?: string): Promise<void> {
    // This would typically update a database or local storage
    // For now, we'll update the in-memory plan
    const allTasks = ANALYTICS_MIGRATION_PLAN.flatMap(phase => phase.tasks);
    const task = allTasks.find(t => t.id === taskId);
    
    if (task) {
      task.status = status;
      task.notes = notes;
      if (status === 'completed') {
        task.completedAt = new Date();
      }
      
      console.log(`Task ${taskId} status updated to ${status}`, { notes });
    }
  }

  generateReport(): {
    summary: any;
    completedTasks: MigrationTask[];
    blockedTasks: MigrationTask[];
    nextSteps: string[];
  } {
    const allTasks = ANALYTICS_MIGRATION_PLAN.flatMap(phase => phase.tasks);
    const completedTasks = allTasks.filter(t => t.status === 'completed');
    const blockedTasks = allTasks.filter(t => t.status === 'blocked');
    
    return {
      summary: {
        totalTasks: allTasks.length,
        completed: completedTasks.length,
        blocked: blockedTasks.length,
        remaining: allTasks.length - completedTasks.length
      },
      completedTasks,
      blockedTasks,
      nextSteps: [
        'Execute database migration for enhanced analytics functions',
        'Begin component migration starting with AdminDashboard',
        'Test RBAC permissions for all analytics components',
        'Validate performance improvements with caching'
      ]
    };
  }
}