-- Add remaining missing array settings for complete migration (fixed structure)
INSERT INTO public.system_settings (setting_key, setting_value, data_type, default_value) VALUES
  ('challenge_statuses', '["draft", "published", "active", "closed", "archived", "completed"]', 'array', '["draft", "published", "active"]'),
  ('challenge_types', '["technical", "administrative", "creative", "strategic", "operational"]', 'array', '["technical", "administrative"]'),
  ('expert_role_types', '["evaluator", "mentor", "reviewer", "advisor", "specialist"]', 'array', '["evaluator", "reviewer"]'),
  ('evaluator_types', '["internal", "external", "peer", "expert", "automated"]', 'array', '["internal", "external"]'),
  ('experience_levels', '["beginner", "intermediate", "advanced", "expert"]', 'array', '["beginner", "intermediate", "advanced"]'),
  ('idea_maturity_levels', '["concept", "prototype", "pilot", "ready", "implemented"]', 'array', '["concept", "prototype", "ready"]'),
  ('time_range_options', '["last_7_days", "last_30_days", "last_90_days", "last_6_months", "last_year", "all_time"]', 'array', '["last_30_days", "last_90_days"]'),
  ('question_type_options', '["multiple_choice", "open_text", "rating", "ranking", "yes_no"]', 'array', '["multiple_choice", "open_text"]'),
  ('team_role_options', '["lead", "member", "specialist", "coordinator", "advisor"]', 'array', '["member", "specialist"]'),
  ('team_specialization_options', '["innovation", "research", "development", "design", "strategy", "operations"]', 'array', '["innovation", "research"]'),
  ('requestable_user_roles', '["innovator", "expert", "team_member", "reviewer"]', 'array', '["innovator", "expert"]'),
  ('role_request_justifications', '["expertise_demonstrated", "project_contribution", "domain_knowledge", "leadership_skills"]', 'array', '["expertise_demonstrated", "project_contribution"]'),
  ('role_request_status_options', '["pending", "approved", "rejected", "under_review"]', 'array', '["pending", "approved", "rejected"]'),
  ('available_user_roles', '["innovator", "expert", "team_member", "admin", "reviewer", "evaluator"]', 'array', '["innovator", "expert"]'),
  ('campaign_theme_options', '["innovation", "sustainability", "digital_transformation", "customer_experience", "efficiency"]', 'array', '["innovation", "sustainability"]'),
  ('stakeholder_influence_levels', '["low", "medium", "high", "critical"]', 'array', '["low", "medium", "high"]'),
  ('stakeholder_interest_levels', '["low", "medium", "high", "very_high"]', 'array', '["low", "medium", "high"]')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = NOW();

-- Add corresponding translations
INSERT INTO public.system_translations (translation_key, text_ar, text_en, category) VALUES
  -- Challenge statuses
  ('challengeStatuses.draft', 'مسودة', 'Draft', 'challenges'),
  ('challengeStatuses.published', 'منشور', 'Published', 'challenges'),
  ('challengeStatuses.active', 'نشط', 'Active', 'challenges'),
  ('challengeStatuses.closed', 'مغلق', 'Closed', 'challenges'),
  ('challengeStatuses.archived', 'مؤرشف', 'Archived', 'challenges'),
  ('challengeStatuses.completed', 'مكتمل', 'Completed', 'challenges'),
  
  -- Challenge types
  ('challengeTypes.technical', 'تقني', 'Technical', 'challenges'),
  ('challengeTypes.administrative', 'إداري', 'Administrative', 'challenges'),
  ('challengeTypes.creative', 'إبداعي', 'Creative', 'challenges'),
  ('challengeTypes.strategic', 'استراتيجي', 'Strategic', 'challenges'),
  ('challengeTypes.operational', 'تشغيلي', 'Operational', 'challenges'),
  
  -- Expert roles
  ('expertRoleTypes.evaluator', 'مقيم', 'Evaluator', 'experts'),
  ('expertRoleTypes.mentor', 'موجه', 'Mentor', 'experts'),
  ('expertRoleTypes.reviewer', 'مراجع', 'Reviewer', 'experts'),
  ('expertRoleTypes.advisor', 'مستشار', 'Advisor', 'experts'),
  ('expertRoleTypes.specialist', 'اختصاصي', 'Specialist', 'experts'),
  
  -- Experience levels
  ('experienceLevels.beginner', 'مبتدئ', 'Beginner', 'user_management'),
  ('experienceLevels.intermediate', 'متوسط', 'Intermediate', 'user_management'),
  ('experienceLevels.advanced', 'متقدم', 'Advanced', 'user_management'),
  ('experienceLevels.expert', 'خبير', 'Expert', 'user_management'),
  
  -- Time ranges
  ('timeRangeOptions.last_7_days', 'آخر 7 أيام', 'Last 7 days', 'analytics'),
  ('timeRangeOptions.last_30_days', 'آخر 30 يوم', 'Last 30 days', 'analytics'),
  ('timeRangeOptions.last_90_days', 'آخر 90 يوم', 'Last 90 days', 'analytics'),
  ('timeRangeOptions.last_6_months', 'آخر 6 أشهر', 'Last 6 months', 'analytics'),
  ('timeRangeOptions.last_year', 'آخر سنة', 'Last year', 'analytics'),
  ('timeRangeOptions.all_time', 'جميع الأوقات', 'All time', 'analytics'),
  
  -- Team roles
  ('teamRoleOptions.lead', 'قائد', 'Lead', 'teams'),
  ('teamRoleOptions.member', 'عضو', 'Member', 'teams'),
  ('teamRoleOptions.specialist', 'اختصاصي', 'Specialist', 'teams'),
  ('teamRoleOptions.coordinator', 'منسق', 'Coordinator', 'teams'),
  ('teamRoleOptions.advisor', 'مستشار', 'Advisor', 'teams')
ON CONFLICT (translation_key) DO UPDATE SET
  text_ar = EXCLUDED.text_ar,
  text_en = EXCLUDED.text_en,
  updated_at = NOW();