import React, { useState, useRef, useEffect } from 'react';
import { GripVertical, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ResizablePanelProps {
  children: React.ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

export function ResizablePanel({
  children,
  defaultSize = 50,
  minSize = 20,
  maxSize = 80,
  direction = 'horizontal',
  className
}: ResizablePanelProps) {
  const [size, setSize] = useState(defaultSize);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !panelRef.current) return;

      const rect = panelRef.current.parentElement?.getBoundingClientRect();
      if (!rect) return;

      let newSize;
      if (direction === 'horizontal') {
        newSize = ((e.clientX - rect.left) / rect.width) * 100;
      } else {
        newSize = ((e.clientY - rect.top) / rect.height) * 100;
      }

      newSize = Math.max(minSize, Math.min(maxSize, newSize));
      setSize(newSize);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, direction, minSize, maxSize]);

  return (
    <div
      ref={panelRef}
      className={cn("relative border rounded-lg overflow-hidden", className)}
      style={{
        [direction === 'horizontal' ? 'width' : 'height']: `${size}%`
      }}
    >
      {children}
      
      {/* Resize handle */}
      <div
        className={cn(
          "absolute bg-border cursor-col-resize hover:bg-primary/20 transition-colors group",
          direction === 'horizontal' 
            ? "right-0 top-0 bottom-0 w-1 cursor-col-resize" 
            : "bottom-0 left-0 right-0 h-1 cursor-row-resize"
        )}
        onMouseDown={handleMouseDown}
      >
        <div className={cn(
          "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
          direction === 'horizontal' ? "w-4 -translate-x-1" : "h-4 -translate-y-1"
        )}>
          <GripVertical className={cn(
            "w-3 h-3 text-muted-foreground",
            direction === 'vertical' && "rotate-90"
          )} />
        </div>
      </div>
    </div>
  );
}

interface SplitViewProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultSplit?: number;
  minSplit?: number;
  maxSplit?: number;
  direction?: 'horizontal' | 'vertical';
  allowCollapse?: boolean;
  className?: string;
}

export function SplitView({
  leftPanel,
  rightPanel,
  defaultSplit = 50,
  minSplit = 20,
  maxSplit = 80,
  direction = 'horizontal',
  allowCollapse = true,
  className
}: SplitViewProps) {
  const [split, setSplit] = useState(defaultSplit);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      let newSplit;
      
      if (direction === 'horizontal') {
        newSplit = ((e.clientX - rect.left) / rect.width) * 100;
      } else {
        newSplit = ((e.clientY - rect.top) / rect.height) * 100;
      }

      newSplit = Math.max(minSplit, Math.min(maxSplit, newSplit));
      setSplit(newSplit);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, direction, minSplit, maxSplit]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full w-full",
        direction === 'horizontal' ? "flex" : "flex flex-col",
        className
      )}
    >
      {/* Left/Top Panel */}
      <div
        className={cn(
          "relative overflow-hidden border rounded-lg",
          isCollapsed && "hidden"
        )}
        style={{
          [direction === 'horizontal' ? 'width' : 'height']: `${split}%`
        }}
      >
        {leftPanel}
      </div>

      {/* Splitter */}
      {!isCollapsed && (
        <div
          className={cn(
            "bg-border hover:bg-primary/20 transition-colors cursor-col-resize group relative flex items-center justify-center",
            direction === 'horizontal' 
              ? "w-1 cursor-col-resize" 
              : "h-1 cursor-row-resize"
          )}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className={cn(
              "w-3 h-3 text-muted-foreground",
              direction === 'vertical' && "rotate-90"
            )} />
          </div>
        </div>
      )}

      {/* Right/Bottom Panel */}
      <div
        className={cn(
          "relative overflow-hidden border rounded-lg flex-1",
          isCollapsed && "w-full h-full"
        )}
      >
        {rightPanel}
        
        {/* Collapse toggle */}
        {allowCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className="absolute top-2 left-2 h-6 w-6 p-0"
          >
            {isCollapsed ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          </Button>
        )}
      </div>
    </div>
  );
}

interface MasonryLayoutProps {
  children: React.ReactNode[];
  columns?: number;
  gap?: number;
  className?: string;
}

export function MasonryLayout({ 
  children, 
  columns = 3, 
  gap = 16, 
  className 
}: MasonryLayoutProps) {
  const [columnHeights, setColumnHeights] = useState<number[]>(new Array(columns).fill(0));
  const containerRef = useRef<HTMLDivElement>(null);

  const getShortestColumn = () => {
    return columnHeights.indexOf(Math.min(...columnHeights));
  };

  useEffect(() => {
    if (containerRef.current) {
      const observer = new ResizeObserver(() => {
        // Reset heights when container resizes
        setColumnHeights(new Array(columns).fill(0));
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [columns]);

  const childrenInColumns = children.reduce((acc, child, index) => {
    const columnIndex = getShortestColumn();
    if (!acc[columnIndex]) acc[columnIndex] = [];
    acc[columnIndex].push(child);
    
    // Simulate height for calculation (in real implementation, would measure actual heights)
    const estimatedHeight = 200 + Math.random() * 100;
    columnHeights[columnIndex] += estimatedHeight + gap;
    
    return acc;
  }, {} as Record<number, React.ReactNode[]>);

  return (
    <div
      ref={containerRef}
      className={cn("flex gap-4", className)}
      style={{ gap }}
    >
      {Array.from({ length: columns }, (_, columnIndex) => (
        <div key={columnIndex} className="flex-1 space-y-4">
          {childrenInColumns[columnIndex]?.map((child, childIndex) => (
            <div key={childIndex}>{child}</div>
          ))}
        </div>
      ))}
    </div>
  );
}