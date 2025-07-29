import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, MoreHorizontal, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  description?: string;
  onClick?: () => void;
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  icon, 
  description, 
  onClick,
  className,
  trend,
  loading = false
}: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getTrendIcon = () => {
    if (trend === 'up' || (change && change > 0)) {
      return <TrendingUp className="w-3 h-3" />;
    }
    if (trend === 'down' || (change && change < 0)) {
      return <TrendingDown className="w-3 h-3" />;
    }
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'up' || (change && change > 0)) {
      return 'text-green-600 bg-green-50';
    }
    if (trend === 'down' || (change && change < 0)) {
      return 'text-red-600 bg-red-50';
    }
    return 'text-muted-foreground bg-muted';
  };

  if (loading) {
    return (
      <Card className={cn("hover-scale transition-all duration-200", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="h-4 bg-muted animate-pulse rounded w-20"></div>
          </CardTitle>
          {icon && <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>}
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-muted animate-pulse rounded w-16 mb-2"></div>
          <div className="h-3 bg-muted animate-pulse rounded w-24"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "hover-scale transition-all duration-200 cursor-pointer group",
        "hover:shadow-lg hover:shadow-primary/5",
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          {icon && <div className="text-muted-foreground group-hover:text-primary transition-colors">{icon}</div>}
          {onClick && isHovered && (
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Eye className="w-3 h-3" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold animate-fade-in">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
          
          {(change !== undefined || trend) && (
            <Badge variant="outline" className={cn("gap-1", getTrendColor())}>
              {getTrendIcon()}
              {change !== undefined && (
                <span className="text-xs font-medium">
                  {change > 0 ? '+' : ''}{change}%
                </span>
              )}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}