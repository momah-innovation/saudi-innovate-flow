-- Fix security issues from the linter warnings

-- Update the trigger_manual_cleanup function to fix search path issue
CREATE OR REPLACE FUNCTION public.trigger_manual_cleanup()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'  -- Fix: Set specific search path
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Only allow admins to trigger manual cleanup
  IF NOT (
    public.has_role(auth.uid(), 'admin'::public.app_role) 
    OR public.has_role(auth.uid(), 'super_admin'::public.app_role)
  ) THEN
    RAISE EXCEPTION 'Access denied: admin privileges required';
  END IF;

  -- Call the cleanup function
  SELECT extensions.http_post(
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

-- Update the cron job to use the correct extension schema
SELECT cron.unschedule('cleanup-temp-files-daily');

-- Re-schedule with proper formatting
SELECT cron.schedule(
  'cleanup-temp-files-daily',
  '0 2 * * *',
  $$
  SELECT extensions.http_post(
    url := 'https://jxpbiljkoibvqxzdkgod.supabase.co/functions/v1/auto-cleanup-temp-files',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cGJpbGprb2lidnF4emRrZ29kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQ3MTMwOSwiZXhwIjoyMDY5MDQ3MzA5fQ.5p4zKa4vP-K1OhF2GlXWkh_bq1D1qGbHu8iJQpYJqYE"}'::jsonb,
    body := '{"scheduled": true}'::jsonb
  );
  $$
);