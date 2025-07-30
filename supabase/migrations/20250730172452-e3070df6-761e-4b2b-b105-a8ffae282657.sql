-- Fix infinite recursion in events RLS policies
-- Drop all existing policies that cause recursion
DROP POLICY IF EXISTS "Public can view public events" ON public.events;
DROP POLICY IF EXISTS "Team members can view internal events" ON public.events;
DROP POLICY IF EXISTS "Admins can view restricted events" ON public.events;
DROP POLICY IF EXISTS "Event participants can view their registered events" ON public.events;

-- Create security definer functions to avoid recursion
CREATE OR REPLACE FUNCTION public.can_view_event(event_id uuid, event_visibility text, event_status text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  -- Public events can be viewed by anyone if published/active
  IF event_visibility = 'public' AND event_status IN ('published', 'active', 'ongoing') THEN
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

-- Create a single comprehensive policy using the function
CREATE POLICY "Users can view events based on visibility and role" 
ON public.events 
FOR SELECT 
USING (
  public.can_view_event(id, event_visibility, status)
);