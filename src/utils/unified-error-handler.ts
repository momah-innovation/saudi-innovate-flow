import { toast } from '@/hooks/use-toast';
import { logger } from './logger';

export interface ErrorContext {
  component: string;
  operation: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface ErrorHandlerConfig {
  showToast?: boolean;
  logError?: boolean;
  component: string;
  fallbackMessage?: string;
}

class UnifiedErrorHandler {
  private config: ErrorHandlerConfig;

  constructor(config: ErrorHandlerConfig) {
    this.config = {
      showToast: true,
      logError: true,
      fallbackMessage: 'An unexpected error occurred. Please try again.',
      ...config
    };
  }

  handleError(
    error: unknown,
    context: Partial<ErrorContext> = {},
    customMessage?: string
  ): void {
    const errorMessage = this.extractErrorMessage(error);
    const fullContext = {
      component: this.config.component,
      ...context
    };

    // Log error if enabled
    if (this.config.logError) {
      logger.error(
        `Error in ${fullContext.component}`,
        fullContext,
        error as Error
      );
    }

    // Show toast if enabled
    if (this.config.showToast) {
      toast({
        title: 'Error',
        description: customMessage || errorMessage || this.config.fallbackMessage,
        variant: 'destructive'
      });
    }
  }

  private extractErrorMessage(error: unknown): string {
    if (typeof error === 'string') return error;
    
    if (error instanceof Error) {
      return error.message;
    }

    if (error && typeof error === 'object') {
      // Handle Supabase errors
      if ('message' in error && typeof error.message === 'string') {
        return error.message;
      }
      
      // Handle API errors
      if ('error' in error && typeof error.error === 'string') {
        return error.error;
      }
    }

    return this.config.fallbackMessage || 'An unexpected error occurred';
  }

  // Async operation wrapper with error handling
  async withErrorHandling<T>(
    operation: () => Promise<T>,
    context: Partial<ErrorContext> = {},
    customErrorMessage?: string
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      this.handleError(error, context, customErrorMessage);
      return null;
    }
  }

  // Sync operation wrapper with error handling
  withSyncErrorHandling<T>(
    operation: () => T,
    context: Partial<ErrorContext> = {},
    customErrorMessage?: string
  ): T | null {
    try {
      return operation();
    } catch (error) {
      this.handleError(error, context, customErrorMessage);
      return null;
    }
  }
}

// Factory function to create error handlers for components
export const createErrorHandler = (config: ErrorHandlerConfig) => 
  new UnifiedErrorHandler(config);

// Default error handler
export const defaultErrorHandler = createErrorHandler({
  component: 'Unknown',
  showToast: true,
  logError: true
});

// Common error handling patterns
export const handleAPIError = (
  error: unknown, 
  operation: string, 
  component: string
) => {
  defaultErrorHandler.handleError(error, { operation, component });
};

export const handleFormError = (
  error: unknown,
  formName: string,
  component: string
) => {
  defaultErrorHandler.handleError(
    error, 
    { operation: `${formName}_submission`, component },
    'Failed to submit form. Please check your input and try again.'
  );
};

export const handleFileError = (
  error: unknown,
  fileName: string,
  component: string
) => {
  defaultErrorHandler.handleError(
    error,
    { operation: 'file_upload', component, metadata: { fileName } },
    'Failed to upload file. Please try again.'
  );
};