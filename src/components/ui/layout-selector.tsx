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
    <div className={`flex items-center gap-1 p-1.5 bg-gradient-to-r from-violet-100/80 to-purple-100/80 backdrop-blur-sm border border-violet-200/50 rounded-xl shadow-md ${className}`}>
      <Button
        variant={viewMode === 'cards' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('cards')}
        className={`gap-2 transition-all duration-300 hover:scale-105 ${
          viewMode === 'cards' 
            ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md border-0' 
            : 'hover:bg-violet-100 text-violet-700'
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
            ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md border-0' 
            : 'hover:bg-violet-100 text-violet-700'
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
            ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md border-0' 
            : 'hover:bg-violet-100 text-violet-700'
        }`}
      >
        <Grid className="w-4 h-4" />
        {t('grid')}
      </Button>
    </div>
  );
}