import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  badge?: {
    label: string;
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  };
  className?: string;
}

export const MetricsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  badge,
  className = '' 
}: MetricsCardProps) => {
  const { isRTL } = useDirection();

  return (
    <Card className={`hover:shadow-md transition-shadow duration-200 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {badge && (
              <Badge variant={badge.variant || 'secondary'} className="text-xs">
                {badge.label}
              </Badge>
            )}
            
            {trend && (
              <div className="flex items-center gap-1">
                {trend.isPositive ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span 
                  className={`text-xs font-medium ${
                    trend.isPositive ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};