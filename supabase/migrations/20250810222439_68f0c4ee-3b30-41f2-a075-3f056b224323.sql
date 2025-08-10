-- Fix Real-time Features (Skip already enabled tables)
-- Enable real-time for tables that aren't already in publication

-- Check which tables are missing and add only those
DO $$
DECLARE
    table_name text;
    missing_tables text[] := ARRAY[
        'user_presence',
        'collaboration_messages', 
        'activity_logs',
        'system_translations'
    ];
BEGIN
    FOREACH table_name IN ARRAY missing_tables
    LOOP
        -- Only add if not already in publication
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND tablename = table_name
        ) THEN
            EXECUTE format('ALTER publication supabase_realtime ADD TABLE public.%I', table_name);
            RAISE NOTICE 'Added table % to realtime publication', table_name;
        ELSE
            RAISE NOTICE 'Table % already in realtime publication', table_name;
        END IF;
    END LOOP;
END $$;

-- 2. Ensure user_presence has proper RLS policies
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to recreate them
DROP POLICY IF EXISTS "Users can view all presence records" ON public.user_presence;
DROP POLICY IF EXISTS "Users can update their own presence" ON public.user_presence;
DROP POLICY IF EXISTS "Users can insert their own presence" ON public.user_presence;
DROP POLICY IF EXISTS "Users can delete their own presence" ON public.user_presence;

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

-- 3. Optimize real-time performance with indexes (if not exists)
CREATE INDEX IF NOT EXISTS idx_user_presence_user_id ON public.user_presence(user_id);
CREATE INDEX IF NOT EXISTS idx_user_presence_updated_at ON public.user_presence(updated_at);
CREATE INDEX IF NOT EXISTS idx_collaboration_messages_space_id ON public.collaboration_messages(space_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_messages_created_at ON public.collaboration_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_type_id ON public.activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_read ON public.notifications(user_id, is_read);

-- 4. Update system settings for real-time
INSERT INTO public.system_settings (setting_key, setting_value, category, description)
VALUES 
  ('realtime_enabled', 'true', 'performance', 'Enable real-time features'),
  ('realtime_max_connections', '1000', 'performance', 'Maximum real-time connections'),
  ('realtime_heartbeat_interval', '30', 'performance', 'Real-time heartbeat interval in seconds')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();