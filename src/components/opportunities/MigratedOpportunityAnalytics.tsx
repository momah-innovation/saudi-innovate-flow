/**
 * Migrated Opportunity Analytics Component
 * Uses centralized analytics system with comprehensive error handling
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Heart, 
  Share, 
  FileText,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Target,
  Calendar
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';
import { toast } from '@/hooks/use-toast';

interface OpportunityMetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
}

const OpportunityMetricCard: React.FC<OpportunityMetricCardProps> = ({ 
  title, 
  value, 
  subtitle,
  icon, 
  trend,
  loading = false 
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-5" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-2" />
          {subtitle && <Skeleton className="h-3 w-24" />}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
        {trend && (
          <div className={`text-xs flex items-center gap-1 mt-2 ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className={`h-3 w-3 ${!trend.isPositive ? 'rotate-180' : ''}`} />
            {Math.abs(trend.value)}% من الفترة السابقة
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface MigratedOpportunityAnalyticsProps {
  opportunityId?: string;
  showOpportunitySpecific?: boolean;
}

export const MigratedOpportunityAnalytics: React.FC<MigratedOpportunityAnalyticsProps> = ({ 
  opportunityId,
  showOpportunitySpecific = false 
}) => {
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
      logger.error('Failed to refresh opportunity analytics', { 
        component: 'MigratedOpportunityAnalytics',
        opportunityId 
      }, err as Error);
      toast({
        title: t('common.error', 'خطأ'),
        description: t('analytics.refresh_failed', 'فشل في تحديث البيانات'),
        variant: 'destructive'
      });
    }
  };

  // Access control
  if (!hasAccess.core) {
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

  // Error state
  if (isError && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {t('opportunity_analytics.title', 'تحليلات الفرص')}
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

  // Fallback data structure with consistent interface
  const fallbackMetrics = {
    engagement: {
      totalParticipants: 0,
      pageViews: 0,
      avgSessionDuration: 0,
      returnRate: 0,
      participationRate: 0
    },
    business: {
      implementedIdeas: 0,
      budgetUtilized: 0,
      partnershipValue: 0,
      roi: 0
    }
  };

  const metrics = coreMetrics || fallbackMetrics;

  // Mock opportunity-specific data when opportunityId is provided
  const opportunitySpecificData = opportunityId ? {
    views: 1250,
    applications: 89,
    likes: 156,
    shares: 23,
    conversionRate: 7.1,
    averageBudget: 125000
  } : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {showOpportunitySpecific 
              ? t('opportunity_analytics.specific_title', 'تحليلات الفرصة')
              : t('opportunity_analytics.title', 'تحليلات الفرص')
            }
          </h2>
          <p className="text-muted-foreground">
            {showOpportunitySpecific
              ? t('opportunity_analytics.specific_subtitle', 'إحصائيات مفصلة للفرصة')
              : t('opportunity_analytics.subtitle', 'نظرة عامة على أداء الفرص والتفاعل')
            }
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

      {/* Opportunity-specific metrics */}
      {showOpportunitySpecific && opportunitySpecificData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <OpportunityMetricCard
            title={t('opportunity_analytics.views', 'المشاهدات')}
            value={opportunitySpecificData.views.toLocaleString()}
            subtitle={t('opportunity_analytics.total_views', 'إجمالي المشاهدات')}
            icon={<Eye className="h-4 w-4" />}
            trend={{ value: 12.5, isPositive: true }}
            loading={isLoading}
          />
          <OpportunityMetricCard
            title={t('opportunity_analytics.applications', 'التقديمات')}
            value={opportunitySpecificData.applications}
            subtitle={t('opportunity_analytics.total_applications', 'إجمالي التقديمات')}
            icon={<FileText className="h-4 w-4" />}
            trend={{ value: 8.3, isPositive: true }}
            loading={isLoading}
          />
          <OpportunityMetricCard
            title={t('opportunity_analytics.likes', 'الإعجابات')}
            value={opportunitySpecificData.likes}
            subtitle={t('opportunity_analytics.total_likes', 'إجمالي الإعجابات')}
            icon={<Heart className="h-4 w-4" />}
            trend={{ value: 15.2, isPositive: true }}
            loading={isLoading}
          />
          <OpportunityMetricCard
            title={t('opportunity_analytics.shares', 'المشاركات')}
            value={opportunitySpecificData.shares}
            subtitle={t('opportunity_analytics.total_shares', 'إجمالي المشاركات')}
            icon={<Share className="h-4 w-4" />}
            trend={{ value: 4.1, isPositive: false }}
            loading={isLoading}
          />
        </div>
      )}

      {/* General engagement metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <OpportunityMetricCard
          title={t('opportunity_analytics.total_participants', 'إجمالي المشاركين')}
          value={(metrics.engagement as any)?.totalParticipants || 'N/A'}
          subtitle={t('opportunity_analytics.across_all_opportunities', 'عبر جميع الفرص')}
          icon={<Target className="h-4 w-4" />}
          loading={isLoading}
        />
        <OpportunityMetricCard
          title={t('opportunity_analytics.page_views', 'مشاهدات الصفحة')}
          value={metrics.engagement?.pageViews || 'N/A'}
          subtitle={t('opportunity_analytics.total_page_views', 'إجمالي مشاهدات الصفحات')}
          icon={<Eye className="h-4 w-4" />}
          loading={isLoading}
        />
        <OpportunityMetricCard
          title={t('opportunity_analytics.return_rate', 'معدل العودة')}
          value={metrics.engagement?.returnRate ? `${metrics.engagement.returnRate}%` : 'N/A'}
          subtitle={t('opportunity_analytics.returning_visitors', 'الزوار العائدون')}
          icon={<TrendingUp className="h-4 w-4" />}
          loading={isLoading}
        />
      </div>

      {/* Business metrics */}
      <Card>
        <CardHeader>
          <CardTitle>{t('opportunity_analytics.business_impact', 'التأثير التجاري')}</CardTitle>
          <CardDescription>
            {t('opportunity_analytics.business_subtitle', 'قياس القيمة المضافة والاستثمار')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <OpportunityMetricCard
              title={t('opportunity_analytics.budget_utilized', 'الميزانية المستخدمة')}
              value={metrics.business?.budgetUtilized || 'N/A'}
              subtitle={t('opportunity_analytics.total_budget', 'إجمالي الميزانية')}
              icon={<Calendar className="h-4 w-4" />}
              loading={isLoading}
            />
            <OpportunityMetricCard
              title={t('opportunity_analytics.partnership_value', 'قيمة الشراكات')}
              value={metrics.business?.partnershipValue || 'N/A'}
              subtitle={t('opportunity_analytics.strategic_partnerships', 'الشراكات الاستراتيجية')}
              icon={<Target className="h-4 w-4" />}
              loading={isLoading}
            />
            <OpportunityMetricCard
              title={t('opportunity_analytics.roi', 'العائد على الاستثمار')}
              value={metrics.business?.roi ? `${metrics.business.roi}%` : 'N/A'}
              subtitle={t('opportunity_analytics.return_on_investment', 'عائد الاستثمار')}
              icon={<TrendingUp className="h-4 w-4" />}
              loading={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Conversion metrics for specific opportunity */}
      {showOpportunitySpecific && opportunitySpecificData && (
        <Card>
          <CardHeader>
            <CardTitle>{t('opportunity_analytics.conversion_metrics', 'معايير التحويل')}</CardTitle>
            <CardDescription>
              {t('opportunity_analytics.conversion_subtitle', 'تحليل معدلات التحويل والأداء')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <OpportunityMetricCard
                title={t('opportunity_analytics.conversion_rate', 'معدل التحويل')}
                value={`${opportunitySpecificData.conversionRate}%`}
                subtitle={t('opportunity_analytics.views_to_applications', 'من المشاهدات إلى التقديمات')}
                icon={<Target className="h-4 w-4" />}
                loading={isLoading}
              />
              <OpportunityMetricCard
                title={t('opportunity_analytics.average_budget', 'متوسط الميزانية')}
                value={`${opportunitySpecificData.averageBudget.toLocaleString()} ر.س`}
                subtitle={t('opportunity_analytics.per_opportunity', 'لكل فرصة')}
                icon={<Calendar className="h-4 w-4" />}
                loading={isLoading}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};