-- Create comprehensive analytics tables for team management (corrected)

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

-- Enable RLS on all new tables
ALTER TABLE public.team_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_capacity_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_project_outcomes ENABLE ROW LEVEL SECURITY;