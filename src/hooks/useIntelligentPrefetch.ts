/**
 * Intelligent Prefetching Hook - Advanced Phase 3 Implementation
 * Machine learning-like behavior prediction for data prefetching
 */

import { useEffect, useCallback, useRef, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { queryKeys } from '@/lib/query/query-keys';

interface UserBehaviorPattern {
  route: string;
  frequency: number;
  lastVisited: number;
  timeSpent: number;
  interactions: string[];
}

interface PrefetchPriority {
  queryKey: any[];
  priority: 'high' | 'medium' | 'low';
  staleTime: number;
}

export const useIntelligentPrefetch = () => {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const behaviorPatterns = useRef<Map<string, UserBehaviorPattern>>(new Map());
  const intersectionObserver = useRef<IntersectionObserver | null>(null);

  // Learn from user behavior patterns
  const learnFromBehavior = useCallback((route: string, action: string, timeSpent?: number) => {
    const current = behaviorPatterns.current.get(route) || {
      route,
      frequency: 0,
      lastVisited: Date.now(),
      timeSpent: 0,
      interactions: []
    };

    current.frequency += 1;
    current.lastVisited = Date.now();
    if (timeSpent) current.timeSpent += timeSpent;
    current.interactions.push(action);

    // Keep only last 10 interactions
    if (current.interactions.length > 10) {
      current.interactions = current.interactions.slice(-10);
    }

    behaviorPatterns.current.set(route, current);

    // Store in localStorage for persistence
    localStorage.setItem('userBehaviorPatterns', JSON.stringify(
      Array.from(behaviorPatterns.current.entries())
    ));
  }, []);

  // Load behavior patterns from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('userBehaviorPatterns');
    if (stored) {
      try {
        const patterns = JSON.parse(stored);
        behaviorPatterns.current = new Map(patterns);
      } catch (error) {
        console.warn('Failed to load behavior patterns:', error);
      }
    }
  }, []);

  // Predict likely next actions based on patterns
  const predictNextActions = useCallback((): PrefetchPriority[] => {
    const patterns = Array.from(behaviorPatterns.current.values());
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    // Score patterns based on recency and frequency
    const scoredPatterns = patterns
      .map(pattern => ({
        ...pattern,
        score: (pattern.frequency * 0.7) + 
               (oneHour - (now - pattern.lastVisited)) / oneHour * 0.3
      }))
      .filter(pattern => pattern.score > 0)
      .sort((a, b) => b.score - a.score);

    const priorities: PrefetchPriority[] = [];

    scoredPatterns.slice(0, 5).forEach((pattern, index) => {
      const priority: 'high' | 'medium' | 'low' = 
        index === 0 ? 'high' : index < 3 ? 'medium' : 'low';
      
      const staleTime = priority === 'high' ? 2 * 60 * 1000 : 
                       priority === 'medium' ? 5 * 60 * 1000 : 10 * 60 * 1000;

      // Map routes to query keys
      if (pattern.route.includes('/challenges')) {
        priorities.push({
          queryKey: [...queryKeys.challenges.list({ status: 'active', limit: 10 })] as any[],
          priority,
          staleTime
        });
      } else if (pattern.route.includes('/ideas')) {
        priorities.push({
          queryKey: [...queryKeys.ideas.list({ status: 'published', limit: 10 })] as any[],
          priority,
          staleTime
        });
      } else if (pattern.route.includes('/events')) {
        priorities.push({
          queryKey: [...queryKeys.events.list({ upcoming: true, limit: 10 })] as any[],
          priority,
          staleTime
        });
      }
    });

    return priorities;
  }, []);

  // Execute predictive prefetching
  const executePredictivePrefetch = useCallback(() => {
    const priorities = predictNextActions();
    
    priorities.forEach(({ queryKey, priority, staleTime }) => {
      const gcTime = staleTime * 2;
      
      queryClient.prefetchQuery({
        queryKey,
        staleTime,
        gcTime
      });
    });
  }, [queryClient, predictNextActions]);

  // Set up intersection observer for hover predictions
  const setupHoverPrediction = useCallback(() => {
    if (intersectionObserver.current) {
      intersectionObserver.current.disconnect();
    }

    intersectionObserver.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const dataId = element.getAttribute('data-prefetch-id');
            const dataType = element.getAttribute('data-prefetch-type');
            
            if (dataId && dataType) {
              // Prefetch based on element type
              if (dataType === 'challenge') {
                queryClient.prefetchQuery({
                  queryKey: queryKeys.challenges.detail(dataId),
                  staleTime: 5 * 60 * 1000
                });
              } else if (dataType === 'idea') {
                queryClient.prefetchQuery({
                  queryKey: queryKeys.ideas.detail(dataId),
                  staleTime: 5 * 60 * 1000
                });
              } else if (dataType === 'event') {
                queryClient.prefetchQuery({
                  queryKey: queryKeys.events.detail(dataId),
                  staleTime: 5 * 60 * 1000
                });
              }
            }
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    // Observe all prefetchable elements
    document.querySelectorAll('[data-prefetch-id]').forEach(element => {
      intersectionObserver.current?.observe(element);
    });
  }, [queryClient]);

  // Context-aware prefetching based on user role and preferences
  const contextAwarePrefetch = useCallback(() => {
    if (!user) return;

    const userRole = user.role;

    if (userRole === 'admin' || userRole === 'super_admin') {
      // Prefetch admin-specific data
      queryClient.prefetchQuery({
        queryKey: [...queryKeys.system.all, 'analytics'],
        staleTime: 10 * 60 * 1000
      });
      
      queryClient.prefetchQuery({
        queryKey: [...queryKeys.system.all, 'reports'],
        staleTime: 15 * 60 * 1000
      });
    }

    if (userRole === 'expert' || userRole === 'domain_expert') {
      // Prefetch expert-specific data
      queryClient.prefetchQuery({
        queryKey: [...queryKeys.user.profile(user.id), 'expert'],
        staleTime: 10 * 60 * 1000
      });

      queryClient.prefetchQuery({
        queryKey: [...queryKeys.challenges.all, 'expert-queue', user.id],
        staleTime: 5 * 60 * 1000
      });
    }

    // Prefetch based on user metadata
    const userMeta = (user as any).user_metadata || {};
    if (userMeta.favoriteCategories) {
      userMeta.favoriteCategories.forEach((category: string) => {
        queryClient.prefetchQuery({
          queryKey: queryKeys.challenges.list({ category, limit: 5 }),
          staleTime: 5 * 60 * 1000
        });
      });
    }
  }, [user, queryClient]);

  // Performance metrics for prefetching effectiveness
  const metrics = useMemo(() => {
    const patterns = Array.from(behaviorPatterns.current.values());
    return {
      totalPatterns: patterns.length,
      activePatterns: patterns.filter(p => Date.now() - p.lastVisited < 24 * 60 * 60 * 1000).length,
      avgFrequency: patterns.reduce((sum, p) => sum + p.frequency, 0) / patterns.length || 0,
      topRoutes: patterns
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 3)
        .map(p => ({ route: p.route, frequency: p.frequency }))
    };
  }, []);

  // Initialize and execute intelligent prefetching
  useEffect(() => {
    const timer = setTimeout(() => {
      executePredictivePrefetch();
      contextAwarePrefetch();
      setupHoverPrediction();
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (intersectionObserver.current) {
        intersectionObserver.current.disconnect();
      }
    };
  }, [executePredictivePrefetch, contextAwarePrefetch, setupHoverPrediction]);

  return {
    learnFromBehavior,
    executePredictivePrefetch,
    contextAwarePrefetch,
    metrics,
    predictNextActions
  };
};
