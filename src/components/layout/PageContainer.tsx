import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useDirection } from '@/components/ui';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  background?: 'default' | 'muted' | 'card';
}

/**
 * PageContainer - Main page wrapper component
 * Provides consistent spacing, max-width, and background for all pages
 */
export function PageContainer({ 
  children, 
  className,
  maxWidth = 'full',
  padding = 'lg',
  background = 'default'
}: PageContainerProps) {
  const { isRTL } = useDirection();
  
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-none'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-6 lg:p-8'
  };

  const backgroundClasses = {
    default: 'bg-background',
    muted: 'bg-muted/20',
    card: 'bg-card'
  };

  return (
    <div className={cn(
      'min-h-screen w-full',
      backgroundClasses[background],
      className
    )}>
      <div className={cn(
        'mx-auto w-full',
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        isRTL && 'rtl'
      )}>
        {children}
      </div>
    </div>
  );
}