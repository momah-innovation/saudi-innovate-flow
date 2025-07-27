import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Grid } from "lucide-react";

type ViewMode = 'cards' | 'list' | 'grid';

interface LayoutSelectorProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
}

export function LayoutSelector({ viewMode, onViewModeChange, className }: LayoutSelectorProps) {
  return (
    <div className={`flex items-center gap-1 p-1 bg-muted rounded-lg ${className}`}>
      <Button
        variant={viewMode === 'cards' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('cards')}
        className="gap-2"
      >
        <LayoutGrid className="w-4 h-4" />
        Cards
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('list')}
        className="gap-2"
      >
        <List className="w-4 h-4" />
        List
      </Button>
      <Button
        variant={viewMode === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('grid')}
        className="gap-2"
      >
        <Grid className="w-4 h-4" />
        Grid
      </Button>
    </div>
  );
}