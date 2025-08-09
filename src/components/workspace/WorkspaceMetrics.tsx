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
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'error':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && (
          <div className={cn("p-2 rounded-lg", getStatusColor())}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{value}</div>
            {trend && (
              <div className="flex items-center gap-1">
                {getTrendIcon()}
                <span className={cn(
                  "text-sm font-medium",
                  trend.direction === 'up' ? 'text-green-600' :
                  trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                )}>
                  {trend.value > 0 && trend.direction !== 'neutral' && '+'}
                  {trend.value}%
                </span>
              </div>
            )}
          </div>
          
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          
          {progress && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>{progress.label || 'Progress'}</span>
                <span>{progress.value}/{progress.max}</span>
              </div>
              <Progress 
                value={(progress.value / progress.max) * 100} 
                className="h-2"
              />
            </div>
          )}
          
          {trend?.label && (
            <Badge variant="outline" className="text-xs">
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