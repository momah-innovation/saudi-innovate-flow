-- Final security cleanup: Fix remaining search_path issues (simplified)

-- Fix any remaining trigger functions that might be missing search_path
CREATE OR REPLACE FUNCTION public.calculate_profile_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  completion_score INTEGER := 0;
  total_fields INTEGER := 10;
BEGIN
  -- Base fields (always present)
  completion_score := 2; -- email and created_at
  
  IF NEW.name IS NOT NULL AND LENGTH(NEW.name) > 0 THEN
    completion_score := completion_score + 1;
  END IF;
  
  IF NEW.name_ar IS NOT NULL AND LENGTH(NEW.name_ar) > 0 THEN
    completion_score := completion_score + 1;
  END IF;
  
  IF NEW.profile_image_url IS NOT NULL THEN
    completion_score := completion_score + 1;
  END IF;
  
  IF NEW.bio IS NOT NULL AND LENGTH(NEW.bio) > 20 THEN
    completion_score := completion_score + 1;
  END IF;
  
  IF NEW.phone IS NOT NULL AND LENGTH(NEW.phone) > 0 THEN
    completion_score := completion_score + 1;
  END IF;
  
  IF NEW.department IS NOT NULL AND LENGTH(NEW.department) > 0 THEN
    completion_score := completion_score + 1;
  END IF;
  
  IF NEW.position IS NOT NULL AND LENGTH(NEW.position) > 0 THEN
    completion_score := completion_score + 1;
  END IF;
  
  NEW.profile_completion_percentage := ROUND((completion_score::FLOAT / total_fields::FLOAT) * 100);
  
  RETURN NEW;
END;
$$;

-- Fix assign_default_innovator_role function
CREATE OR REPLACE FUNCTION public.assign_default_innovator_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role, is_active)
  VALUES (NEW.id, 'innovator'::public.app_role, true);
  
  RETURN NEW;
END;
$$;

-- Fix send_notification function
CREATE OR REPLACE FUNCTION public.send_notification(
  target_user_id UUID,
  notification_title VARCHAR,
  notification_message TEXT,
  notification_type VARCHAR DEFAULT 'info',
  notification_metadata JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type, metadata)
  VALUES (target_user_id, notification_title, notification_message, notification_type, notification_metadata)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Fix notify_role_request_review function
CREATE OR REPLACE FUNCTION public.notify_role_request_review()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF OLD.status = 'pending' AND NEW.status IN ('approved', 'rejected') THEN
    PERFORM public.send_notification(
      NEW.requester_id,
      CASE 
        WHEN NEW.status = 'approved' THEN 'Role Request Approved'
        ELSE 'Role Request Update'
      END,
      CASE 
        WHEN NEW.status = 'approved' THEN 'Your role request has been approved! You now have ' || NEW.requested_role || ' access.'
        ELSE 'Your role request has been reviewed. Please check your account for details.'
      END,
      CASE 
        WHEN NEW.status = 'approved' THEN 'success'
        ELSE 'info'
      END,
      jsonb_build_object('role_request_id', NEW.id, 'role', NEW.requested_role)
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Update translations function if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_translations_updated_at') THEN
    EXECUTE '
    CREATE OR REPLACE FUNCTION public.update_translations_updated_at()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = ''public''
    AS $func$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $func$;';
  END IF;
END $$;

-- Performance optimization: Create additional helpful indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_active 
ON public.user_roles (user_id) 
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
ON public.notifications (user_id, created_at DESC) 
WHERE is_read = false;

-- Create a comprehensive security audit function
CREATE OR REPLACE FUNCTION public.audit_user_permissions(_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  audit_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'user_id', _user_id,
    'audit_timestamp', NOW(),
    'active_roles', (
      SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
          'role', role,
          'granted_at', granted_at,
          'expires_at', expires_at,
          'is_active', is_active
        )
      ), '[]'::jsonb)
      FROM public.user_roles 
      WHERE user_id = _user_id AND is_active = true
    ),
    'permissions', public.get_user_permissions(_user_id),
    'profile_completion', (
      SELECT profile_completion_percentage 
      FROM public.profiles 
      WHERE id = _user_id
    ),
    'last_activity', (
      SELECT MAX(created_at) 
      FROM public.analytics_events 
      WHERE user_id = _user_id
    )
  ) INTO audit_result;
  
  RETURN audit_result;
END;
$$;