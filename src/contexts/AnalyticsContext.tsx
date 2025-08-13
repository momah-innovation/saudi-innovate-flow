/**
 * Global Analytics Context
 * Provides app-wide analytics capabilities with RBAC
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useAnalytics, UseAnalyticsOptions, UseAnalyticsReturn } from '@/hooks/useAnalytics';
import { analyticsService } from '@/services/analytics/AnalyticsService';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';

interface AnalyticsContextType {
  // Primary analytics hook with caching
  analytics: UseAnalyticsReturn;
  
  // Convenience methods for common patterns
  trackEvent: (eventType: string, properties?: Record<string, any>) => Promise<void>;
  trackPageView: (pagePath: string, properties?: Record<string, any>) => Promise<void>;
  trackUserAction: (action: string, context?: Record<string, any>) => Promise<void>;
  
  // RBAC helpers
  canViewBasicMetrics: boolean;
  canViewAdvancedMetrics: boolean;
  canViewSecurityMetrics: boolean;
  canViewAdminMetrics: boolean;
  
  // Service access for advanced use cases
  service: typeof analyticsService;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

interface AnalyticsProviderProps {
  children: ReactNode;
  options?: UseAnalyticsOptions;
}

export function AnalyticsProvider({ 
  children, 
  options = { 
    includeRoleSpecific: true, 
    autoRefresh: true 
  } 
}: AnalyticsProviderProps) {
  const { user } = useAuth();
  const { canAccess } = useRoleAccess();
  const analytics = useAnalytics(options);
  
  // RBAC capabilities
  const canViewBasicMetrics = !!user;
  const canViewAdvancedMetrics = canAccess('canViewAnalytics');
  const canViewSecurityMetrics = canAccess('canManageSystem');
  const canViewAdminMetrics = canAccess('canManageSystem');
  
  // Event tracking methods
  const trackEvent = async (eventType: string, properties?: Record<string, any>) => {
    if (!user?.id) return;
    
    try {
      // For now, we'll just log the event since the service doesn't have trackEvent method
      // This can be implemented when analytics service is extended
      const eventData = {
        eventType,
        userId: user.id,
        timestamp: new Date().toISOString(),
        ...properties
      };
      
      // Store in session storage for debugging purposes
      const events = JSON.parse(sessionStorage.getItem('analytics_events') || '[]');
      events.push(eventData);
      sessionStorage.setItem('analytics_events', JSON.stringify(events.slice(-100))); // Keep last 100 events
      
    } catch (error) {
      // Silent fail for analytics to not impact user experience
      console.warn('Failed to track event:', error);
    }
  };
  
  const trackPageView = async (pagePath: string, properties?: Record<string, any>) => {
    await trackEvent('page_view', { page: pagePath, ...properties });
  };
  
  const trackUserAction = async (action: string, context?: Record<string, any>) => {
    await trackEvent('user_action', { action, ...context });
  };
  
  const contextValue: AnalyticsContextType = {
    analytics,
    trackEvent,
    trackPageView,
    trackUserAction,
    canViewBasicMetrics,
    canViewAdvancedMetrics,
    canViewSecurityMetrics,
    canViewAdminMetrics,
    service: analyticsService
  };
  
  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
}

/**
 * Hook to access analytics throughout the app
 */
export function useAppAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAppAnalytics must be used within AnalyticsProvider');
  }
  return context;
}

/**
 * Higher-order component for analytics-enabled components
 */
export function withAnalytics<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return function AnalyticsWrappedComponent(props: P) {
    const { trackPageView } = useAppAnalytics();
    
    React.useEffect(() => {
      trackPageView(componentName);
    }, [trackPageView]);
    
    return <Component {...props} />;
  };
}