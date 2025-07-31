import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ChallengeSkeletonProps {
  viewMode?: 'cards' | 'list' | 'grid';
  count?: number;
  className?: string;
}

export const ChallengeSkeleton = ({ 
  viewMode = 'cards', 
  count = 6,
  className = "" 
}: ChallengeSkeletonProps) => {
  if (viewMode === 'list') {
    return (
      <div className={cn("space-y-4", className)}>
        {[...Array(count)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const gridCols = viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={cn(`grid gap-6 ${gridCols}`, className)}>
      {[...Array(count)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="p-0">
            <Skeleton className="h-48 w-full rounded-t-lg" />
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

interface ChallengeLoadingStateProps {
  message?: string;
  showProgress?: boolean;
  className?: string;
}

export const ChallengeLoadingState = ({ 
  message = "Loading challenges...", 
  showProgress = false,
  className = ""
}: ChallengeLoadingStateProps) => (
  <div className={cn("flex flex-col items-center justify-center py-12 space-y-4", className)}>
    <div className="relative">
      <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin">
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
      </div>
    </div>
    
    <div className="text-center space-y-2">
      <p className="text-lg font-medium text-muted-foreground animate-pulse">
        {message}
      </p>
      {showProgress && (
        <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-[loading_2s_ease-in-out_infinite]" 
               style={{
                 animation: 'loading 2s ease-in-out infinite',
                 transformOrigin: 'left center'
               }}
          />
        </div>
      )}
    </div>
  </div>
);

export const ChallengeEmptyState = ({ 
  title = "No challenges found",
  description = "Try adjusting your filters or search terms",
  icon: Icon,
  actionLabel,
  onAction,
  className = ""
}: {
  title?: string;
  description?: string;
  icon?: any;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) => (
  <div className={cn("flex flex-col items-center justify-center py-16 space-y-6", className)}>
    <div className="relative">
      <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center">
        {Icon ? (
          <Icon className="w-12 h-12 text-muted-foreground/50" />
        ) : (
          <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
        )}
      </div>
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary/10 rounded-full animate-ping" />
    </div>
    
    <div className="text-center space-y-2">
      <h3 className="text-xl font-semibold text-muted-foreground">{title}</h3>
      <p className="text-muted-foreground/80 max-w-md">{description}</p>
    </div>
    
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 animate-fade-in"
      >
        {actionLabel}
      </button>
    )}
  </div>
);