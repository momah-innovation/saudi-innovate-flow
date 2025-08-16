/**
 * Advanced Cache Warming Hook - Phase 3 Implementation
 * Intelligent background cache warming based on system usage patterns
 */

import { useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { queryKeys } from '@/lib/query/query-keys';

interface CacheWarmingConfig {
  enabled?: boolean;
  aggressiveMode?: boolean;
  backgroundOnly?: boolean;
  maxConcurrentRequests?: number;
}

interface WarmingTask {
  queryKey: any[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  staleTime: number;
  condition?: () => boolean;
}

export const useAdvancedCacheWarming = (config: CacheWarmingConfig = {}) => {
  const {
    enabled = true,
    aggressiveMode = false,
    backgroundOnly = true,
    maxConcurrentRequests = 5
  } = config;

  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const warmingQueue = useRef<WarmingTask[]>([]);
  const activeRequests = useRef<number>(0);
  const warmingInterval = useRef<NodeJS.Timeout>();

  // Define warming tasks based on priority and user context
  const getWarmingTasks = useCallback((): WarmingTask[] => {
    const tasks: WarmingTask[] = [
      // Critical tasks - always warm
      {
        queryKey: [...queryKeys.system.departments()] as any[],
        priority: 'critical',
        staleTime: 30 * 60 * 1000 // 30 minutes
      },
      {
        queryKey: [...queryKeys.system.sectors()] as any[],
        priority: 'critical',
        staleTime: 30 * 60 * 1000
      },
      {
        queryKey: [...queryKeys.challenges.all, 'featured'] as any[],
        priority: 'critical',
        staleTime: 15 * 60 * 1000 // 15 minutes
      },

      // High priority tasks
      {
        queryKey: [...queryKeys.challenges.list({ status: 'active', limit: 20 })] as any[],
        priority: 'high',
        staleTime: 5 * 60 * 1000 // 5 minutes
      },
      {
        queryKey: [...queryKeys.ideas.all, 'trending'] as any[],
        priority: 'high',
        staleTime: 10 * 60 * 1000 // 10 minutes
      },
      {
        queryKey: [...queryKeys.events.list({ upcoming: true, limit: 10 })] as any[],
        priority: 'high',
        staleTime: 10 * 60 * 1000
      },

      // Medium priority tasks
      {
        queryKey: [...queryKeys.system.partners()] as any[],
        priority: 'medium',
        staleTime: 20 * 60 * 1000 // 20 minutes
      },
      {
        queryKey: [...queryKeys.system.experts()] as any[],
        priority: 'medium',
        staleTime: 15 * 60 * 1000
      },
      {
        queryKey: [...queryKeys.ideas.list({ status: 'published', limit: 15 })] as any[],
        priority: 'medium',
        staleTime: 8 * 60 * 1000
      },

      // Low priority tasks
      {
        queryKey: [...queryKeys.system.translation('ar')] as any[],
        priority: 'low',
        staleTime: 60 * 60 * 1000, // 1 hour
        condition: () => true // Always warm translations
      },
      {
        queryKey: [...queryKeys.system.translation('en')] as any[],
        priority: 'low',
        staleTime: 60 * 60 * 1000
      }
    ];

    // Add user-specific tasks if authenticated
    if (user?.id) {
      tasks.push(
        {
          queryKey: [...queryKeys.user.profile(user.id)] as any[],
          priority: 'high',
          staleTime: 15 * 60 * 1000
        },
        {
          queryKey: [...queryKeys.user.profile(user.id), 'activity'] as any[],
          priority: 'medium',
          staleTime: 10 * 60 * 1000
        },
        {
          queryKey: [...queryKeys.user.preferences(user.id)] as any[],
          priority: 'medium',
          staleTime: 20 * 60 * 1000
        }
      );

      // Role-specific tasks
      if (user.role === 'admin' || user.role === 'super_admin') {
        tasks.push(
          {
            queryKey: [...queryKeys.system.all, 'analytics'] as any[],
            priority: 'high',
            staleTime: 5 * 60 * 1000
          },
          {
            queryKey: [...queryKeys.system.all, 'reports'] as any[],
            priority: 'medium',
            staleTime: 15 * 60 * 1000
          }
        );
      }

      if (user.role === 'expert' || user.role === 'domain_expert') {
        tasks.push(
          {
            queryKey: [...queryKeys.user.profile(user.id), 'expert'] as any[],
            priority: 'high',
            staleTime: 10 * 60 * 1000
          },
          {
            queryKey: [...queryKeys.challenges.all, 'expert-queue', user.id] as any[],
            priority: 'high',
            staleTime: 3 * 60 * 1000
          }
        );
      }
    }

    // Add aggressive mode tasks
    if (aggressiveMode) {
      tasks.push(
        {
          queryKey: [...queryKeys.challenges.list({ status: 'draft', limit: 10 })] as any[],
          priority: 'low',
          staleTime: 15 * 60 * 1000
        },
        {
          queryKey: [...queryKeys.ideas.list({ status: 'draft', limit: 10 })] as any[],
          priority: 'low',
          staleTime: 15 * 60 * 1000
        },
        {
          queryKey: [...queryKeys.events.list({ past: true, limit: 5 })] as any[],
          priority: 'low',
          staleTime: 30 * 60 * 1000
        }
      );
    }

    return tasks.filter(task => !task.condition || task.condition());
  }, [user, aggressiveMode]);

  // Process warming queue with concurrency control
  const processWarmingQueue = useCallback(async () => {
    if (!enabled || activeRequests.current >= maxConcurrentRequests) {
      return;
    }

    const task = warmingQueue.current.shift();
    if (!task) return;

    activeRequests.current++;

    try {
      // Check if query is already fresh
      const existingData = queryClient.getQueryData(task.queryKey);
      const queryState = queryClient.getQueryState(task.queryKey);
      
      if (queryState && queryState.dataUpdatedAt > Date.now() - task.staleTime) {
        // Data is still fresh, skip warming
        activeRequests.current--;
        return;
      }

      await queryClient.prefetchQuery({
        queryKey: task.queryKey,
        staleTime: task.staleTime,
        gcTime: task.staleTime * 2
      });

    } catch (error) {
      console.warn('Cache warming failed for:', task.queryKey, error);
    } finally {
      activeRequests.current--;
      
      // Process next task if queue is not empty
      if (warmingQueue.current.length > 0) {
        setTimeout(processWarmingQueue, 100);
      }
    }
  }, [enabled, maxConcurrentRequests, queryClient]);

  // Intelligent warming based on network conditions
  const getWarmingDelay = useCallback(() => {
    // Detect connection type for adaptive warming
    const connection = (navigator as any).connection;
    if (connection) {
      const { effectiveType, downlink } = connection;
      
      // Slower connections get longer delays
      if (effectiveType === '2g' || downlink < 1) {
        return 5000; // 5 seconds
      } else if (effectiveType === '3g' || downlink < 5) {
        return 2000; // 2 seconds
      }
    }
    
    return 1000; // 1 second for fast connections
  }, []);

  // Schedule cache warming with priority sorting
  const scheduleWarming = useCallback(() => {
    if (!enabled) return;

    const tasks = getWarmingTasks();
    
    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    warmingQueue.current = tasks;
    
    // Start processing with network-aware delay
    const delay = getWarmingDelay();
    setTimeout(processWarmingQueue, delay);
  }, [enabled, getWarmingTasks, getWarmingDelay, processWarmingQueue]);

  // Background warming with visibility detection
  const startBackgroundWarming = useCallback(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden && backgroundOnly) {
        // Page is hidden, safe to do background warming
        scheduleWarming();
      }
    };

    const handleOnline = () => {
      // Network came back online, warm critical data
      const criticalTasks = getWarmingTasks().filter(task => task.priority === 'critical');
      warmingQueue.current = criticalTasks;
      processWarmingQueue();
    };

    // Set up warming interval (every 5 minutes)
    warmingInterval.current = setInterval(() => {
      if (!backgroundOnly || document.hidden) {
        scheduleWarming();
      }
    }, 5 * 60 * 1000);

    // Listen for visibility and network changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);

    // Initial warming
    if (!backgroundOnly) {
      setTimeout(scheduleWarming, 2000);
    }

    return () => {
      if (warmingInterval.current) {
        clearInterval(warmingInterval.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, [enabled, backgroundOnly, scheduleWarming, getWarmingTasks, processWarmingQueue]);

  // Manual cache refresh for critical data
  const refreshCriticalCache = useCallback(async () => {
    const criticalTasks = getWarmingTasks().filter(task => task.priority === 'critical');
    
    for (const task of criticalTasks) {
      try {
        await queryClient.invalidateQueries({ queryKey: task.queryKey });
        await queryClient.prefetchQuery({
          queryKey: task.queryKey,
          staleTime: task.staleTime
        });
      } catch (error) {
        console.warn('Failed to refresh critical cache:', task.queryKey, error);
      }
    }
  }, [getWarmingTasks, queryClient]);

  // Cache warming metrics
  const getWarmingMetrics = useCallback(() => {
    const allTasks = getWarmingTasks();
    const warmedQueries = allTasks.filter(task => {
      const state = queryClient.getQueryState(task.queryKey);
      return state && state.dataUpdatedAt > Date.now() - task.staleTime;
    });

    return {
      totalTasks: allTasks.length,
      warmedQueries: warmedQueries.length,
      warmingRatio: warmedQueries.length / allTasks.length,
      queueLength: warmingQueue.current.length,
      activeRequests: activeRequests.current
    };
  }, [getWarmingTasks, queryClient]);

  // Initialize cache warming
  useEffect(() => {
    if (enabled) {
      return startBackgroundWarming();
    }
  }, [enabled, startBackgroundWarming]);

  return {
    scheduleWarming,
    refreshCriticalCache,
    getWarmingMetrics,
    isEnabled: enabled,
    queueLength: warmingQueue.current.length
  };
};