import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Grid, Table, Calendar } from "lucide-react";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";

export type ViewMode = 'cards' | 'list' | 'grid' | 'table' | 'calendar';

interface LayoutSelectorProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  supportedLayouts?: ViewMode[];
  className?: string;
}

export function LayoutSelector({ 
  viewMode, 
  onViewModeChange, 
  supportedLayouts = ['cards', 'list', 'grid'],
  className 
}: LayoutSelectorProps) {
  const { t } = useUnifiedTranslation();
  
  const allLayouts = [
    { value: 'cards' as const, icon: LayoutGrid, labelKey: 'cards' },
    { value: 'list' as const, icon: List, labelKey: 'list' },
    { value: 'grid' as const, icon: Grid, labelKey: 'grid' },
    { value: 'table' as const, icon: Table, labelKey: 'table' },
    { value: 'calendar' as const, icon: Calendar, labelKey: 'calendar' }
  ];

  const enabledLayouts = allLayouts.filter(layout => 
    supportedLayouts.includes(layout.value)
  );
  
  if (enabledLayouts.length <= 1) {
    return null; // Don't show selector if only one layout option
  }
  
  return (
    <div className={`flex items-center gap-1 p-1.5 bg-accent/20 backdrop-blur-sm border border-border rounded-xl shadow-sm ${className}`}>
      {enabledLayouts.map(({ value, icon: Icon, labelKey }) => (
        <Button
          key={value}
          variant={viewMode === value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange(value)}
          className={`gap-2 transition-all duration-300 hover:scale-105 ${
            viewMode === value 
              ? 'bg-primary text-primary-foreground shadow-md border-0'
              : 'hover:bg-accent hover:text-accent-foreground'
          }`}
          title={t(labelKey)}
        >
          <Icon className="w-4 h-4" />
          {t(labelKey)}
        </Button>
      ))}
    </div>
  );
}

// Legacy alias for backward compatibility
export const LayoutToggle = LayoutSelector;
export type LayoutType = ViewMode;