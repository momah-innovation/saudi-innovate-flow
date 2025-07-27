import { ReactNode, useState } from "react";
import { Plus, Filter } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { LayoutSelector } from "@/components/ui/layout-selector";
import { ViewLayouts } from "@/components/ui/view-layouts";
import { SearchAndFilters } from "@/components/ui/search-and-filters";
import { CompactSearchAndFilters } from "@/components/ui/compact-search-filters";
import { BulkActions } from "@/components/ui/bulk-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ViewMode = 'cards' | 'list' | 'grid' | 'calendar' | 'gantt' | 'timeline';
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
  
  const hasSelectedItems = selectedItems.length > 0;
  const showLayoutSelector = supportedLayouts.length > 1;
  const showSearch = onSearchChange !== undefined;
  const showFilters = filters.length > 0 || quickFilters !== undefined;
  const showBulkActions = bulkActions.length > 0 && totalItems > 0;
  
  const handleLayoutChange = (layout: ViewMode) => {
    setCurrentLayout(layout);
    onLayoutChange?.(layout);
  };
  
  const renderContent = () => {
    if (loading) {
      return <div className="flex items-center justify-center p-8">Loading...</div>;
    }
    
    if (!Array.isArray(children) && !children) {
      return emptyState || (
        <div className="text-center p-8 text-muted-foreground">
          No items found
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
        {showLayoutSelector && (
          <LayoutSelector
            viewMode={currentLayout as 'cards' | 'list' | 'grid'}
            onViewModeChange={handleLayoutChange}
          />
        )}
      </PageHeader>
      
      {/* Search and Filters - Compact Layout */}
      {(showSearch || showFilters) && (
        <CompactSearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          filters={filters}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={onClearFilters}
          rightContent={rightContent}
        />
      )}
      
      {/* Bulk Actions - Only show when items are selected */}
      {showBulkActions && hasSelectedItems && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-2">
          <BulkActions
            selectedItems={selectedItems}
            onSelectAll={onSelectAll || (() => {})}
            onSelectItem={onSelectItem || (() => {})}
            totalItems={totalItems}
            actions={bulkActions}
          />
        </div>
      )}
      
      {/* Content Area */}
      <div className="space-y-4">
        {renderContent()}
      </div>
    </div>
  );
}