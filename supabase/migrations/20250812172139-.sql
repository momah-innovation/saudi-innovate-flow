-- Fix critical security issues identified in the scan by implementing proper RLS policies

-- Fix campaigns table public access
DROP POLICY IF EXISTS "All users can view campaigns" ON public.campaigns;
CREATE POLICY "Authenticated users can view campaigns" ON public.campaigns
FOR SELECT USING (auth.uid() IS NOT NULL);

-- Fix challenges table public access  
DROP POLICY IF EXISTS "Users can view challenge details" ON public.challenges;
CREATE POLICY "Users can view challenges with proper access" ON public.challenges
FOR SELECT USING (
  auth.uid() IS NOT NULL AND 
  (
    sensitivity_level = 'normal' OR
    user_has_access_to_challenge(id)
  )
);

-- Fix events table public access
DROP POLICY IF EXISTS "Users can view events" ON public.events;
CREATE POLICY "Users can view public and accessible events" ON public.events
FOR SELECT USING (
  visibility = 'public' OR 
  (auth.uid() IS NOT NULL AND (
    visibility = 'organization' OR
    visibility = 'department' OR
    created_by = auth.uid()
  ))
);

-- Fix stakeholders table public access
DROP POLICY IF EXISTS "Team members can view stakeholders" ON public.stakeholders;
CREATE POLICY "Authorized users can view stakeholders" ON public.stakeholders
FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'team_member'::app_role) OR
  has_role(auth.uid(), 'organization_admin'::app_role)
);

-- Fix innovation_team_members table public access
DROP POLICY IF EXISTS "Team members can view innovation team members" ON public.innovation_team_members;
CREATE POLICY "Authorized users can view team members" ON public.innovation_team_members
FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'team_member'::app_role) OR
  user_id = auth.uid()
);

-- Fix opportunities table public access
DROP POLICY IF EXISTS "Users can view opportunities" ON public.opportunities;
CREATE POLICY "Authenticated users can view appropriate opportunities" ON public.opportunities
FOR SELECT USING (
  auth.uid() IS NOT NULL AND (
    visibility = 'public' OR
    (visibility = 'organization' AND auth.uid() IS NOT NULL) OR
    created_by = auth.uid()
  )
);

-- Fix opportunity_user_journeys analytics tracking
DROP POLICY IF EXISTS "Users can view opportunity user journeys" ON public.opportunity_user_journeys;
CREATE POLICY "Admins and analytics team can view user journeys" ON public.opportunity_user_journeys
FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'analytics_specialist'::app_role)
);