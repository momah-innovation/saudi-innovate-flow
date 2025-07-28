-- Add RLS policies, indexes, triggers, and analytics view

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_team_assignments_member_id ON team_assignments(team_member_id);
CREATE INDEX IF NOT EXISTS idx_team_assignments_type_id ON team_assignments(assignment_type, assignment_id);
CREATE INDEX IF NOT EXISTS idx_team_assignments_status ON team_assignments(status);
CREATE INDEX IF NOT EXISTS idx_team_assignments_dates ON team_assignments(start_date, due_date);

CREATE INDEX IF NOT EXISTS idx_team_activities_member_id ON team_activities(team_member_id);
CREATE INDEX IF NOT EXISTS idx_team_activities_assignment_id ON team_activities(assignment_id);
CREATE INDEX IF NOT EXISTS idx_team_activities_date ON team_activities(activity_date);
CREATE INDEX IF NOT EXISTS idx_team_activities_type ON team_activities(activity_type);

CREATE INDEX IF NOT EXISTS idx_team_performance_member_id ON team_performance_metrics(team_member_id);
CREATE INDEX IF NOT EXISTS idx_team_performance_period ON team_performance_metrics(period_start_date, period_end_date);

CREATE INDEX IF NOT EXISTS idx_team_capacity_member_id ON team_capacity_history(team_member_id);
CREATE INDEX IF NOT EXISTS idx_team_capacity_week ON team_capacity_history(week_start_date);

CREATE INDEX IF NOT EXISTS idx_team_outcomes_assignment_id ON team_project_outcomes(assignment_id);
CREATE INDEX IF NOT EXISTS idx_team_outcomes_member_id ON team_project_outcomes(team_member_id);
CREATE INDEX IF NOT EXISTS idx_team_outcomes_project ON team_project_outcomes(project_type, project_id);

-- Create RLS policies for team analytics tables
CREATE POLICY "Team members can view assignments" ON public.team_assignments
FOR SELECT USING (
  team_member_id IN (SELECT id FROM innovation_team_members WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

CREATE POLICY "Team leads can manage assignments" ON public.team_assignments
FOR ALL USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

CREATE POLICY "Team members can view activities" ON public.team_activities
FOR SELECT USING (
  team_member_id IN (SELECT id FROM innovation_team_members WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

CREATE POLICY "Team members can manage activities" ON public.team_activities
FOR INSERT, UPDATE, DELETE USING (
  team_member_id IN (SELECT id FROM innovation_team_members WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

CREATE POLICY "Team members can view performance" ON public.team_performance_metrics
FOR SELECT USING (
  team_member_id IN (SELECT id FROM innovation_team_members WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

CREATE POLICY "Team leads can manage performance" ON public.team_performance_metrics
FOR INSERT, UPDATE, DELETE USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

CREATE POLICY "Team members can view capacity" ON public.team_capacity_history
FOR SELECT USING (
  team_member_id IN (SELECT id FROM innovation_team_members WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

CREATE POLICY "Team leads can manage capacity" ON public.team_capacity_history
FOR INSERT, UPDATE, DELETE USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

CREATE POLICY "Team members can view outcomes" ON public.team_project_outcomes
FOR SELECT USING (
  team_member_id IN (SELECT id FROM innovation_team_members WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

CREATE POLICY "Team leads can manage outcomes" ON public.team_project_outcomes
FOR INSERT, UPDATE, DELETE USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

-- Add triggers for updated_at columns
CREATE TRIGGER update_team_assignments_updated_at
  BEFORE UPDATE ON team_assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();