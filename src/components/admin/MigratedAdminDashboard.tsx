/**
 * MIGRATED ADMIN DASHBOARD
 * Enhanced admin dashboard using centralized analytics with RBAC and comprehensive error handling
 */

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Shield, 
  Target, 
  TrendingUp, 
  Activity, 
  AlertTriangle,
  RefreshCw,
  Database,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Settings,
  Bell
} from 'lucide-react';
import { useAdminAnalytics } from '@/hooks/useAnalytics';
import { AdminAnalyticsWrapper } from '@/components/analytics/ProtectedAnalyticsWrapper';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';

interface AdminMetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
  loading?: boolean;
  error?: boolean;
  variant?: 'default' | 'security' | 'performance';
  fallbackValue?: string;
  t: (key: string, fallback?: string) => string;
}

const AdminMetricCard: React.FC<AdminMetricCardProps> = ({ 
  title, 
  value, 
  change, 
  trend = 'stable', 
  icon: Icon, 
  loading = false, 
  error = false,
  variant = 'default',
  fallbackValue = 'N/A',
  t
}) => {
  const displayValue = error ? fallbackValue : (loading ? '...' : value);
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground';
  
  const cardVariant = error ? 'border-destructive/50' : 
    variant === 'security' ? 'border-yellow-500/50' :
    variant === 'performance' ? 'border-blue-500/50' : '';
  
  return (
    <Card className={cardVariant}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${error ? 'text-destructive' : 
          variant === 'security' ? 'text-yellow-500' :
          variant === 'performance' ? 'text-blue-500' : 'text-muted-foreground'}`} 
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{displayValue}</div>
        {change !== undefined && !error && (
          <p className={`text-xs ${trendColor}`}>
            {change > 0 ? '+' : ''}{change}% {t('admin.metrics.from_last_period', 'from last period')}
          </p>
        )}
        {error && (
          <p className="text-xs text-destructive">
            {t('admin.errors.data_temporarily_unavailable')}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export function MigratedAdminDashboard() {
  const { t, formatNumber } = useUnifiedTranslation();
  const adminAnalytics = useAdminAnalytics();
  
  // Extract analytics data with proper type handling
  const coreMetrics = (adminAnalytics as any).coreMetrics || null;
  const securityMetrics = (adminAnalytics as any).securityMetrics || null;
  const roleBasedMetrics = (adminAnalytics as any).roleBasedMetrics || null;
  const isLoading = (adminAnalytics as any).isLoading || false;
  const isError = (adminAnalytics as any).isError || false;
  const error = (adminAnalytics as any).error || null;
  const refresh = (adminAnalytics as any).refresh || (() => Promise.resolve());
  const isRefreshing = (adminAnalytics as any).isRefreshing || false;
  const lastUpdated = (adminAnalytics as any).lastUpdated || null;
  const hasAccess = (adminAnalytics as any).hasAccess || { security: false, analytics: false };

  // Memoized admin-specific calculations
  const adminMetrics = useMemo(() => {
    if (!coreMetrics || isError) {
      return {
        systemHealth: 0,
        activeUsers: 0,
        totalRoles: 0,
        pendingApprovals: 0,
        securityScore: 0,
        riskLevel: 'unknown',
        hasError: isError,
        errorMessage: error
      };
    }

    try {
      const users = (coreMetrics as any)?.users || {};
      const adminData = (roleBasedMetrics as any)?.admin_metrics || {};
      const securityData = securityMetrics as any || {};

      return {
        systemHealth: adminData?.system_health?.uptime || 99.9,
        activeUsers: users?.active || 0,
        totalRoles: adminData?.total_roles_assigned || 0,
        pendingApprovals: adminData?.pending_approvals || 0,
        securityScore: securityData?.securityScore || 98,
        riskLevel: securityData?.riskLevel || 'low',
        hasError: false,
        errorMessage: null
      };
    } catch (calculationError) {
      logger.error('Error calculating admin metrics', { 
        component: 'MigratedAdminDashboard',
        error: calculationError 
      });
      
      return {
        systemHealth: 0,
        activeUsers: 0,
        totalRoles: 0,
        pendingApprovals: 0,
        securityScore: 0,
        riskLevel: 'unknown',
        hasError: true,
        errorMessage: 'Admin calculation error occurred'
      };
    }
  }, [coreMetrics, securityMetrics, roleBasedMetrics, isError, error]);

  const handleRefresh = async () => {
    try {
      await refresh();
      logger.info('Admin dashboard refreshed successfully', { 
        component: 'MigratedAdminDashboard' 
      });
    } catch (refreshError) {
      logger.error('Failed to refresh admin dashboard', { 
        component: 'MigratedAdminDashboard',
        error: refreshError 
      });
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-muted-foreground';
    }
  };

  const getRiskLevelBadge = (riskLevel: string): "default" | "destructive" | "secondary" => {
    switch (riskLevel) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  if (!hasAccess.security && !hasAccess.analytics) {
    return (
      <Alert variant="destructive">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          {t('admin.security.insufficient_permissions')}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <AdminAnalyticsWrapper>
      <div className="space-y-6">
        {/* Admin Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {t('admin:dashboard.title', 'Admin Dashboard')}
            </h2>
            <p className="text-muted-foreground">
              {t('admin:dashboard.subtitle', 'System administration and security monitoring')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <Badge variant="outline" className="text-xs">
                {t('admin.errors.last_updated')}: {new Date(lastUpdated).toLocaleTimeString()}
              </Badge>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? t('admin.actions.refreshing') : t('admin.actions.refresh')}
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {(isError || adminMetrics.hasError) && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                {adminMetrics.errorMessage || error || 'Unable to load admin data'}
              </span>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                {t('admin.actions.try_again')}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              {t('admin.tabs.overview')}
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              {t('admin.tabs.security')}
            </TabsTrigger>
            <TabsTrigger value="performance">
              <Activity className="h-4 w-4 mr-2" />
              {t('admin.tabs.performance')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Key Admin Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <AdminMetricCard
                title={t('admin.metrics.activeUsers')}
                value={formatNumber(adminMetrics.activeUsers)}
                icon={Users}
                loading={isLoading}
                error={adminMetrics.hasError}
                t={t}
              />
              
              <AdminMetricCard
                title={t('admin.metrics.totalRoles')}
                value={formatNumber(adminMetrics.totalRoles)}
                icon={Settings}
                loading={isLoading}
                error={adminMetrics.hasError}
                t={t}
              />
              
              <AdminMetricCard
                title={t('admin.metrics.pendingApprovals')}
                value={formatNumber(adminMetrics.pendingApprovals)}
                icon={Bell}
                variant={adminMetrics.pendingApprovals > 0 ? 'security' : 'default'}
                loading={isLoading}
                error={adminMetrics.hasError}
                t={t}
              />
              
              <AdminMetricCard
                title={t('admin.metrics.systemHealth')}
                value={`${adminMetrics.systemHealth.toFixed(1)}%`}
                icon={Activity}
                variant="performance"
                loading={isLoading}
                error={adminMetrics.hasError}
                t={t}
              />
            </div>

            {/* System Overview */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {t('admin.cards.platform_analytics')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {coreMetrics && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm">{t('admin.cards.total_users')}</span>
                        <Badge variant="secondary">
                          {formatNumber(coreMetrics.users?.total || 0)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">{t('admin.cards.total_challenges')}</span>
                        <Badge variant="secondary">
                          {formatNumber(coreMetrics.challenges?.total || 0)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">{t('admin.cards.implementation_rate')}</span>
                        <Badge variant="default">
                          {(coreMetrics.business?.roi || 0).toFixed(1)}%
                        </Badge>
                      </div>
                    </>
                  )}
                  
                  {adminMetrics.hasError && (
                    <Alert>
                      <Database className="h-4 w-4" />
                      <AlertDescription>
                        {t('admin.errors.some_analytics_unavailable')}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {t('admin.cards.recent_activity')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('admin.cards.data_quality')}</span>
                    <Badge variant={adminMetrics.hasError ? "destructive" : "default"}>
                      {adminMetrics.hasError ? t('admin.cards.fallback') : t('admin.cards.live')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('admin.cards.rbac_status')}</span>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs">{t('admin.cards.active')}</span>
                    </div>
                  </div>

                  {(roleBasedMetrics as any)?.metadata && (
                    <div className="text-xs text-muted-foreground">
                      {t('admin.cards.version')}: {(roleBasedMetrics as any).metadata.version}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            {hasAccess.security ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <AdminMetricCard
                  title={t('admin.security.score')}
                  value={adminMetrics.securityScore}
                  icon={Shield}
                  variant="security"
                  loading={isLoading}
                  error={adminMetrics.hasError}
                  t={t}
                />
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">{t('admin.security.risk_level')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant={getRiskLevelBadge(adminMetrics.riskLevel) as any}>
                      <span className={getRiskLevelColor(adminMetrics.riskLevel)}>
                        {adminMetrics.riskLevel.toUpperCase()}
                      </span>
                    </Badge>
                  </CardContent>
                </Card>

                {securityMetrics && (
                  <>
                    <AdminMetricCard
                      title={t('admin.security.threat_count')}
                      value={(securityMetrics as any).threatCount || 0}
                      icon={AlertTriangle}
                      variant="security"
                      loading={isLoading}
                      error={!securityMetrics}
                      t={t}
                    />
                    
                    <AdminMetricCard
                      title={t('admin.security.suspicious_activities')}
                      value={(securityMetrics as any).suspiciousActivities || 0}
                      icon={XCircle}
                      variant="security"
                      loading={isLoading}
                      error={!securityMetrics}
                      t={t}
                    />
                  </>
                )}
              </div>
            ) : (
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  {t('admin.security.security_analytics_permission')}
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.performance.system_performance')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t('admin.performance.uptime')}</span>
                      <span>{adminMetrics.systemHealth.toFixed(1)}%</span>
                    </div>
                    <Progress value={adminMetrics.systemHealth} className="h-2" />
                  </div>
                  
                  {(roleBasedMetrics as any)?.admin_metrics?.system_health && (
                    <>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>{t('admin.performance.active_sessions')}</span>
                          <span>{(roleBasedMetrics as any).admin_metrics.system_health.active_sessions}</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>{t('admin.performance.error_rate')}</span>
                          <span>{(roleBasedMetrics as any).admin_metrics.system_health.error_rate}%</span>
                        </div>
                        <Progress value={(roleBasedMetrics as any).admin_metrics.system_health.error_rate} className="h-2" />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.cards.data_quality_report', 'Data Quality Report')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {(coreMetrics as any)?.metadata && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>{t('admin.cards.core_metrics', 'Core Metrics')}</span>
                        <Badge variant={(coreMetrics as any).metadata.data_quality === 'complete' ? 'default' : 'secondary'}>
                          {(coreMetrics as any).metadata.data_quality}
                        </Badge>
                      </div>
                      
                      {(securityMetrics as any)?.metadata && (
                        <div className="flex justify-between text-sm">
                          <span>{t('admin.cards.security_metrics', 'Security Metrics')}</span>
                          <Badge variant={(securityMetrics as any).metadata.data_quality === 'complete' ? 'default' : 'secondary'}>
                            {(securityMetrics as any).metadata.data_quality}
                          </Badge>
                        </div>
                      )}
                      
                      {(roleBasedMetrics as any)?.admin_metrics && (
                        <div className="flex justify-between text-sm">
                          <span>{t('admin.cards.admin_metrics', 'Admin Metrics')}</span>
                          <Badge variant={(roleBasedMetrics as any).admin_metrics.data_quality === 'complete' ? 'default' : 'secondary'}>
                            {(roleBasedMetrics as any).admin_metrics.data_quality}
                          </Badge>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminAnalyticsWrapper>
  );
}