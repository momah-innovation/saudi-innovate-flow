-- Update all profiles to have 100% completion by filling missing fields
UPDATE public.profiles 
SET 
  profile_completion_percentage = 100,
  -- Ensure all required fields are filled for 100% completion
  bio = COALESCE(bio, 'موظف حكومي ملتزم بتحقيق رؤية المملكة 2030 من خلال الابتكار والتطوير المستمر للخدمات الحكومية'),
  name = COALESCE(name, name_ar, 'موظف'),
  name_ar = COALESCE(name_ar, name, 'موظف'),
  phone = COALESCE(phone, '+966500000000'),
  department = COALESCE(department, 'إدارة عامة'),
  position = COALESCE(position, 'موظف'),
  profile_image_url = COALESCE(profile_image_url, 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/avatars/male-professional-1.jpg'),
  preferred_language = COALESCE(preferred_language, 'ar'),
  updated_at = now()
WHERE profile_completion_percentage < 100;