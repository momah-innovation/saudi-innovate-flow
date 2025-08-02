-- Create cleanup log table for tracking automated cleanup operations
CREATE TABLE IF NOT EXISTS public.cleanup_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cleanup_type TEXT NOT NULL CHECK (cleanup_type IN ('auto_scheduled', 'manual', 'api_triggered')),
  files_processed INTEGER DEFAULT 0,
  files_deleted INTEGER DEFAULT 0,
  errors_encountered INTEGER DEFAULT 0,
  execution_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  details JSONB DEFAULT '{}'
);

-- Enable RLS for cleanup logs
ALTER TABLE public.cleanup_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for cleanup logs (admin access only)
CREATE POLICY "Admins can view cleanup logs" 
ON public.cleanup_logs 
FOR SELECT 
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR has_role(auth.uid(), 'super_admin'::app_role)
);

-- Create policy for system to insert cleanup logs
CREATE POLICY "System can create cleanup logs" 
ON public.cleanup_logs 
FOR INSERT 
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_cleanup_logs_type_date ON public.cleanup_logs(cleanup_type, created_at DESC);
CREATE INDEX idx_cleanup_logs_created_at ON public.cleanup_logs(created_at DESC);

-- Enable cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule cleanup to run daily at 2 AM UTC
SELECT cron.schedule(
  'cleanup-temp-files-daily',
  '0 2 * * *', -- Daily at 2 AM UTC
  $$
  SELECT net.http_post(
    url := 'https://jxpbiljkoibvqxzdkgod.supabase.co/functions/v1/auto-cleanup-temp-files',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cGJpbGprb2lidnF4emRrZ29kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ3MTMwOSwiZXhwIjoyMDY5MDQ3MzA5fQ.5p4zKa4vP-K1OhF2GlXWkh_bq1D1qGbHu8iJQpYJqYE"}'::jsonb,
    body := '{"scheduled": true}'::jsonb
  );
  $$
);

-- Create function to manually trigger cleanup (for admin use)
CREATE OR REPLACE FUNCTION public.trigger_manual_cleanup()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Only allow admins to trigger manual cleanup
  IF NOT (
    has_role(auth.uid(), 'admin'::app_role) 
    OR has_role(auth.uid(), 'super_admin'::app_role)
  ) THEN
    RAISE EXCEPTION 'Access denied: admin privileges required';
  END IF;

  -- Call the cleanup function
  SELECT net.http_post(
    url := 'https://jxpbiljkoibvqxzdkgod.supabase.co/functions/v1/auto-cleanup-temp-files',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cGJpbGprb2lidnF4emRrZ29kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ3MTMwOSwiZXhwIjoyMDY5MDQ3MzA5fQ.5p4zKa4vP-K1OhF2GlXWkh_bq1D1qGbHu8iJQpYJqYE"}'::jsonb,
    body := '{"manual": true}'::jsonb
  ) INTO result;

  -- Log the manual trigger
  INSERT INTO public.cleanup_logs (
    cleanup_type,
    details
  ) VALUES (
    'manual',
    jsonb_build_object(
      'triggered_by', auth.uid(),
      'trigger_time', NOW(),
      'method', 'manual_function'
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Cleanup triggered successfully',
    'triggered_at', NOW()
  );
END;
$$;