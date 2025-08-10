-- Fix Real-time Features and Database Issues (Corrected)
-- Enable real-time subscriptions and fix security issues

-- 1. Enable Real-time subscriptions for missing tables
-- Enable realtime for all tables that should have it
ALTER publication supabase_realtime ADD TABLE public.challenges;
ALTER publication supabase_realtime ADD TABLE public.ideas;
ALTER publication supabase_realtime ADD TABLE public.events;
ALTER publication supabase_realtime ADD TABLE public.opportunities;
ALTER publication supabase_realtime ADD TABLE public.collaboration_messages;
ALTER publication supabase_realtime ADD TABLE public.user_presence;
ALTER publication supabase_realtime ADD TABLE public.activity_logs;
ALTER publication supabase_realtime ADD TABLE public.notifications;
ALTER publication supabase_realtime ADD TABLE public.system_translations;

-- 2. Fix any missing RLS policies for real-time tables
-- Ensure user_presence has proper RLS policies
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all presence records" 
ON public.user_presence 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own presence" 
ON public.user_presence 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own presence" 
ON public.user_presence 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own presence" 
ON public.user_presence 
FOR DELETE 
USING (auth.uid() = user_id);

-- 3. Ensure collaboration_messages has proper RLS
ALTER TABLE public.collaboration_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in spaces they participate in" 
ON public.collaboration_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.collaboration_spaces 
    WHERE id = collaboration_messages.space_id 
    AND (
      created_by = auth.uid() 
      OR participants ? auth.uid()::text
    )
  )
);

CREATE POLICY "Users can create messages in spaces they participate in" 
ON public.collaboration_messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id 
  AND EXISTS (
    SELECT 1 FROM public.collaboration_spaces 
    WHERE id = collaboration_messages.space_id 
    AND (
      created_by = auth.uid() 
      OR participants ? auth.uid()::text
    )
  )
);

-- 4. Optimize real-time performance with indexes
CREATE INDEX IF NOT EXISTS idx_user_presence_user_id ON public.user_presence(user_id);
CREATE INDEX IF NOT EXISTS idx_user_presence_updated_at ON public.user_presence(updated_at);
CREATE INDEX IF NOT EXISTS idx_collaboration_messages_space_id ON public.collaboration_messages(space_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_messages_created_at ON public.collaboration_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_type_id ON public.activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_read ON public.notifications(user_id, is_read);

-- 5. Update system settings for better performance
UPDATE public.system_settings 
SET setting_value = 'true' 
WHERE setting_key = 'realtime_enabled' AND setting_value != 'true';

INSERT INTO public.system_settings (setting_key, setting_value, category, description)
VALUES 
  ('realtime_max_connections', '1000', 'performance', 'Maximum real-time connections'),
  ('realtime_heartbeat_interval', '30', 'performance', 'Real-time heartbeat interval in seconds')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();