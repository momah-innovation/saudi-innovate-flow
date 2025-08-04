-- Create fixed subscription views using correct column names
CREATE OR REPLACE VIEW user_subscription_overview AS
SELECT 
  us.id,
  us.user_id,
  us.plan_id,
  sp.name_ar,
  sp.name as name_en,
  sp.price_monthly,
  sp.price_yearly,
  sp.currency,
  sp.features,
  us.status,
  us.current_period_start,
  us.current_period_end,
  us.trial_end,
  us.usage_metrics,
  us.created_at,
  us.updated_at
FROM user_subscriptions us
JOIN subscription_plans sp ON us.plan_id = sp.id;

-- Create the fixed subscription status function
CREATE OR REPLACE FUNCTION get_user_subscription_status(p_user_id UUID)
RETURNS TABLE(
  has_subscription BOOLEAN,
  plan_name_ar TEXT,
  plan_name_en TEXT,
  status TEXT,
  trial_end TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  features JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE WHEN uso.id IS NOT NULL THEN true ELSE false END as has_subscription,
    uso.name_ar,
    uso.name_en,
    uso.status,
    uso.trial_end,
    uso.current_period_end,
    uso.features
  FROM user_subscription_overview uso
  WHERE uso.user_id = p_user_id
    AND uso.status IN ('active', 'trialing')
    AND (uso.current_period_end IS NULL OR uso.current_period_end > NOW())
  LIMIT 1;
  
  -- If no active subscription found, return defaults
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT 
      false as has_subscription,
      'خطة مجانية' as plan_name_ar,
      'Free Plan' as plan_name_en,
      'inactive' as status,
      NULL::TIMESTAMP WITH TIME ZONE as trial_end,
      NULL::TIMESTAMP WITH TIME ZONE as current_period_end,
      '{"ideas_per_month": 5, "challenges_per_month": 3, "events_per_month": 2, "file_uploads_mb": 100, "ai_requests_per_month": 10}'::JSONB as features;
  END IF;
END;
$$;