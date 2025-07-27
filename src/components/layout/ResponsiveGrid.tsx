import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  autoFit?: boolean;
  minItemWidth?: string;
}

/**
 * ResponsiveGrid - Flexible grid layout component
 * Handles responsive grid layouts with customizable breakpoints
 */
export function ResponsiveGrid({ 
  children, 
  className,
  columns = { mobile: 1, tablet: 2, desktop: 3, wide: 4 },
  gap = 'md',
  autoFit = false,
  minItemWidth = '250px'
}: ResponsiveGridProps) {
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  };

  const getGridCols = () => {
    if (autoFit) {
      return `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`;
    }
    
    const { mobile = 1, tablet = 2, desktop = 3, wide = 4 } = columns;
    return cn(
      `grid-cols-${mobile}`,
      `sm:grid-cols-${tablet}`,
      `lg:grid-cols-${desktop}`,
      `xl:grid-cols-${wide}`
    );
  };

  return (
    <div 
      className={cn(
        'grid w-full',
        !autoFit && getGridCols(),
        gapClasses[gap],
        className
      )}
      style={autoFit ? { gridTemplateColumns: getGridCols() } : undefined}
    >
      {children}
    </div>
  );
}