import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  variant?: 'default' | 'secondary' | 'outline';
}

interface WorkspaceQuickActionsProps {
  title: string;
  actions: QuickAction[];
  className?: string;
}

export function WorkspaceQuickActions({ 
  title, 
  actions, 
  className 
}: WorkspaceQuickActionsProps) {
  return (
    <Card className={cn("gradient-border", className)}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <div
              key={action.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border gradient-border hover-scale group transition-all duration-300",
                "hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10",
                action.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 text-primary group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110">
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm group-hover:text-primary transition-colors">{action.title}</p>
                    {action.badge && (
                      <Badge variant={action.badge.variant || 'default'} className="text-xs gradient-border">
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
                className="hover-scale gradient-border ml-3"
              >
                {action.title}
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}