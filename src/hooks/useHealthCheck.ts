/**
 * Health Check Hook - Phase 6 Services Layer Migration
 * Centralizes health check operations and eliminates direct supabase calls
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { debugLog } from '@/utils/debugLogger';

export interface HealthCheckResult {
  status: boolean;
  responseTime?: number;
  metadata?: Record<string, any>;
  error?: string;
}

export interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'critical';
  checks: Record<string, HealthCheckResult>;
  lastChecked: string;
  uptime: number;
}

export const useHealthCheck = () => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: 'healthy',
    checks: {},
    lastChecked: new Date().toISOString(),
    uptime: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * ✅ CENTRALIZED: Check Supabase database connection
   */
  const checkSupabaseConnection = useCallback(async (): Promise<HealthCheckResult> => {
    const startTime = Date.now();
    try {
      const { error } = await supabase.from('profiles').select('count').limit(1);
      const responseTime = Date.now() - startTime;
      
      if (error) {
        return {
          status: false,
          responseTime,
          error: error.message,
          metadata: { connectionTest: 'profiles-table', error: error.message }
        };
      }
      
      return {
        status: true,
        responseTime,
        metadata: { connectionTest: 'profiles-table', healthy: true }
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        status: false,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: { connectionTest: 'profiles-table', error: 'Connection failed' }
      };
    }
  }, []);

  /**
   * ✅ CENTRALIZED: Check authentication service
   */
  const checkAuthService = useCallback(async (): Promise<HealthCheckResult> => {
    const startTime = Date.now();
    try {
      const { data, error } = await supabase.auth.getSession();
      const responseTime = Date.now() - startTime;
      
      if (error) {
        return {
          status: false,
          responseTime,
          error: error.message,
          metadata: { service: 'auth', error: error.message }
        };
      }
      
      return {
        status: true,
        responseTime,
        metadata: { 
          service: 'auth', 
          sessionExists: !!data.session,
          healthy: true
        }
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        status: false,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: { service: 'auth', error: 'Service unavailable' }
      };
    }
  }, []);

  /**
   * ✅ CENTRALIZED: Check storage service
   */
  const checkStorageService = useCallback(async (): Promise<HealthCheckResult> => {
    const startTime = Date.now();
    try {
      const { data, error } = await supabase.storage.listBuckets();
      const responseTime = Date.now() - startTime;
      
      if (error) {
        return {
          status: false,
          responseTime,
          error: error.message,
          metadata: { service: 'storage', error: error.message }
        };
      }
      
      return {
        status: true,
        responseTime,
        metadata: { 
          service: 'storage', 
          bucketsCount: data?.length || 0,
          healthy: true
        }
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        status: false,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: { service: 'storage', error: 'Service unavailable' }
      };
    }
  }, []);

  /**
   * ✅ CENTRALIZED: Check API responsiveness
   */
  const checkAPIResponsiveness = useCallback(async (): Promise<HealthCheckResult> => {
    const startTime = Date.now();
    try {
      // Simple ping test to the database
      const { error } = await supabase.rpc('get_dashboard_stats');
      const responseTime = Date.now() - startTime;
      
      // Even if function doesn't exist, connection is working if we get specific error
      if (error && !error.message.includes('function') && !error.message.includes('does not exist')) {
        return {
          status: false,
          responseTime,
          error: error.message,
          metadata: { service: 'api', error: error.message }
        };
      }
      
      return {
        status: true,
        responseTime,
        metadata: { 
          service: 'api', 
          latency: responseTime,
          healthy: responseTime < 2000 // Consider healthy if under 2s
        }
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        status: false,
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: { service: 'api', error: 'API unavailable' }
      };
    }
  }, []);

  /**
   * ✅ CENTRALIZED: Run comprehensive health check
   */
  const runHealthCheck = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const startTime = Date.now();
      
      // Run all health checks in parallel
      const [
        supabaseHealth,
        authHealth,
        storageHealth,
        apiHealth
      ] = await Promise.all([
        checkSupabaseConnection(),
        checkAuthService(),
        checkStorageService(),
        checkAPIResponsiveness()
      ]);

      const checks = {
        supabase: supabaseHealth,
        auth: authHealth,
        storage: storageHealth,
        api: apiHealth
      };

      // Determine overall health
      const healthyChecks = Object.values(checks).filter(check => check.status).length;
      const totalChecks = Object.values(checks).length;
      
      let overall: SystemHealth['overall'];
      if (healthyChecks === totalChecks) {
        overall = 'healthy';
      } else if (healthyChecks >= totalChecks * 0.5) {
        overall = 'degraded';
      } else {
        overall = 'critical';
      }

      const newSystemHealth: SystemHealth = {
        overall,
        checks,
        lastChecked: new Date().toISOString(),
        uptime: Date.now() - startTime
      };

      setSystemHealth(newSystemHealth);

      // Log health check results
      debugLog.log('Health check completed', {
        component: 'HealthCheck',
        overall,
        healthyServices: healthyChecks,
        totalServices: totalChecks
      });

      return newSystemHealth;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Health check failed';
      setError(errorMessage);
      
      debugLog.error('Health check failed', {
        component: 'HealthCheck'
      }, error);
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [checkSupabaseConnection, checkAuthService, checkStorageService, checkAPIResponsiveness]);

  /**
   * ✅ CENTRALIZED: Store health check results (optional - for logging only)
   */
  const storeHealthCheckResult = useCallback(async (
    checkType: string,
    result: HealthCheckResult
  ) => {
    try {
      // Since health_check_logs table doesn't exist, we'll use security_audit_log for health events
      const { error } = await supabase.from('security_audit_log').insert({
        user_id: null, // System health check
        action_type: 'HEALTH_CHECK',
        resource_type: 'system_service',
        resource_id: null,
        details: {
          check_type: checkType,
          status: result.status,
          response_time_ms: result.responseTime,
          metadata: result.metadata || {},
          error_message: result.error
        },
        risk_level: result.status ? 'low' : 'medium'
      });

      if (error) {
        debugLog.error('Failed to store health check result', {
          component: 'HealthCheck',
          checkType
        }, error);
      }
    } catch (error) {
      debugLog.error('Failed to store health check result', {
        component: 'HealthCheck',
        checkType
      }, error);
      // Don't throw - health check storage is not critical
    }
  }, []);

  /**
   * ✅ ENHANCED: Auto health check on mount
   */
  useEffect(() => {
    runHealthCheck();
    
    // Set up periodic health checks every 5 minutes
    const interval = setInterval(runHealthCheck, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [runHealthCheck]);

  return {
    // State
    systemHealth,
    isLoading,
    error,
    
    // Operations
    runHealthCheck,
    checkSupabaseConnection,
    checkAuthService,
    checkStorageService,
    checkAPIResponsiveness,
    storeHealthCheckResult,
    
    // Utilities
    setError
  };
};

export default useHealthCheck;