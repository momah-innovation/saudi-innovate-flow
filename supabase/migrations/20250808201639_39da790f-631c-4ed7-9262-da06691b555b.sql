-- Create user notification preferences table
CREATE TABLE IF NOT EXISTS public.user_notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  
  -- Channel preferences
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  push_enabled BOOLEAN DEFAULT true,
  in_app_enabled BOOLEAN DEFAULT true,
  
  -- Event-specific preferences for events
  event_registration_notifications BOOLEAN DEFAULT true,
  event_cancellation_notifications BOOLEAN DEFAULT true,
  event_reminders BOOLEAN DEFAULT true,
  event_updates BOOLEAN DEFAULT true,
  new_event_announcements BOOLEAN DEFAULT true,
  
  -- Challenge preferences
  challenge_notifications BOOLEAN DEFAULT true,
  challenge_status_updates BOOLEAN DEFAULT true,
  new_challenge_announcements BOOLEAN DEFAULT true,
  
  -- Idea preferences
  idea_status_updates BOOLEAN DEFAULT true,
  idea_feedback_notifications BOOLEAN DEFAULT true,
  new_idea_notifications BOOLEAN DEFAULT false,
  
  -- Campaign preferences
  campaign_notifications BOOLEAN DEFAULT true,
  campaign_updates BOOLEAN DEFAULT true,
  
  -- Opportunity preferences
  opportunity_notifications BOOLEAN DEFAULT true,
  new_opportunity_announcements BOOLEAN DEFAULT true,
  
  -- Admin/team notifications (only for relevant users)
  admin_notifications BOOLEAN DEFAULT true,
  team_assignment_notifications BOOLEAN DEFAULT true,
  
  -- Frequency settings
  digest_frequency VARCHAR(20) DEFAULT 'daily',
  reminder_advance_days INTEGER DEFAULT 1,
  
  -- Quiet hours
  quiet_hours_enabled BOOLEAN DEFAULT false,
  quiet_hours_start TIME DEFAULT '22:00',
  quiet_hours_end TIME DEFAULT '08:00',
  quiet_hours_timezone VARCHAR(50) DEFAULT 'Asia/Riyadh',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own notification preferences" 
ON public.user_notification_preferences 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notification preferences" 
ON public.user_notification_preferences 
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Function to get user notification preferences with defaults
CREATE OR REPLACE FUNCTION public.get_user_notification_preferences(p_user_id UUID DEFAULT auth.uid())
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  preferences JSONB;
BEGIN
  -- Get preferences or create defaults
  SELECT to_jsonb(unp) INTO preferences
  FROM user_notification_preferences unp
  WHERE unp.user_id = p_user_id;
  
  -- If no preferences exist, return defaults
  IF preferences IS NULL THEN
    preferences := jsonb_build_object(
      'user_id', p_user_id,
      'email_enabled', true,
      'sms_enabled', false,
      'push_enabled', true,
      'in_app_enabled', true,
      'event_registration_notifications', true,
      'event_cancellation_notifications', true,
      'event_reminders', true,
      'event_updates', true,
      'new_event_announcements', true,
      'challenge_notifications', true,
      'challenge_status_updates', true,
      'new_challenge_announcements', true,
      'idea_status_updates', true,
      'idea_feedback_notifications', true,
      'new_idea_notifications', false,
      'campaign_notifications', true,
      'campaign_updates', true,
      'opportunity_notifications', true,
      'new_opportunity_announcements', true,
      'admin_notifications', true,
      'team_assignment_notifications', true,
      'digest_frequency', 'daily',
      'reminder_advance_days', 1,
      'quiet_hours_enabled', false,
      'quiet_hours_start', '22:00',
      'quiet_hours_end', '08:00',
      'quiet_hours_timezone', 'Asia/Riyadh'
    );
  END IF;
  
  RETURN preferences;
END;
$$;

-- Function to update notification preferences
CREATE OR REPLACE FUNCTION public.update_user_notification_preferences(
  p_preferences JSONB
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.user_notification_preferences (
    user_id,
    email_enabled,
    sms_enabled,
    push_enabled,
    in_app_enabled,
    event_registration_notifications,
    event_cancellation_notifications,
    event_reminders,
    event_updates,
    new_event_announcements,
    challenge_notifications,
    challenge_status_updates,
    new_challenge_announcements,
    idea_status_updates,
    idea_feedback_notifications,
    new_idea_notifications,
    campaign_notifications,
    campaign_updates,
    opportunity_notifications,
    new_opportunity_announcements,
    admin_notifications,
    team_assignment_notifications,
    digest_frequency,
    reminder_advance_days,
    quiet_hours_enabled,
    quiet_hours_start,
    quiet_hours_end,
    quiet_hours_timezone
  ) VALUES (
    auth.uid(),
    COALESCE((p_preferences->>'email_enabled')::BOOLEAN, true),
    COALESCE((p_preferences->>'sms_enabled')::BOOLEAN, false),
    COALESCE((p_preferences->>'push_enabled')::BOOLEAN, true),
    COALESCE((p_preferences->>'in_app_enabled')::BOOLEAN, true),
    COALESCE((p_preferences->>'event_registration_notifications')::BOOLEAN, true),
    COALESCE((p_preferences->>'event_cancellation_notifications')::BOOLEAN, true),
    COALESCE((p_preferences->>'event_reminders')::BOOLEAN, true),
    COALESCE((p_preferences->>'event_updates')::BOOLEAN, true),
    COALESCE((p_preferences->>'new_event_announcements')::BOOLEAN, true),
    COALESCE((p_preferences->>'challenge_notifications')::BOOLEAN, true),
    COALESCE((p_preferences->>'challenge_status_updates')::BOOLEAN, true),
    COALESCE((p_preferences->>'new_challenge_announcements')::BOOLEAN, true),
    COALESCE((p_preferences->>'idea_status_updates')::BOOLEAN, true),
    COALESCE((p_preferences->>'idea_feedback_notifications')::BOOLEAN, true),
    COALESCE((p_preferences->>'new_idea_notifications')::BOOLEAN, false),
    COALESCE((p_preferences->>'campaign_notifications')::BOOLEAN, true),
    COALESCE((p_preferences->>'campaign_updates')::BOOLEAN, true),
    COALESCE((p_preferences->>'opportunity_notifications')::BOOLEAN, true),
    COALESCE((p_preferences->>'new_opportunity_announcements')::BOOLEAN, true),
    COALESCE((p_preferences->>'admin_notifications')::BOOLEAN, true),
    COALESCE((p_preferences->>'team_assignment_notifications')::BOOLEAN, true),
    COALESCE(p_preferences->>'digest_frequency', 'daily'),
    COALESCE((p_preferences->>'reminder_advance_days')::INTEGER, 1),
    COALESCE((p_preferences->>'quiet_hours_enabled')::BOOLEAN, false),
    COALESCE((p_preferences->>'quiet_hours_start')::TIME, '22:00'),
    COALESCE((p_preferences->>'quiet_hours_end')::TIME, '08:00'),
    COALESCE(p_preferences->>'quiet_hours_timezone', 'Asia/Riyadh')
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email_enabled = EXCLUDED.email_enabled,
    sms_enabled = EXCLUDED.sms_enabled,
    push_enabled = EXCLUDED.push_enabled,
    in_app_enabled = EXCLUDED.in_app_enabled,
    event_registration_notifications = EXCLUDED.event_registration_notifications,
    event_cancellation_notifications = EXCLUDED.event_cancellation_notifications,
    event_reminders = EXCLUDED.event_reminders,
    event_updates = EXCLUDED.event_updates,
    new_event_announcements = EXCLUDED.new_event_announcements,
    challenge_notifications = EXCLUDED.challenge_notifications,
    challenge_status_updates = EXCLUDED.challenge_status_updates,
    new_challenge_announcements = EXCLUDED.new_challenge_announcements,
    idea_status_updates = EXCLUDED.idea_status_updates,
    idea_feedback_notifications = EXCLUDED.idea_feedback_notifications,
    new_idea_notifications = EXCLUDED.new_idea_notifications,
    campaign_notifications = EXCLUDED.campaign_notifications,
    campaign_updates = EXCLUDED.campaign_updates,
    opportunity_notifications = EXCLUDED.opportunity_notifications,
    new_opportunity_announcements = EXCLUDED.new_opportunity_announcements,
    admin_notifications = EXCLUDED.admin_notifications,
    team_assignment_notifications = EXCLUDED.team_assignment_notifications,
    digest_frequency = EXCLUDED.digest_frequency,
    reminder_advance_days = EXCLUDED.reminder_advance_days,
    quiet_hours_enabled = EXCLUDED.quiet_hours_enabled,
    quiet_hours_start = EXCLUDED.quiet_hours_start,
    quiet_hours_end = EXCLUDED.quiet_hours_end,
    quiet_hours_timezone = EXCLUDED.quiet_hours_timezone,
    updated_at = now();
    
  RETURN true;
END;
$$;

-- Function to check if user should receive notification
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
  current_time TIME;
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
    -- Simple time check (would need more complex timezone handling in production)
    current_time := CURRENT_TIME;
    
    IF (preferences->>'quiet_hours_start')::TIME > (preferences->>'quiet_hours_end')::TIME THEN
      -- Quiet hours span midnight
      in_quiet_hours := current_time >= (preferences->>'quiet_hours_start')::TIME 
                       OR current_time <= (preferences->>'quiet_hours_end')::TIME;
    ELSE
      -- Normal quiet hours within same day
      in_quiet_hours := current_time >= (preferences->>'quiet_hours_start')::TIME 
                       AND current_time <= (preferences->>'quiet_hours_end')::TIME;
    END IF;
  END IF;
  
  RETURN channel_enabled AND type_enabled AND NOT in_quiet_hours;
END;
$$;