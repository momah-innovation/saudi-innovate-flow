import React, { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useDirection } from './direction-provider';

const layoutGridVariants = cva('grid gap-4', {
  variants: {
    columns: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      5: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5',
      6: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6',
      auto: 'grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))]',
    },
    gap: {
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },
    alignment: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    }
  },
  defaultVariants: {
    columns: 'auto',
    gap: 'md',
    alignment: 'stretch'
  },
});

const containerVariants = cva('w-full', {
  variants: {
    maxWidth: {
      none: 'max-w-none',
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      '2xl': 'max-w-screen-2xl',
      full: 'max-w-full',
    },
    padding: {
      none: '',
      sm: 'px-4',
      md: 'px-6',
      lg: 'px-8',
      xl: 'px-12',
    },
    center: {
      true: 'mx-auto',
      false: '',
    }
  },
  defaultVariants: {
    maxWidth: 'full',
    padding: 'md',
    center: true,
  },
});

export interface LayoutGridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof layoutGridVariants> {
  children: ReactNode;
}

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  children: ReactNode;
}

export function LayoutGrid({
  className,
  columns,
  gap,
  alignment,
  children,
  ...props
}: LayoutGridProps) {
  const { isRTL } = useDirection();
  
  return (
    <div
      className={cn(
        layoutGridVariants({ columns, gap, alignment }),
        isRTL && 'direction-rtl',
        className
      )}
      dir={isRTL ? 'rtl' : 'ltr'}
      {...props}
    >
      {children}
    </div>
  );
}

export function Container({
  className,
  maxWidth,
  padding,
  center,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(containerVariants({ maxWidth, padding, center }), className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Responsive flex layouts
export function FlexLayout({
  children,
  direction = 'row',
  wrap = 'wrap',
  justify = 'start',
  align = 'start',
  gap = 'md',
  className,
  ...props
}: {
  children: ReactNode;
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  gap?: 'sm' | 'md' | 'lg' | 'xl';
} & React.HTMLAttributes<HTMLDivElement>) {
  const { isRTL } = useDirection();
  
  const adjustedDirection = React.useMemo(() => {
    if (!isRTL) return direction;
    
    switch (direction) {
      case 'row':
        return 'row-reverse';
      case 'row-reverse':
        return 'row';
      default:
        return direction;
    }
  }, [direction, isRTL]);

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4', 
    lg: 'gap-6',
    xl: 'gap-8',
  };

  return (
    <div
      className={cn(
        'flex',
        `flex-${adjustedDirection}`,
        `flex-${wrap}`,
        `justify-${justify}`,
        `items-${align}`,
        gapClasses[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Card grid for consistent card layouts
export function CardGrid({
  children,
  minCardWidth = '280px',
  gap = 'md',
  className,
  ...props
}: {
  children: ReactNode;
  minCardWidth?: string;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
} & React.HTMLAttributes<HTMLDivElement>) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6', 
    xl: 'gap-8',
  };

  return (
    <div
      className={cn(
        'grid',
        gapClasses[gap],
        className
      )}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}, 1fr))`
      }}
      {...props}
    >
      {children}
    </div>
  );
}