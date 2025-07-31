-- Fix the missing foreign key relationship for opportunity_bookmarks

-- Add the foreign key constraint
ALTER TABLE public.opportunity_bookmarks 
ADD CONSTRAINT fk_opportunity_bookmarks_opportunity_id 
FOREIGN KEY (opportunity_id) 
REFERENCES public.partnership_opportunities(id) 
ON DELETE CASCADE;

-- Fix functions without proper search_path (security warnings)
CREATE OR REPLACE FUNCTION public.auto_create_team_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Create assignment record when expert is assigned to challenge
  INSERT INTO public.team_assignments (
    team_member_id,
    assignment_type,
    assignment_id,
    role_in_assignment,
    workload_percentage,
    status,
    assigned_date,
    start_date,
    assigned_by
  ) 
  SELECT 
    itm.id,
    'challenge',
    NEW.challenge_id,
    NEW.role_type,
    20, -- Default 20% workload
    NEW.status,
    NEW.assignment_date::date,
    NEW.assignment_date::date,
    auth.uid()
  FROM innovation_team_members itm
  WHERE itm.user_id = NEW.expert_id
  ON CONFLICT (team_member_id, assignment_type, assignment_id) DO UPDATE SET
    status = NEW.status,
    role_in_assignment = NEW.role_type;
    
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.auto_create_campaign_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Create assignment for campaign manager
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
      30, -- Campaign managers get 30% workload
      NEW.status,
      CURRENT_DATE,
      NEW.start_date,
      NEW.end_date,
      EXTRACT(DAYS FROM (NEW.end_date - NEW.start_date)) * 2 -- Estimate 2 hours per day
    FROM innovation_team_members itm
    WHERE itm.user_id = NEW.campaign_manager_id
    ON CONFLICT (team_member_id, assignment_type, assignment_id) DO UPDATE SET
      status = NEW.status,
      due_date = NEW.end_date;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.auto_create_event_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF NEW.event_manager_id IS NOT NULL THEN
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
      NEW.id,
      'manager',
      15, -- Events are typically shorter commitment
      NEW.status,
      CURRENT_DATE,
      NEW.event_date,
      CASE 
        WHEN NEW.format = 'virtual' THEN 4
        WHEN NEW.format = 'hybrid' THEN 8
        ELSE 12
      END -- Estimate hours based on event format
    FROM innovation_team_members itm
    WHERE itm.user_id = NEW.event_manager_id
    ON CONFLICT (team_member_id, assignment_type, assignment_id) DO UPDATE SET
      status = NEW.status;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_team_member_workload()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  total_workload INTEGER;
BEGIN
  -- Calculate total workload for the team member
  SELECT COALESCE(SUM(workload_percentage), 0)
  INTO total_workload
  FROM team_assignments
  WHERE team_member_id = COALESCE(NEW.team_member_id, OLD.team_member_id)
    AND status = 'active';
  
  -- Update the innovation_team_members table
  UPDATE innovation_team_members
  SET current_workload = LEAST(total_workload, max_concurrent_projects)
  WHERE id = COALESCE(NEW.team_member_id, OLD.team_member_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE OR REPLACE FUNCTION public.auto_log_team_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Log activity when assignment status changes to completed
  IF OLD.status != 'completed' AND NEW.status = 'completed' THEN
    INSERT INTO public.team_activities (
      team_member_id,
      assignment_id,
      activity_type,
      activity_description,
      hours_spent,
      activity_date,
      quality_rating
    ) VALUES (
      NEW.team_member_id,
      NEW.id,
      'completion',
      'مهمة مكتملة: ' || NEW.assignment_type,
      NEW.actual_hours,
      CURRENT_DATE,
      4 -- Default good rating, can be updated later
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.auto_track_weekly_capacity()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  current_week DATE;
  member_record RECORD;
BEGIN
  current_week := DATE_TRUNC('week', CURRENT_DATE);
  
  -- Insert weekly capacity records for all active team members
  FOR member_record IN 
    SELECT id, current_workload, max_concurrent_projects 
    FROM innovation_team_members 
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
      40, -- Standard work week
      (member_record.current_workload::float / member_record.max_concurrent_projects) * 40,
      (member_record.current_workload::float / member_record.max_concurrent_projects) * 100,
      CASE 
        WHEN (member_record.current_workload::float / member_record.max_concurrent_projects) >= 0.9 THEN 'overloaded'
        WHEN (member_record.current_workload::float / member_record.max_concurrent_projects) >= 0.75 THEN 'busy'
        ELSE 'available'
      END
    )
    ON CONFLICT (team_member_id, week_start_date) DO UPDATE SET
      allocated_hours = EXCLUDED.allocated_hours,
      utilization_percentage = EXCLUDED.utilization_percentage,
      availability_status = EXCLUDED.availability_status;
  END LOOP;
END;
$function$;