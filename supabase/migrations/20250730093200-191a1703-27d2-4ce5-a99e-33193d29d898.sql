-- Enhance profiles table with avatar metadata and validation
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS avatar_version INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS avatar_uploaded_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS avatar_file_size INTEGER,
  ADD COLUMN IF NOT EXISTS avatar_mime_type VARCHAR(50);

-- Add constraint to ensure valid avatar URLs
ALTER TABLE profiles 
  ADD CONSTRAINT avatar_url_format 
  CHECK (
    profile_image_url IS NULL OR 
    profile_image_url ~* '^https://.*\.(jpg|jpeg|png|webp|gif)(\?.*)?$'
  );

-- Create function to validate and update avatar metadata
CREATE OR REPLACE FUNCTION public.update_avatar_metadata()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Update metadata when avatar URL changes
  IF OLD.profile_image_url IS DISTINCT FROM NEW.profile_image_url THEN
    NEW.avatar_uploaded_at = NOW();
    NEW.avatar_version = COALESCE(OLD.avatar_version, 0) + 1;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for automatic metadata updates
DROP TRIGGER IF EXISTS update_avatar_metadata_trigger ON profiles;
CREATE TRIGGER update_avatar_metadata_trigger
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_avatar_metadata();

-- Update existing records with metadata
UPDATE profiles 
SET 
  avatar_uploaded_at = created_at,
  avatar_version = 1,
  avatar_mime_type = 'image/jpeg'
WHERE profile_image_url IS NOT NULL AND avatar_uploaded_at IS NULL;