-- Create event notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.event_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  sender_id UUID,
  notification_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.event_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own notifications" 
ON public.event_notifications 
FOR SELECT 
USING (recipient_id = auth.uid());

CREATE POLICY "Users can update their own notifications" 
ON public.event_notifications 
FOR UPDATE 
USING (recipient_id = auth.uid());

-- Create function to send event notifications
CREATE OR REPLACE FUNCTION public.send_event_notification(
  p_event_id UUID,
  p_recipient_id UUID,
  p_notification_type VARCHAR,
  p_title VARCHAR,
  p_message TEXT,
  p_action_url TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.event_notifications (
    event_id, recipient_id, sender_id, notification_type,
    title, message, action_url, metadata
  ) VALUES (
    p_event_id, p_recipient_id, auth.uid(), p_notification_type,
    p_title, p_message, p_action_url, p_metadata
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Create trigger function for event participant notifications
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
    
    -- 1. Notify event manager
    IF event_record.event_manager_id IS NOT NULL THEN
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
    
    -- 2. Notify innovation team members
    FOR stakeholder_record IN 
      SELECT itm.user_id 
      FROM innovation_team_members itm 
      WHERE itm.status = 'active' 
        AND itm.user_id != NEW.user_id 
        AND itm.user_id != event_record.event_manager_id
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
    
    -- 3. Notify admins
    FOR stakeholder_record IN 
      SELECT ur.user_id 
      FROM user_roles ur 
      WHERE ur.role IN ('admin', 'super_admin') 
        AND ur.is_active = true
        AND ur.user_id != NEW.user_id
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
    
    -- 4. Send confirmation to the participant
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
    
    -- 1. Notify event manager
    IF event_record.event_manager_id IS NOT NULL THEN
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
    
    -- 2. Notify innovation team members
    FOR stakeholder_record IN 
      SELECT itm.user_id 
      FROM innovation_team_members itm 
      WHERE itm.status = 'active' 
        AND itm.user_id != OLD.user_id 
        AND itm.user_id != event_record.event_manager_id
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
    
    -- 3. Send cancellation confirmation to the participant
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

-- Create trigger for event participant changes
DROP TRIGGER IF EXISTS event_participant_notifications ON public.event_participants;
CREATE TRIGGER event_participant_notifications
  AFTER INSERT OR DELETE ON public.event_participants
  FOR EACH ROW
  EXECUTE FUNCTION notify_event_stakeholders();