-- Add missing event-related system lists to system_settings table

-- Event Types
INSERT INTO public.system_settings (setting_key, setting_value, setting_type, category, description, created_by)
VALUES (
  'event_types',
  '["workshop", "seminar", "conference", "networking", "hackathon", "pitch_session", "training"]',
  'array',
  'events',
  'Available event types in the system',
  auth.uid()
) ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- Event Formats
INSERT INTO public.system_settings (setting_key, setting_value, setting_type, category, description, created_by)
VALUES (
  'event_formats',
  '["in_person", "virtual", "hybrid"]',
  'array',
  'events',
  'Available event formats in the system',
  auth.uid()
) ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- Event Categories
INSERT INTO public.system_settings (setting_key, setting_value, setting_type, category, description, created_by)
VALUES (
  'event_categories',
  '["standalone", "campaign_event", "training", "workshop"]',
  'array',
  'events',
  'Available event categories in the system',
  auth.uid()
) ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- Event Visibility Options
INSERT INTO public.system_settings (setting_key, setting_value, setting_type, category, description, created_by)
VALUES (
  'event_visibility_options',
  '["public", "private", "internal"]',
  'array',
  'events',
  'Available event visibility options in the system',
  auth.uid()
) ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();