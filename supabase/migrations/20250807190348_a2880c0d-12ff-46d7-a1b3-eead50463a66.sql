-- Phase 1.1: Add Missing Array Settings to Database
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type, is_localizable, description) VALUES
('question_types', '["open_ended", "multiple_choice", "yes_no", "rating", "ranking"]', 'questions', 'array', true, 'Available focus question types'),
('attachment_types', '["pdf", "doc", "docx", "ppt", "pptx", "jpg", "jpeg", "png", "gif"]', 'files', 'array', true, 'Allowed file attachment types'),
('assignment_types', '["reviewer", "evaluator", "implementer", "observer"]', 'assignments', 'array', true, 'Available assignment types for ideas'),
('integration_types', '["api", "webhook", "sso", "file_sync", "database"]', 'integrations', 'array', true, 'Available integration types'),
('notification_types', '["email", "sms", "push", "in_app"]', 'notifications', 'array', true, 'Available notification types'),
('team_specializations', '["Innovation Strategy & Planning", "Project Management & Execution", "Research & Market Analysis", "Stakeholder Engagement", "Change Management"]', 'teams', 'array', true, 'Available team specialization areas'),
('team_roles', '["Innovation Manager", "Data Analyst", "Content Creator", "Project Manager", "Research Analyst"]', 'teams', 'array', true, 'Available team role positions'),
('file_categories', '["documents", "images", "presentations", "spreadsheets", "archives"]', 'files', 'array', true, 'File categorization types'),
('workflow_statuses', '["draft", "submitted", "under_review", "approved", "rejected", "in_development", "implemented"]', 'workflow', 'array', true, 'Standard workflow status options'),
('visibility_levels', '["public", "internal", "restricted", "private"]', 'access', 'array', true, 'Content visibility levels')

ON CONFLICT (setting_key) 
DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  data_type = EXCLUDED.data_type,
  is_localizable = EXCLUDED.is_localizable,
  description = EXCLUDED.description,
  updated_at = NOW();