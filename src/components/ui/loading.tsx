import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";

// Loading Spinner
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-muted border-t-primary",
        sizeClasses[size],
        className
      )}
    />
  );
}

// Loading Dots
export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex space-x-1 justify-center", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-primary rounded-full animate-pulse"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

// Loading Pulse
export function LoadingPulse({ className }: { className?: string }) {
  return (
    <div className={cn("w-full h-2 bg-muted rounded-full overflow-hidden", className)}>
      <div className="w-full h-full bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse" />
    </div>
  );
}

// Progress Bar
interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ 
  value, 
  max = 100, 
  className, 
  showLabel = false,
  size = 'md'
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const { t } = useUnifiedTranslation();
  
  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span>{t('loading')}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn("bg-muted rounded-full overflow-hidden", sizeClasses[size])}>
        <div
          className="bg-primary h-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Skeleton Loaders for common components
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("p-6 space-y-4", className)}>
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4, className }: { 
  rows?: number; 
  cols?: number; 
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-6 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ items = 5, className }: { 
  items?: number; 
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton({ fields = 4, className }: { 
  fields?: number; 
  className?: string;
}) {
  return (
    <div className={cn("space-y-6", className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex gap-2 pt-4">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
}

// Full page loading overlay
interface LoadingOverlayProps {
  message?: string;
  className?: string;
}

export function LoadingOverlay({ message, className }: LoadingOverlayProps) {
  const { t } = useUnifiedTranslation();
  const defaultMessage = message || t('loading');
  
  return (
    <div className={cn(
      "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",
      className
    )}>
      <div className="text-center space-y-4 max-w-sm">
        <LoadingSpinner size="lg" />
        <p className="text-sm sm:text-base text-muted-foreground">{defaultMessage}</p>
      </div>
    </div>
  );
}

// Loading state for components
interface LoadingStateProps {
  type?: 'spinner' | 'skeleton' | 'dots' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export function LoadingState({ 
  type = 'spinner', 
  size = 'md', 
  message,
  className 
}: LoadingStateProps) {
  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return <LoadingSpinner size={size} />;
      case 'dots':
        return <LoadingDots />;
      case 'pulse':
        return <LoadingPulse />;
      case 'skeleton':
        return <CardSkeleton />;
      default:
        return <LoadingSpinner size={size} />;
    }
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-4 sm:p-8 space-y-3 sm:space-y-4", 
      className
    )}>
      {renderLoader()}
      {message && (
        <p className="text-muted-foreground text-xs sm:text-sm text-center max-w-sm">{message}</p>
      )}
    </div>
  );
}