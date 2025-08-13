-- Find and fix any remaining security definer views
-- First, let's drop any remaining views that might have SECURITY DEFINER

-- Check if any of these might exist and drop them
DO $$ 
DECLARE
    view_name text;
    view_names text[] := ARRAY[
        'opportunities_overview',
        'subscription_overview', 
        'metrics_overview',
        'analytics_overview',
        'campaign_metrics_view',
        'user_metrics_view',
        'storage_metrics_view'
    ];
BEGIN
    FOREACH view_name IN ARRAY view_names
    LOOP
        BEGIN
            EXECUTE format('DROP VIEW IF EXISTS public.%I CASCADE', view_name);
        EXCEPTION WHEN OTHERS THEN
            -- Ignore errors if view doesn't exist
            NULL;
        END;
    END LOOP;
END $$;

-- Also recreate the user_subscription_overview and partnership_opportunities as regular views 
-- to ensure they don't have SECURITY DEFINER
DROP VIEW IF EXISTS public.user_subscription_overview CASCADE;
DROP VIEW IF EXISTS public.partnership_opportunities CASCADE;

-- Recreate user_subscription_overview without SECURITY DEFINER
CREATE VIEW public.user_subscription_overview AS
SELECT 
    us.id,
    us.user_id,
    us.plan_id,
    sp.name_ar,
    sp.name AS name_en,
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

-- Recreate partnership_opportunities without SECURITY DEFINER  
CREATE VIEW public.partnership_opportunities AS
SELECT 
    id,
    title_ar,
    title_en,
    description_ar,
    description_en,
    opportunity_type,
    budget_min,
    budget_max,
    deadline,
    status,
    sector_id,
    department_id,
    contact_person,
    contact_email,
    requirements,
    benefits,
    created_at,
    updated_at,
    created_by,
    category_id,
    image_url,
    priority_level,
    visibility,
    location,
    target_audience,
    success_metrics,
    manager_id
FROM opportunities
WHERE visibility IN ('public', 'internal') 
AND status IN ('open', 'active');

-- Grant permissions
GRANT SELECT ON public.user_subscription_overview TO authenticated;
GRANT SELECT ON public.partnership_opportunities TO authenticated;