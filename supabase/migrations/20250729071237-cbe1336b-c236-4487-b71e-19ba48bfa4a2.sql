-- Fix RLS policy for ideas table to properly check innovator ownership
DROP POLICY IF EXISTS "Users can create their own ideas" ON public.ideas;

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

-- Also fix the update policy to be consistent
DROP POLICY IF EXISTS "Users can update their own ideas" ON public.ideas;

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