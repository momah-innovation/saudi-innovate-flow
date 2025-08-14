import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

/**
 * Higher-order component that wraps components with error boundaries
 * Used for protecting lazy-loaded components from rendering errors
 */
export const withErrorBoundary = (Component: React.ComponentType<any>) => {
  return (props: any) => (
    <ErrorBoundary fallback={<div>Error loading component</div>}>
      <Component {...props} />
    </ErrorBoundary>
  );
};