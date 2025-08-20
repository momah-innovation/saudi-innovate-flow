import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { ActivityEvent } from '@/types/activity';
import { TrendingUp, TrendingDown, Activity, Users, AlertCircle, Clock } from 'lucide-react';

interface ActivityMetrics {
  totalActivities: number;
  todayActivities: number;
  uniqueUsers: number;
  mostActiveUser?: string;
  topActionType?: string;
  criticalActivities: number;
  averageActivitiesPerDay: number;
  growthRate?: number;
}

interface ActivityMetricsProps {
  activities: ActivityEvent[];
  className?: string;
}

export function ActivityMetrics({ activities, className }: ActivityMetricsProps) {
  const { t, formatNumber } = useUnifiedTranslation();

  // Calculate metrics from activities
  const metrics = React.useMemo((): ActivityMetrics => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Basic counts
    const totalActivities = activities.length;
    const todayActivities = activities.filter(a => 
      new Date(a.created_at) >= today
    ).length;
    const yesterdayActivities = activities.filter(a => {
      const date = new Date(a.created_at);
      return date >= yesterday && date < today;
    }).length;

    // Unique users
    const uniqueUsers = new Set(activities.map(a => a.actor_id)).size;

    // Most active user
    const userActivityCount = activities.reduce((acc, activity) => {
      acc[activity.actor_id] = (acc[activity.actor_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostActiveUserId = Object.entries(userActivityCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0];

    // Top action type
    const actionTypeCount = activities.reduce((acc, activity) => {
      acc[activity.action_type] = (acc[activity.action_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topActionType = Object.entries(actionTypeCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0];

    // Critical activities (error/critical severity)
    const criticalActivities = activities.filter(a => 
      a.severity === 'error' || a.severity === 'critical'
    ).length;

    // Growth rate calculation
    const growthRate = yesterdayActivities > 0 
      ? ((todayActivities - yesterdayActivities) / yesterdayActivities) * 100
      : todayActivities > 0 ? 100 : 0;

    // Average activities per day (last 7 days)
    const weekActivities = activities.filter(a => 
      new Date(a.created_at) >= weekAgo
    ).length;
    const averageActivitiesPerDay = weekActivities / 7;

    return {
      totalActivities,
      todayActivities,
      uniqueUsers,
      mostActiveUser: mostActiveUserId,
      topActionType,
      criticalActivities,
      averageActivitiesPerDay,
      growthRate
    };
  }, [activities]);

  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    trendValue,
    variant = 'default' 
  }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: number;
    variant?: 'default' | 'success' | 'warning' | 'danger';
  }) => (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">
              {title}
            </p>
            <p className="text-2xl font-bold">
              {typeof value === 'number' ? formatNumber(value) : value}
            </p>
            {trend && trendValue !== undefined && (
              <div className={`flex items-center text-xs ${
                trend === 'up' ? 'text-success' : 
                trend === 'down' ? 'text-destructive' : 
                'text-muted-foreground'
              }`}>
                {trend === 'up' ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : trend === 'down' ? (
                  <TrendingDown className="w-3 h-3 mr-1" />
                ) : null}
                {Math.abs(trendValue).toFixed(1)}%
              </div>
            )}
          </div>
          <div className={`p-2 rounded-lg ${
            variant === 'success' ? 'bg-success-light text-success' :
            variant === 'warning' ? 'bg-warning-light text-warning' :
            variant === 'danger' ? 'bg-destructive-light text-destructive' :
            'bg-primary-light text-primary'
          }`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      <MetricCard
        title="Total Activities"
        value={metrics.totalActivities}
        icon={Activity}
        variant="default"
      />
      
      <MetricCard
        title="Today's Activities"
        value={metrics.todayActivities}
        icon={Clock}
        trend={metrics.growthRate > 0 ? 'up' : metrics.growthRate < 0 ? 'down' : 'neutral'}
        trendValue={metrics.growthRate}
        variant="success"
      />
      
      <MetricCard
        title="Active Users"
        value={metrics.uniqueUsers}
        icon={Users}
        variant="default"
      />
      
      <MetricCard
        title="Critical Events"
        value={metrics.criticalActivities}
        icon={AlertCircle}
        variant={metrics.criticalActivities > 0 ? "danger" : "success"}
      />

      {/* Additional insights */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Activity Insights</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Daily Average</span>
              <Badge variant="secondary">
                {formatNumber(Math.round(metrics.averageActivitiesPerDay))} activities
              </Badge>
            </div>
            
            {metrics.topActionType && (
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">Top Action</span>
                <Badge variant="outline">
                  {t(`activity.actions.${metrics.topActionType}`, metrics.topActionType)}
                </Badge>
              </div>
            )}
            
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Growth Rate</span>
              <Badge variant={metrics.growthRate >= 0 ? "success" : "warning"}>
                {metrics.growthRate >= 0 ? '+' : ''}{metrics.growthRate.toFixed(1)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}