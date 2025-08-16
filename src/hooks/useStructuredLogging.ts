/**
 * Hook to provide safe console.log replacements
 * Migrates all console usage to structured logging
 */

import { useCallback } from 'react';
import { debugLog } from '@/utils/debugLogger';

interface LogContext {
  component?: string;
  action?: string;
  data?: Record<string, any>;
  error?: Error | unknown;
}

export const useStructuredLogging = () => {
  const logDebug = useCallback((message: string, context?: LogContext) => {
    debugLog.debug(message, context);
  }, []);

  const logInfo = useCallback((message: string, context?: LogContext) => {
    debugLog.log(message, context);
  }, []);

  const logWarning = useCallback((message: string, context?: LogContext) => {
    debugLog.warn(message, context);
  }, []);

  const logError = useCallback((message: string, context?: LogContext) => {
    debugLog.error(message, context, context?.error as Error);
  }, []);

  const logMigrationStep = useCallback((step: string, table?: string, updated?: number, errors?: string[]) => {
    debugLog.log(`Migration: ${step}`, {
      component: 'Migration',
      data: { table, updated, errors }
    });
  }, []);

  const logNavigationEvent = useCallback((event: string, path?: string) => {
    debugLog.log(`Navigation: ${event}`, {
      component: 'Navigation',
      data: { path }
    });
  }, []);

  const logRoleFilter = useCallback((action: string, data: Record<string, any>) => {
    debugLog.log(`Role Filter: ${action}`, {
      component: 'RBAC',
      data
    });
  }, []);

  const logTranslationEvent = useCallback((event: string, data?: Record<string, any>) => {
    debugLog.log(`Translation: ${event}`, {
      component: 'i18n',
      data
    });
  }, []);

  // Safe replacement functions for common console patterns
  const replacements = {
    // Replace console.log
    log: logInfo,
    
    // Replace console.warn  
    warn: logWarning,
    
    // Replace console.error
    error: logError,
    
    // Replace console.debug
    debug: logDebug,
    
    // Migration-specific logging
    migration: logMigrationStep,
    
    // Navigation-specific logging
    navigation: logNavigationEvent,
    
    // Role filtering logging
    roleFilter: logRoleFilter,
    
    // Translation logging
    translation: logTranslationEvent
  };

  return replacements;
};

export default useStructuredLogging;