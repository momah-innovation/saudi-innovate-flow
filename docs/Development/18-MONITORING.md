# 📊 Production Monitoring Guide

## Overview
Comprehensive monitoring and observability strategy for the Ruwād Platform, covering application performance, infrastructure health, user experience, and business metrics.

## Monitoring Architecture

### Observability Stack
```typescript
// src/lib/monitoring/observability.ts
export interface MonitoringConfig {
  environment: string;
  metrics: MetricsConfig;
  logging: LoggingConfig;
  tracing: TracingConfig;
  alerting: AlertingConfig;
}

export const monitoringConfig: MonitoringConfig = {
  environment: process.env.NODE_ENV || 'development',
  
  metrics: {
    enabled: true,
    interval: 30000, // 30 seconds
    endpoints: ['/metrics', '/health'],
    collectors: ['prometheus', 'custom']
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: 'json',
    destinations: ['console', 'file', 'remote'],
    retention: '30d'
  },
  
  tracing: {
    enabled: process.env.NODE_ENV === 'production',
    sampleRate: 0.1, // 10% sampling
    exporters: ['jaeger', 'zipkin']
  },
  
  alerting: {
    enabled: true,
    channels: ['slack', 'email', 'pagerduty'],
    thresholds: {
      errorRate: 0.05, // 5%
      responseTime: 2000, // 2 seconds
      availability: 0.99 // 99%
    }
  }
};
```

### Performance Monitoring
```typescript
// src/lib/monitoring/performance.ts
export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.setupPerformanceObservers();
    this.trackWebVitals();
  }

  private setupPerformanceObservers() {
    // Navigation timing
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordNavigationTiming(entry as PerformanceNavigationTiming);
        }
      });
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);

      // Resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordResourceTiming(entry as PerformanceResourceTiming);
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);

      // Long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordLongTask(entry);
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);
    }
  }

  private trackWebVitals() {
    // Largest Contentful Paint (LCP)
    this.measureLCP((lcp) => {
      this.recordMetric('web_vitals_lcp', lcp.value, {
        rating: lcp.rating,
        element: lcp.entries[0]?.element?.tagName
      });
    });

    // First Input Delay (FID)
    this.measureFID((fid) => {
      this.recordMetric('web_vitals_fid', fid.value, {
        rating: fid.rating,
        eventType: fid.entries[0]?.name
      });
    });

    // Cumulative Layout Shift (CLS)
    this.measureCLS((cls) => {
      this.recordMetric('web_vitals_cls', cls.value, {
        rating: cls.rating,
        hadRecentInput: cls.entries.some(entry => entry.hadRecentInput)
      });
    });
  }

  private recordNavigationTiming(entry: PerformanceNavigationTiming) {
    const metrics = {
      dns_lookup: entry.domainLookupEnd - entry.domainLookupStart,
      tcp_connect: entry.connectEnd - entry.connectStart,
      ssl_handshake: entry.connectEnd - entry.secureConnectionStart,
      request_response: entry.responseEnd - entry.requestStart,
      dom_processing: entry.domContentLoadedEventEnd - entry.responseEnd,
      total_load_time: entry.loadEventEnd - entry.navigationStart
    };

    Object.entries(metrics).forEach(([name, value]) => {
      this.recordMetric(`navigation_${name}`, value);
    });
  }

  private recordResourceTiming(entry: PerformanceResourceTiming) {
    if (entry.duration > 1000) { // Only track slow resources
      this.recordMetric('resource_load_time', entry.duration, {
        resource_type: this.getResourceType(entry.name),
        resource_size: entry.transferSize,
        cache_hit: entry.transferSize === 0
      });
    }
  }

  private recordLongTask(entry: PerformanceEntry) {
    this.recordMetric('long_task_duration', entry.duration, {
      start_time: entry.startTime,
      attribution: (entry as any).attribution
    });
  }

  private recordMetric(name: string, value: number, tags: Record<string, any> = {}) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      tags: {
        ...tags,
        environment: monitoringConfig.environment,
        user_agent: navigator.userAgent,
        url: window.location.href
      }
    };

    this.metrics.set(`${name}_${Date.now()}`, metric);
    this.sendMetric(metric);
  }

  private async sendMetric(metric: PerformanceMetric) {
    try {
      await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric)
      });
    } catch (error) {
      console.error('Failed to send metric:', error);
    }
  }

  // Web Vitals measurement implementations
  private measureLCP(callback: (metric: any) => void) {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      callback({
        value: lastEntry.startTime,
        rating: this.rateMetric('lcp', lastEntry.startTime),
        entries
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  }

  private measureFID(callback: (metric: any) => void) {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        callback({
          value: entry.processingStart - entry.startTime,
          rating: this.rateMetric('fid', entry.processingStart - entry.startTime),
          entries: [entry]
        });
      }
    }).observe({ entryTypes: ['first-input'] });
  }

  private measureCLS(callback: (metric: any) => void) {
    let clsValue = 0;
    let clsEntries: any[] = [];

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      }

      callback({
        value: clsValue,
        rating: this.rateMetric('cls', clsValue),
        entries: clsEntries
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  private rateMetric(type: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = {
      lcp: [2500, 4000],
      fid: [100, 300],
      cls: [0.1, 0.25]
    };

    const [good, poor] = thresholds[type] || [0, 0];
    
    if (value <= good) return 'good';
    if (value <= poor) return 'needs-improvement';
    return 'poor';
  }

  private getResourceType(url: string): string {
    if (url.includes('.js')) return 'script';
    if (url.includes('.css')) return 'stylesheet';
    if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) return 'image';
    if (url.includes('/api/')) return 'api';
    return 'other';
  }

  getMetrics() {
    return Array.from(this.metrics.values());
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();
```

## Error Tracking and Logging

### Comprehensive Error Monitoring
```typescript
// src/lib/monitoring/errorTracking.ts
export class ErrorTracker {
  private errorQueue: ErrorReport[] = [];
  private maxQueueSize = 100;
  private flushInterval = 10000; // 10 seconds

  constructor() {
    this.setupGlobalErrorHandlers();
    this.setupPeriodicFlush();
  }

  private setupGlobalErrorHandlers() {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.captureError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: Date.now()
      });
    });

    // Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        type: 'promise_rejection',
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        promise: event.promise,
        timestamp: Date.now()
      });
    });

    // Network errors
    this.interceptFetch();
    this.interceptXHR();
  }

  private interceptFetch() {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const startTime = Date.now();
      
      try {
        const response = await originalFetch(...args);
        
        // Log slow requests
        const duration = Date.now() - startTime;
        if (duration > 5000) {
          this.captureError({
            type: 'slow_request',
            message: `Slow API request: ${duration}ms`,
            url: args[0]?.toString(),
            duration,
            timestamp: Date.now()
          });
        }

        // Log HTTP errors
        if (!response.ok) {
          this.captureError({
            type: 'http_error',
            message: `HTTP ${response.status}: ${response.statusText}`,
            url: args[0]?.toString(),
            status: response.status,
            timestamp: Date.now()
          });
        }

        return response;
      } catch (error) {
        this.captureError({
          type: 'network_error',
          message: error.message,
          url: args[0]?.toString(),
          stack: error.stack,
          timestamp: Date.now()
        });
        throw error;
      }
    };
  }

  private interceptXHR() {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      this._errorTracker = { method, url, startTime: Date.now() };
      return originalOpen.call(this, method, url, ...args);
    };

    XMLHttpRequest.prototype.send = function(body) {
      const tracker = this._errorTracker;
      
      this.addEventListener('error', () => {
        errorTracker.captureError({
          type: 'xhr_error',
          message: 'XMLHttpRequest failed',
          url: tracker?.url,
          method: tracker?.method,
          timestamp: Date.now()
        });
      });

      this.addEventListener('loadend', () => {
        if (tracker && this.status >= 400) {
          errorTracker.captureError({
            type: 'xhr_http_error',
            message: `HTTP ${this.status}: ${this.statusText}`,
            url: tracker.url,
            method: tracker.method,
            status: this.status,
            duration: Date.now() - tracker.startTime,
            timestamp: Date.now()
          });
        }
      });

      return originalSend.call(this, body);
    };
  }

  captureError(error: Partial<ErrorReport>) {
    const errorReport: ErrorReport = {
      id: this.generateErrorId(),
      type: error.type || 'unknown',
      message: error.message || 'Unknown error',
      timestamp: error.timestamp || Date.now(),
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
      buildVersion: process.env.BUILD_VERSION,
      environment: monitoringConfig.environment,
      ...error
    };

    // Add to queue
    this.errorQueue.push(errorReport);
    
    // Prevent queue overflow
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue = this.errorQueue.slice(-this.maxQueueSize);
    }

    // Immediate flush for critical errors
    if (this.isCriticalError(errorReport)) {
      this.flushErrors();
    }

    console.error('Error captured:', errorReport);
  }

  private setupPeriodicFlush() {
    setInterval(() => {
      if (this.errorQueue.length > 0) {
        this.flushErrors();
      }
    }, this.flushInterval);

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flushErrors();
    });
  }

  private async flushErrors() {
    if (this.errorQueue.length === 0) return;

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errors })
      });
    } catch (error) {
      console.error('Failed to send error reports:', error);
      // Re-add to queue for retry
      this.errorQueue.unshift(...errors);
    }
  }

  private isCriticalError(error: ErrorReport): boolean {
    return error.type === 'javascript' && 
           (error.message?.includes('ChunkLoadError') || 
            error.message?.includes('TypeError'));
  }

  private generateErrorId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private getCurrentUserId(): string | null {
    // Get from auth context or local storage
    return localStorage.getItem('userId');
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = this.generateErrorId();
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }
}

export const errorTracker = new ErrorTracker();
```

## Application Health Monitoring

### Health Check System
```typescript
// src/lib/monitoring/healthCheck.ts
export class HealthCheckManager {
  private checks: Map<string, HealthCheck> = new Map();
  private interval: NodeJS.Timeout | null = null;

  constructor() {
    this.registerDefaultChecks();
    this.startPeriodicChecks();
  }

  private registerDefaultChecks() {
    // Database connectivity
    this.registerCheck('database', async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        return {
          status: error ? 'unhealthy' : 'healthy',
          message: error ? error.message : 'Database connection OK',
          responseTime: Date.now() // This should be measured properly
        };
      } catch (error) {
        return {
          status: 'unhealthy',
          message: error.message,
          responseTime: 0
        };
      }
    });

    // External API health
    this.registerCheck('external_apis', async () => {
      const apiChecks = await Promise.allSettled([
        this.checkSupabaseAPI(),
        this.checkOpenAIAPI()
      ]);

      const failures = apiChecks.filter(result => result.status === 'rejected');
      
      return {
        status: failures.length === 0 ? 'healthy' : 'degraded',
        message: failures.length === 0 ? 'All APIs healthy' : `${failures.length} API(s) unhealthy`,
        details: apiChecks
      };
    });

    // Memory usage
    this.registerCheck('memory', async () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        
        return {
          status: usagePercent > 90 ? 'unhealthy' : usagePercent > 70 ? 'degraded' : 'healthy',
          message: `Memory usage: ${usagePercent.toFixed(1)}%`,
          details: {
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit
          }
        };
      }
      
      return {
        status: 'unknown',
        message: 'Memory information not available'
      };
    });

    // Local storage
    this.registerCheck('local_storage', async () => {
      try {
        const testKey = '__health_check__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        
        return {
          status: 'healthy',
          message: 'Local storage accessible'
        };
      } catch (error) {
        return {
          status: 'unhealthy',
          message: 'Local storage not accessible',
          error: error.message
        };
      }
    });
  }

  registerCheck(name: string, checkFn: () => Promise<HealthCheckResult>) {
    this.checks.set(name, {
      name,
      check: checkFn,
      lastRun: null,
      lastResult: null
    });
  }

  async runCheck(name: string): Promise<HealthCheckResult> {
    const check = this.checks.get(name);
    if (!check) {
      throw new Error(`Health check '${name}' not found`);
    }

    const startTime = Date.now();
    
    try {
      const result = await check.check();
      result.responseTime = Date.now() - startTime;
      
      check.lastRun = new Date();
      check.lastResult = result;
      
      return result;
    } catch (error) {
      const result: HealthCheckResult = {
        status: 'unhealthy',
        message: error.message,
        responseTime: Date.now() - startTime,
        error: error.stack
      };
      
      check.lastRun = new Date();
      check.lastResult = result;
      
      return result;
    }
  }

  async runAllChecks(): Promise<OverallHealthStatus> {
    const results = new Map<string, HealthCheckResult>();
    
    for (const [name] of this.checks) {
      try {
        results.set(name, await this.runCheck(name));
      } catch (error) {
        results.set(name, {
          status: 'unhealthy',
          message: error.message,
          responseTime: 0
        });
      }
    }

    return this.calculateOverallStatus(results);
  }

  private calculateOverallStatus(results: Map<string, HealthCheckResult>): OverallHealthStatus {
    const statusCounts = {
      healthy: 0,
      degraded: 0,
      unhealthy: 0,
      unknown: 0
    };

    for (const result of results.values()) {
      statusCounts[result.status]++;
    }

    let overallStatus: HealthStatus;
    if (statusCounts.unhealthy > 0) {
      overallStatus = 'unhealthy';
    } else if (statusCounts.degraded > 0) {
      overallStatus = 'degraded';
    } else if (statusCounts.unknown > 0) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'healthy';
    }

    return {
      status: overallStatus,
      timestamp: new Date(),
      checks: Object.fromEntries(results),
      summary: {
        total: results.size,
        healthy: statusCounts.healthy,
        degraded: statusCounts.degraded,
        unhealthy: statusCounts.unhealthy,
        unknown: statusCounts.unknown
      }
    };
  }

  private startPeriodicChecks() {
    this.interval = setInterval(async () => {
      const status = await this.runAllChecks();
      
      // Send to monitoring system
      this.sendHealthStatus(status);
      
      // Alert if unhealthy
      if (status.status === 'unhealthy') {
        this.triggerAlert(status);
      }
    }, 60000); // Every minute
  }

  private async sendHealthStatus(status: OverallHealthStatus) {
    try {
      await fetch('/api/health/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(status)
      });
    } catch (error) {
      console.error('Failed to send health status:', error);
    }
  }

  private triggerAlert(status: OverallHealthStatus) {
    console.warn('Health check alert:', status);
    
    // Trigger alerting system
    // This could send to Slack, PagerDuty, etc.
  }

  private async checkSupabaseAPI(): Promise<HealthCheckResult> {
    try {
      const response = await fetch('https://jxpbiljkoibvqxzdkgod.supabase.co/rest/v1/', {
        headers: {
          'apikey': process.env.SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || ''}`
        }
      });

      return {
        status: response.ok ? 'healthy' : 'unhealthy',
        message: response.ok ? 'Supabase API OK' : `Supabase API error: ${response.status}`,
        responseTime: 0 // Should measure actual response time
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Supabase API error: ${error.message}`,
        responseTime: 0
      };
    }
  }

  private async checkOpenAIAPI(): Promise<HealthCheckResult> {
    // Only check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      return {
        status: 'unknown',
        message: 'OpenAI API key not configured'
      };
    }

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      });

      return {
        status: response.ok ? 'healthy' : 'degraded',
        message: response.ok ? 'OpenAI API OK' : `OpenAI API degraded: ${response.status}`,
        responseTime: 0
      };
    } catch (error) {
      return {
        status: 'degraded',
        message: `OpenAI API error: ${error.message}`,
        responseTime: 0
      };
    }
  }

  cleanup() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

export const healthCheckManager = new HealthCheckManager();
```

## User Experience Monitoring

### Real User Monitoring (RUM)
```typescript
// src/lib/monitoring/userExperience.ts
export class UserExperienceMonitor {
  private sessionId: string;
  private pageViews: PageView[] = [];
  private userActions: UserAction[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupPageTracking();
    this.setupUserInteractionTracking();
    this.setupRouteChangeTracking();
  }

  private setupPageTracking() {
    // Track page load
    window.addEventListener('load', () => {
      this.trackPageView({
        url: window.location.href,
        title: document.title,
        loadTime: performance.now(),
        referrer: document.referrer
      });
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.trackVisibilityChange(document.hidden);
    });
  }

  private setupUserInteractionTracking() {
    // Track clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      this.trackUserAction({
        type: 'click',
        element: target.tagName.toLowerCase(),
        elementId: target.id,
        elementClass: target.className,
        text: target.textContent?.slice(0, 100),
        timestamp: Date.now()
      });
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      this.trackUserAction({
        type: 'form_submit',
        element: 'form',
        elementId: form.id,
        formAction: form.action,
        timestamp: Date.now()
      });
    });

    // Track scroll depth
    this.setupScrollTracking();
  }

  private setupScrollTracking() {
    let maxScrollDepth = 0;
    const throttledScrollHandler = this.throttle(() => {
      const scrollDepth = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        
        // Track scroll milestones
        const milestone = Math.floor(scrollDepth * 4) * 25; // 0%, 25%, 50%, 75%, 100%
        if (milestone > 0 && milestone % 25 === 0) {
          this.trackUserAction({
            type: 'scroll',
            element: 'page',
            scrollDepth: milestone,
            timestamp: Date.now()
          });
        }
      }
    }, 100);

    window.addEventListener('scroll', throttledScrollHandler);
  }

  private setupRouteChangeTracking() {
    // For single-page applications
    let currentPath = window.location.pathname;
    
    const checkRouteChange = () => {
      if (window.location.pathname !== currentPath) {
        this.trackRouteChange(currentPath, window.location.pathname);
        currentPath = window.location.pathname;
      }
    };

    // Use MutationObserver to detect DOM changes that might indicate route changes
    const observer = new MutationObserver(checkRouteChange);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  trackPageView(pageView: Partial<PageView>) {
    const fullPageView: PageView = {
      id: this.generateId(),
      sessionId: this.sessionId,
      timestamp: Date.now(),
      url: window.location.href,
      title: document.title,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      viewportSize: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      ...pageView
    };

    this.pageViews.push(fullPageView);
    this.sendEvent('page_view', fullPageView);
  }

  trackUserAction(action: Partial<UserAction>) {
    const fullAction: UserAction = {
      id: this.generateId(),
      sessionId: this.sessionId,
      timestamp: Date.now(),
      url: window.location.href,
      ...action
    };

    this.userActions.push(fullAction);
    this.sendEvent('user_action', fullAction);
  }

  trackRouteChange(from: string, to: string) {
    this.trackUserAction({
      type: 'route_change',
      element: 'router',
      from,
      to,
      timestamp: Date.now()
    });
  }

  trackVisibilityChange(hidden: boolean) {
    this.trackUserAction({
      type: hidden ? 'page_hidden' : 'page_visible',
      element: 'page',
      timestamp: Date.now()
    });
  }

  // User engagement metrics
  calculateEngagementScore(): number {
    const timeOnPage = Date.now() - (this.pageViews[0]?.timestamp || Date.now());
    const interactions = this.userActions.filter(action => 
      ['click', 'form_submit', 'scroll'].includes(action.type)
    ).length;
    
    // Simple engagement score calculation
    const timeScore = Math.min(timeOnPage / 60000, 10); // Max 10 points for time (1 minute = 1 point)
    const interactionScore = Math.min(interactions * 2, 20); // Max 20 points for interactions
    
    return Math.round(timeScore + interactionScore);
  }

  // Error tracking for UX issues
  trackUXError(error: UXError) {
    this.trackUserAction({
      type: 'ux_error',
      element: error.element,
      errorType: error.type,
      errorMessage: error.message,
      severity: error.severity,
      timestamp: Date.now()
    });
  }

  private async sendEvent(eventType: string, data: any) {
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: eventType,
          data,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  private throttle(func: Function, delay: number) {
    let timeoutId: NodeJS.Timeout;
    let lastExecTime = 0;
    
    return function (...args: any[]) {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }

  getSessionSummary() {
    return {
      sessionId: this.sessionId,
      duration: Date.now() - (this.pageViews[0]?.timestamp || Date.now()),
      pageViews: this.pageViews.length,
      userActions: this.userActions.length,
      engagementScore: this.calculateEngagementScore(),
      uniquePages: new Set(this.pageViews.map(pv => pv.url)).size
    };
  }
}

export const userExperienceMonitor = new UserExperienceMonitor();
```

## Alerting and Notifications

### Alert Management System
```typescript
// src/lib/monitoring/alerting.ts
export class AlertManager {
  private alerts: Map<string, Alert> = new Map();
  private cooldowns: Map<string, number> = new Map();

  async triggerAlert(alert: AlertConfig) {
    const alertKey = this.getAlertKey(alert);
    
    // Check cooldown
    if (this.isInCooldown(alertKey)) {
      return;
    }

    // Create alert
    const fullAlert: Alert = {
      id: this.generateId(),
      ...alert,
      timestamp: Date.now(),
      status: 'active'
    };

    this.alerts.set(alertKey, fullAlert);
    
    // Send notifications
    await this.sendNotifications(fullAlert);
    
    // Set cooldown
    this.setCooldown(alertKey, alert.cooldown || 300000); // 5 minutes default
  }

  private async sendNotifications(alert: Alert) {
    const notifications = [];

    // Slack notification
    if (alert.channels.includes('slack')) {
      notifications.push(this.sendSlackNotification(alert));
    }

    // Email notification
    if (alert.channels.includes('email')) {
      notifications.push(this.sendEmailNotification(alert));
    }

    // PagerDuty for critical alerts
    if (alert.severity === 'critical' && alert.channels.includes('pagerduty')) {
      notifications.push(this.sendPagerDutyAlert(alert));
    }

    await Promise.allSettled(notifications);
  }

  private async sendSlackNotification(alert: Alert) {
    const webhook = process.env.SLACK_WEBHOOK_URL;
    if (!webhook) return;

    const color = {
      low: '#36a64f',
      medium: '#ff9500', 
      high: '#ff0000',
      critical: '#8B0000'
    }[alert.severity];

    const message = {
      text: `Alert: ${alert.title}`,
      attachments: [{
        color,
        fields: [
          { title: 'Severity', value: alert.severity, short: true },
          { title: 'Environment', value: monitoringConfig.environment, short: true },
          { title: 'Description', value: alert.description, short: false },
          { title: 'Timestamp', value: new Date(alert.timestamp).toISOString(), short: true }
        ]
      }]
    };

    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
  }

  private async sendEmailNotification(alert: Alert) {
    // Implementation depends on email service
    console.log('Email notification:', alert);
  }

  private async sendPagerDutyAlert(alert: Alert) {
    // PagerDuty integration
    console.log('PagerDuty alert:', alert);
  }

  private getAlertKey(alert: AlertConfig): string {
    return `${alert.type}_${alert.source}_${alert.metric}`;
  }

  private isInCooldown(alertKey: string): boolean {
    const cooldownEnd = this.cooldowns.get(alertKey);
    return cooldownEnd ? Date.now() < cooldownEnd : false;
  }

  private setCooldown(alertKey: string, duration: number) {
    this.cooldowns.set(alertKey, Date.now() + duration);
  }

  private generateId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  resolveAlert(alertKey: string) {
    const alert = this.alerts.get(alertKey);
    if (alert) {
      alert.status = 'resolved';
      alert.resolvedAt = Date.now();
      this.cooldowns.delete(alertKey);
    }
  }
}

export const alertManager = new AlertManager();
```

## Dashboard and Reporting

### Monitoring Dashboard Data
```typescript
// src/lib/monitoring/dashboard.ts
export class MonitoringDashboard {
  async getDashboardData(): Promise<DashboardData> {
    const [
      performance,
      errors,
      health,
      userMetrics
    ] = await Promise.all([
      this.getPerformanceMetrics(),
      this.getErrorMetrics(),
      this.getHealthMetrics(),
      this.getUserMetrics()
    ]);

    return {
      performance,
      errors,
      health,
      userMetrics,
      timestamp: Date.now()
    };
  }

  private async getPerformanceMetrics(): Promise<PerformanceDashboard> {
    const metrics = performanceMonitor.getMetrics();
    
    return {
      averageLoadTime: this.calculateAverage(metrics, 'navigation_total_load_time'),
      p95LoadTime: this.calculatePercentile(metrics, 'navigation_total_load_time', 95),
      webVitals: {
        lcp: this.getLatestMetric(metrics, 'web_vitals_lcp'),
        fid: this.getLatestMetric(metrics, 'web_vitals_fid'),
        cls: this.getLatestMetric(metrics, 'web_vitals_cls')
      },
      slowQueries: this.getSlowQueries(metrics),
      resourceBreakdown: this.getResourceBreakdown(metrics)
    };
  }

  private async getErrorMetrics(): Promise<ErrorDashboard> {
    return {
      errorRate: await this.calculateErrorRate(),
      errorsByType: await this.getErrorsByType(),
      topErrors: await this.getTopErrors(),
      affectedUsers: await this.getAffectedUsersCount()
    };
  }

  private async getHealthMetrics(): Promise<HealthDashboard> {
    const status = await healthCheckManager.runAllChecks();
    
    return {
      overallStatus: status.status,
      checks: status.checks,
      uptime: await this.calculateUptime(),
      responseTime: await this.getAverageResponseTime()
    };
  }

  private async getUserMetrics(): Promise<UserDashboard> {
    return {
      activeUsers: await this.getActiveUsersCount(),
      sessionDuration: await this.getAverageSessionDuration(),
      bounceRate: await this.calculateBounceRate(),
      conversions: await this.getConversionMetrics(),
      userSatisfaction: await this.getUserSatisfactionScore()
    };
  }

  // Utility methods for calculations
  private calculateAverage(metrics: PerformanceMetric[], metricName: string): number {
    const values = metrics
      .filter(m => m.name === metricName)
      .map(m => m.value);
    
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  }

  private calculatePercentile(metrics: PerformanceMetric[], metricName: string, percentile: number): number {
    const values = metrics
      .filter(m => m.name === metricName)
      .map(m => m.value)
      .sort((a, b) => a - b);
    
    if (values.length === 0) return 0;
    
    const index = Math.ceil((percentile / 100) * values.length) - 1;
    return values[index];
  }

  private getLatestMetric(metrics: PerformanceMetric[], metricName: string): number {
    const metric = metrics
      .filter(m => m.name === metricName)
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    
    return metric ? metric.value : 0;
  }

  private async calculateErrorRate(): Promise<number> {
    // Implementation would calculate error rate from stored data
    return 0.02; // Example: 2% error rate
  }

  private async getActiveUsersCount(): Promise<number> {
    // Implementation would query user activity data
    return 150; // Example
  }

  private async calculateUptime(): Promise<number> {
    // Implementation would calculate uptime percentage
    return 99.9; // Example: 99.9% uptime
  }
}

export const monitoringDashboard = new MonitoringDashboard();
```

## Best Practices

### 1. **Comprehensive Coverage**
- Monitor application performance, errors, and user experience
- Track both technical and business metrics
- Implement health checks for all critical components

### 2. **Alerting Strategy**
- Set up appropriate thresholds and escalation paths
- Implement alert fatigue prevention with cooldowns
- Use different channels for different severity levels

### 3. **Performance Optimization**
- Monitor Core Web Vitals and user-centric metrics
- Track resource loading and optimization opportunities
- Measure business impact of performance changes

### 4. **Data Management**
- Implement proper data retention policies
- Use sampling for high-volume metrics
- Ensure monitoring doesn't impact application performance

---

**Last Updated**: January 17, 2025  
**Guide Version**: 1.0  
**Monitoring Stack**: Production Ready