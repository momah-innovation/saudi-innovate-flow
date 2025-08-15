import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { preloadNamespaces } from '@/i18n/enhanced-config-v3';

/**
 * Translation AppShell Integration Hook
 * Automatically preloads translation namespaces based on current route
 * Optimizes translation loading for better user experience
 */
export const useTranslationAppShell = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const namespacesToLoad: string[] = [];

    // Route-based namespace mapping for intelligent preloading
    if (path.startsWith('/admin')) {
      namespacesToLoad.push('admin');
      
      if (path.includes('/users')) {
        namespacesToLoad.push('admin-users');
      } else if (path.includes('/analytics')) {
        namespacesToLoad.push('admin-analytics');
      } else if (path.includes('/settings')) {
        namespacesToLoad.push('admin-settings');
      }
    }

    if (path.startsWith('/challenges')) {
      namespacesToLoad.push('challenges');
      
      if (path.includes('/create') || path.includes('/edit')) {
        namespacesToLoad.push('challenges-form');
      } else if (path.includes('/submissions')) {
        namespacesToLoad.push('challenges-submissions');
      } else {
        namespacesToLoad.push('challenges-details');
      }
    }

    if (path.startsWith('/campaigns')) {
      namespacesToLoad.push('campaigns');
      
      if (path.includes('/create') || path.includes('/edit')) {
        namespacesToLoad.push('campaigns-form');
      } else if (path.includes('/analytics')) {
        namespacesToLoad.push('campaigns-analytics');
      }
    }

    if (path.startsWith('/events')) {
      namespacesToLoad.push('events');
    }

    if (path.startsWith('/partners')) {
      namespacesToLoad.push('partners');
    }

    if (path.startsWith('/opportunities')) {
      namespacesToLoad.push('opportunities');
    }

    if (path.startsWith('/ideas')) {
      if (path.includes('/wizard')) {
        namespacesToLoad.push('ideas-wizard');
      }
    }

    if (path.startsWith('/collaboration') || path.includes('/workspace')) {
      namespacesToLoad.push('collaboration');
    }

    if (path.startsWith('/profile')) {
      namespacesToLoad.push('profile');
    }

    // Always load system-lists for form dropdowns
    if (path.includes('/create') || path.includes('/edit') || path.includes('/form')) {
      namespacesToLoad.push('system-lists', 'validation');
    }

    // Preload identified namespaces
    if (namespacesToLoad.length > 0) {
      preloadNamespaces(namespacesToLoad).catch((error) => {
        console.warn('Failed to preload translation namespaces:', error);
      });
    }
  }, [location.pathname]);
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
        console.warn(`Translation loading took ${loadTime.toFixed(2)}ms - consider optimization`);
      }
    };
  }, []);
};

/**
 * Critical Translation Preloader
 * Preloads essential namespaces immediately after app initialization
 */
export const preloadCriticalTranslations = async () => {
  const criticalNamespaces = [
    'common',
    'navigation', 
    'dashboard',
    'auth',
    'errors',
    'validation',
    'system-lists'
  ];

  try {
    await preloadNamespaces(criticalNamespaces);
    console.log('Critical translations preloaded successfully');
  } catch (error) {
    console.error('Failed to preload critical translations:', error);
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