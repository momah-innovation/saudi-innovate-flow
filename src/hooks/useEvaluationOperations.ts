import { useState, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EvaluationFormData {
  idea_id: string;
  evaluator_id: string;
  evaluator_type: string;
  financial_viability: number;
  implementation_complexity: number;
  innovation_level: number;
  market_potential: number;
  overall_score: number;
  recommendation: string;
  strengths: string;
  weaknesses: string;
  evaluation_date: string;
}

export interface EvaluationData {
  id: string;
  idea_id: string;
  evaluator_id: string;
  evaluator_type: string;
  financial_viability: number;
  implementation_complexity: number;
  innovation_level: number;
  market_potential: number;
  overall_score?: number;
  recommendation?: string;
  strengths: string;
  weaknesses: string;
  suggestions?: string;
  evaluation_date: string;
  created_at: string;
  updated_at?: string;
}

export const useEvaluationOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Consolidated state management
  const [state, setState] = useState({
    evaluations: [] as EvaluationData[],
    ideas: {} as Record<string, any>,
    profiles: {} as Record<string, any>,
    filterType: 'all',
    searchTerm: '',
    selectedEvaluation: null as EvaluationData | null,
    isViewDialogOpen: false,
    isEditMode: false,
    showDialog: false
  });

  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const loadEvaluations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch evaluations
      const { data: evaluationsData, error: evaluationsError } = await supabase
        .from('idea_evaluations')
        .select('*')
        .order('created_at', { ascending: false });

      if (evaluationsError) throw evaluationsError;

      const evaluations = evaluationsData || [];
      
      // Fetch related ideas
      const ideaIds = [...new Set(evaluations.map(e => e.idea_id).filter(Boolean))];
      let ideas: Record<string, any> = {};
      
      if (ideaIds.length > 0) {
        const { data: ideasData, error: ideasError } = await supabase
          .from('ideas')
          .select('id, title_ar, title_en, description_ar, description_en, status')
          .in('id', ideaIds);

        if (ideasError) throw ideasError;
        
        ideas = ideasData?.reduce((acc, idea) => {
          acc[idea.id] = idea;
          return acc;
        }, {} as Record<string, any>) || {};
      }

      // Fetch evaluator profiles
      const evaluatorIds = [...new Set(evaluations.map(e => e.evaluator_id).filter(Boolean))];
      let profiles: Record<string, any> = {};
      
      if (evaluatorIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, email')
          .in('id', evaluatorIds);

        if (profilesError) throw profilesError;
        
        profiles = profilesData?.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>) || {};
      }

      updateState({ evaluations, ideas, profiles });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load evaluations';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast, updateState]);

  const createEvaluation = useCallback(async (evaluationData: EvaluationFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: evaluation, error: createError } = await supabase
        .from('idea_evaluations')
        .insert([{
          idea_id: evaluationData.idea_id,
          evaluator_id: evaluationData.evaluator_id,
          evaluator_type: evaluationData.evaluator_type,
          financial_viability: evaluationData.financial_viability,
          implementation_complexity: evaluationData.implementation_complexity,
          innovation_level: evaluationData.innovation_level,
          market_potential: evaluationData.market_potential,
          overall_score: evaluationData.overall_score,
          recommendation: evaluationData.recommendation,
          strengths: evaluationData.strengths,
          weaknesses: evaluationData.weaknesses,
          evaluation_date: evaluationData.evaluation_date
        }])
        .select()
        .single();

      if (createError) throw createError;

      // Update idea status based on evaluation
      await supabase
        .from('ideas')
        .update({ 
          status: evaluationData.overall_score >= 7 ? 'approved' : 'needs_revision',
          updated_at: new Date().toISOString()
        })
        .eq('id', evaluationData.idea_id);

      toast({
        title: 'Success',
        description: 'Evaluation created successfully'
      });

      return evaluation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create evaluation';
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

  const updateEvaluation = useCallback(async (evaluationId: string, updates: Partial<EvaluationFormData>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error: updateError } = await supabase
        .from('idea_evaluations')
        .update({
          evaluator_type: updates.evaluator_type,
          financial_viability: updates.financial_viability,
          implementation_complexity: updates.implementation_complexity,
          innovation_level: updates.innovation_level,
          market_potential: updates.market_potential,
          overall_score: updates.overall_score,
          recommendation: updates.recommendation,
          strengths: updates.strengths,
          weaknesses: updates.weaknesses,
          evaluation_date: updates.evaluation_date,
          updated_at: new Date().toISOString()
        })
        .eq('id', evaluationId);

      if (updateError) throw updateError;

      toast({
        title: 'Success',
        description: 'Evaluation updated successfully'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update evaluation';
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

  const deleteEvaluation = useCallback(async (evaluationId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error: deleteError } = await supabase
        .from('idea_evaluations')
        .delete()
        .eq('id', evaluationId);

      if (deleteError) throw deleteError;

      toast({
        title: 'Success',
        description: 'Evaluation deleted successfully'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete evaluation';
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

  const submitEvaluationBatch = useCallback(async (evaluations: EvaluationFormData[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const evaluationInserts = evaluations.map(evaluationData => ({
        idea_id: evaluationData.idea_id,
        evaluator_id: evaluationData.evaluator_id,
        evaluator_type: evaluationData.evaluator_type,
        financial_viability: evaluationData.financial_viability,
        implementation_complexity: evaluationData.implementation_complexity,
        innovation_level: evaluationData.innovation_level,
        market_potential: evaluationData.market_potential,
        overall_score: evaluationData.overall_score,
        recommendation: evaluationData.recommendation,
        strengths: evaluationData.strengths,
        weaknesses: evaluationData.weaknesses,
        evaluation_date: evaluationData.evaluation_date
      }));

      const { data: createdEvaluations, error: batchError } = await supabase
        .from('idea_evaluations')
        .insert(evaluationInserts)
        .select();

      if (batchError) throw batchError;

      // Update idea statuses based on evaluations
      const ideaUpdates = evaluations.map(evaluation => ({
        id: evaluation.idea_id,
        status: evaluation.overall_score >= 7 ? 'approved' : 'needs_revision',
        updated_at: new Date().toISOString()
      }));

      for (const update of ideaUpdates) {
        await supabase
          .from('ideas')
          .update({ status: update.status, updated_at: update.updated_at })
          .eq('id', update.id);
      }

      toast({
        title: 'Success',
        description: `${evaluations.length} evaluations submitted successfully`
      });

      return createdEvaluations;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit evaluation batch';
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

  // Memoized filtered evaluations
  const filteredEvaluations = useMemo(() => {
    return state.evaluations.filter(evaluation => {
      const idea = state.ideas[evaluation.idea_id];
      const evaluator = state.profiles[evaluation.evaluator_id];
      
      const matchesSearch = state.searchTerm === '' || 
        idea?.title_ar?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        idea?.title_en?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        evaluator?.name?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        evaluation.evaluator_type?.toLowerCase().includes(state.searchTerm.toLowerCase());
      
      const matchesFilter = state.filterType === 'all' || 
        evaluation.evaluator_type === state.filterType;
      
      return matchesSearch && matchesFilter;
    });
  }, [state.evaluations, state.ideas, state.profiles, state.searchTerm, state.filterType]);

  return {
    // State
    loading,
    error,
    state,
    filteredEvaluations,
    
    // Methods
    updateState,
    loadEvaluations,
    createEvaluation,
    updateEvaluation,
    deleteEvaluation,
    submitEvaluationBatch
  };
};