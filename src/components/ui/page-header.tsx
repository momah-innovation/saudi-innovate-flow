import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useAppTranslation";

interface PageHeaderProps {
  title: string;
  description?: string;
  itemCount?: number;
  actionButton?: {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
  };
  children?: ReactNode;
}

export function PageHeader({ 
  title, 
  description, 
  itemCount, 
  actionButton, 
  children 
}: PageHeaderProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {(description || itemCount !== undefined) && (
          <p className="text-muted-foreground mt-1">
            {description}
            {itemCount !== undefined && ` (${itemCount} ${itemCount === 1 ? t('item') : t('items')})`}
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {children}
        {actionButton && (
          <Button onClick={actionButton.onClick} className="gap-2">
            {actionButton.icon}
            {actionButton.label}
          </Button>
        )}
      </div>
    </div>
  );
}