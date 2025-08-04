-- Create storage bucket for user avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars-public', 'avatars-public', true)
ON CONFLICT (id) DO NOTHING;

-- Create comprehensive storage policies for avatars
CREATE POLICY "comprehensive_avatars_select" ON storage.objects 
FOR SELECT USING (bucket_id = 'avatars-public');

CREATE POLICY "comprehensive_avatars_insert" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'avatars-public' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND (storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'gif', 'webp')
);

CREATE POLICY "comprehensive_avatars_update" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'avatars-public' 
  AND auth.uid()::text = (storage.foldername(name))[1]
) WITH CHECK (
  bucket_id = 'avatars-public' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND (storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'gif', 'webp')
);

CREATE POLICY "comprehensive_avatars_delete" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'avatars-public' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add additional profile fields if they don't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio_ar TEXT,
ADD COLUMN IF NOT EXISTS bio_en TEXT,
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS location VARCHAR(255),
ADD COLUMN IF NOT EXISTS website VARCHAR(255),
ADD COLUMN IF NOT EXISTS twitter_handle VARCHAR(100),
ADD COLUMN IF NOT EXISTS linkedin_profile VARCHAR(255),
ADD COLUMN IF NOT EXISTS specialization VARCHAR(255),
ADD COLUMN IF NOT EXISTS years_of_experience INTEGER,
ADD COLUMN IF NOT EXISTS education_level VARCHAR(50),
ADD COLUMN IF NOT EXISTS current_position VARCHAR(255),
ADD COLUMN IF NOT EXISTS organization VARCHAR(255),
ADD COLUMN IF NOT EXISTS profile_completion_percentage INTEGER DEFAULT 20;

-- Update profile completion trigger
CREATE OR REPLACE FUNCTION public.calculate_profile_completion()
RETURNS TRIGGER AS $$
DECLARE
  completion_score INTEGER := 0;
  total_fields INTEGER := 15;
BEGIN
  -- Base fields (always present)
  completion_score := 2; -- email and created_at
  
  -- Optional fields with weights
  IF NEW.display_name IS NOT NULL AND LENGTH(NEW.display_name) > 0 THEN
    completion_score := completion_score + 1;
  END IF;
  
  IF NEW.profile_image_url IS NOT NULL THEN
    completion_score := completion_score + 1;
  END IF;
  
  IF NEW.bio_ar IS NOT NULL AND LENGTH(NEW.bio_ar) > 20 THEN
    completion_score := completion_score + 1;
  END IF;
  
  IF NEW.bio_en IS NOT NULL AND LENGTH(NEW.bio_en) > 20 THEN
    completion_score := completion_score + 1;
  END IF;
  
  IF NEW.phone IS NOT NULL AND LENGTH(NEW.phone) > 0 THEN
    completion_score := completion_score + 1;
  END IF;
  
  IF NEW.location IS NOT NULL AND LENGTH(NEW.location) > 0 THEN
    completion_score := completion_score + 1;
  END IF;
  
  IF NEW.specialization IS NOT NULL AND LENGTH(NEW.specialization) > 0 THEN
    completion_score := completion_score + 1;
  END IF;
  
  IF NEW.current_position IS NOT NULL AND LENGTH(NEW.current_position) > 0 THEN
    completion_score := completion_score + 1;
  END IF;
  
  IF NEW.organization IS NOT NULL AND LENGTH(NEW.organization) > 0 THEN
    completion_score := completion_score + 1;
  END IF;
  
  IF NEW.education_level IS NOT NULL THEN
    completion_score := completion_score + 1;
  END IF;
  
  IF NEW.years_of_experience IS NOT NULL THEN
    completion_score := completion_score + 1;
  END IF;
  
  IF NEW.linkedin_profile IS NOT NULL AND LENGTH(NEW.linkedin_profile) > 0 THEN
    completion_score := completion_score + 1;
  END IF;
  
  IF NEW.website IS NOT NULL AND LENGTH(NEW.website) > 0 THEN
    completion_score := completion_score + 1;
  END IF;
  
  -- Calculate percentage
  NEW.profile_completion_percentage := ROUND((completion_score::FLOAT / total_fields::FLOAT) * 100);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for profile completion calculation
DROP TRIGGER IF EXISTS trigger_calculate_profile_completion ON public.profiles;
CREATE TRIGGER trigger_calculate_profile_completion
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_profile_completion();

-- Update existing profiles to calculate completion
UPDATE public.profiles SET updated_at = updated_at;