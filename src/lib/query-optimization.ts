/**
 * Phase 8: Performance Optimization - Enhanced React Query Configuration
 * Main entry point for all React Query optimizations
 */

// Re-export all query optimization modules
export { createOptimizedQueryClient, queryClient } from './query/query-client';
export { queryKeys } from './query/query-keys';
export { cacheInvalidation, backgroundSync, queryOptimizations } from './query/cache-strategies';
export { prefetchStrategies } from './query/prefetch-strategies';

// Default export for backward compatibility
export default {
  createOptimizedQueryClient: () => import('./query/query-client').then(m => m.createOptimizedQueryClient()),
  queryKeys: () => import('./query/query-keys').then(m => m.queryKeys),
  cacheInvalidation: () => import('./query/cache-strategies').then(m => m.cacheInvalidation),
  prefetchStrategies: () => import('./query/prefetch-strategies').then(m => m.prefetchStrategies),
  backgroundSync: () => import('./query/cache-strategies').then(m => m.backgroundSync),
  queryOptimizations: () => import('./query/cache-strategies').then(m => m.queryOptimizations)
};