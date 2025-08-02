-- Create increment_access_count function for file access tracking
CREATE OR REPLACE FUNCTION public.increment_access_count(file_record_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.file_records
  SET 
    access_count = COALESCE(access_count, 0) + 1,
    last_accessed = NOW(),
    updated_at = NOW()
  WHERE id = file_record_id;
END;
$$;