import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

type SubscriptionPlan = Database['public']['Tables']['subscription_plans']['Row'];
type UserSubscription = Database['public']['Tables']['user_subscriptions']['Row'];

interface SubscriptionStatus {
  hasSubscription: boolean;
  planNameAr: string;
  planNameEn: string;
  status: string;
  trialEnd?: string;
  currentPeriodEnd?: string;
  features: any;
}

interface UseSubscriptionResult {
  subscriptionStatus: SubscriptionStatus | null;
  loading: boolean;
  error: string | null;
  checkSubscription: () => Promise<void>;
  subscriptionPlans: SubscriptionPlan[];
  createCheckoutSession: (planId: string) => Promise<string | null>;
  cancelSubscription: () => Promise<boolean>;
  refreshSubscription: () => Promise<void>;
}

export const useSubscription = (): UseSubscriptionResult => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const checkSubscription = async () => {
    if (!user) {
      setSubscriptionStatus({
        hasSubscription: false,
        planNameAr: 'خطة مجانية',
        planNameEn: 'Free Plan',
        status: 'inactive',
        features: {
          ideas_per_month: 5,
          challenges_per_month: 3,
          events_per_month: 2,
          file_uploads_mb: 100,
          ai_requests_per_month: 10
        }
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Direct query instead of RPC for now
      const { data: userSubscriptions, error: subError } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (
            name,
            name_ar,
            features
          )
        `)
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .maybeSingle();

      if (subError) throw subError;

      if (userSubscriptions) {
        const plan = userSubscriptions.subscription_plans as any;
        setSubscriptionStatus({
          hasSubscription: true,
          planNameAr: plan?.name_ar || 'خطة مميزة',
          planNameEn: plan?.name || 'Premium Plan',
          status: userSubscriptions.status,
          trialEnd: userSubscriptions.trial_end,
          currentPeriodEnd: userSubscriptions.current_period_end,
          features: plan?.features || {}
        });
      } else {
        setSubscriptionStatus({
          hasSubscription: false,
          planNameAr: 'خطة مجانية',
          planNameEn: 'Free Plan',
          status: 'inactive',
          features: {
            ideas_per_month: 5,
            challenges_per_month: 3,
            events_per_month: 2,
            file_uploads_mb: 100,
            ai_requests_per_month: 10
          }
        });
      }
    } catch (err) {
      console.error('Error checking subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to check subscription');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .eq('is_public', true)
        .order('price_monthly', { ascending: true });

      if (error) throw error;
      setSubscriptionPlans(data || []);
    } catch (err) {
      console.error('Error fetching subscription plans:', err);
    }
  };

  const createCheckoutSession = async (planId: string): Promise<string | null> => {
    if (!user) {
      setError('User must be logged in to subscribe');
      return null;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planId }
      });

      if (error) throw error;
      return data.url;
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError(err instanceof Error ? err.message : 'Failed to create checkout session');
      return null;
    }
  };

  const cancelSubscription = async (): Promise<boolean> => {
    if (!user) {
      setError('User must be logged in to cancel subscription');
      return false;
    }

    try {
      const { data, error } = await supabase.functions.invoke('cancel-subscription');

      if (error) throw error;
      
      // Refresh subscription status after cancellation
      await checkSubscription();
      return true;
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
      return false;
    }
  };

  const refreshSubscription = async () => {
    await checkSubscription();
  };

  useEffect(() => {
    if (user) {
      Promise.all([checkSubscription(), fetchSubscriptionPlans()]);
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    subscriptionStatus,
    loading,
    error,
    checkSubscription,
    subscriptionPlans,
    createCheckoutSession,
    cancelSubscription,
    refreshSubscription
  };
};