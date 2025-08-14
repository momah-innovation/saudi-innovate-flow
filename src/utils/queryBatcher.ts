// Query Batching Utility for Performance Optimization
// Prevents duplicate queries and enables request batching

import { debugLog } from "@/utils/debugLogger";

export class QueryBatcher {
  private queries: Map<string, Promise<any>> = new Map();
  private batchTimeout: number = 50; // ms
  private batchedQueries: Map<string, any[]> = new Map();

  async batch<T>(key: string, queryFn: () => Promise<T>): Promise<T> {
    // Return existing promise if already pending
    if (this.queries.has(key)) {
      debugLog.debug('Query batching: returning cached promise', {
        component: 'QueryBatcher',
        action: 'batch',
        key
      });
      return this.queries.get(key) as Promise<T>;
    }

    // Create new promise and cache it
    const promise = queryFn().finally(() => {
      // Clear after resolution to prevent memory leaks
      setTimeout(() => {
        this.queries.delete(key);
        debugLog.debug('Query batching: cleared cache', {
          component: 'QueryBatcher',
          action: 'cleanup',
          key
        });
      }, 100);
    });

    this.queries.set(key, promise);

    try {
      const result = await promise;
      debugLog.debug('Query batching: resolved', {
        component: 'QueryBatcher',
        action: 'resolve',
        key
      });
      return result;
    } catch (error) {
      debugLog.error('Query batching: failed', {
        component: 'QueryBatcher',
        action: 'error',
        key
      }, error);
      throw error;
    }
  }

  // Batch multiple related queries to execute together
  async batchMultiple<T>(
    queries: Array<{ key: string; queryFn: () => Promise<T> }>
  ): Promise<T[]> {
    debugLog.debug('Query batching: executing multiple queries', {
      component: 'QueryBatcher',
      action: 'batchMultiple',
      count: queries.length
    });

    const promises = queries.map(({ key, queryFn }) => 
      this.batch(key, queryFn)
    );

    return Promise.all(promises);
  }

  // Clear all cached queries
  clearCache(): void {
    debugLog.debug('Query batching: clearing all cache', {
      component: 'QueryBatcher',
      action: 'clearCache',
      count: this.queries.size
    });
    this.queries.clear();
    this.batchedQueries.clear();
  }

  // Get cache status for debugging
  getCacheStatus(): { size: number; keys: string[] } {
    return {
      size: this.queries.size,
      keys: Array.from(this.queries.keys())
    };
  }
}

// Global instance for use across the application
export const queryBatcher = new QueryBatcher();

// Specialized batchers for different data types
export const challengeBatcher = new QueryBatcher();
export const userBatcher = new QueryBatcher();
export const analyticsBatcher = new QueryBatcher();