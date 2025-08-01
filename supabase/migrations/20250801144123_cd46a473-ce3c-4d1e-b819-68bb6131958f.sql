-- Create a function to get all storage buckets info
CREATE OR REPLACE FUNCTION public.get_storage_buckets_info()
RETURNS TABLE(
  bucket_id text,
  bucket_name text,
  public boolean,
  created_at timestamp with time zone,
  file_count bigint,
  total_size bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage
AS $$
BEGIN
  -- Only allow admins and team members to access storage bucket info
  IF NOT (
    has_role(auth.uid(), 'admin'::app_role) 
    OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid() AND status = 'active')
  ) THEN
    RAISE EXCEPTION 'Access denied: insufficient privileges to view storage bucket information';
  END IF;

  RETURN QUERY
  SELECT 
    b.id as bucket_id,
    b.name as bucket_name,
    b.public,
    b.created_at,
    COALESCE(COUNT(o.id), 0) as file_count,
    COALESCE(SUM((o.metadata->>'size')::bigint), 0) as total_size
  FROM storage.buckets b
  LEFT JOIN storage.objects o ON b.id = o.bucket_id
  GROUP BY b.id, b.name, b.public, b.created_at
  ORDER BY b.name;
END;
$$;