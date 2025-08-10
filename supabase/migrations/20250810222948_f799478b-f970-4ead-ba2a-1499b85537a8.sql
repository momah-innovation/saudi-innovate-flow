-- Fix Real-time Features with Correct Table Names
-- Add missing tables to realtime publication

DO $$
DECLARE
    table_name text;
    missing_tables text[] := ARRAY[
        'activity_events',
        'system_translations',
        'notifications'
    ];
BEGIN
    FOREACH table_name IN ARRAY missing_tables
    LOOP
        -- Only add if table exists and not already in publication
        IF EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = missing_tables[array_position(missing_tables, table_name)]
        ) AND NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND tablename = table_name
        ) THEN
            EXECUTE format('ALTER publication supabase_realtime ADD TABLE public.%I', table_name);
            RAISE NOTICE 'Added table % to realtime publication', table_name;
        ELSE
            RAISE NOTICE 'Table % already in realtime publication or does not exist', table_name;
        END IF;
    END LOOP;
END $$;

-- 2. Optimize existing real-time performance with additional indexes
CREATE INDEX IF NOT EXISTS idx_activity_events_user_id ON public.activity_events(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_events_entity_type_id ON public.activity_events(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_events_created_at ON public.activity_events(created_at);

-- Add missing notification indexes if notifications table exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications' AND table_schema = 'public') THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_notifications_user_id_read ON public.notifications(user_id, is_read)';
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at)';
    END IF;
END $$;

-- 3. Update system settings for enhanced real-time performance
INSERT INTO public.system_settings (setting_key, setting_value, category, description)
VALUES 
  ('realtime_presence_enabled', 'true', 'collaboration', 'Enable user presence tracking'),
  ('realtime_collaboration_enabled', 'true', 'collaboration', 'Enable real-time collaboration features'),
  ('realtime_live_edits_enabled', 'true', 'collaboration', 'Enable live editing features')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();