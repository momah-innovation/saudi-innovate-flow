import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { errorHandler, Logger } from '@/utils/error-handler';
import { showErrorToast } from './toast-queue-manager';

interface GlobalErrorState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
  errorSource: 'boundary' | 'unhandled' | 'promise' | 'network';
}

interface GlobalErrorHandlerProps {
  children: ReactNode;
  fallback?: (error: Error, errorId: string, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableReporting?: boolean;
  maxRetries?: number;
}

class GlobalErrorHandler extends Component<GlobalErrorHandlerProps, GlobalErrorState> {
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(props: GlobalErrorHandlerProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0,
      errorSource: 'boundary'
    };

    // Set up global error listeners
    this.setupGlobalErrorHandlers();
  }

  private setupGlobalErrorHandlers() {
    // Unhandled JavaScript errors
    window.addEventListener('error', this.handleGlobalError);
    
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    
    // Network errors (for fetch API)
    this.interceptFetch();
  }

  private handleGlobalError = (event: ErrorEvent) => {
    const error = new Error(event.message);
    error.stack = `${event.filename}:${event.lineno}:${event.colno}`;
    
    this.handleError(error, 'unhandled');
    Logger.error('Global error caught', { error, event });
  };

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));
    
    this.handleError(error, 'promise');
    Logger.error('Unhandled promise rejection', { error, event });
  };

  private interceptFetch() {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        // Handle HTTP errors
        if (!response.ok) {
          const error = new Error(`Network error: ${response.status} ${response.statusText}`);
          this.handleError(error, 'network');
        }
        
        return response;
      } catch (error) {
        this.handleError(error as Error, 'network');
        throw error;
      }
    };
  }

  private handleError(error: Error, source: GlobalErrorState['errorSource']) {
    const errorId = `global-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Use the centralized error handler
    errorHandler.handleError(error, `Global/${source}`);
    
    // Show toast notification for non-boundary errors
    if (source !== 'boundary') {
      showErrorToast(
        error.message || 'An unexpected error occurred',
        { 
          title: this.getErrorTitle(source),
          duration: 6000,
          priority: 8
        }
      );
    }

    // Update state for boundary errors or critical errors
    if (source === 'boundary' || this.isCriticalError(error)) {
      this.setState({
        hasError: true,
        error,
        errorInfo: null,
        errorId,
        errorSource: source,
        retryCount: 0
      });
    }

    // Report error if enabled
    if (this.props.enableReporting) {
      this.reportError(error, errorId, source);
    }
  }

  private getErrorTitle(source: GlobalErrorState['errorSource']): string {
    const titles = {
      boundary: 'Component Error',
      unhandled: 'JavaScript Error',
      promise: 'Promise Rejection',
      network: 'Network Error'
    };
    return titles[source];
  }

  private isCriticalError(error: Error): boolean {
    // Define what constitutes a critical error that should trigger full error boundary
    const criticalPatterns = [
      /chunk/i,
      /module/i,
      /import/i,
      /syntax/i,
      /reference.*not.*defined/i
    ];
    
    return criticalPatterns.some(pattern => 
      pattern.test(error.message) || 
      (error.stack && pattern.test(error.stack))
    );
  }

  private async reportError(error: Error, errorId: string, source: string) {
    try {
      // In a real app, send to error reporting service
      const errorReport = {
        errorId,
        message: error.message,
        stack: error.stack,
        source,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        userId: null // Get from auth context if available
      };

      Logger.info('Error reported', errorReport);
      
      // Example: Send to service
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport)
      // });
    } catch (reportingError) {
      Logger.error('Failed to report error', reportingError);
    }
  }

  static getDerivedStateFromError(error: Error): Partial<GlobalErrorState> {
    const errorId = `boundary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId,
      errorSource: 'boundary'
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Call parent error handler
    this.props.onError?.(error, errorInfo);
    
    // Use centralized error handler
    errorHandler.handleError(error, 'ErrorBoundary');
    
    Logger.error('Error boundary caught error', { error, errorInfo });
  }

  componentWillUnmount() {
    // Clean up global listeners
    window.removeEventListener('error', this.handleGlobalError);
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
    
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    
    if (this.state.retryCount >= maxRetries) {
      showErrorToast('Maximum retry attempts reached', { 
        title: 'Retry Failed',
        duration: 5000 
      });
      return;
    }

    this.setState(prevState => ({
      retryCount: prevState.retryCount + 1
    }));

    // Reset error state with delay
    // Note: Class components can't use hooks directly, but this is acceptable for error handlers
    this.retryTimeout = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: ''
      });
    }, 1000);
  };

  private handleGoHome = () => {
    // Use navigate if available, otherwise fallback to window.location
    if (typeof window !== 'undefined' && (window as any).APP_NAVIGATE) {
      (window as any).APP_NAVIGATE('/');
    } else {
      window.location.href = '/';
    }
  };

  private handleReportIssue = () => {
    const { error, errorId } = this.state;
    const mailtoLink = `mailto:support@example.com?subject=Error Report ${errorId}&body=Error: ${error?.message}%0A%0APlease describe what you were doing when this error occurred.`;
    window.open(mailtoLink);
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(
          this.state.error!,
          this.state.errorId,
          this.handleRetry
        );
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
              <CardDescription>
                We've encountered an unexpected error. Our team has been notified.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Error ID:</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {this.state.errorId}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Source:</span>
                <Badge variant="secondary">
                  <Shield className="w-3 h-3 mr-1" />
                  {this.state.errorSource}
                </Badge>
              </div>

              {this.state.retryCount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Retry attempts:</span>
                  <Badge variant="outline">
                    {this.state.retryCount} / {this.props.maxRetries || 3}
                  </Badge>
                </div>
              )}

              {/* Error details (collapsible) */}
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full">
                    <Bug className="w-4 h-4 mr-2" />
                    Show Error Details
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="p-3 bg-muted rounded-md text-xs font-mono">
                    <div className="text-destructive font-semibold mb-2">
                      {this.state.error?.message}
                    </div>
                    {this.state.error?.stack && (
                      <pre className="whitespace-pre-wrap text-muted-foreground overflow-auto max-h-32">
                        {this.state.error.stack}
                      </pre>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              <div className="flex gap-2 w-full">
                <Button 
                  onClick={this.handleRetry}
                  disabled={this.state.retryCount >= (this.props.maxRetries || 3)}
                  className="flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="flex-1"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={this.handleReportIssue}
                className="w-full text-muted-foreground"
              >
                <Bug className="w-4 h-4 mr-2" />
                Report Issue
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for manual error reporting
export function useErrorHandler() {
  const reportError = (error: Error, context?: string) => {
    errorHandler.handleError(error, context);
  };

  const reportCriticalError = (error: Error, context?: string) => {
    // Force error boundary to trigger
    throw error;
  };

  return {
    reportError,
    reportCriticalError
  };
}

// Export the enhanced error boundary
export { GlobalErrorHandler };

// Convenience wrapper for app-level usage
export function withGlobalErrorHandler<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WrappedComponent(props: P) {
    return (
      <GlobalErrorHandler enableReporting={true} maxRetries={3}>
        <Component {...props} />
      </GlobalErrorHandler>
    );
  };
}