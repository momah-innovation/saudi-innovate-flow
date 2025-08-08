-- Fix the should_send_notification function with corrected syntax
CREATE OR REPLACE FUNCTION public.should_send_notification(
  p_user_id UUID,
  p_notification_type VARCHAR,
  p_channel VARCHAR DEFAULT 'in_app'
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  preferences JSONB;
  channel_enabled BOOLEAN := false;
  type_enabled BOOLEAN := false;
  current_hour TIME;
  user_timezone VARCHAR(50);
  in_quiet_hours BOOLEAN := false;
BEGIN
  -- Get user preferences
  SELECT public.get_user_notification_preferences(p_user_id) INTO preferences;
  
  -- Check if channel is enabled
  CASE p_channel
    WHEN 'email' THEN channel_enabled := (preferences->>'email_enabled')::BOOLEAN;
    WHEN 'sms' THEN channel_enabled := (preferences->>'sms_enabled')::BOOLEAN;
    WHEN 'push' THEN channel_enabled := (preferences->>'push_enabled')::BOOLEAN;
    WHEN 'in_app' THEN channel_enabled := (preferences->>'in_app_enabled')::BOOLEAN;
    ELSE channel_enabled := true;
  END CASE;
  
  -- Check if notification type is enabled
  CASE p_notification_type
    WHEN 'event_registration' THEN type_enabled := (preferences->>'event_registration_notifications')::BOOLEAN;
    WHEN 'event_cancellation' THEN type_enabled := (preferences->>'event_cancellation_notifications')::BOOLEAN;
    WHEN 'event_reminder' THEN type_enabled := (preferences->>'event_reminders')::BOOLEAN;
    WHEN 'event_update' THEN type_enabled := (preferences->>'event_updates')::BOOLEAN;
    WHEN 'new_event' THEN type_enabled := (preferences->>'new_event_announcements')::BOOLEAN;
    WHEN 'challenge_notification' THEN type_enabled := (preferences->>'challenge_notifications')::BOOLEAN;
    WHEN 'challenge_status' THEN type_enabled := (preferences->>'challenge_status_updates')::BOOLEAN;
    WHEN 'new_challenge' THEN type_enabled := (preferences->>'new_challenge_announcements')::BOOLEAN;
    WHEN 'idea_status' THEN type_enabled := (preferences->>'idea_status_updates')::BOOLEAN;
    WHEN 'idea_feedback' THEN type_enabled := (preferences->>'idea_feedback_notifications')::BOOLEAN;
    WHEN 'new_idea' THEN type_enabled := (preferences->>'new_idea_notifications')::BOOLEAN;
    WHEN 'campaign_notification' THEN type_enabled := (preferences->>'campaign_notifications')::BOOLEAN;
    WHEN 'campaign_update' THEN type_enabled := (preferences->>'campaign_updates')::BOOLEAN;
    WHEN 'opportunity_notification' THEN type_enabled := (preferences->>'opportunity_notifications')::BOOLEAN;
    WHEN 'new_opportunity' THEN type_enabled := (preferences->>'new_opportunity_announcements')::BOOLEAN;
    WHEN 'admin_notification' THEN type_enabled := (preferences->>'admin_notifications')::BOOLEAN;
    WHEN 'team_assignment' THEN type_enabled := (preferences->>'team_assignment_notifications')::BOOLEAN;
    ELSE type_enabled := true;
  END CASE;
  
  -- Check quiet hours for non-urgent notifications
  IF (preferences->>'quiet_hours_enabled')::BOOLEAN AND p_notification_type NOT IN ('urgent', 'security') THEN
    user_timezone := preferences->>'quiet_hours_timezone';
    -- Get current time
    current_hour := CURRENT_TIME;
    
    IF (preferences->>'quiet_hours_start')::TIME > (preferences->>'quiet_hours_end')::TIME THEN
      -- Quiet hours span midnight
      in_quiet_hours := current_hour >= (preferences->>'quiet_hours_start')::TIME 
                       OR current_hour <= (preferences->>'quiet_hours_end')::TIME;
    ELSE
      -- Normal quiet hours within same day
      in_quiet_hours := current_hour >= (preferences->>'quiet_hours_start')::TIME 
                       AND current_hour <= (preferences->>'quiet_hours_end')::TIME;
    END IF;
  END IF;
  
  RETURN channel_enabled AND type_enabled AND NOT in_quiet_hours;
END;
$$;

-- Update the event notification trigger to respect user preferences
CREATE OR REPLACE FUNCTION public.notify_event_stakeholders()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  event_record RECORD;
  stakeholder_record RECORD;
  participant_name TEXT;
  event_url TEXT;
BEGIN
  -- Get event details
  SELECT e.title_ar, e.event_manager_id, e.max_participants, 
         (SELECT COUNT(*) FROM event_participants WHERE event_id = e.id) as current_participants
  INTO event_record
  FROM events e 
  WHERE e.id = COALESCE(NEW.event_id, OLD.event_id);
  
  -- Get participant name from profiles
  SELECT COALESCE(display_name, full_name_ar, 'مشارك') INTO participant_name
  FROM profiles 
  WHERE user_id = COALESCE(NEW.user_id, OLD.user_id);
  
  event_url := '/events/' || COALESCE(NEW.event_id, OLD.event_id);
  
  IF TG_OP = 'INSERT' THEN
    -- Registration notifications
    
    -- 1. Notify event manager (check preferences)
    IF event_record.event_manager_id IS NOT NULL 
       AND should_send_notification(event_record.event_manager_id, 'event_registration', 'in_app') THEN
      PERFORM send_event_notification(
        NEW.event_id,
        event_record.event_manager_id,
        'new_registration',
        'تسجيل جديد في الفعالية',
        'قام ' || participant_name || ' بالتسجيل في فعالية "' || event_record.title_ar || '"',
        event_url,
        jsonb_build_object(
          'participant_id', NEW.user_id,
          'participant_name', participant_name,
          'event_title', event_record.title_ar,
          'current_participants', event_record.current_participants + 1
        )
      );
    END IF;
    
    -- 2. Notify innovation team members (check preferences)
    FOR stakeholder_record IN 
      SELECT itm.user_id 
      FROM innovation_team_members itm 
      WHERE itm.status = 'active' 
        AND itm.user_id != NEW.user_id 
        AND itm.user_id != event_record.event_manager_id
        AND should_send_notification(itm.user_id, 'event_registration', 'in_app')
    LOOP
      PERFORM send_event_notification(
        NEW.event_id,
        stakeholder_record.user_id,
        'team_registration_update',
        'تسجيل جديد في الفعالية',
        'تم تسجيل مشارك جديد في فعالية "' || event_record.title_ar || '"',
        event_url,
        jsonb_build_object(
          'participant_name', participant_name,
          'event_title', event_record.title_ar,
          'current_participants', event_record.current_participants + 1
        )
      );
    END LOOP;
    
    -- 3. Notify admins (check preferences)
    FOR stakeholder_record IN 
      SELECT ur.user_id 
      FROM user_roles ur 
      WHERE ur.role IN ('admin', 'super_admin') 
        AND ur.is_active = true
        AND ur.user_id != NEW.user_id
        AND should_send_notification(ur.user_id, 'admin_notification', 'in_app')
    LOOP
      PERFORM send_event_notification(
        NEW.event_id,
        stakeholder_record.user_id,
        'admin_registration_update',
        'تسجيل جديد في الفعالية',
        'تم تسجيل مشارك جديد في فعالية "' || event_record.title_ar || '"',
        event_url,
        jsonb_build_object(
          'participant_name', participant_name,
          'event_title', event_record.title_ar,
          'current_participants', event_record.current_participants + 1
        )
      );
    END LOOP;
    
    -- 4. Send confirmation to the participant (always send)
    PERFORM send_event_notification(
      NEW.event_id,
      NEW.user_id,
      'registration_confirmation',
      'تم تأكيد التسجيل',
      'تم تسجيلك بنجاح في فعالية "' || event_record.title_ar || '"',
      event_url,
      jsonb_build_object(
        'event_title', event_record.title_ar,
        'registration_type', NEW.registration_type,
        'attendance_status', NEW.attendance_status
      )
    );
    
  ELSIF TG_OP = 'DELETE' THEN
    -- Cancellation notifications
    
    -- 1. Notify event manager (check preferences)
    IF event_record.event_manager_id IS NOT NULL 
       AND should_send_notification(event_record.event_manager_id, 'event_cancellation', 'in_app') THEN
      PERFORM send_event_notification(
        OLD.event_id,
        event_record.event_manager_id,
        'registration_cancelled',
        'إلغاء تسجيل في الفعالية',
        'قام ' || participant_name || ' بإلغاء التسجيل في فعالية "' || event_record.title_ar || '"',
        event_url,
        jsonb_build_object(
          'participant_id', OLD.user_id,
          'participant_name', participant_name,
          'event_title', event_record.title_ar,
          'current_participants', event_record.current_participants - 1
        )
      );
    END IF;
    
    -- 2. Notify innovation team members (check preferences)
    FOR stakeholder_record IN 
      SELECT itm.user_id 
      FROM innovation_team_members itm 
      WHERE itm.status = 'active' 
        AND itm.user_id != OLD.user_id 
        AND itm.user_id != event_record.event_manager_id
        AND should_send_notification(itm.user_id, 'event_cancellation', 'in_app')
    LOOP
      PERFORM send_event_notification(
        OLD.event_id,
        stakeholder_record.user_id,
        'team_cancellation_update',
        'إلغاء تسجيل في الفعالية',
        'تم إلغاء تسجيل مشارك في فعالية "' || event_record.title_ar || '"',
        event_url,
        jsonb_build_object(
          'participant_name', participant_name,
          'event_title', event_record.title_ar,
          'current_participants', event_record.current_participants - 1
        )
      );
    END LOOP;
    
    -- 3. Send cancellation confirmation to the participant (always send)
    PERFORM send_event_notification(
      OLD.event_id,
      OLD.user_id,
      'cancellation_confirmation',
      'تم إلغاء التسجيل',
      'تم إلغاء تسجيلك في فعالية "' || event_record.title_ar || '" بنجاح',
      event_url,
      jsonb_build_object(
        'event_title', event_record.title_ar,
        'cancelled_at', NOW()
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;