-- Create function to clean up legacy buckets after successful migration
CREATE OR REPLACE FUNCTION public.cleanup_legacy_buckets()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage
AS $$
DECLARE
  legacy_buckets text[] := ARRAY[
    'challenge-attachments',
    'event-resources', 
    'idea-images',
    'partner-images',
    'partner-logos',
    'team-logos',
    'saved-images',
    'dashboard-images',
    'sector-images',
    'opportunity-attachments'
  ];
  bucket_name text;
  file_count integer;
  result json;
  cleanup_summary jsonb := '{"buckets_removed": [], "buckets_with_files": [], "errors": []}'::jsonb;
BEGIN
  -- Only allow admins to cleanup buckets
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Admin access required for bucket cleanup';
  END IF;

  -- Check each legacy bucket
  FOREACH bucket_name IN ARRAY legacy_buckets
  LOOP
    -- Count remaining files in bucket
    SELECT COUNT(*) INTO file_count
    FROM storage.objects 
    WHERE bucket_id = bucket_name;
    
    IF file_count = 0 THEN
      -- Safe to remove empty bucket
      BEGIN
        DELETE FROM storage.buckets WHERE id = bucket_name;
        cleanup_summary := jsonb_set(
          cleanup_summary,
          '{buckets_removed}',
          (cleanup_summary->'buckets_removed') || to_jsonb(bucket_name)
        );
      EXCEPTION WHEN OTHERS THEN
        cleanup_summary := jsonb_set(
          cleanup_summary,
          '{errors}',
          (cleanup_summary->'errors') || to_jsonb(bucket_name || ': ' || SQLERRM)
        );
      END;
    ELSE
      -- Bucket still has files, don't remove
      cleanup_summary := jsonb_set(
        cleanup_summary,
        '{buckets_with_files}',
        (cleanup_summary->'buckets_with_files') || to_jsonb(bucket_name || ' (' || file_count || ' files)')
      );
    END IF;
  END LOOP;

  -- Log the cleanup
  INSERT INTO public.security_audit_log (
    user_id, action_type, resource_type, details, risk_level
  ) VALUES (
    auth.uid(), 'BUCKET_CLEANUP', 'storage_buckets', cleanup_summary, 'medium'
  );

  RETURN cleanup_summary;
END;
$$;

-- Create function to verify RLS policies are properly applied
CREATE OR REPLACE FUNCTION public.verify_storage_rls_coverage()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage
AS $$
DECLARE
  all_buckets text[];
  covered_buckets text[];
  uncovered_buckets text[];
  rls_status jsonb;
BEGIN
  -- Get all bucket names
  SELECT array_agg(id) INTO all_buckets
  FROM storage.buckets;
  
  -- Get buckets covered by comprehensive policies
  SELECT array_agg(DISTINCT bucket_name) INTO covered_buckets
  FROM (
    SELECT unnest(string_to_array(
      regexp_replace(
        regexp_replace(qual, '.*ARRAY\[([^\]]+)\].*', '\1'),
        '''([^'']+)''::text', '\1', 'g'
      ), ','
    )) as bucket_name
    FROM pg_policies 
    WHERE tablename = 'objects' 
      AND schemaname = 'storage'
      AND policyname LIKE 'comprehensive_%'
      AND qual LIKE '%bucket_id = ANY (ARRAY%'
  ) covered;
  
  -- Find uncovered buckets
  SELECT array_agg(bucket) INTO uncovered_buckets
  FROM unnest(all_buckets) as bucket
  WHERE bucket != ALL(COALESCE(covered_buckets, ARRAY[]::text[]));
  
  rls_status := jsonb_build_object(
    'total_buckets', array_length(all_buckets, 1),
    'covered_buckets', array_length(covered_buckets, 1),
    'uncovered_buckets', COALESCE(uncovered_buckets, ARRAY[]::text[]),
    'coverage_percentage', 
    CASE 
      WHEN array_length(all_buckets, 1) > 0 THEN
        ROUND((array_length(covered_buckets, 1)::numeric / array_length(all_buckets, 1)::numeric) * 100, 2)
      ELSE 0
    END,
    'comprehensive_policies_active', true,
    'rls_enabled', (SELECT count(*) FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage') > 0
  );

  RETURN rls_status;
END;
$$;