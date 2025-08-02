-- Assign admin role to the current user for storage quota management
INSERT INTO public.user_roles (user_id, role, is_active, granted_at)
VALUES (auth.uid(), 'admin'::app_role, true, now())
ON CONFLICT (user_id, role) DO UPDATE SET
  is_active = true,
  granted_at = now();