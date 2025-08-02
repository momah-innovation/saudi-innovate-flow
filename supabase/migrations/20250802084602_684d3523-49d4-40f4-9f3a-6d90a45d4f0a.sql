-- Create database functions for storage quota management
CREATE OR REPLACE FUNCTION public.get_all_storage_quotas()
RETURNS TABLE(
  bucket_name TEXT,
  quota_bytes BIGINT,
  current_usage BIGINT,
  usage_percentage NUMERIC,
  quota_exceeded BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'storage'
AS $$
BEGIN
  -- Only allow admins to view quotas
  IF NOT (
    public.has_role(auth.uid(), 'admin'::public.app_role) 
    OR public.has_role(auth.uid(), 'super_admin'::public.app_role)
  ) THEN
    RAISE EXCEPTION 'Access denied: admin privileges required';
  END IF;

  RETURN QUERY
  SELECT 
    b.name as bucket_name,
    COALESCE(sq.quota_bytes, 0) as quota_bytes,
    COALESCE(SUM((o.metadata->>'size')::bigint), 0) as current_usage,
    CASE 
      WHEN sq.quota_bytes > 0 THEN 
        ROUND((COALESCE(SUM((o.metadata->>'size')::bigint), 0)::numeric / sq.quota_bytes::numeric) * 100, 2)
      ELSE 0 
    END as usage_percentage,
    CASE 
      WHEN sq.quota_bytes > 0 THEN 
        COALESCE(SUM((o.metadata->>'size')::bigint), 0) > sq.quota_bytes
      ELSE false 
    END as quota_exceeded
  FROM storage.buckets b
  LEFT JOIN public.storage_quotas sq ON b.name = sq.bucket_name
  LEFT JOIN storage.objects o ON b.id = o.bucket_id
  WHERE sq.quota_bytes IS NOT NULL -- Only return buckets with quotas
  GROUP BY b.name, sq.quota_bytes
  ORDER BY b.name;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_bucket_usage(bucket_name TEXT)
RETURNS TABLE(total_size BIGINT, file_count BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'storage'
AS $$
BEGIN
  -- Only allow admins to access bucket usage
  IF NOT (
    public.has_role(auth.uid(), 'admin'::public.app_role) 
    OR public.has_role(auth.uid(), 'super_admin'::public.app_role)
  ) THEN
    RAISE EXCEPTION 'Access denied: admin privileges required';
  END IF;

  RETURN QUERY
  SELECT 
    COALESCE(SUM((metadata->>'size')::bigint), 0) as total_size,
    COUNT(*)::bigint as file_count
  FROM storage.objects 
  WHERE bucket_id = bucket_name;
END;
$$;