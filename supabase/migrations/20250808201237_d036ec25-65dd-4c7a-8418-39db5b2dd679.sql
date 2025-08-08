-- Fix the search_path issues for functions that don't have it set
-- These are existing functions that need to be fixed

-- Fix auto_create_team_assignment function
CREATE OR REPLACE FUNCTION public.auto_create_team_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- Fix notify_challenge_participants function
CREATE OR REPLACE FUNCTION public.notify_challenge_participants()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Notify participants when challenge status changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.challenge_notifications (
      challenge_id, recipient_id, notification_type, title, message
    )
    SELECT 
      NEW.id,
      cp.user_id,
      'status_change',
      'تحديث حالة التحدي',
      'تم تحديث حالة التحدي "' || NEW.title_ar || '" إلى: ' || NEW.status
    FROM public.challenge_participants cp
    WHERE cp.challenge_id = NEW.id 
      AND cp.notifications_enabled = true
      AND cp.status = 'active';
  END IF;
  
  RETURN NEW;
END;
$function$;