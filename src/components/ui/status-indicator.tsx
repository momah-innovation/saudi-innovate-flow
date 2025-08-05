import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, AlertCircle, XCircle, Loader2 } from 'lucide-react';

export type StatusType = 'success' | 'pending' | 'warning' | 'error' | 'loading';

interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const statusConfig = {
  success: {
    icon: CheckCircle,
    className: 'text-success bg-success/10 border-success/20',
    label: 'Success'
  },
  pending: {
    icon: Clock,
    className: 'text-warning bg-warning/10 border-warning/20',
    label: 'Pending'
  },
  warning: {
    icon: AlertCircle,
    className: 'text-warning bg-warning/10 border-warning/20',
    label: 'Warning'
  },
  error: {
    icon: XCircle,
    className: 'text-destructive bg-destructive/10 border-destructive/20',
    label: 'Error'
  },
  loading: {
    icon: Loader2,
    className: 'text-primary bg-primary/10 border-primary/20',
    label: 'Loading'
  }
};

const sizeConfig = {
  sm: {
    container: 'px-2 py-1 text-xs',
    icon: 'w-3 h-3'
  },
  md: {
    container: 'px-3 py-1.5 text-sm',
    icon: 'w-4 h-4'
  },
  lg: {
    container: 'px-4 py-2 text-base',
    icon: 'w-5 h-5'
  }
};

export function StatusIndicator({ 
  status, 
  label, 
  size = 'md', 
  showIcon = true,
  className 
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const displayLabel = label || config.label;
  
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 rounded-full border font-medium",
      config.className,
      sizeConfig[size].container,
      className
    )}>
      {showIcon && (
        <Icon className={cn(
          sizeConfig[size].icon,
          status === 'loading' && 'animate-spin'
        )} />
      )}
      {displayLabel}
    </div>
  );
}

export function StatusDot({ status, className }: { status: StatusType; className?: string }) {
  const config = statusConfig[status];
  
  return (
    <div className={cn(
      "w-2 h-2 rounded-full",
      config.className.split(' ')[0].replace('text-', 'bg-'),
      className
    )} />
  );
}