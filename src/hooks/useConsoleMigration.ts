/**
 * Final Console Migration Hook - Phase 5
 * Replaces all remaining console.log patterns with structured logging
 */

import { useStructuredLogging } from './useStructuredLogging';

export const useConsoleMigration = () => {
  const logging = useStructuredLogging();

  // Migration helpers for quick replacement
  const migrationHelpers = {
    // Navigation console patterns
    logNavigation: (message: string, path?: string) => {
      logging.navigation(message, path);
    },

    // Error boundary patterns
    logErrorBoundary: (message: string, error?: Error) => {
      logging.error(message, { component: 'ErrorBoundary', error });
    },

    // Translation system patterns
    logTranslation: (event: string, data?: Record<string, any>) => {
      logging.translation(event, data);
    },

    // Performance patterns
    logPerformance: (message: string, data?: Record<string, any>) => {
      logging.debug(message, { component: 'Performance', data });
    },

    // Search patterns
    logSearch: (action: string, data?: Record<string, any>) => {
      logging.log(action, { component: 'Search', data });
    },

    // Admin patterns
    logAdmin: (action: string, data?: Record<string, any>) => {
      logging.log(action, { component: 'Admin', data });
    },

    // Generic replacement for console.log
    log: logging.log,
    warn: logging.warn,
    error: logging.error,
    debug: logging.debug
  };

  return migrationHelpers;
};