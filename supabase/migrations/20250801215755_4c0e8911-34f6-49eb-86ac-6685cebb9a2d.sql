-- Fix the get_bucket_stats function to return correct types
CREATE OR REPLACE FUNCTION public.get_bucket_stats(bucket_name text)
 RETURNS TABLE(total_files bigint, total_size bigint, avg_file_size bigint, oldest_file timestamp with time zone, newest_file timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'storage'
AS $function$
BEGIN
  -- Only allow admins and team members to get bucket stats
  IF NOT (
    has_role(auth.uid(), 'admin'::app_role) 
    OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid() AND status = 'active')
  ) THEN
    RAISE EXCEPTION 'Access denied: insufficient privileges to view bucket statistics';
  END IF;

  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_files,
    COALESCE(SUM((metadata->>'size')::bigint), 0::bigint) as total_size,
    CASE 
      WHEN COUNT(*) > 0 THEN COALESCE(AVG((metadata->>'size')::bigint)::bigint, 0::bigint)
      ELSE 0::bigint
    END as avg_file_size,
    MIN(created_at) as oldest_file,
    MAX(created_at) as newest_file
  FROM storage.objects 
  WHERE bucket_id = bucket_name;
END;
$function$;