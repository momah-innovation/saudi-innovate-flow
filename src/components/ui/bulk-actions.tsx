import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Users } from "lucide-react";
import { useTranslation } from "@/hooks/useAppTranslation";

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
  const { t } = useTranslation();
  
  const isAllSelected = selectedItems.length === totalItems && totalItems > 0;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < totalItems;

  if (totalItems === 0) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={className}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="flex items-center gap-2">
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
            <ChevronRight className="w-4 h-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-4 pt-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={isAllSelected}
            onCheckedChange={(checked) => onSelectAll(checked as boolean)}
            className={isIndeterminate ? "data-[state=checked]:bg-primary" : ""}
          />
          <label htmlFor="select-all" className="text-sm font-medium">
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
                className="gap-2"
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