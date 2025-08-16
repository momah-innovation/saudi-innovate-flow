/**
 * Partner Dashboard Data Hook
 * Handles loading partnership data for partner dashboard
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { debugLog } from '@/utils/debugLogger';

interface ChallengePartnership {
  id: string;
  challenge_id: string;
  partner_id: string;
  partnership_type: string;
  status: string;
  funding_amount?: number;
  challenges?: {
    title_ar: string;
    status: string;
  };
}

interface CampaignPartnership {
  id: string;
  campaign_id: string;
  partner_id: string;
  partnership_role: string;
  partnership_status: string;
  contribution_amount?: number;
  campaigns?: {
    title_ar: string;
    status: string;
  };
}

export const usePartnerDashboardData = () => {
  const [loading, setLoading] = useState(false);
  const [challengePartnerships, setChallengePartnerships] = useState<ChallengePartnership[]>([]);
  const [campaignPartnerships, setCampaignPartnerships] = useState<CampaignPartnership[]>([]);

  // Load partnership data for a partner
  const loadPartnershipData = useCallback(async (partnerId: string) => {
    if (!partnerId) {
      debugLog.warn('No partner ID provided');
      return { challengePartnerships: [], campaignPartnerships: [] };
    }

    setLoading(true);
    try {
      const [challengePartnershipsResponse, campaignPartnershipsResponse] = await Promise.all([
        supabase
          .from('challenge_partners')
          .select(`
            *,
            challenges(title_ar, status)
          `)
          .eq('partner_id', partnerId),
        supabase
          .from('campaign_partners')
          .select(`
            *,
            campaigns(title_ar, status)
          `)
          .eq('partner_id', partnerId)
      ]);

      if (challengePartnershipsResponse.error) throw challengePartnershipsResponse.error;
      if (campaignPartnershipsResponse.error) throw campaignPartnershipsResponse.error;

      const challengeData = challengePartnershipsResponse.data || [];
      const campaignData = campaignPartnershipsResponse.data || [];

      setChallengePartnerships(challengeData);
      setCampaignPartnerships(campaignData);

      debugLog.debug('Loaded partnership data', {
        partnerId,
        challengePartnerships: challengeData.length,
        campaignPartnerships: campaignData.length
      });

      return {
        challengePartnerships: challengeData,
        campaignPartnerships: campaignData
      };
    } catch (err) {
      debugLog.error('Failed to load partnership data', { partnerId, error: err });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get active partnerships count
  const getActivePartnershipsCount = useCallback(() => {
    const activeChallenges = challengePartnerships.filter(p => p.status === 'active').length;
    const activeCampaigns = campaignPartnerships.filter(p => p.partnership_status === 'active').length;
    return activeChallenges + activeCampaigns;
  }, [challengePartnerships, campaignPartnerships]);

  return {
    loading,
    challengePartnerships,
    campaignPartnerships,
    loadPartnershipData,
    getActivePartnershipsCount
  };
};