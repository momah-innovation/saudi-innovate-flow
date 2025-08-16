import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/metric-card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
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
// OPTIMIZED: Interface updated for optimized stats
interface OptimizedAdminMetrics {
  totalUsers: number;
  activeUsers: number;
  totalChallenges: number;
  activeChallenges: number;
  totalIdeas: number;
  implementedIdeas: number;
  systemUptime: number;
  securityScore: number;
}

interface AdminMetricsCardsProps {
  metrics: OptimizedAdminMetrics | null;
  isLoading: boolean;
  language: string;
}

export const AdminMetricsCards = React.memo(function AdminMetricsCards({ metrics, isLoading, language }: AdminMetricsCardsProps) {
  const { t } = useUnifiedTranslation();
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users'}
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {metrics?.totalUsers?.toLocaleString() || '0'}
          </div>
          <div className="flex items-center gap-1 text-xs text-success mt-2">
            <TrendingUp className="w-4 h-4" />
            <span>{metrics?.activeUsers || 0} {language === 'ar' ? 'نشط' : 'active'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Challenges Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {language === 'ar' ? 'التحديات النشطة' : 'Active Challenges'}
          </CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-info">
            {metrics?.activeChallenges || 0}
          </div>
          <div className="flex items-center gap-1 text-xs text-success mt-2">
            <TrendingUp className="w-4 h-4" />
            <span>{metrics?.totalChallenges || 0} {language === 'ar' ? 'إجمالي' : 'total'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Ideas Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {language === 'ar' ? 'الأفكار المقدمة' : 'Submitted Ideas'}
          </CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">
            {metrics?.totalIdeas || 0}
          </div>
          <div className="flex items-center gap-1 text-xs text-success mt-2">
            <TrendingUp className="w-4 h-4" />
            <span>{metrics?.implementedIdeas || 0} {language === 'ar' ? 'منفذة' : 'implemented'}</span>
          </div>
        </CardContent>
      </Card>

      {/* System Health Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('dashboard.metrics.system_health')}
          </CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round(metrics?.systemUptime || 99)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {t('dashboard.metrics.uptime')}
          </p>
          <Progress 
            value={metrics?.systemUptime || 99} 
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
              {metrics?.securityScore || 98}
            </div>
            <Badge variant="default">
              low
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            0 {language === 'ar' ? 'حادثة' : 'incidents'}
          </p>
        </CardContent>
      </Card>

      {/* Activity Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {language === 'ar' ? 'النشاط اليومي' : 'Daily Activity'}
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics?.totalIdeas || 0}
          </div>
          <div className="flex items-center gap-1 text-xs text-success mt-2">
            <TrendingUp className="w-4 h-4" />
            <span>{metrics?.activeUsers || 0} {language === 'ar' ? 'مستخدم نشط' : 'active users'}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});