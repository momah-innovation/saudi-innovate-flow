-- Fix remaining critical security issues with proper RLS policies (corrected syntax)

-- Fix admin_elevation_logs table
DROP POLICY IF EXISTS "Admins can view elevation logs" ON public.admin_elevation_logs;
CREATE POLICY "Super admins only can view elevation logs" ON public.admin_elevation_logs
FOR SELECT USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Fix deputies table
DROP POLICY IF EXISTS "Everyone can view deputies" ON public.deputies;
CREATE POLICY "Authenticated users can view deputies" ON public.deputies
FOR SELECT USING (auth.uid() IS NOT NULL);

-- Fix profiles table security
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);