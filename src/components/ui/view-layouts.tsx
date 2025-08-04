import { ReactNode } from "react";
import { getViewModeConfig, createGridClassName } from "@/config/challengesPageConfig";

interface ViewLayoutsProps {
  viewMode: 'cards' | 'list' | 'grid' | 'calendar' | 'table';
  children: ReactNode[];
  listRenderer?: (items: ReactNode[]) => ReactNode;
  tableRenderer?: (items: ReactNode[]) => ReactNode;
}

export function ViewLayouts({ viewMode, children, listRenderer, tableRenderer }: ViewLayoutsProps) {
  // Handle list layout with custom renderer
  if (viewMode === 'list') {
    if (listRenderer) {
      return <>{listRenderer(children)}</>;
    }
    
    return (
      <div className={createGridClassName('list')}>
        {children}
      </div>
    );
  }

  // Handle table layout with custom renderer  
  if (viewMode === 'table') {
    if (tableRenderer) {
      return <>{tableRenderer(children)}</>;
    }
    
    // Default table layout - single column with spacing
    return (
      <div className="space-y-2">
        {children}
      </div>
    );
  }

  // Handle cards and grid using configuration
  if (viewMode === 'cards' || viewMode === 'grid') {
    return (
      <div className={createGridClassName(viewMode)}>
        {children}
      </div>
    );
  }

  // Calendar mode (not yet fully configured)
  if (viewMode === 'calendar') {
    return (
      <div className="space-y-4">
        {children}
      </div>
    );
  }

  // Default fallback using configuration
  return (
    <div className={createGridClassName('cards')}>
      {children}
    </div>
  );
}