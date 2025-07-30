-- Fix the security warning by securing the get_event_stats function
CREATE OR REPLACE FUNCTION get_event_stats(event_uuid UUID)
RETURNS JSON 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  participants_count INTEGER;
  likes_count INTEGER;
  bookmarks_count INTEGER;
  feedback_count INTEGER;
  avg_rating DECIMAL;
BEGIN
  -- Get participants count
  SELECT COUNT(*) INTO participants_count
  FROM public.event_participants
  WHERE event_id = event_uuid;
  
  -- Get likes count
  SELECT COUNT(*) INTO likes_count
  FROM public.event_likes
  WHERE event_id = event_uuid;
  
  -- Get bookmarks count
  SELECT COUNT(*) INTO bookmarks_count
  FROM public.event_bookmarks
  WHERE event_id = event_uuid;
  
  -- Get feedback count and average rating
  SELECT COUNT(*), AVG(rating) INTO feedback_count, avg_rating
  FROM public.event_feedback
  WHERE event_id = event_uuid;
  
  RETURN json_build_object(
    'participants_count', participants_count,
    'likes_count', likes_count,
    'bookmarks_count', bookmarks_count,
    'feedback_count', feedback_count,
    'average_rating', COALESCE(avg_rating, 0)
  );
END;
$$;

-- Fix the trigger function search path
CREATE OR REPLACE FUNCTION update_event_resources_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;