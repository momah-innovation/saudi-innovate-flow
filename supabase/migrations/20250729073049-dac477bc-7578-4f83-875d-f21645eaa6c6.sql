-- Create comprehensive RLS policies for ideas with proper access levels and draft handling

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view ideas" ON public.ideas;
DROP POLICY IF EXISTS "Users can create their own ideas" ON public.ideas;
DROP POLICY IF EXISTS "Users can update their own ideas" ON public.ideas;

-- Policy 1: Users can view their own ideas (including drafts)
CREATE POLICY "Users can view their own ideas" 
ON public.ideas 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.innovators 
    WHERE innovators.id = ideas.innovator_id 
    AND innovators.user_id = auth.uid()
  )
);

-- Policy 2: Admins and team members can view all ideas
CREATE POLICY "Admins and team members can view all ideas" 
ON public.ideas 
FOR SELECT 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role) OR
  EXISTS (
    SELECT 1 FROM public.innovation_team_members 
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

-- Policy 3: Public can view published/approved ideas only (not drafts or submitted)
CREATE POLICY "Public can view published ideas" 
ON public.ideas 
FOR SELECT 
USING (
  status IN ('approved', 'in_development', 'implemented') AND
  auth.uid() IS NOT NULL -- require authentication even for public ideas
);

-- Policy 4: Users can create ideas for themselves (including drafts)
CREATE POLICY "Users can create their own ideas" 
ON public.ideas 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.innovators 
    WHERE innovators.id = ideas.innovator_id 
    AND innovators.user_id = auth.uid()
  )
);

-- Policy 5: Admins can create ideas for any innovator
CREATE POLICY "Admins can create ideas for anyone" 
ON public.ideas 
FOR INSERT 
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- Policy 6: Users can update their own ideas
CREATE POLICY "Users can update their own ideas" 
ON public.ideas 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.innovators 
    WHERE innovators.id = ideas.innovator_id 
    AND innovators.user_id = auth.uid()
  )
);

-- Policy 7: Admins and team members can update any idea
CREATE POLICY "Admins and team members can update any idea" 
ON public.ideas 
FOR UPDATE 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role) OR
  EXISTS (
    SELECT 1 FROM public.innovation_team_members 
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

-- Policy 8: Only admins can delete ideas
CREATE POLICY "Only admins can delete ideas" 
ON public.ideas 
FOR DELETE 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- Add validation trigger for mandatory fields when status changes from draft
CREATE OR REPLACE FUNCTION public.validate_idea_submission()
RETURNS TRIGGER AS $$
BEGIN
  -- Only validate mandatory fields when moving from draft to submitted or higher
  IF NEW.status != 'draft' AND (OLD.status IS NULL OR OLD.status = 'draft') THEN
    -- Validate mandatory fields for non-draft ideas
    IF NEW.challenge_id IS NULL THEN
      RAISE EXCEPTION 'Challenge is required for non-draft ideas';
    END IF;
    
    IF NEW.focus_question_id IS NULL THEN
      RAISE EXCEPTION 'Focus question is required for non-draft ideas';
    END IF;
    
    -- Ensure description meets minimum requirements
    IF LENGTH(NEW.description_ar) < 50 THEN
      RAISE EXCEPTION 'Description must be at least 50 characters for non-draft ideas';
    END IF;
    
    IF LENGTH(NEW.title_ar) < 10 THEN
      RAISE EXCEPTION 'Title must be at least 10 characters for non-draft ideas';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Create trigger
DROP TRIGGER IF EXISTS validate_idea_submission_trigger ON public.ideas;
CREATE TRIGGER validate_idea_submission_trigger
  BEFORE INSERT OR UPDATE ON public.ideas
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_idea_submission();