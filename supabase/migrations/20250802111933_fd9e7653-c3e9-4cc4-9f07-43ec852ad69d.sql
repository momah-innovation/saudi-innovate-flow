-- Drop and recreate get_all_storage_quotas function with correct types
DROP FUNCTION IF EXISTS public.get_all_storage_quotas();

CREATE OR REPLACE FUNCTION public.get_all_storage_quotas()
RETURNS TABLE(
  bucket_name text,
  quota_bytes bigint,
  current_usage bigint,
  usage_percentage double precision,
  quota_exceeded boolean
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
        (COALESCE(SUM((o.metadata->>'size')::bigint), 0)::double precision / sq.quota_bytes::double precision) * 100
      ELSE 0::double precision 
    END as usage_percentage,
    CASE 
      WHEN sq.quota_bytes > 0 THEN 
        COALESCE(SUM((o.metadata->>'size')::bigint), 0) > sq.quota_bytes
      ELSE false 
    END as quota_exceeded
  FROM storage.buckets b
  LEFT JOIN public.storage_quotas sq ON b.name = sq.bucket_name
  LEFT JOIN storage.objects o ON b.id = o.bucket_id
  GROUP BY b.name, sq.quota_bytes
  ORDER BY b.name;
END;
$$;