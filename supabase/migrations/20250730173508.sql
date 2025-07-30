-- Fix the can_view_event function to handle Arabic status values and add missing policies
-- First, fix the team_assignments table that has no policies
CREATE POLICY "Team members can manage assignments" 
ON public.team_assignments 
FOR ALL 
USING (
  EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid() AND itm.status = 'active')
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'super_admin'::app_role)
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.innovation_team_members itm WHERE itm.user_id = auth.uid() AND itm.status = 'active')
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'super_admin'::app_role)
);

-- Update the can_view_event function to handle actual status values
CREATE OR REPLACE FUNCTION public.can_view_event(event_id uuid, event_visibility text, event_status text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path TO 'public'
AS $$
BEGIN
  -- Public events can be viewed by anyone (regardless of status for now)
  IF event_visibility = 'public' THEN
    RETURN true;
  END IF;
  
  -- Internal events can be viewed by team members and admins
  IF event_visibility = 'internal' THEN
    IF EXISTS (
      SELECT 1 FROM public.innovation_team_members itm 
      WHERE itm.user_id = auth.uid() AND itm.status = 'active'
    ) OR public.has_role(auth.uid(), 'admin'::public.app_role) 
      OR public.has_role(auth.uid(), 'super_admin'::public.app_role) THEN
      RETURN true;
    END IF;
  END IF;
  
  -- Restricted events can only be viewed by admins
  IF event_visibility = 'restricted' THEN
    IF public.has_role(auth.uid(), 'admin'::public.app_role) 
       OR public.has_role(auth.uid(), 'super_admin'::public.app_role) THEN
      RETURN true;
    END IF;
  END IF;
  
  -- Check if user is registered for this event
  IF EXISTS (
    SELECT 1 FROM public.event_participants ep 
    WHERE ep.event_id = can_view_event.event_id AND ep.user_id = auth.uid()
  ) THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;