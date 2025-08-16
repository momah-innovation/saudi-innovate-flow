/**
 * Phase 8: Performance Optimization - Error Boundary Implementation
 * Comprehensive error handling for production stability
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { logger } from '@/utils/logger';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'component' | 'section';
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      logger.error('Error Boundary caught an error', { component: 'ErrorBoundary', action: 'componentDidCatch' }, error);
    }

    // In production, you might want to send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props;
    
    if (this.state.hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys?.some((key, i) => key !== prevProps.resetKeys?.[i])) {
        this.resetErrorBoundary();
      }
    }

    if (this.state.hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetErrorBoundary();
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // Implement error logging service (e.g., Sentry, LogRocket, etc.)
    try {
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        // Use proper URL building for error reporting
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: navigator.userAgent,
        errorId: this.state.errorId,
        level: this.props.level || 'component'
      };
      
      // Send to error reporting service
      logger.info('Error report created', { 
        component: 'ErrorBoundary', 
        action: 'logErrorToService',
        data: { errorId: this.state.errorId, message: error.message }
      });
    } catch (loggingError) {
      logger.error('Failed to log error', { component: 'ErrorBoundary', action: 'logErrorToService' }, loggingError as Error);
    }
  };

  private resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
  };

  private retryWithDelay = () => {
    // Note: Class components can't use hooks directly, using timerManager singleton for memory safety
    import('@/utils/timerManager').then(({ default: timerManager }) => {
      timerManager.setTimeout('error-boundary-retry', () => {
        this.resetErrorBoundary();
      }, 1000);
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI based on level
      return <ErrorFallbackUI 
        error={this.state.error}
        errorInfo={this.state.errorInfo}
        level={this.props.level || 'component'}
        onRetry={this.resetErrorBoundary}
        onRetryWithDelay={this.retryWithDelay}
        errorId={this.state.errorId}
      />;
    }

    return this.props.children;
  }
}

/**
 * Error Fallback UI Component
 */
interface ErrorFallbackUIProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  level: 'page' | 'component' | 'section';
  onRetry: () => void;
  onRetryWithDelay: () => void;
  errorId: string;
}

function ErrorFallbackUI({ 
  error, 
  errorInfo, 
  level, 
  onRetry, 
  onRetryWithDelay, 
  errorId 
}: ErrorFallbackUIProps) {
  const { isRTL } = useDirection();

  const errorMessages = {
    page: {
      ar: 'حدث خطأ في تحميل الصفحة',
      en: 'An error occurred while loading the page'
    },
    component: {
      ar: 'حدث خطأ في هذا المكون',
      en: 'An error occurred in this component'
    },
    section: {
      ar: 'حدث خطأ في هذا القسم',
      en: 'An error occurred in this section'
    }
  };

  const retryMessages = {
    ar: 'إعادة المحاولة',
    en: 'Try Again'
  };

  const homeMessages = {
    ar: 'العودة للرئيسية',
    en: 'Go Home'
  };

  const reportMessages = {
    ar: 'الإبلاغ عن المشكلة',
    en: 'Report Issue'
  };

  const getErrorSize = () => {
    switch (level) {
      case 'page': return 'min-h-[400px] p-8';
      case 'section': return 'min-h-[200px] p-6';
      case 'component': return 'min-h-[150px] p-4';
      default: return 'min-h-[150px] p-4';
    }
  };

  const handleReportIssue = () => {
    const subject = `Error Report - ${errorId}`;
    const body = `Error ID: ${errorId}\nError: ${error?.message}\nTimestamp: ${new Date().toISOString()}`;
    const mailtoUrl = `mailto:support@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  return (
    <div className={`flex items-center justify-center ${getErrorSize()}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Card className="w-full max-w-md border-destructive/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle className="text-destructive">
            {isRTL ? errorMessages[level].ar : errorMessages[level].en}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && error && (
            <details className="text-xs text-muted-foreground bg-muted p-2 rounded">
              <summary className="cursor-pointer font-medium">Technical Details</summary>
              <div className="mt-2 space-y-1">
                <div><strong>Error:</strong> {error.message}</div>
                <div><strong>Error ID:</strong> {errorId}</div>
                {errorInfo && (
                  <div><strong>Component Stack:</strong> 
                    <pre className="text-xs mt-1 overflow-auto">{errorInfo.componentStack}</pre>
                  </div>
                )}
              </div>
            </details>
          )}
          
          <div className="flex flex-col gap-2">
            <Button onClick={onRetry} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              {isRTL ? retryMessages.ar : retryMessages.en}
            </Button>
            
            {level === 'page' && (
              <Button 
                variant="outline" 
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).APP_NAVIGATE) {
                    (window as any).APP_NAVIGATE('/');
                  } else {
                    // Use proper navigation instead of direct window.location
                    const navigate = (window as any).APP_NAVIGATE;
                    if (navigate) navigate('/'); else window.location.href = '/';
                  }
                }}
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                {isRTL ? homeMessages.ar : homeMessages.en}
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              onClick={handleReportIssue}
              className="w-full text-sm"
            >
              <Bug className="w-4 h-4 mr-2" />
              {isRTL ? reportMessages.ar : reportMessages.en}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Specialized Error Boundary Components
 */

// Page-level error boundary
export function PageErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary 
      level="page"
      resetOnPropsChange={true}
      onError={(error, errorInfo) => {
        // Log page-level errors with high priority
        logger.error('Page Error', { component: 'PageErrorBoundary', action: 'onError' }, error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// Component-level error boundary
export function ComponentErrorBoundary({ 
  children, 
  componentName 
}: { 
  children: ReactNode;
  componentName?: string;
}) {
  return (
    <ErrorBoundary 
      level="component"
      onError={(error, errorInfo) => {
        logger.warn(`Component Error in ${componentName}`, { component: 'ComponentErrorBoundary', action: 'onError', data: { componentName }}, error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// Section-level error boundary
export function SectionErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary level="section">
      {children}
    </ErrorBoundary>
  );
}

// Form-specific error boundary
export function FormErrorBoundary({ 
  children, 
  onFormError 
}: { 
  children: ReactNode;
  onFormError?: (error: Error) => void;
}) {
  return (
    <ErrorBoundary 
      level="component"
      onError={(error, errorInfo) => {
        onFormError?.(error);
        logger.warn('Form Error', { component: 'FormErrorBoundary', action: 'onError' }, error);
      }}
      fallback={
        <Card className="p-6 border-destructive/20">
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-destructive" />
            <p className="text-destructive font-medium">Form Error</p>
            <p className="text-sm text-muted-foreground mt-1">
              Please refresh the page and try again
            </p>
          </div>
        </Card>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

// Higher-order component for adding error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  level: 'page' | 'component' | 'section' = 'component'
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary level={level}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

export default ErrorBoundary;