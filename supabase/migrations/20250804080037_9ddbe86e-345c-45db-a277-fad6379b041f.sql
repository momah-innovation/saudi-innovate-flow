-- Fix migration issue by checking for correct column names first
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public';

-- Update profile completion trigger to use correct field names
CREATE OR REPLACE FUNCTION public.calculate_profile_completion()
RETURNS TRIGGER AS $$
DECLARE
  completion_score INTEGER := 0;
  total_fields INTEGER := 15;
BEGIN
  -- Base fields (always present)
  completion_score := 2; -- email and created_at
  
  -- Optional fields with weights
  IF NEW.full_name_ar IS NOT NULL AND LENGTH(NEW.full_name_ar) > 0 THEN
    completion_score := completion_score + 1;
  END IF;
  
  IF NEW.full_name_en IS NOT NULL AND LENGTH(NEW.full_name_en) > 0 THEN
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