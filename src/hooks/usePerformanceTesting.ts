/**
 * Performance Testing Integration Hooks
 * Provides performance monitoring and validation for React components
 */

import React from 'react';
import { performanceValidator } from '@/utils/performance-validator';
import { navigationStateMachine, useNavigationState } from '@/utils/NavigationStateMachine';

/**
 * Hook to measure component performance
 */
export function useComponentPerformance(componentName: string) {
  const renderCountRef = React.useRef(0);
  
  React.useEffect(() => {
    renderCountRef.current++;
    performanceValidator.recordComponentRender(componentName);
  });

  return {
    renderCount: renderCountRef.current,
    recordDatabaseCall: (query: string) => performanceValidator.recordDatabaseCall(query),
    recordCacheHit: (cacheKey: string) => performanceValidator.recordCacheHit(cacheKey)
  };
}

/**
 * Hook for navigation performance testing
 */
export function useNavigationTesting() {
  const { state, metrics } = useNavigationState();
  
  return {
    navigationState: state,
    navigationMetrics: metrics,
    isNavigating: state.loading,
    lastNavigationTime: state.timestamp,
    generateReport: () => performanceValidator.generateReport()
  };
}

/**
 * Higher-order component for performance monitoring
 */
export function withPerformanceMonitoring<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  componentName: string
) {
  return React.memo(function PerformanceMonitoredComponent(props: T) {
    const { recordDatabaseCall, recordCacheHit } = useComponentPerformance(componentName);
    
    // Add performance monitoring props
    const enhancedProps = {
      ...props,
      onDatabaseCall: recordDatabaseCall,
      onCacheHit: recordCacheHit
    } as T;
    
    return React.createElement(WrappedComponent, enhancedProps);
  });
}

/**
 * Performance validation component for testing
 */
export function PerformanceTestingPanel() {
  const { navigationMetrics, generateReport } = useNavigationTesting();
  const [report, setReport] = React.useState<string>('');
  
  const handleGenerateReport = () => {
    const newReport = generateReport();
    setReport(newReport);
  };
  
  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }
  
  return React.createElement('div', {
    className: "fixed bottom-4 right-4 bg-card border rounded-lg p-4 shadow-lg max-w-md"
  }, [
    React.createElement('h3', { key: 'title', className: "font-semibold mb-2" }, 'Performance Monitor'),
    React.createElement('div', { key: 'metrics', className: "space-y-1 text-sm" }, [
      React.createElement('div', { key: 'nav' }, `Avg Navigation: ${navigationMetrics.averageTransitionTime.toFixed(0)}ms`),
      React.createElement('div', { key: 'success' }, `Success Rate: ${navigationMetrics.successRate.toFixed(1)}%`),
      React.createElement('div', { key: 'total' }, `Total Transitions: ${navigationMetrics.totalTransitions}`)
    ]),
    React.createElement('button', {
      key: 'button',
      onClick: handleGenerateReport,
      className: "mt-2 px-3 py-1 bg-primary text-primary-foreground rounded text-sm"
    }, 'Generate Report'),
    report && React.createElement('pre', {
      key: 'report',
      className: "mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-32"
    }, report)
  ]);
}

/**
 * Hook for database performance testing
 */
export function useDatabasePerformance() {
  const callCount = React.useRef(0);
  
  const recordCall = React.useCallback((operation: string) => {
    callCount.current++;
    performanceValidator.recordDatabaseCall(operation);
  }, []);
  
  return {
    totalCalls: callCount.current,
    recordCall
  };
}