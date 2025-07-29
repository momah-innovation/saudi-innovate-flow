-- Add missing system lists to system_settings table

-- 1. Stakeholder Influence Levels
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description)
VALUES (
  'stakeholder_influence_levels',
  '["عالي", "متوسط", "منخفض"]',
  'system',
  'Stakeholder influence level options'
) ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- 2. Stakeholder Interest Levels  
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description)
VALUES (
  'stakeholder_interest_levels',
  '["عالي", "متوسط", "منخفض"]',
  'system',
  'Stakeholder interest level options'
) ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- 3. Idea Assignment Types
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description)
VALUES (
  'idea_assignment_types',
  '["reviewer", "evaluator", "implementer", "observer"]',
  'system',
  'Types of assignments for ideas'
) ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- 4. Priority Levels (for assignments and general use)
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description)
VALUES (
  'priority_levels',
  '["low", "medium", "high", "urgent"]',
  'system',
  'Priority level options for assignments and tasks'
) ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- 5. Idea Maturity Levels
INSERT INTO public.system_settings (setting_key, setting_value, setting_category, description)
VALUES (
  'idea_maturity_levels',
  '["concept", "prototype", "pilot", "scaling"]',
  'system',
  'Maturity level options for ideas'
) ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();