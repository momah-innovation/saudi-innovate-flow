import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Users } from "lucide-react";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useDirection } from "@/components/ui/direction-provider";
import { cn } from "@/lib/utils";

interface BulkAction {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: (selectedIds: string[]) => void;
  variant?: "default" | "outline" | "destructive";
}

interface BulkActionsProps {
  selectedItems: string[];
  onSelectAll: (selected: boolean) => void;
  onSelectItem: (id: string, selected: boolean) => void;
  totalItems: number;
  actions: BulkAction[];
  className?: string;
}

export function BulkActions({
  selectedItems,
  onSelectAll,
  onSelectItem,
  totalItems,
  actions,
  className
}: BulkActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();
  
  const isAllSelected = selectedItems.length === totalItems && totalItems > 0;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < totalItems;

  if (totalItems === 0) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={className}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className={cn(
          "w-full justify-between touch-manipulation min-h-[44px]",
          isRTL ? "flex-row-reverse" : "flex-row"
        )}>
          <span className={cn(
            "flex items-center gap-2",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}>
            <Users className="w-4 h-4" />
            {t('bulkActions')}
            {selectedItems.length > 0 && (
              <span className="text-sm font-medium">
                {t('selectedCount', { count: selectedItems.length })}
              </span>
            )}
          </span>
          {isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className={cn(
              "w-4 h-4",
              isRTL && "transform scale-x-[-1]"
            )} />
          )}
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-4 pt-4">
        <div className={cn(
          "flex items-center gap-2",
          isRTL ? "flex-row-reverse space-x-reverse" : "flex-row space-x-2"
        )}>
          <Checkbox
            id="select-all"
            checked={isAllSelected}
            onCheckedChange={(checked) => onSelectAll(checked as boolean)}
            className={cn(
              "touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-[20px] sm:min-w-[20px]",
              isIndeterminate ? "data-[state=checked]:bg-primary" : ""
            )}
          />
          <label htmlFor="select-all" className={cn(
            "text-sm font-medium cursor-pointer",
            isRTL ? "text-right" : "text-left"
          )}>
            {t('selectAllItems', { count: totalItems })}
          </label>
        </div>

        {selectedItems.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {actions.map((action) => (
              <Button
                key={action.id}
                variant={action.variant || "outline"}
                size="sm"
                onClick={() => action.onClick(selectedItems)}
                className={cn(
                  "gap-2 touch-manipulation min-h-[44px]",
                  isRTL ? "flex-row-reverse" : "flex-row"
                )}
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}