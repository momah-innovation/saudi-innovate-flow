-- Fix get_all_storage_quotas to allow viewing for authenticated users
-- but keep quota management restricted to admins
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
  -- Allow authenticated users to view quotas, but not necessarily manage them
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  RETURN QUERY
  SELECT 
    b.name as bucket_name,
    COALESCE(sq.quota_bytes, 0) as quota_bytes,
    COALESCE(
      (SELECT SUM((o.metadata->>'size')::bigint) 
       FROM storage.objects o 
       WHERE o.bucket_id = b.name), 0
    ) as current_usage,
    CASE 
      WHEN sq.quota_bytes IS NOT NULL AND sq.quota_bytes > 0 THEN
        (COALESCE(
          (SELECT SUM((o.metadata->>'size')::bigint) 
           FROM storage.objects o 
           WHERE o.bucket_id = b.name), 0
        )::double precision / sq.quota_bytes::double precision) * 100
      ELSE 0
    END as usage_percentage,
    CASE 
      WHEN sq.quota_bytes IS NOT NULL THEN
        COALESCE(
          (SELECT SUM((o.metadata->>'size')::bigint) 
           FROM storage.objects o 
           WHERE o.bucket_id = b.name), 0
        ) > sq.quota_bytes
      ELSE false
    END as quota_exceeded
  FROM storage.buckets b
  LEFT JOIN public.storage_quotas sq ON b.name = sq.bucket_name
  ORDER BY b.name;
END;
$$;