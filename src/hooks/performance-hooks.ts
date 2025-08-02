/**
 * Phase 8: Performance Optimization - Component Performance Hooks
 * Main entry point for all performance optimization hooks
 */

// Re-export focused hook modules
export { 
  useOptimizedCallback, 
  useExpensiveMemo, 
  useRenderTracker, 
  usePerformanceMonitor 
} from './performance/use-optimization';

export { 
  useIntersectionObserver, 
  useLazyImage 
} from './performance/use-intersection';

export { 
  useDebounce, 
  useThrottle 
} from './performance/use-debounce-throttle';

export { 
  usePrefetchOnHover,
  useVirtualList,
  useElementSize,
  useOptimizedSearch
} from './performance/use-advanced';

// Default export for backward compatibility
export default {
  useOptimizedCallback: () => import('./performance/use-optimization').then(m => m.useOptimizedCallback),
  useExpensiveMemo: () => import('./performance/use-optimization').then(m => m.useExpensiveMemo),
  useRenderTracker: () => import('./performance/use-optimization').then(m => m.useRenderTracker),
  useIntersectionObserver: () => import('./performance/use-intersection').then(m => m.useIntersectionObserver),
  useDebounce: () => import('./performance/use-debounce-throttle').then(m => m.useDebounce),
  useThrottle: () => import('./performance/use-debounce-throttle').then(m => m.useThrottle),
  usePerformanceMonitor: () => import('./performance/use-optimization').then(m => m.usePerformanceMonitor),
  usePrefetchOnHover: () => import('./performance/use-advanced').then(m => m.usePrefetchOnHover),
  useVirtualList: () => import('./performance/use-advanced').then(m => m.useVirtualList),
  useLazyImage: () => import('./performance/use-intersection').then(m => m.useLazyImage),
  useElementSize: () => import('./performance/use-advanced').then(m => m.useElementSize),
  useOptimizedSearch: () => import('./performance/use-advanced').then(m => m.useOptimizedSearch)
};