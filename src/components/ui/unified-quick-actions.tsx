import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface UnifiedQuickAction {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  variant?: 'default' | 'secondary' | 'outline';
  colorScheme?: 'primary' | 'success' | 'warning' | 'info' | 'innovation' | 'technology' | 'sustainability' | 'social';
}

interface UnifiedQuickActionsProps {
  title: string;
  actions: UnifiedQuickAction[];
  className?: string;
  layout?: 'grid' | 'list';
  columns?: 1 | 2 | 3;
}

const colorSchemeMap = {
  primary: {
    iconBg: 'bg-gradient-to-br from-primary/10 to-primary/20',
    iconHover: 'group-hover:from-primary/20 group-hover:to-primary/30',
    text: 'group-hover:text-primary'
  },
  success: {
    iconBg: 'bg-gradient-to-br from-success/10 to-success/20',
    iconHover: 'group-hover:from-success/20 group-hover:to-success/30',
    text: 'group-hover:text-success'
  },
  warning: {
    iconBg: 'bg-gradient-to-br from-warning/10 to-warning/20',
    iconHover: 'group-hover:from-warning/20 group-hover:to-warning/30',
    text: 'group-hover:text-warning'
  },
  info: {
    iconBg: 'bg-gradient-to-br from-info/10 to-info/20',
    iconHover: 'group-hover:from-info/20 group-hover:to-info/30',
    text: 'group-hover:text-info'
  },
  innovation: {
    iconBg: 'bg-gradient-to-br from-innovation/10 to-innovation/20',
    iconHover: 'group-hover:from-innovation/20 group-hover:to-innovation/30',
    text: 'group-hover:text-innovation'
  },
  technology: {
    iconBg: 'bg-gradient-to-br from-technology/10 to-technology/20',
    iconHover: 'group-hover:from-technology/20 group-hover:to-technology/30',
    text: 'group-hover:text-technology'
  },
  sustainability: {
    iconBg: 'bg-gradient-to-br from-sustainability/10 to-sustainability/20',
    iconHover: 'group-hover:from-sustainability/20 group-hover:to-sustainability/30',
    text: 'group-hover:text-sustainability'
  },
  social: {
    iconBg: 'bg-gradient-to-br from-social/10 to-social/20',
    iconHover: 'group-hover:from-social/20 group-hover:to-social/30',
    text: 'group-hover:text-social'
  }
};

export function UnifiedQuickActions({ 
  title, 
  actions, 
  className,
  layout = 'list',
  columns = 1
}: UnifiedQuickActionsProps) {
  const gridClasses = layout === 'grid' ? {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }[columns] : '';

  return (
    <Card className={cn("gradient-border animate-fade-in-up", className)}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-primary rounded-full animate-pulse"></div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={cn(
        layout === 'grid' ? `grid gap-4 ${gridClasses}` : 'space-y-4'
      )}>
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          const colorScheme = colorSchemeMap[action.colorScheme || 'primary'];
          
          return (
            <div
              key={action.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border gradient-border hover-scale group transition-all duration-300",
                "hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10",
                "animate-slide-up",
                action.disabled && "opacity-50 cursor-not-allowed"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={cn(
                  "p-3 rounded-xl text-current transition-all duration-300 group-hover:scale-110",
                  colorScheme.iconBg,
                  colorScheme.iconHover
                )}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={cn(
                      "font-semibold text-sm transition-colors duration-300",
                      colorScheme.text
                    )}>
                      {action.title}
                    </p>
                    {action.badge && (
                      <Badge 
                        variant={action.badge.variant || 'default'} 
                        className="text-xs gradient-border animate-scale-in"
                      >
                        {action.badge.text}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </div>
              <Button
                variant={action.variant || 'outline'}
                size="sm"
                onClick={action.onClick}
                disabled={action.disabled}
                className="hover-scale gradient-border ml-3 transition-all duration-300"
              >
                {action.title}
              </Button>
            </div>
          );
        })}
        
        {actions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground animate-fade-in">
            <p className="text-sm">No quick actions available for your role.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Simplified version for compact layouts
export function CompactQuickActions({ 
  actions, 
  className 
}: { 
  actions: UnifiedQuickAction[]; 
  className?: string; 
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {actions.map((action, index) => {
        const IconComponent = action.icon;
        const colorScheme = colorSchemeMap[action.colorScheme || 'primary'];
        
        return (
          <Button
            key={action.id}
            variant="ghost"
            onClick={action.onClick}
            disabled={action.disabled}
            className={cn(
              "w-full justify-start hover-scale transition-all duration-300 animate-slide-up",
              "hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/20"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={cn(
              "p-2 rounded-md mr-3 transition-all duration-300",
              colorScheme.iconBg,
              colorScheme.iconHover
            )}>
              <IconComponent className="h-4 w-4" />
            </div>
            <span className={cn("transition-colors duration-300", colorScheme.text)}>
              {action.title}
            </span>
            {action.badge && (
              <Badge 
                variant={action.badge.variant || 'default'} 
                className="ml-auto text-xs"
              >
                {action.badge.text}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
}