import { ReactNode } from 'react';
import { PageHeader } from './PageHeader';
import { BreadcrumbItem } from '@/types/navigation';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * PageLayout - Simplified, unified page layout component
 * Replaces the complex PageContainer/Section/ContentArea system
 * Features:
 * - Single component for all page layouts
 * - Consistent spacing system
 * - Responsive design
 * - RTL support
 * - Performance optimized
 */
export function PageLayout({ 
  children,
  title,
  description,
  breadcrumbs,
  actions,
  className,
  maxWidth = 'full',
  spacing = 'md'
}: PageLayoutProps) {
  const { isRTL } = useDirection();
  
  const maxWidthClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl', 
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-8xl',
    full: 'max-w-none'
  };

  const spacingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={cn(
      'min-h-full w-full',
      spacingClasses[spacing],
      className
    )}>
      <div className={cn(
        'mx-auto w-full',
        maxWidthClasses[maxWidth],
        isRTL && 'rtl'
      )}>
        {/* Page Header */}
        {(title || breadcrumbs?.length || actions) && (
          <PageHeader
            title={title || ''}
            description={description}
            action={actions}
          />
        )}
        
        {/* Page Content */}
        <div className={cn(
          title || breadcrumbs?.length || actions ? 'mt-6' : '',
          'w-full'
        )}>
          {children}
        </div>
      </div>
    </div>
  );
}