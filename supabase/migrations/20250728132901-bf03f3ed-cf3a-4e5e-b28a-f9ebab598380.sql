-- Add unique constraints and populate sample data

-- Add unique constraint for team assignments to prevent duplicates
ALTER TABLE public.team_assignments 
ADD CONSTRAINT unique_team_assignment 
UNIQUE (team_member_id, assignment_type, assignment_id);

-- Populate initial data from existing relationships (without ON CONFLICT)
INSERT INTO public.team_assignments (
  team_member_id,
  assignment_type,
  assignment_id,
  role_in_assignment,
  workload_percentage,
  status,
  assigned_date,
  start_date
)
SELECT DISTINCT
  itm.id,
  'challenge',
  ce.challenge_id,
  ce.role_type,
  20,
  ce.status,
  ce.assignment_date::date,
  ce.assignment_date::date
FROM public.challenge_experts ce
JOIN public.innovation_team_members itm ON itm.user_id = ce.expert_id
WHERE NOT EXISTS (
  SELECT 1 FROM public.team_assignments ta 
  WHERE ta.team_member_id = itm.id 
    AND ta.assignment_type = 'challenge' 
    AND ta.assignment_id = ce.challenge_id
);

-- Add some sample team activities for demonstration
INSERT INTO public.team_activities (
  team_member_id,
  activity_type,
  activity_description,
  hours_spent,
  activity_date,
  quality_rating,
  collaboration_rating,
  innovation_rating
)
SELECT 
  itm.id,
  'evaluation',
  'تقييم التحدي: ' || c.title_ar,
  3.5,
  CURRENT_DATE - (RANDOM() * 30)::INTEGER,
  4 + (RANDOM())::INTEGER, -- Random rating 4-5
  4 + (RANDOM())::INTEGER,
  3 + (RANDOM() * 2)::INTEGER -- Random rating 3-5
FROM public.innovation_team_members itm
CROSS JOIN public.challenges c
WHERE itm.status = 'active'
LIMIT 10;

-- Add sample performance metrics
INSERT INTO public.team_performance_metrics (
  team_member_id,
  evaluation_period,
  period_start_date,
  period_end_date,
  assignments_completed,
  total_hours_worked,
  average_quality_rating,
  average_collaboration_rating,
  average_innovation_rating,
  overall_performance_score,
  goals_achieved,
  goals_total
)
SELECT 
  itm.id,
  'monthly',
  DATE_TRUNC('month', CURRENT_DATE),
  DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day',
  2 + (RANDOM() * 3)::INTEGER, -- 2-5 completed assignments
  40 + (RANDOM() * 80)::INTEGER, -- 40-120 hours
  3.5 + (RANDOM() * 1.5), -- 3.5-5.0 quality rating
  4.0 + (RANDOM()), -- 4.0-5.0 collaboration rating
  3.0 + (RANDOM() * 2), -- 3.0-5.0 innovation rating
  3.5 + (RANDOM() * 1.5), -- 3.5-5.0 overall score
  3 + (RANDOM() * 2)::INTEGER, -- 3-5 goals achieved
  5 -- total goals
FROM public.innovation_team_members itm
WHERE itm.status = 'active';

-- Add weekly capacity history for the last 4 weeks
INSERT INTO public.team_capacity_history (
  team_member_id,
  week_start_date,
  planned_capacity_hours,
  allocated_hours,
  actual_hours_worked,
  utilization_percentage,
  availability_status
)
SELECT 
  itm.id,
  DATE_TRUNC('week', CURRENT_DATE - (week_offset * 7)::INTEGER),
  40, -- Standard work week
  25 + (RANDOM() * 20)::INTEGER, -- 25-45 allocated hours
  20 + (RANDOM() * 25)::INTEGER, -- 20-45 actual hours
  50 + (RANDOM() * 40), -- 50-90% utilization
  CASE 
    WHEN RANDOM() > 0.8 THEN 'overloaded'
    WHEN RANDOM() > 0.5 THEN 'busy'
    ELSE 'available'
  END
FROM public.innovation_team_members itm
CROSS JOIN generate_series(0, 3) AS week_offset
WHERE itm.status = 'active';

-- Function to manually trigger weekly capacity tracking
CREATE OR REPLACE FUNCTION public.update_weekly_capacity()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_week DATE;
  member_record RECORD;
BEGIN
  current_week := DATE_TRUNC('week', CURRENT_DATE);
  
  FOR member_record IN 
    SELECT id, current_workload, max_concurrent_projects 
    FROM public.innovation_team_members 
    WHERE status = 'active'
  LOOP
    INSERT INTO public.team_capacity_history (
      team_member_id,
      week_start_date,
      planned_capacity_hours,
      allocated_hours,
      utilization_percentage,
      availability_status
    ) VALUES (
      member_record.id,
      current_week,
      40,
      (member_record.current_workload::float / NULLIF(member_record.max_concurrent_projects, 0)) * 40,
      (member_record.current_workload::float / NULLIF(member_record.max_concurrent_projects, 0)) * 100,
      CASE 
        WHEN (member_record.current_workload::float / NULLIF(member_record.max_concurrent_projects, 0)) >= 0.9 THEN 'overloaded'
        WHEN (member_record.current_workload::float / NULLIF(member_record.max_concurrent_projects, 0)) >= 0.75 THEN 'busy'
        ELSE 'available'
      END
    )
    ON CONFLICT (team_member_id, week_start_date) DO UPDATE SET
      allocated_hours = EXCLUDED.allocated_hours,
      utilization_percentage = EXCLUDED.utilization_percentage,
      availability_status = EXCLUDED.availability_status;
  END LOOP;
END;
$$;