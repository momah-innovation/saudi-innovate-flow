-- Enable real-time for the publication (ensure it's enabled)
ALTER PUBLICATION supabase_realtime SET (publish = 'insert, update, delete');

-- Grant necessary permissions for real-time
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;

-- Ensure real-time replication is properly configured
ALTER TABLE public.events REPLICA IDENTITY FULL;
ALTER TABLE public.event_participants REPLICA IDENTITY FULL;
ALTER TABLE public.event_likes REPLICA IDENTITY FULL;
ALTER TABLE public.event_bookmarks REPLICA IDENTITY FULL;

-- Create a simple test to verify real-time is working
CREATE OR REPLACE FUNCTION public.test_realtime_config()
RETURNS TABLE(table_name text, replica_identity text, in_publication boolean)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    t.table_name::text,
    CASE 
      WHEN c.relreplident = 'f' THEN 'FULL'
      WHEN c.relreplident = 'd' THEN 'DEFAULT'
      WHEN c.relreplident = 'n' THEN 'NOTHING'
      WHEN c.relreplident = 'i' THEN 'INDEX'
      ELSE 'UNKNOWN'
    END::text as replica_identity,
    (pt.tablename IS NOT NULL)::boolean as in_publication
  FROM information_schema.tables t
  JOIN pg_class c ON c.relname = t.table_name
  LEFT JOIN pg_publication_tables pt ON pt.tablename = t.table_name AND pt.pubname = 'supabase_realtime'
  WHERE t.table_schema = 'public' 
    AND t.table_name IN ('events', 'event_participants', 'event_likes', 'event_bookmarks')
  ORDER BY t.table_name;
$$;