import { ReactNode, useState } from "react";
import { Plus, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { LayoutSelector, ViewMode } from "@/components/ui/layout-selector";
import { ViewLayouts } from "@/components/ui/view-layouts";
import { SearchAndFilters } from "@/components/ui/search-and-filters";
import { CompactSearchAndFilters } from "@/components/ui/compact-search-filters";
import { BulkActions } from "@/components/ui/bulk-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

// Use unified ViewMode from layout-selector
export type FilterConfig = {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'text' | 'number';
  options?: { label: string; value: string }[];
  placeholder?: string;
  value?: any;
  onChange: (value: any) => void;
};

export type BulkAction = {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: (selectedIds: string[]) => void;
  variant?: "default" | "outline" | "destructive";
};

interface StandardPageLayoutProps {
  // Page identification
  title: string;
  description?: string;
  itemCount?: number;
  
  // Add new record functionality
  addButton?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  
  // Layout options
  supportedLayouts?: ViewMode[];
  defaultLayout?: ViewMode;
  onLayoutChange?: (layout: ViewMode) => void;
  
  // Search and filtering
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  filters?: FilterConfig[];
  hasActiveFilters?: boolean;
  quickFilters?: ReactNode;
  onClearFilters?: () => void;
  
  // Bulk actions
  selectedItems?: string[];
  onSelectAll?: (selected: boolean) => void;
  onSelectItem?: (id: string, selected: boolean) => void;
  bulkActions?: BulkAction[];
  totalItems?: number;
  bulkMode?: boolean;
  onToggleBulkMode?: () => void;
  
  // Content
  children: ReactNode | ReactNode[];
  emptyState?: ReactNode;
  loading?: boolean;
  
  // Additional header content
  headerActions?: ReactNode;
  rightContent?: ReactNode;
  
  // Custom content renderer for special layouts
  customRenderer?: (layout: ViewMode, children: ReactNode | ReactNode[]) => ReactNode;
  
  className?: string;
}

export function StandardPageLayout({
  title,
  description,
  itemCount,
  addButton,
  supportedLayouts = ['cards', 'list', 'grid'],
  defaultLayout = 'cards',
  onLayoutChange,
  searchTerm = '',
  onSearchChange,
  filters = [],
  hasActiveFilters = false,
  quickFilters,
  onClearFilters,
  selectedItems = [],
  onSelectAll,
  onSelectItem,
  bulkActions = [],
  totalItems = 0,
  bulkMode = false,
  onToggleBulkMode,
  children,
  emptyState,
  loading,
  headerActions,
  rightContent,
  customRenderer,
  className
}: StandardPageLayoutProps) {
  const [currentLayout, setCurrentLayout] = useState<ViewMode>(defaultLayout);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { t } = useUnifiedTranslation();
  
  const hasSelectedItems = selectedItems.length > 0;
  const showLayoutSelector = supportedLayouts.length > 1;
  const showSearch = onSearchChange !== undefined;
  const showFilters = filters.length > 0 || quickFilters !== undefined;
  const showBulkActions = bulkActions.length > 0 && totalItems > 0;
  const showBulkToggle = bulkActions.length > 0 && totalItems > 0;
  
  const handleLayoutChange = (layout: ViewMode) => {
    setCurrentLayout(layout);
    onLayoutChange?.(layout);
  };
  
  const renderContent = () => {
    if (loading) {
      return <div className="flex items-center justify-center p-8">{t('loading')}</div>;
    }
    
    if (!Array.isArray(children) && !children) {
      return emptyState || (
        <div className="text-center p-8 text-muted-foreground">
          {t('noResults')}
        </div>
      );
    }
    
    // Use custom renderer for special layouts
    if (customRenderer && ['calendar', 'gantt', 'timeline'].includes(currentLayout)) {
      return customRenderer(currentLayout, children);
    }
    
    // Use standard view layouts for cards/list/grid
    if (['cards', 'list', 'grid'].includes(currentLayout)) {
      return (
        <ViewLayouts 
          viewMode={currentLayout as 'cards' | 'list' | 'grid'} 
          children={Array.isArray(children) ? children : [children]}
        />
      );
    }
    
    return children;
  };
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Page Header */}
      <PageHeader
        title={title}
        description={description}
        itemCount={itemCount}
        actionButton={addButton ? {
          label: addButton.label,
          icon: addButton.icon || <Plus className="w-4 h-4" />,
          onClick: addButton.onClick
        } : undefined}
      >
        {headerActions}
        {showBulkToggle && (
          <Button
            variant={bulkMode ? "default" : "outline"}
            size="sm"
            onClick={onToggleBulkMode}
            className="gap-2"
          >
            <Users className="w-4 h-4" />
            {bulkMode ? t('cancel') : t('bulkActions')}
          </Button>
        )}
        {showLayoutSelector && (
          <LayoutSelector
            viewMode={currentLayout as 'cards' | 'list' | 'grid'}
            onViewModeChange={handleLayoutChange}
          />
        )}
      </PageHeader>
      
      {/* Search, Filters, and Bulk Actions - All on same level */}
      {(showSearch || showFilters || (showBulkActions && bulkMode)) && (
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Search and Filters */}
          {(showSearch || showFilters) && (
            <div className="flex-1">
              <CompactSearchAndFilters
                searchTerm={searchTerm}
                onSearchChange={onSearchChange}
                filters={filters}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={onClearFilters}
                rightContent={rightContent}
              />
            </div>
          )}
          
          {/* Bulk Actions - Only when bulk mode is active */}
          {showBulkActions && bulkMode && (
            <div className="lg:min-w-[200px]">
              <BulkActions
                selectedItems={selectedItems}
                onSelectAll={onSelectAll || (() => {})}
                onSelectItem={onSelectItem || (() => {})}
                totalItems={totalItems}
                actions={bulkActions}
              />
            </div>
          )}
        </div>
      )}
      
      {/* Content Area - Pass bulk mode to children */}
      <div className="space-y-4" data-bulk-mode={bulkMode}>
        {renderContent()}
      </div>
    </div>
  );
}