-- Add policy for team collaboration on ideas
-- Allow users to see ideas from challenges they are involved in as team members
CREATE POLICY "Team members can view ideas from assigned challenges"
ON public.ideas
FOR SELECT
TO authenticated
USING (
  -- Allow if user is part of innovation team and assigned to the challenge
  EXISTS (
    SELECT 1 
    FROM public.innovation_team_members itm
    JOIN public.team_assignments ta ON itm.id = ta.team_member_id
    WHERE itm.user_id = auth.uid()
      AND itm.status = 'active'
      AND ta.assignment_type = 'challenge'
      AND ta.assignment_id = ideas.challenge_id
      AND ta.status = 'active'
  )
);

-- Add policy to allow innovators in collaboration teams to view related ideas
CREATE POLICY "Collaboration team members can view related ideas"
ON public.ideas  
FOR SELECT
TO authenticated
USING (
  -- Allow if user is part of an idea collaboration team
  EXISTS (
    SELECT 1
    FROM public.idea_collaboration_teams ict
    WHERE ict.idea_id = ideas.id
      AND ict.member_id = auth.uid()
      AND ict.status = 'active'
  )
);