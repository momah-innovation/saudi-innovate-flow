-- Enable real-time for event-related tables
ALTER TABLE public.event_participants REPLICA IDENTITY FULL;
ALTER TABLE public.event_likes REPLICA IDENTITY FULL;
ALTER TABLE public.event_bookmarks REPLICA IDENTITY FULL;
ALTER TABLE public.events REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_bookmarks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;