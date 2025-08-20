
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ActivityEvent, 
  ActivityActionType, 
  ActivityEntityType, 
  ActivityImportance,
  CRITICAL_ACTIVITIES,
  HIGH_PRIORITY_ACTIVITIES,
  MEDIUM_PRIORITY_ACTIVITIES
} from '@/types/activity';
import { logger } from '@/utils/logger';
import { 
  shouldLogActivity, 
  checkRateLimit, 
  enhanceActivityMetadata,
  ActivityFilterConfig,
  DEFAULT_FILTER_CONFIG
} from '@/utils/activityFilters';

interface LogActivityParams {
  action_type: ActivityActionType;
  entity_type: ActivityEntityType;
  entity_id: string;
  target_user_id?: string;
  workspace_id?: string;
  workspace_type?: string;
  metadata?: Record<string, any>;
  privacy_level?: ActivityEvent['privacy_level'];
  severity?: ActivityEvent['severity'];
  tags?: string[];
}

/**
 * Enhanced Activity Logger with intelligent filtering
 * Only logs important activities to reduce noise and improve performance
 */
export function useActivityLogger() {
  const { user } = useAuth();

  // Enhanced activity filtering using centralized utility
  const getActivityImportance = (actionType: ActivityActionType): ActivityImportance => {
    if (CRITICAL_ACTIVITIES.includes(actionType)) return 'critical';
    if (HIGH_PRIORITY_ACTIVITIES.includes(actionType)) return 'high';
    if (MEDIUM_PRIORITY_ACTIVITIES.includes(actionType)) return 'medium';
    return 'low';
  };

  // Advanced activity filtering configuration
  const activityConfig: Partial<ActivityFilterConfig> = {
    enableSmartFiltering: true,
    logLevel: 'medium', // Only log medium priority and above
    rateLimitPerHour: 25, // Reduced from 50 to prevent spam
    excludePatterns: [
      'user_login', // Exclude frequent login events
      'page_viewed',
      'tab_changed', 
      'dashboard_accessed',
      'navigation'
    ],
    includePatterns: [
      'challenge_*',
      'idea_*', 
      'security_*',
      'role_*',
      'system_*',
      'partnership_*',
      'campaign_*'
    ]
  };

  const logActivity = useCallback(async (params: LogActivityParams & { forceLog?: boolean }) => {
    if (!user) {
      logger.warn('Cannot log activity: user not authenticated');
      return;
    }

    // Apply advanced activity filtering
    if (!shouldLogActivity(params.action_type, activityConfig) && !params.forceLog) {
      logger.debug('Skipping filtered activity', {
        component: 'ActivityLogger',
        actionType: params.action_type
      });
      return;
    }

    // Check rate limiting to prevent spam
    if (!checkRateLimit(user.id, activityConfig)) {
      logger.warn('Activity logging rate limit exceeded', {
        component: 'ActivityLogger',
        userId: user.id,
        actionType: params.action_type
      });
      return;
    }

    try {
      // Enhanced activity event with smart metadata enhancement
      const importance = getActivityImportance(params.action_type);
      const enhancedMetadata = enhanceActivityMetadata(params.action_type, {
        ...params.metadata,
        user_agent: navigator.userAgent,
        session_id: user.id + '_' + Date.now(),
        entity_title: params.metadata?.title || params.metadata?.name,
        entity_description: params.metadata?.description,
        logged_via: 'smart_filter'
      });

      const activityEvent = {
        user_id: user.id,
        event_type: params.action_type,
        entity_type: params.entity_type,
        entity_id: params.entity_id,
        metadata: enhancedMetadata,
        privacy_level: params.privacy_level || 'public',
        created_at: new Date().toISOString(),
        visibility_scope: {
          target_user_id: params.target_user_id,
          workspace_id: params.workspace_id,
          workspace_type: params.workspace_type,
          severity: params.severity || (importance === 'critical' ? 'warning' : 'info'),
          tags: [...(params.tags || []), importance, params.entity_type]
        }
      };

      const { error } = await supabase
        .from('activity_events')
        .insert(activityEvent);

      if (error) {
        logger.error('Failed to log activity', { component: 'ActivityLogger' }, error);
        throw error;
      }

      logger.info('Important activity logged successfully', {
        component: 'ActivityLogger',
        data: {
          actionType: params.action_type,
          entityType: params.entity_type,
          entityId: params.entity_id,
          importance,
          privacyLevel: params.privacy_level
        }
      });

    } catch (error) {
      logger.error('Error logging activity', { component: 'ActivityLogger' }, error as Error);
      // Don't throw error to prevent disrupting user experience
    }
  }, [user]);

  const logMultipleActivities = useCallback(async (activities: (LogActivityParams & { forceLog?: boolean })[]) => {
    if (!user) {
      logger.warn('Cannot log activities: user not authenticated');
      return;
    }

    // Apply smart filtering to batch activities
    const importantActivities = activities.filter(params => 
      shouldLogActivity(params.action_type, activityConfig) || params.forceLog
    ).filter(params => 
      checkRateLimit(user.id, activityConfig)
    );

    if (importantActivities.length === 0) {
      logger.debug('No important activities to log', { component: 'ActivityLogger' });
      return;
    }

    try {
      // Map filtered activities to database schema
      const activityEvents = importantActivities.map(params => {
        const importance = getActivityImportance(params.action_type);
        return {
          user_id: user.id,
          event_type: params.action_type,
          entity_type: params.entity_type,
          entity_id: params.entity_id,
          metadata: {
            ...params.metadata,
            importance,
            logged_at: new Date().toISOString(),
            batch_id: Date.now().toString()
          },
          privacy_level: params.privacy_level || 'public',
          created_at: new Date().toISOString(),
          visibility_scope: {
            target_user_id: params.target_user_id,
            workspace_id: params.workspace_id,
            workspace_type: params.workspace_type,
            severity: params.severity || (importance === 'critical' ? 'warning' : 'info'),
            tags: [...(params.tags || []), importance, params.entity_type]
          }
        };
      });

      const { error } = await supabase
        .from('activity_events')
        .insert(activityEvents);

      if (error) {
        logger.error('Failed to log multiple activities', { component: 'ActivityLogger' }, error);
        throw error;
      }

      logger.info(`${activityEvents.length}/${activities.length} important activities logged successfully`, {
        component: 'ActivityLogger'
      });

    } catch (error) {
      logger.error('Error logging multiple activities', { component: 'ActivityLogger' }, error as Error);
    }
  }, [user]);

  // Utility functions for external use
  const logCriticalActivity = useCallback(async (params: LogActivityParams) => {
    return logActivity({ ...params, forceLog: true });
  }, [logActivity]);

  const isImportantActivity = useCallback((actionType: ActivityActionType) => {
    return shouldLogActivity(actionType);
  }, []);

  return {
    logActivity,
    logMultipleActivities,
    logCriticalActivity,
    isImportantActivity,
    getActivityImportance
  };
}
