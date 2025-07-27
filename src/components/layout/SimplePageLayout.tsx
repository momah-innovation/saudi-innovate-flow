import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useDirection } from '@/components/ui/direction-provider';

interface SimplePageLayoutProps {
  children: ReactNode;
  className?: string;
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

/**
 * SimplePageLayout - Streamlined page layout without excessive nesting
 * Replaces the combination of PageContainer + Section + ContentArea
 */
export function SimplePageLayout({ 
  children, 
  className,
  spacing = 'md',
  maxWidth = 'full'
}: SimplePageLayoutProps) {
  const { isRTL } = useDirection();
  
  const spacingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-none'
  };

  return (
    <div className={cn(
      'w-full min-h-0',
      spacingClasses[spacing],
      className
    )}>
      <div className={cn(
        'mx-auto w-full',
        maxWidthClasses[maxWidth],
        isRTL && 'rtl'
      )}>
        {children}
      </div>
    </div>
  );
}