-- Add sensitivity classification to challenges table
ALTER TABLE public.challenges 
ADD COLUMN sensitivity_level VARCHAR(20) DEFAULT 'normal';

-- Add comment for clarity
COMMENT ON COLUMN public.challenges.sensitivity_level IS 'Classification for visibility and access control: normal (open innovation), sensitive (limited access), confidential (internal only)';

-- Add check constraint to ensure valid values
ALTER TABLE public.challenges 
ADD CONSTRAINT challenges_sensitivity_level_check 
CHECK (sensitivity_level IN ('normal', 'sensitive', 'confidential'));

-- Add sensitivity flag to focus questions
ALTER TABLE public.focus_questions 
ADD COLUMN is_sensitive BOOLEAN DEFAULT false;

-- Add comment for clarity
COMMENT ON COLUMN public.focus_questions.is_sensitive IS 'Flag for questions touching on internal strategy or constraints that may need filtering for external collaborators';

-- Create index for efficient filtering by sensitivity level
CREATE INDEX idx_challenges_sensitivity ON public.challenges(sensitivity_level);
CREATE INDEX idx_focus_questions_sensitive ON public.focus_questions(is_sensitive);

-- Update RLS policies to respect sensitivity levels
DROP POLICY IF EXISTS "Authenticated users can view challenges" ON public.challenges;

-- Create new RLS policies with sensitivity-aware access control
CREATE POLICY "Users can view normal challenges" 
ON public.challenges 
FOR SELECT 
USING (sensitivity_level = 'normal');

CREATE POLICY "Team members can view sensitive challenges" 
ON public.challenges 
FOR SELECT 
USING (
  sensitivity_level = 'sensitive' 
  AND EXISTS (
    SELECT 1 FROM public.innovation_team_members itm 
    WHERE itm.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view confidential challenges" 
ON public.challenges 
FOR SELECT 
USING (
  sensitivity_level = 'confidential' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Similar policies for focus questions
CREATE POLICY "Users can view non-sensitive focus questions" 
ON public.focus_questions 
FOR SELECT 
USING (is_sensitive = false);

CREATE POLICY "Team members can view sensitive focus questions" 
ON public.focus_questions 
FOR SELECT 
USING (
  is_sensitive = true 
  AND EXISTS (
    SELECT 1 FROM public.innovation_team_members itm 
    WHERE itm.user_id = auth.uid()
  )
);