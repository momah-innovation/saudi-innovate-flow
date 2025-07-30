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