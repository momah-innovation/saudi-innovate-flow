// Query Cache Implementation for Performance Optimization
// Provides intelligent caching layer for API queries

import { debugLog } from "@/utils/debugLogger";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  tags?: string[];
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  tags?: string[]; // Cache tags for invalidation
  staleWhileRevalidate?: boolean; // Return stale data while fetching fresh
}

class QueryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 60000; // 1 minute
  private maxCacheSize = 1000; // Maximum number of cached entries

  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const { ttl = this.defaultTTL, tags = [] } = options;

    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      tags
    });

    debugLog.debug('Cache entry created', {
      component: 'QueryCache',
      action: 'set',
      key,
      ttl,
      tags,
      cacheSize: this.cache.size
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      debugLog.debug('Cache miss', {
        component: 'QueryCache',
        action: 'get',
        key
      });
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    
    if (isExpired) {
      debugLog.debug('Cache entry expired', {
        component: 'QueryCache',
        action: 'get',
        key,
        age: Date.now() - entry.timestamp,
        ttl: entry.ttl
      });
      this.cache.delete(key);
      return null;
    }

    debugLog.debug('Cache hit', {
      component: 'QueryCache',
      action: 'get',
      key,
      age: Date.now() - entry.timestamp
    });

    return entry.data;
  }

  invalidate(pattern?: string, tags?: string[]): void {
    let deletedCount = 0;

    if (tags && tags.length > 0) {
      // Invalidate by tags
      for (const [key, entry] of this.cache.entries()) {
        if (entry.tags && tags.some(tag => entry.tags!.includes(tag))) {
          this.cache.delete(key);
          deletedCount++;
        }
      }
    } else if (pattern) {
      // Invalidate by pattern
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
          deletedCount++;
        }
      }
    } else {
      // Clear all
      deletedCount = this.cache.size;
      this.cache.clear();
    }

    debugLog.debug('Cache invalidated', {
      component: 'QueryCache',
      action: 'invalidate',
      pattern,
      tags,
      deletedCount,
      remainingSize: this.cache.size
    });
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      debugLog.debug('Evicted oldest cache entry', {
        component: 'QueryCache',
        action: 'evictOldest',
        key: oldestKey
      });
    }
  }

  // Get cache statistics
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    entries: Array<{ key: string; age: number; tags?: string[] }>;
  } {
    const now = Date.now();
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      age: now - entry.timestamp,
      tags: entry.tags
    }));

    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      hitRate: 0, // Would need to track hits/misses for accurate calculation
      entries
    };
  }

  // Clear expired entries
  cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    debugLog.debug('Cache cleanup completed', {
      component: 'QueryCache',
      action: 'cleanup',
      cleanedCount,
      remainingSize: this.cache.size
    });
  }
}

// Global cache instance
export const queryCache = new QueryCache();

// Utility function for cached queries
export async function cachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  // Try to get from cache first
  const cached = queryCache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  try {
    const data = await queryFn();
    queryCache.set(key, data, options);
    return data;
  } catch (error) {
    debugLog.error('Cached query failed', {
      component: 'cachedQuery',
      action: 'execute',
      key
    }, error);
    throw error;
  }
}

// Auto-cleanup interval
if (typeof window !== 'undefined') {
  setInterval(() => {
    queryCache.cleanup();
  }, 5 * 60 * 1000); // Every 5 minutes
}