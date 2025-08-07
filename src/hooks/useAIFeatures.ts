import { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';

export interface AIFeature {
  id: string;
  feature_name: string;
  feature_name_ar: string;
  description?: string;
  description_ar?: string;
  is_enabled: boolean;
  is_beta: boolean;
  required_subscription_tier?: string;
  usage_limit_per_month?: number;
  model_configuration: Json;
  feature_category: string;
}

export interface AIPreferences {
  id: string;
  user_id: string;
  ai_enabled: boolean;
  idea_evaluation_ai: boolean;
  challenge_assist: boolean;
  similar_idea_detection: boolean;
  smart_partner_matching: boolean;
  focus_question_generation: boolean;
  language_preference: string;
  creativity_level: string;
  notification_preferences: Json;
  custom_prompts: Json;
}

export const useAIFeatures = () => {
  const [features, setFeatures] = useState<AIFeature[]>([]);
  const [preferences, setPreferences] = useState<AIPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchFeatures = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_feature_toggles')
        .select('*')
        .eq('is_enabled', true)
        .order('feature_category', { ascending: true });

      if (error) throw error;
      setFeatures(data || []);
    } catch (err) {
      logger.error('Error fetching AI features', { component: 'useAIFeatures', action: 'fetchFeatures' }, err as Error);
      setError('Failed to load AI features');
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل ميزات الذكاء الاصطناعي',
        variant: 'destructive',
      });
    }
  };

  const fetchUserPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('ai_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (!data) {
        // Create default preferences
        const defaultPrefs = {
          user_id: user.id,
          ai_enabled: true,
          idea_evaluation_ai: true,
          challenge_assist: true,
          similar_idea_detection: true,
          smart_partner_matching: false,
          focus_question_generation: true,
          language_preference: 'ar',
          creativity_level: 'balanced',
          notification_preferences: {},
          custom_prompts: {},
        };

        const { data: newPrefs, error: createError } = await supabase
          .from('ai_preferences')
          .insert(defaultPrefs)
          .select()
          .single();

        if (createError) throw createError;
        setPreferences(newPrefs);
      } else {
        setPreferences(data);
      }
    } catch (err) {
      logger.error('Error fetching user preferences', { component: 'useAIFeatures', action: 'fetchUserPreferences' }, err as Error);
      setError('Failed to load AI preferences');
    }
  };

  const updatePreferences = async (updates: Partial<AIPreferences>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !preferences) return;

      const { data, error } = await supabase
        .from('ai_preferences')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setPreferences(data);
      
      toast({
        title: 'تم الحفظ',
        description: 'تم تحديث تفضيلات الذكاء الاصطناعي بنجاح',
      });
    } catch (err) {
      logger.error('Error updating preferences', { component: 'useAIFeatures', action: 'updatePreferences' }, err as Error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحديث التفضيلات',
        variant: 'destructive',
      });
    }
  };

  const isFeatureEnabled = (featureName: string): boolean => {
    if (!preferences?.ai_enabled) return false;
    
    const feature = features.find(f => f.feature_name === featureName);
    if (!feature?.is_enabled) return false;

    // Check user preferences for specific features
    switch (featureName) {
      case 'idea_evaluation':
        return preferences.idea_evaluation_ai;
      case 'challenge_assist':
        return preferences.challenge_assist;
      case 'similar_idea_detection':
        return preferences.similar_idea_detection;
      case 'smart_partner_matching':
        return preferences.smart_partner_matching;
      case 'focus_question_generation':
        return preferences.focus_question_generation;
      default:
        return true;
    }
  };

  const getFeatureConfig = (featureName: string) => {
    const feature = features.find(f => f.feature_name === featureName);
    return feature?.model_configuration || {};
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchFeatures(),
        fetchUserPreferences(),
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    features,
    preferences,
    loading,
    error,
    updatePreferences,
    isFeatureEnabled,
    getFeatureConfig,
    refreshFeatures: fetchFeatures,
    refreshPreferences: fetchUserPreferences,
  };
};