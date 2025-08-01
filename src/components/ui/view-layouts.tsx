import { ReactNode } from "react";

interface ViewLayoutsProps {
  viewMode: 'cards' | 'list' | 'grid' | 'calendar' | 'table';
  children: ReactNode[];
  listRenderer?: (items: ReactNode[]) => ReactNode;
}

export function ViewLayouts({ viewMode, children, listRenderer }: ViewLayoutsProps) {
  if (viewMode === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {children}
      </div>
    );
  }

  if (viewMode === 'list') {
    if (listRenderer) {
      return <>{listRenderer(children)}</>;
    }
    
    return (
      <div className="space-y-3">
        {children}
      </div>
    );
  }

  return <div className="grid grid-cols-1 gap-6">{children}</div>;
}