-- Add comprehensive idea-related settings to system_settings table (with proper JSON formatting)
INSERT INTO system_settings (setting_key, setting_value, setting_category, description) VALUES
-- Idea Submission Settings
('idea_max_title_length', '"200"', 'ideas', 'Maximum allowed characters for idea titles'),
('idea_max_description_length', '"5000"', 'ideas', 'Maximum allowed characters for idea descriptions'),
('idea_min_description_length', '"50"', 'ideas', 'Minimum required characters for idea descriptions'),
('idea_allow_anonymous_submissions', 'false', 'ideas', 'Allow anonymous idea submissions'),
('idea_auto_save_drafts', 'true', 'ideas', 'Automatically save idea drafts'),
('idea_draft_expiry_days', '"30"', 'ideas', 'Days after which draft ideas expire'),

-- Idea Workflow Settings
('idea_default_status', '"draft"', 'ideas', 'Default status for new ideas'),
('idea_auto_approve_submissions', 'false', 'ideas', 'Automatically approve idea submissions'),
('idea_require_focus_question', 'true', 'ideas', 'Require focus question selection for ideas'),
('idea_workflow_notifications_enabled', 'true', 'ideas', 'Send notifications for idea workflow changes'),
('idea_assignment_due_date_days', '"7"', 'ideas', 'Default days for idea assignment due dates'),

-- Idea Evaluation Settings
('idea_evaluation_scale_max', '"10"', 'ideas', 'Maximum score for idea evaluations (1-10 scale)'),
('idea_evaluation_require_comments', 'false', 'ideas', 'Require comments for idea evaluations'),
('idea_evaluation_multiple_allowed', 'true', 'ideas', 'Allow multiple evaluations per idea'),
('idea_evaluation_criteria_weights', '{"technical_feasibility": 20, "financial_viability": 20, "market_potential": 20, "strategic_alignment": 20, "innovation_level": 20}', 'ideas', 'Weight distribution for evaluation criteria'),

-- Idea Collaboration Settings
('idea_collaboration_enabled', 'true', 'ideas', 'Enable collaboration features for ideas'),
('idea_max_collaborators', '"5"', 'ideas', 'Maximum number of collaborators per idea'),
('idea_collaboration_invite_expiry_hours', '"48"', 'ideas', 'Hours after which collaboration invites expire'),
('idea_version_tracking_enabled', 'true', 'ideas', 'Track and save idea version history'),

-- Idea Comments Settings
('idea_comments_enabled', 'true', 'ideas', 'Enable commenting on ideas'),
('idea_comments_moderation_enabled', 'false', 'ideas', 'Enable comment moderation'),
('idea_comments_max_length', '"1000"', 'ideas', 'Maximum characters for idea comments'),
('idea_comments_allow_replies', 'true', 'ideas', 'Allow replies to comments'),
('idea_comments_public_by_default', 'true', 'ideas', 'Make comments public by default'),

-- Idea Attachments Settings
('idea_attachments_enabled', 'true', 'ideas', 'Enable file attachments for ideas'),
('idea_max_attachments_per_idea', '"10"', 'ideas', 'Maximum number of attachments per idea'),
('idea_max_attachment_size_mb', '"25"', 'ideas', 'Maximum attachment size in MB'),
('idea_allowed_attachment_types', '["pdf", "doc", "docx", "ppt", "pptx", "jpg", "jpeg", "png", "gif"]', 'ideas', 'Allowed file types for attachments'),

-- Idea Analytics Settings
('idea_analytics_enabled', 'true', 'ideas', 'Enable idea analytics tracking'),
('idea_analytics_retention_days', '"365"', 'ideas', 'Days to retain idea analytics data'),
('idea_public_analytics_enabled', 'false', 'ideas', 'Show analytics to idea submitters'),

-- Idea Lifecycle Settings
('idea_lifecycle_milestones_enabled', 'true', 'ideas', 'Enable lifecycle milestone tracking'),
('idea_milestone_notifications_enabled', 'true', 'ideas', 'Send notifications for milestone achievements'),
('idea_implementation_tracking_enabled', 'true', 'ideas', 'Track idea implementation progress'),

-- Idea Display Settings
('idea_items_per_page', '"12"', 'ideas', 'Number of ideas to display per page'),
('idea_default_view_mode', '"cards"', 'ideas', 'Default view mode for ideas list (cards/list/grid)'),
('idea_show_preview_on_hover', 'true', 'ideas', 'Show preview when hovering over idea cards'),
('idea_enable_advanced_filters', 'true', 'ideas', 'Enable advanced filtering options'),
('idea_sort_default', '"created_at_desc"', 'ideas', 'Default sorting for ideas list');

-- Update existing challenge_auto_approve_ideas to use ideas category
UPDATE system_settings 
SET setting_category = 'ideas', description = 'Automatically approve new idea submissions'
WHERE setting_key = 'challenge_auto_approve_ideas';

-- Update existing form_max_idea_title_length 
UPDATE system_settings 
SET setting_category = 'ideas', description = 'Maximum allowed characters for idea titles'
WHERE setting_key = 'form_max_idea_title_length';