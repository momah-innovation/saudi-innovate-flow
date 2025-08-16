/**
 * AI Service Hook - Phase 6 Services Layer Migration
 * Centralizes all AI service operations and eliminates direct supabase calls
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { debugLog } from '@/utils/debugLogger';
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

export interface DocumentAnalysisResult {
  summary: string;
  keyInsights: string[];
  sentiment: {
    score: number;
    label: string;
  };
  topics: string[];
  entities: Array<{
    name: string;
    type: string;
    confidence: number;
  }>;
  actionItems: string[];
}

export interface ProjectInsight {
  type: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  confidence: number;
}

export interface UserBehaviorPrediction {
  nextActions: string[];
  engagementScore: number;
  churnRisk: number;
  preferences: Record<string, number>;
}

export const useAIService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * ✅ CENTRALIZED: Store content moderation results
   */
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
        moderation_result: result as unknown as Json,
        flagged: result.flagged,
        confidence_score: result.confidence,
        flagged_categories: result.categories,
        reviewed_at: new Date().toISOString()
      });

      if (error) throw error;
      
      debugLog.log('Content moderation result stored', {
        component: 'AIService',
        contentId,
        flagged: result.flagged
      });
    } catch (error) {
      debugLog.error('Failed to store moderation result', {
        component: 'AIService',
        contentId
      }, error);
      throw error;
    }
  }, []);

  /**
   * ✅ CENTRALIZED: Store AI tag suggestions
   */
  const storeTagSuggestions = useCallback(async (
    entityId: string,
    entityType: string,
    suggestions: TagSuggestion[]
  ) => {
    try {
      const { error } = await supabase.from('ai_tag_suggestions').insert({
        entity_id: entityId,
        entity_type: entityType,
        suggested_tags: suggestions.map(s => s.tag),
        confidence_scores: suggestions.map(s => s.confidence),
        categories: suggestions.map(s => s.category),
        status: 'pending',
        created_at: new Date().toISOString()
      });

      if (error) throw error;
      
      debugLog.log('AI tag suggestions stored', {
        component: 'AIService',
        entityId,
        suggestionsCount: suggestions.length
      });
    } catch (error) {
      debugLog.error('Failed to store tag suggestions', {
        component: 'AIService',
        entityId
      }, error);
      throw error;
    }
  }, []);

  /**
   * ✅ CENTRALIZED: Store email templates
   */
  const storeEmailTemplate = useCallback(async (
    templateType: string,
    template: { subject: string; body: string; variables: string[] },
    tone?: string,
    language?: string
  ) => {
    try {
      const { error } = await supabase.from('ai_email_templates').insert({
        template_name: `${templateType}_${Date.now()}`,
        template_category: templateType,
        subject_template: template.subject,
        body_template: template.body,
        variables: template.variables,
        tone: tone || 'professional',
        language: language || 'en',
        status: 'active',
        created_at: new Date().toISOString()
      });

      if (error) throw error;
      
      debugLog.log('Email template stored', {
        component: 'AIService',
        templateType,
        tone,
        language
      });
    } catch (error) {
      debugLog.error('Failed to store email template', {
        component: 'AIService',
        templateType
      }, error);
      throw error;
    }
  }, []);

  /**
   * ✅ CENTRALIZED: Store document analysis results
   */
  const storeDocumentAnalysis = useCallback(async (
    fileRecordId: string,
    documentText: string,
    result: DocumentAnalysisResult,
    executionTime?: number
  ) => {
    try {
      const { error } = await supabase.from('document_analysis_results').insert({
        file_record_id: fileRecordId,
        extracted_text: documentText,
        summary: result.summary,
        key_insights: result.keyInsights,
        sentiment_analysis: result.sentiment as Json,
        topics_detected: result.topics,
        entities_extracted: result.entities as Json,
        action_items: result.actionItems,
        processing_time_ms: executionTime,
        analyzed_at: new Date().toISOString()
      });

      if (error) throw error;
      
      debugLog.log('Document analysis stored', {
        component: 'AIService',
        fileRecordId,
        processingTime: executionTime
      });
    } catch (error) {
      debugLog.error('Failed to store document analysis', {
        component: 'AIService',
        fileRecordId
      }, error);
      throw error;
    }
  }, []);

  /**
   * ✅ CENTRALIZED: Store project insights
   */
  const storeProjectInsights = useCallback(async (
    projectId: string,
    projectType: string,
    insights: ProjectInsight[],
    recommendations: string[],
    riskAssessment: Record<string, unknown>
  ) => {
    try {
      const { error } = await supabase.from('project_ai_insights').insert({
        project_id: projectId,
        project_type: projectType,
        insights: insights as unknown as Json,
        recommendations: recommendations,
        risk_assessment: riskAssessment as Json,
        confidence_score: insights.reduce((avg, insight) => avg + insight.confidence, 0) / insights.length,
        generated_at: new Date().toISOString()
      });

      if (error) throw error;
      
      debugLog.log('Project insights stored', {
        component: 'AIService',
        projectId,
        insightsCount: insights.length
      });
    } catch (error) {
      debugLog.error('Failed to store project insights', {
        component: 'AIService',
        projectId
      }, error);
      throw error;
    }
  }, []);

  /**
   * ✅ CENTRALIZED: Store user behavior predictions
   */
  const storeBehaviorPredictions = useCallback(async (
    userId: string,
    predictions: UserBehaviorPrediction,
    userActivity: Record<string, unknown>
  ) => {
    try {
      const { error } = await supabase.from('user_behavior_predictions').insert({
        user_id: userId,
        prediction_type: 'engagement',
        predictions: predictions as unknown as Json,
        behavioral_patterns: userActivity as Json,
        next_likely_actions: predictions.nextActions,
        engagement_score: predictions.engagementScore,
        churn_risk_score: predictions.churnRisk,
        user_preferences: predictions.preferences as Json,
        predicted_at: new Date().toISOString()
      });

      if (error) throw error;
      
      debugLog.log('Behavior predictions stored', {
        component: 'AIService',
        userId,
        engagementScore: predictions.engagementScore
      });
    } catch (error) {
      debugLog.error('Failed to store behavior predictions', {
        component: 'AIService',
        userId
      }, error);
      throw error;
    }
  }, []);

  /**
   * ✅ CENTRALIZED: Store competitive intelligence
   */
  const storeCompetitiveIntelligence = useCallback(async (
    sectorId: string,
    analysisType: string,
    insights: string[],
    trends: string[],
    opportunities: string[]
  ) => {
    try {
      const { error } = await supabase.from('competitive_intelligence').insert({
        sector_id: sectorId,
        analysis_type: analysisType,
        insights: insights,
        trends_identified: trends,
        opportunities: opportunities,
        competitive_landscape: { analysis_type: analysisType } as Json,
        market_positioning: { sector_id: sectorId } as Json,
        analyzed_at: new Date().toISOString()
      });

      if (error) throw error;
      
      debugLog.log('Competitive intelligence stored', {
        component: 'AIService',
        sectorId,
        analysisType
      });
    } catch (error) {
      debugLog.error('Failed to store competitive intelligence', {
        component: 'AIService',
        sectorId
      }, error);
      throw error;
    }
  }, []);

  /**
   * ✅ CENTRALIZED: Track AI service usage
   */
  const trackUsage = useCallback(async (
    serviceType: string,
    operationType: string,
    inputTokens: number,
    outputTokens: number,
    executionTime: number,
    success: boolean
  ) => {
    try {
      // Use security_audit_log for AI service usage tracking since ai_service_usage table doesn't exist
      const { error } = await supabase.from('security_audit_log').insert({
        user_id: null,
        action_type: 'AI_SERVICE_USAGE',
        resource_type: 'ai_service',
        resource_id: null,
        details: {
          service_type: serviceType,
          operation_type: operationType,
          input_tokens: inputTokens,
          output_tokens: outputTokens,
          execution_time_ms: executionTime,
          success: success,
          cost_estimate: (inputTokens * 0.001 + outputTokens * 0.002)
        },
        risk_level: 'low'
      });

      if (error) throw error;
    } catch (error) {
      debugLog.error('Failed to track AI usage', {
        component: 'AIService',
        serviceType,
        operationType
      }, error);
      // Don't throw usage tracking errors
    }
  }, []);

  // AI Operations (delegating to edge functions)
  const moderateContent = useCallback(async (
    content: string, 
    contentType: string,
    contentId?: string
  ): Promise<ContentModerationResult> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('content-moderation', {
        body: { content, contentType, contentId }
      });
      if (error) throw error;
      
      // Store result if contentId provided
      if (contentId) {
        await storeModerationResult(contentId, contentType, content, data);
      }
      
      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Moderation failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [storeModerationResult]);

  const suggestTags = useCallback(async (
    entityId: string,
    entityType: string,
    content: string
  ): Promise<TagSuggestion[]> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('automated-tagging', {
        body: { entityId, entityType, content }
      });
      if (error) throw error;
      
      // Store suggestions
      await storeTagSuggestions(entityId, entityType, data.suggestions);
      
      return data.suggestions;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Tagging failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [storeTagSuggestions]);

  const semanticSearch = useCallback(async (
    query: string,
    entityTypes: string[] = [],
    limit: number = 10
  ): Promise<any[]> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('smart-search', {
        body: { query, entityTypes, limit }
      });
      if (error) throw error;
      return data.results;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Search failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    isLoading,
    error,
    
    // AI Operations
    moderateContent,
    suggestTags,
    semanticSearch,
    
    // Storage Operations
    storeModerationResult,
    storeTagSuggestions,
    storeEmailTemplate,
    storeDocumentAnalysis,
    storeProjectInsights,
    storeBehaviorPredictions,
    storeCompetitiveIntelligence,
    trackUsage,
    
    // Utilities
    setIsLoading,
    setError
  };
};

export default useAIService;