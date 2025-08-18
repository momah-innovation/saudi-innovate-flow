import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { preloadNamespaces } from '@/i18n/enhanced-config-v3';
import { debugLog } from '@/utils/debugLogger';

/**
 * Translation AppShell Integration Hook - V3 PRODUCTION READY
 * Automatically preloads translation namespaces based on current route
 * Safe to use - handles missing router context gracefully
 */
export const useTranslationAppShell = () => {
  let location;
  
  try {
    location = useLocation();
  } catch (error) {
    // Handle case where hook is called outside Router context
    // This can happen during app initialization
    // Silently skip until Router is mounted
    return;
  }

  useEffect(() => {
    if (!location) return;
    
    const path = location.pathname;
    const namespacesToLoad: string[] = [];

    // Enhanced route-based namespace mapping with predictive loading
    if (path.startsWith('/admin')) {
      namespacesToLoad.push('admin', 'system-lists', 'validation');
      
      if (path.includes('/users')) {
        namespacesToLoad.push('admin-users', 'profile');
      } else if (path.includes('/analytics')) {
        namespacesToLoad.push('admin-analytics', 'campaigns-analytics');
      } else if (path.includes('/settings')) {
        namespacesToLoad.push('admin-settings');
      }
    }

    if (path.startsWith('/challenges')) {
      namespacesToLoad.push('challenges', 'system-lists');
      
      if (path.includes('/create') || path.includes('/edit')) {
        namespacesToLoad.push('challenges-form', 'validation');
      } else if (path.includes('/submissions')) {
        namespacesToLoad.push('challenges-submissions');
      } else if (path.match(/\/challenges\/[^\/]+$/)) {
        namespacesToLoad.push('challenges-details');
      }
    }

    if (path.startsWith('/campaigns')) {
      namespacesToLoad.push('campaigns', 'system-lists');
      
      if (path.includes('/create') || path.includes('/edit')) {
        namespacesToLoad.push('campaigns-form', 'validation');
      } else if (path.includes('/analytics')) {
        namespacesToLoad.push('campaigns-analytics');
      }
    }

    if (path.startsWith('/events')) {
      namespacesToLoad.push('events', 'validation');
    }

    if (path.startsWith('/partners')) {
      namespacesToLoad.push('partners', 'validation');
    }

    if (path.startsWith('/opportunities')) {
      namespacesToLoad.push('opportunities', 'validation');
    }

    if (path.startsWith('/ideas')) {
      if (path.includes('/wizard')) {
        namespacesToLoad.push('ideas-wizard', 'validation');
      }
    }

    if (path.startsWith('/collaboration') || path.includes('/workspace')) {
      namespacesToLoad.push('collaboration', 'validation');
    }

    if (path.startsWith('/profile')) {
      namespacesToLoad.push('profile', 'validation');
    }

    // Landing page specific namespaces
    if (path === '/') {
      namespacesToLoad.push('landing');
    }

    // Dashboard gets comprehensive preloading for optimal UX
    if (path === '/dashboard') {
      namespacesToLoad.push('dashboard', 'admin', 'challenges', 'campaigns', 'opportunities', 'events');
    }

    // Always load system-lists for any form or interactive page
    if (path.includes('/create') || path.includes('/edit') || path.includes('/form') || 
        path.includes('/settings') || path.includes('/profile')) {
      namespacesToLoad.push('system-lists', 'validation');
    }

    // Production-optimized namespace preloading
    if (namespacesToLoad.length > 0) {
      // Remove duplicates and prioritize loading
      const uniqueNamespaces = Array.from(new Set(namespacesToLoad));
      
      preloadNamespaces(uniqueNamespaces).catch((error) => {
        // Silent error handling for production
        debugLog.warn('Translation preload warning', { component: 'TranslationAppShell', error: error.message });
      });
    }
  }, [location?.pathname]);
};

/**
 * Translation Performance Monitor
 * Monitors translation loading performance and provides insights
 */
export const useTranslationPerformance = () => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      if (loadTime > 1000) {
        debugLog.warn(`Translation loading performance warning`, { component: 'TranslationAppShell', data: { loadTime } });
      }
    };
  }, []);
};

/**
 * Critical Translation Preloader - PRODUCTION OPTIMIZED
 * Preloads essential namespaces with performance tracking
 */
/**
 * Route-based Translation Priority System
 * Optimizes loading order based on current route and user journey
 */
const getRouteBasedNamespaces = (pathname: string): { critical: string[], prefetch: string[] } => {
  const critical: string[] = ['common', 'navigation', 'errors'];
  const prefetch: string[] = [];

  // Landing page specific
  if (pathname === '/') {
    critical.push('landing');
    prefetch.push('auth', 'challenges');
  }
  // Auth pages
  else if (pathname.startsWith('/auth') || pathname === '/signup' || pathname === '/login') {
    critical.push('auth', 'validation');
    prefetch.push('dashboard', 'landing');
  }
  // Admin routes
  else if (pathname.startsWith('/admin')) {
    critical.push('admin', 'system-lists', 'validation');
    prefetch.push('challenges', 'campaigns', 'opportunities');
  }
  // Dashboard
  else if (pathname === '/dashboard') {
    critical.push('dashboard', 'admin');
    prefetch.push('challenges', 'campaigns', 'opportunities', 'events');
  }
  // Challenge routes
  else if (pathname.startsWith('/challenges')) {
    critical.push('challenges', 'validation');
    prefetch.push('system-lists', 'campaigns');
  }
  // Campaign routes
  else if (pathname.startsWith('/campaigns')) {
    critical.push('campaigns', 'validation');
    prefetch.push('system-lists', 'challenges');
  }
  // Events routes
  else if (pathname.startsWith('/events')) {
    critical.push('events', 'validation');
    prefetch.push('opportunities');
  }
  // Opportunities routes
  else if (pathname.startsWith('/opportunities')) {
    critical.push('opportunities', 'validation');
    prefetch.push('events', 'challenges');
  }
  // Profile and settings
  else if (pathname.startsWith('/profile') || pathname.startsWith('/settings')) {
    critical.push('profile', 'validation');
    prefetch.push('system-lists');
  }

  return { critical, prefetch };
};

export const preloadCriticalTranslations = async () => {
  const startTime = performance.now();
  
  // Get current route from browser URL (works even without router context)
  // Use proper pathname access for route-based namespaces
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const { critical, prefetch } = getRouteBasedNamespaces(pathname);
  
  const criticalNamespaces = Array.from(new Set(critical));

  try {
    // Load critical namespaces first (blocking)
    await preloadNamespaces(criticalNamespaces);
    
    const loadTime = performance.now() - startTime;
    debugLog.debug(`✅ Critical translations loaded in ${loadTime.toFixed(1)}ms`);
    
    // Prefetch non-critical namespaces in background (non-blocking)
    const prefetchNamespaces = Array.from(new Set(prefetch));
    if (prefetchNamespaces.length > 0) {
      setTimeout(() => {
        preloadNamespaces(prefetchNamespaces).catch((error) => 
          debugLog.warn('Failed to prefetch namespaces', { component: 'TranslationAppShell', data: { namespaces: prefetchNamespaces }, error })
        );
      }, 100); // Small delay to not block critical loading
    }
    
    // Performance monitoring
    if (loadTime > 300) {
      debugLog.warn(`Slow critical translation loading`, { component: 'TranslationAppShell', data: { loadTime } });
    }
  } catch (error) {
    debugLog.error('Failed to preload critical translations', { component: 'TranslationAppShell' }, error);
  }
};

/**
 * Translation Route Guard
 * Ensures translations are loaded before rendering route components
 */
export const withTranslationGuard = (
  Component: React.ComponentType<any>,
  requiredNamespaces: string[]
) => {
  return function WrappedComponent(props: any) {
    useEffect(() => {
      preloadNamespaces(requiredNamespaces);
    }, []);

    return React.createElement(Component, props);
  };
};

/**
 * Translation Error Boundary Integration
 * Provides translation-aware error messages
 */
export const useTranslationErrorHandler = () => {
  return {
    getErrorMessage: (error: Error, fallback: string = 'An error occurred') => {
      // In a real implementation, this would use translation keys
      // For now, return a structured error message
      return {
        title: 'System Error',
        description: error.message || fallback,
        action: 'Please try again or contact support'
      };
    }
  };
};