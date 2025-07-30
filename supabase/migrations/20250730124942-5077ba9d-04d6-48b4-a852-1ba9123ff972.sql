-- Add missing fields to ideas table
ALTER TABLE public.ideas 
ADD COLUMN IF NOT EXISTS collaboration_open BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS estimated_timeline VARCHAR(50),
ADD COLUMN IF NOT EXISTS innovation_level VARCHAR(20) DEFAULT 'incremental';

-- Add comments for clarity
COMMENT ON COLUMN public.ideas.collaboration_open IS 'Whether the idea is open for collaboration';
COMMENT ON COLUMN public.ideas.tags IS 'Array of tags associated with the idea';
COMMENT ON COLUMN public.ideas.estimated_timeline IS 'Estimated timeline for implementation';
COMMENT ON COLUMN public.ideas.innovation_level IS 'Level of innovation: incremental, breakthrough, disruptive';

-- Update idea workflow settings
INSERT INTO public.system_settings (setting_key, setting_value, category, description, is_system) VALUES
('idea_collaboration_enabled', 'true', 'ideas', 'Enable collaboration features for ideas', false),
('idea_tags_enabled', 'true', 'ideas', 'Enable tagging system for ideas', false),
('idea_timeline_tracking', 'true', 'ideas', 'Enable timeline tracking for ideas', false),
('innovation_levels', '["incremental", "breakthrough", "disruptive"]', 'ideas', 'Available innovation levels', false),
('default_innovation_level', '"incremental"', 'ideas', 'Default innovation level for new ideas', false)
ON CONFLICT (setting_key) DO UPDATE SET
setting_value = EXCLUDED.setting_value,
updated_at = now();