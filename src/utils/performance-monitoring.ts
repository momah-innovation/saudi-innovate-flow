/**
 * Performance Budget Monitoring
 * Tracks and enforces performance budgets in production
 */

interface PerformanceBudget {
  // Bundle size limits (in bytes)
  maxBundleSize: number
  maxChunkSize: number
  
  // Core Web Vitals thresholds
  maxLCP: number // Largest Contentful Paint (ms)
  maxFID: number // First Input Delay (ms)
  maxCLS: number // Cumulative Layout Shift
  
  // Network and runtime limits
  maxLoadTime: number // Page load time (ms)
  maxAPIResponseTime: number // API response time (ms)
  maxMemoryUsage: number // Memory usage (MB)
}

export const PERFORMANCE_BUDGET: PerformanceBudget = {
  maxBundleSize: 1024 * 1024, // 1MB
  maxChunkSize: 512 * 1024,   // 512KB
  maxLCP: 2500,               // 2.5s
  maxFID: 100,                // 100ms
  maxCLS: 0.1,                // 0.1
  maxLoadTime: 3000,          // 3s
  maxAPIResponseTime: 500,    // 500ms
  maxMemoryUsage: 100         // 100MB
}

export class PerformanceMonitor {
  private static vitals: Record<string, number> = {}
  
  /**
   * Initialize Core Web Vitals monitoring
   */
  static initializeMonitoring(): void {
    // LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.vitals.lcp = lastEntry.startTime
        this.checkBudget('lcp', lastEntry.startTime)
      })
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      
      // FID (First Input Delay)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime
          this.vitals.fid = fid
          this.checkBudget('fid', fid)
        })
      })
      
      fidObserver.observe({ entryTypes: ['first-input'] })
      
      // CLS (Cumulative Layout Shift)
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            this.vitals.cls = clsValue
            this.checkBudget('cls', clsValue)
          }
        })
      })
      
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    }
    
    // Monitor page load time
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart
      this.vitals.loadTime = loadTime
      this.checkBudget('loadTime', loadTime)
    })
  }
  
  /**
   * Check if metric exceeds budget
   */
  private static checkBudget(metric: string, value: number): void {
    const budgetMap: Record<string, number> = {
      lcp: PERFORMANCE_BUDGET.maxLCP,
      fid: PERFORMANCE_BUDGET.maxFID,
      cls: PERFORMANCE_BUDGET.maxCLS,
      loadTime: PERFORMANCE_BUDGET.maxLoadTime
    }
    
    const budget = budgetMap[metric]
    if (budget && value > budget) {
      console.warn(`Performance budget exceeded for ${metric}: ${value} > ${budget}`)
      
      // Send to monitoring service in production
      this.reportPerformanceIssue(metric, value, budget)
    }
  }
  
  /**
   * Monitor API response times
   */
  static monitorAPICall<T>(
    apiCall: Promise<T>, 
    endpoint: string
  ): Promise<T> {
    const startTime = performance.now()
    
    return apiCall
      .then((result) => {
        const responseTime = performance.now() - startTime
        
        if (responseTime > PERFORMANCE_BUDGET.maxAPIResponseTime) {
          console.warn(`API response time exceeded for ${endpoint}: ${responseTime}ms`)
          this.reportPerformanceIssue('api', responseTime, PERFORMANCE_BUDGET.maxAPIResponseTime)
        }
        
        return result
      })
      .catch((error) => {
        const responseTime = performance.now() - startTime
        console.error(`API call failed for ${endpoint} after ${responseTime}ms:`, error)
        throw error
      })
  }
  
  /**
   * Monitor memory usage
   */
  static monitorMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      const usedMB = memory.usedJSHeapSize / 1024 / 1024
      
      if (usedMB > PERFORMANCE_BUDGET.maxMemoryUsage) {
        console.warn(`Memory usage exceeded: ${usedMB}MB > ${PERFORMANCE_BUDGET.maxMemoryUsage}MB`)
        this.reportPerformanceIssue('memory', usedMB, PERFORMANCE_BUDGET.maxMemoryUsage)
      }
    }
  }
  
  /**
   * Get current performance metrics
   */
  static getMetrics(): Record<string, number> {
    return { ...this.vitals }
  }
  
  /**
   * Report performance issues to monitoring service
   */
  private static reportPerformanceIssue(
    metric: string, 
    value: number, 
    budget: number
  ): void {
    // In production, send to monitoring service (Sentry, DataDog, etc.)
    if (import.meta.env.PROD) {
      // Example: Send to Sentry
      console.log('Performance issue reported:', { metric, value, budget })
    }
  }
  
  /**
   * Generate performance report
   */
  static generateReport(): {
    metrics: Record<string, number>
    budgetStatus: Record<string, boolean>
    recommendations: string[]
  } {
    const metrics = this.getMetrics()
    const budgetStatus: Record<string, boolean> = {}
    const recommendations: string[] = []
    
    // Check each metric against budget
    Object.entries(metrics).forEach(([key, value]) => {
      const budgetKey = `max${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof PerformanceBudget
      const budget = PERFORMANCE_BUDGET[budgetKey] as number
      
      if (budget) {
        budgetStatus[key] = value <= budget
        
        if (value > budget) {
          recommendations.push(`Optimize ${key}: ${value} exceeds budget of ${budget}`)
        }
      }
    })
    
    // Add general recommendations
    if (metrics.lcp > 2000) {
      recommendations.push('Consider optimizing largest content element loading')
    }
    
    if (metrics.cls > 0.05) {
      recommendations.push('Reduce layout shifts by reserving space for dynamic content')
    }
    
    return {
      metrics,
      budgetStatus,
      recommendations
    }
  }
}

// Initialize monitoring when module loads
if (typeof window !== 'undefined') {
  PerformanceMonitor.initializeMonitoring()
  
  // Monitor memory usage every 30 seconds
  setInterval(() => {
    PerformanceMonitor.monitorMemoryUsage()
  }, 30000)
}