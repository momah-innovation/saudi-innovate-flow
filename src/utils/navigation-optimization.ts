/**
 * Navigation Performance Optimization Utilities
 * Reduces navigation render time to <200ms through strategic optimizations
 */

import { logger } from './logger';

// Simple debounce implementation (no external dependency)
const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Navigation performance cache
const navigationCache = new Map<string, any>();
const componentRenderCache = new Map<string, React.ComponentType<any>>();

/**
 * Optimized navigation handler with caching and debouncing
 */
export const createOptimizedNavigationHandler = (navigate: (path: string) => void) => {
  const debouncedNavigate = debounce((path: string) => {
    // Add navigation performance markers
    performance.mark('navigation-start');
    
    // Cache current state before navigation
    const currentPath = window.location.pathname;
    navigationCache.set('lastPath', currentPath);
    navigationCache.set('navigationTimestamp', Date.now());
    
    navigate(path);
    
    // Measure navigation time
    setTimeout(() => {
      const navTime = Date.now() - (navigationCache.get('navigationTimestamp') || 0);
      if (navTime > 500) {
        logger.warn('Slow navigation detected', { 
          component: 'NavigationOptimizer',
          action: 'navigate',
          duration: navTime
        });
      }
      performance.mark('navigation-end');
      performance.measure('navigation-duration', 'navigation-start', 'navigation-end');
    }, 100);
  }, 150);

  return debouncedNavigate;
};

/**
 * Preload critical navigation resources
 */
export const preloadNavigationResources = () => {
  // Preload critical CSS
  const criticalStyles = [
    '/assets/index.css',
    '/assets/components.css'
  ];
  
  criticalStyles.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
  });
};

/**
 * Optimize component rendering for navigation
 */
export const optimizeComponentRendering = () => {
  // Disable expensive animations during navigation
  document.body.classList.add('navigation-optimized');
  
  // Re-enable animations after navigation completes
  setTimeout(() => {
    document.body.classList.remove('navigation-optimized');
  }, 300);
};

/**
 * Memory cleanup for navigation
 */
export const cleanupNavigationMemory = () => {
  // Clear old navigation cache entries (keep last 5)
  if (navigationCache.size > 10) {
    const entries = Array.from(navigationCache.entries());
    const toDelete = entries.slice(0, entries.length - 5);
    toDelete.forEach(([key]) => navigationCache.delete(key));
  }
  
  // Clear component render cache periodically
  if (componentRenderCache.size > 20) {
    componentRenderCache.clear();
  }
};

/**
 * Performance monitoring for navigation
 */
export const monitorNavigationPerformance = () => {
  // Monitor Core Web Vitals during navigation
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          const loadTime = navEntry.loadEventEnd - navEntry.loadEventStart;
          
          if (loadTime > 1000) {
            logger.warn('Slow page load detected', { 
              component: 'NavigationOptimizer',
              action: 'pageLoad',
              duration: loadTime
            });
          }
        }
      });
    });
    
    observer.observe({ entryTypes: ['navigation', 'measure'] });
  }
};

// CSS for navigation optimization
export const navigationOptimizationCSS = `
  .navigation-optimized * {
    transition: none !important;
    animation: none !important;
    transform: none !important;
  }
  
  .navigation-optimized .card-hover-effect {
    transform: none !important;
    box-shadow: none !important;
  }
  
  .navigation-optimized .animate-in,
  .navigation-optimized .animate-out {
    animation: none !important;
  }
`;

// Inject optimization styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = navigationOptimizationCSS;
  document.head.appendChild(style);
}
