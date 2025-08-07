import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Dot } from "lucide-react";

interface ListItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: ReactNode;
  badge?: {
    content: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  action?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

interface ListProps {
  items: ListItem[];
  variant?: 'default' | 'navigation' | 'selection' | 'menu';
  size?: 'sm' | 'md' | 'lg';
  divided?: boolean;
  className?: string;
  emptyMessage?: string;
}

export function List({ 
  items, 
  variant = 'default', 
  size = 'md', 
  divided = false,
  className,
  emptyMessage
}: ListProps) {
  const { t } = useUnifiedTranslation();
  const sizeClasses = {
    sm: 'py-1 px-2 text-sm',
    md: 'py-2 px-3',
    lg: 'py-3 px-4 text-lg',
  };

  if (items.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        {emptyMessage || t('emptyList')}
      </div>
    );
  }

  return (
    <div className={cn("space-y-0", className)}>
      {items.map((item, index) => (
        <div key={item.id}>
          <ListItemComponent
            item={item}
            variant={variant}
            size={size}
            className={cn(
              sizeClasses[size],
              item.onClick && !item.disabled && "cursor-pointer hover:bg-accent/50 transition-colors",
              item.disabled && "opacity-50 cursor-not-allowed"
            )}
          />
          {divided && index < items.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
}

function ListItemComponent({ 
  item, 
  variant, 
  size, 
  className 
}: { 
  item: ListItem; 
  variant: string; 
  size: string; 
  className: string;
}) {
  const content = (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {item.icon && (
          <div className="flex-shrink-0">
            {item.icon}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn(
              "font-medium truncate",
              size === 'sm' && "text-sm",
              size === 'lg' && "text-lg"
            )}>
              {item.title}
            </span>
            {item.badge && (
              <Badge variant={item.badge.variant} className="flex-shrink-0">
                {item.badge.content}
              </Badge>
            )}
          </div>
          
          {item.subtitle && (
            <div className={cn(
              "text-muted-foreground truncate",
              size === 'sm' && "text-xs",
              size === 'md' && "text-sm",
              size === 'lg' && "text-base"
            )}>
              {item.subtitle}
            </div>
          )}
          
          {item.description && (
            <div className={cn(
              "text-muted-foreground line-clamp-2",
              size === 'sm' && "text-xs",
              size === 'md' && "text-sm",
              size === 'lg' && "text-base"
            )}>
              {item.description}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 flex-shrink-0">
        {item.action}
        {variant === 'navigation' && !item.action && (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
    </div>
  );

  if (item.onClick && !item.disabled) {
    return (
      <button
        type="button"
        onClick={item.onClick}
        className={cn("w-full text-left", className)}
        disabled={item.disabled}
      >
        {content}
      </button>
    );
  }

  return <div className={className}>{content}</div>;
}

// Grouped List Component
interface GroupedListProps {
  groups: Array<{
    title: string;
    items: ListItem[];
  }>;
  variant?: ListProps['variant'];
  size?: ListProps['size'];
  className?: string;
}

export function GroupedList({ groups, variant, size, className }: GroupedListProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {groups.map((group, index) => (
        <div key={index}>
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
            {group.title}
          </h3>
          <List 
            items={group.items} 
            variant={variant} 
            size={size}
            divided
          />
        </div>
      ))}
    </div>
  );
}

// Ordered/Unordered List Components
interface SimpleListProps {
  items: (string | ReactNode)[];
  ordered?: boolean;
  className?: string;
}

export function SimpleList({ items, ordered = false, className }: SimpleListProps) {
  const ListTag = ordered ? 'ol' : 'ul';
  
  return (
    <ListTag className={cn(
      "space-y-1",
      ordered ? "list-decimal list-inside" : "list-none",
      className
    )}>
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          {!ordered && <Dot className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />}
          <span className="flex-1">{item}</span>
        </li>
      ))}
    </ListTag>
  );
}

// Definition List Component
interface DefinitionListProps {
  items: Array<{
    term: string;
    definition: ReactNode;
  }>;
  horizontal?: boolean;
  className?: string;
}

export function DefinitionList({ items, horizontal = false, className }: DefinitionListProps) {
  return (
    <dl className={cn(
      horizontal ? "grid grid-cols-3 gap-4" : "space-y-3",
      className
    )}>
      {items.map((item, index) => (
        <div key={index} className={horizontal ? "contents" : "space-y-1"}>
          <dt className="font-medium text-sm">
            {item.term}
          </dt>
          <dd className={cn(
            "text-muted-foreground",
            horizontal ? "col-span-2" : "text-sm"
          )}>
            {item.definition}
          </dd>
        </div>
      ))}
    </dl>
  );
}