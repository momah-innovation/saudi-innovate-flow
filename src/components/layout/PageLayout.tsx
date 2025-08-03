import { ReactNode } from 'react';
import { BreadcrumbItem } from '@/types/navigation';
import { useDirection } from '@/components/ui/direction-provider';
import { useTranslation } from '@/hooks/useAppTranslation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LayoutSelector } from '@/components/ui/layout-selector';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  itemCount?: number;
  breadcrumbs?: BreadcrumbItem[];
  
  // Standardized header controls
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  secondaryActions?: ReactNode;
  showLayoutSelector?: boolean;
  viewMode?: 'cards' | 'list' | 'grid';
  onViewModeChange?: (mode: 'cards' | 'list' | 'grid') => void;
  
  // Search and filters
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  
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
  itemCount,
  breadcrumbs,
  primaryAction,
  secondaryActions,
  showLayoutSelector = false,
  viewMode = 'cards',
  onViewModeChange,
  showSearch = false,
  searchValue = '',
  onSearchChange,
  searchPlaceholder,
  filters,
  className,
  maxWidth = 'full',
  spacing = 'md'
}: PageLayoutProps) {
  const { isRTL } = useDirection();
  const { t } = useTranslation();
  
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
        {/* Standardized Page Header */}
        {title && (
          <div className="space-y-6">
            {/* Title and Description */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                {(description || itemCount !== undefined) && (
                  <p className="text-muted-foreground mt-1">
                    {description}
                    {itemCount !== undefined && ` (${itemCount} ${itemCount === 1 ? t('item') : t('items')})`}
                  </p>
                )}
              </div>
              
              {/* Header Actions */}
              <div className="flex items-center gap-2">
                {secondaryActions}
                {showLayoutSelector && onViewModeChange && (
                  <LayoutSelector
                    viewMode={viewMode}
                    onViewModeChange={onViewModeChange}
                  />
                )}
                {primaryAction && (
                  <Button 
                    onClick={primaryAction.onClick} 
                    className="gap-2 bg-gradient-primary hover:opacity-90 text-white border-0 shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    {primaryAction.icon || <Plus className="w-4 h-4" />}
                    {primaryAction.label}
                  </Button>
                )}
              </div>
            </div>
            
            {/* Search and Filters Row */}
            {(showSearch || filters) && (
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                {showSearch && (
                  <div className="flex-1">
                    <div className="relative max-w-sm">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2" />
                      <Input
                        className="pl-10 h-9"
                        placeholder={searchPlaceholder || t('search')}
                        value={searchValue}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                {filters && (
                  <div className="flex flex-wrap gap-2 items-center">
                    {filters}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Page Content */}
        <div className={cn(
          title ? 'mt-6' : '',
          'w-full'
        )}>
          {children}
        </div>
      </div>
    </div>
  );
}