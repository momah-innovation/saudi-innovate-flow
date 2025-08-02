-- Create RPC function to get storage policies info
CREATE OR REPLACE FUNCTION public.get_storage_policies_info()
RETURNS TABLE(
  name text,
  command text,
  condition text,
  check_expression text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage
AS $$
BEGIN
  -- Only allow admins to view storage policies
  IF NOT (
    has_role(auth.uid(), 'admin'::app_role) 
    OR has_role(auth.uid(), 'super_admin'::app_role)
  ) THEN
    RAISE EXCEPTION 'Access denied: admin privileges required';
  END IF;

  RETURN QUERY
  SELECT 
    pp.policyname::text as name,
    pp.cmd::text as command,
    pp.qual::text as condition,
    COALESCE(pp.with_check, '')::text as check_expression
  FROM pg_policies pp
  WHERE pp.tablename = 'objects' 
    AND pp.schemaname = 'storage'
  ORDER BY pp.policyname;
END;
$$;