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
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <div
              key={action.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border",
                "hover:bg-muted/50 transition-colors",
                action.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{action.title}</p>
                    {action.badge && (
                      <Badge variant={action.badge.variant || 'default'} className="text-xs">
                        {action.badge.text}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </div>
              <Button
                variant={action.variant || 'outline'}
                size="sm"
                onClick={action.onClick}
                disabled={action.disabled}
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