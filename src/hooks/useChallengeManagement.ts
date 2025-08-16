import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { queryBatcher } from '@/utils/queryBatcher';
import { useToast } from '@/hooks/use-toast';

export interface ChallengeFormData {
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  status: string;
  priority_level: string;
  sensitivity_level: string;
  challenge_type: string;
  start_date: string;
  end_date: string;
  estimated_budget: number;
  actual_budget?: number;
  vision_2030_goal?: string;
  kpi_alignment?: string;
  collaboration_details?: string;
  internal_team_notes?: string;
  department_id?: string;
  deputy_id?: string;
  sector_id?: string;
  domain_id?: string;
  sub_domain_id?: string;
  service_id?: string;
  expert_ids?: string[];
  partner_ids?: string[];
}

export interface ChallengeOptions {
  departments: any[];
  deputies: any[];
  sectors: any[];
  domains: any[];
  subDomains: any[];
  services: any[];
  partners: any[];
  experts: any[];
}

export const useChallengeManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<ChallengeOptions>({
    departments: [],
    deputies: [],
    sectors: [],
    domains: [],
    subDomains: [],
    services: [],
    partners: [],
    experts: []
  });
  const { toast } = useToast();

  const loadChallengeOptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [
        departmentsRes,
        deputiesRes,
        sectorsRes,
        domainsRes,
        subDomainsRes,
        servicesRes,
        partnersRes,
        expertsRes
      ] = await Promise.all([
        supabase.from('departments').select('*').order('name_ar'),
        supabase.from('deputies').select('*').order('name_ar'),
        supabase.from('sectors').select('*').order('name_ar'),
        supabase.from('domains').select('*').order('name_ar'),
        supabase.from('sub_domains').select('*').order('name_ar'),
        supabase.from('services').select('*').order('name_ar'),
        supabase.from('partners').select('*').order('name_ar'),
        supabase.from('experts').select('id, user_id, expertise_areas').order('created_at')
      ]);

      setOptions({
        departments: departmentsRes.data || [],
        deputies: deputiesRes.data || [],
        sectors: sectorsRes.data || [],
        domains: domainsRes.data || [],
        subDomains: subDomainsRes.data || [],
        services: servicesRes.data || [],
        partners: partnersRes.data || [],
        experts: expertsRes.data || []
      });
    } catch (err) {
      const errorMessage = 'Failed to load challenge options';
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

  const createChallenge = useCallback(async (challengeData: ChallengeFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Create main challenge record
      const { data: challenge, error: challengeError } = await supabase
        .from('challenges')
        .insert([{
          title_ar: challengeData.title_ar,
          title_en: challengeData.title_en,
          description_ar: challengeData.description_ar,
          description_en: challengeData.description_en,
          status: challengeData.status,
          priority_level: challengeData.priority_level,
          sensitivity_level: challengeData.sensitivity_level,
          challenge_type: challengeData.challenge_type,
          start_date: challengeData.start_date,
          end_date: challengeData.end_date,
          estimated_budget: challengeData.estimated_budget,
          actual_budget: challengeData.actual_budget,
          vision_2030_goal: challengeData.vision_2030_goal,
          kpi_alignment: challengeData.kpi_alignment,
          collaboration_details: challengeData.collaboration_details,
          internal_team_notes: challengeData.internal_team_notes,
          department_id: challengeData.department_id,
          deputy_id: challengeData.deputy_id,
          sector_id: challengeData.sector_id,
          domain_id: challengeData.domain_id,
          sub_domain_id: challengeData.sub_domain_id,
          service_id: challengeData.service_id
        }])
        .select()
        .single();

      if (challengeError) throw challengeError;

      // Assign experts if provided
      if (challengeData.expert_ids && challengeData.expert_ids.length > 0) {
        await manageExpertAssignment(challenge.id, challengeData.expert_ids);
      }

      // Assign partners if provided
      if (challengeData.partner_ids && challengeData.partner_ids.length > 0) {
        await managePartnerAssignment(challenge.id, challengeData.partner_ids);
      }

      toast({
        title: 'Success',
        description: 'Challenge created successfully'
      });

      return challenge;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create challenge';
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

  const updateChallenge = useCallback(async (challengeId: string, updates: Partial<ChallengeFormData>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Update main challenge record
      const { error: updateError } = await supabase
        .from('challenges')
        .update({
          title_ar: updates.title_ar,
          title_en: updates.title_en,
          description_ar: updates.description_ar,
          description_en: updates.description_en,
          status: updates.status,
          priority_level: updates.priority_level,
          sensitivity_level: updates.sensitivity_level,
          challenge_type: updates.challenge_type,
          start_date: updates.start_date,
          end_date: updates.end_date,
          estimated_budget: updates.estimated_budget,
          actual_budget: updates.actual_budget,
          vision_2030_goal: updates.vision_2030_goal,
          kpi_alignment: updates.kpi_alignment,
          collaboration_details: updates.collaboration_details,
          internal_team_notes: updates.internal_team_notes,
          department_id: updates.department_id,
          deputy_id: updates.deputy_id,
          sector_id: updates.sector_id,
          domain_id: updates.domain_id,
          sub_domain_id: updates.sub_domain_id,
          service_id: updates.service_id
        })
        .eq('id', challengeId);

      if (updateError) throw updateError;

      // Update expert assignments if provided
      if (updates.expert_ids) {
        await manageExpertAssignment(challengeId, updates.expert_ids);
      }

      // Update partner assignments if provided
      if (updates.partner_ids) {
        await managePartnerAssignment(challengeId, updates.partner_ids);
      }

      toast({
        title: 'Success',
        description: 'Challenge updated successfully'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update challenge';
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

  const manageExpertAssignment = useCallback(async (challengeId: string, expertIds: string[]) => {
    try {
      // Delete existing expert assignments
      await supabase
        .from('challenge_experts')
        .delete()
        .eq('challenge_id', challengeId);

      // Create new expert assignments
      if (expertIds.length > 0) {
        const expertLinks = expertIds.map(expertId => ({
          challenge_id: challengeId,
          expert_id: expertId,
          role_type: 'evaluator',
          status: 'active'
        }));

        const { error: expertError } = await supabase
          .from('challenge_experts')
          .insert(expertLinks);

        if (expertError) throw expertError;
      }
    } catch (err) {
      throw new Error('Failed to manage expert assignments');
    }
  }, []);

  const managePartnerAssignment = useCallback(async (challengeId: string, partnerIds: string[]) => {
    try {
      // Delete existing partner assignments
      await supabase
        .from('challenge_partners')
        .delete()
        .eq('challenge_id', challengeId);

      // Create new partner assignments
      if (partnerIds.length > 0) {
        const partnerLinks = partnerIds.map(partnerId => ({
          challenge_id: challengeId,
          partner_id: partnerId,
          partnership_type: 'collaborator',
          status: 'active'
        }));

        const { error: partnerError } = await supabase
          .from('challenge_partners')
          .insert(partnerLinks);

        if (partnerError) throw partnerError;
      }
    } catch (err) {
      throw new Error('Failed to manage partner assignments');
    }
  }, []);

  const deleteChallenge = useCallback(async (challengeId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Delete related records first (cascade)
      await Promise.all([
        supabase.from('challenge_experts').delete().eq('challenge_id', challengeId),
        supabase.from('challenge_partners').delete().eq('challenge_id', challengeId),
        supabase.from('challenge_participants').delete().eq('challenge_id', challengeId),
        supabase.from('challenge_submissions').delete().eq('challenge_id', challengeId),
        supabase.from('focus_questions').delete().eq('challenge_id', challengeId)
      ]);

      // Delete main challenge
      const { error: deleteError } = await supabase
        .from('challenges')
        .delete()
        .eq('id', challengeId);

      if (deleteError) throw deleteError;

      toast({
        title: 'Success',
        description: 'Challenge deleted successfully'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete challenge';
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

  // Link experts to challenge
  const linkExperts = useCallback(async (challengeId: string, expertIds: string[]) => {
    setLoading(true);
    try {
      const links = expertIds.map(expertId => ({
        challenge_id: challengeId,
        expert_id: expertId,
        role_type: 'evaluator',
        status: 'active'
      }));

      const { error } = await supabase.from('challenge_experts').insert(links);
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to link experts');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Link partners to challenge
  const linkPartners = useCallback(async (challengeId: string, partnerIds: string[]) => {
    setLoading(true);
    try {
      const links = partnerIds.map(partnerId => ({
        challenge_id: challengeId,
        partner_id: partnerId,
        partnership_type: 'collaborator',
        status: 'active'
      }));

      const { error } = await supabase.from('challenge_partners').insert(links);
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to link partners');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // State
    loading,
    error,
    options,
    
    // Methods
    loadChallengeOptions,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    manageExpertAssignment,
    managePartnerAssignment,
    linkExperts,
    linkPartners
  };
};