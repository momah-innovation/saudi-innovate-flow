/**
 * Migrated Challenge Analytics Component
 * Uses centralized analytics system with RBAC, error handling, and fallbacks
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  Target, 
  Award,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  Activity
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';
import { toast } from '@/hooks/use-toast';

interface MetricCardProps {
  title: string;
  value: number | string;
  trend?: 'up' | 'down' | 'stable';
  change?: number;
  icon: React.ReactNode;
  loading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  trend, 
  change, 
  icon, 
  loading = false 
}) => {
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && change !== undefined && (
          <p className={`text-xs ${getTrendColor(trend)} flex items-center gap-1`}>
            <span>{getTrendIcon(trend)}</span>
            {Math.abs(change)}% from last period
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export const MigratedChallengeAnalytics: React.FC = () => {
  const { t } = useUnifiedTranslation();
  const { 
    coreMetrics, 
    isLoading, 
    isError, 
    error, 
    refresh, 
    isRefreshing,
    hasAccess 
  } = useAnalytics({
    filters: { timeframe: '30d' },
    includeRoleSpecific: true,
    autoRefresh: true
  });

  const handleRefresh = async () => {
    try {
      await refresh();
      toast({
        title: t('common.success', 'نجح'),
        description: t('analytics.refresh_success', 'تم تحديث البيانات بنجاح'),
      });
    } catch (err) {
      logger.error('Failed to refresh analytics', { component: 'MigratedChallengeAnalytics' }, err as Error);
      toast({
        title: t('common.error', 'خطأ'),
        description: t('analytics.refresh_failed', 'فشل في تحديث البيانات'),
        variant: 'destructive'
      });
    }
  };

  // Access control check
  if (!hasAccess.analytics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {t('analytics.access_denied', 'ليس لديك صلاحية للوصول إلى التحليلات')}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Error state with fallback
  if (isError && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {t('challenge_analytics.title', 'تحليلات التحديات')}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error || t('analytics.load_failed', 'فشل في تحميل البيانات')}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Fallback data when metrics are not available
  const fallbackMetrics = {
    challenges: { total: 0, active: 0, completed: 0, submissions: 0, completionRate: 0 },
    users: { total: 0, active: 0, growthRate: 0, trend: 'stable' as const },
    engagement: { totalParticipants: 0, participationRate: 0, avgSessionDuration: 0, pageViews: 0, returnRate: 0 },
    business: { implementedIdeas: 0, roi: 0 }
  };

  const metrics = coreMetrics || fallbackMetrics;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {t('challenge_analytics.title', 'تحليلات التحديات')}
          </h2>
          <p className="text-muted-foreground">
            {t('challenge_analytics.subtitle', 'نظرة عامة على أداء التحديات والمشاركة')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={coreMetrics ? 'default' : 'secondary'}>
            {coreMetrics ? t('analytics.live_data', 'بيانات مباشرة') : t('analytics.fallback_data', 'بيانات احتياطية')}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {t('common.refresh', 'تحديث')}
          </Button>
        </div>
      </div>

      {/* Challenge Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title={t('challenge_analytics.total_challenges', 'إجمالي التحديات')}
          value={metrics.challenges?.total || 'N/A'}
          icon={<Target className="h-4 w-4 text-muted-foreground" />}
          loading={isLoading}
        />
        <MetricCard
          title={t('challenge_analytics.active_challenges', 'التحديات النشطة')}
          value={metrics.challenges?.active || 'N/A'}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          loading={isLoading}
        />
        <MetricCard
          title={t('challenge_analytics.total_submissions', 'إجمالي المشاركات')}
          value={metrics.challenges?.submissions || 'N/A'}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          loading={isLoading}
        />
        <MetricCard
          title={t('challenge_analytics.completion_rate', 'معدل الإنجاز')}
          value={metrics.challenges?.completionRate ? `${metrics.challenges.completionRate}%` : 'N/A'}
          icon={<Award className="h-4 w-4 text-muted-foreground" />}
          loading={isLoading}
        />
      </div>

      {/* User Engagement */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title={t('challenge_analytics.total_participants', 'إجمالي المشاركين')}
          value={(metrics.engagement as any)?.totalParticipants || 'N/A'}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          loading={isLoading}
        />
        <MetricCard
          title={t('challenge_analytics.participation_rate', 'معدل المشاركة')}
          value={(metrics.engagement as any)?.participationRate ? `${(metrics.engagement as any).participationRate}%` : 'N/A'}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          loading={isLoading}
        />
        <MetricCard
          title={t('challenge_analytics.user_growth', 'نمو المستخدمين')}
          value={(metrics.users as any)?.growthRate ? `${(metrics.users as any).growthRate}%` : 'N/A'}
          trend={(metrics.users as any)?.trend}
          change={(metrics.users as any)?.growthRate}
          icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
          loading={isLoading}
        />
      </div>

      {/* Business Impact */}
      <Card>
        <CardHeader>
          <CardTitle>{t('challenge_analytics.business_impact', 'التأثير التجاري')}</CardTitle>
          <CardDescription>
            {t('challenge_analytics.business_subtitle', 'قياس الأثر والقيمة المضافة')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              title={t('challenge_analytics.implemented_ideas', 'الأفكار المنفذة')}
              value={metrics.business?.implementedIdeas || 'N/A'}
              icon={<Award className="h-4 w-4 text-muted-foreground" />}
              loading={isLoading}
            />
            <MetricCard
              title={t('challenge_analytics.roi', 'العائد على الاستثمار')}
              value={metrics.business?.roi ? `${metrics.business.roi}%` : 'N/A'}
              icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
              loading={isLoading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};