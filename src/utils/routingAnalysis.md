// Enhanced Lazy Loading with Automatic Retry Capability
// Improves on React's native lazy function with network failure recovery

import React, { ComponentType, lazy, LazyExoticComponent } from 'react';
import { debugLog } from '@/utils/debugLogger';

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  exponentialBackoff?: boolean;
  fallbackComponent?: ComponentType;
  onRetry?: (attempt: number, error: Error) => void;
  onFailure?: (error: Error, attempts: number) => void;
}

interface LazyLoadState {
  isLoading: boolean;
  error: Error | null;
  retryCount: number;
  lastAttempt: number;
}

const defaultOptions: Required<Omit<RetryOptions, 'fallbackComponent' | 'onRetry' | 'onFailure'>> = {
  maxRetries: 3,
  retryDelay: 1000,
  exponentialBackoff: true,
};

// Cache for lazy component states
const lazyStateCache = new Map<string, LazyLoadState>();

// Performance tracking
const performanceMetrics = {
  totalLoads: 0,
  successfulLoads: 0,
  failedLoads: 0,
  retrySuccesses: 0,
  averageLoadTime: 0,
  loadTimes: [] as number[],
};

/**
 * Enhanced lazy loading with automatic retry capability
 * Handles network glitches and temporary loading failures
 */
export function enhancedLazy<T extends ComponentType<any>>(
  importFunction: () => Promise<{ default: T }>,
  options: RetryOptions = {},
  componentName?: string
): LazyExoticComponent<T> {
  const {
    maxRetries,
    retryDelay,
    exponentialBackoff,
    fallbackComponent: FallbackComponent,
    onRetry,
    onFailure,
  } = { ...defaultOptions, ...options };

  const cacheKey = componentName || importFunction.toString();

  // Initialize state if not exists
  if (!lazyStateCache.has(cacheKey)) {
    lazyStateCache.set(cacheKey, {
      isLoading: false,
      error: null,
      retryCount: 0,
      lastAttempt: 0,
    });
  }

  const enhancedImportFunction = async (): Promise<{ default: T }> => {
    const state = lazyStateCache.get(cacheKey)!;
    const startTime = performance.now();
    
    state.isLoading = true;
    state.lastAttempt = Date.now();
    
    performanceMetrics.totalLoads++;

    try {
      debugLog.debug(`Enhanced Lazy: Loading component ${componentName || 'unknown'}`, {
        component: 'enhancedLazy',
        action: 'startLoad',
        attempt: state.retryCount + 1,
        maxRetries,
      });

      const result = await importFunction();
      
      // Success - reset state and update metrics
      const loadTime = performance.now() - startTime;
      performanceMetrics.loadTimes.push(loadTime);
      performanceMetrics.averageLoadTime = 
        performanceMetrics.loadTimes.reduce((a, b) => a + b, 0) / performanceMetrics.loadTimes.length;
      
      performanceMetrics.successfulLoads++;
      
      if (state.retryCount > 0) {
        debugLog.debug(`Enhanced Lazy: Component loaded after ${state.retryCount} retries`, {
          component: 'enhancedLazy',
          action: 'retrySuccess',
          componentName: componentName || 'unknown',
          loadTime,
          retries: state.retryCount,
        });
      }

      // Reset state on success
      state.isLoading = false;
      state.error = null;
      state.retryCount = 0;

      return result;
    } catch (error) {
      state.isLoading = false;
      state.error = error as Error;
      
      debugLog.warn(`Enhanced Lazy: Component load failed`, {
        component: 'enhancedLazy',
        action: 'loadError',
        componentName: componentName || 'unknown',
        attempt: state.retryCount + 1,
        maxRetries,
        error: (error as Error).message,
      });

      // Check if we should retry
      if (state.retryCount < maxRetries) {
        state.retryCount++;
        
        // Calculate delay with exponential backoff
        const delay = exponentialBackoff 
          ? retryDelay * Math.pow(2, state.retryCount - 1)
          : retryDelay;

        debugLog.debug(`Enhanced Lazy: Scheduling retry ${state.retryCount}/${maxRetries}`, {
          component: 'enhancedLazy',
          action: 'scheduleRetry',
          componentName: componentName || 'unknown',
          delay,
          nextAttempt: state.retryCount + 1,
        });

        // Call retry callback if provided
        if (onRetry) {
          onRetry(state.retryCount, error as Error);
        }

        // Wait and retry
        await new Promise(resolve => setTimeout(resolve, delay));
        return enhancedImportFunction();
      } else {
        // Max retries reached
        performanceMetrics.failedLoads++;
        
        debugLog.error(`Enhanced Lazy: Component load failed after ${maxRetries} retries`, {
          component: 'enhancedLazy',
          action: 'maxRetriesReached',
          componentName: componentName || 'unknown',
          totalAttempts: state.retryCount + 1,
          finalError: (error as Error).message,
        });

        // Call failure callback if provided
        if (onFailure) {
          onFailure(error as Error, state.retryCount + 1);
        }

        // Return fallback component or throw error
        if (FallbackComponent) {
          return { default: FallbackComponent as T };
        }
        
        throw error;
      }
    }
  };

  return lazy(enhancedImportFunction);
}

/**
 * Fallback component for failed loads
 */
export const LazyLoadError: React.FC<{ 
  error?: Error; 
  retry?: () => void; 
  componentName?: string 
}> = ({ error, retry, componentName }) => (
  <div className="min-h-[200px] flex items-center justify-center p-8">
    <div className="text-center space-y-4 max-w-md">
      <div className="text-destructive mb-2">⚠️</div>
      <h3 className="text-lg font-semibold text-destructive">
        Failed to Load Component
      </h3>
      {componentName && (
        <p className="text-sm text-muted-foreground">
          Component: {componentName}
        </p>
      )}
      {error && (
        <p className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
          {error.message}
        </p>
      )}
      <div className="flex gap-2 justify-center">
        {retry && (
          <button
            onClick={retry}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        )}
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
        >
          Reload Page
        </button>
      </div>
    </div>
  </div>
);

/**
 * Enhanced loading component with progress indication
 */
export const EnhancedLoadingFallback: React.FC<{ 
  componentName?: string;
  showProgress?: boolean;
}> = ({ componentName, showProgress = true }) => {
  const [dots, setDots] = React.useState('');

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[200px] flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          {showProgress && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-primary rounded-full opacity-75 animate-pulse"></div>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">
            Loading{componentName ? ` ${componentName}` : ''}{dots}
          </p>
          <p className="text-xs text-muted-foreground">
            Please wait while we prepare the component
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Get performance metrics for lazy loading
 */
export function getLazyLoadMetrics() {
  return {
    ...performanceMetrics,
    successRate: performanceMetrics.totalLoads > 0 
      ? (performanceMetrics.successfulLoads / performanceMetrics.totalLoads) * 100 
      : 0,
    retrySuccessRate: performanceMetrics.failedLoads > 0
      ? (performanceMetrics.retrySuccesses / performanceMetrics.failedLoads) * 100
      : 0,
  };
}

/**
 * Clear performance metrics (useful for testing or reset)
 */
export function clearLazyLoadMetrics() {
  performanceMetrics.totalLoads = 0;
  performanceMetrics.successfulLoads = 0;
  performanceMetrics.failedLoads = 0;
  performanceMetrics.retrySuccesses = 0;
  performanceMetrics.averageLoadTime = 0;
  performanceMetrics.loadTimes = [];
  lazyStateCache.clear();
}

/**
 * Preload a lazy component (useful for prefetching)
 */
export async function preloadLazyComponent<T extends ComponentType<any>>(
  importFunction: () => Promise<{ default: T }>,
  componentName?: string
): Promise<void> {
  try {
    debugLog.debug(`Enhanced Lazy: Preloading component ${componentName || 'unknown'}`, {
      component: 'enhancedLazy',
      action: 'preload',
    });
    
    await importFunction();
    
    debugLog.debug(`Enhanced Lazy: Component preloaded successfully`, {
      component: 'enhancedLazy',
      action: 'preloadSuccess',
      componentName: componentName || 'unknown',
    });
  } catch (error) {
    debugLog.warn(`Enhanced Lazy: Component preload failed`, {
      component: 'enhancedLazy',
      action: 'preloadError',
      componentName: componentName || 'unknown',
      error: (error as Error).message,
    });
  }
}
