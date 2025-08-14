import React from 'react';
// Performance Monitor for System Optimization
// Tracks and analyzes application performance metrics

import { debugLog } from '@/utils/debugLogger';

interface PerformanceMetric {
  label: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface MetricStats {
  count: number;
  avg: number;
  min: number;
  max: number;
  p95: number;
  recent: number[];
}

export class PerformanceMonitor {
  private metrics = new Map<string, PerformanceMetric[]>();
  private maxMetricsPerLabel = 1000;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Start periodic cleanup
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  startTimer(label: string, metadata?: Record<string, any>): () => void {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(label, duration, metadata);
    };
  }

  recordMetric(label: string, duration: number, metadata?: Record<string, any>): void {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }

    const metrics = this.metrics.get(label)!;
    
    // Add new metric
    metrics.push({
      label,
      duration,
      timestamp: Date.now(),
      metadata
    });

    // Trim old metrics if we exceed the limit
    if (metrics.length > this.maxMetricsPerLabel) {
      metrics.splice(0, metrics.length - this.maxMetricsPerLabel);
    }

    // Log slow operations
    if (duration > 1000) {
      debugLog.warn('Slow operation detected', {
        component: 'PerformanceMonitor',
        action: 'recordMetric',
        label,
        duration,
        metadata
      });
    }

    debugLog.debug('Performance metric recorded', {
      component: 'PerformanceMonitor',
      action: 'recordMetric',
      label,
      duration,
      metadata
    });
  }

  getStats(label: string): MetricStats | null {
    const metrics = this.metrics.get(label);
    if (!metrics || metrics.length === 0) return null;

    const durations = metrics.map(m => m.duration).sort((a, b) => a - b);
    const recentMetrics = metrics.slice(-10); // Last 10 measurements

    return {
      count: durations.length,
      avg: durations.reduce((a, b) => a + b, 0) / durations.length,
      min: durations[0],
      max: durations[durations.length - 1],
      p95: durations[Math.floor(durations.length * 0.95)],
      recent: recentMetrics.map(m => m.duration)
    };
  }

  getAllStats(): Map<string, MetricStats> {
    const stats = new Map<string, MetricStats>();
    
    for (const label of this.metrics.keys()) {
      const stat = this.getStats(label);
      if (stat) {
        stats.set(label, stat);
      }
    }

    return stats;
  }

  getSlowOperations(threshold = 1000): PerformanceMetric[] {
    const slowOps: PerformanceMetric[] = [];
    
    for (const metrics of this.metrics.values()) {
      for (const metric of metrics) {
        if (metric.duration > threshold) {
          slowOps.push(metric);
        }
      }
    }

    return slowOps.sort((a, b) => b.duration - a.duration);
  }

  // Get real-time browser performance metrics
  getBrowserMetrics(): Record<string, any> {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    const memory = (performance as any).memory;

    return {
      navigation: navigation ? {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstByte: navigation.responseStart - navigation.fetchStart,
        domInteractive: navigation.domInteractive - navigation.fetchStart
      } : null,
      paint: paint.reduce((acc, entry) => {
        acc[entry.name] = entry.startTime;
        return acc;
      }, {} as Record<string, number>),
      memory: memory ? {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      } : null,
      connection: (navigator as any).connection ? {
        effectiveType: (navigator as any).connection.effectiveType,
        rtt: (navigator as any).connection.rtt,
        downlink: (navigator as any).connection.downlink
      } : null
    };
  }

  // Monitor component render times
  wrapComponent<T extends React.ComponentType<any>>(
    Component: T,
    displayName?: string
  ): T {
    const WrappedComponent = (props: any) => {
      const endTimer = this.startTimer(`component-render:${displayName || Component.displayName || Component.name}`);
      
      try {
        // Handle both functional and class components
        if (typeof Component === 'function') {
          const result = (Component as React.FunctionComponent)(props);
          endTimer();
          return result;
        } else {
          // For class components, create an instance
          const result = React.createElement(Component, props);
          endTimer();
          return result;
        }
      } catch (error) {
        endTimer();
        throw error;
      }
    };

    WrappedComponent.displayName = `PerformanceMonitor(${displayName || Component.displayName || Component.name})`;
    return WrappedComponent as T;
  }

  // Cleanup old metrics
  private cleanup(): void {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    let totalCleaned = 0;

    for (const [label, metrics] of this.metrics.entries()) {
      const initialLength = metrics.length;
      const filteredMetrics = metrics.filter(m => m.timestamp > oneHourAgo);
      
      this.metrics.set(label, filteredMetrics);
      totalCleaned += initialLength - filteredMetrics.length;
    }

    if (totalCleaned > 0) {
      debugLog.debug('Performance metrics cleaned up', {
        component: 'PerformanceMonitor',
        action: 'cleanup',
        cleanedCount: totalCleaned
      });
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.metrics.clear();
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Utility function for timing async operations
export async function timeAsync<T>(
  operation: () => Promise<T>,
  label: string,
  metadata?: Record<string, any>
): Promise<T> {
  const endTimer = performanceMonitor.startTimer(label, metadata);
  try {
    const result = await operation();
    endTimer();
    return result;
  } catch (error) {
    endTimer();
    throw error;
  }
}

// Utility function for timing synchronous operations
export function timeSync<T>(
  operation: () => T,
  label: string,
  metadata?: Record<string, any>
): T {
  const endTimer = performanceMonitor.startTimer(label, metadata);
  try {
    const result = operation();
    endTimer();
    return result;
  } catch (error) {
    endTimer();
    throw error;
  }
}