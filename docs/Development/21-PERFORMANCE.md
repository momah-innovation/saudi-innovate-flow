# ⚡ Performance Optimization Guide

## Overview
Comprehensive guide for optimizing performance across the Ruwād Platform, covering frontend optimization, backend efficiency, and user experience improvements.

## Frontend Performance Optimization

### React Performance Patterns

#### Component Optimization
```typescript
// 1. Memoization strategies
import React, { memo, useMemo, useCallback } from 'react';

// ❌ Component re-renders unnecessarily
const ChallengeCard = ({ challenge, onSelect, filters }) => {
  const filteredTags = challenge.tags.filter(tag => 
    filters.tags.includes(tag)
  );

  return (
    <div onClick={() => onSelect(challenge.id)}>
      <h3>{challenge.title}</h3>
      <div>{filteredTags.join(', ')}</div>
    </div>
  );
};

// ✅ Optimized with memoization
const ChallengeCard = memo(({ challenge, onSelect, filters }) => {
  const filteredTags = useMemo(() => 
    challenge.tags.filter(tag => filters.tags.includes(tag)),
    [challenge.tags, filters.tags]
  );

  const handleSelect = useCallback(() => {
    onSelect(challenge.id);
  }, [challenge.id, onSelect]);

  return (
    <div onClick={handleSelect}>
      <h3>{challenge.title}</h3>
      <div>{filteredTags.join(', ')}</div>
    </div>
  );
});

// 2. Virtualization for large lists
import { FixedSizeList as List } from 'react-window';

const VirtualizedChallengeList = ({ challenges }) => {
  const ItemRenderer = ({ index, style }) => (
    <div style={style}>
      <ChallengeCard challenge={challenges[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={challenges.length}
      itemSize={150}
      overscanCount={5}
    >
      {ItemRenderer}
    </List>
  );
};

// 3. Lazy loading with Intersection Observer
const LazyComponent = ({ children, threshold = 0.1 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref}>
      {isVisible ? children : <div className="h-40 bg-muted animate-pulse" />}
    </div>
  );
};
```

#### State Management Optimization
```typescript
// 1. Selective subscriptions
const useOptimizedChallenges = (filters: ChallengeFilters) => {
  return useQuery({
    queryKey: ['challenges', filters],
    queryFn: () => fetchChallenges(filters),
    select: useCallback((data: Challenge[]) => {
      // Only return what components need
      return data.map(challenge => ({
        id: challenge.id,
        title: challenge.title,
        status: challenge.status,
        createdAt: challenge.created_at
      }));
    }, []),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000 // 10 minutes
  });
};

// 2. Optimistic updates
const useCreateChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChallenge,
    onMutate: async (newChallenge) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['challenges'] });

      // Snapshot previous value
      const previousChallenges = queryClient.getQueryData(['challenges']);

      // Optimistically update
      queryClient.setQueryData(['challenges'], (old: Challenge[]) => [
        ...old,
        { ...newChallenge, id: 'temp-' + Date.now() }
      ]);

      return { previousChallenges };
    },
    onError: (err, newChallenge, context) => {
      // Rollback on error
      queryClient.setQueryData(['challenges'], context?.previousChallenges);
    },
    onSettled: () => {
      // Refetch regardless
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    }
  });
};

// 3. Debounced search
const useDebounced = <T>(value: T, delay: number): T => {
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
};

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounced(searchTerm, 300);

  const { data: searchResults } = useQuery({
    queryKey: ['search', debouncedSearchTerm],
    queryFn: () => searchChallenges(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length > 2,
    staleTime: 30000 // 30 seconds
  });

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="البحث في التحديات..."
      />
      {searchResults?.map(result => (
        <SearchResult key={result.id} result={result} />
      ))}
    </div>
  );
};
```

### Bundle Optimization

#### Code Splitting Strategies
```typescript
// 1. Route-based splitting
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Challenges = lazy(() => import('@/pages/Challenges'));
const Analytics = lazy(() => import('@/pages/Analytics'));

// 2. Feature-based splitting
const AIContentGenerator = lazy(() => 
  import('@/components/ai/AIContentGenerator').then(module => ({
    default: module.AIContentGenerator
  }))
);

// 3. Dynamic imports with loading states
const DynamicChart = ({ type, data }) => {
  const [ChartComponent, setChartComponent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChart = async () => {
      try {
        const module = await import('@/components/charts/ChartLibrary');
        setChartComponent(() => module[type]);
      } catch (error) {
        console.error('Failed to load chart:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChart();
  }, [type]);

  if (loading) return <ChartSkeleton />;
  if (!ChartComponent) return <ChartError />;

  return <ChartComponent data={data} />;
};

// 4. Selective imports
// ❌ Imports entire library
import * as Icons from 'lucide-react';

// ✅ Imports only needed icons
import { Search, Filter, Download } from 'lucide-react';

// ✅ Dynamic icon loading
const DynamicIcon = ({ name, ...props }) => {
  const [IconComponent, setIconComponent] = useState(null);

  useEffect(() => {
    import(`lucide-react/dist/esm/icons/${name}.js`)
      .then(module => setIconComponent(() => module.default))
      .catch(() => setIconComponent(() => () => <span>?</span>));
  }, [name]);

  return IconComponent ? <IconComponent {...props} /> : null;
};
```

#### Asset Optimization
```typescript
// 1. Image optimization
export const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  loading = 'lazy',
  className 
}) => {
  const [imageSrc, setImageSrc] = useState(`${src}?w=50&q=20`); // Placeholder
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setImageLoaded(true);
    };
    img.src = src;
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={`transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-70'
        }`}
      />
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse" />
      )}
    </div>
  );
};

// 2. Font optimization
const fontOptimization = {
  preloadFonts: () => {
    const fonts = [
      { family: 'Cairo', weight: '400', display: 'swap' },
      { family: 'Cairo', weight: '600', display: 'swap' }
    ];

    fonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = `/fonts/cairo-${font.weight}.woff2`;
      document.head.appendChild(link);
    });
  },

  loadFontsAsync: () => {
    if ('fontDisplay' in document.body.style) {
      document.fonts.load('1em Cairo').then(() => {
        document.body.classList.add('fonts-loaded');
      });
    }
  }
};

// 3. Resource hints
const ResourceHints = () => {
  useEffect(() => {
    // Preconnect to external domains
    const preconnectDomains = [
      'https://jxpbiljkoibvqxzdkgod.supabase.co',
      'https://fonts.googleapis.com',
      'https://api.openai.com'
    ];

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Prefetch likely next pages
    const prefetchRoutes = ['/challenges', '/ideas', '/events'];
    
    prefetchRoutes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  }, []);

  return null;
};
```

## Backend Performance Optimization

### Database Query Optimization
```sql
-- 1. Efficient indexing strategies
-- Composite indexes for common query patterns
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_challenges_status_created_at 
ON challenges(status, created_at DESC);

-- Partial indexes for filtered queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_challenges_active 
ON challenges(created_at DESC) WHERE status = 'active';

-- Full-text search indexes
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS search_vector tsvector;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_challenges_search 
ON challenges USING gin(search_vector);

-- Function to update search vector
CREATE OR REPLACE FUNCTION update_challenges_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('arabic', 
    COALESCE(NEW.title, '') || ' ' || 
    COALESCE(NEW.description, '') || ' ' ||
    COALESCE(array_to_string(NEW.tags, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update search vector
DROP TRIGGER IF EXISTS challenges_search_update ON challenges;
CREATE TRIGGER challenges_search_update
  BEFORE INSERT OR UPDATE ON challenges
  FOR EACH ROW EXECUTE FUNCTION update_challenges_search_vector();

-- 2. Optimized queries with proper joins
-- ❌ N+1 query problem
SELECT c.* FROM challenges c WHERE c.status = 'active';
-- Then for each challenge:
SELECT p.display_name FROM profiles p WHERE p.user_id = c.created_by;

-- ✅ Single optimized query
SELECT 
  c.id,
  c.title,
  c.description,
  c.status,
  c.created_at,
  p.display_name as creator_name,
  COUNT(cs.id) as submission_count
FROM challenges c
LEFT JOIN profiles p ON c.created_by = p.user_id
LEFT JOIN challenge_submissions cs ON c.id = cs.challenge_id
WHERE c.status = 'active'
GROUP BY c.id, p.display_name
ORDER BY c.created_at DESC;

-- 3. Efficient pagination
-- ❌ OFFSET-based pagination (slow for large datasets)
SELECT * FROM challenges 
ORDER BY created_at DESC 
LIMIT 20 OFFSET 1000;

-- ✅ Cursor-based pagination
SELECT * FROM challenges 
WHERE created_at < $1  -- cursor from previous page
ORDER BY created_at DESC 
LIMIT 20;

-- 4. Aggregate optimization
-- ❌ Multiple separate queries
SELECT COUNT(*) FROM challenges WHERE status = 'active';
SELECT COUNT(*) FROM challenges WHERE status = 'completed';
SELECT COUNT(*) FROM challenges WHERE status = 'draft';

-- ✅ Single query with conditional aggregation
SELECT 
  COUNT(*) FILTER (WHERE status = 'active') as active_count,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
  COUNT(*) FILTER (WHERE status = 'draft') as draft_count
FROM challenges;
```

### API Performance Optimization
```typescript
// 1. Request batching and caching
export class PerformantAPIClient {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private requestQueue = new Map<string, Promise<any>>();

  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, options);
    
    // Check cache first
    const cached = this.getFromCache<T>(cacheKey);
    if (cached) return cached;

    // Check if request is already in flight
    if (this.requestQueue.has(cacheKey)) {
      return this.requestQueue.get(cacheKey);
    }

    // Make request
    const requestPromise = this.makeRequest<T>(endpoint, options);
    this.requestQueue.set(cacheKey, requestPromise);

    try {
      const result = await requestPromise;
      this.setCache(cacheKey, result, options.ttl || 300000); // 5 minutes default
      return result;
    } finally {
      this.requestQueue.delete(cacheKey);
    }
  }

  // Batch multiple requests
  async batchGet<T>(requests: BatchRequest[]): Promise<T[]> {
    const promises = requests.map(req => this.get<T>(req.endpoint, req.options));
    return Promise.all(promises);
  }

  private makeRequest<T>(endpoint: string, options: RequestOptions): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 10000);

    return fetch(endpoint, {
      ...options,
      signal: controller.signal
    })
    .then(response => {
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .catch(error => {
      clearTimeout(timeoutId);
      throw error;
    });
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache(key: string, data: any, ttl: number) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });

    // Cleanup old cache entries
    if (this.cache.size > 1000) {
      const entries = Array.from(this.cache.entries());
      const oldEntries = entries
        .filter(([_, value]) => Date.now() - value.timestamp > value.ttl)
        .slice(0, 500);
      
      oldEntries.forEach(([key]) => this.cache.delete(key));
    }
  }

  private getCacheKey(endpoint: string, options: RequestOptions): string {
    return `${endpoint}_${JSON.stringify(options)}`;
  }
}

// 2. Response compression and optimization
export const apiOptimizations = {
  // Compress large responses
  compressResponse: (data: any): string => {
    try {
      return JSON.stringify(data);
    } catch (error) {
      console.error('Compression error:', error);
      return JSON.stringify({ error: 'Compression failed' });
    }
  },

  // Selective field loading
  buildSelectQuery: (fields: string[]): string => {
    const allowedFields = [
      'id', 'title', 'description', 'status', 'created_at', 'updated_at',
      'created_by', 'tags', 'category', 'priority'
    ];
    
    const safeFields = fields.filter(field => allowedFields.includes(field));
    return safeFields.length > 0 ? safeFields.join(',') : '*';
  },

  // Implement response streaming for large datasets
  streamResponse: async function* (query: any, batchSize = 100) {
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const batch = await query.range(offset, offset + batchSize - 1);
      
      if (batch.data && batch.data.length > 0) {
        yield batch.data;
        offset += batchSize;
        hasMore = batch.data.length === batchSize;
      } else {
        hasMore = false;
      }
    }
  }
};
```

## User Experience Performance

### Loading States and Skeletons
```typescript
// 1. Intelligent loading states
export const useLoadingState = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();

  const startLoading = (message = 'جاري التحميل...', timeout = 10000) => {
    setIsLoading(true);
    setLoadingMessage(message);

    // Auto-hide loading after timeout
    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setLoadingMessage('');
      console.warn('Loading timeout reached');
    }, timeout);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setLoadingMessage('');
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  return { isLoading, loadingMessage, startLoading, stopLoading };
};

// 2. Adaptive skeleton components
export const SkeletonCard = ({ lines = 3, showImage = true }) => (
  <div className="animate-pulse">
    {showImage && (
      <div className="h-48 bg-muted rounded-lg mb-4" />
    )}
    <div className="space-y-3">
      <div className="h-4 bg-muted rounded w-3/4" />
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i}
          className="h-3 bg-muted rounded"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  </div>
);

// 3. Progressive data loading
export const useProgressiveLoading = <T>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setProgress(0);

        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setProgress(prev => Math.min(prev + 10, 90));
        }, 100);

        const result = await fetchFunction();
        
        clearInterval(progressInterval);
        
        if (!cancelled) {
          setData(result);
          setProgress(100);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, dependencies);

  return { data, isLoading, error, progress };
};
```

### Performance Monitoring
```typescript
// 1. Real-time performance tracking
export class PerformanceTracker {
  private metrics: PerformanceEntry[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.setupObservers();
  }

  private setupObservers() {
    // Long Task Observer
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordLongTask(entry);
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);

      // Layout Shift Observer
      const layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordLayoutShift(entry);
        }
      });
      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(layoutShiftObserver);
    }
  }

  private recordLongTask(entry: PerformanceEntry) {
    if (entry.duration > 50) { // Tasks longer than 50ms
      console.warn(`⚠️ Long task detected: ${entry.duration.toFixed(2)}ms`);
      
      // Send to analytics
      this.sendMetric({
        type: 'long_task',
        duration: entry.duration,
        startTime: entry.startTime,
        url: window.location.href
      });
    }
  }

  private recordLayoutShift(entry: any) {
    if (!entry.hadRecentInput && entry.value > 0.1) {
      console.warn(`⚠️ Layout shift detected: ${entry.value.toFixed(4)}`);
      
      this.sendMetric({
        type: 'layout_shift',
        value: entry.value,
        sources: entry.sources,
        url: window.location.href
      });
    }
  }

  measureUserInteraction<T>(
    actionName: string, 
    action: () => T | Promise<T>
  ): Promise<T> {
    return new Promise(async (resolve, reject) => {
      const startTime = performance.now();
      
      try {
        const result = await action();
        const duration = performance.now() - startTime;
        
        this.sendMetric({
          type: 'user_interaction',
          action: actionName,
          duration,
          timestamp: Date.now()
        });

        // Warn about slow interactions
        if (duration > 100) {
          console.warn(`⚠️ Slow interaction: ${actionName} took ${duration.toFixed(2)}ms`);
        }

        resolve(result);
      } catch (error) {
        const duration = performance.now() - startTime;
        
        this.sendMetric({
          type: 'interaction_error',
          action: actionName,
          duration,
          error: error.message,
          timestamp: Date.now()
        });

        reject(error);
      }
    });
  }

  private sendMetric(metric: any) {
    // Send to analytics service
    fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric)
    }).catch(err => {
      console.error('Failed to send metric:', err);
    });
  }

  getPerformanceReport() {
    return {
      longTasks: this.metrics.filter(m => m.entryType === 'longtask'),
      layoutShifts: this.metrics.filter(m => m.entryType === 'layout-shift'),
      userInteractions: this.metrics.filter(m => m.name?.includes('interaction')),
      timestamp: Date.now()
    };
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics = [];
  }
}

// 2. Performance budget monitoring
export const PerformanceBudget = {
  limits: {
    firstContentfulPaint: 1800, // 1.8s
    largestContentfulPaint: 2500, // 2.5s
    firstInputDelay: 100, // 100ms
    cumulativeLayoutShift: 0.1, // 0.1
    totalBlockingTime: 200, // 200ms
    bundleSize: 500000 // 500KB
  },

  checkBudget() {
    const violations: string[] = [];

    // Check Web Vitals
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation.domContentLoadedEventEnd > this.limits.firstContentfulPaint) {
        violations.push(`FCP exceeded: ${navigation.domContentLoadedEventEnd}ms > ${this.limits.firstContentfulPaint}ms`);
      }
    }

    // Check bundle size (approximate)
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    let totalSize = 0;
    
    scripts.forEach(script => {
      // This is an approximation - in production you'd measure actual sizes
      totalSize += 100000; // Estimated 100KB per script
    });

    if (totalSize > this.limits.bundleSize) {
      violations.push(`Bundle size exceeded: ~${totalSize} bytes > ${this.limits.bundleSize} bytes`);
    }

    if (violations.length > 0) {
      console.warn('🚨 Performance budget violations:', violations);
    } else {
      console.log('✅ Performance budget: All checks passed');
    }

    return violations;
  }
};

// Initialize performance tracking
export const performanceTracker = new PerformanceTracker();
```

## Advanced Optimization Techniques

### Service Worker Implementation
```typescript
// sw.js - Service Worker for performance
const CACHE_NAME = 'ruwad-v1';
const STATIC_CACHE = 'static-v1';
const API_CACHE = 'api-v1';

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then(cache => {
        return cache.addAll([
          '/',
          '/manifest.json',
          '/offline.html',
          '/assets/icons/icon-192x192.png',
          '/assets/icons/icon-512x512.png'
        ]);
      }),
      
      // Cache API responses
      caches.open(API_CACHE)
    ])
  );
});

// Fetch event with network-first strategy for API, cache-first for static
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API requests - network first with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(API_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // Static assets - cache first
  if (request.destination === 'script' || 
      request.destination === 'style' || 
      request.destination === 'image') {
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request);
      })
    );
    return;
  }

  // HTML pages - network first with offline fallback
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return caches.match('/offline.html');
        })
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Sync offline actions when network is available
  const actions = await getOfflineActions();
  
  for (const action of actions) {
    try {
      await syncAction(action);
      await removeOfflineAction(action.id);
    } catch (error) {
      console.error('Sync failed for action:', action, error);
    }
  }
}
```

### Memory Management
```typescript
// Memory optimization utilities
export class MemoryManager {
  private refs = new Set<any>();
  private intervals = new Set<NodeJS.Timeout>();
  private eventListeners = new Map<string, () => void>();

  // Track and cleanup resources
  trackResource(resource: any) {
    this.refs.add(resource);
  }

  untrackResource(resource: any) {
    this.refs.delete(resource);
  }

  trackInterval(interval: NodeJS.Timeout) {
    this.intervals.add(interval);
  }

  trackEventListener(element: EventTarget, event: string, handler: () => void) {
    const key = `${element.constructor.name}-${event}`;
    this.eventListeners.set(key, handler);
    element.addEventListener(event, handler);
  }

  cleanup() {
    // Clear intervals
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();

    // Remove event listeners
    this.eventListeners.forEach((handler, key) => {
      const [elementType, eventType] = key.split('-');
      // Would need to track actual elements to remove listeners properly
    });
    this.eventListeners.clear();

    // Clear references
    this.refs.clear();
  }

  // Memory usage monitoring
  getMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      };
    }
    return null;
  }

  // Garbage collection hints (Chrome only)
  forceGC() {
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
    }
  }
}

// Hook for automatic memory management
export const useMemoryManager = () => {
  const managerRef = useRef(new MemoryManager());

  useEffect(() => {
    return () => {
      managerRef.current.cleanup();
    };
  }, []);

  return managerRef.current;
};
```

## Performance Testing

### Automated Performance Testing
```typescript
// Performance testing utilities
export class PerformanceTester {
  async runPerformanceTest(testName: string, iterations = 10) {
    console.log(`🧪 Running performance test: ${testName}`);
    
    const results: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      await this.executeTest(testName);
      const endTime = performance.now();
      
      results.push(endTime - startTime);
    }
    
    const stats = this.calculateStats(results);
    console.log(`📊 ${testName} results:`, stats);
    
    return stats;
  }

  private async executeTest(testName: string) {
    // Implement specific test cases
    switch (testName) {
      case 'component-render':
        return this.testComponentRender();
      case 'api-response':
        return this.testAPIResponse();
      case 'search-performance':
        return this.testSearchPerformance();
      default:
        throw new Error(`Unknown test: ${testName}`);
    }
  }

  private async testComponentRender() {
    // Measure component rendering performance
    const container = document.createElement('div');
    const startTime = performance.now();
    
    // Simulate component rendering
    container.innerHTML = '<div>Test Component</div>';
    document.body.appendChild(container);
    
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    document.body.removeChild(container);
    return performance.now() - startTime;
  }

  private async testAPIResponse() {
    const response = await fetch('/api/health');
    return response.ok;
  }

  private async testSearchPerformance() {
    // Test search functionality performance
    const searchTerm = 'test';
    const startTime = performance.now();
    
    // Simulate search
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
    
    return performance.now() - startTime;
  }

  private calculateStats(results: number[]) {
    const sorted = results.sort((a, b) => a - b);
    const avg = results.reduce((a, b) => a + b, 0) / results.length;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const median = sorted[Math.floor(sorted.length / 2)];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    
    return { avg, min, max, median, p95, results };
  }
}

// Integration with testing framework
export const performanceTester = new PerformanceTester();
```

## Best Practices

### 1. **Measurement-Driven Optimization**
- Always measure before optimizing
- Set performance budgets and monitor them
- Use real user monitoring data

### 2. **Progressive Enhancement**
- Optimize critical rendering path first
- Implement graceful degradation
- Use lazy loading strategically

### 3. **Caching Strategies**
- Implement multi-level caching
- Use service workers for offline functionality
- Cache API responses appropriately

### 4. **Resource Management**
- Monitor memory usage and prevent leaks
- Clean up resources properly
- Use efficient data structures

---

**Last Updated**: January 17, 2025  
**Guide Version**: 1.0  
**Performance Target**: <2s load time, >95 Lighthouse score