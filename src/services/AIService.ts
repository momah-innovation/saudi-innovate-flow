import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { logger } from '@/utils/logger';
import { debugLog } from '@/utils/debugLogger';

export interface AIServiceConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  [key: string]: any;
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
    try {
      // Use passed user ID if available, otherwise skip tracking
      if (!userId) {
        debugLog.warn('AIService.trackUsage: No user ID provided, skipping tracking');
        return;
      }
      
      await supabase.from('ai_usage_tracking').insert({
        user_id: userId,
        feature_name: featureName,
        usage_type: usageType,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        execution_time_ms: executionTime,
        success,
        error_message: errorMessage,
        metadata
      });
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
        await supabase.from('content_moderation_logs').insert({
          content_id: contentId,
          content_type: contentType,
          content_text: content,
          moderation_result: result,
          flagged: result.flagged,
          confidence_score: result.confidence,
          categories_detected: result.categories,
          status: result.flagged ? 'requires_review' : 'approved'
        });
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

      // Store tag suggestions
      await supabase.from('ai_tag_suggestions').insert({
        entity_id: entityId,
        entity_type: entityType,
        suggested_tags: result.suggestions,
        confidence_scores: result.confidences,
        status: 'pending'
      });

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
      await supabase.from('ai_email_templates').insert({
        template_name: `${templateType}_${Date.now()}`,
        template_category: templateType,
        subject_template: result.subject,
        body_template: result.body,
        variables: result.variables,
        tone,
        language,
        generated_by: 'ai'
      });

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
      await supabase.from('document_analysis_results').insert({
        file_record_id: fileRecordId,
        extracted_text: documentText,
        key_insights: result.keyInsights,
        sentiment_analysis: result.sentiment,
        topics_detected: result.topics,
        entities_found: result.entities,
        summary: result.summary,
        action_items: result.actionItems,
        confidence_score: result.confidence || 0.8,
        processing_time_ms: executionTime
      });

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

      // Store project insights
      await supabase.from('project_ai_insights').insert({
        project_id: projectId,
        project_type: projectType,
        insights: result.insights,
        recommendations: result.recommendations,
        risk_assessment: result.riskAssessment,
        timeline_predictions: result.timelinePredictions,
        resource_optimization: result.resourceOptimization,
        confidence_level: result.confidence || 0.7
      });

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

      // Store behavior predictions
      await supabase.from('user_behavior_predictions').insert({
        user_id: userId,
        prediction_type: 'engagement',
        predictions: result,
        behavioral_patterns: userActivity,
        next_likely_actions: result.nextActions,
        confidence_score: result.confidence || 0.6
      });

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

      // Store competitive intelligence
      await supabase.from('competitive_intelligence').insert({
        sector_id: sectorId,
        analysis_type: analysisType,
        insights: result.insights,
        trends_identified: result.trends,
        opportunities: result.opportunities,
        threats: result.threats,
        recommendations: result.recommendations,
        confidence_level: result.confidence || 0.7
      });

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
      const { data, error } = await supabase
        .from('ai_feature_toggles')
        .select('model_configuration')
        .eq('feature_name', featureName)
        .eq('is_enabled', true)
        .maybeSingle();

      if (error || !data) return null;
      return data.model_configuration as AIServiceConfig;
    } catch (error) {
      logger.error('Error fetching AI feature config', {}, error as Error);
      return null;
    }
  }

  // Check if feature is enabled for user
  async isFeatureEnabled(featureName: string, userId?: string): Promise<boolean> {
    try {
      // Use passed user ID instead of making auth call
      if (!userId) {
        debugLog.warn('AIService.isFeatureEnabled: No user ID provided');
        return false;
      }

      // Check user preferences
      const { data: preferences } = await supabase
        .from('ai_preferences')
        .select('ai_enabled, *')
        .eq('user_id', userId)
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
      logger.error('Error checking feature status', { featureName }, error as Error);
      return false;
    }
  }
}

export const aiService = AIService.getInstance();