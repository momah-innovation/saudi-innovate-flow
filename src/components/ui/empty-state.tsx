import React from 'react';
import { AlertCircle, FileX, Search, RefreshCw, Plus } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';
import { cn } from '@/lib/utils';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

export interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: IconOrElement = FileX,
  title,
  description,
  action,
  secondaryAction,
  className
}: EmptyStateProps) {
  const renderIcon = () => {
    if (React.isValidElement(IconOrElement)) {
      return IconOrElement;
    }
    if (typeof IconOrElement === 'function') {
      const Icon = IconOrElement as React.ComponentType<{ className?: string }>;
      return <Icon className="w-8 h-8 text-muted-foreground" />;
    }
    return <FileX className="w-8 h-8 text-muted-foreground" />;
  };

  return (
    <Card className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
        {renderIcon()}
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      
      {description && (
        <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3">
        {action && (
          <Button onClick={action.onClick} variant={action.variant || 'default'}>
            {action.label}
          </Button>
        )}
        
        {secondaryAction && (
          <Button onClick={secondaryAction.onClick} variant="outline">
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </Card>
  );
}

// Pre-built empty state variants
export function NoDataFound({ onRefresh }: { onRefresh?: () => void }) {
  const { t } = useUnifiedTranslation();
  
  return (
    <EmptyState
      icon={Search}
      title={t('ui.empty_state.no_data_found')}
      description={t('ui.empty_state.no_data_description')}
      action={onRefresh ? { label: t('ui.empty_state.refresh'), onClick: onRefresh } : undefined}
    />
  );
}

export function NoResultsFound({ onClearFilters }: { onClearFilters?: () => void }) {
  const { t } = useUnifiedTranslation();
  
  return (
    <EmptyState
      icon={Search}
      title={t('ui.empty_state.no_results_found')}
      description={t('ui.empty_state.no_results_description')}
      action={onClearFilters ? { label: t('ui.empty_state.clear_filters'), onClick: onClearFilters, variant: "outline" } : undefined}
    />
  );
}

export function CreateFirstItem({ 
  itemName, 
  onCreate 
}: { 
  itemName: string; 
  onCreate: () => void;
}) {
  const { t } = useUnifiedTranslation();
  
  return (
    <EmptyState
      icon={Plus}
      title={t('ui.empty_state.create_first_item', { itemName: itemName.toLowerCase() })}
      description={t('ui.empty_state.create_first_description', { itemName: itemName.toLowerCase() })}
      action={{ label: t('ui.empty_state.create', { itemName }), onClick: onCreate }}
    />
  );
}

export function ErrorState({ 
  onRetry, 
  error 
}: { 
  onRetry?: () => void; 
  error?: string;
}) {
  const { t } = useUnifiedTranslation();
  
  return (
    <EmptyState
      icon={AlertCircle}
      title={t('ui.empty_state.something_went_wrong')}
      description={error || t('ui.empty_state.error_description')}
      action={onRetry ? { label: t('ui.empty_state.try_again'), onClick: onRetry } : undefined}
      secondaryAction={{ label: t('ui.empty_state.contact_support'), onClick: () => window.open('/help', '_blank') }}
    />
  );
}

export function LoadingState({ message }: { message?: string }) {
  const { t } = useUnifiedTranslation();
  
  return (
    <EmptyState
      icon={RefreshCw}
      title={message || t('ui.empty_state.loading')}
      description={t('ui.empty_state.loading_description')}
      className="animate-pulse"
    />
  );
}