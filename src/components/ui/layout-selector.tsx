import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Grid } from "lucide-react";
import { useTranslation } from "@/hooks/useAppTranslation";

type ViewMode = 'cards' | 'list' | 'grid' | 'calendar';

interface LayoutSelectorProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
}

export function LayoutSelector({ viewMode, onViewModeChange, className }: LayoutSelectorProps) {
  const { t } = useTranslation();
  
  return (
    <div className={`flex items-center gap-1 p-1.5 bg-gradient-to-r from-accent/20 to-accent/10 backdrop-blur-sm border border-border rounded-xl shadow-sm ${className}`}>
      <Button
        variant={viewMode === 'cards' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('cards')}
        className={`gap-2 transition-all duration-300 hover:scale-105 ${
          viewMode === 'cards' 
            ? 'bg-primary text-primary-foreground shadow-md border-0'
            : 'hover:bg-accent hover:text-accent-foreground'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        {t('cards')}
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('list')}
        className={`gap-2 transition-all duration-300 hover:scale-105 ${
          viewMode === 'list' 
            ? 'bg-primary text-primary-foreground shadow-md border-0'
            : 'hover:bg-accent hover:text-accent-foreground'
        }`}
      >
        <List className="w-4 h-4" />
        {t('list')}
      </Button>
      <Button
        variant={viewMode === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('grid')}
        className={`gap-2 transition-all duration-300 hover:scale-105 ${
          viewMode === 'grid' 
            ? 'bg-primary text-primary-foreground shadow-md border-0' 
            : 'hover:bg-accent hover:text-accent-foreground'
        }`}
      >
        <Grid className="w-4 h-4" />
        {t('grid')}
      </Button>
    </div>
  );
}