import { ReactNode } from "react";
import { getViewModeConfig, createGridClassName } from "@/config/challengesPageConfig";
import { ViewMode } from "@/components/ui/layout-selector";

interface ViewLayoutsProps {
  viewMode: ViewMode;
  children: ReactNode[];
  listRenderer?: (items: ReactNode[]) => ReactNode;
  tableRenderer?: (items: ReactNode[]) => ReactNode;
  mapRenderer?: (items: ReactNode[]) => ReactNode;
  columnsRenderer?: (items: ReactNode[]) => ReactNode;
  kanbanRenderer?: (items: ReactNode[]) => ReactNode;
}

export function ViewLayouts({ 
  viewMode, 
  children, 
  listRenderer, 
  tableRenderer, 
  mapRenderer, 
  columnsRenderer, 
  kanbanRenderer 
}: ViewLayoutsProps) {
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

  // Handle map layout
  if (viewMode === 'map') {
    if (mapRenderer) {
      return <>{mapRenderer(children)}</>;
    }
    
    // Default map layout - single column for fallback
    return (
      <div className="space-y-4">
        {children}
      </div>
    );
  }

  // Handle columns layout
  if (viewMode === 'columns') {
    if (columnsRenderer) {
      return <>{columnsRenderer(children)}</>;
    }
    
    // Default columns layout - 3 column grid
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    );
  }

  // Handle kanban layout
  if (viewMode === 'kanban') {
    if (kanbanRenderer) {
      return <>{kanbanRenderer(children)}</>;
    }
    
    // Default kanban layout - horizontal scrollable columns
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        <div className="flex flex-col gap-4 min-w-[300px]">
          {children}
        </div>
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

  // Calendar mode
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