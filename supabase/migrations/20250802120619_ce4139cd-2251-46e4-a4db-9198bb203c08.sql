-- Drop existing functions to recreate with proper admin checks
DROP FUNCTION IF EXISTS public.get_all_storage_quotas();
DROP FUNCTION IF EXISTS public.manage_storage_quotas(text, bigint);

-- Create improved admin-only storage quota functions
CREATE OR REPLACE FUNCTION public.get_all_storage_quotas()
RETURNS TABLE(
  bucket_name text,
  quota_bytes bigint,
  current_usage_bytes bigint,
  usage_percentage numeric,
  file_count integer,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'storage'
AS $$
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Check if user has admin role
  IF NOT (
    has_role(auth.uid(), 'admin'::app_role) 
    OR has_role(auth.uid(), 'super_admin'::app_role)
  ) THEN
    RAISE EXCEPTION 'Admin access required for storage quota management';
  END IF;

  RETURN QUERY
  SELECT 
    sq.bucket_name,
    sq.quota_bytes,
    COALESCE(SUM((o.metadata->>'size')::bigint), 0) as current_usage_bytes,
    CASE 
      WHEN sq.quota_bytes > 0 THEN 
        ROUND((COALESCE(SUM((o.metadata->>'size')::bigint), 0)::numeric / sq.quota_bytes::numeric) * 100, 2)
      ELSE 0
    END as usage_percentage,
    COUNT(o.id)::integer as file_count,
    sq.created_at,
    sq.updated_at
  FROM public.storage_quotas sq
  LEFT JOIN storage.objects o ON sq.bucket_name = o.bucket_id
  GROUP BY sq.bucket_name, sq.quota_bytes, sq.created_at, sq.updated_at
  ORDER BY sq.bucket_name;
END;
$$;

CREATE OR REPLACE FUNCTION public.manage_storage_quotas(
  p_bucket_name text,
  p_quota_bytes bigint DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'storage'
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Check if user has admin role
  IF NOT (
    has_role(auth.uid(), 'admin'::app_role) 
    OR has_role(auth.uid(), 'super_admin'::app_role)
  ) THEN
    RAISE EXCEPTION 'Admin access required for storage quota management';
  END IF;

  -- Validate bucket exists
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = p_bucket_name) THEN
    RAISE EXCEPTION 'Bucket "%" does not exist', p_bucket_name;
  END IF;

  IF p_quota_bytes IS NULL THEN
    -- Remove quota
    DELETE FROM public.storage_quotas WHERE bucket_name = p_bucket_name;
    result := jsonb_build_object(
      'success', true,
      'action', 'removed',
      'bucket_name', p_bucket_name,
      'message', 'Quota removed successfully'
    );
  ELSE
    -- Set/update quota
    INSERT INTO public.storage_quotas (bucket_name, quota_bytes, set_by)
    VALUES (p_bucket_name, p_quota_bytes, auth.uid())
    ON CONFLICT (bucket_name) 
    DO UPDATE SET 
      quota_bytes = EXCLUDED.quota_bytes,
      set_by = EXCLUDED.set_by,
      updated_at = NOW()
    RETURNING *;
    
    result := jsonb_build_object(
      'success', true,
      'action', 'set',
      'bucket_name', p_bucket_name,
      'quota_bytes', p_quota_bytes,
      'message', 'Quota set successfully'
    );
  END IF;

  RETURN result;
END;
$$;