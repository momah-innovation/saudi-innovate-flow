
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ActivityEvent, ActivityFeedFilter } from '@/types/activity';
import { logger } from '@/utils/logger';

interface UseActivityFeedOptions {
  workspace_id?: string;
  workspace_type?: string;
  entity_id?: string;
  entity_type?: string;
  auto_refresh?: boolean;
  refresh_interval?: number;
}

interface UseActivityFeedReturn {
  activities: ActivityEvent[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  refreshActivities: () => Promise<void>;
  loadMore: () => Promise<void>;
  applyFilter: (filter: ActivityFeedFilter) => void;
  clearFilter: () => void;
}

// Helper function to safely parse JSONB data
const safeParseJsonb = (data: any, fallback: any = {}) => {
  if (!data) return fallback;
  if (typeof data === 'object') return data;
  try {
    return JSON.parse(data);
  } catch {
    return fallback;
  }
};

export function useActivityFeed(
  options: UseActivityFeedOptions = {}
): UseActivityFeedReturn {
  const { user } = useAuth();
  const {
    workspace_id,
    workspace_type,
    entity_id,
    entity_type,
    auto_refresh = false,
    refresh_interval = 30000 // 30 seconds
  } = options;

  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<ActivityFeedFilter>({});
  const [offset, setOffset] = useState(0);

  const fetchActivities = useCallback(async (reset = false) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('activity_events')
        .select(`
          id,
          user_id,
          event_type,
          entity_type,
          entity_id,
          metadata,
          privacy_level,
          created_at,
          visibility_scope
        `)
        .order('created_at', { ascending: false });

      // Apply entity filter
      if (entity_id) {
        query = query.eq('entity_id', entity_id);
      }
      if (entity_type) {
        query = query.eq('entity_type', entity_type);
      }

      // Apply user filters
      if (filter.action_types?.length) {
        query = query.in('event_type', filter.action_types);
      }
      if (filter.entity_types?.length) {
        query = query.in('entity_type', filter.entity_types);
      }
      if (filter.privacy_levels?.length) {
        query = query.in('privacy_level', filter.privacy_levels);
      }
      if (filter.actors?.length) {
        query = query.in('user_id', filter.actors);
      }

      // Apply date range filter
      if (filter.date_range) {
        query = query
          .gte('created_at', filter.date_range.start.toISOString())
          .lte('created_at', filter.date_range.end.toISOString());
      }

      // Apply pagination
      const currentOffset = reset ? 0 : offset;
      const limit = filter.limit || 20;
      query = query.range(currentOffset, currentOffset + limit - 1);

      const { data, error: queryError } = await query;

      if (queryError) {
        throw queryError;
      }

      // Transform database records to ActivityEvent format with proper type handling
      const transformedActivities: ActivityEvent[] = (data || []).map(record => {
        const visibilityScope = safeParseJsonb(record.visibility_scope, {});
        const metadata = safeParseJsonb(record.metadata, {});

        return {
          id: record.id,
          actor_id: record.user_id,
          action_type: record.event_type,
          entity_type: record.entity_type,
          entity_id: record.entity_id,
          target_user_id: visibilityScope?.target_user_id || undefined,
          workspace_id: visibilityScope?.workspace_id || undefined,
          workspace_type: visibilityScope?.workspace_type || undefined,
          metadata: metadata,
          privacy_level: record.privacy_level as ActivityEvent['privacy_level'],
          severity: visibilityScope?.severity || 'info',
          tags: Array.isArray(visibilityScope?.tags) ? visibilityScope.tags : [],
          created_at: record.created_at
        };
      });
      
      if (reset) {
        setActivities(transformedActivities);
        setOffset(transformedActivities.length);
      } else {
        setActivities(prev => [...prev, ...transformedActivities]);
        setOffset(prev => prev + transformedActivities.length);
      }

      setHasMore(transformedActivities.length === limit);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch activities';
      setError(errorMessage);
      logger.error('Error fetching activities', { component: 'ActivityFeed' }, err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [user, workspace_id, workspace_type, entity_id, entity_type, filter, offset]);

  const refreshActivities = useCallback(async () => {
    setOffset(0);
    await fetchActivities(true);
  }, [fetchActivities]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    await fetchActivities(false);
  }, [fetchActivities, hasMore, isLoading]);

  const applyFilter = useCallback((newFilter: ActivityFeedFilter) => {
    setFilter(newFilter);
    setOffset(0);
  }, []);

  const clearFilter = useCallback(() => {
    setFilter({});
    setOffset(0);
  }, []);

  // Initial load and filter changes
  useEffect(() => {
    refreshActivities();
  }, [refreshActivities]);

  // Auto-refresh
  useEffect(() => {
    if (!auto_refresh) return;

    const interval = setInterval(() => {
      refreshActivities();
    }, refresh_interval);

    return () => clearInterval(interval);
  }, [auto_refresh, refresh_interval, refreshActivities]);

  return {
    activities,
    isLoading,
    error,
    hasMore,
    refreshActivities,
    loadMore,
    applyFilter,
    clearFilter
  };
}
