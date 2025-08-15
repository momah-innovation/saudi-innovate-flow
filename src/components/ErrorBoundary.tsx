import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { debugLog } from "@/utils/debugLogger";
import { useTranslation } from "react-i18next";

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
          <ErrorFallback />
        )
      );
    }

    return this.props.children;
  }
}

// Separate functional component for translation support
function ErrorFallback() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-bold mb-4">{t('errors.something_went_wrong')}</h2>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        {t('error_boundary.description', 'We encountered an error while loading this component. Please try refreshing the page.')}
      </p>
      <div className="flex gap-4">
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
        >
          {t('common.actions.try_again')}
        </Button>
        <Button onClick={() => window.location.reload()}>
          {t('error_boundary.refresh_page', 'Refresh Page')}
        </Button>
      </div>
    </div>
  );
}