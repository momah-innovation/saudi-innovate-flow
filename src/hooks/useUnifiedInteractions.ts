import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface InteractionConfig {
  entityId: string;
  entityType: 'opportunity' | 'challenge' | 'event' | 'idea' | 'campaign';
  actionType: 'like' | 'bookmark' | 'share' | 'view' | 'apply' | 'participate';
  optimisticUpdate?: boolean;
  trackAnalytics?: boolean;
  showToast?: boolean;
}

interface InteractionState {
  isLoading: boolean;
  isActive: boolean;
  count: number;
}

interface AnalyticsPayload {
  entityId: string;
  entityType: string;
  action: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

const getSessionId = () => {
  const sessionKey = 'unified-session';
  let sessionId = sessionStorage.getItem(sessionKey);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(sessionKey, sessionId);
  }
  return sessionId;
};

const getTableName = (entityType: string, actionType: string): string => {
  const mapping = {
    opportunity: {
      like: 'opportunity_likes',
      bookmark: 'opportunity_bookmarks',
      share: 'opportunity_shares',
      apply: 'opportunity_applications'
    },
    challenge: {
      like: 'challenge_likes',
      bookmark: 'challenge_bookmarks',
      share: 'challenge_shares',
      participate: 'challenge_participants'
    },
    event: {
      like: 'event_likes',
      bookmark: 'event_bookmarks',
      share: 'event_shares',
      participate: 'event_participants'
    },
    idea: {
      like: 'idea_likes',
      bookmark: 'idea_bookmarks',
      share: 'idea_shares'
    },
    campaign: {
      like: 'campaign_likes',
      bookmark: 'campaign_bookmarks',
      share: 'campaign_shares'
    }
  };

  return mapping[entityType as keyof typeof mapping]?.[actionType as keyof any] || '';
};

const getAnalyticsFunction = (entityType: string): string => {
  const mapping = {
    opportunity: 'track-opportunity-analytics',
    challenge: 'track-challenge-analytics',
    event: 'track-event-analytics',
    idea: 'track-idea-analytics',
    campaign: 'track-campaign-analytics'
  };
  return mapping[entityType as keyof typeof mapping] || 'track-general-analytics';
};

export const useUnifiedInteractions = (config: InteractionConfig) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [state, setState] = useState<InteractionState>({
    isLoading: false,
    isActive: false,
    count: 0
  });

  const trackAnalytics = async (action: string, metadata?: Record<string, any>) => {
    if (!config.trackAnalytics) return;

    try {
      const payload: AnalyticsPayload = {
        entityId: config.entityId,
        entityType: config.entityType,
        action,
        userId: user?.id,
        sessionId: getSessionId(),
        metadata: {
          timestamp: new Date().toISOString(),
          ...metadata
        }
      };

      await supabase.functions.invoke(getAnalyticsFunction(config.entityType), {
        body: payload
      });
    } catch (error) {
      // Analytics tracking failed - continue without blocking UI
      logger.error('Analytics tracking failed', { 
        component: 'useUnifiedInteractions',
        action 
      }, error as Error);
    }
  };

  const checkInteractionStatus = async (): Promise<boolean> => {
    if (!user || !config.entityId) return false;

    try {
      const tableName = getTableName(config.entityType, config.actionType);
      if (!tableName) return false;

      const { data, error } = await supabase
        .from(tableName as any)
        .select('id')
        .eq(`${config.entityType}_id`, config.entityId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      logger.error('Failed to check interaction status', {
        component: 'useUnifiedInteractions',
        action: 'checkInteractionStatus'
      }, error as Error);
      return false;
    }
  };

  const getInteractionCount = async (): Promise<number> => {
    try {
      const tableName = getTableName(config.entityType, config.actionType);
      if (!tableName) return 0;

      const { count, error } = await supabase
        .from(tableName as any)
        .select('*', { count: 'exact', head: true })
        .eq(`${config.entityType}_id`, config.entityId);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      logger.error('Failed to get interaction count', {
        component: 'useUnifiedInteractions',
        action: 'getInteractionCount'
      }, error as Error);
      return 0;
    }
  };

  const performInteraction = async (isRemoving: boolean = false) => {
    if (!user) {
      if (config.showToast) {
        toast({
          title: 'Authentication Required',
          description: 'Please sign in to perform this action',
          variant: 'destructive'
        });
      }
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const tableName = getTableName(config.entityType, config.actionType);
      if (!tableName) throw new Error('Invalid interaction configuration');

      if (isRemoving) {
        // Remove interaction
        const { error } = await supabase
          .from(tableName as any)
          .delete()
          .eq(`${config.entityType}_id`, config.entityId)
          .eq('user_id', user.id);

        if (error) throw error;

        // Optimistic update
        if (config.optimisticUpdate) {
          setState(prev => ({
            ...prev,
            isActive: false,
            count: Math.max(0, prev.count - 1)
          }));
        }

        // Track analytics
        await trackAnalytics(`un${config.actionType}`);

        if (config.showToast) {
          toast({
            title: 'Removed',
            description: `${config.actionType} removed successfully`
          });
        }
      } else {
        // Add interaction
        const insertData = {
          [`${config.entityType}_id`]: config.entityId,
          user_id: user.id
        };

        const { error } = await supabase
          .from(tableName as any)
          .insert(insertData);

        if (error) throw error;

        // Optimistic update
        if (config.optimisticUpdate) {
          setState(prev => ({
            ...prev,
            isActive: true,
            count: prev.count + 1
          }));
        }

        // Track analytics
        await trackAnalytics(config.actionType);

        if (config.showToast) {
          toast({
            title: 'Success',
            description: `${config.actionType} added successfully`
          });
        }
      }

      // Skip analytics refresh for now - can be implemented per entity type
      // if (config.trackAnalytics) {
      //   await supabase.rpc(`refresh_${config.entityType}_analytics`, {
      //     [`p_${config.entityType}_id`]: config.entityId
      //   });
      // }

    } catch (error) {
      logger.error('Interaction failed', {
        component: 'useUnifiedInteractions',
        action: 'performInteraction'
      }, error as Error);

      if (config.showToast) {
        toast({
          title: 'Error',
          description: 'Failed to perform action. Please try again.',
          variant: 'destructive'
        });
      }
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const toggleInteraction = async () => {
    await performInteraction(state.isActive);
  };

  const loadInteractionData = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const [isActive, count] = await Promise.all([
        checkInteractionStatus(),
        getInteractionCount()
      ]);

      setState({
        isLoading: false,
        isActive,
        count
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return {
    ...state,
    toggleInteraction,
    loadInteractionData,
    trackAnalytics
  };
};