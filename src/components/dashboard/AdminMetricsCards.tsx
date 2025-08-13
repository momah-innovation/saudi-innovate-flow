import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/metric-card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Target, 
  Database, 
  Shield, 
  Server, 
  Activity,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { AdminDashboardMetrics } from '@/hooks/useAdminDashboardMetrics';

interface AdminMetricsCardsProps {
  metrics: AdminDashboardMetrics | null;
  isLoading: boolean;
  language: string;
}

export function AdminMetricsCards({ metrics, isLoading, language }: AdminMetricsCardsProps) {
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Minus;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-2"></div>
              <div className="h-3 bg-muted rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Users Card */}
      <MetricCard
        title={language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users'}
        value={metrics?.users?.total.toLocaleString() || '0'}
        subtitle={`${metrics?.users?.active || 0} ${language === 'ar' ? 'نشط' : 'active'}`}
        icon={<Users className="h-4 w-4" />}
        trend={{
          value: metrics?.users?.growthRate || 0,
          label: language === 'ar' ? 'هذا الشهر' : 'this month',
          direction: (metrics?.users?.trend === 'stable' ? 'neutral' : metrics?.users?.trend) || 'neutral'
        }}
      />

      {/* Challenges Card */}
      <MetricCard
        title={language === 'ar' ? 'التحديات النشطة' : 'Active Challenges'}
        value={metrics?.challenges?.active || 0}
        subtitle={`${metrics?.challenges?.total || 0} ${language === 'ar' ? 'إجمالي' : 'total'}`}
        icon={<Target className="h-4 w-4" />}
        trend={{
          value: metrics?.challenges?.recentActivity?.newChallenges30d || 0,
          label: language === 'ar' ? 'جديدة' : 'new',
          direction: (metrics?.challenges?.trend === 'stable' ? 'neutral' : metrics?.challenges?.trend) || 'neutral'
        }}
      />

      {/* Submissions Card */}
      <MetricCard
        title={language === 'ar' ? 'المقترحات المقدمة' : 'Submissions'}
        value={metrics?.challenges?.submissions || 0}
        subtitle={`${Math.round(metrics?.challenges?.completionRate || 0)}% ${language === 'ar' ? 'معدل الإكمال' : 'completion rate'}`}
        icon={<Database className="h-4 w-4" />}
      />

      {/* System Health Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {language === 'ar' ? 'صحة النظام' : 'System Health'}
          </CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round(metrics?.system?.uptime || 99)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {language === 'ar' ? 'وقت التشغيل' : 'uptime'}
          </p>
          <Progress 
            value={metrics?.system?.uptime || 99} 
            className="mt-2" 
          />
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {language === 'ar' ? 'الأمان' : 'Security'}
          </CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              {metrics?.security?.securityScore || 98}
            </div>
            <Badge 
              variant={
                (metrics?.security?.riskLevel === 'high') ? 'destructive' :
                (metrics?.security?.riskLevel === 'medium') ? 'secondary' : 'default'
              }
            >
              {metrics?.security?.riskLevel || 'low'}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {metrics?.security?.incidents || 0} {language === 'ar' ? 'حادثة' : 'incidents'}
          </p>
        </CardContent>
      </Card>

      {/* Activity Card */}
      <MetricCard
        title={language === 'ar' ? 'النشاط اليومي' : 'Daily Activity'}
        value={metrics?.system?.activity?.events24h || 0}
        subtitle={`${metrics?.system?.activity?.activeUsers24h || 0} ${language === 'ar' ? 'مستخدم نشط' : 'active users'}`}
        icon={<Activity className="h-4 w-4" />}
      />
    </div>
  );
}