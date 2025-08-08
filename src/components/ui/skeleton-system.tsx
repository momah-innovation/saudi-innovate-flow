import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

// Base skeleton component
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  );
}

// Standardized skeleton patterns for consistent loading states

// Card patterns
export function SkeletonCard({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn("space-y-3 p-6 border rounded-lg bg-card", className)} {...props}>
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
    </div>
  );
}

// Avatar patterns
export function SkeletonAvatar({ 
  size = 'md',
  className,
  ...props 
}: SkeletonProps & { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <Skeleton 
      className={cn("rounded-full", sizeClasses[size], className)} 
      {...props} 
    />
  );
}

// Table patterns
export function SkeletonTable({ 
  rows = 5, 
  columns = 4,
  className,
  ...props 
}: SkeletonProps & { rows?: number; columns?: number }) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {/* Header */}
      <div className="flex space-x-4 p-4 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-4 flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex space-x-4 p-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// List patterns
export function SkeletonList({ 
  items = 5,
  showAvatar = true,
  className,
  ...props 
}: SkeletonProps & { items?: number; showAvatar?: boolean }) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={`item-${index}`} className="flex items-center space-x-3">
          {showAvatar && <SkeletonAvatar size="md" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Chart patterns
export function SkeletonChart({ 
  type = 'bar',
  className,
  ...props 
}: SkeletonProps & { type?: 'bar' | 'line' | 'pie' | 'area' }) {
  if (type === 'pie') {
    return (
      <div className={cn("flex flex-col items-center space-y-4", className)} {...props}>
        <Skeleton className="h-48 w-48 rounded-full" />
        <div className="flex space-x-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`legend-${i}`} className="flex items-center space-x-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {/* Chart title */}
      <Skeleton className="h-6 w-1/3" />
      
      {/* Chart area */}
      <div className="h-64 flex items-end space-x-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton 
            key={`bar-${i}`} 
            className="flex-1 rounded-t"
            style={{ height: `${Math.random() * 80 + 20}%` }}
          />
        ))}
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={`label-${i}`} className="h-3 w-8" />
        ))}
      </div>
    </div>
  );
}

// Form patterns
export function SkeletonForm({ 
  fields = 4,
  className,
  ...props 
}: SkeletonProps & { fields?: number }) {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={`field-${index}`} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex space-x-3 pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
}

// Page patterns
export function SkeletonPage({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      {/* Page header */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      
      {/* Navigation tabs */}
      <div className="flex space-x-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={`tab-${i}`} className="h-8 w-20" />
        ))}
      </div>
      
      {/* Content area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <SkeletonCard />
        </div>
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonList items={3} />
        </div>
      </div>
    </div>
  );
}

// Data visualization patterns
export function SkeletonStats({ 
  stats = 4,
  className,
  ...props 
}: SkeletonProps & { stats?: number }) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)} {...props}>
      {Array.from({ length: stats }).map((_, index) => (
        <div key={`stat-${index}`} className="p-4 border rounded-lg space-y-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-2 w-1/2" />
        </div>
      ))}
    </div>
  );
}

// Layout patterns
export function SkeletonHeader({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn("flex items-center justify-between p-4 border-b", className)} {...props}>
      <div className="flex items-center space-x-3">
        <SkeletonAvatar size="sm" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </div>
  );
}

export function SkeletonSidebar({ 
  items = 6,
  className,
  ...props 
}: SkeletonProps & { items?: number }) {
  return (
    <div className={cn("w-64 p-4 space-y-2", className)} {...props}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={`nav-${index}`} className="flex items-center space-x-3 p-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  );
}

// Context-aware loading states
export function SkeletonDashboard({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      <SkeletonHeader />
      <SkeletonStats stats={4} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonChart />
        <SkeletonChart type="pie" />
      </div>
      <SkeletonTable rows={6} columns={5} />
    </div>
  );
}