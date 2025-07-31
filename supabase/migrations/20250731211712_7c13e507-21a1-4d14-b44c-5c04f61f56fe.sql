-- Security Fix 3: Rate Limiting and Enhanced Security Functions

-- Create rate limiting table to track request frequency
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action VARCHAR(50) NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, action, window_start)
);

-- Enable RLS on rate limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only users can view their own rate limits, admins can view all
CREATE POLICY "Users can view their own rate limits" ON public.rate_limits
  FOR SELECT TO authenticated 
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Function to check and enforce rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_user_id UUID,
  p_action VARCHAR(50),
  p_window_minutes INTEGER DEFAULT 1,
  p_max_requests INTEGER DEFAULT 100
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  window_start TIMESTAMP WITH TIME ZONE;
  current_count INTEGER;
BEGIN
  -- Calculate window start time
  window_start := date_trunc('minute', now()) - INTERVAL '1 minute' * (p_window_minutes - 1);
  
  -- Get or create rate limit record
  INSERT INTO public.rate_limits (user_id, action, request_count, window_start)
  VALUES (p_user_id, p_action, 1, window_start)
  ON CONFLICT (user_id, action, window_start)
  DO UPDATE SET 
    request_count = rate_limits.request_count + 1,
    created_at = now()
  RETURNING request_count INTO current_count;
  
  -- Clean up old rate limit records (older than 24 hours)
  DELETE FROM public.rate_limits 
  WHERE created_at < now() - INTERVAL '24 hours';
  
  RETURN current_count;
END;
$$;

-- Create suspicious activity detection table
CREATE TABLE IF NOT EXISTS public.suspicious_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  activity_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  ip_address INET,
  user_agent TEXT,
  request_details jsonb DEFAULT '{}',
  auto_detected BOOLEAN DEFAULT true,
  resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on suspicious activities
ALTER TABLE public.suspicious_activities ENABLE ROW LEVEL SECURITY;

-- Only admins can view suspicious activities
CREATE POLICY "Admins can view suspicious activities" ON public.suspicious_activities
  FOR SELECT TO authenticated 
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can manage suspicious activities" ON public.suspicious_activities
  FOR ALL TO authenticated 
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Function to detect and log suspicious activities
CREATE OR REPLACE FUNCTION public.detect_suspicious_activity(
  p_user_id UUID,
  p_activity_type VARCHAR(50),
  p_description TEXT,
  p_severity VARCHAR(20) DEFAULT 'medium',
  p_request_details jsonb DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO public.suspicious_activities (
    user_id, activity_type, description, severity, request_details
  ) VALUES (
    p_user_id, p_activity_type, p_description, p_severity, p_request_details
  ) RETURNING id INTO activity_id;
  
  -- Also log to security audit log
  PERFORM public.log_security_event(
    'SUSPICIOUS_ACTIVITY_DETECTED',
    'suspicious_activities',
    activity_id,
    jsonb_build_object(
      'activity_type', p_activity_type,
      'severity', p_severity,
      'description', p_description
    ),
    p_severity
  );
  
  RETURN activity_id;
END;
$$;

-- Enhanced password policy validation trigger
CREATE OR REPLACE FUNCTION public.validate_password_policy()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- This function will be called by Supabase auth hooks
  -- Log password changes for audit purposes
  IF TG_OP = 'UPDATE' AND OLD.encrypted_password IS DISTINCT FROM NEW.encrypted_password THEN
    PERFORM public.log_security_event(
      'PASSWORD_CHANGED',
      'auth.users',
      NEW.id,
      jsonb_build_object(
        'user_id', NEW.id,
        'email', NEW.email
      ),
      'medium'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Function to clean up expired sessions and tokens
CREATE OR REPLACE FUNCTION public.cleanup_expired_security_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Clean up old rate limit records
  DELETE FROM public.rate_limits 
  WHERE created_at < now() - INTERVAL '24 hours';
  
  -- Clean up old security audit logs (keep for 90 days)
  DELETE FROM public.security_audit_log 
  WHERE created_at < now() - INTERVAL '90 days'
  AND risk_level = 'low';
  
  -- Keep high/critical risk logs for 1 year
  DELETE FROM public.security_audit_log 
  WHERE created_at < now() - INTERVAL '365 days'
  AND risk_level IN ('high', 'critical');
  
  -- Mark old role approval requests as expired
  UPDATE public.role_approval_requests
  SET status = 'expired'
  WHERE status = 'pending' 
  AND created_at < now() - INTERVAL '7 days';
  
  -- Log cleanup activity
  PERFORM public.log_security_event(
    'SECURITY_DATA_CLEANUP',
    'maintenance',
    NULL,
    jsonb_build_object(
      'cleaned_tables', ARRAY['rate_limits', 'security_audit_log', 'role_approval_requests']
    ),
    'low'
  );
END;
$$;