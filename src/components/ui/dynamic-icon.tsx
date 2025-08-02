/**
 * Dynamic Icon Component with Optimized Loading
 * Implements lucide-react best practices for bundle optimization
 */

import React, { lazy, Suspense } from 'react';
import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import { cn } from '@/lib/utils';

const fallback = (
  <div 
    className="animate-pulse bg-muted rounded-sm"
    style={{ width: 24, height: 24 }}
    aria-hidden="true"
  />
);

interface DynamicIconProps extends Omit<LucideProps, 'ref'> {
  name: keyof typeof dynamicIconImports;
  fallbackClassName?: string;
}

/**
 * Dynamic icon component that loads icons on demand
 * Reduces initial bundle size by only loading used icons
 */
export const DynamicIcon = ({ 
  name, 
  className,
  fallbackClassName,
  size = 24,
  ...props 
}: DynamicIconProps) => {
  const LucideIcon = lazy(dynamicIconImports[name]);

  const customFallback = fallbackClassName ? (
    <div 
      className={cn("animate-pulse bg-muted rounded-sm", fallbackClassName)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  ) : fallback;

  return (
    <Suspense fallback={customFallback}>
      <LucideIcon 
        className={className}
        size={size}
        {...props} 
      />
    </Suspense>
  );
};

// Export type for external use
export type { DynamicIconProps };