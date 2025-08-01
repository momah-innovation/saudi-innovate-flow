-- Add uploader settings for all existing storage buckets
INSERT INTO public.uploader_settings (setting_type, setting_key, setting_value, is_active, created_by)
SELECT 
  'upload_config' as setting_type,
  b.id as setting_key,
  jsonb_build_object(
    'uploadType', b.id,
    'bucket', b.id,
    'path', '',
    'maxSizeBytes', 10485760, -- 10MB default
    'allowedTypes', ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
    'maxFiles', 5,
    'enabled', true,
    'autoCleanup', false,
    'cleanupDays', 0
  ) as setting_value,
  true as is_active,
  auth.uid() as created_by
FROM storage.buckets b
WHERE NOT EXISTS (
  SELECT 1 FROM public.uploader_settings us 
  WHERE us.setting_type = 'upload_config' 
  AND us.setting_key = b.id
);