import React from 'react';
import { AlertCircle, FileX, Search, RefreshCw, Plus } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
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
  icon: Icon = FileX,
  title,
  description,
  action,
  secondaryAction,
  className
}: EmptyStateProps) {
  return (
    <Card className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
        <Icon className="w-8 h-8 text-muted-foreground" />
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
  return (
    <EmptyState
      icon={Search}
      title="No data found"
      description="We couldn't find any data matching your criteria. Try adjusting your filters or search terms."
      action={onRefresh ? { label: "Refresh", onClick: onRefresh } : undefined}
    />
  );
}

export function NoResultsFound({ onClearFilters }: { onClearFilters?: () => void }) {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description="Your search didn't return any results. Try different keywords or clear your filters."
      action={onClearFilters ? { label: "Clear Filters", onClick: onClearFilters, variant: "outline" } : undefined}
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
  return (
    <EmptyState
      icon={Plus}
      title={`Create your first ${itemName.toLowerCase()}`}
      description={`Get started by creating your first ${itemName.toLowerCase()}. You can always edit or delete it later.`}
      action={{ label: `Create ${itemName}`, onClick: onCreate }}
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
  return (
    <EmptyState
      icon={AlertCircle}
      title="Something went wrong"
      description={error || "We encountered an error while loading your data. Please try again."}
      action={onRetry ? { label: "Try Again", onClick: onRetry } : undefined}
      secondaryAction={{ label: "Contact Support", onClick: () => window.open('/help', '_blank') }}
    />
  );
}

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <EmptyState
      icon={RefreshCw}
      title={message}
      description="Please wait while we fetch your data."
      className="animate-pulse"
    />
  );
}