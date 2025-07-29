-- Create profiles table first, then comprehensive seed data

-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  avatar_url text,
  bio text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create profiles for existing users
INSERT INTO profiles (id, first_name, last_name, avatar_url, bio) 
VALUES 
('8066cfaf-4a91-4985-922b-74f6a286c441', 'أحمد', 'العثمان', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'مدير الابتكار ذو خبرة واسعة في التطوير التنظيمي والتحول الرقمي'),
('fa80bed2-ed61-4c27-8941-f713cf050944', 'فاطمة', 'الزهراني', 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150&h=150&fit=crop&crop=face', 'مديرة حملات متخصصة في إدارة المشاريع والتنسيق بين الفرق')
ON CONFLICT (id) DO NOTHING;

-- Assign roles to existing users
INSERT INTO user_roles (user_id, role, is_active) VALUES 
('8066cfaf-4a91-4985-922b-74f6a286c441', 'admin', true),
('fa80bed2-ed61-4c27-8941-f713cf050944', 'team_member', true),
('8066cfaf-4a91-4985-922b-74f6a286c441', 'expert', true),
('fa80bed2-ed61-4c27-8941-f713cf050944', 'innovator', true)
ON CONFLICT (user_id, role) DO NOTHING;