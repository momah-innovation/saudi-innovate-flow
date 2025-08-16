/**
 * AI Service - Core AI Operations
 * 
 * ⚠️ MIGRATION NOTE: This service is being migrated to hook-based architecture.
 * Direct supabase calls are being replaced with useAIService hook.
 * See: src/hooks/useAIService.ts for the new implementation.
 * 
 * @deprecated Use useAIService hook instead for new components
 */

import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { logger } from '@/utils/logger';
import { debugLog } from '@/utils/debugLogger';

export interface AIServiceConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  [key: string]: string | number | boolean;
}

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
  contributionLikelihood: number;
  collaborationPreference: string;
  recommendations: string[];
}

export class AIService {
  private static instance: AIService;

  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private async callAIFunction(functionName: string, payload: any): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payload
      });

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('AI Service call failed', { functionName }, error as Error);
      throw error;
    }
  }

  private async trackUsage(
    featureName: string, 
    usageType: string, 
    inputTokens: number = 0, 
    outputTokens: number = 0,
    executionTime: number = 0,
    success: boolean = true,
    errorMessage?: string,
    metadata: Json = {},
    userId?: string
  ) {
    // Deprecated: Use useAIService hook instead
    debugLog.warn('AIService.trackUsage: Deprecated method - migrate to useAIService hook');
    
    try {
      if (!userId) {
        debugLog.warn('AIService.trackUsage: No user ID provided, skipping tracking');
        return;
      }
      
      // ✅ MIGRATED: Use hook-based pattern instead of direct supabase calls
      const aiService = (window as any).__AI_SERVICE_HOOK__;
      if (aiService?.trackUsage) {
        await aiService.trackUsage(featureName, usageType, inputTokens, outputTokens, executionTime, success, errorMessage, metadata);
      } else {
        debugLog.warn('AIService.trackUsage: Hook not available, usage tracking skipped', {
          feature: featureName,
          component: 'AIService'
        });
      }
    } catch (error) {
      logger.warn('Failed to track AI usage', { featureName, usageType }, error as Error);
    }
  }

  // Content Moderation
  async moderateContent(
    content: string, 
    contentType: string,
    contentId?: string
  ): Promise<ContentModerationResult> {
    const startTime = Date.now();
    
    try {
      const result = await this.callAIFunction('content-moderation', {
        content,
        contentType,
        contentId
      });

      const executionTime = Date.now() - startTime;
      await this.trackUsage('content_moderation', 'api_call', content.length, 0, executionTime, true);

      // Store moderation result
      if (contentId) {
        // Use hook-based migration instead of direct supabase calls
        const aiService = (window as any).__AI_SERVICE_HOOK__;
        if (aiService?.storeModerationResult) {
          await aiService.storeModerationResult(contentId, contentType, content, result);
        } else {
          debugLog.warn('AIService.moderateContent: AI hook not available, skipping DB write');
        }
      }

      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      await this.trackUsage('content_moderation', 'api_call', content.length, 0, executionTime, false, String(error));
      throw error;
    }
  }

  // Automated Tagging
  async suggestTags(
    entityId: string,
    entityType: string,
    content: string
  ): Promise<TagSuggestion[]> {
    const startTime = Date.now();
    
    try {
      const result = await this.callAIFunction('automated-tagging', {
        entityId,
        entityType,
        content
      });

      const executionTime = Date.now() - startTime;
      await this.trackUsage('automated_tagging', 'api_call', content.length, 0, executionTime, true);

      // Store tag suggestions via hook
      const aiService = (window as any).__AI_SERVICE_HOOK__;
      if (aiService?.storeTagSuggestions) {
        await aiService.storeTagSuggestions(entityId, entityType, result.suggestions, result.confidences);
      } else {
        debugLog.warn('AIService.suggestTags: AI hook not available, skipping DB write');
      }

      return result.suggestions;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      await this.trackUsage('automated_tagging', 'api_call', content.length, 0, executionTime, false, String(error));
      throw error;
    }
  }

  // Email Intelligence
  async generateEmailTemplate(
    templateType: string,
    context: Record<string, any>,
    tone: string = 'professional',
    language: string = 'ar'
  ): Promise<{ subject: string; body: string; variables: string[] }> {
    const startTime = Date.now();
    
    try {
      const result = await this.callAIFunction('email-intelligence', {
        templateType,
        context,
        tone,
        language
      });

      const executionTime = Date.now() - startTime;
      await this.trackUsage('email_intelligence', 'template_generation', 0, 0, executionTime, true);

      // Store email template
      // Use hook-based migration instead of direct supabase calls
      const aiService = (window as any).__AI_SERVICE_HOOK__;
      if (aiService?.storeEmailTemplate) {
        await aiService.storeEmailTemplate(templateType, result, tone, language);
      } else {
        debugLog.warn('AIService.generateEmailTemplate: AI hook not available, skipping DB write');
      }

      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      await this.trackUsage('email_intelligence', 'template_generation', 0, 0, executionTime, false, String(error));
      throw error;
    }
  }

  // Document Intelligence
  async analyzeDocument(fileRecordId: string, documentText: string): Promise<DocumentAnalysisResult> {
    const startTime = Date.now();
    
    try {
      const result = await this.callAIFunction('document-intelligence', {
        fileRecordId,
        documentText
      });

      const executionTime = Date.now() - startTime;
      await this.trackUsage('document_intelligence', 'document_analysis', documentText.length, 0, executionTime, true);

      // Store analysis results
      // Use hook-based migration instead of direct supabase calls
      const aiService = (window as any).__AI_SERVICE_HOOK__;
      if (aiService?.storeDocumentAnalysis) {
        await aiService.storeDocumentAnalysis(fileRecordId, documentText, result, executionTime);
      } else {
        debugLog.warn('AIService.analyzeDocument: AI hook not available, skipping DB write');
      }

      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      await this.trackUsage('document_intelligence', 'document_analysis', documentText.length, 0, executionTime, false, String(error));
      throw error;
    }
  }

  // Smart Search
  async semanticSearch(
    query: string,
    entityTypes: string[] = [],
    limit: number = 10
  ): Promise<any[]> {
    const startTime = Date.now();
    
    try {
      const result = await this.callAIFunction('smart-search', {
        query,
        entityTypes,
        limit
      });

      const executionTime = Date.now() - startTime;
      await this.trackUsage('smart_search', 'search_query', query.length, 0, executionTime, true);

      return result.results;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      await this.trackUsage('smart_search', 'search_query', query.length, 0, executionTime, false, String(error));
      throw error;
    }
  }

  // Project Management AI
  async generateProjectInsights(
    projectId: string,
    projectType: string,
    projectData: Record<string, any>
  ): Promise<ProjectInsight[]> {
    const startTime = Date.now();
    
    try {
      const result = await this.callAIFunction('project-management-ai', {
        projectId,
        projectType,
        projectData
      });

      const executionTime = Date.now() - startTime;
      await this.trackUsage('project_management_ai', 'insight_generation', 0, 0, executionTime, true);

      const aiService = (window as any).__AI_SERVICE_HOOK__;
      if (aiService?.storeProjectInsights) {
        await aiService.storeProjectInsights(projectId, projectType, result, executionTime);
      } else {
        debugLog.warn('AIService.generateProjectInsights: AI hook not available, skipping DB write');
      }

      return result.insights;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      await this.trackUsage('project_management_ai', 'insight_generation', 0, 0, executionTime, false, String(error));
      throw error;
    }
  }

  // Predictive User Behavior
  async predictUserBehavior(
    userId: string,
    userActivity: Record<string, any>
  ): Promise<UserBehaviorPrediction> {
    const startTime = Date.now();
    
    try {
      const result = await this.callAIFunction('predictive-behavior', {
        userId,
        userActivity
      });

      const executionTime = Date.now() - startTime;
      await this.trackUsage('predictive_behavior', 'behavior_prediction', 0, 0, executionTime, true);

      const aiService = (window as any).__AI_SERVICE_HOOK__;
      if (aiService?.storeBehaviorPrediction) {
        await aiService.storeBehaviorPrediction(userId, userActivity, result, executionTime);
      } else {
        debugLog.warn('AIService.predictUserBehavior: AI hook not available, skipping DB write');
      }

      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      await this.trackUsage('predictive_behavior', 'behavior_prediction', 0, 0, executionTime, false, String(error));
      throw error;
    }
  }

  // Competitive Intelligence
  async generateCompetitiveIntelligence(
    sectorId: string,
    analysisType: string = 'market_trends'
  ): Promise<any> {
    const startTime = Date.now();
    
    try {
      const result = await this.callAIFunction('competitive-intelligence', {
        sectorId,
        analysisType
      });

      const executionTime = Date.now() - startTime;
      await this.trackUsage('competitive_intelligence', 'market_analysis', 0, 0, executionTime, true);

      const aiService = (window as any).__AI_SERVICE_HOOK__;
      if (aiService?.storeCompetitiveIntelligence) {
        await aiService.storeCompetitiveIntelligence(sectorId, analysisType, result, executionTime);
      } else {
        debugLog.warn('AIService.generateCompetitiveIntelligence: AI hook not available, skipping DB write');
      }

      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      await this.trackUsage('competitive_intelligence', 'market_analysis', 0, 0, executionTime, false, String(error));
      throw error;
    }
  }

  // Research Assistant
  async conductResearch(
    topic: string,
    scope: string = 'general',
    sources: string[] = []
  ): Promise<any> {
    const startTime = Date.now();
    
    try {
      const result = await this.callAIFunction('research-assistant', {
        topic,
        scope,
        sources
      });

      const executionTime = Date.now() - startTime;
      await this.trackUsage('research_assistant', 'research_query', topic.length, 0, executionTime, true);

      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      await this.trackUsage('research_assistant', 'research_query', topic.length, 0, executionTime, false, String(error));
      throw error;
    }
  }

  // Get AI feature configuration
  async getFeatureConfig(featureName: string): Promise<AIServiceConfig | null> {
    try {
      const featuresHook = (window as any).__AI_FEATURES_HOOK__;
      if (featuresHook?.getFeatureConfig) {
        return await featuresHook.getFeatureConfig(featureName);
      }
      debugLog.warn('AIService.getFeatureConfig: Features hook not available');
      return null;
    } catch (error) {
      logger.error('Error fetching AI feature config', {}, error as Error);
      return null;
    }
  }

  // Check if feature is enabled for user
  async isFeatureEnabled(featureName: string, userId?: string): Promise<boolean> {
    try {
      if (!userId) {
        debugLog.warn('AIService.isFeatureEnabled: No user ID provided');
        return false;
      }

      const featuresHook = (window as any).__AI_FEATURES_HOOK__;
      if (featuresHook?.isFeatureEnabled) {
        return await featuresHook.isFeatureEnabled(featureName, userId);
      }

      debugLog.warn('AIService.isFeatureEnabled: Features hook not available');
      return false;
    } catch (error) {
      logger.error('Error checking feature status', { featureName }, error as Error);
      return false;
    }
  }
}

export const aiService = AIService.getInstance();