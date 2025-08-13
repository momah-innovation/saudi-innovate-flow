/**
 * Analytics Error Boundary
 * Handles errors in analytics components with fallback UI
 */

import React, { Component, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { logger } from '@/utils/logger';

interface AnalyticsErrorBoundaryProps {
  children: ReactNode;
  fallbackComponent?: ReactNode;
  showRefresh?: boolean;
  onRefresh?: () => void;
  componentName?: string;
}

interface AnalyticsErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
  retryCount: number;
}

export class AnalyticsErrorBoundary extends Component<
  AnalyticsErrorBoundaryProps,
  AnalyticsErrorBoundaryState
> {
  private maxRetries = 3;

  constructor(props: AnalyticsErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<AnalyticsErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const componentName = this.props.componentName || 'AnalyticsComponent';
    
    logger.error('Analytics component error', {
      component: componentName,
      error: error.message
    }, error);

    this.setState({
      error,
      errorInfo: errorInfo.componentStack
    });
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }));

      // Call refresh if provided
      if (this.props.onRefresh) {
        this.props.onRefresh();
      }
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }

      // Default error UI
      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Analytics Error
            </CardTitle>
            <CardDescription>
              Something went wrong while loading the analytics data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {this.state.error?.message || 'An unexpected error occurred'}
              </AlertDescription>
            </Alert>

            <div className="flex flex-col sm:flex-row gap-2">
              {this.props.showRefresh !== false && this.state.retryCount < this.maxRetries && (
                <Button
                  variant="outline"
                  onClick={this.handleRetry}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry ({this.maxRetries - this.state.retryCount} attempts left)
                </Button>
              )}
              
              <Button
                variant="secondary"
                onClick={this.handleReset}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Reset Component
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-muted-foreground">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                  {this.state.error?.stack}
                </pre>
                <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                  {this.state.errorInfo}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for wrapping analytics components
export function withAnalyticsErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string,
  fallbackComponent?: ReactNode
) {
  const WithErrorBoundaryComponent = (props: P) => (
    <AnalyticsErrorBoundary
      componentName={componentName || WrappedComponent.displayName || WrappedComponent.name}
      fallbackComponent={fallbackComponent}
      showRefresh={true}
    >
      <WrappedComponent {...props} />
    </AnalyticsErrorBoundary>
  );

  WithErrorBoundaryComponent.displayName = `withAnalyticsErrorBoundary(${
    componentName || WrappedComponent.displayName || WrappedComponent.name
  })`;

  return WithErrorBoundaryComponent;
}

// Simplified fallback component for analytics cards
export const AnalyticsFallback: React.FC<{
  title?: string;
  description?: string;
  onRetry?: () => void;
}> = ({ 
  title = "Analytics Unavailable", 
  description = "Unable to load analytics data at this time.", 
  onRetry 
}) => (
  <Card>
    <CardContent className="pt-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex flex-col gap-2">
          <span className="font-medium">{title}</span>
          <span className="text-sm text-muted-foreground">{description}</span>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="w-fit">
              <RefreshCw className="h-3 w-3 mr-1" />
              Try Again
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </CardContent>
  </Card>
);