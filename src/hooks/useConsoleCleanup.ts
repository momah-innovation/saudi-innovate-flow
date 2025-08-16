/**
 * Console Cleanup Hook - Final Phase
 * Provides safe console.log replacements for remaining instances
 */

import { useStructuredLogging } from './useStructuredLogging';

export const useConsoleCleanup = () => {
  const logging = useStructuredLogging();

  // Safe replacements for console.log patterns
  const consoleReplacements = {
    // Development/debugging patterns
    logInfo: (message: string, data?: any) => {
      logging.log(message, { data, component: 'ConsoleCleanup' });
    },

    // Error patterns
    logError: (message: string, error?: Error) => {
      logging.error(message, { error, component: 'ConsoleCleanup' });
    },

    // Warning patterns
    logWarning: (message: string, data?: any) => {
      logging.warn(message, { data, component: 'ConsoleCleanup' });
    },

    // Debug patterns
    logDebug: (message: string, data?: any) => {
      logging.debug(message, { data, component: 'ConsoleCleanup' });
    },

    // Performance patterns
    logPerformance: (message: string, duration?: number, data?: any) => {
      logging.debug(message, { 
        component: 'Performance', 
        data: { duration, ...data }
      });
    },

    // Migration patterns
    logMigration: (message: string, data?: any) => {
      logging.log(message, { component: 'Migration', data });
    },

    // Script patterns
    logScript: (message: string, data?: any) => {
      logging.log(message, { component: 'Script', data });
    },

    // Generic safe replacement
    log: logging.log,
    warn: logging.warn,
    error: logging.error,
    debug: logging.debug
  };

  return consoleReplacements;
};