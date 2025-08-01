-- Export & Migration Functions

-- Function to export storage metadata to JSON
CREATE OR REPLACE FUNCTION public.export_storage_metadata(
  bucket_filter text DEFAULT NULL,
  include_file_urls boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'storage'
AS $function$
DECLARE
  export_data jsonb := '{"buckets": [], "files": [], "generated_at": null, "total_size": 0, "total_files": 0}'::jsonb;
  bucket_data jsonb := '[]'::jsonb;
  file_data jsonb := '[]'::jsonb;
  total_size bigint := 0;
  total_files bigint := 0;
  bucket_record RECORD;
  file_record RECORD;
BEGIN
  -- Only allow admins to export metadata
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin privileges required for export';
  END IF;

  -- Export bucket information
  FOR bucket_record IN 
    SELECT 
      b.id,
      b.name,
      b.public,
      b.created_at,
      b.updated_at,
      COUNT(o.id) as file_count,
      COALESCE(SUM((o.metadata->>'size')::bigint), 0) as bucket_size
    FROM storage.buckets b
    LEFT JOIN storage.objects o ON b.id = o.bucket_id
    WHERE bucket_filter IS NULL OR b.id = bucket_filter
    GROUP BY b.id, b.name, b.public, b.created_at, b.updated_at
  LOOP
    bucket_data := bucket_data || jsonb_build_object(
      'id', bucket_record.id,
      'name', bucket_record.name,
      'public', bucket_record.public,
      'created_at', bucket_record.created_at,
      'updated_at', bucket_record.updated_at,
      'file_count', bucket_record.file_count,
      'size', bucket_record.bucket_size
    );
  END LOOP;

  -- Export file information
  FOR file_record IN 
    SELECT 
      o.name,
      o.bucket_id,
      o.owner,
      o.created_at,
      o.updated_at,
      o.last_accessed_at,
      o.metadata,
      CASE 
        WHEN include_file_urls AND b.public THEN 
          'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/' || o.bucket_id || '/' || o.name
        ELSE NULL
      END as public_url
    FROM storage.objects o
    JOIN storage.buckets b ON o.bucket_id = b.id
    WHERE bucket_filter IS NULL OR o.bucket_id = bucket_filter
    ORDER BY o.created_at DESC
  LOOP
    file_data := file_data || jsonb_build_object(
      'name', file_record.name,
      'bucket_id', file_record.bucket_id,
      'owner', file_record.owner,
      'created_at', file_record.created_at,
      'updated_at', file_record.updated_at,
      'last_accessed_at', file_record.last_accessed_at,
      'metadata', file_record.metadata,
      'public_url', file_record.public_url,
      'size', COALESCE((file_record.metadata->>'size')::bigint, 0)
    );
    
    total_size := total_size + COALESCE((file_record.metadata->>'size')::bigint, 0);
    total_files := total_files + 1;
  END LOOP;

  -- Build final export
  export_data := jsonb_build_object(
    'buckets', bucket_data,
    'files', file_data,
    'generated_at', NOW(),
    'total_size', total_size,
    'total_files', total_files,
    'bucket_filter', bucket_filter,
    'include_urls', include_file_urls
  );

  -- Log the export
  INSERT INTO public.security_audit_log (
    user_id, action_type, resource_type, details, risk_level
  ) VALUES (
    auth.uid(), 'STORAGE_EXPORT', 'storage_metadata', 
    jsonb_build_object(
      'bucket_filter', bucket_filter,
      'total_files', total_files,
      'total_size', total_size,
      'include_urls', include_file_urls
    ), 'medium'
  );

  RETURN export_data;
END;
$function$;

-- Function to migrate files between buckets
CREATE OR REPLACE FUNCTION public.migrate_files_between_buckets(
  source_bucket text,
  target_bucket text,
  file_pattern text DEFAULT '%',
  preserve_paths boolean DEFAULT true,
  dry_run boolean DEFAULT true
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'storage'
AS $function$
DECLARE
  migrated_count integer := 0;
  failed_count integer := 0;
  migrated_files jsonb := '[]'::jsonb;
  failed_files jsonb := '[]'::jsonb;
  file_record RECORD;
  new_path text;
BEGIN
  -- Only allow admins to migrate files
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin privileges required for migration';
  END IF;

  -- Create target bucket if it doesn't exist
  INSERT INTO storage.buckets (id, name, public)
  VALUES (target_bucket, target_bucket, false)
  ON CONFLICT (id) DO NOTHING;

  -- Process files matching pattern
  FOR file_record IN 
    SELECT name, bucket_id, metadata, created_at, owner
    FROM storage.objects 
    WHERE bucket_id = source_bucket 
      AND name LIKE file_pattern
    ORDER BY created_at ASC
    LIMIT 500 -- Process in batches
  LOOP
    -- Determine new path
    IF preserve_paths THEN
      new_path := file_record.name;
    ELSE
      new_path := 'migrated/' || extract(epoch from NOW()) || '/' || file_record.name;
    END IF;

    BEGIN
      -- Copy to target bucket (if not dry run)
      IF NOT dry_run THEN
        INSERT INTO storage.objects (bucket_id, name, metadata, created_at, owner)
        VALUES (
          target_bucket,
          new_path,
          file_record.metadata || jsonb_build_object('migrated_from', file_record.bucket_id, 'migrated_at', NOW()),
          file_record.created_at,
          file_record.owner
        );
        
        -- Delete from source bucket
        DELETE FROM storage.objects 
        WHERE bucket_id = file_record.bucket_id AND name = file_record.name;
      END IF;
      
      migrated_count := migrated_count + 1;
      migrated_files := migrated_files || jsonb_build_object(
        'original_path', source_bucket || '/' || file_record.name,
        'new_path', target_bucket || '/' || new_path,
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

  -- Log the migration
  INSERT INTO public.security_audit_log (
    user_id, action_type, resource_type, details, risk_level
  ) VALUES (
    auth.uid(), 
    CASE WHEN dry_run THEN 'MIGRATION_SIMULATION' ELSE 'MIGRATION_EXECUTED' END,
    'storage_objects', 
    jsonb_build_object(
      'source_bucket', source_bucket,
      'target_bucket', target_bucket,
      'file_pattern', file_pattern,
      'migrated_count', migrated_count,
      'failed_count', failed_count,
      'dry_run', dry_run
    ), 'high'
  );

  RETURN jsonb_build_object(
    'success', true,
    'dry_run', dry_run,
    'migrated_count', migrated_count,
    'failed_count', failed_count,
    'migrated_files', migrated_files,
    'failed_files', failed_files,
    'message', CASE 
      WHEN dry_run THEN 'Migration simulation completed'
      ELSE 'Migration completed successfully'
    END
  );
END;
$function$;

-- Function to create bucket backup
CREATE OR REPLACE FUNCTION public.create_bucket_backup(
  source_bucket text,
  backup_name text DEFAULT NULL,
  include_metadata boolean DEFAULT true
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'storage'
AS $function$
DECLARE
  backup_bucket text;
  backup_count integer := 0;
  total_size bigint := 0;
  file_record RECORD;
  backup_info jsonb;
BEGIN
  -- Only allow admins to create backups
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin privileges required for backup';
  END IF;

  -- Generate backup bucket name
  backup_bucket := COALESCE(backup_name, 'backup-' || source_bucket || '-' || extract(epoch from NOW())::text);

  -- Create backup bucket
  INSERT INTO storage.buckets (id, name, public)
  VALUES (backup_bucket, backup_bucket, false)
  ON CONFLICT (id) DO NOTHING;

  -- Copy all files to backup bucket
  FOR file_record IN 
    SELECT name, metadata, created_at, owner
    FROM storage.objects 
    WHERE bucket_id = source_bucket
    ORDER BY created_at ASC
  LOOP
    -- Copy file with backup metadata
    INSERT INTO storage.objects (bucket_id, name, metadata, created_at, owner)
    VALUES (
      backup_bucket,
      file_record.name,
      CASE 
        WHEN include_metadata THEN 
          file_record.metadata || jsonb_build_object(
            'backup_source', source_bucket,
            'backup_created_at', NOW(),
            'backup_created_by', auth.uid()
          )
        ELSE file_record.metadata
      END,
      file_record.created_at,
      file_record.owner
    );
    
    backup_count := backup_count + 1;
    total_size := total_size + COALESCE((file_record.metadata->>'size')::bigint, 0);
  END LOOP;

  -- Create backup info record
  backup_info := jsonb_build_object(
    'backup_bucket', backup_bucket,
    'source_bucket', source_bucket,
    'created_at', NOW(),
    'created_by', auth.uid(),
    'file_count', backup_count,
    'total_size', total_size,
    'include_metadata', include_metadata
  );

  -- Log the backup
  INSERT INTO public.security_audit_log (
    user_id, action_type, resource_type, details, risk_level
  ) VALUES (
    auth.uid(), 'BUCKET_BACKUP_CREATED', 'storage_backup', backup_info, 'medium'
  );

  RETURN jsonb_build_object(
    'success', true,
    'backup_bucket', backup_bucket,
    'source_bucket', source_bucket,
    'file_count', backup_count,
    'total_size', total_size,
    'message', 'Backup created successfully'
  );
END;
$function$;