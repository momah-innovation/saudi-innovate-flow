/**
 * Phase 8: Performance Optimization - Component Performance Hooks
 * React hooks for optimizing component performance and monitoring
 */

import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { prefetchStrategies } from '@/lib/query-optimization';

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
      console.log(`${debugName} computation time: ${end - start}ms`);
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
      console.log(`${componentName} render #${renderCount.current} (${timeSinceLastRender}ms since last)`, props);
    }
  });
  
  return {
    renderCount: renderCount.current,
    lastRenderTime: lastRenderTime.current
  };
}

/**
 * Hook for intersection observer (lazy loading, visibility tracking)
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {},
  onIntersect?: (entry: IntersectionObserverEntry) => void
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsIntersecting(entry.isIntersecting);
          if (entry.isIntersecting && !hasIntersected) {
            setHasIntersected(true);
            onIntersect?.(entry);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );
    
    observer.observe(element);
    
    return () => observer.disconnect();
  }, [elementRef, onIntersect, hasIntersected, options]);
  
  return { isIntersecting, hasIntersected };
}

/**
 * Hook for debounced values (search, filtering)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

/**
 * Hook for throttled functions (scroll, resize)
 */
export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  const inThrottle = useRef(false);
  
  return useCallback(
    ((...args: any[]) => {
      if (!inThrottle.current) {
        func.apply(null, args);
        inThrottle.current = true;
        setTimeout(() => (inThrottle.current = false), limit);
      }
    }) as T,
    [func, limit]
  );
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
      console.log(`${componentName} performance:`, {
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
        console.log(`${componentName} unmounted after ${totalTime}ms`);
      }
    };
  }, [componentName]);
}

/**
 * Hook for prefetching data on hover
 */
export function usePrefetchOnHover(prefetchKey: keyof typeof prefetchStrategies, id?: string) {
  const queryClient = useQueryClient();
  
  const handleMouseEnter = useCallback(() => {
    if (id && prefetchStrategies[prefetchKey]) {
      (prefetchStrategies[prefetchKey] as any)(queryClient, id);
    }
  }, [queryClient, prefetchKey, id]);
  
  return { onMouseEnter: handleMouseEnter };
}

/**
 * Hook for virtual scrolling optimization
 */
export function useVirtualList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleRange = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(items.length - 1, start + visibleCount + overscan);
    
    return { start, end };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);
  
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1).map((item, index) => ({
      item,
      index: visibleRange.start + index
    }));
  }, [items, visibleRange]);
  
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }
  };
}

/**
 * Hook for image lazy loading
 */
export function useLazyImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const { isIntersecting } = useIntersectionObserver(imageRef);
  
  useEffect(() => {
    if (isIntersecting && !isLoaded && !hasError) {
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      img.onerror = () => {
        setHasError(true);
      };
      img.src = src;
    }
  }, [isIntersecting, src, isLoaded, hasError]);
  
  return {
    ref: imageRef,
    src: imageSrc,
    isLoaded,
    hasError
  };
}

/**
 * Hook for component size tracking
 */
export function useElementSize<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      });
    });
    
    observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, []);
  
  return { ref, ...size };
}

/**
 * Hook for optimized search with debouncing and caching
 */
export function useOptimizedSearch<T>(
  items: T[],
  searchFn: (item: T, query: string) => boolean,
  delay: number = 300
) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, delay);
  const searchCache = useRef(new Map<string, T[]>());
  
  const results = useExpensiveMemo(() => {
    if (!debouncedQuery.trim()) return items;
    
    // Check cache first
    if (searchCache.current.has(debouncedQuery)) {
      return searchCache.current.get(debouncedQuery)!;
    }
    
    // Perform search
    const filtered = items.filter(item => searchFn(item, debouncedQuery));
    
    // Cache result
    searchCache.current.set(debouncedQuery, filtered);
    
    // Limit cache size
    if (searchCache.current.size > 100) {
      const firstKey = searchCache.current.keys().next().value;
      searchCache.current.delete(firstKey);
    }
    
    return filtered;
  }, [items, debouncedQuery, searchFn], 'optimized-search');
  
  return {
    query,
    setQuery,
    results,
    isSearching: query !== debouncedQuery
  };
}

export default {
  useOptimizedCallback,
  useExpensiveMemo,
  useRenderTracker,
  useIntersectionObserver,
  useDebounce,
  useThrottle,
  usePerformanceMonitor,
  usePrefetchOnHover,
  useVirtualList,
  useLazyImage,
  useElementSize,
  useOptimizedSearch
};