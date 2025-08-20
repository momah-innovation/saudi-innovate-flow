
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Activity, ArrowRight } from 'lucide-react';
import type { ActivityEvent } from '@/types/activity';

interface DashboardRecentActivityProps {
  activities: ActivityEvent[];
  isLoading?: boolean;
  onViewAll?: () => void;
}

export const DashboardRecentActivity: React.FC<DashboardRecentActivityProps> = ({
  activities,
  isLoading = false,
  onViewAll
}) => {
  const { t } = useUnifiedTranslation();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-4 p-3 rounded-lg border">
                  <div className="h-5 w-5 bg-muted rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, 5).map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <Activity className="h-5 w-5 text-blue-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {activity.action_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(activity.created_at).toLocaleString()}
                </p>
              </div>
              <Badge 
                variant="outline" 
                className={`${
                  activity.severity === 'critical' ? 'border-red-200 text-red-700' :
                  activity.severity === 'warning' ? 'border-yellow-200 text-yellow-700' :
                  activity.severity === 'error' ? 'border-red-200 text-red-700' :
                  'border-green-200 text-green-700'
                }`}
              >
                {activity.severity}
              </Badge>
            </div>
          ))}
          
          {activities.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No recent activities to display.
            </div>
          )}
          
          {activities.length > 0 && onViewAll && (
            <Button 
              variant="outline" 
              className="w-full mt-4" 
              onClick={onViewAll}
            >
              View All Activity
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
