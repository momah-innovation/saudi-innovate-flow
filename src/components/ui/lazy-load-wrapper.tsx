/**
 * Phase 8: Performance Optimization - Enhanced Loading Component
 * Provides consistent loading states for lazy-loaded components
 */

import { Suspense, ReactNode } from 'react';
import { LoadingSpinner } from '@/components/ui/loading';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDirection } from '@/components/ui/direction-provider';

interface LazyLoadWrapperProps {
  children: ReactNode;
  fallback?: 'spinner' | 'skeleton' | 'card' | 'minimal';
  height?: string;
  className?: string;
}

const LoadingFallbacks = {
  spinner: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingSpinner />
    </div>
  ),
  
  minimal: () => (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
  
  skeleton: () => (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-64" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-3 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  ),
  
  card: () => (
    <div className="p-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
};

export function LazyLoadWrapper({ 
  children, 
  fallback = 'spinner', 
  height = 'min-h-[400px]',
  className = ''
}: LazyLoadWrapperProps) {
  const { isRTL } = useDirection();
  
  return (
    <div className={`${height} ${className} ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Suspense fallback={LoadingFallbacks[fallback]()}>
        {children}
      </Suspense>
    </div>
  );
}

/**
 * Specialized loading wrappers for different component types
 */

// For admin management pages
export function AdminPageWrapper({ children }: { children: ReactNode }) {
  return (
    <LazyLoadWrapper 
      fallback="skeleton" 
      height="min-h-screen"
      className="admin-page-wrapper"
    >
      {children}
    </LazyLoadWrapper>
  );
}

// For analytics dashboards
export function AnalyticsWrapper({ children }: { children: ReactNode }) {
  return (
    <LazyLoadWrapper 
      fallback="card" 
      height="min-h-[600px]"
      className="analytics-wrapper"
    >
      {children}
    </LazyLoadWrapper>
  );
}

// For dialog/modal content
export function DialogContentWrapper({ children }: { children: ReactNode }) {
  return (
    <LazyLoadWrapper 
      fallback="minimal" 
      height="min-h-[300px]"
      className="dialog-content-wrapper"
    >
      {children}
    </LazyLoadWrapper>
  );
}

// For wizard components
export function WizardWrapper({ children }: { children: ReactNode }) {
  return (
    <LazyLoadWrapper 
      fallback="skeleton" 
      height="min-h-[500px]"
      className="wizard-wrapper"
    >
      {children}
    </LazyLoadWrapper>
  );
}

export default LazyLoadWrapper;