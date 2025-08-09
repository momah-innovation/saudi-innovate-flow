import React from 'react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface WorkspaceLayoutProps {
  title: string;
  description: string;
  userRole: string;
  children: React.ReactNode;
  stats?: Array<{
    label: string;
    value: number | string;
    icon?: React.ComponentType<{ className?: string }>;
    trend?: 'up' | 'down' | 'neutral';
    color?: string;
  }>;
  quickActions?: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
    variant?: 'default' | 'secondary' | 'outline';
  }>;
  className?: string;
}

export function WorkspaceLayout({
  title,
  description,
  userRole,
  children,
  stats = [],
  quickActions = [],
  className
}: WorkspaceLayoutProps) {
  const { t, getDynamicText } = useUnifiedTranslation();

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                <Badge variant="outline" className="capitalize">
                  {getDynamicText(userRole, userRole)}
                </Badge>
              </div>
              <p className="text-muted-foreground max-w-2xl">{description}</p>
            </div>
            
            {quickActions.length > 0 && (
              <div className="flex gap-2">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <Button
                      key={index}
                      variant={action.variant || 'default'}
                      onClick={action.onClick}
                      className="flex items-center gap-2"
                    >
                      {IconComponent && <IconComponent className="h-4 w-4" />}
                      {action.label}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      {stats.length > 0 && (
        <div className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between space-y-0">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none text-muted-foreground">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      {IconComponent && (
                        <div className={cn(
                          "p-2 rounded-lg",
                          stat.color || "bg-primary/10 text-primary"
                        )}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <Separator />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}