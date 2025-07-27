import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContentAreaProps {
  children: ReactNode;
  className?: string;
  layout?: 'stack' | 'grid-2' | 'grid-3' | 'sidebar-left' | 'sidebar-right' | 'center';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
}

/**
 * ContentArea - Flexible content layout container
 * Handles different layout patterns with consistent spacing
 */
export function ContentArea({ 
  children, 
  className,
  layout = 'stack',
  gap = 'md',
  align = 'stretch',
  justify = 'start'
}: ContentAreaProps) {
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center', 
    end: 'items-end',
    stretch: 'items-stretch'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around'
  };

  const layoutClasses = {
    stack: 'flex flex-col',
    'grid-2': 'grid grid-cols-1 md:grid-cols-2',
    'grid-3': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    'sidebar-left': 'grid grid-cols-1 lg:grid-cols-[300px_1fr]',
    'sidebar-right': 'grid grid-cols-1 lg:grid-cols-[1fr_300px]',
    'center': 'flex flex-col items-center'
  };

  return (
    <div className={cn(
      'w-full',
      layoutClasses[layout],
      gapClasses[gap],
      alignClasses[align],
      justifyClasses[justify],
      className
    )}>
      {children}
    </div>
  );
}