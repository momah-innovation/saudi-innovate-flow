-- Create a simpler function to get basic bucket information without strict permissions
CREATE OR REPLACE FUNCTION public.get_basic_storage_info()
RETURNS TABLE(
  bucket_id text,
  bucket_name text,
  public boolean,
  created_at timestamp with time zone
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage
AS $$
BEGIN
  -- Basic bucket info accessible to authenticated users
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  RETURN QUERY
  SELECT 
    b.id as bucket_id,
    b.name as bucket_name,
    b.public,
    b.created_at
  FROM storage.buckets b
  ORDER BY b.name;
END;
$$;