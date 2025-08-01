-- Advanced storage management functions

-- Function to archive old files by moving them to archive bucket
CREATE OR REPLACE FUNCTION public.archive_old_files(
  source_bucket text,
  days_old integer DEFAULT 365,
  archive_bucket text DEFAULT 'archived-files-private'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'storage'
AS $function$
DECLARE
  file_count integer := 0;
  archived_files jsonb := '[]'::jsonb;
  file_record RECORD;
BEGIN
  -- Only allow admins to archive files
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin privileges required for archiving';
  END IF;

  -- Create archive bucket if it doesn't exist
  INSERT INTO storage.buckets (id, name, public)
  VALUES (archive_bucket, archive_bucket, false)
  ON CONFLICT (id) DO NOTHING;

  -- Find old files to archive
  FOR file_record IN 
    SELECT name, bucket_id, metadata, created_at
    FROM storage.objects 
    WHERE bucket_id = source_bucket 
      AND created_at < NOW() - (days_old || ' days')::INTERVAL
    LIMIT 100 -- Process in batches
  LOOP
    -- Move file to archive bucket (copy metadata)
    INSERT INTO storage.objects (bucket_id, name, metadata, created_at)
    VALUES (
      archive_bucket,
      'archived/' || file_record.bucket_id || '/' || file_record.name,
      file_record.metadata || jsonb_build_object('archived_from', file_record.bucket_id, 'archived_at', NOW()),
      file_record.created_at
    );
    
    -- Delete from original location
    DELETE FROM storage.objects 
    WHERE bucket_id = file_record.bucket_id AND name = file_record.name;
    
    file_count := file_count + 1;
    archived_files := archived_files || jsonb_build_object('file', file_record.name, 'archived_at', NOW());
  END LOOP;

  -- Log the archival
  INSERT INTO public.security_audit_log (
    user_id, action_type, resource_type, details, risk_level
  ) VALUES (
    auth.uid(), 'ARCHIVE_FILES', 'storage_objects', 
    jsonb_build_object(
      'source_bucket', source_bucket,
      'archived_count', file_count,
      'days_old', days_old,
      'archive_bucket', archive_bucket
    ), 'medium'
  );

  RETURN jsonb_build_object(
    'success', true,
    'archived_count', file_count,
    'archived_files', archived_files
  );
END;
$function$;

-- Function to get storage analytics with trends
CREATE OR REPLACE FUNCTION public.get_storage_analytics_with_trends()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'storage'
AS $function$
DECLARE
  total_storage bigint;
  bucket_stats jsonb := '[]'::jsonb;
  growth_trend jsonb;
  bucket_record RECORD;
BEGIN
  -- Only allow admins and team members
  IF NOT (
    has_role(auth.uid(), 'admin'::app_role) 
    OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid() AND status = 'active')
  ) THEN
    RAISE EXCEPTION 'Access denied: insufficient privileges';
  END IF;

  -- Get total storage used
  SELECT COALESCE(SUM((metadata->>'size')::bigint), 0) INTO total_storage
  FROM storage.objects;

  -- Get detailed bucket statistics
  FOR bucket_record IN 
    SELECT 
      b.id,
      b.name,
      b.public,
      COUNT(o.id) as file_count,
      COALESCE(SUM((o.metadata->>'size')::bigint), 0) as total_size,
      MIN(o.created_at) as oldest_file,
      MAX(o.created_at) as newest_file
    FROM storage.buckets b
    LEFT JOIN storage.objects o ON b.id = o.bucket_id
    GROUP BY b.id, b.name, b.public
    ORDER BY total_size DESC
  LOOP
    bucket_stats := bucket_stats || jsonb_build_object(
      'bucket_id', bucket_record.id,
      'bucket_name', bucket_record.name,
      'is_public', bucket_record.public,
      'file_count', bucket_record.file_count,
      'total_size', bucket_record.total_size,
      'oldest_file', bucket_record.oldest_file,
      'newest_file', bucket_record.newest_file,
      'avg_file_size', CASE 
        WHEN bucket_record.file_count > 0 THEN bucket_record.total_size / bucket_record.file_count 
        ELSE 0 
      END
    );
  END LOOP;

  -- Calculate growth trend (last 30 days vs previous 30 days)
  WITH recent_files AS (
    SELECT 
      COUNT(*) as recent_count,
      COALESCE(SUM((metadata->>'size')::bigint), 0) as recent_size
    FROM storage.objects 
    WHERE created_at >= NOW() - INTERVAL '30 days'
  ),
  previous_files AS (
    SELECT 
      COUNT(*) as previous_count,
      COALESCE(SUM((metadata->>'size')::bigint), 0) as previous_size
    FROM storage.objects 
    WHERE created_at >= NOW() - INTERVAL '60 days' 
      AND created_at < NOW() - INTERVAL '30 days'
  )
  SELECT jsonb_build_object(
    'recent_files', recent_count,
    'recent_size', recent_size,
    'previous_files', previous_count,
    'previous_size', previous_size,
    'growth_rate_files', CASE 
      WHEN previous_count > 0 THEN ((recent_count - previous_count)::float / previous_count * 100)
      ELSE 0 
    END,
    'growth_rate_size', CASE 
      WHEN previous_size > 0 THEN ((recent_size - previous_size)::float / previous_size * 100)
      ELSE 0 
    END
  ) INTO growth_trend
  FROM recent_files, previous_files;

  RETURN jsonb_build_object(
    'total_storage', total_storage,
    'bucket_count', (SELECT COUNT(*) FROM storage.buckets),
    'total_files', (SELECT COUNT(*) FROM storage.objects),
    'bucket_stats', bucket_stats,
    'growth_trend', growth_trend,
    'generated_at', NOW()
  );
END;
$function$;

-- Function to bulk cleanup files by pattern
CREATE OR REPLACE FUNCTION public.bulk_cleanup_files(
  bucket_name text,
  file_pattern text DEFAULT '%temp%',
  older_than_days integer DEFAULT 7,
  dry_run boolean DEFAULT true
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'storage'
AS $function$
DECLARE
  file_count integer := 0;
  total_size bigint := 0;
  deleted_files jsonb := '[]'::jsonb;
  file_record RECORD;
BEGIN
  -- Only allow admins for bulk cleanup
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Access denied: admin privileges required for bulk cleanup';
  END IF;

  -- Find matching files
  FOR file_record IN 
    SELECT name, bucket_id, metadata, created_at
    FROM storage.objects 
    WHERE bucket_id = bucket_name 
      AND name LIKE file_pattern
      AND created_at < NOW() - (older_than_days || ' days')::INTERVAL
    ORDER BY created_at ASC
    LIMIT 1000 -- Safety limit
  LOOP
    file_count := file_count + 1;
    total_size := total_size + COALESCE((file_record.metadata->>'size')::bigint, 0);
    
    deleted_files := deleted_files || jsonb_build_object(
      'name', file_record.name,
      'size', (file_record.metadata->>'size')::bigint,
      'created_at', file_record.created_at
    );
    
    -- Actually delete if not dry run
    IF NOT dry_run THEN
      DELETE FROM storage.objects 
      WHERE bucket_id = file_record.bucket_id AND name = file_record.name;
    END IF;
  END LOOP;

  -- Log the cleanup
  INSERT INTO public.security_audit_log (
    user_id, action_type, resource_type, details, risk_level
  ) VALUES (
    auth.uid(), 
    CASE WHEN dry_run THEN 'BULK_CLEANUP_SIMULATION' ELSE 'BULK_CLEANUP_EXECUTED' END,
    'storage_objects', 
    jsonb_build_object(
      'bucket_name', bucket_name,
      'file_pattern', file_pattern,
      'older_than_days', older_than_days,
      'file_count', file_count,
      'total_size', total_size,
      'dry_run', dry_run
    ), 'high'
  );

  RETURN jsonb_build_object(
    'success', true,
    'dry_run', dry_run,
    'file_count', file_count,
    'total_size', total_size,
    'deleted_files', deleted_files,
    'message', CASE 
      WHEN dry_run THEN 'Simulation completed - no files were actually deleted'
      ELSE 'Cleanup completed successfully'
    END
  );
END;
$function$;