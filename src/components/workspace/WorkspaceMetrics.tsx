import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number | string;
  description?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  progress?: {
    value: number;
    max: number;
    label?: string;
  };
  status?: 'success' | 'warning' | 'error' | 'info';
  icon?: React.ComponentType<{ className?: string }>;
}

export function MetricCard({
  title,
  value,
  description,
  trend,
  progress,
  status,
  icon: Icon
}: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trend?.direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-success bg-success/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      case 'error':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-primary bg-primary/10';
    }
  };

  return (
    <Card className="gradient-border hover-scale group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">{title}</CardTitle>
        {Icon && (
          <div className={cn("p-2 rounded-xl transition-all duration-300 group-hover:scale-110", getStatusColor())}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">{value}</div>
            {trend && (
              <div className="flex items-center gap-1">
                {getTrendIcon()}
                <span className={cn(
                  "text-sm font-medium",
                  trend.direction === 'up' ? 'text-success' :
                  trend.direction === 'down' ? 'text-destructive' : 'text-muted-foreground'
                )}>
                  {trend.value > 0 && trend.direction !== 'neutral' && '+'}
                  {trend.value}%
                </span>
              </div>
            )}
          </div>
          
          {description && (
            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
          )}
          
          {progress && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{progress.label || 'Progress'}</span>
                <span className="font-medium">{progress.value}/{progress.max}</span>
              </div>
              <Progress 
                value={(progress.value / progress.max) * 100} 
                className="h-2"
              />
            </div>
          )}
          
          {trend?.label && (
            <Badge variant="outline" className="text-xs gradient-border">
              {trend.label}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface WorkspaceMetricsProps {
  metrics: MetricCardProps[];
  className?: string;
}

export function WorkspaceMetrics({ metrics, className }: WorkspaceMetricsProps) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}