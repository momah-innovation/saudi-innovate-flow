import { useState, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface OpportunityFormData {
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  opportunity_type: string;
  status: string;
  deadline: string;
  requirements?: string;
  benefits?: string;
  eligibility_criteria?: string;
  application_process?: string;
  contact_info?: string;
  funding_amount?: number;
  location?: string;
  duration?: string;
  category?: string;
  tags?: string[];
}

export interface OpportunityApplication {
  id: string;
  opportunity_id: string;
  applicant_id: string;
  application_data: any;
  status: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  review_notes?: string;
}

export const useOpportunityOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Memoized state object to reduce re-renders
  const [state, setState] = useState({
    opportunities: [] as any[],
    applications: [] as OpportunityApplication[],
    filteredOpportunities: [] as any[],
    searchTerm: '',
    selectedCategory: '',
    selectedStatus: ''
  });

  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const createOpportunity = useCallback(async (opportunityData: OpportunityFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: opportunity, error: createError } = await supabase
        .from('opportunities')
        .insert([{
          title_ar: opportunityData.title_ar,
          title_en: opportunityData.title_en,
          description_ar: opportunityData.description_ar,
          description_en: opportunityData.description_en,
          opportunity_type: opportunityData.opportunity_type,
          status: opportunityData.status,
          deadline: opportunityData.deadline,
          requirements: opportunityData.requirements,
          benefits: opportunityData.benefits,
          eligibility_criteria: opportunityData.eligibility_criteria,
          application_process: opportunityData.application_process,
          contact_info: opportunityData.contact_info,
          funding_amount: opportunityData.funding_amount,
          location: opportunityData.location,
          duration: opportunityData.duration,
          category: opportunityData.category
        }])
        .select()
        .single();

      if (createError) throw createError;

      // Handle tags if provided
      if (opportunityData.tags && opportunityData.tags.length > 0) {
        await manageTags(opportunity.id, opportunityData.tags);
      }

      // Send notification about new opportunity
      await supabase.functions.invoke('send-opportunity-notification', {
        body: {
          type: 'new_opportunity',
          opportunity_id: opportunity.id,
          title: opportunityData.title_ar
        }
      });

      toast({
        title: 'Success',
        description: 'Opportunity created successfully'
      });

      return opportunity;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create opportunity';
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

  const updateOpportunity = useCallback(async (opportunityId: string, updates: Partial<OpportunityFormData>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error: updateError } = await supabase
        .from('opportunities')
        .update({
          title_ar: updates.title_ar,
          title_en: updates.title_en,
          description_ar: updates.description_ar,
          description_en: updates.description_en,
          opportunity_type: updates.opportunity_type,
          status: updates.status,
          deadline: updates.deadline,
          requirements: updates.requirements,
          benefits: updates.benefits,
          eligibility_criteria: updates.eligibility_criteria,
          application_process: updates.application_process,
          contact_info: updates.contact_info,
          funding_amount: updates.funding_amount,
          location: updates.location,
          duration: updates.duration,
          category: updates.category
        })
        .eq('id', opportunityId);

      if (updateError) throw updateError;

      // Update tags if provided
      if (updates.tags) {
        await manageTags(opportunityId, updates.tags);
      }

      toast({
        title: 'Success',
        description: 'Opportunity updated successfully'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update opportunity';
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

  const deleteOpportunity = useCallback(async (opportunityId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Delete related records first
      await Promise.all([
        supabase.from('opportunity_applications').delete().eq('opportunity_id', opportunityId),
        supabase.from('opportunity_bookmarks').delete().eq('opportunity_id', opportunityId),
        supabase.from('opportunity_likes').delete().eq('opportunity_id', opportunityId),
        supabase.from('opportunity_shares').delete().eq('opportunity_id', opportunityId)
      ]);

      // Delete main opportunity
      const { error: deleteError } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', opportunityId);

      if (deleteError) throw deleteError;

      toast({
        title: 'Success',
        description: 'Opportunity deleted successfully'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete opportunity';
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

  const manageTags = useCallback(async (opportunityId: string, tagNames: string[]) => {
    try {
      // Delete existing tags - simplified approach
      // Note: Implement proper tag management when tag tables are available

      if (tagNames.length === 0) return;

      // Simplified tag management - implement when tag tables are available
      if (tagNames.length > 0) {
        console.log('Tag management placeholder:', tagNames);
        // TODO: Implement when opportunity_tags table is available
      }
    } catch (err) {
      throw new Error('Failed to manage tags');
    }
  }, []);

  const submitApplication = useCallback(async (
    opportunityId: string, 
    applicationData: any,
    attachments?: File[]
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Handle file uploads if attachments exist
      let attachmentUrls: string[] = [];
      if (attachments && attachments.length > 0) {
        const uploadPromises = attachments.map(async (file, index) => {
          const fileName = `applications/${opportunityId}/${Date.now()}-${index}-${file.name}`;
          const { data, error } = await supabase.storage
            .from('opportunity-files')
            .upload(fileName, file);
          
          if (error) throw error;
          
          const { data: { publicUrl } } = supabase.storage
            .from('opportunity-files')
            .getPublicUrl(fileName);
          
          return publicUrl;
        });
        
        attachmentUrls = await Promise.all(uploadPromises);
      }

      // Create application record
      const { data: application, error: applicationError } = await supabase
        .from('opportunity_applications')
        .insert([{
          opportunity_id: opportunityId,
          applicant_id: 'current-user-id', // TODO: Get from auth context
          application_type: 'standard',
          contact_email: applicationData.email || '',
          contact_person: applicationData.name || '',
          attachment_urls: attachmentUrls,
          status: 'submitted'
        }])
        .select()
        .single();

      if (applicationError) throw applicationError;

      // Track analytics
      await supabase.functions.invoke('track-opportunity-analytics', {
        body: {
          event_type: 'application_submitted',
          opportunity_id: opportunityId,
          session_id: sessionStorage.getItem('session_id'),
          metadata: {
            has_attachments: attachmentUrls.length > 0,
            attachment_count: attachmentUrls.length
          }
        }
      });

      toast({
        title: 'Success',
        description: 'Application submitted successfully'
      });

      return application;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit application';
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

  // Memoized filtered opportunities to prevent recalculation
  const filteredOpportunities = useMemo(() => {
    return state.opportunities.filter(opportunity => {
      const matchesSearch = opportunity.title_ar?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                           opportunity.title_en?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                           opportunity.description_ar?.toLowerCase().includes(state.searchTerm.toLowerCase());
      
      const matchesCategory = !state.selectedCategory || opportunity.category === state.selectedCategory;
      const matchesStatus = !state.selectedStatus || opportunity.status === state.selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [state.opportunities, state.searchTerm, state.selectedCategory, state.selectedStatus]);

  return {
    // State
    loading,
    error,
    state,
    filteredOpportunities,
    
    // Methods
    updateState,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    submitApplication,
    manageTags
  };
};