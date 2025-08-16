/**
 * AI Service Hook - Replaces direct SQL calls in AIService
 * Provides centralized AI operations with proper error handling
 */

import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useStructuredLogging } from './useStructuredLogging';
import type { Json } from '@/integrations/supabase/types';

export interface ContentModerationResult {
  flagged: boolean;
  categories: string[];
  confidence: number;
  reason?: string;
}

export interface TagSuggestion {
  tag: string;
  confidence: number;
  category: string;
}

export const useAIService = () => {
  const { user } = useAuth();
  const logging = useStructuredLogging();

  const trackUsage = useCallback(async (
    featureName: string,
    usageType: string,
    inputTokens: number = 0,
    outputTokens: number = 0,
    executionTime: number = 0,
    success: boolean = true,
    errorMessage?: string,
    metadata: Json = {}
  ) => {
    if (!user?.id) {
      logging.debug('AIService.trackUsage: No user ID available, skipping tracking');
      return;
    }

    try {
      const { error } = await supabase.from('ai_usage_tracking').insert({
        user_id: user.id,
        feature_name: featureName,
        usage_type: usageType,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        execution_time_ms: executionTime,
        success,
        error_message: errorMessage,
        metadata
      });

      if (error) throw error;
    } catch (error) {
      logging.warn('Failed to track AI usage', { component: 'AIService', data: { feature: featureName, type: usageType }, error });
    }
  }, [user?.id, logging]);

  const storeModerationResult = useCallback(async (
    contentId: string,
    contentType: string,
    content: string,
    result: ContentModerationResult
  ) => {
    try {
      const { error } = await supabase.from('content_moderation_logs').insert({
        content_id: contentId,
        content_type: contentType,
        content_text: content,
        moderation_result: result as any,
        flagged: result.flagged,
        confidence_score: result.confidence,
        categories_detected: result.categories,
        status: result.flagged ? 'requires_review' : 'approved'
      });

      if (error) throw error;
    } catch (error) {
      logging.error('Failed to store moderation result', { component: 'AIService', data: { contentId }, error });
      throw error;
    }
  }, [logging]);

  const storeTagSuggestions = useCallback(async (
    entityId: string,
    entityType: string,
    suggestions: TagSuggestion[],
    confidences: Record<string, number>
  ) => {
    try {
      const { error } = await supabase.from('ai_tag_suggestions').insert({
        entity_id: entityId,
        entity_type: entityType,
        suggested_tags: suggestions as any,
        confidence_scores: confidences as any,
        status: 'pending'
      });

      if (error) throw error;
    } catch (error) {
      logging.error('Failed to store tag suggestions', { component: 'AIService', data: { entityId }, error });
      throw error;
    }
  }, [logging]);

  const storeEmailTemplate = useCallback(async (
    templateType: string,
    subject: string,
    body: string,
    variables: string[],
    tone: string,
    language: string
  ) => {
    try {
      const { error } = await supabase.from('ai_email_templates').insert({
        template_name: `${templateType}_${Date.now()}`,
        template_category: templateType,
        subject_template: subject,
        body_template: body,
        variables: variables as any,
        tone,
        language,
        generated_by: 'ai',
        created_by: user?.id
      });

      if (error) throw error;
    } catch (error) {
      logging.error('Failed to store email template', { component: 'AIService', data: { templateType }, error });
      throw error;
    }
  }, [user?.id, logging]);

  const getFeatureConfig = useCallback(async (featureName: string) => {
    try {
      const { data, error } = await supabase
        .from('ai_feature_toggles')
        .select('model_configuration')
        .eq('feature_name', featureName)
        .eq('is_enabled', true)
        .maybeSingle();

      if (error) throw error;
      return data?.model_configuration || null;
    } catch (error) {
      logging.error('Error fetching AI feature config', { component: 'AIService', data: { featureName }, error });
      return null;
    }
  }, [logging]);

  const isFeatureEnabled = useCallback(async (featureName: string) => {
    if (!user?.id) {
      logging.debug('AIService.isFeatureEnabled: No user authenticated');
      return false;
    }

    try {
      // Check user preferences
      const { data: preferences } = await supabase
        .from('ai_preferences')
        .select('ai_enabled, *')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!preferences?.ai_enabled) return false;

      // Check feature toggle
      const { data: feature } = await supabase
        .from('ai_feature_toggles')
        .select('is_enabled')
        .eq('feature_name', featureName)
        .maybeSingle();

      return feature?.is_enabled || false;
    } catch (error) {
      logging.error('Error checking feature status', { component: 'AIService', data: { featureName }, error });
      return false;
    }
  }, [user?.id, logging]);

  return {
    trackUsage,
    storeModerationResult,
    storeTagSuggestions,
    storeEmailTemplate,
    getFeatureConfig,
    isFeatureEnabled
  };
};