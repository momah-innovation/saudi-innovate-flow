-- Add RLS policies with correct syntax (separate policies for each operation)

-- RLS policies for team_activities
CREATE POLICY "Team members can insert activities" ON public.team_activities
FOR INSERT WITH CHECK (
  team_member_id IN (SELECT id FROM innovation_team_members WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

CREATE POLICY "Team members can update activities" ON public.team_activities
FOR UPDATE USING (
  team_member_id IN (SELECT id FROM innovation_team_members WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

CREATE POLICY "Team members can delete activities" ON public.team_activities
FOR DELETE USING (
  team_member_id IN (SELECT id FROM innovation_team_members WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

-- RLS policies for team_performance_metrics
CREATE POLICY "Team leads can insert performance" ON public.team_performance_metrics
FOR INSERT WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

CREATE POLICY "Team leads can update performance" ON public.team_performance_metrics
FOR UPDATE USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

CREATE POLICY "Team leads can delete performance" ON public.team_performance_metrics
FOR DELETE USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

-- RLS policies for team_capacity_history
CREATE POLICY "Team leads can insert capacity" ON public.team_capacity_history
FOR INSERT WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

CREATE POLICY "Team leads can update capacity" ON public.team_capacity_history
FOR UPDATE USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

CREATE POLICY "Team leads can delete capacity" ON public.team_capacity_history
FOR DELETE USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

-- RLS policies for team_project_outcomes
CREATE POLICY "Team leads can insert outcomes" ON public.team_project_outcomes
FOR INSERT WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

CREATE POLICY "Team leads can update outcomes" ON public.team_project_outcomes
FOR UPDATE USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

CREATE POLICY "Team leads can delete outcomes" ON public.team_project_outcomes
FOR DELETE USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);