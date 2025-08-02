-- Enable RLS on the storage_quotas table if not already enabled
ALTER TABLE public.storage_quotas ENABLE ROW LEVEL SECURITY;

-- Create policies for storage_quotas table
DROP POLICY IF EXISTS "Admins can manage storage quotas" ON public.storage_quotas;
CREATE POLICY "Admins can manage storage quotas" 
ON public.storage_quotas 
FOR ALL 
TO authenticated 
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR has_role(auth.uid(), 'super_admin'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) 
  OR has_role(auth.uid(), 'super_admin'::app_role)
);

-- Also enable RLS on admin_elevation_logs table
ALTER TABLE public.admin_elevation_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admin_elevation_logs
DROP POLICY IF EXISTS "Admins can view elevation logs" ON public.admin_elevation_logs;
CREATE POLICY "Admins can view elevation logs"
ON public.admin_elevation_logs 
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR has_role(auth.uid(), 'super_admin'::app_role)
);