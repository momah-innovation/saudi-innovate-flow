-- First, add the missing updated_by column to storage_quotas table
ALTER TABLE public.storage_quotas ADD COLUMN IF NOT EXISTS updated_by uuid;

-- Fix the manage_storage_quotas function that has the wrong column reference
CREATE OR REPLACE FUNCTION public.manage_storage_quotas(p_bucket_name text, p_quota_bytes bigint DEFAULT NULL::bigint)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'storage'
AS $function$
DECLARE
  current_user_id uuid;
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
    -- Set/update quota - use correct column names
    INSERT INTO public.storage_quotas (bucket_name, quota_bytes, created_by, updated_by)
    VALUES (p_bucket_name, p_quota_bytes, current_user_id, current_user_id)
    ON CONFLICT (bucket_name) 
    DO UPDATE SET 
      quota_bytes = EXCLUDED.quota_bytes,
      updated_by = current_user_id,
      updated_at = NOW();
    
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
$function$;