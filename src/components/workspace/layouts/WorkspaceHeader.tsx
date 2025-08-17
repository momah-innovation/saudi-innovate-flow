import React from 'react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  MoreHorizontal,
  Settings,
  Share2,
  Download,
  Star
} from 'lucide-react';
import type { WorkspaceType } from '@/types/workspace';

interface WorkspaceMetric {
  label: string;
  value: number | string;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
}

interface WorkspaceAction {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  disabled?: boolean;
}

interface WorkspaceHeaderProps {
  title: string;
  description?: string;
  userRole?: string;
  metrics?: WorkspaceMetric[];
  actions?: WorkspaceAction[];
  workspaceType: WorkspaceType;
  className?: string;
}

export function WorkspaceHeader({
  title,
  description,
  userRole,
  metrics = [],
  actions = [],
  workspaceType,
  className
}: WorkspaceHeaderProps) {
  const { t, getDynamicText, isRTL } = useUnifiedTranslation();

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <ArrowDown className="h-3 w-3 text-red-500" />;
      case 'stable':
        return <Minus className="h-3 w-3 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getTrendColor = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'stable':
        return 'text-yellow-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <header className={cn(
      "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="container mx-auto px-4 py-6">
        {/* Header Content */}
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              <Badge variant="outline" className="capitalize">
                {getDynamicText(`workspace.types.${workspaceType}`)}
              </Badge>
              {userRole && (
                <Badge variant="secondary" className="text-xs">
                  {userRole}
                </Badge>
              )}
            </div>
            {description && (
              <p className="text-muted-foreground max-w-2xl">
                {description}
              </p>
            )}
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            {/* Primary Actions */}
            {actions.slice(0, 2).map((action) => (
              <Button
                key={action.id}
                variant={action.variant || 'outline'}
                size="sm"
                onClick={action.onClick}
                disabled={action.disabled}
                className="gap-2"
              >
                {action.icon && <action.icon className="h-4 w-4" />}
                {action.label}
              </Button>
            ))}

            {/* More Actions Dropdown */}
            {actions.length > 2 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isRTL ? "start" : "end"}>
                  {actions.slice(2).map((action) => (
                    <DropdownMenuItem
                      key={action.id}
                      onClick={action.onClick}
                      disabled={action.disabled}
                      className="gap-2"
                    >
                      {action.icon && <action.icon className="h-4 w-4" />}
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                  <Separator />
                  <DropdownMenuItem className="gap-2">
                    <Share2 className="h-4 w-4" />
                    {t('common.share')}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Download className="h-4 w-4" />
                    {t('common.export')}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Star className="h-4 w-4" />
                    {t('common.bookmark')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Metrics Cards */}
        {metrics.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <Card key={index} className="p-4">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {metric.label}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">
                          {metric.value}
                        </span>
                        {metric.trend && metric.trendValue && (
                          <div className={cn(
                            "flex items-center gap-1 text-xs",
                            getTrendColor(metric.trend)
                          )}>
                            {getTrendIcon(metric.trend)}
                            <span>{metric.trendValue}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {metric.icon && (
                      <div className="p-2 bg-muted rounded-lg">
                        <metric.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}