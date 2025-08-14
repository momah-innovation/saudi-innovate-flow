// Loading Skeleton Components for Better UX
// Provides consistent loading states across the application

import React from 'react';
import { cn } from '@/lib/utils';
import { useTimerManager } from '@/utils/timerManager';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'default' | 'circular' | 'rectangular' | 'text';
  animation?: 'pulse' | 'wave' | 'none';
}

export function LoadingSkeleton({ 
  className, 
  variant = 'default',
  animation = 'pulse' 
}: LoadingSkeletonProps) {
  const baseClasses = 'bg-muted';
  
  const variantClasses = {
    default: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    text: 'rounded h-4'
  };
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse',
    none: ''
  };
  
  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )} 
    />
  );
}

// Pre-built skeleton components for common use cases
export function CardSkeleton() {
  return (
    <div className="space-y-4 p-6 border rounded-lg">
      <LoadingSkeleton className="h-6 w-3/4" />
      <LoadingSkeleton className="h-4 w-full" />
      <LoadingSkeleton className="h-4 w-5/6" />
      <div className="flex space-x-2 pt-2">
        <LoadingSkeleton className="h-8 w-20" />
        <LoadingSkeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
          <LoadingSkeleton variant="circular" className="h-10 w-10" />
          <div className="space-y-2 flex-1">
            <LoadingSkeleton className="h-4 w-3/4" />
            <LoadingSkeleton className="h-3 w-1/2" />
          </div>
          <LoadingSkeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 8, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-muted/50 p-4 border-b">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <LoadingSkeleton key={i} className="h-4" />
          ))}
        </div>
      </div>
      
      {/* Body */}
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <LoadingSkeleton key={colIndex} className="h-4" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <LoadingSkeleton className="h-8 w-64" />
        <LoadingSkeleton className="h-4 w-96" />
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-6 border rounded-lg space-y-3">
            <LoadingSkeleton className="h-4 w-24" />
            <LoadingSkeleton className="h-8 w-16" />
            <LoadingSkeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg space-y-4">
          <LoadingSkeleton className="h-6 w-48" />
          <LoadingSkeleton className="h-64 w-full" />
        </div>
        <div className="p-6 border rounded-lg space-y-4">
          <LoadingSkeleton className="h-6 w-48" />
          <LoadingSkeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6 max-w-md">
      <div className="space-y-2">
        <LoadingSkeleton className="h-4 w-16" />
        <LoadingSkeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <LoadingSkeleton className="h-4 w-20" />
        <LoadingSkeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <LoadingSkeleton className="h-4 w-24" />
        <LoadingSkeleton className="h-24 w-full" />
      </div>
      <div className="flex space-x-3">
        <LoadingSkeleton className="h-10 w-24" />
        <LoadingSkeleton className="h-10 w-20" />
      </div>
    </div>
  );
}

// Progressive loading wrapper component
interface ProgressiveLoadingProps {
  isLoading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
}

export function ProgressiveLoading({ 
  isLoading, 
  skeleton, 
  children, 
  fallback,
  delay = 0 
}: ProgressiveLoadingProps) {
  const [showSkeleton, setShowSkeleton] = React.useState(isLoading);
  
  const { setTimeout: scheduleTimeout } = useTimerManager();
  
  React.useEffect(() => {
    if (isLoading) {
      setShowSkeleton(true);
    } else {
      const clearTimer = scheduleTimeout(() => {
        setShowSkeleton(false);
      }, delay);
      
      return clearTimer;
    }
  }, [isLoading, delay, scheduleTimeout]);
  
  if (showSkeleton) {
    return <>{skeleton}</>;
  }
  
  return <>{children || fallback}</>;
}