/**
 * MIGRATED ANALYTICS DASHBOARD
 * Uses centralized analytics system with RBAC and comprehensive error handling
 */

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Lightbulb, 
  Calendar, 
  Handshake,
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Shield,
  Database
} from 'lucide-react';
import { useAppAnalytics } from '@/contexts/AnalyticsContext';
import { BasicAnalyticsWrapper } from '@/components/analytics/ProtectedAnalyticsWrapper';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';

interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
  loading?: boolean;
  error?: boolean;
  fallbackValue?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  trend = 'stable', 
  icon: Icon, 
  loading = false, 
  error = false,
  fallbackValue = 'N/A'
}) => {
  const displayValue = error ? fallbackValue : (loading ? '...' : value);
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground';
  
  return (
    <Card className={error ? 'border-destructive/50' : ''}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${error ? 'text-destructive' : 'text-muted-foreground'}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{displayValue}</div>
        {change !== undefined && !error && (
          <p className={`text-xs ${trendColor}`}>
            {change > 0 ? '+' : ''}{change}% from last period
          </p>
        )}
        {error && (
          <p className="text-xs text-destructive">
            Data temporarily unavailable
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export function MigratedAnalyticsDashboard() {
  const { t, formatNumber } = useUnifiedTranslation();
  const analyticsContext = useAppAnalytics();
  
  // Extract analytics data with proper error handling
  const coreMetrics = (analyticsContext as any).coreMetrics || null;
  const isLoading = (analyticsContext as any).isLoading || false;
  const isError = (analyticsContext as any).isError || false;
  const error = (analyticsContext as any).error || null;
  const refresh = (analyticsContext as any).refresh || (() => Promise.resolve());
  const isRefreshing = (analyticsContext as any).isRefreshing || false;
  const lastUpdated = (analyticsContext as any).lastUpdated || null;

  // Memoized calculations with error handling
  const analyticsMetrics = useMemo(() => {
    if (!coreMetrics || isError) {
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalChallenges: 0,
        activeChallenges: 0,
        totalSubmissions: 0,
        implementedIdeas: 0,
        engagementRate: 0,
        completionRate: 0,
        hasError: isError,
        errorMessage: error
      };
    }

    try {
      const users = coreMetrics.users || {};
      const challenges = coreMetrics.challenges || {};
      const business = coreMetrics.business || {};
      const engagement = coreMetrics.engagement || {};

      return {
        totalUsers: users.total || 0,
        activeUsers: users.active || 0,
        totalChallenges: challenges.total || 0,
        activeChallenges: challenges.active || 0,
        totalSubmissions: challenges.submissions || 0,
        implementedIdeas: business.implementedIdeas || 0,
        engagementRate: engagement.participationRate || 0,
        completionRate: challenges.completionRate || 0,
        hasError: false,
        errorMessage: null
      };
    } catch (calculationError) {
      logger.error('Error calculating analytics metrics', { 
        component: 'MigratedAnalyticsDashboard',
        error: calculationError 
      });
      
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalChallenges: 0,
        activeChallenges: 0,
        totalSubmissions: 0,
        implementedIdeas: 0,
        engagementRate: 0,
        completionRate: 0,
        hasError: true,
        errorMessage: 'Calculation error occurred'
      };
    }
  }, [coreMetrics, isError, error]);

  const handleRefresh = async () => {
    try {
      await refresh();
      logger.info('Analytics dashboard refreshed successfully', { 
        component: 'MigratedAnalyticsDashboard' 
      });
    } catch (refreshError) {
      logger.error('Failed to refresh analytics dashboard', { 
        component: 'MigratedAnalyticsDashboard',
        error: refreshError 
      });
    }
  };

  return (
    <BasicAnalyticsWrapper>
      <div className="space-y-6">
        {/* Header with refresh and status */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {t('analytics.dashboard.title', 'Analytics Dashboard')}
            </h2>
            <p className="text-muted-foreground">
              {t('analytics.dashboard.subtitle', 'Comprehensive platform insights with real-time data')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <Badge variant="outline" className="text-xs">
                Last updated: {new Date(lastUpdated).toLocaleTimeString()}
              </Badge>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {(isError || analyticsMetrics.hasError) && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                {analyticsMetrics.errorMessage || error || 'Unable to load analytics data'}
              </span>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Key Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title={t('analytics.metrics.totalUsers', 'Total Users')}
            value={formatNumber(analyticsMetrics.totalUsers)}
            change={coreMetrics?.users?.growthRate}
            trend={coreMetrics?.users?.trend as 'up' | 'down' | 'stable'}
            icon={Users}
            loading={isLoading}
            error={analyticsMetrics.hasError}
            fallbackValue="0"
          />
          
          <MetricCard
            title={t('analytics.metrics.activeChallenges', 'Active Challenges')}
            value={formatNumber(analyticsMetrics.activeChallenges)}
            icon={Target}
            loading={isLoading}
            error={analyticsMetrics.hasError}
            fallbackValue="0"
          />
          
          <MetricCard
            title={t('analytics.metrics.totalSubmissions', 'Total Submissions')}
            value={formatNumber(analyticsMetrics.totalSubmissions)}
            icon={Lightbulb}
            loading={isLoading}
            error={analyticsMetrics.hasError}
            fallbackValue="0"
          />
          
          <MetricCard
            title={t('analytics.metrics.implementedIdeas', 'Implemented Ideas')}
            value={formatNumber(analyticsMetrics.implementedIdeas)}
            icon={CheckCircle}
            loading={isLoading}
            error={analyticsMetrics.hasError}
            fallbackValue="0"
          />
        </div>

        {/* Performance Indicators */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {t('analytics.engagement.title', 'Platform Engagement')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{t('analytics.engagement.rate', 'Engagement Rate')}</span>
                  <span>{analyticsMetrics.engagementRate.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={analyticsMetrics.hasError ? 0 : analyticsMetrics.engagementRate} 
                  className="h-2"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{t('analytics.completion.rate', 'Completion Rate')}</span>
                  <span>{analyticsMetrics.completionRate.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={analyticsMetrics.hasError ? 0 : analyticsMetrics.completionRate} 
                  className="h-2"
                />
              </div>

              {analyticsMetrics.hasError && (
                <Alert>
                  <Database className="h-4 w-4" />
                  <AlertDescription>
                    Using fallback data. Some metrics may be incomplete.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {t('analytics.activity.title', 'Recent Activity')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t('analytics.activity.activeUsers', 'Active Users (24h)')}
                </span>
                <Badge variant="secondary">
                  {formatNumber(analyticsMetrics.activeUsers)}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t('analytics.activity.dataQuality', 'Data Quality')}
                </span>
                <Badge variant={analyticsMetrics.hasError ? "destructive" : "default"}>
                  {analyticsMetrics.hasError ? 'Fallback' : 'Live'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t('analytics.activity.systemStatus', 'System Status')}
                </span>
                <div className="flex items-center gap-1">
                  <Shield className={`h-3 w-3 ${analyticsMetrics.hasError ? 'text-yellow-500' : 'text-green-500'}`} />
                  <span className="text-xs">
                    {analyticsMetrics.hasError ? 'Degraded' : 'Operational'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Quality Indicator */}
        {coreMetrics?.metadata && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">System Information</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1">
              <div>Data Quality: {coreMetrics.metadata.data_quality || 'unknown'}</div>
              <div>User Role: {coreMetrics.metadata.user_role || 'unknown'}</div>
              <div>Timeframe: {coreMetrics.metadata.timeframe || '30d'}</div>
              {coreMetrics.metadata.error_context && coreMetrics.metadata.error_context !== 'none' && (
                <div className="text-yellow-600">
                  Context: {coreMetrics.metadata.error_context}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </BasicAnalyticsWrapper>
  );
}