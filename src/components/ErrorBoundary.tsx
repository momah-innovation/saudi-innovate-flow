import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { debugLog } from "@/utils/debugLogger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to debug logger with structured context
    debugLog.error('ErrorBoundary caught error', { 
      component: 'ErrorBoundary', 
      action: 'componentDidCatch',
      errorInfo: errorInfo.componentStack 
    }, error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              We encountered an error while loading this component. Please try refreshing the page.
            </p>
            <div className="flex gap-4">
              <Button 
                onClick={() => this.setState({ hasError: false, error: undefined })}
                variant="outline"
              >
                Try Again
              </Button>
              <Button onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}