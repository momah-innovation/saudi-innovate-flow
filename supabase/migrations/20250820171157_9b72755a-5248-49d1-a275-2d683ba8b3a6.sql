-- Ensure current user has activity summary record
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
  auth.uid(),
  0,
  0,
  0,
  0,
  0,
  NOW(),
  NOW()
WHERE auth.uid() IS NOT NULL
ON CONFLICT (user_id) DO UPDATE SET
  updated_at = NOW();

-- Also populate activity summary for any users who might have been missed
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
  id,
  0,
  0,
  0,
  0,
  0,
  NOW(),
  NOW()
FROM public.profiles
WHERE id NOT IN (SELECT user_id FROM public.user_activity_summary)
ON CONFLICT (user_id) DO NOTHING;