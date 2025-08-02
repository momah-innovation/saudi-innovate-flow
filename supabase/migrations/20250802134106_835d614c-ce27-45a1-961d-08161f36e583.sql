-- Fix the get_all_storage_quotas function type mismatch
CREATE OR REPLACE FUNCTION public.get_all_storage_quotas()
RETURNS TABLE(
  bucket_name text,
  quota_bytes bigint,
  current_usage_bytes bigint,
  usage_percentage numeric,
  file_count bigint,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'storage'
AS $function$
DECLARE
  current_user_id uuid;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Only allow admins and team members to access storage quotas
  IF NOT (
    has_role(current_user_id, 'admin'::app_role) 
    OR has_role(current_user_id, 'super_admin'::app_role)
    OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = current_user_id AND status = 'active')
  ) THEN
    RAISE EXCEPTION 'Access denied: insufficient privileges to view storage quotas';
  END IF;

  RETURN QUERY
  SELECT 
    sq.bucket_name,
    sq.quota_bytes::bigint,  -- Explicit cast to bigint
    COALESCE(
      (SELECT SUM((o.metadata->>'size')::bigint) 
       FROM storage.objects o 
       WHERE o.bucket_id = sq.bucket_name), 
      0
    )::bigint as current_usage_bytes,  -- Explicit cast to bigint
    CASE 
      WHEN sq.quota_bytes > 0 THEN 
        ROUND(
          (COALESCE(
            (SELECT SUM((o.metadata->>'size')::bigint) 
             FROM storage.objects o 
             WHERE o.bucket_id = sq.bucket_name), 
            0
          )::numeric / sq.quota_bytes::numeric) * 100, 2
        )
      ELSE 0
    END as usage_percentage,
    COALESCE(
      (SELECT COUNT(*)::bigint 
       FROM storage.objects o 
       WHERE o.bucket_id = sq.bucket_name), 
      0
    ) as file_count,  -- Explicit cast to bigint
    sq.created_at,
    sq.updated_at
  FROM public.storage_quotas sq
  ORDER BY sq.bucket_name;
END;
$function$;