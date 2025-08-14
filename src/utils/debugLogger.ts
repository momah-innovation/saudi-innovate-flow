/**
 * Debug Logger Utility
 * 
 * Provides conditional logging that only outputs in development mode.
 * This prevents console statements from appearing in production builds
 * while maintaining debugging capabilities during development.
 */

const isDevelopment = import.meta.env.DEV;

interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  [key: string]: any;
}

export const debugLog = {
  /**
   * General logging for development debugging
   */
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[DEBUG]', ...args);
    }
  },

  /**
   * Error logging - shows in development, structured logging for production
   */
  error: (message: string, context?: LogContext, error?: Error) => {
    if (isDevelopment) {
      console.error('[ERROR]', message, context, error);
    } else {
      // In production, you might want to send to error tracking service
      // e.g., Sentry, LogRocket, etc.
      // For now, we'll use a structured approach
      console.error(JSON.stringify({
        level: 'error',
        message,
        context,
        error: error?.message,
        timestamp: new Date().toISOString(),
      }));
    }
  },

  /**
   * Warning logging
   */
  warn: (message: string, context?: LogContext) => {
    if (isDevelopment) {
      console.warn('[WARN]', message, context);
    } else {
      console.warn(JSON.stringify({
        level: 'warning',
        message,
        context,
        timestamp: new Date().toISOString(),
      }));
    }
  },

  /**
   * Debug-level logging - only in development
   */
  debug: (message: string, context?: LogContext) => {
    if (isDevelopment) {
      console.debug('[DEBUG]', message, context);
    }
  },

  /**
   * Performance logging
   */
  performance: (label: string, duration: number, context?: LogContext) => {
    if (isDevelopment) {
      console.log(`[PERF] ${label}: ${duration}ms`, context);
    }
  },

  /**
   * Security event logging - always logs for audit purposes
   */
  security: (event: string, context?: LogContext) => {
    console.warn(JSON.stringify({
      level: 'security',
      event,
      context,
      timestamp: new Date().toISOString(),
    }));
  }
};

/**
 * Performance measurement utility
 */
export const perfMeasure = (label: string) => {
  const start = performance.now();
  
  return {
    end: (context?: LogContext) => {
      const duration = performance.now() - start;
      debugLog.performance(label, duration, context);
      return duration;
    }
  };
};

/**
 * Logger for specific components
 */
export const createComponentLogger = (componentName: string) => {
  return {
    log: (...args: any[]) => debugLog.log(`[${componentName}]`, ...args),
    error: (message: string, error?: Error) => 
      debugLog.error(message, { component: componentName }, error),
    warn: (message: string) => 
      debugLog.warn(message, { component: componentName }),
    debug: (message: string, context?: any) => 
      debugLog.debug(message, { component: componentName, ...context }),
  };
};

export default debugLog;