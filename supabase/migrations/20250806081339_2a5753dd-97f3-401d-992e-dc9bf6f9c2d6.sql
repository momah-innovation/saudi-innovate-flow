-- Insert missing system settings that are currently hardcoded (using safe JSON format)
INSERT INTO system_settings (setting_key, setting_value, setting_category, data_type, description, is_public)
VALUES 
  -- General settings missing from database
  ('system_name', 'Innovation Platform', 'general', 'string', 'System name', true),
  ('system_description', 'Comprehensive platform for innovation challenges and ideas', 'general', 'string', 'System description', true),
  ('system_language', 'ar', 'general', 'string', 'Default system language', true),
  ('allow_public_registration', 'true', 'general', 'boolean', 'Allow public registration', true),
  ('max_file_upload_size', '10', 'general', 'number', 'Max file upload size in MB', true),
  ('auto_archive_after_days', '365', 'general', 'number', 'Auto archive after days', true),
  ('maintenance_mode', 'false', 'general', 'boolean', 'Maintenance mode enabled', true),
  
  -- Challenge settings missing from database
  ('challenge_types', '["Technical", "Sustainability", "Health", "Education", "Governance", "Environment", "Economy", "Public Services"]', 'challenges', 'array', 'Available challenge types', true),
  ('priority_levels', '["Low", "Medium", "High", "Urgent"]', 'challenges', 'array', 'Priority levels', true),
  ('challenge_status_options', '["Draft", "Published", "Active", "Closed", "Archived", "Paused"]', 'challenges', 'array', 'Challenge status options', true),
  ('max_challenges_per_user', '10', 'challenges', 'number', 'Maximum challenges per user', true),
  ('require_approval_for_publish', 'true', 'challenges', 'boolean', 'Require approval for publishing', true),
  ('allow_anonymous_submissions', 'false', 'challenges', 'boolean', 'Allow anonymous submissions', true),
  
  -- Ideas settings
  ('idea_types', '["Process Improvement", "New Product", "New Service", "Technical Development", "Innovative Solution"]', 'ideas', 'array', 'Idea types', true),
  ('idea_status_options', '["Draft", "Submitted", "Under Review", "Accepted", "Rejected", "In Development", "Implemented"]', 'ideas', 'array', 'Idea status options', true),
  ('max_ideas_per_user', '20', 'ideas', 'number', 'Maximum ideas per user', true),
  ('idea_evaluation_criteria', '["Technical Feasibility", "Financial Viability", "Market Potential", "Strategic Alignment", "Innovation Level"]', 'ideas', 'array', 'Idea evaluation criteria', true),
  
  -- Events settings
  ('event_types', '["Workshop", "Conference", "Seminar", "Training", "Brainstorming", "Presentation"]', 'events', 'array', 'Event types', true),
  ('event_status_options', '["Scheduled", "Ongoing", "Completed", "Cancelled", "Postponed"]', 'events', 'array', 'Event status options', true),
  ('max_events_per_user', '15', 'events', 'number', 'Maximum events per user', true),
  
  -- Partners settings
  ('partner_types', '["Government", "Private", "Non-profit", "Academic", "International", "Local"]', 'partners', 'array', 'Partner types', true),
  ('partner_status_options', '["Active", "Inactive", "Pending", "Under Review"]', 'partners', 'array', 'Partner status options', true),
  
  -- User management settings
  ('user_roles', '["User", "Expert", "Evaluator", "Project Manager", "Team Manager", "System Manager", "Administrator"]', 'user_management', 'array', 'User roles', true),
  ('user_status_options', '["Active", "Inactive", "Suspended", "Banned"]', 'user_management', 'array', 'User status options', true),
  ('max_login_attempts', '5', 'security', 'number', 'Maximum login attempts', true),
  ('password_min_length', '8', 'security', 'number', 'Minimum password length', true),
  
  -- Campaigns settings
  ('campaign_types', '["Awareness", "Incentive", "Competitive", "Educational", "Promotional"]', 'campaigns', 'array', 'Campaign types', true),
  ('campaign_status_options', '["Planning", "Active", "Completed", "Paused", "Cancelled"]', 'campaigns', 'array', 'Campaign status options', true),
  
  -- Opportunities settings  
  ('opportunity_types', '["Job", "Training", "Partnership", "Funding", "Consultation", "Volunteer"]', 'opportunities', 'array', 'Opportunity types', true),
  ('opportunity_status_options', '["Open", "Closed", "Paused", "Cancelled"]', 'opportunities', 'array', 'Opportunity status options', true),
  
  -- Analytics settings
  ('enable_real_time_analytics', 'true', 'analytics', 'boolean', 'Enable real-time analytics', true),
  ('analytics_update_frequency', '300', 'analytics', 'number', 'Analytics update frequency in seconds', true),
  
  -- UI/Performance settings
  ('enable_dark_mode', 'false', 'ui', 'boolean', 'Enable dark mode', true),
  ('enable_animations', 'true', 'ui', 'boolean', 'Enable animations', true),
  ('cache_duration_minutes', '60', 'performance', 'number', 'Cache duration in minutes', true),
  ('lazy_loading_enabled', 'true', 'performance', 'boolean', 'Enable lazy loading', true)

ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = now();