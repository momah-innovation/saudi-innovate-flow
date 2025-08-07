/**
 * Performance Optimization Hooks
 * Extracted from performance-hooks.ts for better organization
 */

import { useCallback, useMemo, useRef, useEffect } from 'react';
import { logger } from '@/utils/logger';

/**
 * Hook for optimized callback with dependency tracking
 */
export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  return useCallback(callback, deps);
}

/**
 * Hook for expensive computations with caching
 */
export function useExpensiveMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  debugName?: string
): T {
  return useMemo(() => {
    const start = performance.now();
    const result = factory();
    const end = performance.now();
    
    if (debugName && process.env.NODE_ENV === 'development') {
      logger.performance(`${debugName} computation`, end - start, { debugName });
    }
    
    return result;
  }, deps);
}

/**
 * Hook for component render tracking
 */
export function useRenderTracker(componentName: string, props?: Record<string, any>) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());
  
  useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    lastRenderTime.current = now;
    
    if (process.env.NODE_ENV === 'development') {
      logger.debug(`${componentName} render #${renderCount.current}`, { 
        component: componentName, 
        renderCount: renderCount.current, 
        timeSinceLastRender,
        props 
      });
    }
  });
  
  return {
    renderCount: renderCount.current,
    lastRenderTime: lastRenderTime.current
  };
}

/**
 * Hook for component lifecycle performance monitoring
 */
export function usePerformanceMonitor(componentName: string) {
  const mountTime = useRef(Date.now());
  const renderTimes = useRef<number[]>([]);
  
  useEffect(() => {
    const renderTime = Date.now() - mountTime.current;
    renderTimes.current.push(renderTime);
    
    if (process.env.NODE_ENV === 'development') {
      const avgRenderTime = renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length;
      logger.performance(`${componentName} performance`, avgRenderTime, {
        component: componentName,
        mountTime: mountTime.current,
        renderTime,
        avgRenderTime,
        renderCount: renderTimes.current.length
      });
    }
  });
  
  useEffect(() => {
    return () => {
      if (process.env.NODE_ENV === 'development') {
        const totalTime = Date.now() - mountTime.current;
        logger.performance(`${componentName} unmounted`, totalTime, { component: componentName });
      }
    };
  }, [componentName]);
}