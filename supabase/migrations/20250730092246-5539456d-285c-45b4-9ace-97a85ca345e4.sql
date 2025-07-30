-- Assign avatar images to existing users in profiles table
-- For male names, use male professional avatars
UPDATE profiles SET profile_image_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/avatars/male-professional-1.jpg'
WHERE name LIKE '%Abdullah%' AND profile_image_url IS NULL
LIMIT 2;

UPDATE profiles SET profile_image_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/avatars/male-professional-2.jpg'
WHERE name LIKE '%أحمد%' AND profile_image_url IS NULL;

UPDATE profiles SET profile_image_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/avatars/male-professional-3.jpg'
WHERE name LIKE '%محمد%' AND profile_image_url IS NULL;

UPDATE profiles SET profile_image_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/avatars/male-professional-4.jpg'
WHERE name LIKE '%خالد%' AND profile_image_url IS NULL;

UPDATE profiles SET profile_image_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/avatars/male-professional-5.jpg'
WHERE name LIKE '%عبدالله%' AND profile_image_url IS NULL;

UPDATE profiles SET profile_image_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/avatars/male-professional-6.jpg'
WHERE name LIKE '%عمر%' OR name LIKE '%يوسف%' OR name LIKE '%منصور%' OR name LIKE '%فهد%' OR name LIKE '%سلطان%' AND profile_image_url IS NULL;

-- For female names, use female professional avatars
UPDATE profiles SET profile_image_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/avatars/female-professional-1.jpg'
WHERE name LIKE '%فاطمة%' AND profile_image_url IS NULL;

UPDATE profiles SET profile_image_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/avatars/female-professional-2.jpg'
WHERE name LIKE '%سارة%' AND profile_image_url IS NULL;

UPDATE profiles SET profile_image_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/avatars/female-professional-3.jpg'
WHERE name LIKE '%نورا%' AND profile_image_url IS NULL;

UPDATE profiles SET profile_image_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/avatars/female-professional-4.jpg'
WHERE name LIKE '%عائشة%' AND profile_image_url IS NULL;

UPDATE profiles SET profile_image_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/avatars/female-professional-5.jpg'
WHERE name LIKE '%مريم%' AND profile_image_url IS NULL;

UPDATE profiles SET profile_image_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/avatars/female-professional-6.jpg'
WHERE name LIKE '%ليلى%' OR name LIKE '%هند%' OR name LIKE '%ريم%' OR name LIKE '%أميرة%' AND profile_image_url IS NULL;