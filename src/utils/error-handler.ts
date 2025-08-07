import { AppError } from '@/types/common';
import { logger as centralizedLogger } from './logger';

/**
 * Enhanced error handling utilities
 */

export class AppErrorHandler {
  private static instance: AppErrorHandler;
  private errorListeners: Array<(error: AppError) => void> = [];

  static getInstance(): AppErrorHandler {
    if (!AppErrorHandler.instance) {
      AppErrorHandler.instance = new AppErrorHandler();
    }
    return AppErrorHandler.instance;
  }

  /**
   * Handle and log errors consistently
   */
  handleError(error: unknown, context?: string): AppError {
    const appError = this.normalizeError(error, context);
    
    // Log error (replace console.error with proper logging)
    this.logError(appError, context);
    
    // Notify error listeners
    this.errorListeners.forEach(listener => listener(appError));
    
    return appError;
  }

  /**
   * Normalize different error types to AppError
   */
  private normalizeError(error: unknown, context?: string): AppError {
    const timestamp = new Date().toISOString();

    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'JS_ERROR',
        statusCode: 500,
        details: {
          name: error.name,
          stack: error.stack,
          context
        },
        timestamp
      };
    }

    if (typeof error === 'string') {
      return {
        message: error,
        code: 'STRING_ERROR',
        statusCode: 500,
        details: { context },
        timestamp
      };
    }

    if (error && typeof error === 'object' && 'message' in error) {
      const errorObj = error as Record<string, unknown>;
      return {
        message: errorObj.message as string || 'Unknown error',
        code: errorObj.code as string || 'UNKNOWN_ERROR',
        statusCode: errorObj.statusCode as number || 500,
        details: { ...error, context },
        timestamp
      };
    }

    return {
      message: 'An unknown error occurred',
      code: 'UNKNOWN_ERROR',
      statusCode: 500,
      details: { error, context },
      timestamp
    };
  }

  /**
   * Log errors using centralized logger
   */
  private logError(error: AppError, context?: string): void {
    const logData = {
      ...error,
      context,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server'
    };

    // Use centralized logger instead of console.error
    centralizedLogger.error('Error handled by AppErrorHandler', { 
      action: 'error_handling', 
      data: logData, 
      component: context 
    });
    
    // Send to error tracking service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: logData.message,
        fatal: (logData as any).severity === 'critical' || false
      });
    }
  }

  /**
   * Add error listener for custom error handling
   */
  addErrorListener(listener: (error: AppError) => void): void {
    this.errorListeners.push(listener);
  }

  /**
   * Remove error listener
   */
  removeErrorListener(listener: (error: AppError) => void): void {
    const index = this.errorListeners.indexOf(listener);
    if (index > -1) {
      this.errorListeners.splice(index, 1);
    }
  }
}

// Singleton instance
export const errorHandler = AppErrorHandler.getInstance();

/**
 * Utility function for async error handling
 */
export async function handleAsyncError<T>(
  operation: () => Promise<T>,
  context?: string
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    errorHandler.handleError(error, context);
    return null;
  }
}

/**
 * Utility function for sync error handling
 */
export function handleSyncError<T>(
  operation: () => T,
  context?: string
): T | null {
  try {
    return operation();
  } catch (error) {
    errorHandler.handleError(error, context);
    return null;
  }
}

/**
 * Enhanced logging utilities to replace console.log/warn/error
 */
export class Logger {
  private static isDevelopment = process.env.NODE_ENV === 'development';

  static info(message: string, data?: unknown): void {
    if (Logger.isDevelopment) {
      centralizedLogger.info(message, { data });
    }
    // Production logging will be handled by centralized logger
  }

  static warn(message: string, data?: unknown): void {
    if (Logger.isDevelopment) {
      centralizedLogger.warn(message, { data });
    }
    // Production logging will be handled by centralized logger
  }

  static error(message: string, error?: unknown): void {
    const appError = errorHandler.handleError(error, message);
    
    if (Logger.isDevelopment) {
      centralizedLogger.error(message, { 
        action: 'logger_error', 
        data: appError 
      });
    }
    // Production logging will be handled by centralized logger
  }

  static debug(message: string, data?: unknown): void {
    if (Logger.isDevelopment) {
      centralizedLogger.debug(message, { data });
    }
  }
}

// Export logger instance
export const logger = Logger;