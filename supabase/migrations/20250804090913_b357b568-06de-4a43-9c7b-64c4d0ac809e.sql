-- Fix subscription views using correct column names
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
  us.usage_limits,
  us.created_at,
  us.updated_at
FROM user_subscriptions us
JOIN subscription_plans sp ON us.plan_id = sp.id;

-- Fix organization subscription view
CREATE OR REPLACE VIEW org_subscription_overview AS
SELECT 
  os.id,
  os.organization_id,
  os.plan_id,
  sp.name_ar,
  sp.name as name_en,
  sp.price_monthly,
  sp.price_yearly,
  sp.currency,
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

-- Create subscription management components and hooks
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

-- Create subscription tracking table
CREATE TABLE IF NOT EXISTS user_subscription_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plan_id UUID,
  action_type TEXT NOT NULL, -- 'subscribed', 'cancelled', 'upgraded', 'downgraded', 'trial_started', 'trial_ended'
  old_status TEXT,
  new_status TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_subscription_history ENABLE ROW LEVEL SECURITY;

-- RLS Policy for subscription history
CREATE POLICY "Users can view their subscription history" ON user_subscription_history
  FOR SELECT USING (user_id = auth.uid());

-- Create trigger to track subscription changes
CREATE OR REPLACE FUNCTION track_subscription_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Track subscription status changes
  IF TG_OP = 'INSERT' THEN
    INSERT INTO user_subscription_history (
      user_id, plan_id, action_type, new_status, metadata
    ) VALUES (
      NEW.user_id, NEW.plan_id, 'subscribed', NEW.status,
      jsonb_build_object('trial_end', NEW.trial_end, 'period_end', NEW.current_period_end)
    );
  ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO user_subscription_history (
      user_id, plan_id, action_type, old_status, new_status, metadata
    ) VALUES (
      NEW.user_id, NEW.plan_id, 
      CASE 
        WHEN NEW.status = 'cancelled' THEN 'cancelled'
        WHEN NEW.status = 'active' AND OLD.status = 'trialing' THEN 'trial_ended'
        ELSE 'status_changed'
      END,
      OLD.status, NEW.status,
      jsonb_build_object('trial_end', NEW.trial_end, 'period_end', NEW.current_period_end)
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS track_user_subscription_changes ON user_subscriptions;
CREATE TRIGGER track_user_subscription_changes
  AFTER INSERT OR UPDATE ON user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION track_subscription_changes();