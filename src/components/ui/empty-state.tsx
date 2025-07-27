import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  isFiltered?: boolean;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  isFiltered = false 
}: EmptyStateProps) {
  const defaultIcon = isFiltered ? (
    <Search className="w-6 h-6 text-muted-foreground" />
  ) : (
    <Plus className="w-6 h-6 text-muted-foreground" />
  );

  return (
    <div className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed">
      <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
        {icon || defaultIcon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="gap-2">
          <Plus className="w-4 h-4" />
          {action.label}
        </Button>
      )}
    </div>
  );
}