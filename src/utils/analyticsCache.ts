interface AnalyticsCache {
  data: any;
  timestamp: number;
  opportunityId: string;
}

class AnalyticsCacheManager {
  private cache = new Map<string, AnalyticsCache>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  set(opportunityId: string, data: any) {
    this.cache.set(opportunityId, {
      data,
      timestamp: Date.now(),
      opportunityId
    });
  }

  get(opportunityId: string): any | null {
    const cached = this.cache.get(opportunityId);
    if (!cached) return null;

    // Check if cache is expired
    if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(opportunityId);
      return null;
    }

    return cached.data;
  }

  invalidate(opportunityId: string) {
    this.cache.delete(opportunityId);
  }

  clear() {
    this.cache.clear();
  }

  // Auto-cleanup expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > this.CACHE_DURATION) {
        this.cache.delete(key);
      }
    }
  }
}

export const analyticsCache = new AnalyticsCacheManager();

// Setup auto-cleanup every 10 minutes
setInterval(() => {
  analyticsCache.cleanup();
}, 10 * 60 * 1000);