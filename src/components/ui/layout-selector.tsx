import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Grid3X3, LayoutGrid, List, Table } from 'lucide-react';

export type ViewMode = 'cards' | 'grid' | 'list' | 'table';

interface LayoutSelectorProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
}

const viewModeOptions = [
  { key: 'cards' as ViewMode, icon: LayoutGrid, label: 'Cards' },
  { key: 'grid' as ViewMode, icon: Grid3X3, label: 'Grid' },
  { key: 'list' as ViewMode, icon: List, label: 'List' },
  { key: 'table' as ViewMode, icon: Table, label: 'Table' },
];

export const LayoutSelector = ({ viewMode, onViewModeChange, className }: LayoutSelectorProps) => {
  return (
    <div className={cn("flex gap-1 p-1 bg-muted rounded-lg", className)}>
      {viewModeOptions.map((option) => {
        const Icon = option.icon;
        return (
          <Button
            key={option.key}
            variant={viewMode === option.key ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange(option.key)}
            className="px-3"
            title={option.label}
          >
            <Icon className="w-4 h-4" />
          </Button>
        );
      })}
    </div>
  );
};