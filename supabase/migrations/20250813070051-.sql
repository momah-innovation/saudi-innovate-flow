-- Phase 1.1.1: Fix Security Issues - Remove direct auth.users access from views

-- Drop the problematic views
DROP VIEW IF EXISTS admin_dashboard_metrics_view;
DROP VIEW IF EXISTS security_metrics_view;

-- 1. Create admin_dashboard_metrics_view WITHOUT direct auth.users access
-- Instead, we'll use profiles table and user_roles table which we control
CREATE OR REPLACE VIEW admin_dashboard_metrics_view AS
SELECT 
  -- User metrics (using profiles instead of auth.users)
  (SELECT COUNT(*) FROM profiles) as total_users,
  (SELECT COUNT(*) FROM profiles WHERE updated_at > NOW() - INTERVAL '30 days') as active_users_30d,
  (SELECT COUNT(*) FROM profiles WHERE created_at > NOW() - INTERVAL '7 days') as new_users_7d,
  (SELECT COUNT(*) FROM profiles WHERE created_at > NOW() - INTERVAL '30 days') as new_users_30d,
  
  -- User role distribution
  (SELECT COUNT(*) FROM user_roles WHERE role = 'admin' AND is_active = true) as admin_count,
  (SELECT COUNT(*) FROM user_roles WHERE role = 'innovator' AND is_active = true) as innovator_count,
  (SELECT COUNT(*) FROM user_roles WHERE role = 'external_expert' AND is_active = true) as expert_count,
  (SELECT COUNT(*) FROM user_roles WHERE role = 'organization_member' AND is_active = true) as partner_count,
  (SELECT COUNT(*) FROM user_roles WHERE role = 'evaluator' AND is_active = true) as evaluator_count,
  (SELECT COUNT(*) FROM user_roles WHERE role = 'domain_expert' AND is_active = true) as domain_expert_count,
  
  -- Innovation team members
  (SELECT COUNT(*) FROM innovation_team_members WHERE status = 'active') as team_members_count,
  
  -- Calculate growth rates using profiles
  CASE 
    WHEN (SELECT COUNT(*) FROM profiles WHERE created_at BETWEEN NOW() - INTERVAL '60 days' AND NOW() - INTERVAL '30 days') > 0 
    THEN ROUND(
      ((SELECT COUNT(*) FROM profiles WHERE created_at > NOW() - INTERVAL '30 days')::NUMERIC - 
       (SELECT COUNT(*) FROM profiles WHERE created_at BETWEEN NOW() - INTERVAL '60 days' AND NOW() - INTERVAL '30 days')::NUMERIC) /
      (SELECT COUNT(*) FROM profiles WHERE created_at BETWEEN NOW() - INTERVAL '60 days' AND NOW() - INTERVAL '30 days')::NUMERIC * 100, 2
    )
    ELSE 0 
  END as user_growth_rate_percentage,
  
  NOW() as last_updated;

-- 2. Create security_metrics_view WITHOUT direct auth.users access
CREATE OR REPLACE VIEW security_metrics_view AS
SELECT 
  -- Security audit metrics
  (SELECT COUNT(*) FROM security_audit_log WHERE created_at > NOW() - INTERVAL '24 hours') as security_events_24h,
  (SELECT COUNT(*) FROM security_audit_log WHERE created_at > NOW() - INTERVAL '7 days') as security_events_7d,
  (SELECT COUNT(*) FROM security_audit_log WHERE risk_level = 'high' AND created_at > NOW() - INTERVAL '7 days') as high_risk_events_7d,
  (SELECT COUNT(*) FROM security_audit_log WHERE risk_level = 'critical' AND created_at > NOW() - INTERVAL '7 days') as critical_risk_events_7d,
  
  -- Authentication metrics (using profiles for user activity)
  (SELECT COUNT(*) FROM profiles WHERE updated_at > NOW() - INTERVAL '24 hours') as logins_24h,
  (SELECT COUNT(*) FROM profiles WHERE updated_at > NOW() - INTERVAL '7 days') as logins_7d,
  (SELECT COUNT(*) FROM profiles WHERE created_at > NOW() - INTERVAL '24 hours') as new_registrations_24h,
  
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

-- Grant access to the updated views
GRANT SELECT ON admin_dashboard_metrics_view TO authenticated;
GRANT SELECT ON security_metrics_view TO authenticated;

-- Add RLS policies to restrict access to admin users only
CREATE POLICY "Admin users can view admin metrics" 
ON admin_dashboard_metrics_view 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin') 
    AND is_active = true
  )
);

CREATE POLICY "Admin users can view security metrics" 
ON security_metrics_view 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin') 
    AND is_active = true
  )
);

-- Enable RLS on the views
ALTER VIEW admin_dashboard_metrics_view SET (security_barrier = true);
ALTER VIEW security_metrics_view SET (security_barrier = true);