import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useDirection } from '@/components/ui/direction-provider';
import { Button } from '@/components/ui/button';

interface ActionButton {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  actionButton?: ActionButton;
  itemCount?: number;
  children?: ReactNode;
  className?: string;
}

/**
 * PageHeader - Standardized page header with title, description, and actions
 * Supports RTL/LTR layouts and consistent spacing
 */
export function PageHeader({ 
  title, 
  description, 
  action, 
  actionButton,
  itemCount,
  children, 
  className 
}: PageHeaderProps) {
  const { isRTL } = useDirection();

  return (
    <div className={cn(
      'flex items-start justify-between gap-4 mb-6',
      isRTL && 'flex-row-reverse',
      className
    )}>
      <div className={cn('flex-1', isRTL && 'text-right')}>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {itemCount !== undefined && (
            <span className="text-lg text-muted-foreground">({itemCount})</span>
          )}
        </div>
        {description && (
          <p className="text-muted-foreground text-lg">
            {description}
          </p>
        )}
        {children}
      </div>
      
      {(action || actionButton) && (
        <div className="flex-shrink-0">
          {action}
          {actionButton && (
            <Button onClick={actionButton.onClick}>
              {actionButton.icon}
              {actionButton.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}