/**
 * Centralized logging utility for the application
 * Provides structured logging with context and environment awareness
 */

export interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  status?: string;
  operation?: string;
  duration?: number;
  language?: string;
  key?: string;
  ideaId?: string;
  query?: string;
  expertId?: string;
  partnerId?: string;
  challengeId?: string;
  eventId?: string;
  fileName?: string;
  fileSize?: number;
  prompt?: string;
  resourceType?: string;
  resourceId?: string;
  notificationId?: string;
  filters?: any;
  data?: Record<string, any>;
}

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${Object.entries(context).map(([k, v]) => `${k}:${v}`).join(', ')}]` : '';
    return `[${timestamp}] ${level.toUpperCase()}${contextStr}: ${message}`;
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    if (!this.isDevelopment && level === LogLevel.DEBUG) return;
    
    const formattedMessage = this.formatMessage(level, message, context);
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, error || '');
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, error || '');
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, error || '');
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, error || '');
        break;
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: LogContext, error?: Error): void {
    this.log(LogLevel.WARN, message, context, error);
  }

  error(message: string, context?: LogContext, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  // Specialized methods for common use cases
  api(action: string, status: 'success' | 'error', data?: any, error?: Error): void {
    const level = status === 'success' ? LogLevel.INFO : LogLevel.ERROR;
    this.log(level, `API ${action}`, { action, status, data }, error);
  }

  user(action: string, userId?: string, data?: any): void {
    this.log(LogLevel.INFO, `User action: ${action}`, { action, userId, data });
  }

  performance(operation: string, duration: number, context?: LogContext): void {
    this.log(LogLevel.DEBUG, `Performance: ${operation} took ${duration}ms`, { ...context, operation, duration });
  }
}

export const logger = new Logger();