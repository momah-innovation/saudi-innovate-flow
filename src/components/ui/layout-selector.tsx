import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Grid, Table, Calendar, Map, Columns3, Rows3 } from "lucide-react";
import { useDirection } from "@/components/ui/direction-provider";

export type ViewMode = 'cards' | 'list' | 'grid' | 'table' | 'calendar' | 'map' | 'columns' | 'kanban';

interface LayoutSelectorProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  supportedLayouts?: ViewMode[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export function LayoutSelector({ 
  viewMode, 
  onViewModeChange, 
  supportedLayouts = ['cards', 'list', 'grid'],
  className,
  size = 'md',
  showLabels = true
}: LayoutSelectorProps) {
  const { language } = useDirection();
  
  const allLayouts = [
    { value: 'cards' as const, icon: LayoutGrid, label: 'Cards', labelAr: 'بطاقات' },
    { value: 'list' as const, icon: List, label: 'List', labelAr: 'قائمة' },
    { value: 'grid' as const, icon: Grid, label: 'Grid', labelAr: 'شبكة' },
    { value: 'table' as const, icon: Table, label: 'Table', labelAr: 'جدول' },
    { value: 'calendar' as const, icon: Calendar, label: 'Calendar', labelAr: 'تقويم' },
    { value: 'map' as const, icon: Map, label: 'Map', labelAr: 'خريطة' },
    { value: 'columns' as const, icon: Columns3, label: 'Columns', labelAr: 'أعمدة' },
    { value: 'kanban' as const, icon: Rows3, label: 'Kanban', labelAr: 'كانبان' }
  ];

  const enabledLayouts = allLayouts.filter(layout => 
    supportedLayouts.includes(layout.value)
  );
  
  if (enabledLayouts.length <= 1) {
    return null;
  }

  const sizeClasses = {
    sm: 'text-xs gap-0.5 p-1',
    md: 'text-xs gap-1 p-1.5', 
    lg: 'text-sm gap-2 p-2'
  };

  const buttonSizeClasses = {
    sm: 'h-7 px-2 min-w-[2rem]',
    md: 'h-8 px-3 min-w-[2.5rem]',
    lg: 'h-9 px-4 min-w-[3rem]'
  };
  
  return (
    <div className={`inline-flex items-center bg-muted/50 rounded-lg border border-border/50 shadow-sm backdrop-blur-sm ${sizeClasses[size]} ${className}`}>
      {enabledLayouts.map(({ value, icon: Icon, label, labelAr }) => {
        const displayLabel = language === 'ar' ? labelAr : label;
        const isActive = viewMode === value;
        
        return (
          <Button
            key={value}
            variant="ghost"
            size="sm"
            onClick={() => onViewModeChange(value)}
            className={`
              ${buttonSizeClasses[size]}
              font-medium transition-all duration-200 border-0
              ${isActive 
                ? 'bg-background text-foreground shadow-sm ring-1 ring-border' 
                : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
              }
              ${showLabels ? 'gap-2' : 'gap-0'}
            `}
            title={displayLabel}
          >
            <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
            {showLabels && (
              <span className="hidden sm:inline">{displayLabel}</span>
            )}
          </Button>
        );
      })}
    </div>
  );
}

// Legacy alias for backward compatibility
export const LayoutToggle = LayoutSelector;
export type LayoutType = ViewMode;