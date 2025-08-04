-- Add missing important roles to the app_role enum
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'team_lead';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'project_manager';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'research_lead';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'innovation_manager';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'external_expert';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'mentor';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'judge';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'facilitator';

-- Insert the new roles into role_hierarchy
INSERT INTO public.role_hierarchy (role, hierarchy_level, can_assign_roles, requires_approval_for) VALUES
('team_lead', 3, ARRAY['innovator', 'viewer']::app_role[], ARRAY[]::app_role[]),
('project_manager', 3, ARRAY['team_lead', 'innovator', 'viewer']::app_role[], ARRAY[]::app_role[]),
('research_lead', 3, ARRAY['domain_expert', 'evaluator', 'innovator', 'viewer']::app_role[], ARRAY[]::app_role[]),
('innovation_manager', 2, ARRAY['project_manager', 'team_lead', 'research_lead', 'domain_expert', 'evaluator', 'innovator', 'viewer']::app_role[], ARRAY[]::app_role[]),
('external_expert', 4, ARRAY[]::app_role[], ARRAY[]::app_role[]),
('mentor', 4, ARRAY[]::app_role[], ARRAY[]::app_role[]),
('judge', 4, ARRAY[]::app_role[], ARRAY[]::app_role[]),
('facilitator', 4, ARRAY['innovator', 'viewer']::app_role[], ARRAY[]::app_role[])
ON CONFLICT (role) DO UPDATE SET
  hierarchy_level = EXCLUDED.hierarchy_level,
  can_assign_roles = EXCLUDED.can_assign_roles,
  requires_approval_for = EXCLUDED.requires_approval_for;

-- Update existing role hierarchy to include new roles in assignment capabilities
UPDATE public.role_hierarchy 
SET can_assign_roles = can_assign_roles || ARRAY['team_lead', 'project_manager', 'research_lead', 'innovation_manager', 'external_expert', 'mentor', 'judge', 'facilitator']::app_role[]
WHERE role IN ('super_admin');

UPDATE public.role_hierarchy 
SET can_assign_roles = can_assign_roles || ARRAY['team_lead', 'project_manager', 'research_lead', 'innovation_manager', 'external_expert', 'mentor', 'judge', 'facilitator']::app_role[]
WHERE role IN ('admin');

UPDATE public.role_hierarchy 
SET can_assign_roles = can_assign_roles || ARRAY['team_lead', 'external_expert', 'mentor', 'judge', 'facilitator']::app_role[]
WHERE role IN ('challenge_manager', 'expert_coordinator', 'innovation_manager');

-- Create a profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  display_name_ar text,
  email text,
  phone text,
  organization text,
  department text,
  position text,
  bio text,
  bio_ar text,
  profile_image_url text,
  linkedin_url text,
  twitter_url text,
  website_url text,
  skills text[],
  languages text[],
  timezone text DEFAULT 'Asia/Riyadh',
  notification_preferences jsonb DEFAULT '{"email": true, "push": true, "sms": false}'::jsonb,
  privacy_settings jsonb DEFAULT '{"profile_visibility": "public", "contact_info_visible": true}'::jsonb,
  is_verified boolean DEFAULT false,
  verification_documents text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  last_active_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view public profiles" ON public.profiles
  FOR SELECT USING (
    (privacy_settings->>'profile_visibility' = 'public') OR 
    user_id = auth.uid() OR
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'super_admin'::app_role)
  );

CREATE POLICY "Users can manage their own profile" ON public.profiles
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'super_admin'::app_role)
  );

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  
  -- Assign default innovator role
  INSERT INTO public.user_roles (user_id, role, is_active, granted_by)
  VALUES (NEW.id, 'innovator'::app_role, true, NEW.id)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_profile_for_new_user();

-- Create updated_at trigger for profiles
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();