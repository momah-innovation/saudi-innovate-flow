-- Grant admin role to the user with email momah.innovation@gmail.com
INSERT INTO public.user_roles (user_id, role, is_active)
SELECT au.id, 'admin'::app_role, true
FROM auth.users au
WHERE au.email = 'momah.innovation@gmail.com'
ON CONFLICT (user_id, role) DO UPDATE SET is_active = true;

-- Create auto setup function for storage quotas
CREATE OR REPLACE FUNCTION public.auto_setup_storage_quotas()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'storage'
AS $$
DECLARE
  bucket_record RECORD;
  quota_bytes BIGINT := 5368709120; -- 5GB in bytes
  setup_count INTEGER := 0;
  result jsonb := '[]'::jsonb;
BEGIN
  -- Check admin permissions
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Admin access required for auto setup';
  END IF;

  -- Setup quotas for all buckets that don't have them
  FOR bucket_record IN 
    SELECT b.id as bucket_name
    FROM storage.buckets b
    WHERE NOT EXISTS (
      SELECT 1 FROM public.storage_quotas sq 
      WHERE sq.bucket_name = b.id
    )
  LOOP
    -- Insert quota for this bucket
    INSERT INTO public.storage_quotas (
      bucket_name,
      quota_bytes,
      current_usage_bytes,
      usage_percentage,
      file_count
    ) VALUES (
      bucket_record.bucket_name,
      quota_bytes,
      COALESCE((
        SELECT SUM((o.metadata->>'size')::bigint)
        FROM storage.objects o 
        WHERE o.bucket_id = bucket_record.bucket_name
      ), 0),
      CASE 
        WHEN quota_bytes > 0 THEN
          LEAST(100, (COALESCE((
            SELECT SUM((o.metadata->>'size')::bigint)
            FROM storage.objects o 
            WHERE o.bucket_id = bucket_record.bucket_name
          ), 0)::float / quota_bytes::float) * 100)
        ELSE 0
      END,
      COALESCE((
        SELECT COUNT(*)
        FROM storage.objects o 
        WHERE o.bucket_id = bucket_record.bucket_name
      ), 0)
    );
    
    setup_count := setup_count + 1;
    
    result := result || jsonb_build_object(
      'bucket_name', bucket_record.bucket_name,
      'quota_gb', 5,
      'status', 'created'
    );
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Auto setup completed',
    'buckets_configured', setup_count,
    'details', result
  );
END;
$$;