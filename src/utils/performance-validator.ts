/**
 * Performance Testing and Validation Utilities
 * Measures actual navigation time improvements and performance metrics
 */

import React from 'react';
import { debugLog } from '@/utils/debugLogger';

interface PerformanceMetrics {
  navigationTime: number;
  databaseCalls: number;
  componentRenders: number;
  cacheHits: number;
  timestamp: number;
}

class PerformanceValidator {
  private metrics: PerformanceMetrics[] = [];
  private navigationStartTime: number = 0;
  private databaseCallCount: number = 0;
  private renderCount: number = 0;
  private cacheHitCount: number = 0;

  /**
   * Start measuring navigation performance
   */
  startNavigationMeasurement(route: string): void {
    this.navigationStartTime = performance.now();
    this.databaseCallCount = 0;
    this.renderCount = 0;
    this.cacheHitCount = 0;
    
    debugLog.log('🚀 Performance measurement started', { route, startTime: this.navigationStartTime });
  }

  /**
   * Complete navigation measurement and record metrics
   */
  completeNavigationMeasurement(route: string): PerformanceMetrics {
    const endTime = performance.now();
    const navigationTime = endTime - this.navigationStartTime;
    
    const metrics: PerformanceMetrics = {
      navigationTime,
      databaseCalls: this.databaseCallCount,
      componentRenders: this.renderCount,
      cacheHits: this.cacheHitCount,
      timestamp: Date.now()
    };
    
    this.metrics.push(metrics);
    
    debugLog.log('📊 Navigation completed', {
      route,
      navigationTime: `${navigationTime.toFixed(2)}ms`,
      databaseCalls: this.databaseCallCount,
      componentRenders: this.renderCount,
      cacheHits: this.cacheHitCount,
      target: '500ms',
      isWithinTarget: navigationTime < 500
    });
    
    // Log performance status
    if (navigationTime < 500) {
      console.log(`✅ PERFORMANCE TARGET MET: ${navigationTime.toFixed(2)}ms < 500ms`);
    } else {
      console.warn(`⚠️ PERFORMANCE TARGET MISSED: ${navigationTime.toFixed(2)}ms > 500ms`);
    }
    
    return metrics;
  }

  /**
   * Record database call (should be minimized with optimizations)
   */
  recordDatabaseCall(query: string): void {
    this.databaseCallCount++;
    debugLog.log('📊 Database call recorded', { 
      query: query.substring(0, 50) + '...', 
      totalCalls: this.databaseCallCount 
    });
  }

  /**
   * Record component render (should be minimized with React.memo)
   */
  recordComponentRender(componentName: string): void {
    this.renderCount++;
    debugLog.log('🔄 Component render recorded', { 
      component: componentName, 
      totalRenders: this.renderCount 
    });
  }

  /**
   * Record cache hit (should be maximized with optimizations)
   */
  recordCacheHit(cacheKey: string): void {
    this.cacheHitCount++;
    debugLog.log('💾 Cache hit recorded', { 
      cacheKey, 
      totalHits: this.cacheHitCount 
    });
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    averageNavigationTime: number;
    totalNavigations: number;
    targetAchievementRate: number;
    averageDatabaseCalls: number;
    averageRenders: number;
    averageCacheHits: number;
  } {
    if (this.metrics.length === 0) {
      return {
        averageNavigationTime: 0,
        totalNavigations: 0,
        targetAchievementRate: 0,
        averageDatabaseCalls: 0,
        averageRenders: 0,
        averageCacheHits: 0
      };
    }

    const totalNavigationTime = this.metrics.reduce((sum, m) => sum + m.navigationTime, 0);
    const targetsAchieved = this.metrics.filter(m => m.navigationTime < 500).length;
    const totalDatabaseCalls = this.metrics.reduce((sum, m) => sum + m.databaseCalls, 0);
    const totalRenders = this.metrics.reduce((sum, m) => sum + m.componentRenders, 0);
    const totalCacheHits = this.metrics.reduce((sum, m) => sum + m.cacheHits, 0);

    return {
      averageNavigationTime: totalNavigationTime / this.metrics.length,
      totalNavigations: this.metrics.length,
      targetAchievementRate: (targetsAchieved / this.metrics.length) * 100,
      averageDatabaseCalls: totalDatabaseCalls / this.metrics.length,
      averageRenders: totalRenders / this.metrics.length,
      averageCacheHits: totalCacheHits / this.metrics.length
    };
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    const summary = this.getPerformanceSummary();
    
    return `
🚀 PERFORMANCE OPTIMIZATION REPORT
=====================================

📊 NAVIGATION PERFORMANCE:
- Average Time: ${summary.averageNavigationTime.toFixed(2)}ms
- Target (<500ms): ${summary.targetAchievementRate.toFixed(1)}% achieved
- Total Navigations: ${summary.totalNavigations}

💾 DATABASE OPTIMIZATION:
- Average DB Calls: ${summary.averageDatabaseCalls.toFixed(1)} per navigation
- Target Reduction: ${summary.averageDatabaseCalls < 5 ? '✅ ACHIEVED' : '⚠️ NEEDS IMPROVEMENT'}

🔄 COMPONENT OPTIMIZATION:
- Average Renders: ${summary.averageRenders.toFixed(1)} per navigation
- Cache Hits: ${summary.averageCacheHits.toFixed(1)} per navigation

🎯 OVERALL STATUS: ${summary.targetAchievementRate > 80 ? '✅ EXCELLENT' : 
                     summary.targetAchievementRate > 60 ? '🟡 GOOD' : '🔴 NEEDS WORK'}
=====================================
    `;
  }
}

// Global performance validator instance
export const performanceValidator = new PerformanceValidator();

/**
 * HOC to measure component render performance
 */
export function withPerformanceMeasurement<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  componentName: string
) {
  return function PerformanceMeasuredComponent(props: T) {
    React.useEffect(() => {
      performanceValidator.recordComponentRender(componentName);
    });

    return React.createElement(WrappedComponent, props);
  };
}

/**
 * Hook to measure navigation performance
 */
export function useNavigationPerformance() {
  const startMeasurement = React.useCallback((route: string) => {
    performanceValidator.startNavigationMeasurement(route);
  }, []);

  const completeMeasurement = React.useCallback((route: string) => {
    return performanceValidator.completeNavigationMeasurement(route);
  }, []);

  const getSummary = React.useCallback(() => {
    return performanceValidator.getPerformanceSummary();
  }, []);

  const generateReport = React.useCallback(() => {
    return performanceValidator.generateReport();
  }, []);

  return {
    startMeasurement,
    completeMeasurement,
    getSummary,
    generateReport
  };
}