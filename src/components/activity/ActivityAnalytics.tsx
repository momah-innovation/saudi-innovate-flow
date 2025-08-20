import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { ActivityEvent } from '@/types/activity';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Activity, Clock, AlertTriangle } from 'lucide-react';

interface ActivityAnalyticsProps {
  activities: ActivityEvent[];
  className?: string;
}

export function ActivityAnalytics({ activities, className }: ActivityAnalyticsProps) {
  const { t, formatNumber } = useUnifiedTranslation();

  // Process data for charts
  const analyticsData = React.useMemo(() => {
    // Daily activity trend (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const dailyActivities = last7Days.map(date => {
      const count = activities.filter(activity => 
        activity.created_at.startsWith(date)
      ).length;
      return {
        date: new Date(date).toLocaleDateString('en', { 
          month: 'short', 
          day: 'numeric' 
        }),
        activities: count
      };
    });

    // Activity types distribution
    const actionTypeCounts = activities.reduce((acc, activity) => {
      acc[activity.action_type] = (acc[activity.action_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const actionTypeData = Object.entries(actionTypeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([type, count]) => ({
        type: t(`activity.actions.${type}`, type),
        count,
        percentage: ((count / activities.length) * 100).toFixed(1)
      }));

    // Entity types distribution
    const entityTypeCounts = activities.reduce((acc, activity) => {
      acc[activity.entity_type] = (acc[activity.entity_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const entityTypeData = Object.entries(entityTypeCounts)
      .map(([type, count], index) => ({
        name: t(`activity.entities.${type}`, type),
        value: count,
        percentage: ((count / activities.length) * 100).toFixed(1),
        color: `hsl(${(index * 45) % 360}, 65%, 55%)`
      }));

    // Privacy level distribution
    const privacyLevelCounts = activities.reduce((acc, activity) => {
      acc[activity.privacy_level] = (acc[activity.privacy_level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const privacyData = Object.entries(privacyLevelCounts)
      .map(([level, count]) => ({
        level: t(`activity.privacy.${level}`, level),
        count,
        percentage: ((count / activities.length) * 100).toFixed(1)
      }));

    // Hourly distribution
    const hourlyData = Array.from({ length: 24 }, (_, hour) => {
      const count = activities.filter(activity => {
        const activityHour = new Date(activity.created_at).getHours();
        return activityHour === hour;
      }).length;
      return {
        hour: `${hour}:00`,
        activities: count
      };
    });

    return {
      dailyActivities,
      actionTypeData,
      entityTypeData,
      privacyData,
      hourlyData,
      totalActivities: activities.length,
      uniqueUsers: new Set(activities.map(a => a.actor_id)).size,
      criticalActivities: activities.filter(a => a.severity === 'critical' || a.severity === 'error').length
    };
  }, [activities, t]);

  const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--success))',
    'hsl(var(--warning))',
    'hsl(var(--info))',
    'hsl(var(--destructive))',
    'hsl(var(--secondary))',
    'hsl(var(--accent))',
    'hsl(var(--muted))'
  ];

  return (
    <div className={className}>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Activities</p>
                    <p className="text-2xl font-bold">{formatNumber(analyticsData.totalActivities)}</p>
                  </div>
                  <Activity className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold">{formatNumber(analyticsData.uniqueUsers)}</p>
                  </div>
                  <Users className="w-8 h-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Critical Events</p>
                    <p className="text-2xl font-bold text-destructive">
                      {formatNumber(analyticsData.criticalActivities)}
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Daily Activity Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.dailyActivities}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="activities" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Hourly Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="activities" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Activity Types</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.actionTypeData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="type" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--success))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Entity Types</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.entityTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} (${percentage}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.entityTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy Levels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analyticsData.privacyData.map((item, index) => (
                  <div key={item.level} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm">{item.level}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{item.count}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Most Active Time</h4>
                  <p className="text-sm text-muted-foreground">
                    Peak activity occurs at{' '}
                    <Badge variant="outline">
                      {analyticsData.hourlyData.reduce((max, hour) => 
                        hour.activities > max.activities ? hour : max
                      ).hour}
                    </Badge>
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Top Activity Type</h4>
                  <p className="text-sm text-muted-foreground">
                    Most common activity:{' '}
                    <Badge variant="outline">
                      {analyticsData.actionTypeData[0]?.type || 'N/A'}
                    </Badge>
                    {analyticsData.actionTypeData[0] && (
                      <span className="ml-2 text-xs">
                        ({analyticsData.actionTypeData[0].percentage}%)
                      </span>
                    )}
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Engagement Rate</h4>
                  <p className="text-sm text-muted-foreground">
                    Average activities per user:{' '}
                    <Badge variant="outline">
                      {(analyticsData.totalActivities / Math.max(analyticsData.uniqueUsers, 1)).toFixed(1)}
                    </Badge>
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">System Health</h4>
                  <p className="text-sm text-muted-foreground">
                    Critical events ratio:{' '}
                    <Badge variant={analyticsData.criticalActivities > 0 ? "destructive" : "success"}>
                      {((analyticsData.criticalActivities / Math.max(analyticsData.totalActivities, 1)) * 100).toFixed(1)}%
                    </Badge>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}