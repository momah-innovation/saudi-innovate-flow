-- Add supported languages to system_settings table

INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description)
VALUES (
  'supported_languages',
  '[
    {"code": "en", "label": "English", "nativeLabel": "English"},
    {"code": "ar", "label": "Arabic", "nativeLabel": "العربية"},
    {"code": "he", "label": "Hebrew", "nativeLabel": "עברית"},
    {"code": "fa", "label": "Persian", "nativeLabel": "فارسی"}
  ]',
  'system',
  'Supported languages in the system'
) ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();