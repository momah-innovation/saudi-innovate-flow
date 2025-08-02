import { ReactNode } from "react";
import { getViewModeConfig, createGridClassName } from "@/config/challengesPageConfig";

interface ViewLayoutsProps {
  viewMode: 'cards' | 'list' | 'grid' | 'calendar' | 'table';
  children: ReactNode[];
  listRenderer?: (items: ReactNode[]) => ReactNode;
}

export function ViewLayouts({ viewMode, children, listRenderer }: ViewLayoutsProps) {
  // Use configuration-based layouts
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

  // Handle cards and grid using configuration
  if (viewMode === 'cards' || viewMode === 'grid') {
    return (
      <div className={createGridClassName(viewMode)}>
        {children}
      </div>
    );
  }

  // Calendar and table modes (not yet configured)
  if (viewMode === 'calendar' || viewMode === 'table') {
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