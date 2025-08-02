-- Fix the get_all_storage_quotas function to work with RPC calls
CREATE OR REPLACE FUNCTION public.get_all_storage_quotas()
RETURNS TABLE(bucket_name text, quota_bytes bigint, current_usage_bytes bigint, usage_percentage numeric, file_count integer, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'storage'
AS $function$
DECLARE
  current_user_id uuid;
BEGIN
  -- Get current user ID - works better with RPC calls
  current_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Check if user has admin role using the current user ID
  IF NOT (
    has_role(current_user_id, 'admin'::app_role) 
    OR has_role(current_user_id, 'super_admin'::app_role)
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
$function$;

-- Also fix the auto_setup_storage_quotas function  
CREATE OR REPLACE FUNCTION public.auto_setup_storage_quotas()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'storage'
AS $function$
DECLARE
  current_user_id uuid;
  bucket_record RECORD;
  default_quota_gb INTEGER := 5;
  default_quota_bytes BIGINT;
  quotas_created INTEGER := 0;
  result jsonb;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Check if user has admin role
  IF NOT (
    has_role(current_user_id, 'admin'::app_role) 
    OR has_role(current_user_id, 'super_admin'::app_role)
  ) THEN
    RAISE EXCEPTION 'Admin access required for storage quota management';
  END IF;

  -- Calculate default quota in bytes (5GB = 5 * 1024 * 1024 * 1024)
  default_quota_bytes := default_quota_gb::BIGINT * 1024 * 1024 * 1024;

  -- Loop through all buckets and create quotas for those without one
  FOR bucket_record IN 
    SELECT DISTINCT b.id as bucket_name
    FROM storage.buckets b
    WHERE NOT EXISTS (
      SELECT 1 FROM public.storage_quotas sq 
      WHERE sq.bucket_name = b.id
    )
  LOOP
    INSERT INTO public.storage_quotas (
      bucket_name, 
      quota_bytes, 
      created_by,
      updated_by
    ) VALUES (
      bucket_record.bucket_name,
      default_quota_bytes,
      current_user_id,
      current_user_id
    );
    
    quotas_created := quotas_created + 1;
  END LOOP;

  result := jsonb_build_object(
    'success', true,
    'quotas_created', quotas_created,
    'default_quota_gb', default_quota_gb,
    'default_quota_bytes', default_quota_bytes,
    'message', 'Auto setup completed successfully'
  );

  RETURN result;
END;
$function$;