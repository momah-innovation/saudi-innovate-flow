-- Fix Dashboard Data Issues - Populate Missing User Activity Summaries
-- This migration ensures all users have activity summary records and dashboard data is accessible

-- 1. Populate user_activity_summary for all existing users
INSERT INTO public.user_activity_summary (
  user_id, 
  total_submissions, 
  total_participations, 
  total_bookmarks, 
  total_likes, 
  engagement_score,
  last_activity_at,
  updated_at
)
SELECT 
  p.id as user_id,
  0 as total_submissions,
  0 as total_participations, 
  0 as total_bookmarks,
  0 as total_likes,
  0 as engagement_score,
  NOW() as last_activity_at,
  NOW() as updated_at
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_activity_summary uas 
  WHERE uas.user_id = p.id
);

-- 2. Update activity summaries with actual data for users who have activities
DO $$
DECLARE
  user_record RECORD;
  submission_count INTEGER;
  participation_count INTEGER; 
  bookmark_count INTEGER;
  like_count INTEGER;
  calculated_score NUMERIC;
BEGIN
  FOR user_record IN SELECT id FROM public.profiles LOOP
    -- Calculate actual metrics
    SELECT COUNT(*) INTO submission_count 
    FROM public.challenge_submissions 
    WHERE submitted_by = user_record.id;
    
    SELECT COUNT(*) INTO participation_count 
    FROM public.challenge_participants 
    WHERE user_id = user_record.id;
    
    SELECT COUNT(*) INTO bookmark_count 
    FROM public.challenge_bookmarks 
    WHERE user_id = user_record.id;
    
    SELECT COUNT(*) INTO like_count 
    FROM public.challenge_likes 
    WHERE user_id = user_record.id;
    
    -- Calculate engagement score
    calculated_score := (
      (submission_count * 10) + 
      (participation_count * 5) + 
      (bookmark_count * 2) + 
      (like_count * 1)
    );
    
    -- Update the summary
    UPDATE public.user_activity_summary 
    SET 
      total_submissions = submission_count,
      total_participations = participation_count,
      total_bookmarks = bookmark_count,
      total_likes = like_count,
      engagement_score = calculated_score,
      updated_at = NOW()
    WHERE user_id = user_record.id;
  END LOOP;
END $$;

-- 3. Create trigger to automatically update activity summary when users perform actions
CREATE OR REPLACE FUNCTION public.auto_update_user_activity_summary()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Determine which user_id to update based on the table
  IF TG_TABLE_NAME = 'challenge_submissions' THEN
    target_user_id := COALESCE(NEW.submitted_by, OLD.submitted_by);
  ELSIF TG_TABLE_NAME = 'challenge_participants' THEN
    target_user_id := COALESCE(NEW.user_id, OLD.user_id);
  ELSIF TG_TABLE_NAME = 'challenge_bookmarks' THEN
    target_user_id := COALESCE(NEW.user_id, OLD.user_id);
  ELSIF TG_TABLE_NAME = 'challenge_likes' THEN
    target_user_id := COALESCE(NEW.user_id, OLD.user_id);
  ELSE
    RETURN COALESCE(NEW, OLD);
  END IF;
  
  -- Update the activity summary for this user
  IF target_user_id IS NOT NULL THEN
    PERFORM public.update_user_activity_summary(target_user_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 4. Create triggers on relevant tables
DROP TRIGGER IF EXISTS trigger_update_activity_summary_submissions ON public.challenge_submissions;
CREATE TRIGGER trigger_update_activity_summary_submissions
  AFTER INSERT OR UPDATE OR DELETE ON public.challenge_submissions
  FOR EACH ROW EXECUTE FUNCTION public.auto_update_user_activity_summary();

DROP TRIGGER IF EXISTS trigger_update_activity_summary_participants ON public.challenge_participants;
CREATE TRIGGER trigger_update_activity_summary_participants
  AFTER INSERT OR UPDATE OR DELETE ON public.challenge_participants
  FOR EACH ROW EXECUTE FUNCTION public.auto_update_user_activity_summary();

DROP TRIGGER IF EXISTS trigger_update_activity_summary_bookmarks ON public.challenge_bookmarks;
CREATE TRIGGER trigger_update_activity_summary_bookmarks
  AFTER INSERT OR UPDATE OR DELETE ON public.challenge_bookmarks
  FOR EACH ROW EXECUTE FUNCTION public.auto_update_user_activity_summary();

DROP TRIGGER IF EXISTS trigger_update_activity_summary_likes ON public.challenge_likes;
CREATE TRIGGER trigger_update_activity_summary_likes
  AFTER INSERT OR UPDATE OR DELETE ON public.challenge_likes
  FOR EACH ROW EXECUTE FUNCTION public.auto_update_user_activity_summary();

-- 5. Create a trigger to initialize activity summary for new users
CREATE OR REPLACE FUNCTION public.init_user_activity_summary()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.user_activity_summary (
    user_id,
    total_submissions,
    total_participations, 
    total_bookmarks,
    total_likes,
    engagement_score,
    last_activity_at,
    updated_at
  ) VALUES (
    NEW.id,
    0,
    0,
    0,
    0,
    0,
    NOW(),
    NOW()
  ) ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_init_user_activity_summary ON public.profiles;
CREATE TRIGGER trigger_init_user_activity_summary
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.init_user_activity_summary();

-- 6. Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.auto_update_user_activity_summary() TO authenticated;
GRANT EXECUTE ON FUNCTION public.init_user_activity_summary() TO authenticated;

-- Notification: Dashboard loading issues have been fixed by populating user activity data;