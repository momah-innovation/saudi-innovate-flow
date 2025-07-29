-- Add remaining missing system lists to system_settings table

-- 1. Campaign Theme Options (found in CampaignWizard)
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description)
VALUES (
  'campaign_theme_options',
  '["digital_transformation", "sustainability", "smart_cities", "healthcare", "education", "fintech", "energy", "transportation"]',
  'system',
  'Campaign theme options'
) ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- 2. Attendance Status Options (found in ParticipantManagement)
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description)
VALUES (
  'attendance_status_options',
  '["registered", "attended", "absent", "cancelled", "confirmed"]',
  'system',
  'Event attendance status options'
) ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- 3. Evaluator Types (using existing expert role types but creating specific for evaluations)
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description)
VALUES (
  'evaluator_types',
  '["lead_expert", "evaluator", "reviewer", "subject_matter_expert", "external_consultant"]',
  'system',
  'Evaluator type options for evaluations'
) ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- 4. Relationship Types (found in RelationshipOverview)
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description)
VALUES (
  'relationship_types',
  '["direct", "indirect", "collaborative", "competitive", "supportive"]',
  'system',
  'Relationship type options for stakeholder relationships'
) ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- 5. Organization Types (found in multiple pages)
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description)
VALUES (
  'organization_types',
  '["operational", "strategic", "administrative", "technical", "support"]',
  'system',
  'Organization type options'
) ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();