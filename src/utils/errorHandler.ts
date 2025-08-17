import { logger } from './logger';
import { debugLog } from './debugLogger';

interface ErrorHandlerOptions {
  component: string;
  showToast?: boolean;
  logErrors?: boolean;
}

export const createErrorHandler = (options: ErrorHandlerOptions) => {
  const handleError = (error: Error, action: string) => {
    if (options.logErrors !== false) {
      logger.error(`Error in ${options.component}`, { 
        component: options.component, 
        action 
      }, error);
    }
    
    debugLog.error(`Error in ${action}`, { component: options.component }, error as Error);
  };

  return {
    handleError,
  };
};