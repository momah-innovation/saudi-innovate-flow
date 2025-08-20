
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ActivityEvent, ActivityActionType, ActivityEntityType } from '@/types/activity';
import { logger } from '@/utils/logger';

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

export function useActivityLogger() {
  const { user } = useAuth();

  const logActivity = useCallback(async (params: LogActivityParams) => {
    if (!user) {
      logger.warn('Cannot log activity: user not authenticated');
      return;
    }

    try {
      // Map our interface to database schema (activity_events table)
      const activityEvent = {
        user_id: user.id, // Maps to user_id in database
        event_type: params.action_type, // Maps to event_type in database
        entity_type: params.entity_type,
        entity_id: params.entity_id,
        metadata: params.metadata || {},
        privacy_level: params.privacy_level || 'public',
        created_at: new Date().toISOString(),
        visibility_scope: {
          target_user_id: params.target_user_id,
          workspace_id: params.workspace_id,
          workspace_type: params.workspace_type,
          severity: params.severity || 'info',
          tags: params.tags || []
        }
      };

      const { error } = await supabase
        .from('activity_events')
        .insert(activityEvent);

      if (error) {
        logger.error('Failed to log activity', { component: 'ActivityLogger' }, error);
        throw error;
      }

      logger.debug('Activity logged successfully', {
        component: 'ActivityLogger',
        data: {
          action_type: params.action_type,
          entity_type: params.entity_type,
          entity_id: params.entity_id
        }
      });

    } catch (error) {
      logger.error('Error logging activity', { component: 'ActivityLogger' }, error as Error);
      // Don't throw error to prevent disrupting user experience
    }
  }, [user]);

  const logMultipleActivities = useCallback(async (activities: LogActivityParams[]) => {
    if (!user) {
      logger.warn('Cannot log activities: user not authenticated');
      return;
    }

    try {
      // Map our interface to database schema
      const activityEvents = activities.map(params => ({
        user_id: user.id,
        event_type: params.action_type,
        entity_type: params.entity_type,
        entity_id: params.entity_id,
        metadata: params.metadata || {},
        privacy_level: params.privacy_level || 'public',
        created_at: new Date().toISOString(),
        visibility_scope: {
          target_user_id: params.target_user_id,
          workspace_id: params.workspace_id,
          workspace_type: params.workspace_type,
          severity: params.severity || 'info',
          tags: params.tags || []
        }
      }));

      const { error } = await supabase
        .from('activity_events')
        .insert(activityEvents);

      if (error) {
        logger.error('Failed to log multiple activities', { component: 'ActivityLogger' }, error);
        throw error;
      }

      logger.debug(`${activities.length} activities logged successfully`, {
        component: 'ActivityLogger'
      });

    } catch (error) {
      logger.error('Error logging multiple activities', { component: 'ActivityLogger' }, error as Error);
    }
  }, [user]);

  return {
    logActivity,
    logMultipleActivities
  };
}
