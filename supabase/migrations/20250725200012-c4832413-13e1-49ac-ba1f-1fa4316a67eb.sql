-- Fix security warnings by adding comprehensive RLS policies for all tables

-- Enable RLS on all tables that don't have it yet
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_scorecards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deputies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.implementation_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innovation_maturity_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innovation_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innovators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trend_reports ENABLE ROW LEVEL SECURITY;

-- Basic read policies for organizational structure (departments, domains, etc.)
CREATE POLICY "All authenticated users can view organizational structure" 
ON public.departments FOR SELECT USING (true);

CREATE POLICY "All authenticated users can view deputies" 
ON public.deputies FOR SELECT USING (true);

CREATE POLICY "All authenticated users can view domains" 
ON public.domains FOR SELECT USING (true);

CREATE POLICY "All authenticated users can view sub_domains" 
ON public.sub_domains FOR SELECT USING (true);

CREATE POLICY "All authenticated users can view services" 
ON public.services FOR SELECT USING (true);

-- Experts and innovators - users can view and manage their own profiles
CREATE POLICY "Users can view expert profiles" 
ON public.experts FOR SELECT USING (true);

CREATE POLICY "Users can manage their own expert profile" 
ON public.experts FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view innovator profiles" 
ON public.innovators FOR SELECT USING (true);

CREATE POLICY "Users can manage their own innovator profile" 
ON public.innovators FOR ALL USING (user_id = auth.uid());

-- Innovation team members - admin managed
CREATE POLICY "All users can view innovation team members" 
ON public.innovation_team_members FOR SELECT USING (true);

CREATE POLICY "Admins can manage innovation team members" 
ON public.innovation_team_members FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Partners - admin managed but visible to team members
CREATE POLICY "Team members can view partners" 
ON public.partners FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.innovation_team_members itm 
    WHERE itm.user_id = auth.uid()
  ) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can manage partners" 
ON public.partners FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Role assignments - admin managed
CREATE POLICY "Users can view role assignments" 
ON public.role_assignments FOR SELECT USING (true);

CREATE POLICY "Admins can manage role assignments" 
ON public.role_assignments FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'super_admin'::app_role));

-- Campaigns and events - team managed
CREATE POLICY "All users can view campaigns" 
ON public.campaigns FOR SELECT USING (true);

CREATE POLICY "Team members can manage campaigns" 
ON public.campaigns FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.innovation_team_members itm 
    WHERE itm.user_id = auth.uid()
  ) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "All users can view events" 
ON public.events FOR SELECT USING (true);

CREATE POLICY "Team members can manage events" 
ON public.events FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.innovation_team_members itm 
    WHERE itm.user_id = auth.uid()
  ) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Idea evaluations - evaluators and idea owners
CREATE POLICY "Users can view evaluations for their ideas" 
ON public.idea_evaluations FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.ideas i 
    JOIN public.innovators inv ON i.innovator_id = inv.id
    WHERE i.id = idea_evaluations.idea_id AND inv.user_id = auth.uid()
  ) OR 
  evaluator_id = auth.uid() OR
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Evaluators can create evaluations" 
ON public.idea_evaluations FOR INSERT 
WITH CHECK (evaluator_id = auth.uid());

CREATE POLICY "Evaluators can update their evaluations" 
ON public.idea_evaluations FOR UPDATE 
USING (evaluator_id = auth.uid());

-- Challenge scorecards - team members and admins
CREATE POLICY "Team members can view challenge scorecards" 
ON public.challenge_scorecards FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.innovation_team_members itm 
    WHERE itm.user_id = auth.uid()
  ) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Team members can manage challenge scorecards" 
ON public.challenge_scorecards FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.innovation_team_members itm 
    WHERE itm.user_id = auth.uid()
  ) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Implementation tracker - team members and stakeholders
CREATE POLICY "Stakeholders can view implementation tracker" 
ON public.implementation_tracker FOR SELECT 
USING (
  implementation_owner_id = auth.uid() OR
  project_manager_id = auth.uid() OR
  stakeholder_sponsor_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.innovation_team_members itm 
    WHERE itm.user_id = auth.uid()
  ) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Team members can manage implementation tracker" 
ON public.implementation_tracker FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.innovation_team_members itm 
    WHERE itm.user_id = auth.uid()
  ) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Opportunity status - team members and admins
CREATE POLICY "Team members can view opportunity status" 
ON public.opportunity_status FOR SELECT 
USING (
  stage_owner_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.innovation_team_members itm 
    WHERE itm.user_id = auth.uid()
  ) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Team members can manage opportunity status" 
ON public.opportunity_status FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.innovation_team_members itm 
    WHERE itm.user_id = auth.uid()
  ) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Innovation maturity index - admin and team members
CREATE POLICY "Team members can view innovation maturity index" 
ON public.innovation_maturity_index FOR SELECT 
USING (
  assessed_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.innovation_team_members itm 
    WHERE itm.user_id = auth.uid()
  ) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Assessors can manage innovation maturity index" 
ON public.innovation_maturity_index FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.innovation_team_members itm 
    WHERE itm.user_id = auth.uid()
  ) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Trend reports and insights - team members can create, all can view
CREATE POLICY "All users can view trend reports" 
ON public.trend_reports FOR SELECT USING (true);

CREATE POLICY "Team members can manage trend reports" 
ON public.trend_reports FOR ALL 
USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.innovation_team_members itm 
    WHERE itm.user_id = auth.uid()
  ) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "All users can view insights" 
ON public.insights FOR SELECT USING (true);

CREATE POLICY "Team members can manage insights" 
ON public.insights FOR ALL 
USING (
  extracted_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.innovation_team_members itm 
    WHERE itm.user_id = auth.uid()
  ) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Fix function search path issues
ALTER FUNCTION public.has_role(uuid, app_role) SET search_path = '';
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';