-- Fix the ambiguous column reference in manage_storage_quotas function
DROP FUNCTION IF EXISTS public.manage_storage_quotas(text, bigint, text);

CREATE OR REPLACE FUNCTION public.manage_storage_quotas(
  bucket_name text, 
  quota_bytes bigint DEFAULT NULL, 
  action text DEFAULT 'check'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'storage'
AS $$
DECLARE
  current_usage bigint;
  quota_info jsonb;
  quota_record RECORD;
BEGIN
  -- Only allow admins to manage quotas
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin privileges required for quota management';
  END IF;

  -- Get current bucket usage - fix ambiguous column reference
  SELECT COALESCE(SUM((o.metadata->>'size')::bigint), 0) INTO current_usage
  FROM storage.objects o
  WHERE o.bucket_id = manage_storage_quotas.bucket_name;

  IF action = 'set' AND quota_bytes IS NOT NULL THEN
    -- Create/update quota - fix ambiguous column reference
    INSERT INTO public.storage_quotas (bucket_name, quota_bytes, created_by, updated_at)
    VALUES (manage_storage_quotas.bucket_name, manage_storage_quotas.quota_bytes, auth.uid(), NOW())
    ON CONFLICT (bucket_name) 
    DO UPDATE SET 
      quota_bytes = EXCLUDED.quota_bytes,
      updated_at = NOW(),
      created_by = auth.uid();
      
    quota_info := jsonb_build_object(
      'action', 'quota_set',
      'bucket_name', manage_storage_quotas.bucket_name,
      'quota_bytes', manage_storage_quotas.quota_bytes,
      'current_usage', current_usage,
      'usage_percentage', CASE WHEN manage_storage_quotas.quota_bytes > 0 THEN (current_usage::float / manage_storage_quotas.quota_bytes * 100) ELSE 0 END
    );
    
  ELSIF action = 'remove' THEN
    -- Remove quota - fix ambiguous column reference
    DELETE FROM public.storage_quotas WHERE storage_quotas.bucket_name = manage_storage_quotas.bucket_name;
    
    quota_info := jsonb_build_object(
      'action', 'quota_removed',
      'bucket_name', manage_storage_quotas.bucket_name,
      'current_usage', current_usage
    );
    
  ELSE
    -- Check current quota status - fix ambiguous column reference
    SELECT * INTO quota_record
    FROM public.storage_quotas sq
    WHERE sq.bucket_name = manage_storage_quotas.bucket_name;
    
    quota_info := jsonb_build_object(
      'action', 'quota_check',
      'bucket_name', manage_storage_quotas.bucket_name,
      'current_usage', current_usage,
      'has_quota', quota_record IS NOT NULL,
      'quota_bytes', COALESCE(quota_record.quota_bytes, 0),
      'usage_percentage', CASE 
        WHEN quota_record.quota_bytes IS NOT NULL AND quota_record.quota_bytes > 0 
        THEN (current_usage::float / quota_record.quota_bytes * 100) 
        ELSE 0 
      END,
      'quota_exceeded', CASE 
        WHEN quota_record.quota_bytes IS NOT NULL 
        THEN current_usage > quota_record.quota_bytes 
        ELSE false 
      END
    );
  END IF;

  -- Log quota action
  INSERT INTO public.security_audit_log (
    user_id, action_type, resource_type, details, risk_level
  ) VALUES (
    auth.uid(), 'STORAGE_QUOTA_' || upper(action), 'storage_quota', quota_info, 'medium'
  );

  RETURN quota_info;
END;
$$;