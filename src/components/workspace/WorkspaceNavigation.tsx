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
      "flex gap-2",
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
              "justify-start gap-2",
              orientation === 'vertical' ? 'w-full' : 'min-w-fit'
            )}
          >
            <IconComponent className="h-4 w-4" />
            <span>{item.label}</span>
            {item.count !== undefined && item.count > 0 && (
              <Badge variant="secondary" className="ml-auto text-xs">
                {item.count}
              </Badge>
            )}
          </Button>
        );
      })}
    </nav>
  );
}