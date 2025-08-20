
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
          actor_id,
          action_type,
          entity_type,
          entity_id,
          target_user_id,
          workspace_id,
          workspace_type,
          metadata,
          privacy_level,
          severity,
          tags,
          created_at,
          expires_at
        `)
        .order('created_at', { ascending: false });

      // Apply workspace filter
      if (workspace_id) {
        query = query.eq('workspace_id', workspace_id);
      }
      if (workspace_type) {
        query = query.eq('workspace_type', workspace_type);
      }

      // Apply entity filter
      if (entity_id) {
        query = query.eq('entity_id', entity_id);
      }
      if (entity_type) {
        query = query.eq('entity_type', entity_type);
      }

      // Apply user filters
      if (filter.action_types?.length) {
        query = query.in('action_type', filter.action_types);
      }
      if (filter.entity_types?.length) {
        query = query.in('entity_type', filter.entity_types);
      }
      if (filter.privacy_levels?.length) {
        query = query.in('privacy_level', filter.privacy_levels);
      }
      if (filter.actors?.length) {
        query = query.in('actor_id', filter.actors);
      }
      if (filter.tags?.length) {
        query = query.overlaps('tags', filter.tags);
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

      const newActivities = data || [];
      
      if (reset) {
        setActivities(newActivities);
        setOffset(newActivities.length);
      } else {
        setActivities(prev => [...prev, ...newActivities]);
        setOffset(prev => prev + newActivities.length);
      }

      setHasMore(newActivities.length === limit);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch activities';
      setError(errorMessage);
      logger.error('Error fetching activities:', err);
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
