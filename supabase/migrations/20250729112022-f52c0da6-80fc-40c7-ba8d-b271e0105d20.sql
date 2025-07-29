-- Add missing event-related system lists to system_settings table

-- Event Types
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description)
VALUES (
  'event_types',
  '["workshop", "seminar", "conference", "networking", "hackathon", "pitch_session", "training"]',
  'events',
  'Available event types in the system'
) ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- Event Formats
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description)
VALUES (
  'event_formats',
  '["in_person", "virtual", "hybrid"]',
  'events',
  'Available event formats in the system'
) ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- Event Categories
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description)
VALUES (
  'event_categories',
  '["standalone", "campaign_event", "training", "workshop"]',
  'events',
  'Available event categories in the system'
) ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- Event Visibility Options
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description)
VALUES (
  'event_visibility_options',
  '["public", "private", "internal"]',
  'events',
  'Available event visibility options in the system'
) ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();