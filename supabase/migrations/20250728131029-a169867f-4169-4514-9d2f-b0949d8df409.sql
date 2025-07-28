-- Create comprehensive analytics tables for team management

-- 1. Team member assignments tracking (linking team members to all types of work)
CREATE TABLE IF NOT EXISTS public.team_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id UUID NOT NULL REFERENCES innovation_team_members(id) ON DELETE CASCADE,
  assignment_type VARCHAR NOT NULL, -- 'challenge', 'campaign', 'event', 'project'
  assignment_id UUID NOT NULL, -- references the specific challenge/campaign/event/project
  role_in_assignment VARCHAR, -- 'lead', 'contributor', 'reviewer', etc.
  workload_percentage INTEGER DEFAULT 0, -- % of capacity allocated
  priority_level VARCHAR DEFAULT 'medium', -- 'high', 'medium', 'low'
  status VARCHAR DEFAULT 'active', -- 'active', 'completed', 'paused', 'cancelled'
  assigned_date DATE DEFAULT CURRENT_DATE,
  start_date DATE,
  due_date DATE,
  completion_date DATE,
  estimated_hours INTEGER,
  actual_hours INTEGER DEFAULT 0,
  notes TEXT,
  assigned_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Team activities and time tracking
CREATE TABLE IF NOT EXISTS public.team_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id UUID NOT NULL REFERENCES innovation_team_members(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES team_assignments(id) ON DELETE CASCADE,
  activity_type VARCHAR NOT NULL, -- 'meeting', 'research', 'evaluation', 'planning', 'review'
  activity_description TEXT NOT NULL,
  hours_spent NUMERIC(4,2) DEFAULT 0,
  activity_date DATE DEFAULT CURRENT_DATE,
  start_time TIME,
  end_time TIME,
  deliverables TEXT, -- what was produced/accomplished
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  collaboration_rating INTEGER CHECK (collaboration_rating >= 1 AND collaboration_rating <= 5),
  innovation_rating INTEGER CHECK (innovation_rating >= 1 AND innovation_rating <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Team performance metrics tracking over time
CREATE TABLE IF NOT EXISTS public.team_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id UUID NOT NULL REFERENCES innovation_team_members(id) ON DELETE CASCADE,
  evaluation_period VARCHAR NOT NULL, -- 'monthly', 'quarterly', 'annual'
  period_start_date DATE NOT NULL,
  period_end_date DATE NOT NULL,
  assignments_completed INTEGER DEFAULT 0,
  assignments_overdue INTEGER DEFAULT 0,
  total_hours_worked NUMERIC(8,2) DEFAULT 0,
  average_quality_rating NUMERIC(3,2),
  average_collaboration_rating NUMERIC(3,2),
  average_innovation_rating NUMERIC(3,2),
  projects_led INTEGER DEFAULT 0,
  projects_contributed INTEGER DEFAULT 0,
  stakeholder_feedback_score NUMERIC(3,2),
  peer_feedback_score NUMERIC(3,2),
  supervisor_rating NUMERIC(3,2),
  goals_achieved INTEGER DEFAULT 0,
  goals_total INTEGER DEFAULT 0,
  certifications_earned INTEGER DEFAULT 0,
  training_hours_completed NUMERIC(6,2) DEFAULT 0,
  overall_performance_score NUMERIC(3,2),
  performance_notes TEXT,
  evaluated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Team capacity tracking over time
CREATE TABLE IF NOT EXISTS public.team_capacity_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id UUID NOT NULL REFERENCES innovation_team_members(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  planned_capacity_hours INTEGER DEFAULT 40,
  allocated_hours INTEGER DEFAULT 0,
  actual_hours_worked INTEGER DEFAULT 0,
  utilization_percentage NUMERIC(5,2) DEFAULT 0,
  availability_status VARCHAR DEFAULT 'available', -- 'available', 'busy', 'overloaded', 'leave'
  leave_type VARCHAR, -- 'vacation', 'sick', 'training', 'other'
  peak_workload_day DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Project outcomes and success metrics
CREATE TABLE IF NOT EXISTS public.team_project_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES team_assignments(id) ON DELETE CASCADE,
  team_member_id UUID NOT NULL REFERENCES innovation_team_members(id) ON DELETE CASCADE,
  project_type VARCHAR NOT NULL, -- 'challenge', 'campaign', 'event', 'initiative'
  project_id UUID NOT NULL,
  outcome_type VARCHAR NOT NULL, -- 'completion', 'milestone', 'deliverable', 'kpi'
  outcome_description TEXT NOT NULL,
  success_metrics JSONB, -- flexible metrics storage
  target_value NUMERIC,
  actual_value NUMERIC,
  achievement_percentage NUMERIC(5,2),
  impact_level VARCHAR DEFAULT 'medium', -- 'high', 'medium', 'low'
  stakeholder_satisfaction NUMERIC(3,2),
  budget_variance_percentage NUMERIC(5,2),
  timeline_variance_days INTEGER,
  lessons_learned TEXT,
  recommendations TEXT,
  recognition_received TEXT,
  completed_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

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

-- Enable RLS on all new tables
ALTER TABLE public.team_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_capacity_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_project_outcomes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for team analytics tables
CREATE POLICY "Team members can view their own assignments" ON public.team_assignments
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

CREATE POLICY "Team members can manage their own activities" ON public.team_activities
FOR ALL USING (
  team_member_id IN (SELECT id FROM innovation_team_members WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

CREATE POLICY "Team members can view performance metrics" ON public.team_performance_metrics
FOR SELECT USING (
  team_member_id IN (SELECT id FROM innovation_team_members WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

CREATE POLICY "Team leads can manage performance metrics" ON public.team_performance_metrics
FOR INSERT, UPDATE, DELETE USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

CREATE POLICY "Team members can view capacity history" ON public.team_capacity_history
FOR SELECT USING (
  team_member_id IN (SELECT id FROM innovation_team_members WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

CREATE POLICY "Team leads can manage capacity tracking" ON public.team_capacity_history
FOR ALL USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

CREATE POLICY "Team members can view project outcomes" ON public.team_project_outcomes
FOR SELECT USING (
  team_member_id IN (SELECT id FROM innovation_team_members WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

CREATE POLICY "Team leads can manage project outcomes" ON public.team_project_outcomes
FOR ALL USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid())
);

-- Add triggers for updated_at columns
CREATE TRIGGER update_team_assignments_updated_at
  BEFORE UPDATE ON team_assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for comprehensive team analytics
CREATE OR REPLACE VIEW public.team_analytics_summary AS
SELECT 
  itm.id,
  itm.user_id,
  p.name,
  p.name_ar,
  itm.cic_role,
  itm.department,
  itm.specialization,
  itm.status,
  itm.join_date,
  itm.current_workload,
  itm.max_concurrent_projects,
  itm.performance_rating,
  
  -- Assignment metrics
  COALESCE(ta_stats.total_assignments, 0) as total_assignments,
  COALESCE(ta_stats.active_assignments, 0) as active_assignments,
  COALESCE(ta_stats.completed_assignments, 0) as completed_assignments,
  COALESCE(ta_stats.overdue_assignments, 0) as overdue_assignments,
  
  -- Activity metrics
  COALESCE(tact_stats.total_hours_this_month, 0) as total_hours_this_month,
  COALESCE(tact_stats.avg_quality_rating, 0) as avg_quality_rating,
  COALESCE(tact_stats.activities_count, 0) as activities_count,
  
  -- Capacity metrics
  COALESCE(tc_stats.avg_utilization, 0) as avg_utilization_percentage,
  COALESCE(tc_stats.weeks_tracked, 0) as weeks_tracked,
  
  -- Performance metrics
  COALESCE(tpm_stats.latest_performance_score, 0) as latest_performance_score,
  COALESCE(tpm_stats.goals_achievement_rate, 0) as goals_achievement_rate

FROM innovation_team_members itm
LEFT JOIN profiles p ON itm.user_id = p.id
LEFT JOIN (
  SELECT 
    team_member_id,
    COUNT(*) as total_assignments,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_assignments,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_assignments,
    COUNT(CASE WHEN status = 'active' AND due_date < CURRENT_DATE THEN 1 END) as overdue_assignments
  FROM team_assignments
  GROUP BY team_member_id
) ta_stats ON itm.id = ta_stats.team_member_id
LEFT JOIN (
  SELECT 
    team_member_id,
    SUM(CASE WHEN activity_date >= DATE_TRUNC('month', CURRENT_DATE) THEN hours_spent ELSE 0 END) as total_hours_this_month,
    AVG(quality_rating) as avg_quality_rating,
    COUNT(*) as activities_count
  FROM team_activities
  GROUP BY team_member_id
) tact_stats ON itm.id = tact_stats.team_member_id
LEFT JOIN (
  SELECT 
    team_member_id,
    AVG(utilization_percentage) as avg_utilization,
    COUNT(*) as weeks_tracked
  FROM team_capacity_history
  WHERE week_start_date >= CURRENT_DATE - INTERVAL '3 months'
  GROUP BY team_member_id
) tc_stats ON itm.id = tc_stats.team_member_id
LEFT JOIN (
  SELECT DISTINCT ON (team_member_id)
    team_member_id,
    overall_performance_score as latest_performance_score,
    CASE WHEN goals_total > 0 THEN (goals_achieved::float / goals_total::float * 100) ELSE 0 END as goals_achievement_rate
  FROM team_performance_metrics
  ORDER BY team_member_id, period_end_date DESC
) tpm_stats ON itm.id = tpm_stats.team_member_id;