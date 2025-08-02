-- Assign admin role to the current authenticated user (if they exist)
-- This will work once the user is logged in
INSERT INTO public.user_roles (user_id, role, is_active, granted_at)
SELECT 
  id, 
  'admin'::app_role, 
  true, 
  now()
FROM auth.users 
WHERE email = 'momah.innovation@gmail.com'  -- Replace with actual admin email
ON CONFLICT (user_id, role) DO UPDATE SET
  is_active = true,
  granted_at = now();