-- Drop overly permissive policies and add role-based access control for events

-- Drop the overly permissive policy on events
DROP POLICY IF EXISTS "All users can view events" ON public.events;

-- Create role-based policies for events based on visibility level
CREATE POLICY "Public can view public events" 
ON public.events 
FOR SELECT 
USING (
  event_visibility = 'public' 
  AND status IN ('published', 'active', 'ongoing')
);

CREATE POLICY "Team members can view internal events" 
ON public.events 
FOR SELECT 
USING (
  event_visibility = 'internal' 
  AND (
    EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid() AND itm.status = 'active') 
    OR has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'super_admin'::app_role)
  )
);

CREATE POLICY "Admins can view restricted events" 
ON public.events 
FOR SELECT 
USING (
  event_visibility = 'restricted' 
  AND (
    has_role(auth.uid(), 'admin'::app_role) 
    OR has_role(auth.uid(), 'super_admin'::app_role)
  )
);

CREATE POLICY "Event participants can view their registered events" 
ON public.events 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM event_participants ep 
    WHERE ep.event_id = events.id 
    AND ep.user_id = auth.uid()
  )
);

-- Restrict event resources based on user roles
DROP POLICY IF EXISTS "Anyone can view public event resources" ON public.event_resources;

CREATE POLICY "Authenticated users can view public event resources" 
ON public.event_resources 
FOR SELECT 
USING (
  is_public = true 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Event participants can view event resources" 
ON public.event_resources 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM event_participants ep 
    WHERE ep.event_id = event_resources.event_id 
    AND ep.user_id = auth.uid()
  )
);

-- Restrict event participant viewing to protect privacy
DROP POLICY IF EXISTS "Users can view their own event participations" ON public.event_participants;

CREATE POLICY "Users can view their own participations" 
ON public.event_participants 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Event managers can view all participants" 
ON public.event_participants 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM events e 
    WHERE e.id = event_participants.event_id 
    AND e.event_manager_id = auth.uid()
  )
);

-- Add policies for partner and stakeholder links to protect sensitive relationships
DROP POLICY IF EXISTS "Team members can manage event partner links" ON public.event_partner_links;
DROP POLICY IF EXISTS "Team members can manage event stakeholder links" ON public.event_stakeholder_links;

CREATE POLICY "Team members can view event partner links" 
ON public.event_partner_links 
FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid() AND itm.status = 'active') 
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can manage event partner links" 
ON public.event_partner_links 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Team members can view event stakeholder links" 
ON public.event_stakeholder_links 
FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid() AND itm.status = 'active') 
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can manage event stakeholder links" 
ON public.event_stakeholder_links 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));