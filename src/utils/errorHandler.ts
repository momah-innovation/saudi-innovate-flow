import { logger } from './logger';

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
    
    console.error(`[${options.component}] Error in ${action}:`, error);
  };

  return {
    handleError,
  };
};