-- Data Recovery & Optimization Functions

-- Function to restore files from archive
CREATE OR REPLACE FUNCTION public.restore_from_archive(
  archive_bucket text,
  target_bucket text DEFAULT NULL,
  file_pattern text DEFAULT '%',
  restore_original_paths boolean DEFAULT true,
  dry_run boolean DEFAULT true
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'storage'
AS $function$
DECLARE
  restored_count integer := 0;
  failed_count integer := 0;
  restored_files jsonb := '[]'::jsonb;
  failed_files jsonb := '[]'::jsonb;
  file_record RECORD;
  original_bucket text;
  restore_path text;
BEGIN
  -- Only allow admins to restore files
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin privileges required for restore';
  END IF;

  -- Process archived files matching pattern
  FOR file_record IN 
    SELECT name, bucket_id, metadata, created_at, owner
    FROM storage.objects 
    WHERE bucket_id = archive_bucket 
      AND name LIKE file_pattern
    ORDER BY created_at ASC
    LIMIT 500 -- Process in batches
  LOOP
    -- Determine original bucket and path
    original_bucket := COALESCE(
      target_bucket,
      file_record.metadata->>'backup_source',
      file_record.metadata->>'archived_from',
      'restored-files-private'
    );
    
    IF restore_original_paths AND file_record.name LIKE 'archived/%' THEN
      -- Extract original path from archived path
      restore_path := regexp_replace(file_record.name, '^archived/[^/]+/', '');
    ELSE
      restore_path := 'restored/' || extract(epoch from NOW()) || '/' || file_record.name;
    END IF;

    BEGIN
      -- Create target bucket if it doesn't exist
      INSERT INTO storage.buckets (id, name, public)
      VALUES (original_bucket, original_bucket, false)
      ON CONFLICT (id) DO NOTHING;

      -- Restore file (if not dry run)
      IF NOT dry_run THEN
        INSERT INTO storage.objects (bucket_id, name, metadata, created_at, owner)
        VALUES (
          original_bucket,
          restore_path,
          file_record.metadata || jsonb_build_object('restored_from', file_record.bucket_id, 'restored_at', NOW()),
          file_record.created_at,
          file_record.owner
        );
      END IF;
      
      restored_count := restored_count + 1;
      restored_files := restored_files || jsonb_build_object(
        'archive_path', archive_bucket || '/' || file_record.name,
        'restored_path', original_bucket || '/' || restore_path,
        'size', (file_record.metadata->>'size')::bigint
      );
      
    EXCEPTION WHEN OTHERS THEN
      failed_count := failed_count + 1;
      failed_files := failed_files || jsonb_build_object(
        'file', file_record.name,
        'error', SQLERRM
      );
    END;
  END LOOP;

  -- Log the restore
  INSERT INTO public.security_audit_log (
    user_id, action_type, resource_type, details, risk_level
  ) VALUES (
    auth.uid(), 
    CASE WHEN dry_run THEN 'RESTORE_SIMULATION' ELSE 'RESTORE_EXECUTED' END,
    'storage_objects', 
    jsonb_build_object(
      'archive_bucket', archive_bucket,
      'target_bucket', target_bucket,
      'file_pattern', file_pattern,
      'restored_count', restored_count,
      'failed_count', failed_count,
      'dry_run', dry_run
    ), 'medium'
  );

  RETURN jsonb_build_object(
    'success', true,
    'dry_run', dry_run,
    'restored_count', restored_count,
    'failed_count', failed_count,
    'restored_files', restored_files,
    'failed_files', failed_files,
    'message', CASE 
      WHEN dry_run THEN 'Restore simulation completed'
      ELSE 'Restore completed successfully'
    END
  );
END;
$function$;

-- Function to find duplicate files
CREATE OR REPLACE FUNCTION public.find_duplicate_files(
  bucket_filter text DEFAULT NULL,
  min_file_size bigint DEFAULT 1024
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'storage'
AS $function$
DECLARE
  duplicates jsonb := '[]'::jsonb;
  duplicate_record RECORD;
  total_duplicates integer := 0;
  potential_savings bigint := 0;
BEGIN
  -- Only allow admins and team members to find duplicates
  IF NOT (
    has_role(auth.uid(), 'admin'::app_role) 
    OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid() AND status = 'active')
  ) THEN
    RAISE EXCEPTION 'Access denied: insufficient privileges';
  END IF;

  -- Find files with same name and size (potential duplicates)
  FOR duplicate_record IN 
    WITH file_groups AS (
      SELECT 
        regexp_replace(name, '^.*/([^/]+)$', '\1') as filename,
        (metadata->>'size')::bigint as file_size,
        array_agg(
          jsonb_build_object(
            'bucket_id', bucket_id,
            'full_path', name,
            'created_at', created_at,
            'owner', owner
          ) ORDER BY created_at
        ) as files,
        COUNT(*) as duplicate_count
      FROM storage.objects
      WHERE (bucket_filter IS NULL OR bucket_id = bucket_filter)
        AND (metadata->>'size')::bigint >= min_file_size
      GROUP BY regexp_replace(name, '^.*/([^/]+)$', '\1'), (metadata->>'size')::bigint
      HAVING COUNT(*) > 1
    )
    SELECT 
      filename,
      file_size,
      files,
      duplicate_count,
      (duplicate_count - 1) * file_size as savings
    FROM file_groups
    ORDER BY savings DESC
    LIMIT 100
  LOOP
    total_duplicates := total_duplicates + duplicate_record.duplicate_count - 1;
    potential_savings := potential_savings + duplicate_record.savings;
    
    duplicates := duplicates || jsonb_build_object(
      'filename', duplicate_record.filename,
      'file_size', duplicate_record.file_size,
      'duplicate_count', duplicate_record.duplicate_count,
      'potential_savings', duplicate_record.savings,
      'files', duplicate_record.files
    );
  END LOOP;

  RETURN jsonb_build_object(
    'total_duplicate_groups', jsonb_array_length(duplicates),
    'total_duplicate_files', total_duplicates,
    'potential_savings_bytes', potential_savings,
    'duplicates', duplicates,
    'analyzed_at', NOW(),
    'bucket_filter', bucket_filter,
    'min_file_size', min_file_size
  );
END;
$function$;

-- Function to set and monitor storage quotas
CREATE OR REPLACE FUNCTION public.manage_storage_quotas(
  bucket_name text,
  quota_bytes bigint DEFAULT NULL,
  action text DEFAULT 'check'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'storage'
AS $function$
DECLARE
  current_usage bigint;
  quota_info jsonb;
  quota_record RECORD;
BEGIN
  -- Only allow admins to manage quotas
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin privileges required for quota management';
  END IF;

  -- Get current bucket usage
  SELECT COALESCE(SUM((metadata->>'size')::bigint), 0) INTO current_usage
  FROM storage.objects 
  WHERE bucket_id = bucket_name;

  IF action = 'set' AND quota_bytes IS NOT NULL THEN
    -- Create/update quota
    INSERT INTO public.storage_quotas (bucket_name, quota_bytes, created_by, updated_at)
    VALUES (bucket_name, quota_bytes, auth.uid(), NOW())
    ON CONFLICT (bucket_name) 
    DO UPDATE SET 
      quota_bytes = EXCLUDED.quota_bytes,
      updated_at = NOW(),
      created_by = auth.uid();
      
    quota_info := jsonb_build_object(
      'action', 'quota_set',
      'bucket_name', bucket_name,
      'quota_bytes', quota_bytes,
      'current_usage', current_usage,
      'usage_percentage', CASE WHEN quota_bytes > 0 THEN (current_usage::float / quota_bytes * 100) ELSE 0 END
    );
    
  ELSIF action = 'remove' THEN
    -- Remove quota
    DELETE FROM public.storage_quotas WHERE bucket_name = manage_storage_quotas.bucket_name;
    
    quota_info := jsonb_build_object(
      'action', 'quota_removed',
      'bucket_name', bucket_name,
      'current_usage', current_usage
    );
    
  ELSE
    -- Check current quota status
    SELECT * INTO quota_record
    FROM public.storage_quotas 
    WHERE bucket_name = manage_storage_quotas.bucket_name;
    
    quota_info := jsonb_build_object(
      'action', 'quota_check',
      'bucket_name', bucket_name,
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
$function$;

-- Create storage quotas table
CREATE TABLE IF NOT EXISTS public.storage_quotas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_name text UNIQUE NOT NULL,
  quota_bytes bigint NOT NULL CHECK (quota_bytes > 0),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW()
);

-- Enable RLS on storage quotas
ALTER TABLE public.storage_quotas ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for storage quotas
CREATE POLICY "Admins can manage storage quotas"
ON public.storage_quotas
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));