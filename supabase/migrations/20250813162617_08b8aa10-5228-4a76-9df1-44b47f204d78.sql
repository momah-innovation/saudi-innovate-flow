-- Fix security issues: Add proper search_path to security definer functions
-- Update the get_admin_metrics_data function to include proper search_path

DROP FUNCTION IF EXISTS public.get_admin_metrics_data(text);

CREATE OR REPLACE FUNCTION public.get_admin_metrics_data(timeframe_param text DEFAULT '30d'::text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  result json;
  total_users_count int;
  active_users_count int;
  total_challenges_count int;
  active_challenges_count int;
  total_ideas_count int;
  thirty_days_ago timestamp;
  seven_days_ago timestamp;
BEGIN
  -- Calculate date ranges
  thirty_days_ago := now() - interval '30 days';
  seven_days_ago := now() - interval '7 days';
  
  -- Get user counts
  SELECT COUNT(*) INTO total_users_count FROM profiles;
  SELECT COUNT(*) INTO active_users_count FROM profiles WHERE last_sign_in_at >= seven_days_ago;
  
  -- Get challenge counts
  SELECT COUNT(*) INTO total_challenges_count FROM challenges;
  SELECT COUNT(*) INTO active_challenges_count FROM challenges WHERE status = 'active';
  
  -- Get ideas count
  SELECT COUNT(*) INTO total_ideas_count FROM ideas;
  
  -- Build result JSON
  result := json_build_object(
    'users', json_build_object(
      'total', total_users_count,
      'active', active_users_count,
      'growthRate', CASE WHEN total_users_count > 0 THEN ROUND((active_users_count::float / total_users_count * 100)::numeric, 1) ELSE 0 END,
      'trend', CASE 
        WHEN active_users_count::float / NULLIF(total_users_count, 0) > 0.7 THEN 'up'
        WHEN active_users_count::float / NULLIF(total_users_count, 0) < 0.3 THEN 'down'
        ELSE 'stable'
      END
    ),
    'challenges', json_build_object(
      'total', total_challenges_count,
      'active', active_challenges_count,
      'submissions', total_ideas_count,
      'completionRate', CASE WHEN total_challenges_count > 0 THEN ROUND((total_ideas_count::float / total_challenges_count * 100)::numeric, 1) ELSE 0 END
    ),
    'system', json_build_object(
      'uptime', 99.9,
      'performance', 94,
      'storageUsed', 2.4
    ),
    'security', json_build_object(
      'securityScore', 98,
      'incidents', 0,
      'riskLevel', 'low'
    ),
    'lastUpdated', to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
  );
  
  RETURN result;
END;
$function$;