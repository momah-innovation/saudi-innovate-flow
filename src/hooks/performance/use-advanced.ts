/**
 * Advanced Performance Hooks
 * Extracted from performance-hooks.ts for better organization
 */

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { prefetchStrategies } from '@/lib/query-optimization';
import { useDebounce } from './use-debounce-throttle';
import { useExpensiveMemo } from './use-optimization';

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