import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  active?: boolean;
  onClick: () => void;
}

interface WorkspaceNavigationProps {
  items: NavigationItem[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function WorkspaceNavigation({ 
  items, 
  orientation = 'horizontal',
  className 
}: WorkspaceNavigationProps) {
  return (
    <nav className={cn(
      "flex gap-3 p-2 bg-gradient-to-r from-muted/20 via-muted/30 to-muted/20 rounded-xl border gradient-border",
      orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
      className
    )}>
      {items.map((item) => {
        const IconComponent = item.icon;
        return (
          <Button
            key={item.id}
            variant={item.active ? 'default' : 'ghost'}
            onClick={item.onClick}
            className={cn(
              "justify-start gap-3 hover-scale transition-all duration-300 relative group",
              orientation === 'vertical' ? 'w-full' : 'min-w-fit',
              item.active && "bg-gradient-primary text-primary-foreground shadow-elegant"
            )}
          >
            <div className={cn(
              "p-1 rounded-lg transition-all duration-300",
              item.active ? "bg-background/20" : "bg-primary/10 text-primary group-hover:bg-primary/20"
            )}>
              <IconComponent className="h-4 w-4" />
            </div>
            <span className="font-medium">{item.label}</span>
            {item.count !== undefined && item.count > 0 && (
              <Badge 
                variant={item.active ? "secondary" : "outline"} 
                className={cn(
                  "ml-auto text-xs gradient-border",
                  item.active && "bg-background/20 text-primary-foreground"
                )}
              >
                {item.count}
              </Badge>
            )}
            {item.active && (
              <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-lg pointer-events-none" />
            )}
          </Button>
        );
      })}
    </nav>
  );
}