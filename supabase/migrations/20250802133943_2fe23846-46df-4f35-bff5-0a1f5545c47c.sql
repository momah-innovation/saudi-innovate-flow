-- Fix the get_storage_buckets_info function type mismatch
CREATE OR REPLACE FUNCTION public.get_storage_buckets_info()
RETURNS TABLE(bucket_id text, bucket_name text, public boolean, created_at timestamp with time zone, file_count bigint, total_size bigint)
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

  -- Only allow admins and team members to access storage bucket info
  IF NOT (
    has_role(current_user_id, 'admin'::app_role) 
    OR has_role(current_user_id, 'super_admin'::app_role)
    OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = current_user_id AND status = 'active')
  ) THEN
    RAISE EXCEPTION 'Access denied: insufficient privileges to view storage bucket information';
  END IF;

  RETURN QUERY
  SELECT 
    b.id as bucket_id,
    b.name as bucket_name,
    b.public,
    b.created_at,
    COALESCE(COUNT(o.id), 0)::bigint as file_count,  -- Explicit cast to bigint
    COALESCE(SUM((o.metadata->>'size')::bigint), 0)::bigint as total_size  -- Explicit cast to bigint
  FROM storage.buckets b
  LEFT JOIN storage.objects o ON b.id = o.bucket_id
  GROUP BY b.id, b.name, b.public, b.created_at
  ORDER BY b.name;
END;
$function$;