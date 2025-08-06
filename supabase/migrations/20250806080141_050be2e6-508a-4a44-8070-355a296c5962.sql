-- Create unified settings categories and remove duplicates

-- First, let's create a mapping table for shared settings concepts
CREATE TABLE IF NOT EXISTS shared_setting_concepts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  concept_name VARCHAR(100) NOT NULL UNIQUE,
  concept_description TEXT,
  unified_key VARCHAR(255) NOT NULL,
  data_type VARCHAR(50) DEFAULT 'string',
  default_value TEXT,
  validation_rules JSONB DEFAULT '{}',
  applies_to_systems TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE shared_setting_concepts ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Anyone can view shared concepts" ON shared_setting_concepts FOR SELECT USING (true);
CREATE POLICY "Admins can manage shared concepts" ON shared_setting_concepts FOR ALL USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role)
);

-- Insert unified concepts for shared settings
INSERT INTO shared_setting_concepts (concept_name, concept_description, unified_key, data_type, default_value, applies_to_systems) VALUES
-- Unified limits
('max_items_per_user', 'Maximum items any user can create/own', 'global_max_items_per_user', 'number', '10', ARRAY['challenges', 'ideas', 'campaigns', 'opportunities']),
('max_budget_limit', 'Maximum budget limit across all systems', 'global_max_budget', 'number', '1000000', ARRAY['challenges', 'campaigns', 'opportunities', 'projects']),
('session_timeout_minutes', 'Session timeout in minutes for all systems', 'global_session_timeout', 'number', '60', ARRAY['security', 'authentication']),
('default_page_size', 'Default number of items per page', 'global_items_per_page', 'number', '12', ARRAY['ui', 'pagination']),

-- Unified feature toggles
('enable_notifications', 'Enable notifications across all systems', 'global_enable_notifications', 'boolean', 'true', ARRAY['challenges', 'ideas', 'campaigns', 'events']),
('enable_analytics', 'Enable analytics tracking globally', 'global_enable_analytics', 'boolean', 'true', ARRAY['challenges', 'ideas', 'campaigns', 'users']),
('enable_comments', 'Enable commenting functionality', 'global_enable_comments', 'boolean', 'true', ARRAY['challenges', 'ideas', 'events']),
('enable_collaboration', 'Enable collaboration features', 'global_enable_collaboration', 'boolean', 'true', ARRAY['challenges', 'ideas', 'teams']),

-- Unified defaults
('default_status', 'Default status for new items', 'global_default_status', 'string', 'draft', ARRAY['challenges', 'ideas', 'campaigns']),
('default_priority', 'Default priority level', 'global_default_priority', 'string', 'medium', ARRAY['challenges', 'ideas', 'tasks']),
('default_language', 'Default system language', 'global_default_language', 'string', 'ar', ARRAY['system', 'ui', 'content']);