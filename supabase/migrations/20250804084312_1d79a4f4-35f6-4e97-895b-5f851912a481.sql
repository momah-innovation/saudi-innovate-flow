-- Create subscription management views and functions for improved performance
CREATE OR REPLACE VIEW user_subscription_overview AS
SELECT 
  us.id,
  us.user_id,
  us.plan_id,
  sp.name_ar,
  sp.name_en,
  sp.price,
  sp.currency,
  sp.billing_interval,
  sp.features,
  us.status,
  us.current_period_start,
  us.current_period_end,
  us.trial_end,
  us.usage_limits,
  us.created_at,
  us.updated_at
FROM user_subscriptions us
JOIN subscription_plans sp ON us.plan_id = sp.id;

-- Create organization subscription view
CREATE OR REPLACE VIEW org_subscription_overview AS
SELECT 
  os.id,
  os.organization_id,
  os.plan_id,
  sp.name_ar,
  sp.name_en,
  sp.price,
  sp.currency,
  sp.billing_interval,
  sp.features,
  os.status,
  os.current_period_start,
  os.current_period_end,
  os.trial_end,
  os.max_users,
  os.max_projects,
  os.usage_tracking,
  os.created_at,
  os.updated_at
FROM org_subscriptions os
JOIN subscription_plans sp ON os.plan_id = sp.id;

-- Create function to check user subscription features
CREATE OR REPLACE FUNCTION user_has_feature(p_user_id UUID, p_feature_key TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  has_feature BOOLEAN := false;
  user_sub RECORD;
BEGIN
  -- Get active user subscription
  SELECT * INTO user_sub
  FROM user_subscription_overview
  WHERE user_id = p_user_id
    AND status = 'active'
    AND (current_period_end IS NULL OR current_period_end > NOW())
  LIMIT 1;
  
  -- If no subscription, check for trial or free plan
  IF user_sub.id IS NULL THEN
    SELECT * INTO user_sub
    FROM user_subscription_overview
    WHERE user_id = p_user_id
      AND status IN ('trialing', 'active')
      AND (trial_end IS NULL OR trial_end > NOW())
    LIMIT 1;
  END IF;
  
  -- Check if feature exists in subscription features
  IF user_sub.features IS NOT NULL THEN
    has_feature := (user_sub.features ? p_feature_key);
  END IF;
  
  RETURN has_feature;
END;
$$;

-- Create function to get user usage limits
CREATE OR REPLACE FUNCTION get_user_usage_limits(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  limits JSONB := '{}';
  user_sub RECORD;
BEGIN
  -- Get active user subscription
  SELECT * INTO user_sub
  FROM user_subscription_overview
  WHERE user_id = p_user_id
    AND status = 'active'
    AND (current_period_end IS NULL OR current_period_end > NOW())
  LIMIT 1;
  
  IF user_sub.usage_limits IS NOT NULL THEN
    limits := user_sub.usage_limits;
  ELSE
    -- Default limits for free tier
    limits := jsonb_build_object(
      'ideas_per_month', 5,
      'challenges_per_month', 3,
      'events_per_month', 2,
      'file_uploads_mb', 100,
      'ai_requests_per_month', 10
    );
  END IF;
  
  RETURN limits;
END;
$$;

-- Create function to track usage
CREATE OR REPLACE FUNCTION track_user_usage(p_user_id UUID, p_action TEXT, p_amount INTEGER DEFAULT 1)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  current_month TEXT;
  usage_record RECORD;
BEGIN
  current_month := TO_CHAR(NOW(), 'YYYY-MM');
  
  -- Insert or update usage tracking
  INSERT INTO user_usage_tracking (
    user_id,
    period_month,
    action_type,
    usage_count,
    last_updated
  ) VALUES (
    p_user_id,
    current_month,
    p_action,
    p_amount,
    NOW()
  )
  ON CONFLICT (user_id, period_month, action_type) 
  DO UPDATE SET
    usage_count = user_usage_tracking.usage_count + p_amount,
    last_updated = NOW();
END;
$$;

-- Add RLS policies for subscription views
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_subscriptions ENABLE ROW LEVEL SECURITY;

-- User subscriptions policies
CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own subscriptions" ON user_subscriptions
  FOR ALL USING (user_id = auth.uid());

-- Organization subscriptions policies  
CREATE POLICY "Org admins can manage org subscriptions" ON org_subscriptions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = org_subscriptions.organization_id
        AND om.user_id = auth.uid()
        AND om.role IN ('admin', 'owner')
    )
  );

-- Grant permissions
GRANT SELECT ON user_subscription_overview TO authenticated;
GRANT SELECT ON org_subscription_overview TO authenticated;