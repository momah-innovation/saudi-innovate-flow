-- Create database functions for opportunity analytics

-- Function to increment opportunity views
CREATE OR REPLACE FUNCTION public.increment_opportunity_views(p_opportunity_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.opportunity_analytics 
  SET 
    view_count = view_count + 1,
    last_updated = NOW()
  WHERE opportunity_id = p_opportunity_id;
  
  -- Insert if record doesn't exist
  INSERT INTO public.opportunity_analytics (
    opportunity_id, view_count, like_count, application_count, last_updated
  ) 
  SELECT p_opportunity_id, 1, 0, 0, NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM public.opportunity_analytics WHERE opportunity_id = p_opportunity_id
  );
END;
$$;

-- Function to refresh all analytics for an opportunity
CREATE OR REPLACE FUNCTION public.refresh_opportunity_analytics(p_opportunity_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  likes_count INTEGER;
  apps_count INTEGER;
  shares_count INTEGER;
BEGIN
  -- Count likes
  SELECT COUNT(*) INTO likes_count
  FROM public.opportunity_likes
  WHERE opportunity_id = p_opportunity_id;
  
  -- Count applications
  SELECT COUNT(*) INTO apps_count
  FROM public.opportunity_applications
  WHERE opportunity_id = p_opportunity_id;
  
  -- Count shares (if table exists)
  SELECT COALESCE(COUNT(*), 0) INTO shares_count
  FROM public.opportunity_shares
  WHERE opportunity_id = p_opportunity_id;
  
  -- Update analytics
  UPDATE public.opportunity_analytics 
  SET 
    like_count = likes_count,
    application_count = apps_count,
    share_count = shares_count,
    last_updated = NOW()
  WHERE opportunity_id = p_opportunity_id;
  
  -- Insert if record doesn't exist
  INSERT INTO public.opportunity_analytics (
    opportunity_id, view_count, like_count, application_count, share_count, last_updated
  ) 
  SELECT p_opportunity_id, 0, likes_count, apps_count, shares_count, NOW()
  WHERE NOT EXISTS (
    SELECT 1 FROM public.opportunity_analytics WHERE opportunity_id = p_opportunity_id
  );
END;
$$;

-- Function to get opportunity analytics summary
CREATE OR REPLACE FUNCTION public.get_opportunity_analytics_summary(p_opportunity_id uuid)
RETURNS TABLE(
  total_views INTEGER,
  total_likes INTEGER,
  total_applications INTEGER,
  total_shares INTEGER,
  engagement_rate DECIMAL,
  conversion_rate DECIMAL
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  analytics_record RECORD;
BEGIN
  SELECT 
    COALESCE(view_count, 0) as views,
    COALESCE(like_count, 0) as likes,
    COALESCE(application_count, 0) as applications,
    COALESCE(share_count, 0) as shares
  INTO analytics_record
  FROM public.opportunity_analytics
  WHERE opportunity_id = p_opportunity_id;
  
  total_views := COALESCE(analytics_record.views, 0);
  total_likes := COALESCE(analytics_record.likes, 0);
  total_applications := COALESCE(analytics_record.applications, 0);
  total_shares := COALESCE(analytics_record.shares, 0);
  
  -- Calculate engagement rate (likes + shares / views)
  IF total_views > 0 THEN
    engagement_rate := ((total_likes + total_shares)::DECIMAL / total_views::DECIMAL) * 100;
  ELSE
    engagement_rate := 0;
  END IF;
  
  -- Calculate conversion rate (applications / views)
  IF total_views > 0 THEN
    conversion_rate := (total_applications::DECIMAL / total_views::DECIMAL) * 100;
  ELSE
    conversion_rate := 0;
  END IF;
  
  RETURN NEXT;
END;
$$;