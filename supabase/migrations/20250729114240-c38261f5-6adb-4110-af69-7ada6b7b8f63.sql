-- Add final remaining missing system lists to system_settings table

-- 1. Assignment Types (found in TeamManagementContent)
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description)
VALUES (
  'assignment_types',
  '["campaign", "event", "project", "content", "analysis"]',
  'system',
  'Assignment type options for team management'
) ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- 2. Extended Status Types (found in status-badge.tsx)
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description)
VALUES (
  'extended_status_options',
  '["planning", "scheduled", "ongoing", "postponed", "draft", "published"]',
  'system',
  'Extended status options for various entities'
) ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- 3. Sector Types (found in IdeaAnalytics mock data)
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description)
VALUES (
  'sector_types',
  '["health", "education", "transport", "environment", "economy", "technology", "finance", "defense", "social"]',
  'system',
  'Sector type options for various classifications'
) ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- 4. Tag Categories (found in IdeaAnalytics)
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description)
VALUES (
  'tag_categories',
  '["innovation", "digital", "sustainability", "efficiency", "technology", "business", "social", "environmental"]',
  'system',
  'Tag category options for ideas and content'
) ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- 5. Sensitivity Levels (found in FocusQuestionManagementList)
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description)
VALUES (
  'sensitivity_levels',
  '["normal", "sensitive", "confidential"]',
  'system',
  'Sensitivity level options for focus questions and content'
) ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();