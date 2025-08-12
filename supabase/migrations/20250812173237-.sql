-- Fix remaining critical security issues with proper RLS policies

-- Fix admin_elevation_logs table
DROP POLICY IF EXISTS "Admins can view elevation logs" ON public.admin_elevation_logs;
CREATE POLICY "Super admins only can view elevation logs" ON public.admin_elevation_logs
FOR SELECT USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Fix deputies table
DROP POLICY IF EXISTS "Everyone can view deputies" ON public.deputies;
CREATE POLICY "Authenticated users can view deputies" ON public.deputies
FOR SELECT USING (auth.uid() IS NOT NULL);

-- Fix stakeholders table (if not already fixed)
DROP POLICY IF EXISTS "Team members can view stakeholders" ON public.stakeholders;
CREATE POLICY "Authorized users can view stakeholders" ON public.stakeholders
FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'team_member'::app_role) OR
  has_role(auth.uid(), 'organization_admin'::app_role)
);

-- Fix innovation_team_members table (if not already fixed)
DROP POLICY IF EXISTS "Team members can view innovation team members" ON public.innovation_team_members;
CREATE POLICY "Authorized users can view team members" ON public.innovation_team_members
FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'team_member'::app_role) OR
  user_id = auth.uid()
);

-- Fix profiles table security
CREATE POLICY IF NOT EXISTS "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Admins can view all profiles" ON public.profiles
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY IF NOT EXISTS "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);