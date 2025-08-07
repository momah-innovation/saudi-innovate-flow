import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/utils/logger';
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
  features: Record<string, unknown>;
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

      // Use Paddle edge function to check subscription
      const { data, error } = await supabase.functions.invoke('check-paddle-subscription');
      
      if (error) throw error;

      if (data?.has_subscription) {
        setSubscriptionStatus({
          hasSubscription: true,
          planNameAr: data.plan_name || 'خطة مميزة',
          planNameEn: data.plan_name || 'Premium Plan',
          status: data.subscription_status,
          currentPeriodEnd: data.expires_at,
          features: {
            ideas_per_month: 100,
            challenges_per_month: 50,
            events_per_month: 25,
            file_uploads_mb: 1000,
            ai_requests_per_month: 500
          }
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
      logger.error('Error checking subscription', { component: 'useSubscription', action: 'checkSubscription' }, err as Error);
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
      logger.error('Error fetching subscription plans', { component: 'useSubscription', action: 'fetchSubscriptionPlans' }, err as Error);
    }
  };

  const createCheckoutSession = async (planId: string): Promise<string | null> => {
    if (!user) {
      setError('User must be logged in to subscribe');
      return null;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-paddle-checkout', {
        body: { planId }
      });

      if (error) throw error;
      
      // Open checkout in new tab and return URL
      if (data?.checkout_url) {
        window.open(data.checkout_url, '_blank');
        return data.checkout_url;
      }
      return null;
    } catch (err) {
      logger.error('Error creating checkout session', { component: 'useSubscription', action: 'createCheckoutSession', planId }, err as Error);
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
      logger.error('Error cancelling subscription', { component: 'useSubscription', action: 'cancelSubscription' }, err as Error);
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