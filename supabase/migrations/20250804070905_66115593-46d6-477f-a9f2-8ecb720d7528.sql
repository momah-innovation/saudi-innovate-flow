-- Insert the new roles into role_hierarchy with proper enum casting
INSERT INTO public.role_hierarchy (role, hierarchy_level, can_assign_roles, requires_approval_for) VALUES
('team_lead', '3'::role_hierarchy_level, ARRAY['innovator', 'viewer']::app_role[], ARRAY[]::app_role[]),
('project_manager', '3'::role_hierarchy_level, ARRAY['team_lead', 'innovator', 'viewer']::app_role[], ARRAY[]::app_role[]),
('research_lead', '3'::role_hierarchy_level, ARRAY['domain_expert', 'evaluator', 'innovator', 'viewer']::app_role[], ARRAY[]::app_role[]),
('innovation_manager', '2'::role_hierarchy_level, ARRAY['project_manager', 'team_lead', 'research_lead', 'domain_expert', 'evaluator', 'innovator', 'viewer']::app_role[], ARRAY[]::app_role[]),
('external_expert', '4'::role_hierarchy_level, ARRAY[]::app_role[], ARRAY[]::app_role[]),
('mentor', '4'::role_hierarchy_level, ARRAY[]::app_role[], ARRAY[]::app_role[]),
('judge', '4'::role_hierarchy_level, ARRAY[]::app_role[], ARRAY[]::app_role[]),
('facilitator', '4'::role_hierarchy_level, ARRAY['innovator', 'viewer']::app_role[], ARRAY[]::app_role[])
ON CONFLICT (role) DO NOTHING;

-- Create profiles table if not exists
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

-- Enable RLS on profiles if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;