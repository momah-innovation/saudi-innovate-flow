/**
 * Centralized Error Boundary System
 * 
 * Provides comprehensive error handling with context awareness,
 * recovery mechanisms, and proper logging integration.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { debugLog } from './debugLogger';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  maxRetries?: number;
  resetKeys?: (string | number)[];
  resetOnPropsChange?: boolean;
  isolateError?: boolean;
  level?: 'page' | 'component' | 'feature';
}

interface ErrorContextType {
  reportError: (error: Error, context?: Record<string, any>) => void;
  clearError: () => void;
}

// Error Context for programmatic error reporting
export const ErrorContext = React.createContext<ErrorContextType | null>(null);

// Hook to use error context
export const useErrorHandler = () => {
  const context = React.useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorHandler must be used within an ErrorBoundary');
  }
  return context;
};

// Main Error Boundary Component
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, level = 'component' } = this.props;
    const { errorId } = this.state;

    // Enhanced error logging with context
    debugLog.error(`Error Boundary (${level})`, {
      errorId,
      componentStack: errorInfo.componentStack,
      level,
      retryCount: this.state.retryCount
    }, error);

    // Store error info in state
    this.setState({ errorInfo });

    // Call custom error handler
    onError?.(error, errorInfo);

    // Report to external error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportToErrorService(error, errorInfo, errorId);
    }
  }

  private reportToErrorService = (error: Error, errorInfo: ErrorInfo, errorId: string) => {
    // In a real app, this would send to Sentry, LogRocket, etc.
    debugLog.security('error_boundary_triggered', {
      errorId,
      errorMessage: error.message,
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  };

  private resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0
    });
  };

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount < maxRetries) {
      debugLog.debug('Error boundary retry attempt', {
        retryCount: retryCount + 1,
        maxRetries
      });

      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }));
    }
  };

  render() {
    const { hasError, error, retryCount } = this.state;
    const { children, fallback, maxRetries = 3, isolateError = false } = this.props;

    const contextValue: ErrorContextType = {
      reportError: (error: Error, context = {}) => {
        debugLog.error('Programmatic error report', context, error);
        this.setState({
          hasError: true,
          error,
          errorInfo: null,
          errorId: `programmatic_${Date.now()}`
        });
      },
      clearError: () => {
        this.resetErrorBoundary();
      }
    };

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback(error, this.handleRetry);
      }

      // Default error UI
      return (
        <ErrorContext.Provider value={contextValue}>
          <div className="error-boundary-container p-6 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-destructive mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              
              <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
              <p className="text-muted-foreground mb-4">
                {isolateError 
                  ? "This component encountered an error. Other parts of the app should continue working."
                  : "We encountered an unexpected error. Please try again."
                }
              </p>
              
              {retryCount < maxRetries && (
                <button 
                  onClick={this.handleRetry}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded mr-2"
                >
                  Try Again ({maxRetries - retryCount} remaining)
                </button>
              )}
              
              <button 
                onClick={() => window.location.reload()}
                className="bg-secondary text-secondary-foreground px-4 py-2 rounded"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </ErrorContext.Provider>
      );
    }

    return (
      <ErrorContext.Provider value={contextValue}>
        {children}
      </ErrorContext.Provider>
    );
  }
}

/**
 * Global error handler for unhandled promise rejections
 */
export const setupGlobalErrorHandling = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      debugLog.error('Unhandled promise rejection', {
        reason: event.reason,
        promise: event.promise
      });
      
      // Prevent default browser error reporting
      event.preventDefault();
    });

    window.addEventListener('error', (event) => {
      debugLog.error('Global error handler', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }, event.error);
    });
  }
};

export default ErrorBoundary;