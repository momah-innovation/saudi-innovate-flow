-- Check if realtime publication exists and add tables
DO $$ 
BEGIN
    -- Check if publication exists
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
    
    -- Add tables to publication (using IF NOT EXISTS equivalent)
    PERFORM pg_get_publication_tables('supabase_realtime');
    
    -- Force add tables
    ALTER PUBLICATION supabase_realtime ADD TABLE public.event_participants;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.event_likes;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.event_bookmarks;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
    
EXCEPTION 
    WHEN duplicate_object THEN
        -- Tables already added, continue
        NULL;
END $$;

-- Verify tables are added
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
AND tablename LIKE 'event%';