-- Expand the app_role enum to include more roles
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'user_manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'role_manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'challenge_manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'expert_coordinator';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'content_manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'system_auditor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'data_analyst';

-- Create role_requests table for managing role change requests
CREATE TABLE public.role_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_role app_role NOT NULL,
  current_roles app_role[] DEFAULT '{}',
  reason TEXT,
  justification TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewer_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on role_requests
ALTER TABLE public.role_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own role requests
CREATE POLICY "Users can view their own role requests"
ON public.role_requests
FOR SELECT
TO authenticated
USING (requester_id = auth.uid());

-- Users can create their own role requests
CREATE POLICY "Users can create role requests"
ON public.role_requests
FOR INSERT
TO authenticated
WITH CHECK (requester_id = auth.uid());

-- Users can update their own pending role requests
CREATE POLICY "Users can update their pending role requests"
ON public.role_requests
FOR UPDATE
TO authenticated
USING (requester_id = auth.uid() AND status = 'pending');

-- Admins and role managers can view all role requests
CREATE POLICY "Admins can view all role requests"
ON public.role_requests
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role) OR
  has_role(auth.uid(), 'role_manager'::app_role) OR
  has_role(auth.uid(), 'user_manager'::app_role)
);

-- Admins and role managers can update role requests (approve/reject)
CREATE POLICY "Admins can manage role requests"
ON public.role_requests
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role) OR
  has_role(auth.uid(), 'role_manager'::app_role) OR
  has_role(auth.uid(), 'user_manager'::app_role)
);

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER update_role_requests_updated_at
  BEFORE UPDATE ON public.role_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create a function to automatically assign innovator role on signup
CREATE OR REPLACE FUNCTION public.assign_default_innovator_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert innovator role for new user
  INSERT INTO public.user_roles (user_id, role, is_active)
  VALUES (NEW.id, 'innovator'::app_role, true);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to assign innovator role on profile creation
CREATE TRIGGER assign_innovator_role_on_profile_creation
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_default_innovator_role();