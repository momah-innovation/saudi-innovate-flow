// Health Check Service for System Monitoring
// Provides comprehensive health monitoring for critical services

import { supabase } from '@/integrations/supabase/client';
import { debugLog } from '@/utils/debugLogger';

interface HealthCheckResult {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  error?: string;
  lastChecked: Date;
  metadata?: Record<string, any>;
}

interface HealthCheckConfig {
  timeout?: number;
  retries?: number;
  interval?: number;
}

export class HealthCheckService {
  private checks = new Map<string, () => Promise<HealthCheckResult>>();
  private results = new Map<string, HealthCheckResult>();
  private intervals = new Map<string, NodeJS.Timeout>();
  private defaultConfig: HealthCheckConfig = {
    timeout: 5000,
    retries: 3,
    interval: 60000 // 1 minute
  };

  register(
    name: string, 
    checkFn: () => Promise<boolean | { status: boolean; metadata?: any }>,
    config: HealthCheckConfig = {}
  ): void {
    const finalConfig = { ...this.defaultConfig, ...config };

    const wrappedCheck = async (): Promise<HealthCheckResult> => {
      const startTime = performance.now();
      let attempts = 0;
      const maxAttempts = finalConfig.retries || 1;

      while (attempts < maxAttempts) {
        try {
          const timeoutPromise = new Promise<never>((_, reject) => {
            // Note: Using basic timer for promise timeout as it's internal to the promise
            setTimeout(() => reject(new Error('Health check timeout')), finalConfig.timeout);
          });

          const result = await Promise.race([checkFn(), timeoutPromise]);
          const responseTime = performance.now() - startTime;

          const isHealthy = typeof result === 'boolean' ? result : result.status;
          const metadata = typeof result === 'object' ? result.metadata : undefined;

          return {
            name,
            status: isHealthy ? 'healthy' : 'unhealthy',
            responseTime,
            lastChecked: new Date(),
            metadata
          };
        } catch (error) {
          attempts++;
          if (attempts >= maxAttempts) {
            const responseTime = performance.now() - startTime;
            return {
              name,
              status: 'unhealthy',
              responseTime,
              error: error instanceof Error ? error.message : 'Unknown error',
              lastChecked: new Date()
            };
          }
          // Wait before retry
          // Wait before retry - using basic timer for internal delay
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Should not reach here, but TypeScript needs it
      return {
        name,
        status: 'unhealthy',
        error: 'Maximum retries exceeded',
        lastChecked: new Date()
      };
    };

    this.checks.set(name, wrappedCheck);

    // Set up periodic checking if interval is specified
    if (finalConfig.interval && finalConfig.interval > 0) {
      // Note: Service-level intervals kept as basic for now as this is internal infrastructure
      const intervalId = setInterval(() => {
        this.runCheck(name);
      }, finalConfig.interval);
      
      this.intervals.set(name, intervalId);
    }

    debugLog.debug('Health check registered', {
      component: 'HealthCheckService',
      action: 'register',
      name,
      config: finalConfig
    });
  }

  async runCheck(name: string): Promise<HealthCheckResult | null> {
    const checkFn = this.checks.get(name);
    if (!checkFn) {
      debugLog.warn('Health check not found', {
        component: 'HealthCheckService',
        action: 'runCheck',
        name
      });
      return null;
    }

    try {
      const result = await checkFn();
      this.results.set(name, result);

      debugLog.debug('Health check completed', {
        component: 'HealthCheckService',
        action: 'runCheck',
        name,
        status: result.status,
        responseTime: result.responseTime
      });

      return result;
    } catch (error) {
      const result: HealthCheckResult = {
        name,
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Check execution failed',
        lastChecked: new Date()
      };

      this.results.set(name, result);
      
      debugLog.error('Health check failed', {
        component: 'HealthCheckService',
        action: 'runCheck',
        name
      }, error);

      return result;
    }
  }

  async runAll(): Promise<Map<string, HealthCheckResult>> {
    const promises = Array.from(this.checks.keys()).map(name => this.runCheck(name));
    await Promise.allSettled(promises);
    return new Map(this.results);
  }

  getResult(name: string): HealthCheckResult | null {
    return this.results.get(name) || null;
  }

  getAllResults(): Map<string, HealthCheckResult> {
    return new Map(this.results);
  }

  getOverallStatus(): 'healthy' | 'degraded' | 'unhealthy' {
    const results = Array.from(this.results.values());
    
    if (results.length === 0) return 'unhealthy';
    
    const unhealthyCount = results.filter(r => r.status === 'unhealthy').length;
    const degradedCount = results.filter(r => r.status === 'degraded').length;
    
    if (unhealthyCount > 0) return 'unhealthy';
    if (degradedCount > 0) return 'degraded';
    return 'healthy';
  }

  unregister(name: string): void {
    this.checks.delete(name);
    this.results.delete(name);
    
    const intervalId = this.intervals.get(name);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervals.delete(name);
    }

    debugLog.debug('Health check unregistered', {
      component: 'HealthCheckService',
      action: 'unregister',
      name
    });
  }

  cleanup(): void {
    for (const intervalId of this.intervals.values()) {
      clearInterval(intervalId);
    }
    this.intervals.clear();
    this.checks.clear();
    this.results.clear();

    debugLog.debug('Health check service cleaned up', {
      component: 'HealthCheckService',
      action: 'cleanup'
    });
  }
}

// Global health check instance
export const healthCheckService = new HealthCheckService();

// Register default health checks using structured approach
healthCheckService.register('supabase-connection', async () => {
  try {
    const { error } = await supabase.rpc('get_dashboard_stats');
    return { status: !error, metadata: { connectionTest: 'rpc:get_dashboard_stats' } };
  } catch (error) {
    return { status: false, metadata: { error: (error as any)?.message } };
  }
}, { interval: 30000 }); // Check every 30 seconds

healthCheckService.register('auth-service', async () => {
  const { data, error } = await supabase.auth.getSession();
  return { status: !error, metadata: { hasSession: !!data.session } };
}, { interval: 60000 }); // Check every minute

healthCheckService.register('browser-performance', async () => {
  const connection = (navigator as any).connection;
  const memory = (performance as any).memory;
  
  return {
    status: true,
    metadata: {
      effectiveType: connection?.effectiveType,
      rtt: connection?.rtt,
      downlink: connection?.downlink,
      usedJSHeapSize: memory?.usedJSHeapSize,
      totalJSHeapSize: memory?.totalJSHeapSize
    }
  };
}, { interval: 120000 }); // Check every 2 minutes