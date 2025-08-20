import React from 'react';
import { useNavigate } from 'react-router-dom';
import { navigationHandler } from '@/utils/unified-navigation';
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
  const navigate = useNavigate();
  
  // Initialize navigation handler
  React.useEffect(() => {
    navigationHandler.setNavigate(navigate);
  }, [navigate]);

  return (
    <div className={cn("min-h-screen bg-gradient-subtle", className)}>
      {/* Enhanced Header with Gradient */}
      <div className="border-b bg-gradient-to-r from-background via-background/95 to-background backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-primary bg-clip-text text-transparent">
                  {title}
                </h1>
                <Badge variant="outline" className="capitalize gradient-border hover-scale">
                  {getDynamicText(userRole, userRole)}
                </Badge>
              </div>
              <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">{description}</p>
            </div>
            
            {quickActions.length > 0 && (
              <div className="flex gap-3">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <Button
                      key={index}
                      variant={action.variant || 'default'}
                      onClick={action.onClick}
                      className="flex items-center gap-2 hover-scale gradient-border"
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

      {/* Enhanced Stats Dashboard */}
      {stats.length > 0 && (
        <div className="border-b bg-gradient-to-r from-muted/20 via-muted/30 to-muted/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index} className="gradient-border hover-scale group">
                    <div className="p-6">
                      <div className="flex items-center justify-between space-y-0">
                        <div className="space-y-2">
                          <p className="text-sm font-medium leading-none text-muted-foreground group-hover:text-primary transition-colors">
                            {stat.label}
                          </p>
                          <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                            {stat.value}
                          </p>
                        </div>
                        {IconComponent && (
                          <div className={cn(
                            "p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
                            stat.color || "bg-gradient-to-br from-primary/10 to-primary/20 text-primary group-hover:from-primary/20 group-hover:to-primary/30"
                          )}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Enhanced Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="min-h-[60vh]">
          {children}
        </div>
      </div>
    </div>
  );
}