import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Clock,
  Target,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
    period?: string;
  };
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function StatCard({ title, value, change, icon: Icon = BarChart3, className }: StatCardProps) {
  const getChangeIcon = () => {
    if (!change) return null;
    
    switch (change.type) {
      case 'increase':
        return <ArrowUpRight className="w-3 h-3" />;
      case 'decrease':
        return <ArrowDownRight className="w-3 h-3" />;
      default:
        return <Minus className="w-3 h-3" />;
    }
  };

  const getChangeColor = () => {
    if (!change) return '';
    
    switch (change.type) {
      case 'increase':
        return 'text-success';
      case 'decrease':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className={cn("hover-lift transition-all duration-200", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className={cn("flex items-center text-xs mt-1", getChangeColor())}>
            {getChangeIcon()}
            <span className="ml-1">
              {Math.abs(change.value)}% {change.period && `from ${change.period}`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Pre-built stat card variants
export function UserStatsCard({ userCount, activeUsers, newUsers }: {
  userCount: number;
  activeUsers: number;
  newUsers: number;
}) {
  return (
    <Card className="hover-lift">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          User Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{userCount}</div>
            <div className="text-xs text-muted-foreground">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{activeUsers}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-info">{newUsers}</div>
            <div className="text-xs text-muted-foreground">New</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProgressCard({ 
  title, 
  current, 
  target, 
  unit = '',
  color = 'primary'
}: {
  title: string;
  current: number;
  target: number;
  unit?: string;
  color?: 'primary' | 'success' | 'warning' | 'info';
}) {
  const percentage = Math.min((current / target) * 100, 100);
  
  const colorClasses = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    info: 'bg-info'
  };

  return (
    <Card className="hover-lift">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="text-sm font-medium">{title}</span>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold">
            {current}{unit}
          </div>
          <div className="text-sm text-muted-foreground">
            of {target}{unit}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={cn("h-2 rounded-full transition-all duration-500", colorClasses[color])}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{percentage.toFixed(1)}% complete</span>
            <span>{target - current}{unit} remaining</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ActivityCard({ 
  activities 
}: { 
  activities: { label: string; value: number; color: string }[];
}) {
  const total = activities.reduce((sum, activity) => sum + activity.value, 0);

  return (
    <Card className="hover-lift">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity, index) => {
          const percentage = total > 0 ? (activity.value / total) * 100 : 0;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{activity.label}</span>
                <span className="text-sm text-muted-foreground">{activity.value}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div 
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: activity.color
                  }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function AchievementCard({ 
  achievements 
}: { 
  achievements: { title: string; description: string; earned: boolean; date?: Date }[];
}) {
  return (
    <Card className="hover-lift">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {achievements.map((achievement, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              achievement.earned ? "bg-primary" : "bg-muted"
            )}>
              <Award className={cn(
                "w-4 h-4",
                achievement.earned ? "text-primary-foreground" : "text-muted-foreground"
              )} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-sm font-medium",
                  !achievement.earned && "text-muted-foreground"
                )}>
                  {achievement.title}
                </span>
                {achievement.earned && (
                  <Badge variant="secondary" className="text-xs">
                    Earned
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {achievement.description}
              </p>
              {achievement.earned && achievement.date && (
                <p className="text-xs text-muted-foreground">
                  {achievement.date.toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}