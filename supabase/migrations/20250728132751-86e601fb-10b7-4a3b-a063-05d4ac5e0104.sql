-- Create triggers for automated data collection and fix security issues

-- Fix function security by adding search_path
DROP FUNCTION IF EXISTS public.auto_create_team_assignment();
DROP FUNCTION IF EXISTS public.auto_create_campaign_assignment();
DROP FUNCTION IF EXISTS public.auto_create_event_assignment();
DROP FUNCTION IF EXISTS public.update_team_member_workload();
DROP FUNCTION IF EXISTS public.auto_log_team_activity();
DROP FUNCTION IF EXISTS public.auto_track_weekly_capacity();

-- Recreate functions with proper security settings
CREATE OR REPLACE FUNCTION public.auto_create_team_assignment()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
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
  SELECT 
    itm.id,
    'challenge',
    NEW.challenge_id,
    NEW.role_type,
    20,
    NEW.status,
    NEW.assignment_date::date,
    NEW.assignment_date::date
  FROM public.innovation_team_members itm
  WHERE itm.user_id = NEW.expert_id
  ON CONFLICT (team_member_id, assignment_type, assignment_id) DO UPDATE SET
    status = NEW.status,
    role_in_assignment = NEW.role_type;
    
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.auto_create_campaign_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.campaign_manager_id IS NOT NULL THEN
    INSERT INTO public.team_assignments (
      team_member_id,
      assignment_type,
      assignment_id,
      role_in_assignment,
      workload_percentage,
      status,
      assigned_date,
      start_date,
      due_date,
      estimated_hours
    )
    SELECT 
      itm.id,
      'campaign',
      NEW.id,
      'manager',
      30,
      NEW.status,
      CURRENT_DATE,
      NEW.start_date,
      NEW.end_date,
      EXTRACT(DAYS FROM (NEW.end_date - NEW.start_date)) * 2
    FROM public.innovation_team_members itm
    WHERE itm.user_id = NEW.campaign_manager_id
    ON CONFLICT (team_member_id, assignment_type, assignment_id) DO UPDATE SET
      status = NEW.status,
      due_date = NEW.end_date;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_team_member_workload()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  total_workload INTEGER;
BEGIN
  SELECT COALESCE(SUM(workload_percentage), 0)
  INTO total_workload
  FROM public.team_assignments
  WHERE team_member_id = COALESCE(NEW.team_member_id, OLD.team_member_id)
    AND status = 'active';
  
  UPDATE public.innovation_team_members
  SET current_workload = LEAST(total_workload, max_concurrent_projects)
  WHERE id = COALESCE(NEW.team_member_id, OLD.team_member_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create the actual triggers
CREATE TRIGGER trigger_auto_create_team_assignment
  AFTER INSERT OR UPDATE ON public.challenge_experts
  FOR EACH ROW EXECUTE FUNCTION public.auto_create_team_assignment();

CREATE TRIGGER trigger_auto_create_campaign_assignment  
  AFTER INSERT OR UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.auto_create_campaign_assignment();

CREATE TRIGGER trigger_update_workload_on_assignment_change
  AFTER INSERT OR UPDATE OR DELETE ON public.team_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_team_member_workload();

-- Populate initial data from existing relationships
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
SELECT 
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
ON CONFLICT (team_member_id, assignment_type, assignment_id) DO NOTHING;

-- Populate campaign assignments
INSERT INTO public.team_assignments (
  team_member_id,
  assignment_type,
  assignment_id,
  role_in_assignment,
  workload_percentage,
  status,
  assigned_date,
  start_date,
  due_date,
  estimated_hours
)
SELECT 
  itm.id,
  'campaign',
  c.id,
  'manager',
  30,
  c.status,
  c.created_at::date,
  c.start_date,
  c.end_date,
  EXTRACT(DAYS FROM (c.end_date - c.start_date)) * 2
FROM public.campaigns c
JOIN public.innovation_team_members itm ON itm.user_id = c.campaign_manager_id
WHERE c.campaign_manager_id IS NOT NULL
ON CONFLICT (team_member_id, assignment_type, assignment_id) DO NOTHING;

-- Populate event assignments  
INSERT INTO public.team_assignments (
  team_member_id,
  assignment_type,
  assignment_id,
  role_in_assignment,
  workload_percentage,
  status,
  assigned_date,
  start_date,
  estimated_hours
)
SELECT 
  itm.id,
  'event',
  e.id,
  'manager',
  15,
  e.status,
  e.created_at::date,
  e.event_date,
  CASE 
    WHEN e.format = 'virtual' THEN 4
    WHEN e.format = 'hybrid' THEN 8
    ELSE 12
  END
FROM public.events e
JOIN public.innovation_team_members itm ON itm.user_id = e.event_manager_id
WHERE e.event_manager_id IS NOT NULL
ON CONFLICT (team_member_id, assignment_type, assignment_id) DO NOTHING;