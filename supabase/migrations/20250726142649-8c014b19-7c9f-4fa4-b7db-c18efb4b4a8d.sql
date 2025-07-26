-- Add missing configurable lists to system settings

-- Focus Question Types
INSERT INTO system_settings (setting_key, setting_value, setting_category, description)
VALUES (
  'focus_question_types',
  '["general", "technical", "business", "impact", "implementation", "social", "ethical", "medical", "regulatory"]',
  'Lists',
  'Available types for focus questions'
);

-- Experience Levels
INSERT INTO system_settings (setting_key, setting_value, setting_category, description)
VALUES (
  'experience_levels',
  '["beginner", "intermediate", "advanced", "expert"]',
  'Lists',
  'Available experience levels for users and experts'
);

-- Expert Role Types
INSERT INTO system_settings (setting_key, setting_value, setting_category, description)
VALUES (
  'expert_role_types',
  '["lead_expert", "evaluator", "reviewer", "subject_matter_expert", "external_consultant"]',
  'Lists',
  'Available role types for expert assignments'
);