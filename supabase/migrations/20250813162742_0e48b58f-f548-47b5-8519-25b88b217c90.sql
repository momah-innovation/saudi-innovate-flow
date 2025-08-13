-- Remove SECURITY DEFINER from metric views and recreate as regular views
-- These views don't need elevated permissions and should use the querying user's RLS policies

-- Drop existing views that may have SECURITY DEFINER
DROP VIEW IF EXISTS public.admin_dashboard_metrics_view CASCADE;
DROP VIEW IF EXISTS public.system_metrics_view CASCADE;
DROP VIEW IF EXISTS public.security_metrics_view CASCADE;
DROP VIEW IF EXISTS public.challenges_metrics_view CASCADE;

-- Recreate admin_dashboard_metrics_view as regular view
CREATE VIEW public.admin_dashboard_metrics_view AS
SELECT 
    (SELECT count(*) FROM profiles) AS total_users,
    (SELECT count(*) FROM profiles WHERE profiles.updated_at > (now() - '30 days'::interval)) AS active_users_30d,
    (SELECT count(*) FROM profiles WHERE profiles.created_at > (now() - '7 days'::interval)) AS new_users_7d,
    (SELECT count(*) FROM profiles WHERE profiles.created_at > (now() - '30 days'::interval)) AS new_users_30d,
    (SELECT count(*) FROM user_roles WHERE role = 'admin'::app_role AND is_active = true) AS admin_count,
    (SELECT count(*) FROM user_roles WHERE role = 'innovator'::app_role AND is_active = true) AS innovator_count,
    (SELECT count(*) FROM user_roles WHERE role = 'external_expert'::app_role AND is_active = true) AS expert_count,
    (SELECT count(*) FROM user_roles WHERE role = 'organization_member'::app_role AND is_active = true) AS partner_count,
    (SELECT count(*) FROM user_roles WHERE role = 'evaluator'::app_role AND is_active = true) AS evaluator_count,
    (SELECT count(*) FROM user_roles WHERE role = 'domain_expert'::app_role AND is_active = true) AS domain_expert_count,
    (SELECT count(*) FROM innovation_team_members WHERE status = 'active') AS team_members_count,
    CASE 
        WHEN (SELECT count(*) FROM profiles WHERE created_at >= (now() - '60 days'::interval) AND created_at <= (now() - '30 days'::interval)) > 0 
        THEN round(((
            (SELECT count(*) FROM profiles WHERE created_at > (now() - '30 days'::interval))::numeric - 
            (SELECT count(*) FROM profiles WHERE created_at >= (now() - '60 days'::interval) AND created_at <= (now() - '30 days'::interval))::numeric
        ) / (SELECT count(*) FROM profiles WHERE created_at >= (now() - '60 days'::interval) AND created_at <= (now() - '30 days'::interval))::numeric) * 100, 2)
        ELSE 0
    END AS user_growth_rate_percentage,
    now() AS last_updated;

-- Create system_metrics_view as regular view  
CREATE VIEW public.system_metrics_view AS
SELECT 
    COALESCE((SELECT sum((metadata->>'size')::bigint) FROM storage.objects), 0) AS total_storage_bytes,
    COALESCE((SELECT count(*) FROM storage.objects), 0) AS total_files,
    COALESCE((SELECT count(*) FROM storage.buckets), 0) AS total_buckets,
    COALESCE((SELECT count(*) FROM storage.objects WHERE bucket_id = 'avatars'), 0) AS avatar_files_count,
    COALESCE((SELECT count(*) FROM storage.objects WHERE bucket_id = 'challenge-files'), 0) AS challenge_files_count,
    COALESCE((SELECT count(*) FROM storage.objects WHERE bucket_id = 'idea-files'), 0) AS idea_files_count,
    COALESCE((SELECT count(*) FROM activity_events WHERE created_at >= now() - interval '24 hours'), 0) AS events_24h,
    COALESCE((SELECT count(*) FROM activity_events WHERE created_at >= now() - interval '7 days'), 0) AS events_7d,
    COALESCE((SELECT count(DISTINCT user_id) FROM activity_events WHERE created_at >= now() - interval '24 hours'), 0) AS active_users_24h,
    COALESCE((SELECT count(*) FROM challenges), 0) AS challenges_table_size,
    COALESCE((SELECT count(*) FROM challenge_submissions), 0) AS submissions_table_size,
    COALESCE((SELECT count(*) FROM activity_events), 0) AS events_table_size,
    COALESCE((SELECT count(*) FROM profiles), 0) AS profiles_table_size,
    COALESCE((SELECT count(*) FROM storage.objects WHERE created_at >= now() - interval '24 hours'), 0) AS new_files_24h,
    COALESCE((SELECT count(*) FROM storage.objects WHERE created_at >= now() - interval '7 days'), 0) AS new_files_7d,
    extract(epoch from now()) AS current_timestamp,
    now() AS last_updated;

-- Create security_metrics_view as regular view
CREATE VIEW public.security_metrics_view AS
SELECT 
    COALESCE((SELECT count(*) FROM security_audit_log WHERE created_at >= now() - interval '24 hours'), 0) AS security_events_24h,
    COALESCE((SELECT count(*) FROM security_audit_log WHERE created_at >= now() - interval '7 days'), 0) AS security_events_7d,
    COALESCE((SELECT count(*) FROM security_audit_log WHERE created_at >= now() - interval '7 days' AND risk_level = 'high'), 0) AS high_risk_events_7d,
    COALESCE((SELECT count(*) FROM security_audit_log WHERE created_at >= now() - interval '7 days' AND risk_level = 'critical'), 0) AS critical_risk_events_7d,
    COALESCE((SELECT count(*) FROM security_audit_log WHERE created_at >= now() - interval '24 hours' AND action_type = 'LOGIN'), 0) AS logins_24h,
    COALESCE((SELECT count(*) FROM security_audit_log WHERE created_at >= now() - interval '7 days' AND action_type = 'LOGIN'), 0) AS logins_7d,
    COALESCE((SELECT count(*) FROM profiles WHERE created_at >= now() - interval '24 hours'), 0) AS new_registrations_24h,
    COALESCE((SELECT count(*) FROM rate_limits WHERE created_at >= now() - interval '24 hours' AND request_count > 100), 0) AS rate_limit_hits_24h,
    COALESCE((SELECT count(*) FROM suspicious_activities WHERE created_at >= now() - interval '7 days'), 0) AS suspicious_activities_7d,
    COALESCE((SELECT count(*) FROM suspicious_activities WHERE created_at >= now() - interval '7 days' AND severity = 'high'), 0) AS high_severity_suspicious_7d,
    COALESCE((SELECT count(*) FROM user_roles WHERE is_active = true), 0) AS active_role_assignments,
    COALESCE((SELECT count(*) FROM role_approval_requests WHERE status = 'pending'), 0) AS pending_role_requests,
    COALESCE((SELECT count(*) FROM role_audit_log WHERE created_at >= now() - interval '7 days'), 0) AS role_changes_7d,
    COALESCE((SELECT count(*) FROM security_audit_log WHERE created_at >= now() - interval '24 hours' AND action_type = 'ACCESS_DENIED'), 0) AS access_denied_24h,
    COALESCE((SELECT count(*) FROM security_audit_log WHERE created_at >= now() - interval '24 hours' AND action_type LIKE '%FAILED%'), 0) AS failed_operations_24h,
    CASE 
        WHEN (SELECT count(*) FROM security_audit_log WHERE created_at >= now() - interval '7 days' AND risk_level = 'critical') > 0 THEN 60
        WHEN (SELECT count(*) FROM security_audit_log WHERE created_at >= now() - interval '7 days' AND risk_level = 'high') > 5 THEN 75
        WHEN (SELECT count(*) FROM security_audit_log WHERE created_at >= now() - interval '7 days' AND risk_level = 'high') > 0 THEN 85
        ELSE 95
    END AS security_score,
    now() AS last_updated;

-- Grant appropriate permissions on the views
GRANT SELECT ON public.admin_dashboard_metrics_view TO authenticated;
GRANT SELECT ON public.system_metrics_view TO authenticated;  
GRANT SELECT ON public.security_metrics_view TO authenticated;