import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { queryBatcher } from '@/utils/queryBatcher';
import { useToast } from '@/hooks/use-toast';
import type { CampaignOptions, SystemSector, Deputy, Department, Challenge, SystemPartner, Stakeholder, Manager } from '@/types/common';

export interface CampaignFormData {
  id?: string;
  title_ar: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  status: string;
  start_date: string;
  end_date: string;
  registration_deadline?: string;
  budget?: number;
  target_participants?: number;
  target_ideas?: number;
  success_metrics?: string;
  theme?: string;
  campaign_manager_id?: string;
  challenge_id?: string;
  department_id?: string;
  deputy_id?: string;
  sector_id?: string;
  sector_ids?: string[];
  deputy_ids?: string[];
  department_ids?: string[];
  challenge_ids?: string[];
  partner_ids?: string[];
  stakeholder_ids?: string[];
}

// CampaignOptions interface is now imported from types/common.ts

export const useCampaignManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<CampaignOptions>({
    sectors: [],
    deputies: [],
    departments: [],
    challenges: [],
    partners: [],
    stakeholders: [],
    managers: []
  });
  const { toast } = useToast();

  const loadCampaignOptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [
        sectorsRes, 
        deputiesRes, 
        departmentsRes, 
        challengesRes, 
        partnersRes, 
        stakeholdersRes, 
        managersRes
      ] = await Promise.all([
        supabase.from('sectors').select('*').order('name_ar'),
        supabase.from('deputies').select('*').order('name_ar'),
        supabase.from('departments').select('*').order('name_ar'),
        supabase.from('challenges').select('*').order('title_ar'),
        supabase.from('partners').select('*').order('name_ar'),
        supabase.from('stakeholders').select('*').order('name_ar'),
        supabase.from('profiles').select('id, name, name_ar, email, position').eq('status', 'active').order('name_ar')
      ]);

      setOptions({
        sectors: sectorsRes.data || [],
        deputies: deputiesRes.data || [],
        departments: departmentsRes.data || [],
        challenges: challengesRes.data || [],
        partners: partnersRes.data || [],
        stakeholders: stakeholdersRes.data || [],
        managers: managersRes.data || []
      });
    } catch (err) {
      const errorMessage = 'Failed to load campaign options';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadCampaignLinks = useCallback(async (campaignId: string) => {
    setLoading(true);
    
    try {
      const [
        sectorLinksRes,
        deputyLinksRes,
        departmentLinksRes,
        challengeLinksRes,
        partnerLinksRes,
        stakeholderLinksRes
      ] = await Promise.all([
        supabase.from('campaign_sector_links').select('sector_id').eq('campaign_id', campaignId),
        supabase.from('campaign_deputy_links').select('deputy_id').eq('campaign_id', campaignId),
        supabase.from('campaign_department_links').select('department_id').eq('campaign_id', campaignId),
        supabase.from('campaign_challenge_links').select('challenge_id').eq('campaign_id', campaignId),
        supabase.from('campaign_partner_links').select('partner_id').eq('campaign_id', campaignId),
        supabase.from('campaign_stakeholder_links').select('stakeholder_id').eq('campaign_id', campaignId)
      ]);

      return {
        sector_ids: sectorLinksRes.data?.map(link => link.sector_id) || [],
        deputy_ids: deputyLinksRes.data?.map(link => link.deputy_id) || [],
        department_ids: departmentLinksRes.data?.map(link => link.department_id) || [],
        challenge_ids: challengeLinksRes.data?.map(link => link.challenge_id) || [],
        partner_ids: partnerLinksRes.data?.map(link => link.partner_id) || [],
        stakeholder_ids: stakeholderLinksRes.data?.map(link => link.stakeholder_id) || []
      };
    } catch (err) {
      const errorMessage = 'Failed to load campaign links';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return {};
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createCampaign = useCallback(async (campaignData: CampaignFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Create main campaign record
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .insert([{
          title_ar: campaignData.title_ar,
          title_en: campaignData.title_en,
          description_ar: campaignData.description_ar,
          description_en: campaignData.description_en,
          status: campaignData.status,
          start_date: campaignData.start_date,
          end_date: campaignData.end_date,
          registration_deadline: campaignData.registration_deadline,
          budget: campaignData.budget,
          target_participants: campaignData.target_participants,
          target_ideas: campaignData.target_ideas,
          success_metrics: campaignData.success_metrics,
          theme: campaignData.theme,
          campaign_manager_id: campaignData.campaign_manager_id,
          challenge_id: campaignData.challenge_id,
          department_id: campaignData.department_id,
          deputy_id: campaignData.deputy_id,
          sector_id: campaignData.sector_id
        }])
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Create links
      await manageCampaignLinks(campaign.id, {
        sector_ids: campaignData.sector_ids || [],
        deputy_ids: campaignData.deputy_ids || [],
        department_ids: campaignData.department_ids || [],
        challenge_ids: campaignData.challenge_ids || [],
        partner_ids: campaignData.partner_ids || [],
        stakeholder_ids: campaignData.stakeholder_ids || []
      });

      toast({
        title: 'Success',
        description: 'Campaign created successfully'
      });

      return campaign;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create campaign';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateCampaign = useCallback(async (campaignId: string, updates: Partial<CampaignFormData>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Update main campaign record
      const { error: updateError } = await supabase
        .from('campaigns')
        .update({
          title_ar: updates.title_ar,
          title_en: updates.title_en,
          description_ar: updates.description_ar,
          description_en: updates.description_en,
          status: updates.status,
          start_date: updates.start_date,
          end_date: updates.end_date,
          registration_deadline: updates.registration_deadline,
          budget: updates.budget,
          target_participants: updates.target_participants,
          target_ideas: updates.target_ideas,
          success_metrics: updates.success_metrics,
          theme: updates.theme,
          campaign_manager_id: updates.campaign_manager_id,
          challenge_id: updates.challenge_id,
          department_id: updates.department_id,
          deputy_id: updates.deputy_id,
          sector_id: updates.sector_id
        })
        .eq('id', campaignId);

      if (updateError) throw updateError;

      // Update links if provided
      if (updates.sector_ids || updates.deputy_ids || updates.department_ids || 
          updates.challenge_ids || updates.partner_ids || updates.stakeholder_ids) {
        await manageCampaignLinks(campaignId, {
          sector_ids: updates.sector_ids || [],
          deputy_ids: updates.deputy_ids || [],
          department_ids: updates.department_ids || [],
          challenge_ids: updates.challenge_ids || [],
          partner_ids: updates.partner_ids || [],
          stakeholder_ids: updates.stakeholder_ids || []
        });
      }

      toast({
        title: 'Success',
        description: 'Campaign updated successfully'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update campaign';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const manageCampaignLinks = useCallback(async (campaignId: string, links: {
    sector_ids: string[];
    deputy_ids: string[];
    department_ids: string[];
    challenge_ids: string[];
    partner_ids: string[];
    stakeholder_ids: string[];
  }) => {
    try {
      // Delete existing links
      await Promise.all([
        supabase.from('campaign_sector_links').delete().eq('campaign_id', campaignId),
        supabase.from('campaign_deputy_links').delete().eq('campaign_id', campaignId),
        supabase.from('campaign_department_links').delete().eq('campaign_id', campaignId),
        supabase.from('campaign_challenge_links').delete().eq('campaign_id', campaignId),
        supabase.from('campaign_partner_links').delete().eq('campaign_id', campaignId),
        supabase.from('campaign_stakeholder_links').delete().eq('campaign_id', campaignId)
      ]);

      // Create new links
      const linkPromises = [];

      if (links.sector_ids.length > 0) {
        linkPromises.push(
          supabase.from('campaign_sector_links').insert(
            links.sector_ids.map(id => ({ campaign_id: campaignId, sector_id: id }))
          )
        );
      }

      if (links.deputy_ids.length > 0) {
        linkPromises.push(
          supabase.from('campaign_deputy_links').insert(
            links.deputy_ids.map(id => ({ campaign_id: campaignId, deputy_id: id }))
          )
        );
      }

      if (links.department_ids.length > 0) {
        linkPromises.push(
          supabase.from('campaign_department_links').insert(
            links.department_ids.map(id => ({ campaign_id: campaignId, department_id: id }))
          )
        );
      }

      if (links.challenge_ids.length > 0) {
        linkPromises.push(
          supabase.from('campaign_challenge_links').insert(
            links.challenge_ids.map(id => ({ campaign_id: campaignId, challenge_id: id }))
          )
        );
      }

      if (links.partner_ids.length > 0) {
        linkPromises.push(
          supabase.from('campaign_partner_links').insert(
            links.partner_ids.map(id => ({ campaign_id: campaignId, partner_id: id }))
          )
        );
      }

      if (links.stakeholder_ids.length > 0) {
        linkPromises.push(
          supabase.from('campaign_stakeholder_links').insert(
            links.stakeholder_ids.map(id => ({ campaign_id: campaignId, stakeholder_id: id }))
          )
        );
      }

      await Promise.all(linkPromises);
    } catch (err) {
      throw new Error('Failed to manage campaign links');
    }
  }, []);

  const deleteCampaign = useCallback(async (campaignId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Delete links first (cascade)
      await Promise.all([
        supabase.from('campaign_sector_links').delete().eq('campaign_id', campaignId),
        supabase.from('campaign_deputy_links').delete().eq('campaign_id', campaignId),
        supabase.from('campaign_department_links').delete().eq('campaign_id', campaignId),
        supabase.from('campaign_challenge_links').delete().eq('campaign_id', campaignId),
        supabase.from('campaign_partner_links').delete().eq('campaign_id', campaignId),
        supabase.from('campaign_stakeholder_links').delete().eq('campaign_id', campaignId)
      ]);

      // Delete main campaign
      const { error: deleteError } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId);

      if (deleteError) throw deleteError;

      toast({
        title: 'Success',
        description: 'Campaign deleted successfully'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete campaign';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    // State
    loading,
    error,
    options,
    
    // Methods
    loadCampaignOptions,
    loadCampaignLinks,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    manageCampaignLinks
  };
};